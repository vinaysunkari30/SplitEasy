import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from "react-icons/fi";

const icons = {
  success: <FiCheck />,
  error: <FiX />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

const styles = {
  success: {
    title: "Success",
    border: "border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-500",
    titleColor: "text-emerald-700",
  },
  error: {
    title: "Error",
    border: "border-rose-200",
    icon: "bg-rose-100 text-rose-600",
    bar: "bg-rose-500",
    titleColor: "text-rose-700",
  },
  warning: {
    title: "Warning",
    border: "border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    bar: "bg-amber-500",
    titleColor: "text-amber-700",
  },
  info: {
    title: "Information",
    border: "border-blue-200",
    icon: "bg-blue-100 text-blue-600",
    bar: "bg-blue-500",
    titleColor: "text-blue-700",
  },
};

const Toast = ({ id, type = "info", message, onClose, duration = 4000 }) => {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingRef = useRef(duration);
  const closingRef = useRef(false);

  const style = styles[type] || styles.info;

  const closeToast = () => {
    if (closingRef.current) return;

    closingRef.current = true;
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const startTimer = () => {
    clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(closeToast, remainingRef.current);
  };

  const handleMouseEnter = () => {
    if (closingRef.current) return;

    clearTimeout(timerRef.current);
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startTimeRef.current)
    );
  };

  const handleMouseLeave = () => {
    if (closingRef.current) return;
    startTimer();
  };

  useEffect(() => {
    const enterTimer = setTimeout(() => setEntered(true), 20);
    startTimer();

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = () => closeToast();

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`toast-item relative flex w-[350px] max-w-[calc(100vw-32px)] items-center gap-2 sm:gap-3 overflow-hidden rounded-xl border ${style.border} bg-white p-3 sm:p-4 shadow-xl shadow-slate-900/10 ${
        exiting ? "toast-exit" : entered ? "toast-enter" : "opacity-0"
      }`}
    >
      <div
        className={`flex border h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl ${style.icon}`}
      >
        {icons[type] || icons.info}
      </div>

      <div className="">
        <h4 className={`font-roboto text-sm font-semibold ${style.titleColor}`}>
          {style.title}
        </h4>
        <p className="break-words text-sm font-medium font-roboto text-slate-600">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Close notification"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-90"
      >
        <FiX />
      </button>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-100">
        <div
          className={`toast-progress h-full ${style.bar}`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => (
  <div className="pointer-events-none fixed left-1/2 top-4 z-[9999] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-4 sm:left-auto sm:right-6 sm:top-6 sm:w-auto sm:translate-x-0 sm:items-end sm:px-0">
    {toasts.map((toast) => (
      <div key={toast.id} className="pointer-events-auto">
        <Toast {...toast} onClose={onClose} />
      </div>
    ))}
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 4000) => {
    setToasts((prev) => [...prev, { id: uuid(), type, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;
