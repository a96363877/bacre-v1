import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { register } from "../apis/auth";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  submit?: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "اسم العائلة مطلوب";
    }
    if (!formData.username.trim()) {
      newErrors.username = "اسم المستخدم مطلوب";
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "عنوان بريد غير صالح";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.email,
        formData.phone,
        formData.password
      );

      navigate("/login", {
        state: { message: "تم إنشاء الحساب بنجاح، قم بتسجيل الدخول" },
      });
    } catch {
      setErrors({ submit: "فشل في إنشاء الحساب، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#146394] mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-[#146394]">انضم إلى مجتمعنا</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="w-1/2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="الاسم الأول"
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="w-1/2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="اسم العائلة"
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              placeholder="اسم المستخدم"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور"
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "إنشاء حساب"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 mr-2"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};
