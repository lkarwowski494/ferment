// ============================================================================
// Apps4Brew Studio — FERMENT Reverse Production Scheduler & Step Timing
// Calculates exact workflow timeline backwards from target completion or forward
// Warns about overnight sleep disruption (anti-fatigue culinary safety)
// ============================================================================

export type CraftProcessType =
  | 'CHEESE_HARD_GOUDA'
  | 'CHEESE_FRESH_KORYCIN'
  | 'CHEESE_PASTA_FILATA_MOZZARELLA'
  | 'KIMCHI_TRADITIONAL'
  | 'KOMBUCHA_1F'
  | 'BEET_KVASS';

export interface TimelineStep {
  id: string;
  name: string;
  durationMinutes: number;
  scheduledTime: Date;
  description: string;
  isCriticalTemp: boolean;
  requiresAttention: boolean;
  fallsDuringNight: boolean; // 23:00 - 06:00
}

export interface ScheduleResult {
  processType: CraftProcessType;
  startTime: Date;
  completionTime: Date;
  totalDurationMinutes: number;
  steps: TimelineStep[];
  hasNightConflict: boolean;
  nightConflictWarnings: string[];
  recommendation: string;
}

interface StepTemplate {
  name: string;
  durationMinutes: number;
  description: string;
  isCriticalTemp: boolean;
  requiresAttention: boolean;
}

