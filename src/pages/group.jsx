// import { useState } from "react";
// import { LuPlus, LuChartNoAxesCombined } from "react-icons/lu";

// import { peopleList, expensesList } from "../data/mockData";
// import GroupForms from "../components/forms";
// import GroupOverview from "../components/groupOverview";

// const Group = () => {
//   const [activeTab, setActiveTab] = useState("add");
//   const [people, setPeople] = useState(peopleList);
//   const [expenses, setExpenses] = useState(expensesList);

//   return (
//     <div className="min-h-screen bg-sky-50 px-3 pb-6 pt-22 sm:px-5 md:px-4 sm:pt-24">
//       <div className="mx-auto max-w-7xl">
//         {/* Group Header */}
//         <div className="mb-3">
//           <p className="font-inter text-xs font-semibold uppercase tracking-wider text-cyan-700">
//             Your Group
//           </p>
//           <h1 className="font-syne text-2xl font-bold text-slate-900 sm:text-3xl">
//             Goa Trip 2026
//           </h1>
//           <p className="mt-1 font-inter text-sm text-slate-500">
//             Manage friends and shared expenses
//           </p>
//         </div>

//         {/* Mobile Toggle Buttons */}
//         <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-cyan-100 bg-white p-1.5 shadow-sm lg:hidden">
//           {/* Add Details Button */}
//           <button
//             type="button"
//             onClick={() => setActiveTab("add")}
//             className={`flex items-center justify-center gap-2 cursor-pointer p-3 md:p-4 rounded-lg font-inter text-sm font-semibold transition ${
//               activeTab === "add"
//                 ? "bg-cyan-600 text-white shadow-sm"
//                 : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-700"
//             }`}
//           >
//             <LuPlus size={17} />
//             Add Details
//           </button>

//           {/* Overview Button */}
//           <button
//             type="button"
//             onClick={() => setActiveTab("overview")}
//             className={`flex items-center justify-center gap-2 cursor-pointer p-3 md:p-4 rounded-lg font-inter text-sm font-semibold transition ${
//               activeTab === "overview"
//                 ? "bg-cyan-600 text-white shadow-sm"
//                 : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-700"
//             }`}
//           >
//             <LuChartNoAxesCombined size={17} />
//             Overview
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
//           {/* Left Side - Forms */}
//           <div
//             className={`${activeTab === "add" ? "block" : "hidden"} lg:block`}
//           >
//             <GroupForms
//               people={people}
//               setPeople={setPeople}
//               expenses={expenses}
//               setExpenses={setExpenses}
//             />
//           </div>

//           {/* Right Side - Overview */}
//           <div
//             className={`${
//               activeTab === "overview" ? "block" : "hidden"
//             } lg:block`}
//           >
//             <GroupOverview
//               people={people}
//               expenses={expenses}
//               setExpenses={setExpenses}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Group;

import { useEffect, useState } from "react";
import { LuPlus, LuChartNoAxesCombined } from "react-icons/lu";

import GroupForms from "../components/forms";
import GroupOverview from "../components/groupOverview";

import { getPeople } from "../api/peopleApi";
import { getExpenses } from "../api/expensesApi";

const Group = () => {
  const [activeTab, setActiveTab] = useState("add");

  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch People and Expenses
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        setError("");

        const [peopleData, expensesData] = await Promise.all([
          getPeople(),
          getExpenses(),
        ]);

        setPeople(
          Array.isArray(peopleData) ? peopleData : peopleData.people || [],
        );

        setExpenses(
          Array.isArray(expensesData)
            ? expensesData
            : expensesData.expenses || [],
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load group data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, []);

  

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

        {/* Loading and Error */}
        {loading ? (
          <div className="rounded-2xl border border-cyan-100 bg-white p-8 text-center">
            <p className="font-inter text-sm text-slate-500">
              Loading your group data...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-white p-6 text-center">
            <p className="font-inter text-sm text-rose-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-cyan-600 px-4 py-2 font-inter text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
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
                className={`${
                  activeTab === "add" ? "block" : "hidden"
                } lg:block`}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Group;
