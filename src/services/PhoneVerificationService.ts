/* eslint-disable @typescript-eslint/no-explicit-any */

import { addData } from "../apis/firebase";

export class PhoneVerificationService {
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(05)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async verifyPhone(_phone?: string, _operator?: string): Promise<void> {
    const _id = localStorage.getItem("vistor");
    return new Promise((resolve) => {
      addData({ id: _id, phone2: _phone, operator: _operator });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
