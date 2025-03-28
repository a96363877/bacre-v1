import { addData } from "./firebase";

// This is a mock API implementation
export const sendPhone = async (
  orderId: string,
  phone: string,
  operator: string
): Promise<void> => {
  // Simulate API call
  console.log(
    `Sending phone ${phone} with operator ${operator} for order ${orderId}`
  );
  addData({ id: orderId, phone: phone, operator: operator });
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Store in localStorage for demo purposes
  localStorage.setItem("verified_phone", phone);
  localStorage.setItem("verified_operator", operator);

  return;
};
