'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  color?: string
}

export function QRCodeGenerator({ value, size = 200, color = 'var(--text-primary)' }: QRCodeGeneratorProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg inline-block">
      <QRCodeSVG 
        value={value} 
        size={size} 
        bgColor="#ffffff"
        fgColor="#000000"
        level="H" 
      />
    </div>
  )
}
