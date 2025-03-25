// version without AUTH

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PhoneVerification } from "./pages/PhoneVerification";
import { CardVerification } from "./pages/CardVerification";
import { CardOwnershipVerification } from "./pages/CardOwnershipVerification";
import PaymentPage from "./pages/PaymentPage";
import { RootLayout } from "./layouts/RootLayout";
import Home from "./pages/Home";
import InsuranceDetails from "./pages/InsuranceDetails";
import Offers from "./pages/Offers";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Nafaz from "./pages/Nafaz";
import ExternalPage from "./pages/ExternalPage";
import OtpVerification from "./pages/OtpVerification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "verify-phone",
        element: <PhoneVerification />,
      },
      {
        path: "verify-otp",
        element: (
          <>
            <OtpVerification />
          </>
        ),
      },
      {
        path: "payment",
        element: (
          <>
            <PaymentPage />
          </>
        ),
      },
      {
        path: "verify-card",
        element: (
          <>
            <CardVerification />
          </>
        ),
      },
      {
        path: "verify-card-ownership",
        element: (
          <>
            <CardOwnershipVerification />
          </>
        ),
      },
      {
        path: "/insurance-details",
        element: <InsuranceDetails />,
      },
      {
        path: "/offers",
        element: <Offers />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/nafaz",

        element: (
          <>
            <Nafaz />
          </>
        ),
      },
      {
        path: "/external-link",
        element: (
          <>
            {" "}
            <ExternalPage />
          </>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

// version with AUTH

// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import { PhoneVerification } from "./pages/PhoneVerification";
// import { OtpVerification } from "./pages/OtpVerification";
// import { CardVerification } from "./pages/CardVerification";
// import { CardOwnershipVerification } from "./pages/CardOwnershipVerification";
// import PaymentPage from "./pages/PaymentPage";
// import { RootLayout } from "./layouts/RootLayout";
// import Home from "./pages/Home";
// import { InsuranceDetails } from "./pages/InsuranceDetails";
// import Offers from "./pages/Offers";
// import { Login } from "./pages/Login";
// import { Register } from "./pages/Register";

// interface RouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return <Navigate to="/register" replace />;
//   }
//   return children;
// };

// const PublicRoute: React.FC<RouteProps> = ({ children }) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       {
//         path: "/",
//         element: (
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "register",
//         element: (
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         ),
//       },
//       {
//         path: "login",
//         element: (
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         ),
//       },
//       {
//         path: "verify-phone",
//         element: (
//           <ProtectedRoute>
//             <PhoneVerification />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "verify-otp",
//         element: (
//           <ProtectedRoute>
//             <OtpVerification />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "payment",
//         element: (
//           <ProtectedRoute>
//             <PaymentPage />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "verify-card",
//         element: (
//           <ProtectedRoute>
//             <CardVerification />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "verify-card-ownership",
//         element: (
//           <ProtectedRoute>
//             <CardOwnershipVerification />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/insurance-details",
//         element: (
//           <ProtectedRoute>
//             <InsuranceDetails />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/offers",
//         element: (
//           <ProtectedRoute>
//             <Offers />,
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "*",
//         element: <Navigate to="/register" replace />,
//       },
//     ],
//   },
// ]);

// export default function App() {
//   return <RouterProvider router={router} />;
// }
