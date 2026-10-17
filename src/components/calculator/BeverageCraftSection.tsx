import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { styles } from './calculator.styles';
import { KombuchaBottleType, Kombucha2FBlendingResult } from '../../core/kombucha-blending';
import { VinegarConversionResult } from '../../core/ferment-engine';
import { VinegarTitrationResult } from '../../core/fermentation-kinetics';
import { Q10KineticsResult } from '../../core/fermentation-q10';
import { RefractometerAnalysisResult } from '../../core/refractometer-alcohol';
import { LiveCultureType, CultureHotelResult } from '../../core/culture-hotel-engine';
import { TeaBaseType, HarvestPlan } from '../../core/continuous-brew';
import { PasteurizationTargetCategory, PasteurizationResult } from '../../core/pasteurization-units';
import {
  VinegarDilutionResult,
  VinegarStoichiometryResult,
  VesselAerationResult,
} from '../../core/vinegar-standardization';
import { KefirMediumType, Kefir1FResult, Kefir2FResult } from '../../core/kefir-grains';
import { PolishMeadGrade, MeadPreparationType, MeadBatchResult } from '../../core/mead-kinetics';
import { GingerBugFeedingResult, GingerBeerBatchResult } from '../../core/ginger-bug';

import { Kombucha2FBlendingCard } from './Kombucha2FBlendingCard';
import { VinegarTitrationCard } from './VinegarTitrationCard';
import { KombuchaQ10RefractometerCard } from './KombuchaQ10RefractometerCard';
import { ScobyHotelCard } from './ScobyHotelCard';
import { ContinuousBrewCard } from './ContinuousBrewCard';
import { PasteurizationUnitsCard } from './PasteurizationUnitsCard';
import { VinegarStandardizationCard } from './VinegarStandardizationCard';
import { KefirGrainsCard } from './KefirGrainsCard';
import { MeadCard } from './MeadCard';
import { GingerBugCard } from './GingerBugCard';

interface BeverageCraftSectionProps {
  kombuchaWaterLiters: number;
  setKombuchaWaterLiters: React.Dispatch<React.SetStateAction<number>>;
  kombucha1F: { teaGrams: number; sugarGrams: number; starterLiquidMl: number };
  isProExpanded: boolean;
  setIsProExpanded: (v: boolean) => void;

  selectedJuiceId: string;
  setSelectedJuiceId: (v: string) => void;
  juiceVolumeMl: number;
  setJuiceVolumeMl: (v: number) => void;
  kombuchaBottleType: KombuchaBottleType;
  setKombuchaBottleType: (v: KombuchaBottleType) => void;
  daysIn2F: number;
  setDaysIn2F: (v: number) => void;
  kombuchaBlendingCalc: Kombucha2FBlendingResult;

  vinegarBrix: number;
  setVinegarBrix: (v: number) => void;
  vinegarCalc: VinegarConversionResult;
  vinegarSampleMl: number;
  setVinegarSampleMl: (v: number) => void;
  naohTiterMl: number;
  setNaohTiterMl: (v: number) => void;
  vinegarTitrationCalc: VinegarTitrationResult;

  ambientTempC: number;
  setAmbientTempC: (v: number) => void;
  q10KombuchaCalc: Q10KineticsResult | null;
  originalBrixInput: number;
  setOriginalBrixInput: (v: number) => void;
  currentBrixInput: number;
  setCurrentBrixInput: (v: number) => void;
  refractometerAlcoholCalc: RefractometerAnalysisResult | null;

  hotelCultureType: LiveCultureType;
  setHotelCultureType: (v: LiveCultureType) => void;
  hotelDaysSinceFed: number;
  setHotelDaysSinceFed: (v: number) => void;
  hotelVolumeMl: number;
  setHotelVolumeMl: (v: number) => void;
  hotelSludgeDepthCm: number;
  setHotelSludgeDepthCm: (v: number) => void;
  cultureHotelCalc: CultureHotelResult | null;

  cbVesselLiters: number;
  setCbVesselLiters: (v: number) => void;
  cbDrawLiters: number;
  setCbDrawLiters: (v: number) => void;
  cbTempCelsius: number;
  setCbTempCelsius: (v: number) => void;
  cbCyclesSincePurge: number;
  setCbCyclesSincePurge: (v: number) => void;
  cbPreDrawPh: number;
  setCbPreDrawPh: (v: number) => void;
  cbTeaBase: TeaBaseType;
  setCbTeaBase: (v: TeaBaseType) => void;
  continuousBrewPlan: HarvestPlan | null;

