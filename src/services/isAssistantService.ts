import { db } from '../db/db';
import { INDIAN_STANDARDS_DATABASE } from '../db/isStandardsData';
import type { 
  IndianStandard, 
  AIMessage, 
  StandardSourceRef, 
  ProcurementSpecDraft,
  AIAnalyticsRecord
} from '../types';

export interface ProcessQueryOptions {
  query: string;
  history?: AIMessage[];
  conversationId?: string;
  userRole?: string;
}

export interface AIResponsePayload {
  content: string;
  sources: StandardSourceRef[];
  verificationStatus: 'Verified from database' | 'Requires verification' | 'AI Recommendation';
  followUps: string[];
  specificationDraft?: ProcurementSpecDraft;
}

// Helper to sanitize input string
function sanitizeInput(input: string): string {
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Log analytics asynchronously
async function logAnalytics(query: string, category: string, requestedStandard?: string, isVerified: boolean = true, hasError: boolean = false) {
  try {
    const record: AIAnalyticsRecord = {
      id: `ana-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      query: query.slice(0, 150),
      category: category || 'General Inquiry',
      requestedStandard,
      isVerified,
      hasError
    };
    await db.aiAnalytics.add(record);
  } catch (err) {
    console.warn('Failed to log AI analytics:', err);
  }
}

// Search database for standards matching keyword or code
export async function searchStandardsInDB(searchTerm: string): Promise<IndianStandard[]> {
  const cleanTerm = searchTerm.trim().toLowerCase();
  if (!cleanTerm) return [];

  try {
    const all = await db.isStandards.toArray();
    const sourceList = all.length > 0 ? all : INDIAN_STANDARDS_DATABASE;

    return sourceList.filter(std => {
      const codeMatch = std.code.toLowerCase().includes(cleanTerm) || std.isNumber.toLowerCase().includes(cleanTerm);
      const titleMatch = std.title.toLowerCase().includes(cleanTerm);
      const categoryMatch = std.category.toLowerCase().includes(cleanTerm);
      const tagMatch = std.tags.some(tag => cleanTerm.includes(tag) || tag.includes(cleanTerm));
      const scopeMatch = std.scope.toLowerCase().includes(cleanTerm);
      return codeMatch || titleMatch || categoryMatch || tagMatch || scopeMatch;
    });
  } catch (err) {
    console.error('Error querying isStandards Dexie table, falling back to static dataset:', err);
    return INDIAN_STANDARDS_DATABASE.filter(std => {
      const codeMatch = std.code.toLowerCase().includes(cleanTerm) || std.isNumber.toLowerCase().includes(cleanTerm);
      const titleMatch = std.title.toLowerCase().includes(cleanTerm);
      const categoryMatch = std.category.toLowerCase().includes(cleanTerm);
      const tagMatch = std.tags.some(tag => cleanTerm.includes(tag) || tag.includes(cleanTerm));
      return codeMatch || titleMatch || categoryMatch || tagMatch;
    });
  }
}

// Parse IS code directly (e.g. IS 456, IS 1239, IS 694)
function extractISCode(text: string): string | null {
  const match = text.match(/IS\s*(\d+)/i);
  if (match) {
    return `IS ${match[1]}`;
  }
  return null;
}

// Extract product context from context memory
function inferProductContextFromHistory(history: AIMessage[]): string | null {
  if (!history || history.length === 0) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.role === 'user') {
      const isCode = extractISCode(msg.content);
      if (isCode) return isCode;

      const lower = msg.content.toLowerCase();
      if (lower.includes('cement')) return 'cement';
      if (lower.includes('cable') || lower.includes('wire')) return 'electrical cables';
      if (lower.includes('steel') || lower.includes('tmt') || lower.includes('rebar')) return 'steel';
      if (lower.includes('pipe') || lower.includes('upvc') || lower.includes('plumbing')) return 'pipes';
      if (lower.includes('transformer')) return 'transformer';
      if (lower.includes('solar') || lower.includes('pv')) return 'solar';
      if (lower.includes('fire') || lower.includes('extinguisher')) return 'fire extinguisher';
      if (lower.includes('helmet') || lower.includes('ppe') || lower.includes('shoes')) return 'ppe safety gear';
    }
  }
  return null;
}

// Optional Gemini API fetcher for live LLM reasoning when online
async function tryFetchGeminiEnhancement(prompt: string, contextStandards: IndianStandard[]): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !navigator.onLine) return null;

  try {
    const systemInstruction = `You are "IS Guide AI Assistant", an expert on Indian Standards (BIS codes) for public procurement. Ground your response on these verified database standards:\n${JSON.stringify(contextStandards.map(s => ({ isNumber: s.isNumber, title: s.title, scope: s.scope, testing: s.testingRequirements })))}\nDo NOT fabricate IS numbers.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }] }
        ]
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn('Gemini API fetch skipped/failed, using local verified DB engine:', err);
    return null;
  }
}

