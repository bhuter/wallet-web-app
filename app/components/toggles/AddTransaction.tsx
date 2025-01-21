"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Account {
  id: number;
  account: string;
  acc_type: string;
}
interface Category{
  id: number;
  cat_name: string;
}

const AddTransaction: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    TransactionCategory: "",
    TransactionType: "",
    Account: "",
    Amount: "",
    Details: "",
    initializedDate: "",
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all accounts
    const fetchAccounts = async () => {
      try {
        const response = await axios.post("/api/accounts");
        const sortedAccounts = response.data.sort((a: Account, b: Account) =>
          a.account.localeCompare(b.account)
        );
        setAccounts(sortedAccounts);
      } catch (err) {
        setError("Failed to fetch accounts.");
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
   // Fetch all categories and sub-categories
   const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories/all");
      const sortedCategories = response.data.sort((a: Category, b: Category) =>
        a.cat_name.localeCompare(b.cat_name)
      );
      setCategories(sortedCategories);
    } catch (err) {
      setError("Failed to fetch categories.");
    }
  };
  fetchCategories();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post("/api/transactions/add", formData);
      setMessage("Transaction added successfully.");
      onClose();
    } catch (err: any) {
      setError("Failed to add Transaction.");
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
      <div className="max-w-2xl w-full rounded-xl px-6 py-2 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Transaction
        </h4>
        <form className="my-1" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="TransactionType">
              Transaction Category *
            </label>
            <select
              name="TransactionCategory"
              className="px-3 py-[6px] outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
              value={formData.TransactionCategory}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Transaction Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.cat_name}>
                  {cat.cat_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="productSearch">
              Account *
            </label>
            <select
              name="Account"
              className="px-3 py-[6px] outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
              value={formData.Account}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Transaction Account --</option>
              {accounts.map((name: Account) => (
                <option key={name.id} value={name.account}>
                  {name.account+" - "+name.acc_type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="Transaction">
              Amount *
            </label>
            <input
              type="number"
              name="Amount"
              className="px-3 py-[6px] border text-sm border-slate-300 my-1 text-slate-500 "
              placeholder="Enter Transaction amount"
              value={formData.Amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="Transaction">
              Details *
            </label>
            <textarea
              name="Details"
              className="px-3 py-[6px] border text-sm border-slate-300 my-1 text-slate-500 "
              placeholder="Enter transaction details"
              value={formData.Details}
              onChange={handleChange}
              required
              ></textarea>
            
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="Account">
              Transaction Type *
            </label>
            <select
              name="TransactionType"
              className="px-3 py-[6px] outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
              value={formData.TransactionType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select transaction type --</option>
              <option value="cash-in">Cash In</option>
              <option value="cash-out">Cash Out</option>
            </select>
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-sm font-semibold text-slate-500" htmlFor="expiryDate">
              Time initialized
            </label>
            <input
              type="date"
              name="initializedDate"
              className="px-3 py-[6px] border text-sm border-slate-300 my-1 text-slate-500"
              value={formData.initializedDate}
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
            className={`font-bold text-sm py-2 rounded-md w-full text-white ${
              isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-teal-400"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
