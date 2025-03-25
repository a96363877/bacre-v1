import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return <>{children}</>;
};