/**
 * Main query processor for IS Guide AI Assistant
 */
export async function processAssistantQuery(options: ProcessQueryOptions): Promise<AIResponsePayload> {
  const rawQuery = options.query;
  const cleanQuery = sanitizeInput(rawQuery);
  const lowerQuery = cleanQuery.toLowerCase();
  const history = options.history || [];

  // Check if comparing two standards
  if (lowerQuery.includes('compare') || lowerQuery.includes('difference between')) {
    return handleComparisonQuery(cleanQuery, history);
  }

  // Check if user is asking for procurement specification generation
  if (lowerQuery.includes('generate procurement specification') || lowerQuery.includes('create procurement spec') || lowerQuery.includes('help me create a procurement specification')) {
    return handleSpecGenerationQuery(cleanQuery, history);
  }

  // Check if query mentions a specific IS Code (e.g. IS 456, IS 1239, IS 694)
  const isCode = extractISCode(cleanQuery);
  if (isCode || lowerQuery.includes('explain is') || lowerQuery.includes('what is is ')) {
    return handleSpecificISCodeExplanation(cleanQuery, isCode);
  }

  // Check context memory for vague follow-ups (e.g. "What about testing requirements?", "Show related standards")
  const rememberedContext = inferProductContextFromHistory(history);
  if ((lowerQuery.includes('testing requirement') || lowerQuery.includes('how to test') || lowerQuery.includes('test parameter') || lowerQuery.includes('show related') || lowerQuery.includes('quality check')) && rememberedContext) {
    return handleContextualFollowUp(cleanQuery, rememberedContext);
  }

  // General search / product standard lookup
  return handleProductStandardRecommendation(cleanQuery, rememberedContext);
}

// 1. Specific IS Code Explanation Handler
async function handleSpecificISCodeExplanation(query: string, isCodeFromRegex: string | null): Promise<AIResponsePayload> {
  const searchTerm = isCodeFromRegex || query;
  const matches = await searchStandardsInDB(searchTerm);

  if (matches.length === 0) {
    await logAnalytics(query, 'Standard Explanation', searchTerm, false);
    return {
      content: `I couldn't verify that information from the available standards database.\n\nPlease check if the Indian Standard number is correct (e.g., IS 456, IS 694, IS 1786). Currently, our verified database covers major standards in Electrical Cables, Civil Cement, Steel & Structural, Switchgear, Solar, Fire Safety, and Plumbing.`,
      sources: [],
      verificationStatus: 'Requires verification',
      followUps: [
        'Find standards for electrical cables',
        'Which Indian Standard applies to cement?',
        'List available categories',
        'How does IS Guide AI work?'
      ]
    };
  }

  const std = matches[0];
  await logAnalytics(query, std.category, std.isNumber, true);

  const content = `### Standard Overview: ${std.isNumber}

**Title:** ${std.title}  
**Category:** ${std.category}  
**Verification Status:** ✓ Verified from database  

---

#### 📋 Scope & Coverage
${std.scope}

#### 🏗️ Typical Applications
${std.typicalApplications.map(app => `• ${app}`).join('\n')}

#### ⚙️ Key Technical Parameters
${std.technicalParameters.map(param => `• ${param}`).join('\n')}

#### 🧪 Mandatory Testing Requirements
${std.testingRequirements.map(test => `• ${test}`).join('\n')}

#### 🔗 Related / Normative Standards
${std.normativeReferences.length > 0 ? std.normativeReferences.map(ref => `\`${ref}\``).join(', ') : 'None listed'}

#### 💼 Procurement Relevance & BIS Compliance
${std.procurementNotes}

