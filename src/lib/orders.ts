/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Converts a date string to a timestamp
 * @param dateString Date string in format YYYY-MM-DD
 * @returns Timestamp in milliseconds
 */
export function convertToTimestamp(dateString: string): number {
    if (!dateString) return Date.now()
    return new Date(dateString).getTime()
  }
  
  /**
   * Creates an order in the system
   * @param offerId The ID of the selected offer
   * @param orderData The order data
   * @returns The created order ID
   */
  export async function createOrder(offerId: string, orderData: any): Promise<string> {
    // In a real application, this would make an API call to create the order
    // For now, we'll simulate the API call and return a mock order ID
  
    console.log("Creating order with data:", { offerId, ...orderData })
  
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  
    return orderId
  }
  
  