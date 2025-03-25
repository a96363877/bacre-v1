interface Operator {
  id: string;
  name: string;
  logo: string;
}

interface OperatorSelectorProps {
  operators: Operator[];
  selectedOperator: string;
  onSelect: (operatorId: string) => void;
  error?: string;
}

export const OperatorSelector = ({
  operators,
  selectedOperator,
  onSelect,
  error,
}: OperatorSelectorProps) => (
  <div className="space-y-2">
    <label className="block text-right text-sm md:text-base mb-1 text-gray-700 font-medium">
      مشغل شبكة الجوال <span className="text-red-500">*</span>
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {operators.map((op) => (
        <button
          key={op.id}
          type="button"
          className={`p-3 md:p-4 border-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md ${
            selectedOperator === op.id
              ? "border-[#146394] bg-blue-50"
              : "border-gray-300 hover:border-blue-300"
          }`}
          onClick={() => onSelect(op.id)}
        >
          <img
            src={op.logo}
            alt={op.name}
            className="w-24 md:w-32 h-auto object-contain"
          />
        </button>
      ))}
    </div>
    {error && (
      <p className="text-red-500 text-xs md:text-sm mt-1 text-right animate-pulse">
        {error}
      </p>
    )}
  </div>
);
