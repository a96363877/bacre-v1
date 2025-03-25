import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="B-Care Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
