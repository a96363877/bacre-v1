export interface InsuranceDetailsErrors {
  insurance_type?: string;
  start_date?: string;
  vehicle_use_purpose?: string;
  estimated_worth?: string;
  year?: string;
  repair_place?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateInsuranceDetails = (formData: any): InsuranceDetailsErrors => {
  const errors: InsuranceDetailsErrors = {};

  if (!formData.insurance_type) {
    errors.insurance_type = 'يرجى اختيار نوع التأمين';
  }

  if (!formData.start_date) {
    errors.start_date = 'يرجى تحديد تاريخ بدء الوثيقة';
  }

  if (!formData.vehicle_use_purpose) {
    errors.vehicle_use_purpose = 'يرجى اختيار الغرض من استخدام المركبة';
  }

  if (!formData.estimated_worth) {
    errors.estimated_worth = 'يرجى إدخال القيمة التقديرية للمركبة';
  }

  if (!formData.year) {
    errors.year = 'يرجى اختيار سنة الصنع';
  }

  if (!formData.repair_place) {
    errors.repair_place = 'يرجى اختيار مكان الإصلاح';
  }

  return errors;
};
