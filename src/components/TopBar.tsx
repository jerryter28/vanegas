import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Clock, FileCheck } from 'lucide-react';

interface TopBarProps {
  activeTab: 'cronograma' | 'matriz' | 'ia_engine' | 'ledger' | 'dossier';
  setActiveTab: (tab: 'cronograma' | 'matriz' | 'ia_engine' | 'ledger' | 'dossier') => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onOpenNewTaskModal: () => void;
  delayedCount: number;
  alertCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  toggleSound,
  onOpenNewTaskModal,
  delayedCount,
  alertCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#cronograma"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('cronograma');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-amber-400 transition-colors"
          >
            Protocolo PCE-PC
          </a>
          <span className="hidden lg:inline text-xs text-slate-500 font-mono">
            Plazos Críticos & Entregables
          </span>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('cronograma')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'cronograma'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cronograma
          </button>
          <button
            onClick={() => setActiveTab('matriz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'matriz'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Matriz de Auditoría
          </button>
          <button
            onClick={() => setActiveTab('ia_engine')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'ia_engine'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Motor IA & Tokens
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'ledger'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Registro de Tokens
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'dossier'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dossier Ejecutivo
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar alertas acústicas' : 'Activar alertas acústicas'}
            className={`p-2 rounded-lg text-xs font-mono transition-colors border ${
              soundEnabled
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40'
                : 'border-slate-700 text-slate-400 bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? (
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Audio Activo</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Silenciado</span>
              </span>
            )}
          </button>

          <button
            onClick={onOpenNewTaskModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            + Añadir Entregable
          </button>
        </div>
      </div>

      {/* Sub-header status bar for mobile / quick state metrics */}
      <div className="md:hidden border-t border-slate-800 bg-slate-950/80 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs">
        <div className="flex items-center gap-4 text-slate-400 shrink-0">
          <button
            onClick={() => setActiveTab('cronograma')}
            className={`whitespace-nowrap ${activeTab === 'cronograma' ? 'text-amber-400 font-bold' : ''}`}
          >
            Cronograma
          </button>
          <button
            onClick={() => setActiveTab('matriz')}
            className={`whitespace-nowrap ${activeTab === 'matriz' ? 'text-amber-400 font-bold' : ''}`}
          >
            Auditoría
          </button>
          <button
            onClick={() => setActiveTab('ia_engine')}
            className={`whitespace-nowrap ${activeTab === 'ia_engine' ? 'text-amber-400 font-bold' : ''}`}
          >
            Motor IA
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`whitespace-nowrap ${activeTab === 'dossier' ? 'text-amber-400 font-bold' : ''}`}
          >
            Dossier
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          {delayedCount > 0 && (
            <span className="text-red-400 font-bold">{delayedCount} Retraso(s)</span>
          )}
          {alertCount > 0 && (
            <span className="text-amber-400 font-bold">{alertCount} Alerta(s)</span>
          )}
        </div>
      </div>
    </header>
  );
};
