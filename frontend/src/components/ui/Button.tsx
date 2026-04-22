import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type BaseButtonProps = {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
  isLoading?: boolean
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
type LinkButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>

function getVariantClasses(variant: BaseButtonProps['variant']) {
  const variants = {
    primary: 'bg-accent text-surface-950 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20',
    ghost: 'text-muted-light hover:text-accent border border-surface-600/50 hover:border-accent/30',
  }
  return variants[variant ?? 'primary']
}

function getSizeClasses(size: BaseButtonProps['size']) {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
  }
  return sizes[size ?? 'md']
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        font-body font-semibold rounded-lg transition-all duration-300
        flex items-center justify-center gap-2
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${isLoading || disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`
        font-body font-semibold rounded-lg transition-all duration-300
        flex items-center justify-center gap-2
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
      {...props}
    >
      {children}
    </a>
  )
}
