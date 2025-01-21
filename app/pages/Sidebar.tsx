
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Profile from "../components/app/Profile";

interface NavBarProps {
  menuCollapsed: boolean;
  toggleMenu: () => void;
  onNavigate: (page: string) => void; // Add onNavigate prop to trigger page change
}

const NavBar = ({ menuCollapsed, toggleMenu, onNavigate }: NavBarProps) => {
  const [currentPath, setCurrentPath] = useState(""); // Use state to track current path
  const pathname = usePathname();


  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname); // Get current pathname from window object
    }
  }, []);
  //menu tabs objects
  const menu = [
    { name: "Dashboard", url: "/", icon: "bi bi-circle" },
    { name: "Transactions", url: "/w-page/transactions", icon: "bi bi-cash-coin" },
    { name: "Accounts", url: "/w-page/accounts", icon: "bi bi-people" },
    { name: "Expense Categories", url: "/w-page/expense-categories", icon: "bi bi-file-earmark-bar-graph" },
    { name: "Reports", url: "/w-page/reports", icon: "bi bi-box-seam" },
  ];
 
  return (
    <>
       <Profile menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className="navbar-container max-h-[75vh] overflow-hidden mx-2 mt-3">
        <div className="py-1 flex flex-col">
          {menu.map((tab, index) => (
            <Link
              key={index}
              href={tab.url}
              onClick={() => onNavigate(tab.name)} // Update the page name on navigation
              className={`flex items-center py-2 px-3 text-gray-500 text-sm rounded-md hover:bg-slate-100 hover:text-gray-900 transition-all duration-300 ${
                pathname === tab.url ? 'bg-slate-200 text-gray-900' : ''
              }`}
            >
              <i className={`${tab.icon} mr-2 text-xl transition-all duration-300 hover:text-sky-500`}></i>
              <span className={`${menuCollapsed ? 'hidden' : 'block'} transition-all duration-300 sm:block md:block lg:block`}>
                {tab.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
