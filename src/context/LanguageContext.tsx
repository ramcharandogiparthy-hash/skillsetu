import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppLanguage } from '../types';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    // Header & Brand
    'app.title': 'SkillSetu RPL',
    'app.tagline': 'Recognize skills. Build careers.',
    'app.sih_tag': 'Smart India Hackathon',
    'nav.home': 'Home',
    'nav.register': 'Worker Registration',
    'nav.self_declaration': 'Self-Declaration',
    'nav.assessor_dashboard': 'Assessor Dashboard',
    'nav.worker_dashboard': 'Worker Dashboard',
    'nav.admin_dashboard': 'Admin Dashboard',
    'nav.offline_sync': 'Offline Sync',
    'nav.login': 'Login',
    'nav.reset_demo': 'Reset Demo Data',
    'lang.en': 'English',
    'lang.te': 'తెలుగు (Telugu)',

    // Role Switcher
    'role.worker': 'Worker',
    'role.assessor': 'Assessor',
    'role.admin': 'Admin',
    'role.guest': 'Guest',

    // AI Disclaimer
    'ai.disclaimer_title': 'Human-in-the-Loop AI Policy:',
    'ai.disclaimer_body': 'AI provides evidence support and scoring guidance only. Final certification decisions are made by authorized human assessors.',

    // Common Buttons & Labels
    'btn.continue': 'Continue',
    'btn.back': 'Back',
    'btn.save_draft': 'Save Offline Draft',
    'btn.submit': 'Submit',
    'btn.sync_now': 'Sync Now',
    'btn.print': 'Print Report',
    'btn.download_pdf': 'Download PDF',
    'btn.start_assessment': 'Start Assessment',
    'btn.review_assessment': 'Review Assessment',
    'status.pending': 'Pending Assessment',
    'status.awaiting_approval': 'Awaiting Final Approval',
    'status.approved': 'Approved',
    'status.gap_training': 'Gap Training Recommended',
    'status.reassessment': 'Reassessment Scheduled',
    'status.rejected': 'Rejected',
    'status.synced': 'Synced',
    'status.pending_sync': 'Pending Sync',

    // Landing Page
    'hero.title': 'SkillSetu RPL',
    'hero.subtitle': 'AI-assisted, offline-first Recognition of Prior Learning assessment for informal workers in India.',
    'hero.btn_worker': 'Worker Login',
    'hero.btn_assessor': 'Assessor Login',
    'hero.btn_demo': 'View Demo Flow',
    
    // Trade info
    'trade.assistant_electrician': 'Assistant Electrician (NSQF Level 3)',

    // Registration
    'reg.title': 'Worker Skill Registration',
    'reg.step1': 'Personal Information',
    'reg.step2': 'Work Experience & Trade',
    'reg.step3': 'Data Consent',
    'reg.fullname': 'Full Name',
    'reg.mobile': 'Mobile Number',
    'reg.age': 'Age',
    'reg.gender': 'Gender',
    'reg.district': 'District',
    'reg.state': 'State',
    'reg.experience': 'Years of Experience',
    'reg.work_type': 'Work Type',

    // Self-Declaration
    'sd.title': 'Assistant Electrician Self-Declaration',
    'sd.desc': 'Answer 10 simple questions about your practical electrical skills.',
    'sd.voice_btn': 'Voice Answer (Hold to Speak)',
    'sd.voice_listening': 'Listening... (Simulated Voice Recording)',

    // Practical Assessment
    'pa.title': 'Practical Assessment Checklist',
    'pa.task': 'Task: Install and test a basic switchboard with one switch and one bulb holder.',
    'pa.evidence_upload': 'Upload Photo/Video Evidence',
    'pa.evidence_complete': 'Practical Evidence Complete',

    // Final Result
    'fr.title': 'Final Assessment Result & Decision',
    'fr.score_formula': 'Final Score = 20% Self-Declaration + 80% Practical Assessment',

    // Admin Dashboard
    'admin.title': 'National RPL Skill Analytics Dashboard'
  },
  te: {
    // Header & Brand
    'app.title': 'స్కిల్‌సేతు RPL',
    'app.tagline': 'నైపుణ్యాలను గుర్తించండి. కెరీర్‌ను నిర్మించండి.',
    'app.sih_tag': 'స్మార్ట్ ఇండియా హ్యాకథాన్',
    'nav.home': 'హోమ్',
    'nav.register': 'కార్మికుల నమోదు',
    'nav.self_declaration': 'స్వయం ప్రకటన',
    'nav.assessor_dashboard': 'అస్సెస్సర్ డాష్‌బోర్డ్',
    'nav.worker_dashboard': 'కార్మికుని డాష్‌బోర్డ్',
    'nav.admin_dashboard': 'అడ్మిన్ డాష్‌బోర్డ్',
    'nav.offline_sync': 'ఆఫ్‌లైన్ సింక్',
    'nav.login': 'లాగిన్',
    'nav.reset_demo': 'డేటా రీసెట్ చేయండి',
    'lang.en': 'English',
    'lang.te': 'తెలుగు (Telugu)',

    // Role Switcher
    'role.worker': 'కార్మికుడు',
    'role.assessor': 'అస్సెస్సర్',
    'role.admin': 'అడ్మిన్',
    'role.guest': 'అతిథి',

    // AI Disclaimer
    'ai.disclaimer_title': 'AI నిర్ణయ విధానం:',
    'ai.disclaimer_body': 'AI కేవలం నివేదికలు మరియు సాక్ష్యాల సహాయం కోసం మాత్రమే. అంతిమ సర్టిఫికేషన్ నిర్ణయం మానవ అస్సెస్సర్ ద్వారా మాత్రమే తీసుకోబడుతుంది.',

    // Common Buttons & Labels
    'btn.continue': 'ముందుకు సాగండి',
    'btn.back': 'వెనుకకు',
    'btn.save_draft': 'ఆఫ్‌లైన్ డ్రాఫ్ట్ సేవ్ చేయండి',
    'btn.submit': 'సమర్పించండి',
    'btn.sync_now': 'ఇప్పుడే సింక్ చేయండి',
    'btn.print': 'రిపోర్ట్ ప్రింట్ చేయండి',
    'btn.download_pdf': 'PDF డౌన్‌లోడ్ చేయండి',
    'btn.start_assessment': 'అసెస్మెంట్ ప్రారంభించండి',
    'btn.review_assessment': 'సమీక్షించండి',
    'status.pending': 'పెండింగ్ అసెస్మెంట్',
    'status.awaiting_approval': 'అంతిమ ఆమోదం కోసం నిరీక్షణ',
    'status.approved': 'ఆమోదించబడింది',
    'status.gap_training': 'గ్యాప్ శిక్షణ సిఫార్సు చేయబడింది',
    'status.reassessment': 'పునఃపరిశీలన షెడ్యూల్ చేయబడింది',
    'status.rejected': 'తిరస్కరించబడింది',
    'status.synced': 'సింక్ అయ్యింది',
    'status.pending_sync': 'సింక్ కావలసి ఉంది',

    // Landing Page
    'hero.title': 'స్కిల్‌సేతు RPL',
    'hero.subtitle': 'భారతీయ అసంగటిత రంగానికి AI-ఆధారిత, ఆఫ్‌లైన్-ఫస్ట్ నైపుణ్యాల గుర్తింపు వేదిక.',
    'hero.btn_worker': 'వర్కర్ లాగిన్',
    'hero.btn_assessor': 'అస్సెస్సర్ లాగిన్',
    'hero.btn_demo': 'డెమో విధానం చూడండి',

    // Trade info
    'trade.assistant_electrician': 'అసిస్టెంట్ ఎలక్ట్రీషియన్ (NSQF లెవెల్ 3)',

    // Registration
    'reg.title': 'కార్మికుల నైపుణ్య నమోదు',
    'reg.step1': 'వ్యక్తిగత వివరాలు',
    'reg.step2': 'అనుభవం మరియు వృత్తి',
    'reg.step3': 'సమ్మతి పత్రం',
    'reg.fullname': 'పూర్తి పేరు',
    'reg.mobile': 'మొబైల్ సంఖ్య',
    'reg.age': 'వయస్సు',
    'reg.gender': 'లింగం',
    'reg.district': 'జిల్లా',
    'reg.state': 'రాష్ట్రం',
    'reg.experience': 'అనుభవ సంవత్సరాలు',
    'reg.work_type': 'పని రకం',

    // Self-Declaration
    'sd.title': 'అసిస్టెంట్ ఎలక్ట్రీషియన్ స్వయం ప్రకటన',
    'sd.desc': 'మీ విద్యుత్ నైపుణ్యాలపై 10 సరళమైన ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    'sd.voice_btn': 'వాయిస్ సమాధానం (నొక్కి పట్టుకోండి)',
    'sd.voice_listening': 'వింటోంది... (వాయిస్ రికార్డింగ్)',

    // Practical Assessment
    'pa.title': 'ప్రాక్టికల్ అసెస్మెంట్ చెక్‌లిస్ట్',
    'pa.task': 'టాస్క్: ఒక స్విచ్ మరియు ఒక బల్బ్ హోల్డర్‌తో ప్రాథమిక స్విచ్‌బోర్డ్‌ను ఇన్‌స్టాల్ చేసి పరీక్షించండి.',
    'pa.evidence_upload': 'ఫోటో/వీడియో ఆధారాలు అప్‌లోడ్ చేయండి',
    'pa.evidence_complete': 'ప్రాక్టికల్ ఆధారాలు పూర్తయ్యాయి',

    // Final Result
    'fr.title': 'అంతిమ అసెస్మెంట్ ఫలితం మరియు నిర్ణయం',
    'fr.score_formula': 'అంతిమ మార్కులు = 20% స్వయం ప్రకటన + 80% ప్రాక్టికల్ అసెస్మెంట్',

    // Admin Dashboard
    'admin.title': 'జాతీయ RPL నైపుణ్య విశ్లేషణ డాష్‌బోర్డ్'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('skillsetu_lang') as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('skillsetu_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
