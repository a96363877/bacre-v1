import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center">
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
