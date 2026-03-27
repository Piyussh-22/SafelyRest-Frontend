const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    {Icon && (
      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon size={32} className="text-gray-400" />
      </div>
    )}
    <div>
      <p className="font-semibold text-lg text-[var(--text)]">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
