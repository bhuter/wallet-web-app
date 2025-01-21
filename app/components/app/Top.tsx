"use client";
import { useEffect, useState } from "react";
import Notify from "./notifications";

interface TopBarProps {
  page: String
}

const TopBar = ({page}: TopBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifies, setNotifies] = useState([]);
    useEffect(() => {
      // Fetch the orders
      fetch(`/api/notification`)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch Orders");
              }
              return response.json();
          })
          .then((data) => {
             setNotifies(data);
          })
          .catch((err) => {
             console.log(err.message)
          });
  }, []);
  return (
     <div className="w-full flex justify-between items-center">
       <h1 className="text-xl text-slate-600">{page}</h1>
       <div className="flex">
          <div className="flex min-w-[50vh] py-2 px-4 bg-slate-50 border rounded-md">
              <i className="bi bi-search text-slate-500 text-md mr-2"></i>
              <input 
              type="search" 
              name="" 
              id="" 
              placeholder="Search..."
              className=" border w-full text-slate-600 outline-none bg-transparent border-none"
              />
          </div>
          <div className="flex mx-7 py-2 border rounded-full w-10 h-10 items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
              <i className="bi bi-bell text-xl text-slate-500"></i>
              {notifies.length > 0 && (
                <span className="bg-red-500 text-xs p-[2px] w-4 h-4 flex items-center justify-center rounded-full absolute ml-3 mt-[-12px]">{notifies.length}</span>
              )}
              
          </div>
          {isOpen && (
              <div className="absolute right-3 mt-12 bg-white shadow-2xl rounded-lg overflow-hidden z-50 p-3 border">
                <Notify />
              </div>
          )}
          <div className="flex mr-3 py-2 border rounded-full w-10 h-10 items-center justify-center">
              <i className="bi bi-person text-xl text-slate-500"></i>
          </div>
       </div>
     </div>
     
  );
}
export default TopBar;