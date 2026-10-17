import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { styles } from './calculator.styles';
import { CurdRequirementResult } from '../../core/mold-sizing';
import { DutchLeverResult, PressingCascadeProgram } from '../../core/press-cascade';
import { PressPressureResult, CurdCookingRampResult } from '../../core/cheese-engine';
import { BrineAcidificationResult } from '../../core/brine-acidification';
import { BrineBoostResult } from '../../core/brine-topup';
import {
  BrineDensitometryResult,
  BrineTargetProfileKey,
} from '../../core/brine-densitometry';
import { CurdWashResult, CurdMillingSaltingResult, WheelCoatingResult } from '../../core/curd-washing-and-salting';
import { RicottaRecoveryResult, WheyDrinkRecipe } from '../../core/whey-utilization';
import { WheyLevainPlan, WheyLevainType } from '../../core/whey-levain-engine';
import { CheeseCompositionResult } from '../../core/cheese-composition-engine';
import { BrineDiffusionResult } from '../../core/brine-diffusion';
import { MilkSpeciesCalculationResult } from '../../core/milk-species-profile';
import { SyneresisResult, CheeseStyleSyneresis } from '../../core/curd-syneresis';

import { CheeseFlocculationAndMoldCard } from './CheeseFlocculationAndMoldCard';
import { CheesePressLeverCard } from './CheesePressLeverCard';
import { CheeseBrineAndRegenCard } from './CheeseBrineAndRegenCard';
import { CheeseCurdCookingAndSaltingCard } from './CheeseCurdCookingAndSaltingCard';
import { CheeseWheyRecoveryAndLevainCard } from './CheeseWheyRecoveryAndLevainCard';
import { CheeseBiochemAndCoatingCard } from './CheeseBiochemAndCoatingCard';
import { CheeseSyneresisKineticsCard } from './CheeseSyneresisKineticsCard';

interface CheeseCraftSectionProps {
  milkLiters: number;
  setMilkLiters: React.Dispatch<React.SetStateAction<number>>;
  milkType: 'COW' | 'GOAT' | 'SHEEP' | 'BUFFALO';
  setMilkType: (v: 'COW' | 'GOAT' | 'SHEEP' | 'BUFFALO') => void;
  rennetCalc: { volumeMl: number; imcuTotal: number };
  cacl2Calc: { solution33PercentMl: number; dryGrams: number };
  isProExpanded: boolean;
  setIsProExpanded: (v: boolean) => void;

  flocMultiplier: number;
  flocSecInput: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  flocCalc: { totalCoagulationSeconds: number; remainingSecondsAfterFloc: number };
  moldFittingCalc: CurdRequirementResult;
  selectedMoldTemplateId: string;
  setSelectedMoldTemplateId: (v: string) => void;
  setMoldDiamCm: (v: number) => void;

  pressMechanism: 'DUTCH_LEVER' | 'DIRECT';
  setPressMechanism: (mechanism: 'DUTCH_LEVER' | 'DIRECT') => void;
  moldDiamCm: number;
  pressWeightKg: number;
  setPressWeightKg: (v: number) => void;
  armLengthCm: number;
  setArmLengthCm: (v: number) => void;
  moldDistCm: number;
  setMoldDistCm: (v: number) => void;
  armWeightKg: number;
  setArmWeightKg: (v: number) => void;
  dutchLeverCalc: DutchLeverResult;
  pressCalc: PressPressureResult;
  isPressCascadeOpen: boolean;
  setIsPressCascadeOpen: (v: boolean) => void;
  pressingCascadeProg: PressingCascadeProgram;

  brineWaterLiters: number;
  brineSalinityPct: number;
  brineWaterPh: number;
  setBrineWaterPh: (v: number) => void;
  brineAcidCalc: BrineAcidificationResult;
  currentBrineSalinity: number;
  setCurrentBrineSalinity: (v: number) => void;
  targetBrineSalinity: number;
  setTargetBrineSalinity: (v: number) => void;
  brineBoostCalc: BrineBoostResult;
  brineDensitometryCalc: BrineDensitometryResult | null;
  brineDensityUnit: 'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY';
  setBrineDensityUnit: (v: 'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY') => void;
  brineMeasuredValue: number;
  setBrineMeasuredValue: (v: number) => void;
  brineSampleTempC: number;
  setBrineSampleTempC: (v: number) => void;
  brineVolumeLitersInput: number;
  setBrineVolumeLitersInput: (v: number) => void;
  brineTargetProfile: BrineTargetProfileKey;
  setBrineTargetProfile: (v: BrineTargetProfileKey) => void;