  puCategory: PasteurizationTargetCategory;
  setPuCategory: (v: PasteurizationTargetCategory) => void;
  puWaterBathTempC: number;
  setPuWaterBathTempC: (v: number) => void;
  puHoldMinutes: number;
  setPuHoldMinutes: (v: number) => void;
  puBottleVolumeMl: number;
  setPuBottleVolumeMl: (v: number) => void;
  puPlanCalc: PasteurizationResult | null;

  vinRawAcidity: number;
  setVinRawAcidity: (v: number) => void;
  vinRawVolumeL: number;
  setVinRawVolumeL: (v: number) => void;
  vinTargetAcidity: number;
  setVinTargetAcidity: (v: number) => void;
  vinVesselDiameterCm: number;
  setVinVesselDiameterCm: (v: number) => void;
  vinInitialAbv: number;
  setVinInitialAbv: (v: number) => void;
  vinegarStdCalc: VinegarDilutionResult | null;
  vinegarStoichCalc: VinegarStoichiometryResult | null;
  vinegarAerationCalc: VesselAerationResult | null;

  kefirMedium: KefirMediumType;
  setKefirMedium: (v: KefirMediumType) => void;
  kefirLiquidVolumeMl: number;
  setKefirLiquidVolumeMl: (v: number) => void;
  kefirGrainWeightGrams: number;
  setKefirGrainWeightGrams: (v: number) => void;
  kefir1FCalc: Kefir1FResult | null;
  kefir2FCalc: Kefir2FResult | null;

  meadGrade: PolishMeadGrade;
  setMeadGrade: (v: PolishMeadGrade) => void;
  meadTargetVolumeL: number;
  setMeadTargetVolumeL: (v: number) => void;
  meadPrepType: MeadPreparationType;
  setMeadPrepType: (v: MeadPreparationType) => void;
  meadCalc: MeadBatchResult | null;

  gbStarterDays: number;
  setGbStarterDays: (v: number) => void;
  gbDaysSinceFeed: number;
  setGbDaysSinceFeed: (v: number) => void;
  gbHasBubbles: boolean;
  setGbHasBubbles: (v: boolean) => void;
  gbBatchVolumeL: number;
  setGbBatchVolumeL: (v: number) => void;
  gbHoursInBottle: number;
  setGbHoursInBottle: (v: number) => void;
  gingerBugStarterCalc: GingerBugFeedingResult | null;
  gingerBeerBatchCalc: GingerBeerBatchResult | null;
}

