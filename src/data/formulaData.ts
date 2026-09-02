export interface FormulaCard {
  id: string;
  category: 'Quant' | 'Reasoning' | 'Static GK' | 'Short Tricks';
  title: string;
  formula: string;
  application: string;
  examRelevance: string;
}

export const FORMULA_CARDS: FormulaCard[] = [
  {
    id: 'f1',
    category: 'Quant',
    title: 'Algebra: x + 1/x = k Relations',
    formula: 'If x + 1/x = k:\n• x² + 1/x² = k² - 2\n• x³ + 1/x³ = k³ - 3k\n• x⁴ + 1/x⁴ = (k² - 2)² - 2\n• x - 1/x = √(k² - 4)',
    application: 'Direct question in SSC CGL & CHSL Tier-1 in almost every shift.',
    examRelevance: 'SSC CGL / CHSL / CPO'
  },
  {
    id: 'f2',
    category: 'Quant',
    title: 'Mensuration 3D: Sphere & Cylinder Equivalences',
    formula: '• Volume of Cylinder = πr²h\n• CSA = 2πrh | TSA = 2πr(r+h)\n• Volume of Cone = ⅓πr²h | Slant height l = √(r²+h²)\n• Volume of Sphere = ⁴⁄₃πr³ | Surface Area = 4πr²',
    application: 'Recasting of metals and wire drawing problems in Railway & Police exams.',
    examRelevance: 'Railway NTPC & Group D'
  },
  {
    id: 'f3',
    category: 'Quant',
    title: 'Successive Percentage & Discount Formula',
    formula: 'Overall change = (a + b + ab/100)%\nEquivalent Single Discount of D1 & D2 = (D1 + D2 - D1×D2/100)%',
    application: 'Profit, Loss & Discount problems; Population growth.',
    examRelevance: 'SSC, Police Constable, RRB'
  },
  {
    id: 'f4',
    category: 'Reasoning',
    title: 'Alphabet Reverse Pairing (EJOTY & A-Z Pairs)',
    formula: '• A-Z (AZad), B-Y (BoY), C-X (CruX), D-W (Dew), E-V (EVening), F-U (FUll)\n• G-T (GT Road), H-S (High School), I-R (Indian Railway), J-Q (Jungle Queen)\n• K-P (KanPur), L-O (LOve), M-N (MAN)\n• Sum of opposite letter positions is ALWAYS 27.',
    application: 'Coding-Decoding and Letter Series instant solving within 5 seconds.',
    examRelevance: 'All Govt Exams'
  },
  {
    id: 'f5',
    category: 'Reasoning',
    title: 'Clock Angle Formula between Hour & Minute Hand',
    formula: 'Angle θ = |(11/2)×M - 30×H|\n• Angle at 8:20 => |(11/2)×20 - 30×8| = |110 - 240| = 130°\n• Coincide: 0°, Opposite: 180°, Right angle: 90°',
    application: 'Clock problems in Police SI and Railway CBT tests.',
    examRelevance: 'Police SI & Railway'
  },
  {
    id: 'f6',
    category: 'Static GK',
    title: 'Crucial Articles of Indian Constitution',
    formula: '• Art 14: Equality before Law\n• Art 17: Abolition of Untouchability\n• Art 21: Right to Life & Personal Liberty\n• Art 32: Constitutional Remedies (Soul of Constitution - Ambedkar)\n• Art 44: Uniform Civil Code\n• Art 324: Election Commission\n• Art 368: Amendment of Constitution',
    application: 'Top repeated polity questions in SSC & Police.',
    examRelevance: 'SSC CGL / MTS / Police'
  },
  {
    id: 'f7',
    category: 'Short Tricks',
    title: 'Multiplication by 11 & Unit Digit 5 Squares',
    formula: '• Number ending in 5 squared: (N5)² = [N × (N+1)] followed by 25. e.g. 75² = 7×8 | 25 = 5625.\n• 11 × 352 = 3 (3+5) (5+2) 2 = 3872.',
    application: 'Speed calculation in arithmetic & data interpretation.',
    examRelevance: 'Quant Speed Test'
  }
];
