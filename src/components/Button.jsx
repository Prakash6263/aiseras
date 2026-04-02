"use client"

export function Button({ children, onClick, variant = "primary", className = "", ...props }) {
  const baseStyles = "px-3 py-1 rounded-full text-lg font-medium transition-all"

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90",
    outline: "border border-white text-white bg-transparent hover:bg-white/10",
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