export const BeverageCraftSection: React.FC<BeverageCraftSectionProps> = ({
  kombuchaWaterLiters,
  setKombuchaWaterLiters,
  kombucha1F,
  isProExpanded,
  setIsProExpanded,
  selectedJuiceId,
  setSelectedJuiceId,
  juiceVolumeMl,
  setJuiceVolumeMl,
  kombuchaBottleType,
  setKombuchaBottleType,
  daysIn2F,
  setDaysIn2F,
  kombuchaBlendingCalc,
  vinegarBrix,
  setVinegarBrix,
  vinegarCalc,
  vinegarSampleMl,
  setVinegarSampleMl,
  naohTiterMl,
  setNaohTiterMl,
  vinegarTitrationCalc,
  ambientTempC,
  setAmbientTempC,
  q10KombuchaCalc,
  originalBrixInput,
  setOriginalBrixInput,
  currentBrixInput,
  setCurrentBrixInput,
  refractometerAlcoholCalc,
  hotelCultureType,
  setHotelCultureType,
  hotelDaysSinceFed,
  setHotelDaysSinceFed,
  hotelVolumeMl,
  setHotelVolumeMl,
  hotelSludgeDepthCm,
  setHotelSludgeDepthCm,
  cultureHotelCalc,
  cbVesselLiters,
  setCbVesselLiters,
  cbDrawLiters,
  setCbDrawLiters,
  cbTempCelsius,
  setCbTempCelsius,
  cbCyclesSincePurge,
  setCbCyclesSincePurge,
  cbPreDrawPh,
  setCbPreDrawPh,
  cbTeaBase,
  setCbTeaBase,
  continuousBrewPlan,
  puCategory,
  setPuCategory,
  puWaterBathTempC,
  setPuWaterBathTempC,
  puHoldMinutes,
  setPuHoldMinutes,
  puBottleVolumeMl,
  setPuBottleVolumeMl,
  puPlanCalc,
  vinRawAcidity,
  setVinRawAcidity,
  vinRawVolumeL,
  setVinRawVolumeL,
  vinTargetAcidity,
  setVinTargetAcidity,
  vinVesselDiameterCm,
  setVinVesselDiameterCm,
  vinInitialAbv,
  setVinInitialAbv,
  vinegarStdCalc,
  vinegarStoichCalc,
  vinegarAerationCalc,
  kefirMedium,
  setKefirMedium,
  kefirLiquidVolumeMl,
  setKefirLiquidVolumeMl,
  kefirGrainWeightGrams,
  setKefirGrainWeightGrams,
  kefir1FCalc,
  kefir2FCalc,
  meadGrade,
  setMeadGrade,
  meadTargetVolumeL,
  setMeadTargetVolumeL,
  meadPrepType,
  setMeadPrepType,
  meadCalc,
  gbStarterDays,
  setGbStarterDays,
  gbDaysSinceFeed,
  setGbDaysSinceFeed,
  gbHasBubbles,
  setGbHasBubbles,
  gbBatchVolumeL,
  setGbBatchVolumeL,
  gbHoursInBottle,
  setGbHoursInBottle,
  gingerBugStarterCalc,
  gingerBeerBatchCalc,
}) => {
  return (
    <View style={styles.craftSection}>
      <Text style={styles.sectionHeader}>{t('Kalkulator Kombuchy 1F')}</Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>{t('Objętość nastawu wody (L):')}</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setKombuchaWaterLiters((p) => Math.max(1, p - 1));
            }}
          >
            <Text style={styles.stepperBtnText}>-1</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{kombuchaWaterLiters} L</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setKombuchaWaterLiters((p) => p + 1);
            }}
          >
            <Text style={styles.stepperBtnText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsGrid}>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Herbata')}</Text>
          <Text style={styles.resultValueHighlight}>{kombucha1F.teaGrams} g</Text>
          <Text style={styles.resultSub}>7 g / litr</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Cukier')}</Text>
          <Text style={styles.resultValueHighlight}>{kombucha1F.sugarGrams} g</Text>
          <Text style={styles.resultSub}>65 g / litr</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Starter SCOBY')}</Text>
          <Text style={styles.resultValue}>{kombucha1F.starterLiquidMl} ml</Text>
          <Text style={styles.resultSub}>12% {t('objętości')}</Text>
        </View>
      </View>

      {/* Pro Accordion for Beverage */}
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
          <Kombucha2FBlendingCard
            selectedJuiceId={selectedJuiceId}
            setSelectedJuiceId={setSelectedJuiceId}
            juiceVolumeMl={juiceVolumeMl}
            setJuiceVolumeMl={setJuiceVolumeMl}
            kombuchaBottleType={kombuchaBottleType}
            setKombuchaBottleType={setKombuchaBottleType}
            daysIn2F={daysIn2F}
            setDaysIn2F={setDaysIn2F}
            kombuchaBlendingCalc={kombuchaBlendingCalc}
          />
          <VinegarTitrationCard
            vinegarBrix={vinegarBrix}
            setVinegarBrix={setVinegarBrix}
            vinegarCalc={vinegarCalc}
            vinegarSampleMl={vinegarSampleMl}
            setVinegarSampleMl={setVinegarSampleMl}
            naohTiterMl={naohTiterMl}
            setNaohTiterMl={setNaohTiterMl}
            vinegarTitrationCalc={vinegarTitrationCalc}
          />
          <KombuchaQ10RefractometerCard
            ambientTempC={ambientTempC}
            setAmbientTempC={setAmbientTempC}
            q10KombuchaCalc={q10KombuchaCalc}
            originalBrixInput={originalBrixInput}
            setOriginalBrixInput={setOriginalBrixInput}
            currentBrixInput={currentBrixInput}
            setCurrentBrixInput={setCurrentBrixInput}
            refractometerAlcoholCalc={refractometerAlcoholCalc}
          />
          <ScobyHotelCard
            hotelCultureType={hotelCultureType}
            setHotelCultureType={setHotelCultureType}
            hotelDaysSinceFed={hotelDaysSinceFed}
            setHotelDaysSinceFed={setHotelDaysSinceFed}
            hotelVolumeMl={hotelVolumeMl}
            setHotelVolumeMl={setHotelVolumeMl}
            hotelSludgeDepthCm={hotelSludgeDepthCm}
            setHotelSludgeDepthCm={setHotelSludgeDepthCm}
            cultureHotelCalc={cultureHotelCalc}
          />
          <ContinuousBrewCard
            cbVesselLiters={cbVesselLiters}
            setCbVesselLiters={setCbVesselLiters}
            cbDrawLiters={cbDrawLiters}
            setCbDrawLiters={setCbDrawLiters}
            cbTempCelsius={cbTempCelsius}
            setCbTempCelsius={setCbTempCelsius}
            cbCyclesSincePurge={cbCyclesSincePurge}
            setCbCyclesSincePurge={setCbCyclesSincePurge}
            cbPreDrawPh={cbPreDrawPh}
            setCbPreDrawPh={setCbPreDrawPh}
            cbTeaBase={cbTeaBase}
            setCbTeaBase={setCbTeaBase}
            continuousBrewPlan={continuousBrewPlan}
          />
          <PasteurizationUnitsCard
            puCategory={puCategory}
            setPuCategory={setPuCategory}
            puWaterBathTempC={puWaterBathTempC}
            setPuWaterBathTempC={setPuWaterBathTempC}
            puHoldMinutes={puHoldMinutes}
            setPuHoldMinutes={setPuHoldMinutes}
            puBottleVolumeMl={puBottleVolumeMl}
            setPuBottleVolumeMl={setPuBottleVolumeMl}
            puPlanCalc={puPlanCalc}
          />
          <VinegarStandardizationCard
            vinRawAcidity={vinRawAcidity}
            setVinRawAcidity={setVinRawAcidity}
            vinRawVolumeL={vinRawVolumeL}
            setVinRawVolumeL={setVinRawVolumeL}
            vinTargetAcidity={vinTargetAcidity}
            setVinTargetAcidity={setVinTargetAcidity}
            vinVesselDiameterCm={vinVesselDiameterCm}
            setVinVesselDiameterCm={setVinVesselDiameterCm}
            vinInitialAbv={vinInitialAbv}
            setVinInitialAbv={setVinInitialAbv}
            vinegarStdCalc={vinegarStdCalc}
            vinegarStoichCalc={vinegarStoichCalc}
            vinegarAerationCalc={vinegarAerationCalc}
          />
          <KefirGrainsCard
            kefirMedium={kefirMedium}
            setKefirMedium={setKefirMedium}
            kefirLiquidVolumeMl={kefirLiquidVolumeMl}
            setKefirLiquidVolumeMl={setKefirLiquidVolumeMl}
            kefirGrainWeightGrams={kefirGrainWeightGrams}
            setKefirGrainWeightGrams={setKefirGrainWeightGrams}
            ambientTempC={ambientTempC}
            kefir1FCalc={kefir1FCalc}
            kefir2FCalc={kefir2FCalc}
          />
          <MeadCard
            meadGrade={meadGrade}
            setMeadGrade={setMeadGrade}
            targetVolumeL={meadTargetVolumeL}
            setTargetVolumeL={setMeadTargetVolumeL}
            prepType={meadPrepType}
            setPrepType={setMeadPrepType}
            meadCalc={meadCalc}
          />
          <GingerBugCard
            starterDays={gbStarterDays}
            setStarterDays={setGbStarterDays}
            daysSinceFeed={gbDaysSinceFeed}
            setDaysSinceFeed={setGbDaysSinceFeed}
            hasBubbles={gbHasBubbles}
            setHasBubbles={setGbHasBubbles}
            batchVolumeL={gbBatchVolumeL}
            setBatchVolumeL={setGbBatchVolumeL}
            hoursInBottle={gbHoursInBottle}
            setHoursInBottle={setGbHoursInBottle}
            ambientTempC={ambientTempC}
            starterCalc={gingerBugStarterCalc}
            batchCalc={gingerBeerBatchCalc}
          />
        </View>
      )}
    </View>
  );
};