  cookingRampCalc: CurdCookingRampResult;
  cookStartTemp: number;
  cookEndTemp: number;
  cookDurationMin: number;
  washWheyDrainedLiters: number;
  setWashWheyDrainedLiters: (v: number) => void;
  washHotWaterTempC: number;
  setWashHotWaterTempC: (v: number) => void;
  washTargetTempC: number;
  setWashTargetTempC: (v: number) => void;
  curdWashCalc: CurdWashResult | null;
  cheddarCurdGrams: number;
  setCheddarCurdGrams: (v: number) => void;
  cheddarTargetSalinityPct: number;
  setCheddarTargetSalinityPct: (v: number) => void;
  cheddarSaltingCalc: CurdMillingSaltingResult | null;

  sweetWheyLiters: number;
  wheyMilkBoostLiters: number;
  setWheyMilkBoostLiters: (v: number) => void;
  ricottaCalc: RicottaRecoveryResult;
  wheyDrinkCalc: WheyDrinkRecipe;
  wheyLevainCalc: WheyLevainPlan | null;
  wheyLevainType: WheyLevainType;
  setWheyLevainType: (v: WheyLevainType) => void;
  setWheyIncubationTempC: (v: number) => void;
  wheyVolumeMl: number;
  setWheyVolumeMl: (v: number) => void;
  wheyIncubationTempC: number;
  wheyHoursIncubated: number;
  setWheyHoursIncubated: (v: number) => void;
  wheyCurrentPh: number;
  setWheyCurrentPh: (v: number) => void;
  wheyGeneration: number;
  setWheyGeneration: (v: number) => void;

