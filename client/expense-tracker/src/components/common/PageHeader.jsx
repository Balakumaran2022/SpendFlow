export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 text-xs sm:text-base">{description}</p>}

      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
