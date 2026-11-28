const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules = {},
  error,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-0.5 block text-sm sm:text-base font-medium font-roboto text-slate-700"
      >
        {label}{" "}
        {label === "Category" && (
          <span className="text-xs sm:text-sm font-roboto">(Trip, Party, or Room Rent or other)</span>
        )}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full rounded-lg font-roboto border p-3 text-sm outline-none transition-colors
          ${
            error
              ? "border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-50"
          }`}
      />

      {error && <p className="mt-1 text-xs sm:text-sm font-roboto text-rose-500">{error.message}</p>}
    </div>
  );
};

export default TextInput;
