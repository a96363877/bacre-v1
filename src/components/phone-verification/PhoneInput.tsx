interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => (
  <div className="space-y-2">
    <label className="block text-right text-sm md:text-base mb-1 text-[#146394] font-medium">
      رقم الجوال <span className="text-red-500">*</span>
    </label>
    <input
      type="tel"
      className={`w-full p-2.5 md:p-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error
          ? "border-red-400 bg-red-50"
          : "border-gray-300 hover:border-[#146394]"
      }`}
      placeholder="05xxxxxxxx"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir="rtl"
    />
    {error && (
      <p className="text-red-500 text-xs md:text-sm mt-1 text-right animate-pulse">
        {error}
      </p>
    )}
  </div>
);
