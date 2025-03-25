// Sample offers data
export const sampleOffers = [
    {
      id: "offer1",
      name: "تأمين ضد الغير - أساسي",
      company_id: "company1",
      type: "against-others",
      main_price: "120",
      company: {
        id: "company1",
        name: "شركة التأمين الأولى",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [
        { id: "feature1", content: "المساعدة على الطريق", price: 25 },
        { id: "feature2", content: "تغطية الزجاج", price: 15 },
      ],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 10 }],
    },
    {
      id: "offer2",
      name: "تأمين شامل - بريميوم",
      company_id: "company1",
      type: "comprehensive",
      main_price: "350",
      company: {
        id: "company1",
        name: "شركة التأمين الأولى",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [
        { id: "feature1", content: "المساعدة على الطريق", price: 25 },
        { id: "feature2", content: "تغطية الزجاج", price: 15 },
        { id: "feature3", content: "تغطية سيارة بديلة", price: 30 },
      ],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 10 }],
    },
    {
      id: "offer3",
      name: "تأمين مميز - بلاتينيوم",
      company_id: "company2",
      type: "special",
      main_price: "500",
      company: {
        id: "company2",
        name: "شركة التأمين الثانية",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [
        { id: "feature1", content: "المساعدة على الطريق", price: 0 },
        { id: "feature2", content: "تغطية الزجاج", price: 0 },
        { id: "feature3", content: "تغطية سيارة بديلة", price: 0 },
        { id: "feature4", content: "تغطية الأضرار الطبيعية", price: 50 },
      ],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 15 }],
    },
    {
      id: "offer4",
      name: "تأمين ضد الغير - موسع",
      company_id: "company2",
      type: "against-others",
      main_price: "180",
      company: {
        id: "company2",
        name: "شركة التأمين الثانية",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [
        { id: "feature1", content: "المساعدة على الطريق", price: 25 },
        { id: "feature2", content: "تغطية الزجاج", price: 15 },
        { id: "feature5", content: "تغطية الحوادث الشخصية", price: 40 },
      ],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 10 }],
    },
    {
      id: "offer5",
      name: "تأمين شامل - اقتصادي",
      company_id: "company3",
      type: "comprehensive",
      main_price: "280",
      company: {
        id: "company3",
        name: "شركة التأمين الثالثة",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [{ id: "feature1", content: "المساعدة على الطريق", price: 25 }],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 5 }],
    },
    {
      id: "offer6",
      name: "تأمين مميز - جولد",
      company_id: "company3",
      type: "special",
      main_price: "450",
      company: {
        id: "company3",
        name: "شركة التأمين الثالثة",
        image_url: "/placeholder.svg?height=50&width=100",
      },
      extra_features: [
        { id: "feature1", content: "المساعدة على الطريق", price: 0 },
        { id: "feature2", content: "تغطية الزجاج", price: 0 },
        { id: "feature3", content: "تغطية سيارة بديلة", price: 30 },
      ],
      extra_expenses: [{ reason: "رسوم المعالجة", price: 12 }],
    },
  ]
  
  