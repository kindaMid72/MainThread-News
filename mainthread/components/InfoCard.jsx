export default function InfoCard({ title, value, statisticValue, icon }) {
  return (
    <div className="flex items-center justify-between p-5 min-w-full lg:min-w-[250px] bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title || "Overview"}
        </h3>
        <div>
          <p className="text-2xl font-semibold text-slate-900">
            {value !== undefined && value !== null ? String(value) : "0"}
          </p>
          {statisticValue && (
            <p className="text-sm font-medium text-emerald-600">
              {statisticValue}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-600 [&>i]:text-xl">
        {icon}
      </div>
    </div>
  );
}