export default function AdminPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        Módulo pronto para implementação — estrutura de rotas, RBAC e repositórios já configurados.
      </div>
    </div>
  );
}
