import { useProjects } from "../features/projects/hooks/useProjects";

export default function DashboardPage() {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) return <div>Loading projects...</div>;
  if (isError) return <div>Error loading projects</div>;

  return (
    <div>
      <h2>Projects</h2>

      {data?.map((project: any) => (
        <div key={project.id}>
          <strong>{project.name}</strong>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}