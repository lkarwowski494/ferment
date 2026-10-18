// ============================================================================
// Apps4Brew Studio — SEROWAR Phage Rotation & Starter Culture Defense Engine
// Protects farmhouse and artisan dairies against bacteriophage mutations
// by enforcing anti-phage starter culture group rotations across batches.
// ============================================================================

export type PhageRiskLevel = 'LOW' | 'MODERATE' | 'CRITICAL';

export interface PhageGroupProfile {
  groupId: string;
  groupName: string;
  representativeCultures: string[];
  speciesComposition: string[];
  rotationCompatibility: string[]; // Group IDs safe to rotate to
  optimalCheeseTypes: string[];
}

export interface PhageRiskEvaluation {
  riskLevel: PhageRiskLevel;
  consecutiveUsesCount: number;
  currentGroupId: string;
  groupName: string;
  warningMessage: string;
  isDeadVatImminent: boolean;
  recommendedGroups: string[];
  sanitationProtocol: string;
}

export interface CultureRotationAdvice {
  currentCulture: string;
  currentGroup: string;
  nextRecommendedCultures: string[];
  availableInPantry: string[];
  rationale: string;
}

/**
 * Standard commercial starter culture taxonomy mapped to phage susceptibility groups
 * (Chr. Hansen, Danisco / IFF, Sacco, Dalton).
 */
export const PHAGE_GROUPS: Record<string, PhageGroupProfile> = {
  GROUP_I_CHN: {
    groupId: 'GROUP_I_CHN',
    groupName: 'Mezofilna Aromatyczna Typ B (Seria CHN)',
    representativeCultures: ['CHN-11', 'CHN-19', 'CHN-22', 'Flora Danica', 'FD-DVS'],
    speciesComposition: [
      'Lactococcus lactis subsp. lactis',
      'Lactococcus lactis subsp. cremoris',
      'Lactococcus lactis subsp. diacetylactis',
      'Leuconostoc mesenteroides',
    ],
    rotationCompatibility: ['GROUP_II_LL', 'GROUP_III_KAZU', 'GROUP_IV_MESO_HOMO'],
    optimalCheeseTypes: ['Gouda', 'Edam', 'Twaróg', 'Koryciński', 'Havarti', 'Camembert'],
  },
  GROUP_II_LL: {
    groupId: 'GROUP_II_LL',
    groupName: 'Mezofilna Typ O/LL (Czysta Kwasząca)',
    representativeCultures: ['R-703', 'R-704', 'MA 11', 'MA 14', 'LL-DVS'],
    speciesComposition: [
      'Lactococcus lactis subsp. lactis',
      'Lactococcus lactis subsp. cremoris',
    ],
    rotationCompatibility: ['GROUP_I_CHN', 'GROUP_III_KAZU', 'GROUP_V_THERMO'],
    optimalCheeseTypes: ['Cheddar', 'Feta', 'Cheshire', 'Quark', 'Sery Twarde'],
  },
  GROUP_III_KAZU: {
    groupId: 'GROUP_III_KAZU',
    groupName: 'Mezofilno-Termofilna Hybrydowa (Seria KAZU / Alpina)',
    representativeCultures: ['KAZU 100', 'ALP DVS', 'MA 4001', 'MA 4002'],
    speciesComposition: [
      'Lactococcus lactis subsp. lactis',
      'Lactococcus lactis subsp. cremoris',
      'Streptococcus thermophilus',
      'Lactobacillus helveticus',
    ],
    rotationCompatibility: ['GROUP_I_CHN', 'GROUP_II_LL', 'GROUP_V_THERMO'],
    optimalCheeseTypes: ['Gruyère', 'Asiago', 'Oscypek Zagrodowy', 'Gouda Dojrzała'],
  },
  GROUP_IV_MESO_HOMO: {
    groupId: 'GROUP_IV_MESO_HOMO',
    groupName: 'Mezofilna Homogeniczna Alternatywna',
    representativeCultures: ['BT-01', 'Probat 222', 'Danstar 1', 'Bio-Flavour'],
    speciesComposition: [
      'Lactococcus lactis subsp. lactis',
      'Lactococcus lactis biovar. diacetylactis',
    ],
    rotationCompatibility: ['GROUP_I_CHN', 'GROUP_II_LL', 'GROUP_III_KAZU'],
    optimalCheeseTypes: ['Twarogi Klinkowe', 'Śmietana', 'Masło', 'Bundz'],
  },
  GROUP_V_THERMO: {
    groupId: 'GROUP_V_THERMO',
    groupName: 'Termofilna Włoska / Szwajcarska (STI / TCC)',
    representativeCultures: ['STI-12', 'STI-14', 'TCC-20', 'LH 100', 'TA 061'],
    speciesComposition: [
      'Streptococcus thermophilus',
      'Lactobacillus delbrueckii subsp. bulgaricus',
      'Lactobacillus helveticus',
    ],
    rotationCompatibility: ['GROUP_I_CHN', 'GROUP_III_KAZU'],
    optimalCheeseTypes: ['Mozzarella', 'Parmigiano', 'Emmentaler', 'Ricotta', 'Caciotta'],
  },
};

/**
 * Identifies the phage group ID based on a culture brand or code name.
 */
