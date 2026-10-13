import React from 'react';
import { FastForward, RotateCcw, AlertTriangle, Bell, Volume2, Shield } from 'lucide-react';
import { soundManager } from '../utils/audioAlert';

interface SimulationBarProps {
  simulatedOffsetMs: number;
  setSimulatedOffsetMs: (offset: number) => void;
  triggerManualSoundTest: (type: 'early' | 'delayed') => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  simulatedOffsetMs,
  setSimulatedOffsetMs,
  triggerManualSoundTest,
}) => {
  const isSimulating = simulatedOffsetMs !== 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md bg-slate-800 text-amber-400">
          <FastForward className="w-4 h-4" />
        </div>
        <div>
          <span className="font-semibold text-slate-200">
            Control de Simulación de Plazos & Verificación de Alertas:
          </span>
          <span className="text-slate-400 ml-1.5">
            {isSimulating ? (
              <span className="text-amber-400 font-mono">
                Adelantado +{(simulatedOffsetMs / (1000 * 60)).toFixed(0)} min
              </span>
            ) : (
              <span className="text-slate-500 font-mono">Tiempo Real Activo</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            // Advance by 1h 48m (12 min left on Task 1, triggering 15m early warning)
            setSimulatedOffsetMs(108 * 60 * 1000);
            soundManager.playEarlyWarningChime();
          }}
          className="px-2.5 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40 font-mono transition-colors flex items-center gap-1"
        >
          <Bell className="w-3 h-3" />
          <span>Simular Alerta Temprana</span>
        </button>

        <button
          onClick={() => {
            // Advance by 2h 05m (Task 1 delayed by 5m, triggering immediate sound & visual alarm)
            setSimulatedOffsetMs(125 * 60 * 1000);
            soundManager.playDelayedAlarm();
          }}
          className="px-2.5 py-1.5 rounded bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-600/50 font-mono transition-colors flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Simular Retraso Inmediato</span>
        </button>

        {isSimulating && (
          <button
            onClick={() => setSimulatedOffsetMs(0)}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Tiempo Real</span>
          </button>
        )}

        <button
          onClick={() => triggerManualSoundTest('delayed')}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Probar sonido acústico de alarma de retraso"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
