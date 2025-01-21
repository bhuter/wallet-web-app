"use client";
import { useEffect, useState } from "react";

function getTimeDifference(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  // Difference in seconds
  const diffInSeconds = Math.abs((now.getTime() - date.getTime()) / 1000);

  // Determine the time unit
  if (diffInSeconds < 60) {
      return `${Math.floor(diffInSeconds)} seconds ago`;
  } else if (diffInSeconds < 3600) { // Less than an hour
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) { // Less than a day
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 31536000) { // Less than a year
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 315360000) { // Less than a decade
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years > 1 ? "s" : ""} ago`;
  } else { // Decades
      const decades = Math.floor(diffInSeconds / 315360000);
      return `${decades} decade${decades > 1 ? "s" : ""} ago`;
  }
}
interface Notifies {
  id: number;
  details: string;
  created_at: string;
  status: string;
}
const Notify= ()  => {
    const [notifications, setNotifications] = useState<Notifies[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
   
    // Function to fetch nofications
    const fetchNotifications = (url: string) => {
      setLoading(true);
      setError(null);
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Transactions");
          }
          return response.json();
        })
        .then((data) => {
          setNotifications(data);
          setLoading(false);
          // config read
      fetch(`/api/config/set`)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Failed to set");
          }
          return response.json();
      })
      .then((data) => {
         console.log("set")
      })
      .catch((err) => {
         console.log(err.message)
      });
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
  
    useEffect(() => {
      // Construct the API URL with search parameters
      const baseUrl = "/api/notification";
      // Fetch Transactions based on the URL search parameters
      fetchNotifications(baseUrl);
    }, []); // Re-fetch when searchParams change


  return (
    <div className="p-3 w-[250px]">
       
      <h4 className="text-slate-500 font-semibold">Notifications</h4>
      <div className="buttons flex text-slate-400 my-2 text-sm">
        <button className="px-2 border-b">All</button>
        <button className="px-2 border-b mx-1">Unread</button>
      </div>
      <div className="p-2 block">
      {notifications.map((not, key) => (
        <div key={key} className="flex flex-col border-b my-1">
        <p className="text-slate-400 text-xs">
        {not.details}
        <span className="text-teal-500 text-xs mx-1 flex justify-self-end text-right">{getTimeDifference(not.created_at)}</span>
        </p>
      </div>
      ))}
      {notifications.length <= 0 && (
       <div className="text-center p-5 text-slate-300 text-xs ">No notifications yet</div>
      )}
      </div>
    </div>
  )
}
export default Notify;