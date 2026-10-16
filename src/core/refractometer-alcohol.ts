// ============================================================================
// Apps4Brew Studio — FERMENT Optical Refractometer & Alcohol Correction Engine
// Terrill/Standard polynomial Brix-to-SG conversion, ethanol distortion & biological limits
// ============================================================================

export interface RefractometerReadingParams {
  originalBrix: number;  // Initial raw refractometer reading before fermentation (°Bx)
  currentBrix: number;   // Current raw refractometer reading (°Bx)
  wortCorrectionFactor?: number; // WCF: typically 1.00 for kombucha/juices, 1.04 for malt
  purpose: 'VINEGAR_CIDER' | 'KOMBUCHA' | 'FRUIT_WINE';
}

export interface RefractometerAnalysisResult {
  originalBrix: number;
  currentBrix: number;
  originalSg: number;         // Initial Specific Gravity (e.g. 1.048)
  correctedFinalSg: number;   // Corrected true Specific Gravity (e.g. 1.010)
  apparentAttenuationPct: number; // e.g. 78.5%
  realExtractPlato: number;   // True residual extract without alcohol optical distortion (°P / °Bx)
  abvPct: number;             // Alcohol By Volume %
  classification: string;
  isVinegarSafe: boolean;     // <= 8.0% ABV
  isNonAlcoholicKombucha: boolean; // <= 0.5% ABV
  recommendation: string;
  warnings: string[];
}

/**
 * Converts pure unfermented Brix to Specific Gravity
 */
export function brixToSg(brix: number): number {
  if (brix <= 0) return 1.000;
  // Standard polynomial: SG = 1 + (Brix / (258.6 - ((Brix / 258.2) * 227.1)))
  const sg = 1.0 + brix / (258.6 - (brix / 258.2) * 227.1);
  return Math.round(sg * 1000) / 1000;
}

/**
 * Corrects optical refractometer reading in the presence of alcohol using Terrill formulas
 */
