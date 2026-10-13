import React from 'react';
import { Flame, Download, Trash2, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';
import { TokenLedgerEntry } from '../types/protocol';

interface TokenLedgerViewProps {
  entries: TokenLedgerEntry[];
  onClearLedger: () => void;
}

export const TokenLedgerView: React.FC<TokenLedgerViewProps> = ({
  entries,
  onClearLedger,
}) => {
  const totalPromptTokens = entries.reduce((acc, e) => acc + e.promptTokens, 0);
  const totalCandidateTokens = entries.reduce((acc, e) => acc + e.candidateTokens, 0);
  const totalAllTokens = entries.reduce((acc, e) => acc + e.totalTokens, 0);
  const avgLatency =
    entries.length > 0
      ? Math.round(entries.reduce((acc, e) => acc + e.executionTimeMs, 0) / entries.length)
      : 0;

  const exportCsv = () => {
    if (entries.length === 0) return;
    const header = 'ID,Tarea,Fecha,PromptTokens,CandidateTokens,TotalTokens,LatenciaMs\n';
    const rows = entries
      .map(
        (e) =>
          `"${e.id}","${e.taskTitle.replace(/"/g, '""')}","${e.timestamp}",${e.promptTokens},${e.candidateTokens},${e.totalTokens},${e.executionTimeMs}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registro_tokens_protocolo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Aggregate Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>TRAZABILIDAD Y REGISTRO OBLIGATORIO</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">Regla IA #2 de Protocolo</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Registro Histórico del Consumo de Tokens
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={entries.length === 0}
              onClick={exportCsv}
              className="px-3.5 py-2 text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            {entries.length > 0 && (
              <button
                onClick={onClearLedger}
                className="p-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors border border-red-900/50"
                title="Limpiar historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Aggregates strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-mono">TOTAL EJECUCIONES</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              {entries.length}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-mono">PROMPT TOKENS ACUM.</div>
            <div className="text-xl font-bold text-slate-300 font-mono tabular-nums mt-0.5">
              {totalPromptTokens.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-mono">CANDIDATE TOKENS ACUM.</div>
            <div className="text-xl font-bold text-slate-300 font-mono tabular-nums mt-0.5">
              {totalCandidateTokens.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30 bg-amber-950/10">
            <div className="text-[10px] text-amber-400 font-mono">TOTAL TOKENS PROTOCOLO</div>
            <div className="text-xl font-bold text-amber-300 font-mono tabular-nums mt-0.5">
              {totalAllTokens.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* High-density data grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Flame className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold text-slate-300">
              No hay ejecuciones registradas todavía
            </div>
            <p className="text-xs max-w-sm mx-auto">
              Ejecuta cualquiera de las 4 tareas en la pestaña "Motor IA & Tokens" para
              comenzar el registro analítico continuo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 font-sans">Tarea</th>
                  <th className="py-3 px-4 text-right">Prompt</th>
                  <th className="py-3 px-4 text-right">Candidates</th>
                  <th className="py-3 px-4 text-right">Total Tokens</th>
                  <th className="py-3 px-4 text-right">Latencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 tabular-nums">
                      {new Date(entry.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {entry.taskTitle}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                      {entry.promptTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                      {entry.candidateTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-amber-400">
                      {entry.totalTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                      {entry.executionTimeMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