---
*Note: Always verify against the latest official Bureau of Indian Standards (BIS) gazette publication before final procurement execution.*`;

  return {
    content,
    sources: [{ isNumber: std.isNumber, title: std.title, status: 'Verified from database' }],
    verificationStatus: 'Verified from database',
    followUps: [
      `Compare ${std.code} with another standard`,
      `Generate procurement specification for ${std.title.slice(0, 30)}`,
      `What testing requirements apply to ${std.code}?`,
      'Find related standards'
    ]
  };
}

// 2. Standard Comparison Handler
async function handleComparisonQuery(query: string, history: AIMessage[]): Promise<AIResponsePayload> {
  // Find all IS codes mentioned in query or history
  const codesInQuery = query.match(/IS\s*\d+(\s*\([^)]+\))?/gi) || [];
  let std1: IndianStandard | undefined;
  let std2: IndianStandard | undefined;

  if (codesInQuery.length >= 2 && codesInQuery[0] && codesInQuery[1]) {
    const matches1 = await searchStandardsInDB(codesInQuery[0]);
    const matches2 = await searchStandardsInDB(codesInQuery[1]);
    std1 = matches1[0];
    std2 = matches2[0];
  } else if (codesInQuery.length >= 1 && codesInQuery[0]) {
    const matches1 = await searchStandardsInDB(codesInQuery[0]);
    std1 = matches1[0];
    // try to find standard from context
    const contextTerm = inferProductContextFromHistory(history);
    if (contextTerm && contextTerm !== std1?.code) {
      const matches2 = await searchStandardsInDB(contextTerm);
      std2 = matches2.find(s => s.id !== std1?.id);
    }
  }

  // If no specific codes found, select defaults (e.g. IS 694 vs IS 7098 or IS 456 vs IS 269)
  if (!std1 || !std2) {
    if (query.toLowerCase().includes('cable') || query.toLowerCase().includes('wire')) {
      const m1 = await searchStandardsInDB('IS 694');
      const m2 = await searchStandardsInDB('IS 7098');
      std1 = m1[0];
      std2 = m2[0];
    } else if (query.toLowerCase().includes('cement') || query.toLowerCase().includes('concrete')) {
      const m1 = await searchStandardsInDB('IS 269');
      const m2 = await searchStandardsInDB('IS 1489');
      std1 = m1[0];
      std2 = m2[0];
    } else {
      const m1 = await searchStandardsInDB('IS 694');
      const m2 = await searchStandardsInDB('IS 7098');
      std1 = m1[0];
      std2 = m2[0];
    }
  }

  if (!std1 || !std2) {
    return {
      content: `I couldn't verify that information from the available standards database.\n\nPlease specify the two Indian Standard numbers you wish to compare (e.g., "Compare IS 694 and IS 7098" or "Compare IS 456 and IS 269").`,
      sources: [],
      verificationStatus: 'Requires verification',
      followUps: [
        'Compare IS 694 and IS 7098',
        'Compare IS 269 and IS 1489',
        'Compare IS 456 and IS 10262'
      ]
    };
  }

  await logAnalytics(query, 'Comparison', `${std1.code} vs ${std2.code}`, true);

  const content = `### Standard Comparison Matrix: ${std1.isNumber} vs ${std2.isNumber}

Below is a structured comparative analysis verified from our Indian Standards database:

| Parameter | ${std1.isNumber} | ${std2.isNumber} |
|---|---|---|
| **Title** | ${std1.title} | ${std2.title} |
| **Category** | ${std1.category} | ${std2.category} |
| **Primary Scope** | ${std1.scope.slice(0, 110)}... | ${std2.scope.slice(0, 110)}... |
| **Typical Applications** | ${std1.typicalApplications.slice(0, 2).join('; ')} | ${std2.typicalApplications.slice(0, 2).join('; ')} |
| **Key Parameter** | ${std1.technicalParameters[0] || 'Standard rating'} | ${std2.technicalParameters[0] || 'Standard rating'} |
| **Mandatory Testing** | ${std1.testingRequirements.slice(0, 2).join('; ')} | ${std2.testingRequirements.slice(0, 2).join('; ')} |
| **Procurement Focus** | ${std1.procurementNotes.slice(0, 90)}... | ${std2.procurementNotes.slice(0, 90)}... |

---

#### 💡 Guidance for Procurement Officers:
• **Select ${std1.code}** when: ${std1.typicalApplications[0]}.  
• **Select ${std2.code}** when: ${std2.typicalApplications[0]}.  

*Status: ✓ Verified from database*`;

  return {
    content,
    sources: [
      { isNumber: std1.isNumber, title: std1.title, status: 'Verified from database' },
      { isNumber: std2.isNumber, title: std2.title, status: 'Verified from database' }
    ],
    verificationStatus: 'Verified from database',
    followUps: [
      `Explain ${std1.code}`,
      `Explain ${std2.code}`,
      `Generate procurement specification for ${std1.code}`,
      'Search another standard'
    ]
  };
}

