import { useState } from "react";
import { LuPlus, LuChartNoAxesCombined } from "react-icons/lu";

import { peopleList, expensesList } from "../data/mockData";
import GroupForms from "../components/forms";
import GroupOverview from "../components/groupOverview";

const Group = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [people, setPeople] = useState(peopleList);
  const [expenses, setExpenses] = useState(expensesList);

  return (
    <div className="min-h-screen bg-sky-50 px-3 pb-6 pt-22 sm:px-5 md:px-4 sm:pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Group Header */}
        <div className="mb-3">
          <p className="font-inter text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Your Group
          </p>
          <h1 className="font-syne text-2xl font-bold text-slate-900 sm:text-3xl">
            Goa Trip 2026
          </h1>
          <p className="mt-1 font-inter text-sm text-slate-500">
            Manage friends and shared expenses
          </p>
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-cyan-100 bg-white p-1.5 shadow-sm lg:hidden">
          {/* Add Details Button */}
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`flex items-center justify-center gap-2 cursor-pointer p-3 md:p-4 rounded-lg font-inter text-sm font-semibold transition ${
              activeTab === "add"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-700"
            }`}
          >
            <LuPlus size={17} />
            Add Details
          </button>

          {/* Overview Button */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center justify-center gap-2 cursor-pointer p-3 md:p-4 rounded-lg font-inter text-sm font-semibold transition ${
              activeTab === "overview"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-700"
            }`}
          >
            <LuChartNoAxesCombined size={17} />
            Overview
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Left Side - Forms */}
          <div
            className={`${activeTab === "add" ? "block" : "hidden"} lg:block`}
          >
            <GroupForms
              people={people}
              setPeople={setPeople}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          </div>

          {/* Right Side - Overview */}
          <div
            className={`${
              activeTab === "overview" ? "block" : "hidden"
            } lg:block`}
          >
            <GroupOverview
              people={people}
              expenses={expenses}
              setExpenses={setExpenses}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
