"use client"

import { useRef, useEffect } from "react"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  maxLength: number
}

export default function OtpInput({ value, onChange, maxLength = 6 }: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <input
      ref={inputRef}
      id="otp-input"
      type="text"
      inputMode="numeric"
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-48 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#146394] focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
      placeholder="######"
      aria-label="Enter verification code"
    />
  )
}