export function identifyPhageGroup(cultureName: string): string {
  if (!cultureName || typeof cultureName !== 'string') return 'GROUP_I_CHN';
  const norm = cultureName.trim().toUpperCase();

  for (const [gid, profile] of Object.entries(PHAGE_GROUPS)) {
    for (const rep of profile.representativeCultures) {
      if (norm.includes(rep.toUpperCase()) || rep.toUpperCase().includes(norm)) {
        return gid;
      }
    }
  }

  // Heuristic based on common keywords
  if (norm.includes('THERM') || norm.includes('STI') || norm.includes('LH') || norm.includes('BULGAR')) {
    return 'GROUP_V_THERMO';
  }
  if (norm.includes('KAZU') || norm.includes('ALP') || norm.includes('4001') || norm.includes('4002')) {
    return 'GROUP_III_KAZU';
  }
  if (norm.includes('FLORA') || norm.includes('CHN') || norm.includes('DANICA')) {
    return 'GROUP_I_CHN';
  }
  if (norm.includes('PROBAT') || norm.includes('TWAROG')) {
    return 'GROUP_IV_MESO_HOMO';
  }
  return 'GROUP_II_LL';
}

/**
 * Evaluates the bacteriophage accumulation risk based on chronological usage history.
 */
export function evaluatePhageRisk(recentCultureHistory: string[]): PhageRiskEvaluation {
  if (!recentCultureHistory || recentCultureHistory.length === 0) {
    return {
      riskLevel: 'LOW',
      consecutiveUsesCount: 0,
      currentGroupId: 'GROUP_I_CHN',
      groupName: PHAGE_GROUPS.GROUP_I_CHN.groupName,
      warningMessage: 'Brak wcześniejszych wsadów. Środowisko serowarni wolne od presji fagowej.',
      isDeadVatImminent: false,
      recommendedGroups: ['GROUP_I_CHN', 'GROUP_II_LL', 'GROUP_III_KAZU'],
      sanitationProtocol: 'Standardowe mycie i parzenie kotła serowarskiego w 85°C.',
    };
  }

  const latestCulture = recentCultureHistory[recentCultureHistory.length - 1];
  const currentGroupId = identifyPhageGroup(latestCulture);
  const currentGroup = PHAGE_GROUPS[currentGroupId] || PHAGE_GROUPS.GROUP_I_CHN;

  // Count consecutive uses of cultures from the SAME phage group starting from the end
  let consecutiveCount = 0;
  for (let i = recentCultureHistory.length - 1; i >= 0; i--) {
    const gid = identifyPhageGroup(recentCultureHistory[i]);
    if (gid === currentGroupId) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  let riskLevel: PhageRiskLevel = 'LOW';
  let warningMessage = 'Optymalna rotacja. Presja fagowa na szczepy bakteryjne niska.';
  let isDeadVatImminent = false;
  let sanitationProtocol = 'Standardowe mycie pianowe i termiczna sterylizacja sprzętu serowarskiego.';

  if (consecutiveCount >= 4) {
    riskLevel = 'CRITICAL';
    isDeadVatImminent = true;
    warningMessage = `KRYTYCZNE RYZYKO FAGOWE: Użyto grupy ${currentGroup.groupName} ${consecutiveCount} razy z rzędu! Zagrożenie martwym wsadem (brak spadku pH, słodkie mleko po 2h). Bezwzględnie zmień grupę kultur.`;
    sanitationProtocol = 'Dezynfekcja kwasem nadoctowym (PAA 0.2%) lub roztworem podchlorynu 200 ppm, sterylizacja parowa 90°C przez min. 15 minut kotła i noży serowarskich.';
  } else if (consecutiveCount >= 2) {
    riskLevel = 'MODERATE';
    isDeadVatImminent = false;
    warningMessage = `Umiarkowane ryzyko fagowe: ${consecutiveCount} kolejne wsady z grupy ${currentGroup.groupName}. Zalecana rotacja na kompatybilną grupę przy kolejnym warzeniu.`;
    sanitationProtocol = 'Dokładne mycie alkaliczno-kwasowe oraz wygrzanie chust serowarskich i form w roztworze o pH < 3.0 lub w 85°C.';
  }

  return {
    riskLevel,
    consecutiveUsesCount: consecutiveCount,
    currentGroupId,
    groupName: currentGroup.groupName,
    warningMessage,
    isDeadVatImminent,
    recommendedGroups: currentGroup.rotationCompatibility,
    sanitationProtocol,
  };
}

/**
 * Recommends the next culture to use, prioritizing cultures currently available in the pantry.
 */
export function recommendCultureRotation(
  currentCulture: string,
  availablePantryCultures: string[] = []
): CultureRotationAdvice {
  const currentGroupId = identifyPhageGroup(currentCulture);
  const currentGroup = PHAGE_GROUPS[currentGroupId] || PHAGE_GROUPS.GROUP_I_CHN;
  const safeGroups = currentGroup.rotationCompatibility;

  // Filter pantry cultures that belong to safe groups
  const pantrySafe = availablePantryCultures.filter((c) => {
    const gid = identifyPhageGroup(c);
    return safeGroups.includes(gid) && gid !== currentGroupId;
  });

  // Fallback to representative catalog cultures from safe groups
  const catalogSafe: string[] = [];
  for (const sg of safeGroups) {
    const p = PHAGE_GROUPS[sg];
    if (p) {
      catalogSafe.push(...p.representativeCultures.slice(0, 2));
    }
  }

  const recommendations = pantrySafe.length > 0 ? pantrySafe : catalogSafe;
  const rationale =
    pantrySafe.length > 0
      ? `Znaleziono w Twojej spiżarni ${pantrySafe.length} kultur(y) o odmiennej strukturze fagowej.`
      : `W spiżarni brak bezpiecznych zamienników. Sugerowane kultury z katalogu o odmiennym profilu fagowym.`;

  return {
    currentCulture,
    currentGroup: currentGroup.groupName,
    nextRecommendedCultures: recommendations,
    availableInPantry: pantrySafe,
    rationale,
  };
}
