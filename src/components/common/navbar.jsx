import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import { LuHouse } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { LuArrowLeftRight } from "react-icons/lu";
import { IoMdMoon } from "react-icons/io";
import { IoSunny } from "react-icons/io5";

const navItems = [
  { name: "Home", path: "/", icon: <LuHouse /> },
  { name: "Group", path: "/group", icon: <MdGroups /> },
];

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <nav className="fixed z-50 flex justify-between items-center bg-cyan-700 px-3 py-4.5 sm:px-4 md:px-5 sm:py-5 w-full">
        <div className="flex items-center gap-1.5 flex-1">
          <div className="bg-cyan-600 p-1.5 rounded-lg text-white sm:p-2 md:p-3 md:rounded-xl">
            <LuArrowLeftRight className="text-xl" />
          </div>
          <h1 className="font-syne font-semibold text-white md:text-lg lg:text-xl">
            Split Easy
          </h1>
        </div>
        <div className="flex items-center justify-end flex-1 gap-5 sm:gap-4">
          <div className="hidden sm:flex justify-center min-w-65 gap-3">
            {navItems.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                onClick={() => {
                  setOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-xl px-4 py-[9px] font-syne
                        text-base font-bold tracking-wide transition-colors duration-200 cursor-pointer
                        ${isActive ? "bg-cyan-600 text-white" : "text-white hover:bg-cyan-100 hover:text-cyan-700"}`
                }
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </NavLink>
            ))}
          </div>
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className={`cursor-pointer rounded-full p-1 sm:p-1.5 md:p-2 active:scale-90 transition
              ${isDark ? "bg-amber-100/90 border border-amber-300" : "bg-sky-400/50 border border-sky-200/40"}
              `}
          >
            {isDark ? (
              <IoSunny className="text-amber-500" size={18} />
            ) : (
              <IoMdMoon className="text-white" size={18} />
            )}
          </button>
          <div
            ref={menuRef}
            className="relative flex flex-col justify-center items-end sm:hidden"
          >
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 relative cursor-pointer mb-1"
            >
              <span
                className={`absolute left-0 top-2 w-6 xs:w-7 h-0.5 bg-white transition-all duration-200 rounded-full 
              ${open ? "rotate-133 top-4" : ""}`}
              ></span>
              <span
                className={`absolute left-0 top-4 w-6 xs:w-7 h-0.5 bg-white transition-all duration-200 rounded-full 
              ${open ? "-rotate-133 top-3" : ""}`}
              ></span>
              <span
                className={`absolute left-0 top-6 w-6 xs:w-7 h-0.5 bg-white transition-all duration-200 rounded-full
              ${open ? "opacity-0" : ""}`}
              ></span>
            </button>
            <div
              className={`
                absolute -right-3 top-full mt-[18.5px] sm:hidden border-l border-b border-cyan-400 flex flex-col justify-start items-center gap-2 max-h-55 w-58 rounded-bl-4xl
                bg-cyan-50 p-5 shadow-lg transform transition-all duration-300 ease-in-out
                ${open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}
              `}
            >
              <div className="flex flex-col justify-center items-center gap-2 overflow-y-auto scroll w-full">
                {navItems.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    onClick={() => {
                      setOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-center gap-3 rounded-xl px-5 py-[11px] mb-1 font-syne
                        text-base font-bold tracking-wide transition-colors duration-200 cursor-pointer
                        ${isActive ? "bg-cyan-600 text-white" : "text-cyan-900 hover:bg-cyan-100 hover:text-cyan-700"}`
                    }
                  >
                    <span className="text-xl">{tab.icon}</span>
                    {tab.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
