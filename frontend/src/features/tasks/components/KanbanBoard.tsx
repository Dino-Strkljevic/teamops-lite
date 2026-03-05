import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import type { Task, TaskStatus } from '../types';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';
import DroppableColumn from './DroppableColumn';
import TaskCard from './TaskCard';

interface Column {
  status: TaskStatus;
  label:  string;
  color:  string;
}

const COLUMNS: Column[] = [
  { status: 'TODO',        label: 'To Do',      color: 'text.secondary' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'info.main'      },
  { status: 'DONE',        label: 'Done',        color: 'success.main'   },
];

const COLUMN_STATUSES = new Set<string>(COLUMNS.map((c) => c.status));

interface Props {
  tasks:     Task[];
  onSuccess: () => void;
  onError:   () => void;
}

export default function KanbanBoard({ tasks, onSuccess, onError }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { mutate } = useUpdateTaskStatus();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as Task | undefined;
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const task      = active.data.current?.task as Task | undefined;
    const newStatus = over?.id as string | undefined;

    if (task && newStatus && COLUMN_STATUSES.has(newStatus) && task.status !== newStatus) {
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus as TaskStatus } : t)),
      );

      mutate(
        { taskId: task.id, projectId: task.projectId, status: newStatus as TaskStatus },
        { onSuccess, onError },
      );
    }

    setActiveTask(null);
  }

  const byStatus = (status: TaskStatus) => localTasks.filter((t) => t.status === status);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 2,
          alignItems:          'start',
        }}
      >
        {COLUMNS.map(({ status, label, color }) => (
          <DroppableColumn
            key={status}
            status={status}
            label={label}
            color={color}
            tasks={byStatus(status)}
            onSuccess={onSuccess}
            onError={onError}
          />
        ))}
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
            <TaskCard
              task={activeTask}
              onSuccess={() => {}}
              onError={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
