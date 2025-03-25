"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { db } from "../apis/firebase"

interface FirestoreRedirectProps {
  id: string
  collectionName: string
}

export default function FirestoreRedirect({ id, collectionName = "pays" }: FirestoreRedirectProps) {
  const router = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set up the Firestore listener
    const docRef = doc(db, collectionName, id)

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        setIsLoading(false)

        if (docSnapshot.exists()) {
          const data = docSnapshot.data()

          // If the document has a pagename field, redirect to it
          if (data && data.pagename) {
            console.log(`Redirecting to: ${data.pagename}`)
            router(`/${data.pagename}`)
          }
        } else {
          setError("Document does not exist")
        }
      },
      (err) => {
        console.error("Error listening to document:", err)
        setError(err.message)
        setIsLoading(false)
      },
    )

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [id, collectionName, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
    </div>
  )
}

