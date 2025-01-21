"use client"
import { useState } from "react";
import Header, { SalesDash } from "../components/app/Index";
import { TransactionList } from "../components/transactions/indexPage";
import AddBudget from "../components/toggles/AddBudget";

const App = () => {
    const [setupTransactionId, setSetupTransactionId] = useState<number | null>(null);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    const toggleAddTransaction = () => {
      setShowAddTransaction(true);
    };
  
    const closeAddTransaction = () => {
      setShowAddTransaction(false);
    };
    const toggleAddBudget = () => {
      setShowAddBudget(true);
    };
    const closeAddBudget= () => {
      setShowAddBudget(false);
    };
  
    const handleSetupTransactionClick = (TransactionId: number) => {
  setSetupTransactionId(TransactionId); // Set the ID for the setup form
};
  return (
    <div>
      <Header onAddTransactionClick={toggleAddBudget}/>
      {showAddBudget && (
        <div className="block">
          <AddBudget onClose={closeAddBudget}/>
        </div>
      )}
      <div className="">
         <SalesDash />
         <TransactionList onAddTransactionClick={toggleAddTransaction}/>
      </div>
    </div>
  )
}
export default App;