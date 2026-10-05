import type { IndianStandard } from '../types';

export const INDIAN_STANDARDS_DATABASE: IndianStandard[] = [
  {
    id: 'is-694',
    isNumber: 'IS 694:2010',
    code: 'IS 694',
    year: '2010',
    title: 'Polyvinyl Chloride Insulated Cables for Working Voltages up to and Including 1100 V',
    category: 'Electrical Cables & Wiring',
    tags: ['cable', 'cables', 'pvc', 'wire', 'wiring', 'copper', 'aluminum', 'electrical', 'building wiring', '1100v', 'house wiring'],
    scope: 'Covers requirements for single core and multicore PVC insulated unsheathed and sheathed flexible and rigid cables for working voltages up to 1100 V.',
    typicalApplications: ['Internal building wiring', 'Power distribution in offices/residences', 'Control panels', 'Domestic lighting circuits'],
    technicalParameters: [
      'Conductor Material: High conductivity Electrolytic Grade Copper or EC Grade Aluminum',
      'Insulation Class: Type A PVC (70°C) or Heat Resistant PVC Type C (85°C)',
      'Voltage Grade: Up to and including 1100 V AC',
      'Flame Retardance: Flame Retardant (FR) / Flame Retardant Low Smoke (FRLS) options per IS 10810'
    ],
    testingRequirements: [
      'Conductor Resistance Test (IS 8130)',
      'High Voltage Test (3 kV AC for 5 minutes)',
      'Insulation Resistance Test (Min 10 MΩ/km)',
      'Tensile Strength and Elongation of PVC Insulation',
      'Flammability Test per IS 10810 (Part 53)'
    ],
    normativeReferences: ['IS 8130', 'IS 5831', 'IS 10810'],
    procurementNotes: 'Mandatory BIS Quality Control Order (QCO) compliance required. Supplier must possess a valid CML license number from BIS and supply batch test certificates.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-7098-1',
    isNumber: 'IS 7098 (Part 1):1988',
    code: 'IS 7098',
    year: '1988',
    title: 'Crosslinked Polyethylene Insulated PVC Sheathed Cables - Part 1: For Working Voltages Up to and Including 1100 V',
    category: 'Electrical Cables & Wiring',
    tags: ['cable', 'cables', 'xlpe', 'armoured', 'unarmoured', 'heavy duty', 'underground', 'power cable', '1100v', 'industrial cable'],
    scope: 'Specifies requirements for armoured and unarmoured XLPE insulated PVC sheathed power cables suitable for working voltages up to 1100 V in distribution systems.',
    typicalApplications: ['Underground power distribution', 'Industrial plants', 'Substation interconnects', 'PSU power cabling projects'],
    technicalParameters: [
      'Conductor: Stranded Copper or Aluminum Class 2 per IS 8130',
      'Insulation: Crosslinked Polyethylene (XLPE) with continuous operating temp of 90°C',
      'Armouring: Galvanized Steel Wire or Steel Strip for multicore cables',
      'Outer Sheath: PVC Type ST2'
    ],
    testingRequirements: [
      'Conductor Resistance Test',
      'Partial Discharge Test for MV range',
      'Armour Resistance & Coverage Test',
      'Thermal Ageing Test of XLPE Insulation',
      'Hot Set Test for XLPE crosslinking degree'
    ],
    normativeReferences: ['IS 8130', 'IS 5831', 'IS 3975', 'IS 10810'],
    procurementNotes: 'Critical for underground power supply projects. Ensure Armouring coverage is certified and test reports specify hot-set test compliance.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-1554-1',
    isNumber: 'IS 1554 (Part 1):1988',
    code: 'IS 1554',
    year: '1988',
    title: 'PVC Insulated (Heavy Duty) Electric Cables - Part 1: For Working Voltages Up to and Including 1100 V',
    category: 'Electrical Cables & Wiring',
    tags: ['heavy duty cable', 'pvc cable', 'control cable', 'power cable', 'armoured cable', '1100v'],
    scope: 'Covers requirements of armoured and unarmoured PVC insulated heavy duty cables for electricity supply and control circuits.',
    typicalApplications: ['Industrial feeder cables', 'Control cabling in sub-stations', 'Heavy engineering projects'],
    technicalParameters: [
      'Conductor: Aluminum or Copper',
      'Operating Temperature: 70°C standard / 85°C heat resistant',
      'Armour: Steel Wire / Strip'
    ],
    testingRequirements: [
      'Conductor resistance',
      'High Voltage dielectric withstand test',
      'Outer sheath water absorption test'
    ],
    normativeReferences: ['IS 8130', 'IS 5831'],
    procurementNotes: 'Check whether FRLS outer sheath is explicitly specified in tender scope.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-456',
    isNumber: 'IS 456:2000',
    code: 'IS 456',
    year: '2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    category: 'Cement & Construction',
    tags: ['concrete', 'reinforced concrete', 'civil', 'rcc', 'cement', 'mix design', 'building construction', 'structural steel', 'compressive strength'],
    scope: 'Deals with the general structural use of plain and reinforced concrete in buildings, bridges, and infrastructure projects.',
    typicalApplications: ['Government building construction', 'RCC slabs, beams, columns, footings', 'Infrastructure civil works'],
    technicalParameters: [
      'Minimum Grade of Concrete for RCC: M20 (Moderate exposure: M25, Severe: M30)',
      'Max Water-Cement Ratio: 0.50 for M20, 0.45 for M30',
      'Minimum Cement Content: 300 kg/m³ for RCC (Moderate exposure)',
      'Clear Cover to Reinforcement: Footings 50mm, Columns 40mm, Beams 25mm, Slabs 20mm'
    ],
    testingRequirements: [
      'Cube Compressive Strength Test at 7 days & 28 days (IS 516)',
      'Workability Slump Cone Test (IS 1199)',
      'Water permeability test for critical water-retaining structures'
    ],
    normativeReferences: ['IS 269', 'IS 383', 'IS 1786', 'IS 516', 'IS 10262'],
    procurementNotes: 'Standard reference code for all civil RCC work. Batch mix proportions must conform strictly to IS 10262 mix design guidelines.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-269',
    isNumber: 'IS 269:2015',
    code: 'IS 269',
    year: '2015',
    title: 'Ordinary Portland Cement (33 Grade, 43 Grade and 53 Grade) - Specification',
    category: 'Cement & Construction',
    tags: ['cement', 'opc', 'opc 43', 'opc 53', 'portland cement', 'concrete', 'building materials', 'construction'],
    scope: 'Covers physical and chemical requirements for Ordinary Portland Cement of Grades 33, 43, and 53.',
    typicalApplications: ['High-strength structural concrete (OPC 53)', 'Precast concrete members', 'General civil construction (OPC 43)'],
    technicalParameters: [
      'Compressive Strength (28 days): Min 43 MPa (OPC 43), Min 53 MPa (OPC 53)',
      'Initial Setting Time: Not less than 30 minutes',
      'Final Setting Time: Not more than 600 minutes (10 hours)',
      'Fineness (Blaine Air Permeability): Min 225 m²/kg'
    ],
    testingRequirements: [
      'Compressive Strength Test on 70.6mm mortar cubes (IS 4031 Part 6)',
      'Consistency & Setting Time Test (IS 4031 Part 4 & 5)',
      'Soundness Test by Le Chatelier method (IS 4031 Part 3)'
    ],
    normativeReferences: ['IS 4031', 'IS 4032', 'IS 4926'],
    procurementNotes: 'Cement bags must carry ISI mark, manufacture week and year, and grade clearly stamped. Storage shelf life must not exceed 90 days without re-testing.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-1489-1',
    isNumber: 'IS 1489 (Part 1):2015',
    code: 'IS 1489',
    year: '2015',
    title: 'Portland Pozzolana Cement - Specification (Fly Ash Based)',
    category: 'Cement & Construction',
    tags: ['ppc', 'cement', 'fly ash cement', 'pozzolana', 'civil', 'masonry', 'plastering'],
    scope: 'Specifies requirements for Portland Pozzolana Cement produced by intergrinding OPC clinker with pozzolana (fly ash: 15% to 35%).',
    typicalApplications: ['Mass concrete works (dams, foundations)', 'Brick masonry and plastering', 'General RCC construction'],
    technicalParameters: [
      'Fly Ash Content: 15% to 35% by mass',
      'Compressive Strength (28 days): Min 33 MPa (matches OPC 43 grade performance at 28 days)',
      'Drying Shrinkage: Not more than 0.15%'
    ],
    testingRequirements: [
      'Fineness test (Min 300 m²/kg)',
      'Compressive strength test at 3, 7, and 28 days',
      'Pozzolanic activity test'
    ],
    normativeReferences: ['IS 4031', 'IS 3812'],
    procurementNotes: 'Ideal for sustainable government civil projects due to lower heat of hydration and improved long-term durability.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-10262',
    isNumber: 'IS 10262:2019',
    code: 'IS 10262',
    year: '2019',
    title: 'Concrete Mix Proportioning - Guidelines',
    category: 'Cement & Construction',
    tags: ['mix design', 'concrete mix', 'rcc design', 'water cement ratio', 'compressive strength design'],
    scope: 'Provides guidelines for proportioning concrete mixes for specified characteristic compressive strength.',
    typicalApplications: ['Ready Mix Concrete (RMC) plant mix designs', 'Site-mixed high performance concrete'],
    technicalParameters: [
      'Target Mean Strength: f\'ck + 1.65 x s',
      'Includes mix design procedures for self-compacting concrete (SCC) and high strength concrete'
    ],
    testingRequirements: [
      'Slump flow retention test',
      'Trial mix cube compressive testing'
    ],
    normativeReferences: ['IS 456', 'IS 383', 'IS 9103'],
    procurementNotes: 'Mix design reports approved by NABL accredited laboratory must be submitted before pouring structural concrete.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-1786',
    isNumber: 'IS 1786:2008',
    code: 'IS 1786',
    year: '2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT Bars)',
    category: 'Steel & Structural',
    tags: ['steel', 'tmt', 'tmt bar', 'rebar', 'steel rod', 'fe500', 'fe500d', 'fe550d', 'reinforcement steel', 'civil steel'],
    scope: 'Covers requirements for Thermo-Mechanically Treated (TMT) steel bars for use as reinforcement in concrete structures.',
    typicalApplications: ['RCC structures, bridges, high-rise buildings', 'Earthquake-resistant structures (Fe 500D / Fe 550D)'],
    technicalParameters: [
      'Grades: Fe 415, Fe 500, Fe 500D, Fe 550D, Fe 600',
      'Yield Stress (Fe 500D): Min 500 N/mm²',
      'Tensile Strength / Yield Stress Ratio (Fe 500D): Min 1.12',
      'Elongation (Fe 500D): Min 16.0%'
    ],
    testingRequirements: [
      'Tensile Test (Yield stress, Ultimate tensile strength, Elongation per IS 1608)',
      'Bend and Rebend Test per IS 1599',
      'Chemical Analysis (Carbon max 0.25%, Sulfur & Phosphorus max 0.040% for D grade)',
      'Mass per Meter Run Tolerance'
    ],
    normativeReferences: ['IS 1608', 'IS 1599', 'IS 228'],
    procurementNotes: 'Fe 500D or Fe 550D is mandatory for seismic zones III, IV, and V. Manufacturer must provide Mill Test Certificate (MTC) per heat number.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-2062',
    isNumber: 'IS 2062:2011',
    code: 'IS 2062',
    year: '2011',
    title: 'Hot Rolled Medium and High Tensile Structural Steel - Specification',
    category: 'Steel & Structural',
    tags: ['structural steel', 'steel angle', 'steel channel', 'i beam', 'steel plate', 'girder', 'steel section', 'e250', 'e350'],
    scope: 'Specifies requirements for structural steel plates, shapes (angles, channels, beams, tees), and flats.',
    typicalApplications: ['Steel bridges, industrial sheds, transmission towers', 'PEB (Pre-Engineered Buildings)'],
    technicalParameters: [
      'Grade designations: E250, E300, E350, E410, E450',
      'Quality Sub-grades: BR (Impact tested at room temp), BO (at 0°C), C (at -20°C)',
      'Yield Strength (E250): Min 250 MPa'
    ],
    testingRequirements: [
      'Tensile Test (IS 1608)',
      'Charpy V-notch Impact Test (IS 1757)',
      'Ultrasonic Testing for thick plates (IS 4225)'
    ],
    normativeReferences: ['IS 800', 'IS 1608', 'IS 1757'],
    procurementNotes: 'Check sub-grade (BO/BR) based on impact requirements in cold climates or fatigue loading.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-1239-1',
    isNumber: 'IS 1239 (Part 1):2004',
    code: 'IS 1239',
    year: '2004',
    title: 'Steel Tubes, Tubulars and Other Wrought Steel Fittings - Part 1: Steel Tubes',
    category: 'Steel & Structural',
    tags: ['steel pipe', 'gi pipe', 'ms pipe', 'tubular', 'scaffolding pipe', 'water pipe', 'plumbing pipe', 'is 1239'],
    scope: 'Covers requirements for welded and seamless steel tubes suitable for water, gas, steam, and compressed air lines.',
    typicalApplications: ['Water supply distribution lines', 'Firefighting sprinkler pipes', 'Structural scaffolding and handrails'],
    technicalParameters: [
      'Classes: Light (Yellow band), Medium (Blue band), Heavy (Red band)',
      'Nominal Bore (NB): 15 mm to 150 mm',
      'Galvanizing: Hot-dip zinc coating min 360 g/m² for GI pipes'
    ],
    testingRequirements: [
      'Hydrostatic Pressure Test (5 MPa for 5 seconds)',
      'Flattening Test for welded tubes',
      'Zinc Coating Mass & Adherence Test for GI pipes (IS 2633)'
    ],
    normativeReferences: ['IS 4736', 'IS 2633', 'IS 1387'],
    procurementNotes: 'Specify whether Light, Medium, or Heavy class is required. Heavy class is standard for underground and firefighting installations.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-4985',
    isNumber: 'IS 4985:2021',
    code: 'IS 4985',
    year: '2021',
    title: 'Unplasticized PVC (uPVC) Pipes for Potable Water Supplies - Specification',
    category: 'Pipes, Plumbing & Sanitation',
    tags: ['upvc pipe', 'pvc pipe', 'potable water', 'plumbing', 'water supply pipe', 'drinking water pipe'],
    scope: 'Covers unplasticized PVC pipes intended for potable water supply in municipal, rural, and building applications.',
    typicalApplications: ['Jal Jeevan Mission rural water supply schemes', 'Municipal drinking water networks', 'Building water distribution'],
    technicalParameters: [
      'Pressure Ratings: Class 1 (0.25 MPa), Class 2 (0.4 MPa), Class 3 (0.6 MPa), Class 4 (0.8 MPa), Class 5 (1.0 MPa), Class 6 (1.25 MPa)',
      'Sizes: 16 mm to 1000 mm outer diameter',
      'Color: Dark Grey or Blue'
    ],
    testingRequirements: [
      'Hydrostatic Internal Pressure Test (Resistance to internal pressure at 27°C and 60°C)',
      'Impact Strength Drop Weight Test at 0°C',
      'Opacity Test',
      'Effect on Water Quality Test (Heavy metal leaching test for lead/tin stabilizers)'
    ],
    normativeReferences: ['IS 12235', 'IS 10151'],
    procurementNotes: 'Must comply with BIS QCO. Lead-free stabilizer compliance certificate is required for potable drinking water projects.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-13592',
    isNumber: 'IS 13592:2013',
    code: 'IS 13592',
    year: '2013',
    title: 'Unplasticized Polyvinyl Chloride (uPVC) Pipes for Soil and Waste Discharge System Inside and Outside Buildings',
    category: 'Pipes, Plumbing & Sanitation',
    tags: ['swr pipe', 'drainage pipe', 'sewage pipe', 'soil pipe', 'upvc drainage', 'waste pipe'],
    scope: 'Specifies requirements for uPVC pipes used for soil and waste discharge systems (SWR) in buildings.',
    typicalApplications: ['Building SWR drainage vertical stacks', 'Rainwater downpipes', 'External sewerage connections'],
    technicalParameters: [
      'Types: Type A (for rainwater and ventilation), Type B (for soil and waste discharge)',
      'Sizes: 75 mm, 90 mm, 110 mm, 160 mm',
      'Jointing: Rubber ring joint (ring-fit) or solvent cement joint'
    ],
    testingRequirements: [
      'Impact resistance test',
      'Tightness of joints test',
      'Vicat softening temperature (Min 79°C)'
    ],
    normativeReferences: ['IS 12235', 'IS 5382'],
    procurementNotes: 'Type B pipes have thicker wall dimensions and are mandatory for soil discharge carrying waste solids.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-1180-1',
    isNumber: 'IS 1180 (Part 1):2014',
    code: 'IS 1180',
    year: '2014',
    title: 'Outdoor Type Oil Immersed Distribution Transformers Up to and Including 2500 kVA, 33 kV - Specification',
    category: 'Electrical Equipment & Switchgear',
    tags: ['transformer', 'distribution transformer', 'oil transformer', '11kv transformer', '33kv transformer', 'energy efficiency rating', 'star rating transformer', 'psu electrical'],
    scope: 'Specifies energy efficiency levels (Max Losses Level 1, Level 2, Level 3), ratings, and constructional requirements for distribution transformers.',
    typicalApplications: ['DISCOM electrical distribution networks', 'Substation power step-down', 'Industrial facility substations'],
    technicalParameters: [
      'Capacity: Up to 2500 kVA',
      'Primary Voltage: 11 kV, 22 kV, 33 kV',
      'Energy Efficiency Levels: Level 1 (Standard), Level 2 (High Efficiency), Level 3 (Highest Efficiency per BEE normas)'
    ],
    testingRequirements: [
      'Routine Tests: Measurement of winding resistance, voltage ratio, vector group, no-load loss & current, load loss & impedance, dielectric withstand (IS 2026)',
      'Type Tests: Temperature rise test, Lightning Impulse withstand test',
      'Special Tests: Short circuit withstand capability test'
    ],
    normativeReferences: ['IS 2026', 'IS 335', 'IS 2099'],
    procurementNotes: 'Mandatory BEE Star Labeling / CEA regulation compliance required. Check loss limits specified in IS 1180 Level 2 / Level 3.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-60898-1',
    isNumber: 'IS 60898 (Part 1):2019',
    code: 'IS 60898',
    year: '2019',
    title: 'Circuit-Breakers for Overcurrent Protection for Household and Similar Installations (MCBs)',
    category: 'Electrical Equipment & Switchgear',
    tags: ['mcb', 'miniature circuit breaker', 'switchgear', 'circuit breaker', 'electrical safety', 'distribution board'],
    scope: 'Applies to AC air-break circuit breakers for operation at 50 Hz, having a rated voltage not exceeding 440 V and rated current not exceeding 125 A.',
    typicalApplications: ['DB board overcurrent and short circuit protection', 'Building distribution boards'],
    technicalParameters: [
      'Rated Current (In): 6A to 63A typical',
      'Rated Short Circuit Capacity (Icn): 6,000 A (6kA) or 10,000 A (10kA)',
      'Tripping Characteristics: B Curve, C Curve, D Curve'
    ],
    testingRequirements: [
      'Short Circuit Test at rated Icn capacity',
      'Tripping characteristic test (thermal overload & magnetic short circuit)',
      'Temperature rise test at rated current'
    ],
    normativeReferences: ['IS/IEC 60947', 'IS 12640'],
    procurementNotes: 'C Curve MCBs are standard for inductive loads (fans, motors, lighting). Ensure 10kA rating is specified for main distribution boards.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-3043',
    isNumber: 'IS 3043:2018',
    code: 'IS 3043',
    year: '2018',
    title: 'Code of Practice for Earthing (Grounding Systems)',
    category: 'Electrical Equipment & Switchgear',
    tags: ['earthing', 'grounding', 'earth pit', 'pipe earthing', 'plate earthing', 'chemical earthing', 'lightning protection', 'electrical safety'],
    scope: 'Provides guidelines for design, installation, and maintenance of earthing systems in electrical installations to ensure human safety and equipment protection.',
    typicalApplications: ['Substation earthing grids', 'Building service earthing', 'Data center & transformer neutral grounding'],
    technicalParameters: [
      'Maximum Resistance: Sub-stations < 1.0 Ω, Industrial facilities < 2.0 Ω, Domestic < 5.0 Ω',
      'Types of Electrodes: Pipe electrode, Plate electrode, Strip electrode, Maintenance-free Chemical Gel electrodes'
    ],
    testingRequirements: [
      'Earth Resistance Measurement using 4-point Fall of Potential method (Earth Tester)',
      'Soil Resistivity Survey'
    ],
    normativeReferences: ['IS 732', 'IS 2309', 'IEEE 80'],
    procurementNotes: 'Copper bonded steel earth rods must have minimum 250 microns copper bonding thickness.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-732',
    isNumber: 'IS 732:2019',
    code: 'IS 732',
    year: '2019',
    title: 'Code of Practice for Electrical Wiring Installations',
    category: 'Electrical Equipment & Switchgear',
    tags: ['electrical wiring', 'building wiring', 'installation code', 'circuit safety', 'conduit wiring', 'internal electrical'],
    scope: 'Covers essential guidelines for design, execution, inspection, and testing of electrical wiring installations in residential, commercial, and industrial buildings.',
    typicalApplications: ['Internal electrification tenders', 'CPWD / PWD building electrical works'],
    technicalParameters: [
      'Color Coding: Red/Yellow/Blue for Phase, Black/Neutral, Green/Yellow for Earth',
      'Conduit fill factor: Max 40% cable occupancy in rigid PVC/MS conduits'
    ],
    testingRequirements: [
      'Insulation Resistance Test between conductors and earth (Min 1 MΩ at 500V DC)',
      'Polarity Test of single-pole switches',
      'Earth continuity loop impedance test'
    ],
    normativeReferences: ['IS 694', 'IS 9537', 'IS 3043', 'IS 12640'],
    procurementNotes: 'Standard mandatory reference for CPWD / State PWD building electrification tenders.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-14286',
    isNumber: 'IS 14286:2010',
    code: 'IS 14286',
    year: '2010',
    title: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules - Design Qualification and Type Approval',
    category: 'Solar & Renewable Energy',
    tags: ['solar', 'solar panel', 'pv module', 'photovoltaic', 'crystalline solar', 'renewable energy', 'solar power plant', 'mnre'],
    scope: 'Specifies requirements for design qualification and type approval of terrestrial crystalline silicon PV modules suitable for long-term outdoor operation.',
    typicalApplications: ['Rooftop solar installations', 'Utility-scale solar power parks', 'PM-KUSUM solar pump installations'],
    technicalParameters: [
      'Module Efficiency: Minimum 19.5% for mono-PERC / TopCon modules',
      'Cell Configuration: 120 / 144 half-cut cells',
      'Junction Box Protection: IP68 rating'
    ],
    testingRequirements: [
      'Thermal Cycling Test (-40°C to +85°C for 200 cycles)',
      'Damp Heat Test (85°C / 85% RH for 1000 hours)',
      'Mechanical Load Test (5400 Pa front load for snow/wind)',
      'PID (Potential Induced Degradation) Test'
    ],
    normativeReferences: ['IS/IEC 61730', 'IS/IEC 61215'],
    procurementNotes: 'Must be listed in MNRE Approved List of Models and Manufacturers (ALMM) and hold valid BIS certification.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-15683',
    isNumber: 'IS 15683:2018',
    code: 'IS 15683',
    year: '2018',
    title: 'Portable Fire Extinguishers - Performance and Construction - Specification',
    category: 'Fire Safety & PPE',
    tags: ['fire extinguisher', 'abc fire extinguisher', 'co2 extinguisher', 'fire safety', 'safety equipment', 'building fire safety'],
    scope: 'Specifies requirements for performance, reliability, and construction of portable fire extinguishers of ABC Dry Powder, CO2, Water, and Foam types.',
    typicalApplications: ['Government office buildings', 'Substations and server rooms', 'Public venues and schools'],
    technicalParameters: [
      'Types: MAP 50%/90% ABC Powder, CO2 cylinder (IS 7285), Clean Agent',
      'Operating Pressure: 15 bar stored pressure with pressure gauge'
    ],
    testingRequirements: [
      'Fire Rating Performance Tests (Class A, Class B, Class C fires)',
      'Burst Pressure Test (Min 4 times working pressure)',
      'Corrosion Resistance Salt Spray Test'
    ],
    normativeReferences: ['IS 2190', 'IS 7285'],
    procurementNotes: 'Check fire rating (e.g. 3A 21B for 4kg ABC) and ensure gauge displays green operating zone before installation.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-2925',
    isNumber: 'IS 2925:1984',
    code: 'IS 2925',
    year: '1984',
    title: 'Specification for Industrial Safety Helmets',
    category: 'Fire Safety & PPE',
    tags: ['safety helmet', 'hard hat', 'ppe', 'construction safety helmet', 'head protection', 'industrial safety'],
    scope: 'Covers physical and performance requirements for industrial safety helmets intended to protect workers from falling objects and electrical shock.',
    typicalApplications: ['Civil construction sites', 'Industrial plants', 'Electrical line maintenance'],
    technicalParameters: [
      'Material: HDPE (High Density Polyethylene) or ABS',
      'Harness: 4-point or 6-point textile cradle with ratchet adjustment',
      'Electrical Insulation: Voltage withstand up to 2000 V AC'
    ],
    testingRequirements: [
      'Shock Absorption Test (Transmitted force < 5.0 kN)',
      'Penetration Resistance Test',
      'Flammability Test',
      'Electrical Resistance Test'
    ],
    normativeReferences: ['IS 4640'],
    procurementNotes: 'Must bear ISI mark on shell. Inspect harness retention and chin strap strength in factory audit certificates.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-15298-2',
    isNumber: 'IS 15298 (Part 2):2011',
    code: 'IS 15298',
    year: '2011',
    title: 'Personal Protective Equipment - Part 2: Safety Footwear',
    category: 'Fire Safety & PPE',
    tags: ['safety shoes', 'safety boot', 'steel toe shoes', 'ppe', 'worker safety', 'foot protection'],
    scope: 'Specifies basic and additional requirements for safety footwear used in industrial environments.',
    typicalApplications: ['Industrial factory floors', 'Electrical sub-stations (Dielectric boots)', 'Construction sites'],
    technicalParameters: [
      'Toe Protection: Steel / Composite toe cap rated for 200 Joules impact energy',
      'Outsole: Dual Density PU (Polyurethane) oil & acid resistant',
      'Antistatic Property: Resistance between 100 kΩ and 1000 MΩ'
    ],
    testingRequirements: [
      'Toe Cap Impact Test (200 J)',
      'Compression Resistance Test (15 kN)',
      'Sole Penetration Resistance Test (1100 N)',
      'Upper Leather Tear Strength Test'
    ],
    normativeReferences: ['IS 2052'],
    procurementNotes: 'Ensure genuine leather upper and steel toe cap impact test certificate per batch.',
    verificationStatus: 'Verified from database'
  },
  {
    id: 'is-8034',
    isNumber: 'IS 8034:2002',
    code: 'IS 8034',
    year: '2002',
    title: 'Submersible Pumpsets - Specification',
    category: 'Pumps & Water Systems',
    tags: ['submersible pump', 'borewell pump', 'water pump', 'irrigation pump', 'pumping station', 'jal jeevan mission'],
    scope: 'Covers technical requirements for multi-stage centrifugal submersible pumpsets driven by submersible electric motors for borewells.',
    typicalApplications: ['Rural drinking water borewells', 'Agricultural irrigation', 'Public water supply schemes'],
    technicalParameters: [
      'Bore Size: 100 mm (4 inch), 150 mm (6 inch), 200 mm (8 inch)',
      'Motor Enclosure: Water-filled wet stator or oil-filled',
      'Efficiency Grade: BEE 5 Star rated energy efficiency'
    ],
    testingRequirements: [
      'Hydrostatic Pressure Test of pump casing',
      'Pump Performance Guarantee Test (Head vs Flow Q-H curve per IS 9137)',
      'High Voltage withstand test of motor winding'
    ],
    normativeReferences: ['IS 9259', 'IS 9137', 'IS 12615'],
    procurementNotes: 'Mandatory BEE 5-Star efficiency label compliance required for government rural water supply procurement tenders.',
    verificationStatus: 'Verified from database'
  }
];
