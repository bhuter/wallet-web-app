"use client";
import Link from "next/link";
import { useState } from "react";

interface ProfileProps {
  menuCollapsed: boolean;
  toggleMenu: () => void;
}

const Profile = ({ menuCollapsed, toggleMenu }: ProfileProps) => {

  return (
    <>
      <div className={`flex items-center justify-between py-1 mb-2 mx-5 ${menuCollapsed ? 'flex-col' : ''}`}>
        <div className="flex items-center">
          <i className="bi bi-credit-card text-teal-400 text-3xl"></i>
          <h4 className={`text-teal-400 text-xl ml-3 ${menuCollapsed ? 'hidden' : ''}`}>
            WALLET
          </h4>
        </div>
        <i className={`bi ${menuCollapsed ? 'bi-grid':'bi-x'} text-xl cursor-pointer text-gray-500 hover:text-gray-700`} onClick={toggleMenu}></i>
      </div>
    </>
  );
};

export default Profile;
