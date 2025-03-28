"use server";

import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../apis/firebase";

export async function verifyOtp(orderId: string, code: string) {
  try {
    // Get the order document from Firestore
    const orderRef = doc(db, "pays", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return {
        otpStat: false,
        message: "الطلب غير موجود",
      };
    }

    const orderData = orderSnap.data();

    // Check if the OTP code matches
    if (orderData.verificationCode !== code) {
      // Update the document to increment failed attempts
      await updateDoc(orderRef, {
        failedAttempts: (orderData.failedAttempts || 0) + 1,
        lastAttemptAt: serverTimestamp(),
      });

      return {
        success: false,
        message: "رمز التحقق غير صحيح",
      };
    }

    // OTP is valid, update the document
    await updateDoc(orderRef, {
      verified: true,
      verifiedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "تم التحقق بنجاح",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء التحقق من الرمز",
    };
  }
}

export async function resendOtp(orderId: string) {
  try {
    // Get the order document from Firestore
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return {
        success: false,
        message: "الطلب غير موجود",
      };
    }

    // Generate a new OTP code (you can customize this)
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the document with the new OTP
    await updateDoc(orderRef, {
      verificationCode: newOtpCode,
      codeGeneratedAt: serverTimestamp(),
      resendCount: (orderSnap.data().resendCount || 0) + 1,
    });

    // In a real application, you would send the OTP via SMS here
    // This could be done using a Firebase Cloud Function or another service

    return {
      success: true,
      message: "تم إعادة إرسال الرمز بنجاح",
    };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء إعادة إرسال الرمز",
    };
  }
}