  coatingType: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE';
  setCoatingType: (v: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE') => void;
  coatingWheelHeightCm: number;
  setCoatingWheelHeightCm: (v: number) => void;
  coatingLayers: number;
  setCoatingLayers: (v: number) => void;
  wheelCoatingCalc: WheelCoatingResult | null;
  cheeseMoisturePct: number;
  setCheeseMoisturePct: (v: number) => void;
  cheeseFatPct: number;
  setCheeseFatPct: (v: number) => void;
  cheeseSaltPct: number;
  setCheeseSaltPct: (v: number) => void;
  cheeseCompositionCalc: CheeseCompositionResult | null;
  diffWheelWeightKg: number;
  setDiffWheelWeightKg: (v: number) => void;
  diffDiameterCm: number;
  setDiffDiameterCm: (v: number) => void;
  diffHeightCm: number;
  setDiffHeightCm: (v: number) => void;
  diffBrineSalinityPct: number;
  setDiffBrineSalinityPct: (v: number) => void;
  diffBrineTempC: number;
  setDiffBrineTempC: (v: number) => void;
  brineDiffusionCalc: BrineDiffusionResult | null;
  milkSpeciesCalc: MilkSpeciesCalculationResult | null;

  curdSyneresisCalc: SyneresisResult | null;
  syneresisStyle: CheeseStyleSyneresis;
  setSyneresisStyle: (v: CheeseStyleSyneresis) => void;
  setSyneresisCutSizeMm: (v: number) => void;
  setSyneresisInitTempC: (v: number) => void;
  setSyneresisTargetTempC: (v: number) => void;
  syneresisCutSizeMm: number;
  syneresisTargetTempC: number;
  syneresisHeatingMinutes: number;
  setSyneresisHeatingMinutes: (v: number) => void;
  syneresisStirMinutes: number;
  setSyneresisStirMinutes: (v: number) => void;
  syneresisDrainPh: number;
  setSyneresisDrainPh: (v: number) => void;
}

export const CheeseCraftSection: React.FC<CheeseCraftSectionProps> = ({
  milkLiters,
  setMilkLiters,
  milkType,
  setMilkType,
  rennetCalc,
  cacl2Calc,
  isProExpanded,
  setIsProExpanded,
  flocMultiplier,
  flocSecInput,
  timerSeconds,
  isTimerRunning,
  handleStartTimer,
  handleStopTimer,
  flocCalc,
  moldFittingCalc,
  selectedMoldTemplateId,
  setSelectedMoldTemplateId,
  setMoldDiamCm,
  pressMechanism,
  setPressMechanism,
  moldDiamCm,
  pressWeightKg,
  setPressWeightKg,
  armLengthCm,
  setArmLengthCm,
  moldDistCm,
  setMoldDistCm,
  armWeightKg,
  setArmWeightKg,
  dutchLeverCalc,
  pressCalc,
  isPressCascadeOpen,
  setIsPressCascadeOpen,
  pressingCascadeProg,
  brineWaterLiters,
  brineSalinityPct,
  brineWaterPh,
  setBrineWaterPh,
  brineAcidCalc,
  currentBrineSalinity,
  setCurrentBrineSalinity,
  targetBrineSalinity,
  setTargetBrineSalinity,
  brineBoostCalc,
  brineDensitometryCalc,
  brineDensityUnit,
  setBrineDensityUnit,
  brineMeasuredValue,
  setBrineMeasuredValue,
  brineSampleTempC,
  setBrineSampleTempC,
  brineVolumeLitersInput,
  setBrineVolumeLitersInput,
  brineTargetProfile,
  setBrineTargetProfile,
  cookingRampCalc,
  cookStartTemp,
  cookEndTemp,
  cookDurationMin,
  washWheyDrainedLiters,
  setWashWheyDrainedLiters,
  washHotWaterTempC,
  setWashHotWaterTempC,
  washTargetTempC,
  setWashTargetTempC,
  curdWashCalc,
  cheddarCurdGrams,
  setCheddarCurdGrams,
  cheddarTargetSalinityPct,
  setCheddarTargetSalinityPct,
  cheddarSaltingCalc,
  sweetWheyLiters,
  wheyMilkBoostLiters,
  setWheyMilkBoostLiters,
  ricottaCalc,
  wheyDrinkCalc,
  wheyLevainCalc,
  wheyLevainType,
  setWheyLevainType,
  setWheyIncubationTempC,
  wheyVolumeMl,
  setWheyVolumeMl,
  wheyIncubationTempC,
  wheyHoursIncubated,
  setWheyHoursIncubated,
  wheyCurrentPh,
  setWheyCurrentPh,
  wheyGeneration,
  setWheyGeneration,
  coatingType,
  setCoatingType,
  coatingWheelHeightCm,
  setCoatingWheelHeightCm,
  coatingLayers,
  setCoatingLayers,
  wheelCoatingCalc,
  cheeseMoisturePct,
  setCheeseMoisturePct,
  cheeseFatPct,
  setCheeseFatPct,
  cheeseSaltPct,
  setCheeseSaltPct,
  cheeseCompositionCalc,
  diffWheelWeightKg,
  setDiffWheelWeightKg,
  diffDiameterCm,
  setDiffDiameterCm,
  diffHeightCm,
  setDiffHeightCm,
  diffBrineSalinityPct,
  setDiffBrineSalinityPct,
  diffBrineTempC,
  setDiffBrineTempC,
  brineDiffusionCalc,
  milkSpeciesCalc,
  curdSyneresisCalc,
  syneresisStyle,
  setSyneresisStyle,
  setSyneresisCutSizeMm,
  setSyneresisInitTempC,
  setSyneresisTargetTempC,
  syneresisCutSizeMm,
  syneresisTargetTempC,
  syneresisHeatingMinutes,
  setSyneresisHeatingMinutes,
  syneresisStirMinutes,
  setSyneresisStirMinutes,
  syneresisDrainPh,
  setSyneresisDrainPh,
}) => {
  return (
    <View style={styles.craftSection}>
      <Text style={styles.sectionHeader}>{t('Kalkulator Podpuszczki i Mleka')}</Text>

      {/* Stepper for Milk Volume */}
      <View style={styles.card}>
        <Text style={styles.inputLabel}>{t('Objętość mleka (L):')}</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setMilkLiters((p) => Math.max(1, p - 5));
            }}
          >
            <Text style={styles.stepperBtnText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setMilkLiters((p) => Math.max(1, p - 1));
            }}
          >
            <Text style={styles.stepperBtnText}>-1</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{milkLiters} L</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setMilkLiters((p) => p + 1);
            }}
          >
            <Text style={styles.stepperBtnText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => {
              triggerHapticFeedback();
              setMilkLiters((p) => p + 5);
            }}
          >
            <Text style={styles.stepperBtnText}>+5</Text>
          </TouchableOpacity>
        </View>

        {/* Milk Type Selector */}
        <View style={styles.typeSelectorRow}>
          {(['COW', 'GOAT', 'SHEEP', 'BUFFALO'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typePill, milkType === type && styles.typePillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setMilkType(type);
              }}
            >
              <Text style={[styles.typePillText, milkType === type && styles.typePillTextActive]}>
                {type === 'COW'
                  ? t('Krowie')
                  : type === 'GOAT'
                  ? t('Kozie')
                  : type === 'SHEEP'
                  ? t('Owcze')
                  : t('Bawole')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Instant 1-Tap Result Cards */}
      <View style={styles.resultsGrid}>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Dawka Podpuszczki')}</Text>
          <Text style={styles.resultValueHighlight}>{rennetCalc.volumeMl} ml</Text>
          <Text style={styles.resultSub}>{rennetCalc.imcuTotal} IMCU (200 IMCU/ml)</Text>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t('Chlorek Wapnia (CaCl2)')}</Text>
          <Text style={styles.resultValue}>{cacl2Calc.solution33PercentMl} ml</Text>
          <Text style={styles.resultSub}>{t('roztwór 33%')} ({cacl2Calc.dryGrams}g)</Text>
        </View>
      </View>

      {/* Pro Collapsible Accordion */}
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
          <CheeseFlocculationAndMoldCard
            flocMultiplier={flocMultiplier}
            flocSecInput={flocSecInput}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            handleStartTimer={handleStartTimer}
            handleStopTimer={handleStopTimer}
            flocCalc={flocCalc}
            moldFittingCalc={moldFittingCalc}
            milkLiters={milkLiters}
            selectedMoldTemplateId={selectedMoldTemplateId}
            setSelectedMoldTemplateId={setSelectedMoldTemplateId}
            setMoldDiamCm={setMoldDiamCm}
          />
          <CheesePressLeverCard
            pressMechanism={pressMechanism}
            setPressMechanism={setPressMechanism}
            moldDiamCm={moldDiamCm}
            setMoldDiamCm={setMoldDiamCm}
            pressWeightKg={pressWeightKg}
            setPressWeightKg={setPressWeightKg}
            armLengthCm={armLengthCm}
            setArmLengthCm={setArmLengthCm}
            moldDistCm={moldDistCm}
            setMoldDistCm={setMoldDistCm}
            armWeightKg={armWeightKg}
            setArmWeightKg={setArmWeightKg}
            dutchLeverCalc={dutchLeverCalc}
            pressCalc={pressCalc}
            isPressCascadeOpen={isPressCascadeOpen}
            setIsPressCascadeOpen={setIsPressCascadeOpen}
            pressingCascadeProg={pressingCascadeProg}
          />
          <CheeseBrineAndRegenCard
            brineWaterLiters={brineWaterLiters}
            brineSalinityPct={brineSalinityPct}
            brineWaterPh={brineWaterPh}
            setBrineWaterPh={setBrineWaterPh}
            brineAcidCalc={brineAcidCalc}
            currentBrineSalinity={currentBrineSalinity}
            setCurrentBrineSalinity={setCurrentBrineSalinity}
            targetBrineSalinity={targetBrineSalinity}
            setTargetBrineSalinity={setTargetBrineSalinity}
            brineBoostCalc={brineBoostCalc}
            brineDensitometryCalc={brineDensitometryCalc}
            brineDensityUnit={brineDensityUnit}
            setBrineDensityUnit={setBrineDensityUnit}
            brineMeasuredValue={brineMeasuredValue}
            setBrineMeasuredValue={setBrineMeasuredValue}
            brineSampleTempC={brineSampleTempC}
            setBrineSampleTempC={setBrineSampleTempC}
            brineVolumeLitersInput={brineVolumeLitersInput}
            setBrineVolumeLitersInput={setBrineVolumeLitersInput}
            brineTargetProfile={brineTargetProfile}
            setBrineTargetProfile={setBrineTargetProfile}
          />
          <CheeseCurdCookingAndSaltingCard
            cookingRampCalc={cookingRampCalc}
            cookStartTemp={cookStartTemp}
            cookEndTemp={cookEndTemp}
            cookDurationMin={cookDurationMin}
            washWheyDrainedLiters={washWheyDrainedLiters}
            setWashWheyDrainedLiters={setWashWheyDrainedLiters}
            washHotWaterTempC={washHotWaterTempC}
            setWashHotWaterTempC={setWashHotWaterTempC}
            washTargetTempC={washTargetTempC}
            setWashTargetTempC={setWashTargetTempC}
            curdWashCalc={curdWashCalc}
            cheddarCurdGrams={cheddarCurdGrams}
            setCheddarCurdGrams={setCheddarCurdGrams}
            cheddarTargetSalinityPct={cheddarTargetSalinityPct}
            setCheddarTargetSalinityPct={setCheddarTargetSalinityPct}
            cheddarSaltingCalc={cheddarSaltingCalc}
          />
          <CheeseWheyRecoveryAndLevainCard
            sweetWheyLiters={sweetWheyLiters}
            wheyMilkBoostLiters={wheyMilkBoostLiters}
            setWheyMilkBoostLiters={setWheyMilkBoostLiters}
            ricottaCalc={ricottaCalc}
            wheyDrinkCalc={wheyDrinkCalc}
            wheyLevainCalc={wheyLevainCalc}
            wheyLevainType={wheyLevainType}
            setWheyLevainType={setWheyLevainType}
            setWheyIncubationTempC={setWheyIncubationTempC}
            wheyVolumeMl={wheyVolumeMl}
            setWheyVolumeMl={setWheyVolumeMl}
            wheyIncubationTempC={wheyIncubationTempC}
            wheyHoursIncubated={wheyHoursIncubated}
            setWheyHoursIncubated={setWheyHoursIncubated}
            wheyCurrentPh={wheyCurrentPh}
            setWheyCurrentPh={setWheyCurrentPh}
            wheyGeneration={wheyGeneration}
            setWheyGeneration={setWheyGeneration}
            milkLiters={milkLiters}
          />
          <CheeseBiochemAndCoatingCard
            coatingType={coatingType}
            setCoatingType={setCoatingType}
            coatingWheelHeightCm={coatingWheelHeightCm}
            setCoatingWheelHeightCm={setCoatingWheelHeightCm}
            coatingLayers={coatingLayers}
            setCoatingLayers={setCoatingLayers}
            wheelCoatingCalc={wheelCoatingCalc}
            cheeseMoisturePct={cheeseMoisturePct}
            setCheeseMoisturePct={setCheeseMoisturePct}
            cheeseFatPct={cheeseFatPct}
            setCheeseFatPct={setCheeseFatPct}
            cheeseSaltPct={cheeseSaltPct}
            setCheeseSaltPct={setCheeseSaltPct}
            cheeseCompositionCalc={cheeseCompositionCalc}
            diffWheelWeightKg={diffWheelWeightKg}
            setDiffWheelWeightKg={setDiffWheelWeightKg}
            diffDiameterCm={diffDiameterCm}
            setDiffDiameterCm={setDiffDiameterCm}
            diffHeightCm={diffHeightCm}
            setDiffHeightCm={setDiffHeightCm}
            diffBrineSalinityPct={diffBrineSalinityPct}
            setDiffBrineSalinityPct={setDiffBrineSalinityPct}
            diffBrineTempC={diffBrineTempC}
            setDiffBrineTempC={setDiffBrineTempC}
            brineDiffusionCalc={brineDiffusionCalc}
            milkSpeciesCalc={milkSpeciesCalc}
            milkLiters={milkLiters}
          />
          <CheeseSyneresisKineticsCard
            curdSyneresisCalc={curdSyneresisCalc}
            syneresisStyle={syneresisStyle}
            setSyneresisStyle={setSyneresisStyle}
            setSyneresisCutSizeMm={setSyneresisCutSizeMm}
            setSyneresisInitTempC={setSyneresisInitTempC}
            setSyneresisTargetTempC={setSyneresisTargetTempC}
            syneresisCutSizeMm={syneresisCutSizeMm}
            syneresisTargetTempC={syneresisTargetTempC}
            syneresisHeatingMinutes={syneresisHeatingMinutes}
            setSyneresisHeatingMinutes={setSyneresisHeatingMinutes}
            syneresisStirMinutes={syneresisStirMinutes}
            setSyneresisStirMinutes={setSyneresisStirMinutes}
            syneresisDrainPh={syneresisDrainPh}
            setSyneresisDrainPh={setSyneresisDrainPh}
          />
        </View>
      )}
    </View>
  );
};
