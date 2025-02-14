import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState({
    current: [],
    upcoming: [],
  });

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        purchase,
        setPurchase,
        sales,
        setSales,
        customers,
        setCustomers,
        stock,
        setStock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