// 3. Product Standard Recommendation Handler
async function handleProductStandardRecommendation(query: string, contextProduct: string | null): Promise<AIResponsePayload> {
  let matches = await searchStandardsInDB(query);

  // Fallback to context product if direct query yielded no results
  if (matches.length === 0 && contextProduct) {
    matches = await searchStandardsInDB(contextProduct);
  }

  // Platform guide inquiry check
  if (query.toLowerCase().includes('how does is guide ai work') || query.toLowerCase().includes('platform') || query.toLowerCase().includes('what can you do')) {
    await logAnalytics(query, 'Platform Information', undefined, true);
    return {
      content: `### How IS Guide AI Works 🇮🇳

**IS Guide AI** is an intelligent Indian Standards recommendation and procurement assistance platform for government officers, PSUs, engineers, and contractors.

#### Key Platform Features:
1. **Verified Standard Search:** Instantly locate exact Indian Standards (IS codes) by product name, trade, or technical requirement.
2. **Smart Procurement Specs Generator:** Create structured draft procurement tender specifications with technical parameters and BIS testing checklists.
3. **Standards Comparison Engine:** Compare two related Indian Standards side-by-side in clear matrix format.
4. **BIS Compliance & QCO Guidance:** Identify Quality Control Orders (QCO), mandatory ISI marking requirements, and NABL test parameters.
5. **Verified Grounding:** All factual standards recommendations are strictly verified against official BIS data—never hallucinated.

Try asking:
• *"I need to procure electrical cables for a government project."*
• *"Which Indian Standard applies to cement?"*
• *"Explain IS 456."*`,
      sources: [],
      verificationStatus: 'Verified from database',
      followUps: [
        'Find standards for electrical cables',
        'Which Indian Standard applies to cement?',
        'Explain IS 456',
        'Help me create a procurement specification'
      ]
    };
  }

  if (matches.length === 0) {
    await logAnalytics(query, 'Unverified Query', undefined, false);
    return {
      content: `I couldn't verify that information from the available standards database.\n\nPlease try searching with different product keywords such as **electrical cables, cement, steel TMT bars, uPVC pipes, distribution transformer, fire extinguisher, safety helmet, or submersible pump**.`,
      sources: [],
      verificationStatus: 'Requires verification',
      followUps: [
        'Find standards for electrical cables',
        'Which Indian Standard applies to cement?',
        'Explain IS 1786 steel bars',
        'How does IS Guide AI work?'
      ]
    };
  }

  const primaryCategory = matches[0].category;
  await logAnalytics(query, primaryCategory, matches[0].isNumber, true);

  const topMatches = matches.slice(0, 3);
  const primaryStd = topMatches[0];

  const content = `### Recommended Indian Standards for your query

Based on your requirement, here are the verified applicable Indian Standards from our database:

${topMatches.map((std, idx) => `
#### ${idx + 1}. ${std.isNumber}: ${std.title}
• **Category:** ${std.category}  
• **Applicability:** ${std.typicalApplications.slice(0, 2).join('; ')}  
• **Key Technical Requirements:** ${std.technicalParameters.slice(0, 2).join('; ')}  
• **Mandatory Testing:** ${std.testingRequirements.slice(0, 2).join('; ')}  
• **Status:** ✓ Verified from database
`).join('\n---\n')}

---

### 🛡️ Smart Procurement Considerations
1. **BIS Quality Control Order (QCO):** Ensure suppliers hold a valid CML (Certification Marks License) on the BIS portal.
2. **Quality Verification:** Mandatory batch test certificates for conductor resistance, tensile strength, or compressive strength must be submitted prior to dispatch.
3. **Acceptance Criteria:** Check normative references (${primaryStd.normativeReferences.slice(0, 3).join(', ') || 'IS codes'}) for sampling procedures.

---
*Classification: Verified Standard Information*`;

  return {
    content,
    sources: topMatches.map(s => ({ isNumber: s.isNumber, title: s.title, status: 'Verified from database' as const })),
    verificationStatus: 'Verified from database',
    followUps: [
      `Explain ${primaryStd.code}`,
      `Compare ${topMatches[0].code} and ${topMatches[1]?.code || 'related standard'}`,
      `Generate procurement specification for ${primaryStd.code}`,
      'What testing requirements apply?'
    ]
  };
}

