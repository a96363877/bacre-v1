import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import { OfferCard } from "../../components/CompanyCard";
import offer1 from "/icons/offer-1.jpg";
import offer2 from "/icons/offer-2.svg";
import offer3 from "/icons/offer-3.png";
import offer4 from "/icons/offer-4.png";
import offer5 from "/icons/offer-5.jpg";
import offer6 from "/icons/offer-6.svg";
import offer7 from "/icons/offer-7.jpg";
import offer8 from "/icons/offer-8.svg";

const offers = [
  { id: 1, companyName: "روش ريحان", offerAmount: "$14", logo: offer1 },
  { id: 2, companyName: "نون", offerAmount: "15%", logo: offer2 },
  { id: 3, companyName: "الوزن المثالي", offerAmount: "50%", logo: offer3 },
  { id: 4, companyName: "درايف 7", offerAmount: "$20", logo: offer4 },
  { id: 5, companyName: "سويتر", offerAmount: "20%", logo: offer5 },
  { id: 6, companyName: "سيفي", offerAmount: "$10", logo: offer6 },
  { id: 7, companyName: "فيزيوثيرابيا", offerAmount: "20%", logo: offer7 },
  { id: 8, companyName: "نوفميد", offerAmount: "15%", logo: offer8 },
];

export function MarketOffers() {
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Heading
          title="خصومات وريف"
          description="خصومات وعروض مباشرة من مختلف المتاجر العالمية والمحلية لعملاء بي كير (أفراد، شركات)"
        />
        <div className="grid grid-cols-auto-fit-250 gap-6 mt-14">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              id={offer.id}
              logo={offer.logo}
              companyName={offer.companyName}
              offerAmount={offer.offerAmount}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="#"
            className="border border-[#136494] hover:bg-[#136494] hover:text-white text-[#136494] font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            aria-label="عرض المزيد من الخصومات"
          >
            عرض المزيد من الخصومات
          </Link>
        </div>
      </div>
    </section>
  );
}
