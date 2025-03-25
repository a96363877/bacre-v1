interface OfferCardProps {
  id: number;
  companyName: string;
  offerAmount: string;
  logo: string;
}

export function OfferCard({ logo, companyName, offerAmount }: OfferCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <div className="flex-shrink-0 ml-4">
        <img src={logo} alt={`${companyName} logo`} className="w-20 h-auto" />
      </div>
      <div className="">
        <h3 className="font-semibold text-gray-800">{companyName}</h3>
        <p className="text-green-600 font-medium">{offerAmount} خصم </p>
      </div>
    </div>
  );
}
