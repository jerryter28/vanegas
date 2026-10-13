import { ProtocolTask } from '../types/protocol';

export function calculateDefaultDeadlines(baseDate: Date = new Date()) {
  // Tarea 1: Dentro de las próximas 2 horas desde el inicio
  const task1Deadline = new Date(baseDate.getTime() + 2 * 60 * 60 * 1000);

  // Tarea 2: Mañana antes de las 14:00 hrs
  const task2Deadline = new Date(baseDate);
  task2Deadline.setDate(task2Deadline.getDate() + 1);
  task2Deadline.setHours(14, 0, 0, 0);

  // Tarea 3: En 3 días antes de las 18:00 hrs
  const task3Deadline = new Date(baseDate);
  task3Deadline.setDate(task3Deadline.getDate() + 3);
  task3Deadline.setHours(18, 0, 0, 0);

  // Tarea 4: En 5 días antes de las 17:00 hrs
  const task4Deadline = new Date(baseDate);
  task4Deadline.setDate(task4Deadline.getDate() + 5);
  task4Deadline.setHours(17, 0, 0, 0);

  return {
    task1Deadline: task1Deadline.toISOString(),
    task2Deadline: task2Deadline.toISOString(),
    task3Deadline: task3Deadline.toISOString(),
    task4Deadline: task4Deadline.toISOString(),
  };
}

export function createInitialTasks(baseDate: Date = new Date()): ProtocolTask[] {
  const deadlines = calculateDefaultDeadlines(baseDate);

  return [
    {
      id: 'tarea-1',
      order: 1,
      title: 'Auditoría Técnica y Validación de Requerimientos Iniciales',
      deadlineDescription: 'Dentro de las próximas 2 horas desde el inicio',
      targetDeadline: deadlines.task1Deadline,
      priority: 'URGENTE',
      acceptanceCriteria: 'Matriz de especificaciones revisada al 100%, sin supuestos implícitos.',
      alertBeforeMinutes: 15,
      status: 'PENDIENTE',
      inputPayload: `MATRIZ DE REQUERIMIENTOS ENTRANTES:
1. Requisito R1: Cumplimiento temporal estricto en entregables de alta dirección.
2. Requisito R2: Arquitectura de alertas tempranas con umbrales diferenciados (15m, 30m, 60m).
3. Requisito R3: Auditoría formal de dependencias de terceros; no se permiten supuestos no documentados.
4. Requisito R4: Sistema de contingencia técnica ante demoras críticas.`,
      lastExecution: null,
      acceptanceChecklist: [
        { id: 't1-c1', label: 'Matriz de especificaciones revisada al 100%', checked: false },
        { id: 't1-c2', label: 'Eliminación y descarte de todos los supuestos implícitos', checked: false },
        { id: 't1-c3', label: 'Validación de viabilidad técnica de los 4 hitos', checked: false },
        { id: 't1-c4', label: 'Matriz de trazabilidad cruzada firmada', checked: false },
      ],
      stakeholderSignOff: {
        signed: false,
      },
    },
    {
      id: 'tarea-2',
      order: 2,
      title: 'Optimización y Redacción de Textos Ejecutivos',
      deadlineDescription: 'Mañana antes de las 14:00 hrs',
      targetDeadline: deadlines.task2Deadline,
      priority: 'ALTA',
      acceptanceCriteria: 'Texto pulido, concreto, conciso y concluyente, libre de rodeos y lenguaje pasivo.',
      alertBeforeMinutes: 30,
      status: 'PENDIENTE',
      inputPayload: `BORRADOR DE TEXTO A OPTIMIZAR:
"Se ha venido considerando por parte de la gerencia que quizás en las próximas semanas se podrían estar tomando algunas medidas con respecto a los tiempos de entrega, dado que se observa que los plazos no siempre son cumplidos como se esperaba. Se sugiere que probablemente los equipos deberían intentar reportar con anticipación cualquier posible eventualidad para que se pueda evaluar qué hacer."`,
      lastExecution: null,
      acceptanceChecklist: [
        { id: 't2-c1', label: 'Eliminación total de rodeos, evasivas y ambigüedades', checked: false },
        { id: 't2-c2', label: 'Erradicación estricta de la voz pasiva (uso de verbos de acción directa)', checked: false },
        { id: 't2-c3', label: 'Estructuración concluyente y accionable para C-Level', checked: false },
        { id: 't2-c4', label: 'Texto pulido, concreto y con métricas claras', checked: false },
      ],
      stakeholderSignOff: {
        signed: false,
      },
    },
    {
      id: 'tarea-3',
      order: 3,
      title: 'Verificación de Control de Calidad y Resistencia a Errores',
      deadlineDescription: 'En 3 días antes de las 18:00 hrs',
      targetDeadline: deadlines.task3Deadline,
      priority: 'ALTA',
      acceptanceCriteria: 'Pruebas A/B concluyentes completadas con margen de error inferior al 1%.',
      alertBeforeMinutes: 60,
      status: 'PENDIENTE',
      inputPayload: `DATOS DEL BANCO DE PRUEBAS A/B:
- Muestra Evaluada Grupo A (Control): N=10,000 transacciones de auditoría. Fallas detectadas: 14 (0.14%).
- Muestra Evaluada Grupo B (Protocolo Optimizado): N=10,000 transacciones. Fallas detectadas: 3 (0.03%).
- Nivel de confianza estadística: 99.5%.
- Margen de error estándar calculado: < 0.08% (Inferior al umbral máximo permitido de 1%).
- Prueba de esfuerzo bajo carga pico: Sin pérdida de integridad de datos.`,
      lastExecution: null,
      acceptanceChecklist: [
        { id: 't3-c1', label: 'Pruebas A/B concluyentes completadas y documentadas', checked: false },
        { id: 't3-c2', label: 'Margen de error empírico inferior al 1.00%', checked: false },
        { id: 't3-c3', label: 'Pruebas de resistencia a fallos y carga de estrés superadas', checked: false },
        { id: 't3-c4', label: 'Intervalo de confianza verificado estadísticamente', checked: false },
      ],
      stakeholderSignOff: {
        signed: false,
      },
    },
    {
      id: 'tarea-4',
      order: 4,
      title: 'Entrega Final y Cierre de Compromisos con Stakeholders',
      deadlineDescription: 'En 5 días antes de las 17:00 hrs',
      targetDeadline: deadlines.task4Deadline,
      priority: 'NORMAL',
      acceptanceCriteria: 'Firma y aprobación formal del informe de gestión.',
      alertBeforeMinutes: 120,
      status: 'PENDIENTE',
      inputPayload: `PUNTOS CLAVE PARA EL CIERRE DE GESTIÓN:
- Entregable 1 (Auditoría Técnica): 100% verificado sin supuestos.
- Entregable 2 (Redacción Ejecutiva): Publicada en formato conciso de alta dirección.
- Entregable 3 (Control de Calidad): Margen de error 0.03%, superando umbral <1%.
- Acuerdos de Gobernanza: Aprobación formal de las partes interesadas y acta de cierre.`,
      lastExecution: null,
      acceptanceChecklist: [
        { id: 't4-c1', label: 'Informe de gestión integral consolidado', checked: false },
        { id: 't4-c2', label: 'Verificación de actas de las 3 tareas previas', checked: false },
        { id: 't4-c3', label: 'Firma y aprobación formal de los Stakeholders clave', checked: false },
        { id: 't4-c4', label: 'Cierre formal de compromisos del protocolo', checked: false },
      ],
      stakeholderSignOff: {
        signed: false,
      },
    },
  ];
}
