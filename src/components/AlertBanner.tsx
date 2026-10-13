import React from 'react';
import { AlertTriangle, Clock, BellRing, ArrowRight, Volume2 } from 'lucide-react';
import { ProtocolTask } from '../types/protocol';
import { CountdownInfo } from '../utils/timeUtils';
import { soundManager } from '../utils/audioAlert';

interface AlertBannerProps {
  delayedTasks: { task: ProtocolTask; countdown: CountdownInfo }[];
  warningTasks: { task: ProtocolTask; countdown: CountdownInfo }[];
  onSelectTask: (taskId: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  delayedTasks,
  warningTasks,
  onSelectTask,
}) => {
  if (delayedTasks.length === 0 && warningTasks.length === 0) {
    return null;
  }

  const isDelayed = delayedTasks.length > 0;
  const primaryTaskInfo = isDelayed ? delayedTasks[0] : warningTasks[0];
  const { task, countdown } = primaryTaskInfo;

  return (
    <div
      role="alert"
      className={`relative border-b px-4 py-3 sm:px-6 transition-all duration-300 ${
        isDelayed
          ? 'bg-red-950/90 border-red-500/80 text-red-100 shadow-lg shadow-red-950/50'
          : 'bg-amber-950/80 border-amber-500/70 text-amber-100 shadow-md shadow-amber-950/30'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start md:items-center gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isDelayed ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'
            }`}
          >
            {isDelayed ? (
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            ) : (
              <BellRing className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/40">
                {isDelayed ? 'NOTIFICACIÓN DE RETRASO CRÍTICO' : 'ALERTA TEMPRANA DE VENCIMIENTO'}
              </span>
              <span className="text-xs font-mono text-slate-300">
                Umbral {task.alertBeforeMinutes}m
              </span>
            </div>
            <p className="text-sm font-semibold mt-0.5">
              Tarea {task.order}: {task.title}
            </p>
            <p className="text-xs opacity-90">
              {isDelayed
                ? `Plazo excedido por ${countdown.formattedString.replace('-', '')}. Requiere intervención inmediata.`
                : `Quedan ${countdown.formattedString}. Vence: ${task.deadlineDescription}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <button
            onClick={() => {
              if (isDelayed) {
                soundManager.playDelayedAlarm();
              } else {
                soundManager.playEarlyWarningChime();
              }
            }}
            className="px-3 py-1.5 text-xs font-mono rounded bg-black/40 hover:bg-black/60 transition-colors flex items-center gap-1.5 border border-white/10"
            title="Reproducir alarma sonora nuevamente"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Alarma Sonora</span>
          </button>

          <button
            onClick={() => onSelectTask(task.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              isDelayed
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <span>Ejecutar con IA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
