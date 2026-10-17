// ============================================================================
// SEROWAR: Rzemieślnicze Przetwórstwo Mleka (src/core/domain/interfaces.ts)
// Abstrakcyjne Porty Repozytoriów i Serwisów (Ports & Adapters)
// ZERO zależności od bazy danych SQLite, React czy zewnętrznych bibliotek
// ============================================================================

import {
  DairyBatchEntity,
  CheeseCoagulationParams,
  PressingStageEntity,
  BriningLogEntity,
  CaveCheeseWheelEntity,
  CaveActionLogEntity,
  WheelWeightLogEntity,
  CaveEnvironmentLogEntity,
  CurdBatchEntity,
  ButterChurnEntity,
  FermentedMilkEntity,
  WheyProductEntity,
  DairyPantryItemEntity,
  SensoryEvaluationEntity,
} from './types';

export interface IDairyBatchRepository {
  getAllBatches(): Promise<DairyBatchEntity[]>;
  getBatchById(id: string): Promise<DairyBatchEntity | null>;
  saveBatch(batch: DairyBatchEntity): Promise<void>;
  updateBatchStatus(id: string, status: DairyBatchEntity['status']): Promise<void>;
  deleteBatch(id: string): Promise<void>;

  // Koagulacja i obróbka
  getCheeseCoagulation(batchId: string): Promise<CheeseCoagulationParams | null>;
  saveCheeseCoagulation(params: CheeseCoagulationParams): Promise<void>;

  // Prasowanie
  getPressingStages(batchId: string): Promise<PressingStageEntity[]>;
  savePressingStage(stage: PressingStageEntity): Promise<void>;

  // Solanka
  getBriningLog(batchId: string): Promise<BriningLogEntity | null>;
  saveBriningLog(log: BriningLogEntity): Promise<void>;
}

export interface ICaveLogRepository {
  getAllWheels(): Promise<CaveCheeseWheelEntity[]>;
  getWheelById(id: string): Promise<CaveCheeseWheelEntity | null>;
  saveWheel(wheel: CaveCheeseWheelEntity): Promise<void>;
  deleteWheel(id: string): Promise<void>;

  // Czynności pielęgnacyjne
  logAction(action: CaveActionLogEntity): Promise<void>;
  getActionsForWheel(wheelId: string): Promise<CaveActionLogEntity[]>;

  // Pomiary wagi i ubytku
  logWeight(log: WheelWeightLogEntity): Promise<void>;
  getWeightLogsForWheel(wheelId: string): Promise<WheelWeightLogEntity[]>;

  // Pomiary mikroklimatu
  logEnvironment(log: CaveEnvironmentLogEntity): Promise<void>;
  getRecentEnvironmentLogs(limit?: number): Promise<CaveEnvironmentLogEntity[]>;
}

export interface IDairyKitchenRepository {
  // Twarogi klinkowe
  getCurdDetails(batchId: string): Promise<CurdBatchEntity | null>;
  saveCurdDetails(curd: CurdBatchEntity): Promise<void>;

  // Masielnictwo i ghee
  getButterDetails(batchId: string): Promise<ButterChurnEntity | null>;
  saveButterDetails(butter: ButterChurnEntity): Promise<void>;

  // Napoje fermentowane
  getFermentedMilkDetails(batchId: string): Promise<FermentedMilkEntity | null>;
  saveFermentedMilkDetails(milk: FermentedMilkEntity): Promise<void>;

  // Obieg serwatki
  getWheyProductDetails(batchId: string): Promise<WheyProductEntity | null>;
  saveWheyProductDetails(whey: WheyProductEntity): Promise<void>;
}

export interface IPantryRepository {
  getAllItems(): Promise<DairyPantryItemEntity[]>;
  getItemById(id: string): Promise<DairyPantryItemEntity | null>;
  saveItem(item: DairyPantryItemEntity): Promise<void>;
  deleteItem(id: string): Promise<void>;
  updateQuantity(id: string, newQuantity: number): Promise<void>;
  depleteIngredients(deductions: { id: string; amountToDeduct: number }[]): Promise<void>;
}

export interface ISensoryRepository {
  getEvaluation(batchId: string): Promise<SensoryEvaluationEntity | null>;
  saveEvaluation(evaluation: SensoryEvaluationEntity): Promise<void>;
  deleteEvaluation(id: string): Promise<void>;
}

export interface INotificationSchedulerPort {
  scheduleLocalAlert(title: string, body: string, triggerTimestampMs: number): Promise<string>;
  cancelAlert(alertId: string): Promise<void>;
}
