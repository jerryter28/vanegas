export type TaskPriority = 'URGENTE' | 'ALTA' | 'NORMAL' | 'BAJA';

export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'ALERTA_TEMPRANA' | 'RETRASADO' | 'CUMPLIDO';

export interface ChainOfThoughtStep {
  stepNumber: number;
  title: string;
  reasoning: string;
}

export interface AcceptanceVerdict {
  meetsCriteria: boolean;
  compliancePercentage: number;
  summary: string;
  verifiedPoints: string[];
  criticalObservations?: string;
}

export interface TokenUsage {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
}

export interface TaskExecutionResult {
  timestamp: string;
  executionTimeMs: number;
  tokenUsage: TokenUsage;
  chainOfThought: ChainOfThoughtStep[];
  deliverable: string;
  acceptanceVerdict: AcceptanceVerdict;
}

export interface AcceptanceChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes?: string;
}

export interface StakeholderSignOff {
  signed: boolean;
  signedBy?: string;
  role?: string;
  timestamp?: string;
  signatureDataUrl?: string;
}

export interface ProtocolTask {
  id: string;
  order: number;
  title: string;
  deadlineDescription: string;
  targetDeadline: string; // ISO string
  priority: TaskPriority;
  acceptanceCriteria: string;
  alertBeforeMinutes: number; // minutes before deadline to fire early warning
  status: TaskStatus;
  inputPayload: string;
  lastExecution: TaskExecutionResult | null;
  acceptanceChecklist: AcceptanceChecklistItem[];
  stakeholderSignOff: StakeholderSignOff;
}

export interface TokenLedgerEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  executionTimeMs: number;
}

export interface ProtocolSettings {
  soundEnabled: boolean;
  visualAlertsEnabled: boolean;
  browserNotificationsEnabled: boolean;
  protocolStartTime: string;
}
