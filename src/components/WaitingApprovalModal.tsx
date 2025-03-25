import { motion } from "framer-motion";

interface WaitingApprovalModalProps {
  isOpen: boolean;
  status: "waiting" | "rejected";
  onClose: () => void;
}

export const WaitingApprovalModal = ({
  isOpen,
  status,
  onClose,
}: WaitingApprovalModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl max-w-lg w-full p-8 mx-4 shadow-2xl"
      >
        {status === "waiting" ? (
          <>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 border-4 border-[#146394] rounded-full"
                animate={{
                  rotate: 360,
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-[#146394]/30 rounded-full"
                animate={{
                  rotate: -360,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-[#146394] mb-4">
              الرجاء الانتظار
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              جاري معالجة طلبك
            </p>
            <motion.div
              className="mt-6 text-sm text-gray-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              جاري المعالجة...
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center"
            >
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-red-500 mb-4">
              تم رفض الطلب
            </h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              عذراً، لم نتمكن من إتمام طلبك. يرجى التحقق من المعلومات والمحاولة
              مرة أخرى
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="bg-[#146394] text-white px-8 py-3 rounded-xl font-semibold transition-all hover:bg-[#0f4c70] shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              حاول مرة أخرى
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
