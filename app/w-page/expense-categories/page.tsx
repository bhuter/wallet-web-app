"use client";
import { useState } from "react";
import Header, { CategoryList } from "@/app/components/categories/indexPage";
import AddCategory from "@/app/components/toggles/AddCategory";
import AddSubCategory from "@/app/components/toggles/AddSubCategory";

const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [setupCategoryId, setSetupCategoryId] = useState<number | null>(null);

  const toggleAddCategory = () => {
    setShowAddCategory(true);
  };

  const closeAddCategory = () => {
    setShowAddCategory(false);
  };

  const handleSetupCategoryClick = (CategoryId: number) => {
    setSetupCategoryId(CategoryId); // Set the ID for the setup form
  };
  const closeSetupCategory = () => {
    setSetupCategoryId(null); // Close the setup product form
  };
  return (
    <>
      <header>
        <title>Expense Categories</title>
      </header>
      <div>
        <Header onAddCategoryClick={toggleAddCategory} />
      </div>
      {showAddCategory && (
        <div className="block">
          <AddCategory onClose={closeAddCategory} />
        </div>
      )}
      {setupCategoryId && (
        <div className="block">
        <AddSubCategory CategoryId={setupCategoryId} onClose={closeSetupCategory} />
      </div>
      )}
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <CategoryList onSetupCategoryClick={handleSetupCategoryClick} />
      </div>
    </>
  );
};

export default Category;