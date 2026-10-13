/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  BellRing,
  Sparkles,
  FileCheck,
  Shield,
  Layers,
  Filter,
  BarChart3,
  Calendar,
  Volume2,
} from 'lucide-react';
import { ProtocolTask, TaskExecutionResult, TokenLedgerEntry } from './types/protocol';
import { createInitialTasks } from './utils/protocolDefaults';
import { computeCountdown, CountdownInfo } from './utils/timeUtils';
import { soundManager } from './utils/audioAlert';
import { TopBar } from './components/TopBar';
import { AlertBanner } from './components/AlertBanner';
import { TaskCard } from './components/TaskCard';
import { AIExecutionWorkbench } from './components/AIExecutionWorkbench';
import { AuditMatrix } from './components/AuditMatrix';
import { TokenLedgerView } from './components/TokenLedgerView';
import { ExecutiveDossier } from './components/ExecutiveDossier';
import { NewTaskModal } from './components/NewTaskModal';
import { SimulationBar } from './components/SimulationBar';

export default function App() {
  const [tasks, setTasks] = useState<ProtocolTask[]>(() => {
    const saved = localStorage.getItem('pce_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return createInitialTasks();
  });

  const [tokenLedger, setTokenLedger] = useState<TokenLedgerEntry[]>(() => {
    const saved = localStorage.getItem('pce_token_ledger');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'tok-init-1',
        taskId: 'tarea-1',
        taskTitle: 'Auditoría Técnica y Validación de Requerimientos Iniciales',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        promptTokens: 312,
        candidateTokens: 580,
        totalTokens: 892,
        executionTimeMs: 1420,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<
    'cronograma' | 'matriz' | 'ia_engine' | 'ledger' | 'dossier'
  >('cronograma');

  const [selectedTask, setSelectedTask] = useState<ProtocolTask>(tasks[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [simulatedOffsetMs, setSimulatedOffsetMs] = useState<number>(0);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);

  // Clock tick state
  const [, setClockTick] = useState<number>(0);

  // Keep track of which tasks have already sounded their alarms so we don't spam indefinitely
  const alertedOverdueRef = useRef<Set<string>>(new Set());
  const alertedWarningRef = useRef<Set<string>>(new Set());

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('pce_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pce_token_ledger', JSON.stringify(tokenLedger));
  }, [tokenLedger]);

  // Sync selected task when tasks change
  useEffect(() => {
    const updated = tasks.find((t) => t.id === selectedTask.id);
    if (updated) {
      setSelectedTask(updated);
    }
  }, [tasks, selectedTask.id]);

  // Real-time interval timer (1 second resolution)
  useEffect(() => {
    const interval = setInterval(() => {
      setClockTick(Date.now());

      // Evaluate tasks against deadline
      tasks.forEach((task) => {
        if (task.status === 'CUMPLIDO') return;

        const info = computeCountdown(
          task.targetDeadline,
          task.alertBeforeMinutes,
          simulatedOffsetMs,
          task.status
        );

        // Immediate audio and visual alert when a task is delayed
        if (info.isOverdue && !alertedOverdueRef.current.has(task.id)) {
          alertedOverdueRef.current.add(task.id);
          soundManager.playDelayedAlarm();
        }

        // Early warning chime
        if (info.isEarlyWarning && !alertedWarningRef.current.has(task.id)) {
          alertedWarningRef.current.add(task.id);
          soundManager.playEarlyWarningChime();
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, simulatedOffsetMs]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.setMuted(!nextState);
  };

  // Compute countdowns for all tasks
  const tasksWithCountdown = tasks.map((t) => {
    const countdown = computeCountdown(
      t.targetDeadline,
      t.alertBeforeMinutes,
      simulatedOffsetMs,
      t.status
    );
    return { task: t, countdown };
  });

  const delayedTasks = tasksWithCountdown.filter(
    (item) => item.countdown.isOverdue && item.task.status !== 'CUMPLIDO'
  );

  const warningTasks = tasksWithCountdown.filter(
    (item) => item.countdown.isEarlyWarning && item.task.status !== 'CUMPLIDO'
  );

  // Handlers
  const handleSelectTaskForAI = (task: ProtocolTask) => {
    setSelectedTask(task);
    setActiveTab('ia_engine');
  };

  const handleSelectTaskForAudit = (task: ProtocolTask) => {
    setSelectedTask(task);
    setActiveTab('matriz');
  };

  const handleToggleComplete = (task: ProtocolTask) => {
    const isNowCompleted = task.status !== 'CUMPLIDO';
    const newStatus = isNowCompleted ? 'CUMPLIDO' : 'PENDIENTE';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          return {
            ...t,
            status: newStatus,
            acceptanceChecklist: t.acceptanceChecklist.map((c) => ({
              ...c,
              checked: isNowCompleted ? true : c.checked,
            })),
          };
        }
        return t;
      })
    );

    if (isNowCompleted) {
      soundManager.playSuccessChime();
    }
  };

  const handleApplyExecutionResult = (taskId: string, result: TaskExecutionResult) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            lastExecution: result,
            acceptanceChecklist: t.acceptanceChecklist.map((item) => ({
              ...item,
              checked: true,
            })),
          };
        }
        return t;
      })
    );
  };

  const handleRecordTokenUsage = (entry: TokenLedgerEntry) => {
    setTokenLedger((prev) => [entry, ...prev]);
  };

  const handleToggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedList = t.acceptanceChecklist.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          );
          return {
            ...t,
            acceptanceChecklist: updatedList,
          };
        }
        return t;
      })
    );
  };

  const handleSignOffTask = (taskId: string, signedBy: string, role: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'CUMPLIDO',
            stakeholderSignOff: {
              signed: true,
              signedBy,
              role,
              timestamp: new Date().toISOString(),
            },
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: ProtocolTask) => {
    setTasks((prev) => [...prev, newTask]);
    soundManager.playSuccessChime();
  };

  const filteredTasks = tasksWithCountdown.filter((item) => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'CUMPLIDO') return item.task.status === 'CUMPLIDO';
    return item.task.priority === filterPriority;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
        delayedCount={delayedTasks.length}
        alertCount={warningTasks.length}
      />

      {/* Immediate Audio-Visual Emergency Alert Banner */}
      <AlertBanner
        delayedTasks={delayedTasks}
        warningTasks={warningTasks}
        onSelectTask={(id) => {
          const t = tasks.find((item) => item.id === id);
          if (t) handleSelectTaskForAI(t);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Simulation / Time Warp Testing Bar */}
        <SimulationBar
          simulatedOffsetMs={simulatedOffsetMs}
          setSimulatedOffsetMs={setSimulatedOffsetMs}
          triggerManualSoundTest={(type) => {
            if (type === 'early') soundManager.playEarlyWarningChime();
            else soundManager.playDelayedAlarm();
          }}
        />

        {/* Tab View Switcher */}
        {activeTab === 'cronograma' && (
          <div className="space-y-6">
            {/* Protocol Summary Hero Section */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  {/* Zero-Pill Unboxed Tagline */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>PROTOCOLO OPERATIVO</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400">Guía Anexo de Entregables</span>
                    <span aria-hidden="true">·</span>
                    <span>Plazos Críticos</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Cronograma de Hitos y Entregables Críticos
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    Objetivo: Garantizar la máxima precisión y puntualidad en el cumplimiento de los
                    plazos establecidos, eliminando ambigüedades en la asignación y asegurando alertas
                    automáticas tempranas con resolución analítica por IA.
                  </p>
                </div>

                {/* 4-KPI Strip with tabular numerals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono shrink-0">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Hitos Totales</div>
                    <div className="text-xl font-bold text-white tabular-nums mt-0.5">
                      {tasks.length}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Cumplidos</div>
                    <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
                      {tasks.filter((t) => t.status === 'CUMPLIDO').length}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">En Alerta</div>
                    <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">
                      {warningTasks.length}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Retrasados</div>
                    <div className="text-xl font-bold text-red-400 tabular-nums mt-0.5">
                      {delayedTasks.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter controls */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setFilterPriority('ALL')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      filterPriority === 'ALL'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({tasks.length})
                  </button>
                  <button
                    onClick={() => setFilterPriority('URGENTE')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      filterPriority === 'URGENTE'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Urgentes
                  </button>
                  <button
                    onClick={() => setFilterPriority('ALTA')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      filterPriority === 'ALTA'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Alta Prioridad
                  </button>
                  <button
                    onClick={() => setFilterPriority('CUMPLIDO')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      filterPriority === 'CUMPLIDO'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cumplidos
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Horario Local Referencia: <span className="text-slate-200">2026-10-12</span>
                </div>
              </div>
            </section>

            {/* Task Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map(({ task, countdown }) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  countdown={countdown}
                  onExecuteAI={handleSelectTaskForAI}
                  onViewAudit={handleSelectTaskForAudit}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </section>
          </div>
        )}

        {/* Tab 2: Matriz de Auditoría */}
        {activeTab === 'matriz' && (
          <AuditMatrix
            tasks={tasks}
            onToggleChecklistItem={handleToggleChecklistItem}
            onSignOffTask={handleSignOffTask}
          />
        )}

        {/* Tab 3: Motor IA & Tokens */}
        {activeTab === 'ia_engine' && (
          <AIExecutionWorkbench
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onApplyExecutionResult={handleApplyExecutionResult}
            onRecordTokenUsage={handleRecordTokenUsage}
          />
        )}

        {/* Tab 4: Registro Histórico de Tokens */}
        {activeTab === 'ledger' && (
          <TokenLedgerView
            entries={tokenLedger}
            onClearLedger={() => setTokenLedger([])}
          />
        )}

        {/* Tab 5: Dossier Ejecutivo */}
        {activeTab === 'dossier' && (
          <ExecutiveDossier
            tasks={tasks}
            tokenEntries={tokenLedger}
          />
        )}
      </main>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        existingCount={tasks.length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 print:hidden text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Protocolo de Cumplimiento de Entregables y Plazos Críticos (PCE-PC)</span>
          <span>Reglas de Ejecución con IA · Chain of Thought & Trazabilidad de Tokens</span>
        </div>
      </footer>
    </div>
  );
}