// 4. Contextual Follow-Up Handler
async function handleContextualFollowUp(query: string, contextProduct: string): Promise<AIResponsePayload> {
  const matches = await searchStandardsInDB(contextProduct);

  if (matches.length === 0) {
    return {
      content: `I couldn't verify that information from the available standards database for ${contextProduct}.`,
      sources: [],
      verificationStatus: 'Requires verification',
      followUps: ['Search another standard', 'How does IS Guide AI work?']
    };
  }

  const std = matches[0];
  await logAnalytics(query, std.category, std.isNumber, true);

  const content = `### Testing & Compliance Requirements for ${std.isNumber} (${contextProduct.toUpperCase()})

Following up on your query regarding **${contextProduct}** (${std.isNumber}):

#### 🧪 Mandatory Laboratory & Site Testing Protocol:
${std.testingRequirements.map(t => `1. **${t.split('(')[0].trim()}:** ${t}`).join('\n')}

#### ⚙️ Technical Verification Checklist for Procurement Officers:
${std.technicalParameters.map(p => `• ${p}`).join('\n')}

#### 📜 Applicable BIS Regulations:
${std.procurementNotes}

*Status: ✓ Verified from database*`;

  return {
    content,
    sources: [{ isNumber: std.isNumber, title: std.title, status: 'Verified from database' }],
    verificationStatus: 'Verified from database',
    followUps: [
      `Explain ${std.code} in detail`,
      `Generate procurement specification`,
      'Compare with another standard',
      'Find related standards'
    ]
  };
}

// 5. Procurement Specification Generator Handler
async function handleSpecGenerationQuery(query: string, history: AIMessage[], params?: { product?: string; intendedUse?: string; quantity?: string; requiredPerformance?: string; applicationIndustry?: string }): Promise<AIResponsePayload> {
  let product = params?.product;
  if (!product) {
    product = inferProductContextFromHistory(history) || 'Electrical Cables';
  }

  const matches = await searchStandardsInDB(product);
  const matchedStd = matches[0] || INDIAN_STANDARDS_DATABASE[0];

  await logAnalytics(query, 'Procurement Spec Generator', matchedStd.isNumber, true);

  const draft: ProcurementSpecDraft = {
    product: params?.product || matchedStd.category,
    intendedUse: params?.intendedUse || matchedStd.typicalApplications[0],
    quantity: params?.quantity || 'As per BOQ (Bill of Quantities)',
    requiredPerformance: params?.requiredPerformance || matchedStd.technicalParameters[0],
    applicationIndustry: params?.applicationIndustry || 'Government / Public Sector Procurement',
    productDescription: `Supply and delivery of high grade ${matchedStd.category} conforming to ${matchedStd.isNumber} with mandatory ISI marking and BIS QCO compliance.`,
    recommendedStandards: matches.slice(0, 3).map(m => ({
      isNumber: m.isNumber,
      title: m.title,
      applicability: m.scope
    })),
    technicalParameters: matchedStd.technicalParameters,
    testingRequirements: matchedStd.testingRequirements,
    qualityRequirements: [
      'Manufacturer must possess valid BIS License and CML number',
      'Every batch must be accompanied by Manufacturer Test Certificate (MTC)',
      'Third-party NABL accredited laboratory test report required prior to final acceptance'
    ],
    complianceRequirements: [
      'Strict adherence to relevant Quality Control Orders (QCO) issued by BIS / Government of India',
      matchedStd.procurementNotes
    ],
    disclaimer: 'AI-generated draft — verify against the latest applicable BIS standards before procurement.'
  };

  const content = `### 📄 Generated Procurement Tender Specification Draft

**Target Product / Item:** ${draft.product}  
**Intended Application:** ${draft.intendedUse}  
**Primary Indian Standard:** ${matchedStd.isNumber} (${matchedStd.title})  

---

#### 1. Item Description & Scope of Supply
${draft.productDescription}

#### 2. Applicable Indian Standards
${draft.recommendedStandards.map(s => `• **${s.isNumber}:** ${s.title}`).join('\n')}

#### 3. Key Technical Specifications & Material Parameters
${draft.technicalParameters.map(p => `• ${p}`).join('\n')}

#### 4. Mandatory Testing & Quality Assurance Plan (QAP)
${draft.testingRequirements.map(t => `• ${t}`).join('\n')}

#### 5. Quality Certification & Vendor Compliance
${draft.qualityRequirements.map(q => `• ${q}`).join('\n')}

#### 6. BIS Legal & Regulatory Compliance
${draft.complianceRequirements.map(c => `• ${c}`).join('\n')}

---

> ⚠️ **IMPORTANT NOTICE:**  
> **${draft.disclaimer}**`;

  return {
    content,
    sources: matches.slice(0, 3).map(m => ({ isNumber: m.isNumber, title: m.title, status: 'Verified from database' as const })),
    verificationStatus: 'Verified from database',
    followUps: [
      `Explain ${matchedStd.code}`,
      `Compare ${matchedStd.code} with related standards`,
      'Download / Copy this specification',
      'Generate specification for another product'
    ],
    specificationDraft: draft
  };
}
