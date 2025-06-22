interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspacePage = ({ params }: WorkspacePageProps) => {
  const { workspaceId } = params;

  return <div>ID: {workspaceId}</div>;
};

export default WorkspacePage;
