'use client'

import { useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: any) => void
}

export function QRCodeScanner({ onScanSuccess, onScanError }: QRCodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Configura o scanner apenas no lado do cliente
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 }, 
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
      },
      false
    )
    
    html5QrcodeScanner.render(
      (text) => {
        // Reproduz o bip sonoro
        try {
          const audio = new Audio('/sounds/beep.mp3') // Assumindo que teremos um bip
          audio.play().catch(() => {})
        } catch (e) {}

        onScanSuccess(text)
      },
      (error) => {
        if (onScanError) onScanError(error)
      }
    )
    
    return () => {
      html5QrcodeScanner.clear().catch(e => console.error("Failed to clear scanner", e))
    }
  }, [onScanSuccess, onScanError])

  return (
    <div className="scanner-container relative">
      <div id="qr-reader" ref={scannerRef} className="w-full max-w-md mx-auto bg-[var(--bg-secondary)] overflow-hidden rounded-2xl border-2 border-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-primary)]"></div>
      
      <style jsx global>{`
        /* Overrides para o html5-qrcode para combinar com o design Dark Glass */
        #qr-reader {
          border: none !important;
        }
        #qr-reader__scan_region {
          background: #000;
        }
        #qr-reader button {
          background: var(--accent-primary) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: var(--radius-md) !important;
          font-weight: bold !important;
          cursor: pointer !important;
          margin-top: 10px !important;
        }
        #qr-reader a {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </div>
  )
}
