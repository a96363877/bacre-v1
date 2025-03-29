"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../apis/firebase";

interface FirestoreRedirectProps {
  id: string;
  collectionName: string;
}

export default function FirestoreRedirect({
  id,
  collectionName,
}: FirestoreRedirectProps) {
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Reference to the document in the specified collection
    const docRef = doc(db, collectionName, id);

    // Set up real-time listener for document changes
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // Check if the document has a redirect path
          if (data.redirectTo) {
            setRedirectPath(data.redirectTo);
          }
        }
      },
      (error) => {
        console.error("Error listening to Firestore document:", error);
      }
    );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [id, collectionName]);

  // Perform the redirect if a path is set
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  // This component doesn't render anything visible
  return null;
}
