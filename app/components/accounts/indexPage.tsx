"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Account {
    acc_id: number;
    acc_type: string;
    holder_name: string;
    account: string;
    email: string;
    created_at: string; 
    currency: string;
    status: string;
  }


  interface HeaderProps {
    onAddAccountClick: () => void;
  }
 
const AccountList = ({ onAddAccountClick}: HeaderProps)=> {
  const [Accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
// Form state
    const [formData, setFormData] = useState({
      date_from: "",
      date_to: "",
      sort: "",
      search: "",
    });
  
    useEffect(() => {
      fetchAccounts();
    }, []);
  
    const fetchAccounts = (data?: Record<string, any>) => {
        setLoading(true);
        setError(null);
    
        fetch("/api/accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data || {}),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch Accounts");
            }
            return response.json();
          })
          .then((Accounts) => {
            setAccounts(Accounts);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      };
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
    
        setFormData(updatedFormData);
    
        // Trigger fetch on input change
        fetchAccounts(updatedFormData);
      };
  const toggleDropdown = (AccountId: number) => {
    setDropdownOpen(dropdownOpen === AccountId ? null : AccountId);
  };

const handleDelete = async (AccountId: number) => {
    const response = await fetch(`/api/accounts/delete/${AccountId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to delete Account: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to delete Account");
        return;
    }

    // Update the Accounts list to remove the deleted Account
    setAccounts((prevAccounts) => 
        prevAccounts.filter(Account => Account.acc_id !== AccountId)
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading Accounts...</div>;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6"> {error}</div>;
  }
  let id = 0;
  return (
      <>
        <form
        className="flex justify-between py-2 items-center flex-wrap"
      >
        <div className="flex bg-slate-100 py-1 px-2 justify-around">
          <div className="text-slate-600 text-sm flex items-center px-4">
            <h4>From: </h4>
            <input
              type="date"
              name="date_from"
              id="date-from"
              className="py-1 px-2 rounded-md text-xs ml-3 outline-none border"
              value={formData.date_from}
              onChange={handleInputChange}
            />
          </div>
          <div className="text-slate-600 text-sm flex items-center px-4">
            <h4>To: </h4>
            <input
              type="date"
              name="date_to"
              id="date-to"
              className="py-1 px-2 rounded-md text-xs ml-3 outline-none border"
              value={formData.date_to}
              onChange={handleInputChange}
            />
          </div>
          <select
            className="outline-none text-sm text-slate-500 border rounded-md bg-white"
            name="sort"
            value={formData.sort}
            onChange={handleInputChange}
          >
            <option value="">Sort by</option>
            <option value="cash-in">Cash In</option>
            <option value="cash-out">Cash Out</option>
            <option value="bank">Bank</option>
            <option value="momo">Mobile Money</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex py-1 px-4 text-sm text-slate-500 border rounded-md bg-white mx-3">
            <input
              type="search"
              name="search"
              placeholder="Search Transaction"
              className="outline-none"
              value={formData.search}
              onChange={handleInputChange}
            />
            <button type="submit" className="bi bi-search text-base mr-1"></button>
          </div>
          <div
            onClick={onAddAccountClick}
            className="bg-black rounded-md py-[6px] px-4 text-white text-sm text-center cursor-pointer"
          >
            <i className="bi bi-plus-circle mr-1"></i>
            <span>Add Transaction</span>
          </div>
        </div>
      </form>

          <h4 className="text-lg font-semibold text-slate-700 border-b p-4">Accounts List ({Accounts.length})</h4>
          <div className="overflow-x-auto overflow-y-visible">
          {Accounts.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/delete.png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No Account found.</i>
                   </div>
                </div>
            ) : (
                <>
              <table className="min-w-full table-auto bg-white">
                  <thead className="border-b px-4">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-3 px-6 text-left">Id</th>
                          <th className="py-3 px-6 text-left">Type</th>
                          <th className="py-3 px-6 text-left">Account</th>
                          <th className="py-3 px-6 text-left">Currency </th>
                          <th className="py-3 px-6 text-left">Holder name</th>
                          <th className="py-3 px-6 text-left">Created_at</th>
                          <th className="py-3 px-6 text-left">Status</th>
                          <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {Accounts.map((Account) => (
                         
                          <tr
                              key={Account.acc_id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                          >
                              <td className="py-2 px-6 text-left flex items-center space-x-2">
                                  <span>{id +=1 }</span>
                              </td>
                              <td className="py-2 px-6">{Account.acc_type}</td>
                              <td className="py-2 px-6">{Account.account}</td>
                              <td className="py-2 px-6 capitalize">{Account.currency}</td>
                              <td className="py-2 px-6">{Account.holder_name}</td>
                              <td className="py-2 px-6">{Account.created_at}</td>
                              <td className="py-2 px-6">
                                  <span
                                      className={`py-1 px-3 rounded-full text-xs capitalize ${
                                          Account.status == "Active"
                                              ? "bg-green-100 text-green-600"
                                              : "bg-red-100 text-red-600"
                                      }`}
                                  >
                                      {Account.status}
                                  </span>
                              </td>
                              <td className="py-2 px-6 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(Account.acc_id)}
                                  ></i>
                                  {dropdownOpen === Account.acc_id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              
                                              
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleDelete(Account.acc_id); // Delete the Account
                                                      toggleDropdown(Account.acc_id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-trash mr-2 text-red-500 hover:bg-slate-100"></i> Delete
                                              </li>
                                          </ul>
                                      </div>
                                  )}
                              </td>
                          </tr>
                          
                      ))}
                  </tbody>
              </table>

              </>
            )}
          </div>
      </>
  );
};

export {AccountList};