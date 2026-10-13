import React, { useState } from 'react';
import { X, Plus, Clock, ShieldAlert } from 'lucide-react';
import { ProtocolTask, TaskPriority } from '../types/protocol';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: ProtocolTask) => void;
  existingCount: number;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  existingCount,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('ALTA');
  const [deadlineDescription, setDeadlineDescription] = useState('En 24 horas');
  const [hoursFromNow, setHoursFromNow] = useState(24);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [alertBeforeMinutes, setAlertBeforeMinutes] = useState(30);
  const [inputPayload, setInputPayload] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !acceptanceCriteria.trim()) return;

    const targetDeadline = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();

    const newTask: ProtocolTask = {
      id: `tarea-${Date.now()}`,
      order: existingCount + 1,
      title: title.trim(),
      deadlineDescription: deadlineDescription.trim(),
      targetDeadline,
      priority,
      acceptanceCriteria: acceptanceCriteria.trim(),
      alertBeforeMinutes: Number(alertBeforeMinutes) || 30,
      status: 'PENDIENTE',
      inputPayload: inputPayload.trim() || 'Especificaciones iniciales para auditoría.',
      lastExecution: null,
      acceptanceChecklist: [
        {
          id: `chk-${Date.now()}-1`,
          label: acceptanceCriteria.trim(),
          checked: false,
        },
        {
          id: `chk-${Date.now()}-2`,
          label: 'Verificación de trazabilidad y ausencia de supuestos',
          checked: false,
        },
      ],
      stakeholderSignOff: {
        signed: false,
      },
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            Programar Nuevo Entregable Crítico
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Título del Entregable / Hito
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Auditoría de Seguridad y Pruebas de Penetración"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-sans focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              >
                <option value="URGENTE">URGENTE</option>
                <option value="ALTA">ALTA</option>
                <option value="NORMAL">NORMAL</option>
                <option value="BAJA">BAJA</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Alerta Requerida (min antes)
              </label>
              <select
                value={alertBeforeMinutes}
                onChange={(e) => setAlertBeforeMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              >
                <option value={15}>15 minutos antes</option>
                <option value={30}>30 minutos antes</option>
                <option value={60}>60 minutos antes</option>
                <option value={120}>120 minutos antes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Descripción del Plazo
              </label>
              <input
                type="text"
                value={deadlineDescription}
                onChange={(e) => setDeadlineDescription(e.target.value)}
                placeholder="Ej. En 24 horas antes de las 18:00"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Horas Límite desde Ahora
              </label>
              <input
                type="number"
                min={1}
                max={360}
                value={hoursFromNow}
                onChange={(e) => setHoursFromNow(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Criterio de Aceptación (Estricto)
            </label>
            <textarea
              required
              rows={2}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Ej. Verificación de 0 fallas críticas y aprobación del informe."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Registrar en Protocolo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
