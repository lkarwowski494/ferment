import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { styles } from './calculator.styles';
import { BotulinumSafetyResult, KimchiPrepResult } from '../../core/ferment-engine';
import { LabFermentEvaluation } from '../../core/fermentation-kinetics';
import { Q10KineticsResult } from '../../core/fermentation-q10';
import { CrockHeadspaceResult } from '../../core/crock-headspace';
import { BotanicalSourceId, GarlicPrepMethod, VegCrispnessResult } from '../../core/botanical-extraction';
import { KojiMoistureState } from '../../core/koji-fermentation';
import { NukazukeVegType } from '../../core/nukazuke-engine';
import { LegumeType, TempehResult } from '../../core/tempeh-kinetics';
import { BlackGarlicResult } from '../../core/black-garlic';

import { BotulinumGuardCard } from './BotulinumGuardCard';
import { KimchiCard } from './KimchiCard';
import { Q10AndHeadspaceCard } from './Q10AndHeadspaceCard';
import { CrispnessBotanicalCard } from './CrispnessBotanicalCard';
import { KojiAmazakeCard, KojiCalcState } from './KojiAmazakeCard';
import { NukadokoCard, NukadokoCalcState } from './NukadokoCard';
import { TempehCard } from './TempehCard';
import { BlackGarlicCard } from './BlackGarlicCard';

interface VegCraftSectionProps {
  vegGrams: number;
  setVegGrams: (v: number) => void;
  waterGrams: number;
  setWaterGrams: (v: number) => void;
  targetSalinity: number;
  setTargetSalinity: (v: number) => void;
  totalSalinityCalc: { saltGrams: number; effectiveSalinityPct: number; totalMassGrams: number };
  isProExpanded: boolean;
  setIsProExpanded: (v: boolean) => void;

  measuredPh: number;
  setMeasuredPh: (v: number) => void;
  fermentHours: number;
  setFermentHours: (v: number) => void;
  botulinumSafety: BotulinumSafetyResult;
  labKineticsCalc: LabFermentEvaluation;

  cabbageGrams: number;
  setCabbageGrams: (v: number) => void;
  kimchiPrep: KimchiPrepResult;

  ambientTempC: number;
  setAmbientTempC: (v: number) => void;
  q10VegCalc: Q10KineticsResult | null;
  jarCapacityMl: number;
  setJarCapacityMl: (v: number) => void;
  stoneWeightGrams: number;
  setStoneWeightGrams: (v: number) => void;
  crockHeadspaceCalc: CrockHeadspaceResult | null;

  selectedBotanical: BotanicalSourceId;
  setSelectedBotanical: (v: BotanicalSourceId) => void;
  botanicalGrams: number;
  setBotanicalGrams: (v: number) => void;
  garlicGramsInput: number;
  setGarlicGramsInput: (v: number) => void;
  garlicPrepInput: GarlicPrepMethod;
  setGarlicPrepInput: (v: GarlicPrepMethod) => void;
  vegCrispnessCalc: VegCrispnessResult | null;

  kojiMode: 'SHIO_KOJI' | 'AMAZAKE' | 'MISO';
  setKojiMode: (v: 'SHIO_KOJI' | 'AMAZAKE' | 'MISO') => void;
  kojiMassGrams: number;
  setKojiMassGrams: (v: number) => void;
  kojiState: KojiMoistureState;
  setKojiState: (v: KojiMoistureState) => void;
  kojiTempC: number;
  setKojiTempC: (v: number) => void;
  amazakeCookedRiceGrams: number;
  setAmazakeCookedRiceGrams: (v: number) => void;
  amazakeTempC: number;
  setAmazakeTempC: (v: number) => void;
  misoSoyGrams: number;
  setMisoSoyGrams: (v: number) => void;
  misoTypeInput: 'SHIRO_MISO' | 'AKAMISO';
  setMisoTypeInput: (v: 'SHIRO_MISO' | 'AKAMISO') => void;
  kojiCalc: KojiCalcState;

  nukadokoTab: 'SETUP' | 'MAINTENANCE' | 'VEG_TIME';
  setNukadokoTab: (v: 'SETUP' | 'MAINTENANCE' | 'VEG_TIME') => void;
  nukaBranGrams: number;
  setNukaBranGrams: (v: number) => void;
  nukaBedMassGrams: number;
  setNukaBedMassGrams: (v: number) => void;
  nukaSalinityPct: number;
  setNukaSalinityPct: (v: number) => void;
  nukaMoistureStatus: 'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY';
  setNukaMoistureStatus: (v: 'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY') => void;
  nukaSelectedVeg: NukazukeVegType;
  setNukaSelectedVeg: (v: NukazukeVegType) => void;
  nukadokoCalc: NukadokoCalcState;

