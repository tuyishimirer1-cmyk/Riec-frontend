const TextField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  rightElement,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center rounded-xl border bg-slate-50/80 px-3.5 py-2.5 text-sm transition-all duration-150 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}
      >
        {icon && <span className="mr-2.5 text-slate-400">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {rightElement && <span className="ml-2">{rightElement}</span>}
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  )
}

export default TextField