const PROCESS_TEMPLATES: Record<CraftProcessType, StepTemplate[]> = {
  CHEESE_HARD_GOUDA: [
    {
      name: 'Podgrzewanie mleka do 32°C',
      durationMinutes: 40,
      description: 'Powolne ogrzewanie w płaszczu wodnym do temp. zaprawienia.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Inokulacja kulturami mezofilnymi',
      durationMinutes: 45,
      description: 'Uwodnienie i namnażanie bakterii kwasu mlekowego, wstępne zakwaszenie.',
      isCriticalTemp: true,
      requiresAttention: false,
    },
    {
      name: 'Zaprawienie podpuszczką & flokulacja',
      durationMinutes: 40,
      description: 'Zestalenie skrzepu według mnożnika Berridge’a.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Krojenie skrzepu i odpoczynek (leczenie ziarna)',
      durationMinutes: 15,
      description: 'Krojenie harfą na ziarno wielkości grochu, 5 min spoczynku.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Pierwsze osuszanie ziarna & odlanie serwatki',
      durationMinutes: 20,
      description: 'Mieszanie i odlanie ok. 30% serwatki.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Płukanie ziarna wodą i dogrzewanie do 38°C',
      durationMinutes: 30,
      description: 'Dolewanie wody o temp. 55-60°C, tempo max 1°C / 2 minuty (Case Hardening Guard).',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Osiadanie pod serwatką & formowanie wstępne',
      durationMinutes: 20,
      description: 'Prasowanie ziarna pod lustrem serwatki zapobiega uwięzieniu pęcherzyków powietrza.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Prasowanie Etap 1 (Lekki nacisk)',
      durationMinutes: 60,
      description: 'Nacisk 1.5 kg / kg sera, po czym odwrócenie i zmiana chusty.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Prasowanie Etap 2 (Średni nacisk)',
      durationMinutes: 180,
      description: 'Nacisk 3.0 kg / kg sera, po czym drugie obrócenie krążka.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Prasowanie Etap 3 (Mocny nacisk końcowy)',
      durationMinutes: 480,
      description: 'Nacisk 5.0 kg / kg sera w celu ostatecznego zamknięcia skórki.',
      isCriticalTemp: false,
      requiresAttention: false,
    },
  ],
  CHEESE_FRESH_KORYCIN: [
    {
      name: 'Ogrzanie mleka do 36°C',
      durationMinutes: 30,
      description: 'Ogrzanie świeżego mleka surowego lub pasteryzowanego.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Dodanie kultur i podpuszczki',
      durationMinutes: 35,
      description: 'Koagulacja do czystego złomu (clean break).',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Krojenie w kostkę i osadzanie',
      durationMinutes: 20,
      description: 'Krojenie na ziarno wielkości orzecha włoskiego.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Przekładanie do form korycińskich & ociekanie',
      durationMinutes: 120,
      description: 'Obracanie krążka co 30 minut dla uzyskania charakterystycznego prążkowania.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
  ],
  CHEESE_PASTA_FILATA_MOZZARELLA: [
    {
      name: 'Zakwaszanie do pH 5.20',
      durationMinutes: 90,
      description: 'Termofilne zakwaszanie mleka niezbędne do ciągliwości kazeiny.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Koagulacja i krojenie skrzepu',
      durationMinutes: 40,
      description: 'Cięcie na grube plastry i odsączanie.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Zaparzanie i rozciąganie w gorącej wodzie (85°C)',
      durationMinutes: 30,
      description: 'Ugniatanie i wyciąganie elastycznego pasma pasty filata.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Formowanie kulek i hartowanie w lodowatej wodzie',
      durationMinutes: 20,
      description: 'Utrwalenie kształtu kulki mozzarella i schłodzenie.',
      isCriticalTemp: true,
      requiresAttention: true,
    },
  ],
  KIMCHI_TRADITIONAL: [
    {
      name: 'Zasalanie kapusty na sucho (Więdnięcie)',
      durationMinutes: 240, // 4 godziny
      description: 'Zasolenie 8.5% soli morskiej, obrócenie ćwiartek po 2 godzinach.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Płukanie i odciekanie kapusty',
      durationMinutes: 60,
      description: '3-krotne płukanie z nadmiaru soli i odsączanie na sicie.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Przygotowanie kleiku ryżowego i pasty Yangnyeom',
      durationMinutes: 45,
      description: 'Gotowanie kleiku, blending z czosnkiem, imbirem, sosem rybnym i gochugaru.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Wcieranie pasty w liście i ciasne ubicie w słoju',
      durationMinutes: 45,
      description: 'Dokładne pokrycie każdego liścia, usunięcie kieszeni powietrznych.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
  ],
  KOMBUCHA_1F: [
    {
      name: 'Parzenie esencji herbacianej i rozpuszczanie cukru',
      durationMinutes: 30,
      description: 'Ekstrakcja garbników i całkowite rozpuszczenie sacharozy.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Schłodzenie naparu poniżej 28°C',
      durationMinutes: 120,
      description: 'Kluczowe: wlanie SCOBY do ciepłego naparu (>32°C) uśmierci symbiotyczne kultury!',
      isCriticalTemp: true,
      requiresAttention: true,
    },
    {
      name: 'Zadanie startera zakwaszającego i grzybka SCOBY',
      durationMinutes: 15,
      description: 'Obniżenie pH wsadu poniżej 4.5 i zabezpieczenie gazy gumką.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
  ],
  BEET_KVASS: [
    {
      name: 'Przygotowanie buraków i przypraw',
      durationMinutes: 30,
      description: 'Mycie, obieranie, krojenie w grube plastry, dodanie czosnku i ziela angielskiego.',
      isCriticalTemp: false,
      requiresAttention: true,
    },
    {
      name: 'Zalanie 2.2% solanką i dociążenie wsadu',
      durationMinutes: 15,
      description: 'Całkowite zanurzenie warzyw pod lustrem płynu (Bariera beztlenowa).',
      isCriticalTemp: false,
      requiresAttention: true,
    },
  ],
};

function isNightHour(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 23 || hour < 6;
}

/**
 * Oblicza harmonogram wsteczny (Reverse Scheduling)
 * Użytkownik podaje oczekiwany czas zakończenia procesu (np. gotowy do prasowania końcowego przed snem)
 */
export function calculateReverseSchedule(
  processType: CraftProcessType,
  targetCompletionTime: Date
): ScheduleResult {
  const templates = PROCESS_TEMPLATES[processType];
  if (!templates || templates.length === 0) {
    throw new Error(`Nieznany proces: ${processType}`);
  }

  const totalDurationMinutes = templates.reduce((sum, s) => sum + s.durationMinutes, 0);
  const startTime = new Date(targetCompletionTime.getTime() - totalDurationMinutes * 60 * 1000);

  let currentCursor = new Date(startTime.getTime());
  const steps: TimelineStep[] = [];
  const nightConflictWarnings: string[] = [];

  templates.forEach((tmpl, idx) => {
    const stepTime = new Date(currentCursor.getTime());
    const stepEndTime = new Date(stepTime.getTime() + tmpl.durationMinutes * 60 * 1000);
    const fallsDuringNight = isNightHour(stepTime) || (tmpl.requiresAttention && isNightHour(stepEndTime));

    if (fallsDuringNight && tmpl.requiresAttention) {
      nightConflictWarnings.push(
        `Krok "${tmpl.name}" przypada w nocy (${stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}). Wymaga uwagi!`
      );
    }

    steps.push({
      id: `step_${idx + 1}`,
      name: tmpl.name,
      durationMinutes: tmpl.durationMinutes,
      scheduledTime: stepTime,
      description: tmpl.description,
      isCriticalTemp: tmpl.isCriticalTemp,
      requiresAttention: tmpl.requiresAttention,
      fallsDuringNight,
    });

    currentCursor = stepEndTime;
  });

  const hasNightConflict = nightConflictWarnings.length > 0;
  let recommendation = 'Harmonogram ułożony optymalnie. Wszystkie kluczowe etapy w ciągu dnia.';
  if (hasNightConflict) {
    recommendation = `Uwaga: harmonogram koliduje ze snem. Rozważ przesunięcie rozpoczęcia na wcześniejszą godzinę (np. o 2-3 godziny wstecz).`;
  }

  return {
    processType,
    startTime,
    completionTime: targetCompletionTime,
    totalDurationMinutes,
    steps,
    hasNightConflict,
    nightConflictWarnings,
    recommendation,
  };
}

/**
 * Oblicza harmonogram w przód (Forward Scheduling) od zadanego czasu startu
 */
export function calculateForwardSchedule(
  processType: CraftProcessType,
  startTime: Date = new Date()
): ScheduleResult {
  const templates = PROCESS_TEMPLATES[processType];
  if (!templates) throw new Error(`Nieznany proces: ${processType}`);

  const totalDurationMinutes = templates.reduce((sum, s) => sum + s.durationMinutes, 0);
  const completionTime = new Date(startTime.getTime() + totalDurationMinutes * 60 * 1000);

  return calculateReverseSchedule(processType, completionTime);
}
