import { useEffect, useState } from "react";
import { TbCreditCardPay } from "react-icons/tb";

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeout: () => void;
}

export const RedirectModal = ({ isOpen, onTimeout }: RedirectModalProps) => {
  const [timer, setTimer] = useState(8);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onTimeout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white p-8 rounded-2xl max-w-xl text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#146394] rounded-full flex items-center justify-center mb-4">
            <TbCreditCardPay className="text-white w-12 h-12" />
          </div>

          <h2 className="text-xl font-bold text-[#146394] mb-4">
            عملاء مصرف الراجحي
          </h2>

          <p className="text-lg font-semibold mb-4 text-slate-700">
            سيتم اجراء عملية دفع قيمة التامين من خلال خدمة سداد
          </p>

          <p className="text-gray-600 mb-6">
            سيتم تحويلك الان الى الراجحي اون لاين لإكمال عمليه السداد
          </p>

          <div className="flex items-center gap-2 text-[#146394]">
            <div className="w-8 h-8 rounded-full border-2 border-[#146394] flex items-center justify-center font-bold">
              {timer}
            </div>
            <p className="font-semibold">ثواني</p>
          </div>

          <div className="mt-6 w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-[#146394] h-full rounded-full transition-all duration-1000"
              style={{ width: `${(timer / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