export function analyzeRefractometerBrix(params: RefractometerReadingParams): RefractometerAnalysisResult {
  const { originalBrix, currentBrix, wortCorrectionFactor = 1.00, purpose } = params;

  if (originalBrix <= 0) {
    throw new Error('Początkowy ekstrakt Brix musi być większy od zera.');
  }
  if (currentBrix < 0) {
    throw new Error('Aktualny odczyt Brix nie może być ujemny.');
  }

  const ob = originalBrix / wortCorrectionFactor;
  const fb = currentBrix;

  // 1. Calculate Original SG
  const originalSg = brixToSg(ob);

  if (fb >= ob) {
    return {
      originalBrix,
      currentBrix,
      originalSg,
      correctedFinalSg: originalSg,
      apparentAttenuationPct: 0,
      realExtractPlato: originalBrix,
      abvPct: 0,
      classification: purpose === 'KOMBUCHA' ? 'Kombucha Bezalkoholowa (<=0.5% ABV)' : 'Brak fermentacji (0.0% ABV)',
      isVinegarSafe: true,
      isNonAlcoholicKombucha: true,
      recommendation: 'Brak spadku ekstraktu — fermentacja jeszcze się nie rozpoczęła.',
      warnings: [],
    };
  }

  let correctedSg: number;
  let abvPct: number;
  let realExtractPlato: number;

  if (ob < 8.0) {
    // Low-gravity solutions (kombucha, light must): linear stoichiometry prevents Terrill cubic divergence
    const deltaBrix = Math.max(0, ob - fb);
    const rawAbv = deltaBrix * 0.58;
    abvPct = Math.max(0, Math.round(rawAbv * 10) / 10);
    correctedSg = Math.round((originalSg - abvPct / 131.25) * 1000) / 1000;
    realExtractPlato = Math.max(0, Math.round((fb - abvPct * 0.18) * 10) / 10);
  } else {
    // Standard Terrill corrected Final Specific Gravity formula for ciders and wines (OB >= 8.0):
    // FG = 1.0000 - 0.004493 * OB + 0.011774 * FB + 0.00027581 * OB^2 - 0.0012717 * FB^2 - 0.00000728 * OB^3 + 0.000063293 * FB^3
    let terrillSg =
      1.0000 -
      0.004493 * ob +
      0.011774 * fb +
      0.00027581 * Math.pow(ob, 2) -
      0.0012717 * Math.pow(fb, 2) -
      0.00000728 * Math.pow(ob, 3) +
      0.000063293 * Math.pow(fb, 3);

    correctedSg = Math.max(0.990, Math.min(originalSg, Math.round(terrillSg * 1000) / 1000));
    const rawAbv = (originalSg - correctedSg) * 131.25;
    abvPct = Math.max(0, Math.round(rawAbv * 10) / 10);
    realExtractPlato = Math.max(0, Math.round((0.1808 * ob + 0.8192 * fb) * 10) / 10);
  }

  // 5. Apparent Attenuation
  const apparentAttenuationPct =
    originalSg > 1.000
      ? Math.max(0, Math.min(100, Math.round(((originalSg - correctedSg) / (originalSg - 1.000)) * 1000) / 10))
      : 0;

  const warnings: string[] = [];
  let classification = '';
  let recommendation = '';
  const isVinegarSafe = abvPct <= 8.0;
  const isNonAlcoholicKombucha = abvPct <= 0.5;

  if (purpose === 'VINEGAR_CIDER') {
    if (abvPct > 8.0) {
      classification = 'Toksyczność Alkoholowa dla Octowników (>8.0% ABV)';
      warnings.push(
        'KRYTYCZNE ZAGROŻENIE DLA MATKI OCTOWEJ! Stężenie alkoholu przekracza 8.0% ABV. Bakterie kwasu octowego (Acetobacter) ulegają porażeniu i obumierają.'
      );
      recommendation =
        'Rozcieńcz nastaw przegotowaną wodą do stężenia 5.0–6.0% ABV przed dodaniem matki octowej lub żywego octu startowego.';
    } else if (abvPct < 4.0) {
      classification = 'Zbyt Niski Potencjał Kwasowy (<4.0% ABV)';
      warnings.push(
        'Niska zawartość alkoholu. Wyprodukowany ocet będzie miał moc poniżej 4% kwasu octowego, co obniża jego trwałość biologiczną.'
      );
      recommendation =
        'Dla uzyskania stabilnego octu spożywczego (5–6% kwasowości) optymalny wsad cydrowy/winny powinien mieć 5.5–6.5% ABV.';
    } else {
      classification = 'Idealny Wsad Octowy (4.0–8.0% ABV)';
      recommendation =
        'Prawidłowe stężenie alkoholu. Zapewnij ciągły dostęp powietrza (gaza bawełniana) i temperaturę 22–26°C dla optymalnego utleniania do kwasu octowego.';
    }
  } else if (purpose === 'KOMBUCHA') {
    if (abvPct > 1.2) {
      classification = 'Wysoki Alkohol w Kombuchy (>1.2% ABV)';
      warnings.push(
        'Podwyższone stężenie alkoholu. Drożdże zdominowały bakterie kwasu octowego (za ciepło lub za dużo cukru w 2F).'
      );
      recommendation =
        'Skróć czas refermentacji butelkowej (2F) lub przenieś butelki do lodówki (4°C). Zwiększ dostęp tlenu w 1F.';
    } else if (isNonAlcoholicKombucha) {
      classification = 'Kombucha Bezalkoholowa (<=0.5% ABV)';
      recommendation =
        'Bezpieczny poziom alkoholu zgodny ze standardem napojów bezalkoholowych. Odpowiednia dla kierowców.';
    } else {
      classification = 'Standardowa Kombucha Domowa (0.6–1.2% ABV)';
      recommendation =
        'Naturalny poziom alkoholu powstający w domowej refermentacji butelkowej 2F z sokami owocowymi.';
    }
  } else {
    classification = `Wino Owocowe / Cydr (${abvPct}% ABV)`;
    recommendation = `Rzeczywisty ekstrakt końcowy: ${realExtractPlato}°Bx. Gęstość pozorna: ${correctedSg.toFixed(3)}.`;
  }

  return {
    originalBrix,
    currentBrix,
    originalSg,
    correctedFinalSg: correctedSg,
    apparentAttenuationPct,
    realExtractPlato,
    abvPct,
    classification,
    isVinegarSafe,
    isNonAlcoholicKombucha,
    recommendation,
    warnings,
  };
}
