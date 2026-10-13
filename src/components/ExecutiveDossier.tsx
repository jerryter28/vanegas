import React from 'react';
import { Printer, Download, CheckCircle, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { ProtocolTask, TokenLedgerEntry } from '../types/protocol';
import { formatDateTimeEs } from '../utils/timeUtils';

interface ExecutiveDossierProps {
  tasks: ProtocolTask[];
  tokenEntries: TokenLedgerEntry[];
}

export const ExecutiveDossier: React.FC<ExecutiveDossierProps> = ({
  tasks,
  tokenEntries,
}) => {
  const totalTokens = tokenEntries.reduce((acc, t) => acc + t.totalTokens, 0);
  const completedTasks = tasks.filter((t) => t.status === 'CUMPLIDO').length;
  const signedTasks = tasks.filter((t) => t.stakeholderSignOff.signed).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="text-xs font-mono text-amber-400">INFORME Y ACTA FORMAL</div>
          <h2 className="text-xl font-bold text-white mt-1">
            Dossier de Cumplimiento del Protocolo
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Documento consolidado para auditoría, comités de dirección y archivo de gobernanza.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar como PDF</span>
        </button>
      </div>

      {/* Printable Dossier Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500">
              GUÍA ANEXO · PROTOCOLO OFICIAL
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-1">
              PROTOCOLO DE CUMPLIMIENTO DE ENTREGABLES Y PLAZOS CRÍTICOS
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Garantía de máxima precisión y puntualidad en el cumplimiento de los plazos establecidos.
            </p>
          </div>

          <div className="text-right text-xs font-mono shrink-0">
            <div className="font-bold text-slate-900">CERT-PCE-PC-2026</div>
            <div className="text-slate-500 mt-0.5">
              Fecha: {new Date().toLocaleDateString('es-ES')}
            </div>
            <div className="text-emerald-700 font-bold mt-1">
              {signedTasks === tasks.length ? 'CUMPLIDO 100%' : `${signedTasks}/${tasks.length} FIRMADOS`}
            </div>
          </div>
        </div>

        {/* Section 1: Objective */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-950 border-b border-slate-200 pb-1">
            1. OBJETIVO DEL PROTOCOLO
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Garantizar la máxima precisión y puntualidad en el cumplimiento de los plazos establecidos,
            eliminando ambigüedades en la asignación y asegurando alertas automáticas tempranas.
          </p>
        </section>

        {/* Section 2: Tasks table */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-950 border-b border-slate-200 pb-1">
            2. TAREAS PROGRAMADAS Y CRONOGRAMA DE HITOS
          </h2>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-sm">
                    Tarea {task.order}: {task.title}
                  </div>
                  <span className="font-mono text-slate-600 font-bold uppercase text-[11px]">
                    Prioridad {task.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-mono text-[11px]">
                  <div>
                    <strong className="text-slate-900 font-sans">Plazo Límite:</strong> {task.deadlineDescription}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-sans">Alerta Requerida:</strong> {task.alertBeforeMinutes}m antes
                  </div>
                </div>

                <div className="text-slate-800">
                  <strong className="font-semibold text-slate-900">Criterio de Aceptación: </strong>
                  {task.acceptanceCriteria}
                </div>

                {task.lastExecution && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 text-[11px] font-mono flex items-center justify-between">
                    <span>
                      Tokens IA Registrados: <strong>{task.lastExecution.tokenUsage.totalTokens}</strong>
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      {task.lastExecution.acceptanceVerdict.summary}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: AI execution rules & Token Audit */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-950 border-b border-slate-200 pb-1">
            3. AUDITORÍA DE REGLAS DE EJECUCIÓN CON IA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-bold text-slate-900">Chain of Thought</div>
              <div className="text-slate-600 text-[11px] mt-1">
                Razonamiento analítico por fases aplicado sin supuestos.
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-bold text-slate-900">Consumo de Tokens</div>
              <div className="text-slate-600 text-[11px] mt-1 font-mono">
                {totalTokens.toLocaleString()} tokens totales auditados en ledger.
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="font-bold text-slate-900">Notificación Sonora/Visual</div>
              <div className="text-slate-600 text-[11px] mt-1">
                Alertas acústicas sintéticas operativas ante retraso.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Formal Sign-off Stamps */}
        <section className="space-y-4 pt-4 border-t-2 border-slate-900">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-950">
            4. CIERRE Y APROBACIÓN FORMAL DE STAKEHOLDERS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="border-t border-slate-400 pt-3 text-center">
              <div className="font-bold text-xs text-slate-900">
                {tasks.find((t) => t.stakeholderSignOff.signed)?.stakeholderSignOff.signedBy ||
                  'Dirección General de Proyectos'}
              </div>
              <div className="text-[11px] text-slate-600">
                {tasks.find((t) => t.stakeholderSignOff.signed)?.stakeholderSignOff.role ||
                  'Lead Stakeholder & Auditor de Entregables'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Firma Digital y Sello de Validación
              </div>
            </div>

            <div className="border-t border-slate-400 pt-3 text-center">
              <div className="font-bold text-xs text-slate-900">Comité de Aseguramiento de Calidad</div>
              <div className="text-[11px] text-slate-600">Revisión de Tolerancias y Entregables</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Aprobación de Plazos y Cronograma
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
