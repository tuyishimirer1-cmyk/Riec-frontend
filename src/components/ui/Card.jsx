import { forwardRef } from 'react'

const Card = forwardRef(({ children, className = '', padded = true, shadow = true }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-2xl bg-white border ${className} ${padded ? 'p-5' : ''} ${shadow ? 'shadow-[var(--shadow-1)]' : ''}`}
      style={{ borderColor: 'var(--color-stroke)' }}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card

