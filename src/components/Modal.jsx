"use client"

import { X } from "lucide-react"

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#191919] text-white max-w-md w-full mx-4 rounded-3xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
