"use client";
import React, { useState, useEffect } from "react";

interface Category {
    cat_id: number;
    cat_name: string;
    sub_categories: number;
    created_at: string;

  }


  interface HeaderProps {
    onAddCategoryClick: () => void;
  }
  interface  CategoryListProprs{
    onSetupCategoryClick: (CategoryId: number) => void;
  }
  const Header = ({ onAddCategoryClick}: HeaderProps) => {
    return (
        <>
        <div className="flex justify-between py-2 items-center flex-wrap">
            <div></div>
            <div className="flex justify-between items-center">
                <form method="get" className="flex py-1 px-4 text-sm text-slate-500 border rounded-md bg-white mx-3">
                    <input type="search" name="search" placeholder="Search Category " className="outline-none" />
                    <button type="submit" className="bi bi-search text-base mr-1"></button>
                </form>
                
                {/* Button to show AddCategory form */}
                <button
                    onClick={onAddCategoryClick}
                    className="bg-black rounded-md py-[6px] px-4 text-white text-sm"
                >
                    <i className="bi bi-plus-circle mr-1"></i>
                    <span>Add Category</span>
                </button>
            </div>
        </div>
        </>
    );
};
const CategoryList = ({ onSetupCategoryClick } : CategoryListProprs) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  // Function to fetch Categorys
  const fetchCategories = (url: string) => {
    setLoading(true);
    setError(null);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Categorys");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
 
    const apiUrl = "/api/categories";

    // Fetch Categorys based on the URL search parameters
    fetchCategories(apiUrl);
  }, []); 
  
  useEffect(() => {
    // Fetch the orders
    fetch(`/api/categories/sub`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch Orders");
            }
            return response.json();
        })
        .then((data) => {
            setSubCategories(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
}, []);

  const toggleDropdown = (CategoryId: number) => {
      setDropdownOpen(dropdownOpen === CategoryId ? null : CategoryId);
  };





const handleDelete = async (CategoryId: number) => {
    const response = await fetch(`/api/categories/delete/${CategoryId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to delete Category: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to delete Category");
        return;
    }

    // Update the Categorys list to remove the deleted Category
    setCategories((prevCategorys) => 
        prevCategorys.filter(Category => Category.cat_id !== CategoryId)
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading Categorys...</div>;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6"> {error}</div>;
  }
  let id = 0;
  return (
      <>
          <h4 className="text-lg font-semibold text-slate-700 border-b p-4">Categorys List ({categories.length})</h4>
          <div className="overflow-x-auto overflow-y-visible">
          {categories.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/delete.png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No Category found.</i>
                   </div>
                </div>
            ) : (
                <>
              <table className="min-w-full table-auto bg-white">
                  <thead className="border-b px-4">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-3 px-6 text-left">Id</th>
                          <th className="py-3 px-6 text-left">Category </th>
                          <th className="py-3 px-6 text-left">Sub Categories</th>
                          <th className="py-3 px-6 text-left">Created_at</th>
                          <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                  {categories.map((Category, index) => (
  <tr
    key={Category.cat_id || `category-${index}`}
    className="border-b border-gray-200 hover:bg-gray-50"
  >
    <td className="py-2 px-6 text-left flex items-center space-x-2">
      <span>{index + 1}</span>
    </td>
    <td className="py-2 px-6">{Category.cat_name}</td>
    <td className="py-2 px-6">
      {subCategories
        .filter((sub) => sub.cat_id === Category.cat_id)
        .map((sub, subIndex) => (
          <ol key={`subcategory-${sub.cat_id}-${subIndex}`} type="i">
            <li className="font-normal text-xs p-1">{sub.cat_name}</li>
          </ol>
        ))}
    </td>
    <td className="py-2 px-6">{Category.created_at}</td>
    <td className="py-2 px-6 text-center relative">
      <i
        className="bi bi-three-dots cursor-pointer text-xl"
        onClick={() => toggleDropdown(Category.cat_id)}
      ></i>
      {dropdownOpen === Category.cat_id && (
        <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
          <ul className="py-1 text-gray-700">
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => {
                onSetupCategoryClick(Category.cat_id); // Assign the Order
                toggleDropdown(Category.cat_id); // Close the dropdown
              }}
            >
              <i className="bi bi-check-circle mr-2 text-green-500 hover:bg-slate-100"></i> Add Sub Category
            </li>
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => {
                handleDelete(Category.cat_id); // Delete the Category
                toggleDropdown(Category.cat_id); // Close the dropdown
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

export default Header;
export {CategoryList};