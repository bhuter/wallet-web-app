"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Account {
  id: number;
  account: string;
}
interface Category{
  id: number;
  name: string;
}

const AddAccount: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    holder_name: "",
    accountNumber: "",
    accountType: "",
    currency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post("/api/accounts/add", formData);
      setMessage("Account added successfully.");
      onClose();
    } catch (err: any) {
      setError("Failed to add account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Account
        </h4>
        <form className="my-2" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold text-slate-500" htmlFor="AccountType">
              Holder name *
            </label>
            <input
              type="text"
              name="holder_name"
              className="px-4 py-2 border text-sm border-slate-300 my-1 text-slate-500 "
              placeholder="Enter holder name"
              value={formData.holder_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold text-slate-500" htmlFor="productSearch">
              Account *
            </label>
            <input
              type="text"
              name="accountNumber"
              className="px-4 py-2 border text-sm border-slate-300 my-1 text-slate-500 "
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold text-slate-500" htmlFor="Account">
              Account Type *
            </label>
            <select
              name="accountType"
              className="px-4 py-2 outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select account type --</option>
              <option value="bank">Bank Account</option>
              <option value="momo">Mobile Money</option>
              <option value="other">Other</option>
            </select>
          </div>
         
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold text-slate-500" htmlFor="expiryDate">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              className="px-4 py-2 border text-sm border-slate-300 my-1 text-slate-500"
              placeholder="eg. RWF, USD, KSH"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </div>
          {message || error ? (
            <p
              className={`${
                error ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
              } text-sm my-2 px-3 py-2 rounded-md`}
            >
              {message || error}
            </p>
          ) : null}
          <button
            type="submit"
            className={`font-bold text-sm py-3 rounded-md w-full text-white ${
              isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-teal-400"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAccount;
