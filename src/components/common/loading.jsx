const LoadingButton = ({
  type = "button",
  loading = false,
  loadingText = "Loading...",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`flex cursor-pointer items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span
            className={`h-4 w-4 animate-spin rounded-full border-2 ${type === "button" ? "border-cyan-600" : "border-white/30"} border-t-white`}
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
