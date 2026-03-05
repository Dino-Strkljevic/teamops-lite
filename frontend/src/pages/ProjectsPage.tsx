import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useProjects } from "../features/projects/hooks/useProjects";

export default function ProjectsPage() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Failed to load projects.</Alert>;
  }

  if (!projects || projects.length === 0) {
    return <Typography color="text.secondary">No projects yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Projects
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {projects.map((project) => (
          <Card key={project.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                {project.name}
              </Typography>
              {project.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {project.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
