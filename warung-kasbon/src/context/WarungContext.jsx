import React, { createContext, useState, useEffect } from 'react';

export const WarungContext = createContext();

const defaultMenus = [
  { id: '1', name: 'Nasi Goreng Spesial', price: 15000 },
  { id: '2', name: 'Ayam Geprek Sambal Bawang', price: 12000 },
  { id: '3', name: 'Indomie Goreng Telur', price: 8000 },
  { id: '4', name: 'Es Teh Manis', price: 3000 },
  { id: '5', name: 'Kopi Hitam', price: 4000 }
];

export const WarungProvider = ({ children }) => {
  const [menus, setMenus] = useState(() => {
    const localData = localStorage.getItem('warung_menus');
    return localData ? JSON.parse(localData) : defaultMenus;
  });

  const [customers, setCustomers] = useState(() => {
    const localData = localStorage.getItem('warung_customers');
    return localData ? JSON.parse(localData) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const localData = localStorage.getItem('warung_transactions');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('warung_menus', JSON.stringify(menus));
  }, [menus]);

  useEffect(() => {
    localStorage.setItem('warung_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('warung_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Menu Actions
  const addMenu = (menu) => setMenus([...menus, { ...menu, id: Date.now().toString() }]);
  const updateMenu = (id, updated) => setMenus(menus.map(m => m.id === id ? { ...m, ...updated } : m));
  const deleteMenu = (id) => setMenus(menus.filter(m => m.id !== id));

  // Customer Actions
  const addCustomer = (customer) => setCustomers([...customers, { ...customer, id: Date.now().toString() }]);
  const updateCustomer = (id, updated) => setCustomers(customers.map(c => c.id === id ? { ...c, ...updated } : c));
  const deleteCustomer = (id) => setCustomers(customers.filter(c => c.id !== id));

  // Transaction Actions
  // A transaction includes: customerId, items: [{menuId, name, price, qty, subtotal}], total, date, status (unpaid, paid)
  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: Date.now().toString(), date: new Date().toISOString(), status: 'unpaid' }, ...transactions]);
  };
  
  const markAsPaid = (customerId) => {
    setTransactions(transactions.map(t => 
      t.customerId === customerId && t.status === 'unpaid' 
        ? { ...t, status: 'paid', paidDate: new Date().toISOString() } 
        : t
    ));
  };

  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));

  return (
    <WarungContext.Provider value={{
      menus, addMenu, updateMenu, deleteMenu,
      customers, addCustomer, updateCustomer, deleteCustomer,
      transactions, addTransaction, markAsPaid, deleteTransaction
    }}>
      {children}
    </WarungContext.Provider>
  );
};
