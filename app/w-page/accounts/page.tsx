"use client";
import { useState } from "react";
import { AccountList } from "@/app/components/accounts/indexPage";
import AddAccount from "@/app/components/toggles/AddAccount";

const Account = () => {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [setupAccountId, setSetupAccountId] = useState<number | null>(null);

  const toggleAddAccount = () => {
    setShowAddAccount(true);
  };

  const closeAddAccount = () => {
    setShowAddAccount(false);
  };

  const handleSetupAccountClick = (AccountId: number) => {
    setSetupAccountId(AccountId); // Set the ID for the setup form
  };

  return (
    <>
      <header>
        <title>Accounts</title>
      </header>
      
      {showAddAccount && (
        <div className="block">
          <AddAccount onClose={closeAddAccount} />
        </div>
      )}
      
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <AccountList onAddAccountClick={toggleAddAccount}/>
      </div>
    </>
  );
};

export default Account;