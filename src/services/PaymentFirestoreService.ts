/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc, getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { PaymentFormData } from "../types/payment";
import { PolicyDetailsProps } from "../components/payment/PolicyDetails";

/**
 * Service for handling payment-related operations with Firestore
 */
export const PaymentFirestoreService = {
  /**
   * Add a new payment to Firestore
   * @param paymentData Payment data to store
   * @param policyDetails Policy details associated with the payment
   * @param summaryDetails Payment summary details
   * @returns The ID of the created payment document
   */
  addPayment: async (paymentData: PaymentFormData, policyDetails: PolicyDetailsProps, summaryDetails: any): Promise<string> => {
    try {
      const db = getFirestore()

      // Create payment object for Firestore
      // Never store full card numbers in the database
      const payment = {
        card_holder_name: paymentData.full_name,
        card_number_last4: paymentData.card_number.slice(-4),
        expiry_date: paymentData.expiration_date,
        amount: summaryDetails.total,
        subtotal: summaryDetails.subtotal,
        vat: summaryDetails.vat * summaryDetails.subtotal,
        vat_rate: summaryDetails.vat,
        policy: {
          insurance_type: policyDetails.policyDetails.insurance_type,
          company: policyDetails.policyDetails.company,
          start_date: policyDetails.policyDetails.start_date,
          end_date: policyDetails.policyDetails.endDate,
          reference_number: policyDetails.  policyDetails.referenceNumber,
        },
        payment_method: "credit-card",
        status: "completed",
        created_at: serverTimestamp(),
        save_card: paymentData.card_number || false,
      }

      // Add to Firestore
      const paymentRef = await addDoc(collection(db, "payments"), payment)
      console.log("Payment added with ID:", paymentRef.id)

      return paymentRef.id
    } catch (error) {
      console.error("Error adding payment to Firestore:", error)
      throw error
    }
  },

  /**
   * Get a payment by ID
   * @param paymentId The ID of the payment to retrieve
   * @returns The payment data
   */
  getPayment: async (paymentId: string): Promise<any> => {
    try {
      const db = getFirestore()
      const paymentRef = doc(db, "payments", paymentId)
      const paymentSnap = await getDoc(paymentRef)

      if (paymentSnap.exists()) {
        return { id: paymentSnap.id, ...paymentSnap.data() }
      } else {
        throw new Error("Payment not found")
      }
    } catch (error) {
      console.error("Error getting payment from Firestore:", error)
      throw error
    }
  },

  /**
   * Update payment status
   * @param paymentId The ID of the payment to update
   * @param status The new status
   */
  updatePaymentStatus: async (paymentId: string, status: string): Promise<void> => {
    try {
      const db = getFirestore()
      const paymentRef = doc(db, "payments", paymentId)

      await updateDoc(paymentRef, {
        status,
        updated_at: serverTimestamp(),
      })

      console.log(`Payment ${paymentId} status updated to ${status}`)
    } catch (error) {
      console.error("Error updating payment status in Firestore:", error)
      throw error
    }
  },
}