  tempehLegumeType: LegumeType;
  setTempehLegumeType: (v: LegumeType) => void;
  tempehDryGrams: number;
  setTempehDryGrams: (v: number) => void;
  tempehVinegarMl: number;
  setTempehVinegarMl: (v: number) => void;
  tempehHours: number;
  setTempehHours: (v: number) => void;
  tempehCoreTempC: number;
  setTempehCoreTempC: (v: number) => void;
  tempehCalc: TempehResult | null;

  bgRawGrams: number;
  setBgRawGrams: (v: number) => void;
  bgCurrentDay: number;
  setBgCurrentDay: (v: number) => void;
  bgChamberTempC: number;
  setBgChamberTempC: (v: number) => void;
  bgChamberRhPct: number;
  setBgChamberRhPct: (v: number) => void;
  blackGarlicCalc: BlackGarlicResult | null;
}

export const VegCraftSection: React.FC<VegCraftSectionProps> = ({
  vegGrams,
  setVegGrams,
  waterGrams,
  setWaterGrams,
  targetSalinity,
  setTargetSalinity,
  totalSalinityCalc,
  isProExpanded,
  setIsProExpanded,
  measuredPh,
  setMeasuredPh,
  fermentHours,
  setFermentHours,
  botulinumSafety,
  labKineticsCalc,
  cabbageGrams,
  setCabbageGrams,
  kimchiPrep,
  ambientTempC,
  setAmbientTempC,
  q10VegCalc,
  jarCapacityMl,
  setJarCapacityMl,
  stoneWeightGrams,
  setStoneWeightGrams,
  crockHeadspaceCalc,
  selectedBotanical,
  setSelectedBotanical,
  botanicalGrams,
  setBotanicalGrams,
  garlicGramsInput,
  setGarlicGramsInput,
  garlicPrepInput,
  setGarlicPrepInput,
  vegCrispnessCalc,
  kojiMode,
  setKojiMode,
  kojiMassGrams,
  setKojiMassGrams,
  kojiState,
  setKojiState,
  kojiTempC,
  setKojiTempC,
  amazakeCookedRiceGrams,
  setAmazakeCookedRiceGrams,
  amazakeTempC,
  setAmazakeTempC,
  misoSoyGrams,
  setMisoSoyGrams,
  misoTypeInput,
  setMisoTypeInput,
  kojiCalc,
  nukadokoTab,
  setNukadokoTab,
  nukaBranGrams,
  setNukaBranGrams,
  nukaBedMassGrams,
  setNukaBedMassGrams,
  nukaSalinityPct,
  setNukaSalinityPct,
  nukaMoistureStatus,
  setNukaMoistureStatus,
  nukaSelectedVeg,
  setNukaSelectedVeg,
  nukadokoCalc,
  tempehLegumeType,
  setTempehLegumeType,
  tempehDryGrams,
  setTempehDryGrams,
  tempehVinegarMl,
  setTempehVinegarMl,
  tempehHours,
  setTempehHours,
  tempehCoreTempC,
  setTempehCoreTempC,
  tempehCalc,
  bgRawGrams,
  setBgRawGrams,
  bgCurrentDay,
  setBgCurrentDay,
  bgChamberTempC,
  setBgChamberTempC,
  bgChamberRhPct,
  setBgChamberRhPct,
  blackGarlicCalc,
}) => {
  return (
    <View style={styles.craftSection}>
      <Text style={styles.sectionHeader}>{t('Kalkulator Solanki Warzywnej')}</Text>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.inputLabel}>{t('Masa warzyw (g):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(vegGrams)}
            onChangeText={(v) => setVegGrams(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inputLabel}>{t('Masa wody do zalewy (g):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(waterGrams)}
            onChangeText={(v) => setWaterGrams(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inputLabel}>{t('Docelowe stężenie soli (%):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(targetSalinity)}
            onChangeText={(v) => setTargetSalinity(parseFloat(v) || 0)}
          />
        </View>
      </View>

      <View style={styles.resultsGrid}>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Wymagana Sól Całkowita')}</Text>
          <Text style={styles.resultValueHighlight}>{totalSalinityCalc.saltGrams} g</Text>
          <Text style={styles.resultSub}>
            {totalSalinityCalc.effectiveSalinityPct}% {t('masy wsadu')}
          </Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Masa Całkowita Wsadu')}</Text>
          <Text style={styles.resultValue}>{totalSalinityCalc.totalMassGrams} g</Text>
          <Text style={styles.resultSub}>{t('warzywa + woda')}</Text>
        </View>
      </View>

      {/* Pro Accordion for Veg */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => {
          triggerHapticFeedback();
          setIsProExpanded(!isProExpanded);
        }}
        accessibilityRole="button"
      >
        <Text style={styles.accordionTitle}>
          🔬 {t('Zaawansowane Parametry Biochemiczne')}
        </Text>
        <Text style={styles.accordionArrow}>{isProExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isProExpanded && (
        <View style={styles.proAccordionBody}>
          <BotulinumGuardCard
            measuredPh={measuredPh}
            setMeasuredPh={setMeasuredPh}
            fermentHours={fermentHours}
            setFermentHours={setFermentHours}
            botulinumSafety={botulinumSafety}
            labKineticsCalc={labKineticsCalc}
          />
          <KimchiCard
            cabbageGrams={cabbageGrams}
            setCabbageGrams={setCabbageGrams}
            kimchiPrep={kimchiPrep}
          />
          <Q10AndHeadspaceCard
            ambientTempC={ambientTempC}
            setAmbientTempC={setAmbientTempC}
            q10VegCalc={q10VegCalc}
            jarCapacityMl={jarCapacityMl}
            setJarCapacityMl={setJarCapacityMl}
            stoneWeightGrams={stoneWeightGrams}
            setStoneWeightGrams={setStoneWeightGrams}
            crockHeadspaceCalc={crockHeadspaceCalc}
          />
          <CrispnessBotanicalCard
            selectedBotanical={selectedBotanical}
            setSelectedBotanical={setSelectedBotanical}
            botanicalGrams={botanicalGrams}
            setBotanicalGrams={setBotanicalGrams}
            garlicGramsInput={garlicGramsInput}
            setGarlicGramsInput={setGarlicGramsInput}
            garlicPrepInput={garlicPrepInput}
            setGarlicPrepInput={setGarlicPrepInput}
            vegCrispnessCalc={vegCrispnessCalc}
          />
          <KojiAmazakeCard
            kojiMode={kojiMode}
            setKojiMode={setKojiMode}
            kojiMassGrams={kojiMassGrams}
            setKojiMassGrams={setKojiMassGrams}
            kojiState={kojiState}
            setKojiState={setKojiState}
            kojiTempC={kojiTempC}
            setKojiTempC={setKojiTempC}
            amazakeCookedRiceGrams={amazakeCookedRiceGrams}
            setAmazakeCookedRiceGrams={setAmazakeCookedRiceGrams}
            amazakeTempC={amazakeTempC}
            setAmazakeTempC={setAmazakeTempC}
            misoSoyGrams={misoSoyGrams}
            setMisoSoyGrams={setMisoSoyGrams}
            misoTypeInput={misoTypeInput}
            setMisoTypeInput={setMisoTypeInput}
            kojiCalc={kojiCalc}
          />
          <NukadokoCard
            nukadokoTab={nukadokoTab}
            setNukadokoTab={setNukadokoTab}
            nukaBranGrams={nukaBranGrams}
            setNukaBranGrams={setNukaBranGrams}
            nukaBedMassGrams={nukaBedMassGrams}
            setNukaBedMassGrams={setNukaBedMassGrams}
            nukaSalinityPct={nukaSalinityPct}
            setNukaSalinityPct={setNukaSalinityPct}
            nukaMoistureStatus={nukaMoistureStatus}
            setNukaMoistureStatus={setNukaMoistureStatus}
            nukaSelectedVeg={nukaSelectedVeg}
            setNukaSelectedVeg={setNukaSelectedVeg}
            ambientTempC={ambientTempC}
            nukadokoCalc={nukadokoCalc}
          />
          <TempehCard
            legumeType={tempehLegumeType}
            setLegumeType={setTempehLegumeType}
            dryGrams={tempehDryGrams}
            setDryGrams={setTempehDryGrams}
            vinegarMl={tempehVinegarMl}
            setVinegarMl={setTempehVinegarMl}
            incubationHours={tempehHours}
            setIncubationHours={setTempehHours}
            coreTempC={tempehCoreTempC}
            setCoreTempC={setTempehCoreTempC}
            tempehCalc={tempehCalc}
          />
          <BlackGarlicCard
            rawGrams={bgRawGrams}
            setRawGrams={setBgRawGrams}
            currentDay={bgCurrentDay}
            setCurrentDay={setBgCurrentDay}
            chamberTempC={bgChamberTempC}
            setChamberTempC={setBgChamberTempC}
            chamberRhPct={bgChamberRhPct}
            setChamberRhPct={setBgChamberRhPct}
            blackGarlicCalc={blackGarlicCalc}
          />
        </View>
      )}
    </View>
  );
};
