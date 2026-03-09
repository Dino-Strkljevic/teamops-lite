import { useDroppable } from "@dnd-kit/core";
import { Box, Stack, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../types";
import DraggableTaskCard from "./DraggableTaskCard";

interface Props {
  status: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  onSuccess: () => void;
  onError: () => void;
  onViewDetails: (task: Task) => void;
}

export default function DroppableColumn({
  status,
  label,
  color,
  tasks,
  onSuccess,
  onError,
  onViewDetails,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        bgcolor: isOver ? "primary.50" : "grey.50",
        borderRadius: 2,
        border: "2px solid",
        borderColor: isOver ? "primary.300" : "transparent",
        p: 1.5,
        minHeight: 200,
        transition: "background-color 0.15s ease, border-color 0.15s ease",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700} color={color}>
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            bgcolor: "grey.200",
            borderRadius: 10,
            px: 0.75,
            py: 0.25,
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          {tasks.length}
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {tasks.length === 0 ? (
          <Typography variant="caption" color="text.disabled" sx={{ px: 0.5 }}>
            No tasks
          </Typography>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onSuccess={onSuccess}
              onError={onError}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
