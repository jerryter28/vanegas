import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, FileText, Check } from 'lucide-react';
import { ProtocolTask } from '../types/protocol';
import { CountdownInfo, formatDateTimeEs } from '../utils/timeUtils';

interface TaskCardProps {
  task: ProtocolTask;
  countdown: CountdownInfo;
  onExecuteAI: (task: ProtocolTask) => void;
  onViewAudit: (task: ProtocolTask) => void;
  onToggleComplete: (task: ProtocolTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  countdown,
  onExecuteAI,
  onViewAudit,
  onToggleComplete,
}) => {
  const isCompleted = task.status === 'CUMPLIDO';
  const isOverdue = countdown.isOverdue && !isCompleted;
  const isEarlyWarning = countdown.isEarlyWarning && !isCompleted;

  // Acceptance checklist summary
  const completedChecks = task.acceptanceChecklist.filter((c) => c.checked).length;
  const totalChecks = task.acceptanceChecklist.length;
  const checklistPct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  return (
    <article
      className={`rounded-xl border transition-all duration-200 p-5 bg-slate-900/70 ${
        isOverdue
          ? 'border-red-500/80 shadow-md shadow-red-950/40 bg-red-950/20'
          : isEarlyWarning
          ? 'border-amber-500/80 shadow-md shadow-amber-950/30 bg-amber-950/15'
          : isCompleted
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Header zone with order and unboxed metadata */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={
                task.priority === 'URGENTE'
                  ? 'text-red-400 font-semibold'
                  : task.priority === 'ALTA'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400'
              }
            >
              Prioridad {task.priority}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400">Alerta {task.alertBeforeMinutes}m antes</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className={isCompleted ? 'text-emerald-400' : isOverdue ? 'text-red-400' : 'text-slate-400'}>
              {isCompleted ? 'Cumplido' : isOverdue ? 'Retrasado' : isEarlyWarning ? 'En Riesgo' : 'Programado'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            0{task.order}. {task.title}
          </h3>
        </div>

        {/* Live Countdown Clock with tabular numbers */}
        <div className="text-right shrink-0">
          <div
            className={`font-mono tabular-nums text-lg font-bold tracking-tight ${
              isCompleted
                ? 'text-emerald-400'
                : isOverdue
                ? 'text-red-400 animate-pulse'
                : isEarlyWarning
                ? 'text-amber-400'
                : 'text-slate-200'
            }`}
          >
            {isCompleted ? 'COMPLETADO' : countdown.formattedString}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {isCompleted ? 'Entregable validado' : isOverdue ? 'Plazo Vencido' : 'Tiempo Restante'}
          </div>
        </div>
      </div>

      {/* Acceptance criteria section */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Criterio de Aceptación: </span>
          <span>{task.acceptanceCriteria}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Plazo: {task.deadlineDescription}</span>
          <span>{formatDateTimeEs(task.targetDeadline)}</span>
        </div>
      </div>

      {/* Progress & Last execution badge if available */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
        <div className="flex items-center gap-3">
          <span>
            Verificación: <strong className="text-slate-200 tabular-nums">{completedChecks}/{totalChecks}</strong> ({checklistPct}%)
          </span>
          {task.lastExecution && (
            <>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <span className="text-amber-400">
                Tokens IA: <strong className="tabular-nums">{task.lastExecution.tokenUsage.totalTokens.toLocaleString()}</strong>
              </span>
            </>
          )}
        </div>

        {task.stakeholderSignOff.signed && (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Firmado</span>
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-2">
        <button
          onClick={() => onToggleComplete(task)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border ${
            isCompleted
              ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
              : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Reabrir Tarea' : 'Marcar Cumplido'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewAudit(task)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Auditoría</span>
          </button>

          <button
            onClick={() => onExecuteAI(task)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ejecutar con IA</span>
          </button>
        </div>
      </div>
    </article>
  );
};
