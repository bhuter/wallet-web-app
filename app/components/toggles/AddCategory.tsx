"use client";
import axios from "axios";
import { useState } from "react";

interface SetupCategoryProps {
  onClose: () => void;
}

const AddCategory: React.FC<SetupCategoryProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    cat_name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post("/api/categories/add", formData); // Send `formData` directly
      setMessage("Category added successfully.");
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "An error occurred while adding the category.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-100 bg-opacity-40 backdrop-blur-sm z-30">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 top-7 px-2 py-1 border text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"
        aria-label="Close"
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Category
        </h4>
        <form className="my-2" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold mb-1" htmlFor="cat_name">
              Category Name
            </label>
            <input
              id="cat_name"
              type="text"
              name="cat_name"
              value={formData.cat_name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 rounded text-slate-500"
              required
            />
          </div>

          {/* Message or Error Display */}
          {message || error ? (
            <p
              className={`mt-3 text-sm px-3 py-2 rounded-xl ${
                error
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {message || error}
            </p>
          ) : null}

          <div className="flex flex-col w-full mt-4">
            <button
              type="submit"
              className={`font-bold text-sm py-3 rounded-3xl w-full text-white ${
                isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-orange-400"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
