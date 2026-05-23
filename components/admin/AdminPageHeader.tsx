type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminPageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#1a1a1a", fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm" style={{ color: "#5c5c5c" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
