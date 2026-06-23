import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const buttonVariants = ({ variant = 'primary', size = 'md', className }: { variant?: keyof typeof variants, size?: keyof typeof sizes, className?: string } = {}) => {
  return cn(baseStyles, variants[variant], sizes[size], className)
}

const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover-lift"

const variants = {
  primary: "bg-[var(--color-primary-base)] text-white hover:bg-[var(--color-primary-hover)] shadow-glow-primary",
  secondary: "bg-[var(--color-bg-tertiary)] text-white hover:bg-[var(--color-border-strong)] border border-[var(--color-border-subtle)]",
  outline: "border border-[var(--color-border-medium)] bg-transparent hover:bg-[var(--color-bg-glass-light)] text-[var(--color-text-primary)]",
  ghost: "bg-transparent hover:bg-[var(--color-bg-glass-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
  danger: "bg-[var(--color-status-error)] text-white hover:bg-red-600 shadow-glow-accent"
}

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 py-2 px-4",
  lg: "h-11 px-8",
  icon: "h-10 w-10"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }

