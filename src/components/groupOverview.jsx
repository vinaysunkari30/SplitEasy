import { useState } from "react";
import {
  LuWallet,
  LuUsers,
  LuReceipt,
  LuTrash2,
  LuPencil,
  LuSave,
  LuX,
  LuPlus,
} from "react-icons/lu";

import LoadingButton from "./common/loading";
import TextInput from "./common/textInput";
import { useForm } from "react-hook-form";
import { ToastContainer, useToast } from "./common/toast";

import {
  deleteExpense as deleteExpenseApi,
  updateExpense as updateExpenseApi,
} from "../api/expensesApi";

const GroupOverview = ({
  people,
  expenses,
  setExpenses,
  activeTab,
  setActiveTab,
}) => {
  const { toasts, addToast, removeToast } = useToast();
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [loading, setLoading] = useState({
    update: false,
    deleteExpenseId: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getPayerId = (expense) => {
    return expense.paidBy?._id || expense.paidBy;
  };

  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  const equalShare = people.length ? totalAmount / people.length : 0;

  const getPaidAmount = (personId) => {
    return expenses
      .filter((expense) => String(getPayerId(expense)) === String(personId))
      .reduce((total, expense) => total + Number(expense.amount), 0);
  };

  const peopleBalances = people.map((person) => {
    const paid = getPaidAmount(person._id);
    const balance = paid - equalShare;

    return {
      ...person,
      paid,
      balance,
      newBalance: Math.abs(balance),
      status: balance > 0 ? "Owed" : balance < 0 ? "Owes" : "Settled",
    };
  });

  const handleDeleteExpense = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, deleteExpenseId: id }));

      await deleteExpenseApi(id);

      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      addToast("Expense deleted from the list", "success");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to delete expense",
        "error",
      );
    } finally {
      setLoading((prev) => ({ ...prev, deleteExpenseId: null }));
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense._id);

    reset({
      description: expense.description,
      amount: Number(expense.amount),
      paidBy: String(getPayerId(expense)),
    });
  };

  const handleUpdateExpense = async (data) => {
    const expenseData = {
      description: data.description.trim(),
      amount: Number(data.amount),
      paidBy: data.paidBy,
    };

    try {
      setLoading((prev) => ({ ...prev, update: true }));
      const response = await updateExpenseApi(editingExpenseId, expenseData);

      const updatedExpense = response.expense || response.data || response;

      setExpenses((prev) =>
        prev.map((expense) =>
          expense._id === editingExpenseId ? updatedExpense : expense,
        ),
      );

      setEditingExpenseId(null);
      reset();

      addToast("Expense updated successfully", "success");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to update expense",
        "error",
      );
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    reset();
  };

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-3">
        <div className="rounded-2xl flex items-center justify-between border border-cyan-100 bg-white px-3 py-2 shadow-sm sm:p-4">
          <div>
            <span className="font-inter text-xs font-medium text-slate-500">
              Total Spent
            </span>
            <p className="mt-1 break-words font-roboto text-xl font-bold text-slate-900 sm:text-2xl">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="bg-cyan-100 p-2 rounded-xl">
            <LuWallet size={18} className="text-cyan-700" />
          </div>
        </div>

        <div className="rounded-2xl flex items-center justify-between border border-cyan-100 bg-white px-3 py-2 shadow-sm sm:p-4">
          <div>
            <span className="font-inter text-xs font-medium text-slate-500">
              Equal Share
            </span>
            <p className="mt-1 break-words font-roboto text-xl font-bold text-slate-900 sm:text-2xl">
              {formatCurrency(equalShare)}
            </p>
          </div>
          <div className="bg-indigo-100 p-2 rounded-xl">
            <LuUsers size={18} className="text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
        <div className="rounded-2xl border border-cyan-100 bg-white p-4 pb-7 shadow-sm sm:p-5 sm:pb-7 mb-3 md:mb-0 lg:mb-2">
          <div className="mb-3">
            <h2 className="font-syne text-lg font-bold text-slate-900">
              People & Balances
            </h2>
            <p className="font-inter text-xs text-slate-500">
              Individual contributions and shares
            </p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-50 scroll">
            {people.length > 0 ? (
              peopleBalances.map((person) => (
                <div
                  key={person._id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-syne font-bold text-cyan-700">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-inter text-sm font-semibold text-slate-800">
                          {person.name}
                        </p>
                        <p className="font-inter text-xs text-slate-500">
                          Paid {formatCurrency(person.paid)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-roboto text-sm font-bold ${
                          person.balance > 0
                            ? "text-emerald-600"
                            : person.balance < 0
                              ? "text-rose-600"
                              : "text-slate-600"
                        }`}
                      >
                        {person.balance > 0
                          ? "+"
                          : person.balance < 0
                            ? "-"
                            : ""}
                        {formatCurrency(person.newBalance)}
                      </p>
                      <p className="font-inter text-xs text-slate-400">
                        {person.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p className="mt-1 text-center font-roboto text-sm text-slate-400">
                  <LuUsers size={32} className="mx-auto mb-1 text-slate-300" />
                  Add your friends to start tracking shared expenses and
                  balances
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  className="lg:hidden flex items-center justify-center gap-2 cursor-pointer p-2.5 md:p-3 rounded-lg font-inter text-sm font-semibold transition bg-cyan-600 text-white shadow-sm mx-auto"
                >
                  <LuPlus size={17} />
                  Add Friends
                </button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-4 pb-7 shadow-sm sm:p-5 sm:pb-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-syne text-lg font-bold text-slate-900">
                All Expenses
              </h2>
              <p className="font-inter text-xs text-slate-500">
                {expenses.length} recorded expenses
              </p>
            </div>
            <LuReceipt size={19} className="text-sky-700" />
          </div>

          {expenses.length === 0 ? (
            <>
              <p className="py-2 text-center mb-1 sm:mb-2 font-inter text-sm text-slate-400">
                No expenses added yet
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className="lg:hidden flex items-center justify-center gap-2 cursor-pointer p-2.5 md:p-3 rounded-lg font-inter text-sm font-semibold transition bg-cyan-600 text-white shadow-sm mx-auto"
              >
                <LuPlus size={17} />
                Add Expenses
              </button>
            </>
          ) : (
            <div className="space-y-3 max-h-50 overflow-y-auto scroll">
              {expenses.map((expense) => {
                const payerId = getPayerId(expense);
                const payer = people.find(
                  (person) => String(person._id) === String(payerId),
                );
                return (
                  <div key={expense._id}>
                    {editingExpenseId === expense._id ? (
                      <form
                        onSubmit={handleSubmit(handleUpdateExpense)}
                        className="space-y-3 rounded-xl border border-cyan-200 bg-sky-50 p-3"
                      >
                        <h3 className="font-inter text-sm font-semibold text-slate-800">
                          Update Expense
                        </h3>
                        <TextInput
                          label="Description"
                          name="description"
                          placeholder="Enter expense description"
                          register={register}
                          rules={{
                            required: "Description is required",
                            validate: (value) =>
                              value.trim().length > 0 ||
                              "Description is required",
                          }}
                          error={errors.description}
                        />
                        <TextInput
                          label="Amount"
                          name="amount"
                          type="number"
                          placeholder="Enter amount"
                          register={register}
                          rules={{
                            required: "Amount is required",
                            valueAsNumber: true,
                            min: {
                              value: 0.01,
                              message: "Amount must be greater than 0",
                            },
                          }}
                          error={errors.amount}
                        />
                        <div>
                          <label
                            htmlFor="paidBy"
                            className="mb-1 block font-inter text-xs font-medium text-slate-700"
                          >
                            Paid By
                          </label>
                          <select
                            id="paidBy"
                            {...register("paidBy", {
                              required: "Please select who paid",
                            })}
                            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-inter text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-50"
                          >
                            <option value="">Select who paid</option>
                            {people.map((person) => (
                              <option key={person._id} value={person._id}>
                                {person.name}
                              </option>
                            ))}
                          </select>
                          {errors.paidBy && (
                            <p className="mt-1 text-xs text-rose-500">
                              {errors.paidBy.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <LoadingButton
                            type="submit"
                            loading={loading.update}
                            loadingText="Updating..."
                            className="flex flex-1 items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-cyan-600 p-2.5 font-inter text-xs font-semibold text-white transition hover:bg-cyan-700"
                          >
                            <LuSave size={15} />
                            Update
                          </LoadingButton>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex flex-1 items-center justify-center gap-1.5 cursor-pointer rounded-lg border border-slate-200 bg-white p-2.5 font-inter text-xs font-semibold text-slate-600 transition hover:bg-rose-500 hover:text-white"
                          >
                            <LuX size={15} />
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <LuReceipt
                            size={17}
                            className="shrink-0 text-sky-700"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-inter text-sm font-semibold text-slate-800">
                              {expense.description}
                            </p>
                            <p className="font-inter text-xs text-slate-500">
                              Paid by {payer?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                          <span className="font-roboto text-sm font-bold text-slate-800">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEditExpense(expense)}
                            title="Edit expense"
                            className="rounded-lg cursor-pointer p-1.5 text-cyan-600 transition hover:bg-cyan-50"
                          >
                            <LuPencil size={16} />
                          </button>
                          <LoadingButton
                            type="button"
                            loading={loading.deleteExpenseId === expense._id}
                            loadingText=""
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="rounded-lg cursor-pointer p-1.5 text-rose-500 transition hover:bg-rose-50"
                          >
                            <LuTrash2 size={16} />
                          </LoadingButton>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default GroupOverview;
