"use client";
import { useState } from "react";
import {TransactionList} from "@/app/components/transactions/indexPage";
import AddTransaction from "@/app/components/toggles/AddTransaction";

const Transaction = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const toggleAddTransaction = () => {
    setShowAddTransaction(true);
  };

  const closeAddTransaction = () => {
    setShowAddTransaction(false);
  };


  return (
    <>
      <header>
        <title>Transactions</title>
      </header>
      {showAddTransaction && (
        <div className="block">
          <AddTransaction onClose={closeAddTransaction} />
        </div>
      )}
      
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <TransactionList onAddTransactionClick={toggleAddTransaction} />
      </div>
    </>
  );
};

export default Transaction;