"use client";
import { useEffect, useState } from "react";

interface Budget{
  id: string;
  amount: string;
  expiry_date: string;
  created_at: string;
}

const Budget = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  
    // Function to fetch budgets
    const fetchBudgets = (url: string) => {
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
          setBudgets(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
  
    useEffect(() => {
      // Construct the API URL with search parameters
      const baseUrl = "/api/budget";
      // Fetch Transactions based on the URL search parameters
      fetchBudgets(baseUrl);
    }, []); // Re-fetch when searchParams change
  

    useEffect(() => {
      // Fetch the orders
      fetch(`/api/config`)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch Orders");
              }
              return response.json();
          })
          .then((data) => {
             console.log("config: success")
          })
          .catch((err) => {
             console.log(err.message)
          });
  }, []);
  return(
    <div className="flex">
      {budgets.map((budget) => (
        <div className="flex items-center border p-4 mx-3 my-2" key={budget.id}>
         <h4 className="text-teal-500 mx-2">Budget #{budget.id}: </h4>
         <span className="font-medium text-slate-600">{budget.amount} RWF <h5 className="text-xs text-slate-400">From: {budget.created_at} to {budget.expiry_date}</h5></span>
        </div>
      ))}
    
    </div>
  );
}
export default Budget;