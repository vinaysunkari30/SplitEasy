import { useForm } from "react-hook-form";
import { useState } from "react";

import { LuUsers, LuUserPlus, LuX, LuReceipt, LuPlus } from "react-icons/lu";

import { ToastContainer, useToast } from "./common/toast";
import TextInput from "./common/textInput";
import LoadingButton from "./common/loading";
import { addPerson, deletePerson } from "../api/peopleApi";
import { addExpense } from "../api/expensesApi";

const GroupForms = ({ people, setPeople, expenses, setExpenses }) => {
  const [loading, setLoading] = useState({
    person: false,
    expense: false,
    deletePersonId: null,
  });
  const { toasts, addToast, removeToast } = useToast();
  const {
    register: registerPerson,
    handleSubmit: handlePersonSubmit,
    reset: resetPerson,
    formState: { errors: personErrors },
  } = useForm();
  const {
    register: registerExpense,
    handleSubmit: handleExpenseSubmit,
    reset: resetExpense,
    formState: { errors: expenseErrors },
  } = useForm();

  const handleAddPerson = async (data) => {
    const name = data.personName.trim();
    if (people.length >= 6) {
      addToast("Only 6 members allowed per group", "warning");
      resetPerson();
      return;
    }
    const exists = people.some(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      addToast(`${name} is already in the group`, "info");
      resetPerson();
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, person: true }));
      const response = await addPerson(name);
      const newPerson = response.person || response.data || response;
      setPeople((prev) => [...prev, newPerson]);
      addToast(`${name} is added to the group`, "success");
      resetPerson();
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to add person",
        "error",
      );
    } finally {
      setLoading((prev) => ({ ...prev, person: false }));
    }
  };

  const handleRemovePerson = async (id) => {
    const hasExpenses = expenses.some((expense) => {
      const payerId = expense.paidBy?._id || expense.paidBy;
      return String(payerId) === String(id);
    });
    const person = people.find((person) => String(person._id) === String(id));
    if (hasExpenses) {
      addToast(
        `${person?.name} has active expenses. Settle or remove them first`,
        "error",
      );
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, deletePersonId: id }));
      await deletePerson(id);
      setPeople((prev) => prev.filter((person) => person._id !== id));
      addToast(`${person?.name} was removed from the group`, "success");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to remove person",
        "error",
      );
    } finally {
      setLoading((prev) => ({ ...prev, deletePersonId: null }));
    }
  };

  const handleAddExpense = async (data) => {
    const expenseData = {
      description: data.description.trim(),
      amount: Number(data.amount),
      paidBy: data.paidBy,
    };
    try {
      setLoading((prev) => ({ ...prev, expense: true }));
      const response = await addExpense(expenseData);
      const newExpense = response.expense || response.data || response;
      setExpenses((prev) => [newExpense, ...prev]);
      addToast("New expense added to the list", "success");
      resetExpense();
    } catch (error) {
      addToast(
        error.response?.data?.message || "Unable to add expense",
        "error",
      );
    } finally {
      setLoading((prev) => ({ ...prev, expense: false }));
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
        <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm md:p-4 sm:p-5 mb-2 md:mb-0 lg:mb-2">
          <div className="mb-3.5 flex items-center gap-2">
            <div className="rounded-lg bg-cyan-50 p-2 text-cyan-700">
              <LuUsers size={20} className="text-cyan-700" />
            </div>
            <div>
              <h2 className="font-syne text-lg font-bold text-slate-900">
                Add Friends
              </h2>
              <p className="font-inter text-xs text-slate-500">
                Add 2 to 6 people
              </p>
            </div>
            <span className="ml-auto rounded-full bg-cyan-50 px-3 py-1 font-inter text-xs font-semibold text-cyan-700">
              {people.length}/6
            </span>
          </div>

          <form onSubmit={handlePersonSubmit(handleAddPerson)}>
            <div className="flex items-start justify-center gap-2">
              <TextInput
                label="Name"
                name="personName"
                placeholder="Enter friend's name"
                register={registerPerson}
                rules={{
                  required: "Name is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Name is required",
                }}
                error={personErrors.personName}
              />
              <LoadingButton
                type="submit"
                loading={loading.person}
                loadingText="Adding..."
                className="mt-5 rounded-xl bg-cyan-600 p-3 font-inter text-sm font-semibold text-white hover:bg-cyan-700 sm:mt-6.5"
              >
                <LuUserPlus size={17} />
                Add
              </LoadingButton>
            </div>
          </form>

          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto scroll">
            {people.length > 0 ? (
              people.map((person, index) => (
                <div
                  key={person._id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-syne font-bold text-cyan-700">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-inter text-sm font-semibold text-slate-800">
                        {person.name}
                      </p>
                      <p className="font-inter text-xs text-slate-400">
                        Person {index + 1}
                      </p>
                    </div>
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={loading.deletePersonId === person._id}
                    loadingText=""
                    onClick={() => handleRemovePerson(person._id)}
                    className="cursor-pointer rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                  >
                    <LuX size={18} />
                  </LoadingButton>
                </div>
              ))
            ) : (
              <p className="py-2 text-center font-inter text-sm text-slate-400">
                + Add your 1st friend
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <LuReceipt size={20} className="text-sky-700" />
            <div>
              <h2 className="font-syne text-lg font-bold text-slate-900">
                Add Expense
              </h2>
              <p className="font-inter text-xs text-slate-500">
                Record a shared expense
              </p>
            </div>
          </div>
          <form
            onSubmit={handleExpenseSubmit(handleAddExpense)}
            className="space-y-3"
          >
            <TextInput
              label="Description"
              name="description"
              placeholder="e.g. Hotel booking"
              register={registerExpense}
              rules={{
                required: "Description is required",
                validate: (value) =>
                  value.trim().length > 0 || "Description is required",
              }}
              error={expenseErrors.description}
            />
            <TextInput
              label="Amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              register={registerExpense}
              rules={{
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0",
                },
                valueAsNumber: true,
              }}
              error={expenseErrors.amount}
            />
            <div>
              <label className="mb-1.5 block font-inter text-sm font-medium text-slate-700">
                Paid By
              </label>
              <select
                {...registerExpense("paidBy", {
                  required: "Please select who paid",
                })}
                className={`w-full cursor-pointer rounded-lg font-roboto border p-3 text-sm outline-none transition-colors
                ${
                  expenseErrors.paidBy
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-100"
                    : "border-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-50"
                }`}
              >
                <option value="">Select who paid</option>
                {people.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name}
                  </option>
                ))}
              </select>
              {expenseErrors.paidBy && (
                <p className="mt-1 text-xs text-rose-500 font-roboto">
                  {expenseErrors.paidBy.message}
                </p>
              )}
            </div>
            <LoadingButton
              type="submit"
              loading={loading.expense}
              loadingText="Adding..."
              disabled={people.length < 2}
              className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-xl bg-cyan-600 px-4 py-3 font-inter text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuPlus size={18} />
              Add Expense
            </LoadingButton>
          </form>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default GroupForms;
