import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  FileCheck,
  PenTool,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { ProtocolTask } from '../types/protocol';
import { soundManager } from '../utils/audioAlert';

interface AuditMatrixProps {
  tasks: ProtocolTask[];
  onToggleChecklistItem: (taskId: string, itemId: string) => void;
  onSignOffTask: (taskId: string, signedBy: string, role: string) => void;
}

export const AuditMatrix: React.FC<AuditMatrixProps> = ({
  tasks,
  onToggleChecklistItem,
  onSignOffTask,
}) => {
  const [activeTaskId, setActiveTaskId] = useState<string>(tasks[0]?.id || 'tarea-1');
  const [signerName, setSignerName] = useState<string>('Dirección General de Proyectos');
  const [signerRole, setSignerRole] = useState<string>('Lead Stakeholder & Auditor');

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  // Overall protocol statistics
  let totalCriteriaCount = 0;
  let satisfiedCriteriaCount = 0;
  tasks.forEach((t) => {
    t.acceptanceChecklist.forEach((item) => {
      totalCriteriaCount++;
      if (item.checked) satisfiedCriteriaCount++;
    });
  });

  const overallCompliancePct =
    totalCriteriaCount > 0 ? Math.round((satisfiedCriteriaCount / totalCriteriaCount) * 100) : 0;

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;
    onSignOffTask(activeTask.id, signerName.trim(), signerRole.trim());
    soundManager.playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Overview stats header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>CONTROL DE CALIDAD & GOBERNANZA</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">Verificación 100% Sin Supuestos</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Matriz de Especificaciones & Auditoría de Criterios
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">CUMPLIMIENTO GLOBAL</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                {overallCompliancePct}%
              </div>
            </div>
            <div className="w-32 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${overallCompliancePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-column matrix layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task list selection */}
        <div className="lg:col-span-4 space-y-2">
          {tasks.map((task) => {
            const completed = task.acceptanceChecklist.filter((c) => c.checked).length;
            const total = task.acceptanceChecklist.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isSigned = task.stakeholderSignOff.signed;

            return (
              <button
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  activeTask.id === task.id
                    ? 'border-amber-400 bg-slate-900 shadow-sm'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    0{task.order} · Prioridad {task.priority}
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-emerald-400">
                    {pct}%
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-1 line-clamp-1">
                  {task.title}
                </div>

                <div className="mt-2 text-xs text-slate-400 line-clamp-1">
                  {task.acceptanceCriteria}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>
                    Verificados: <strong className="text-slate-300">{completed}/{total}</strong>
                  </span>
                  {isSigned && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Firmado</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active task audit details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="text-xs font-mono text-amber-400 font-semibold">
                AUDITORÍA DE LA TAREA 0{activeTask.order}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeTask.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="font-semibold text-slate-300">Criterio Exigido: </span>
                {activeTask.acceptanceCriteria}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold uppercase text-slate-300">
                Lista de Verificación de Criterios & Ausencia de Supuestos
              </div>

              <div className="space-y-2">
                {activeTask.acceptanceChecklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onToggleChecklistItem(activeTask.id, item.id)}
                    className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                      item.checked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div
                        className={`text-xs font-medium ${
                          item.checked ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {item.checked
                          ? 'Auditado y validado conforme al protocolo'
                          : 'Pendiente de auditoría física/analítica'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Formal Stakeholder Sign-Off Section */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-slate-300">
                <PenTool className="w-4 h-4 text-amber-400" />
                <span>Firma y Aprobación Formal de Stakeholders</span>
              </div>

              {activeTask.stakeholderSignOff.signed ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                      <Shield className="w-4 h-4" />
                      <span>APROBACIÓN FORMAL REGISTRADA</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {activeTask.stakeholderSignOff.timestamp}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">
                    Firmante: {activeTask.stakeholderSignOff.signedBy} ({activeTask.stakeholderSignOff.role})
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Sello de Validación: PCE-PC-CERT-{activeTask.id.toUpperCase()}-VERIFIED
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSignOff}
                  className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3"
                >
                  <p className="text-xs text-slate-400">
                    Al estampar la firma, se certifica que el criterio de aceptación ha sido revisado
                    al 100% y no existen supuestos implícitos ni ambigüedades.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Nombre del Auditor / Stakeholder
                      </label>
                      <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Ej. Jerry Ter / Dirección de Operaciones"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Rol / Cargo Institucional
                      </label>
                      <input
                        type="text"
                        value={signerRole}
                        onChange={(e) => setSignerRole(e.target.value)}
                        placeholder="Ej. Lead Quality Stakeholder"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Firmar y Emitir Aprobación Formal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
