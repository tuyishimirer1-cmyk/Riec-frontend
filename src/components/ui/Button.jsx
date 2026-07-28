const baseClasses =
  'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_14px_30px_rgba(249,115,22,0.35)]',
  outline:
    'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm',
  ghost: 'text-slate-700 hover:bg-slate-100',
}

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  className = '',
  ...rest
}) => {
  return (
    <button
      className={`${baseClasses} ${
        variants[variant]
      } ${fullWidth ? 'w-full' : ''} py-3.5 px-4 text-sm ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  )
}

export default Button

