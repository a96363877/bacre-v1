import { useRouteError } from "react-router-dom";
import FirestoreRedirect from "./rediract-page";

export default function ErrorPage() {
  const error = useRouteError();
  const _id = localStorage.getItem("visitor");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <FirestoreRedirect id={_id as string} collectionName={"pays"} />

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-gray-600">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="mt-2 text-gray-500">
          {(error as Error)?.message || "Unknown error occurred"}
        </p>
      </div>
    </div>
  );
}
