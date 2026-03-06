import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import TaskCard from './TaskCard';

interface Props {
  task:          Task;
  onSuccess:     () => void;
  onError:       () => void;
  onViewDetails: (task: Task) => void;
}

export default function DraggableTaskCard({ task, onSuccess, onError, onViewDetails }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id:   task.id,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform:  CSS.Translate.toString(transform),
        opacity:    isDragging ? 0 : 1,
        cursor:     'grab',
        outline:    'none',
      }}
    >
      <TaskCard
        task={task}
        onSuccess={onSuccess}
        onError={onError}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}
