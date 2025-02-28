// Create a new file for reusable dark mode form styles
export const formClasses = {
  container: "fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto",
  form: "relative bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-4xl mx-auto my-8",
  header: "flex justify-between items-center mb-4",
  title: "text-xl font-semibold text-gray-900 dark:text-white",
  closeButton: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
  label: "block text-sm font-medium text-gray-700 dark:text-gray-300",
  input: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-500 shadow-sm",
  select: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-500 shadow-sm",
  textarea: "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-500 shadow-sm",
  error: "mt-1 text-sm text-red-600 dark:text-red-400",
  buttonGroup: "flex justify-end items-center space-x-4 mt-8 border-t dark:border-gray-700 pt-4",
  button: {
    base: "px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    cancel: "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600",
    submit: "text-white bg-indigo-600 dark:bg-indigo-500 border border-transparent hover:bg-indigo-700 dark:hover:bg-indigo-600"
  },
  cancelButton: "px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md shadow-sm text-sm font-medium",
  submitButton: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
  addButton: "inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800"
};

// Add these new styles for payment history
export const paymentHistoryClasses = {
  container: "bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700",
  label: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1",
  value: "text-sm font-medium text-gray-900 dark:text-gray-100",
  amount: "text-lg font-bold text-gray-900 dark:text-gray-100",
  amountPaid: "text-lg font-bold text-green-600 dark:text-green-400"
};
