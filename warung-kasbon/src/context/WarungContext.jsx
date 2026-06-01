import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const WarungContext = createContext();

export const WarungProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [menus, setMenus] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchData(session.user.id);
    } else {
      setMenus([]);
      setCustomers([]);
      setTransactions([]);
      setLoading(false);
    }
  }, [session]);

  const fetchData = async (userId) => {
    setLoading(true);
    try {
      const [menuRes, customerRes, transRes] = await Promise.all([
        supabase.from('menus').select('*').order('created_at', { ascending: true }),
        supabase.from('customers').select('*').order('name', { ascending: true }),
        supabase.from('transactions').select('*').order('date', { ascending: false })
      ]);

      if (menuRes.data) setMenus(menuRes.data);
      if (customerRes.data) setCustomers(customerRes.data);
      if (transRes.data) setTransactions(transRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Menu Actions
  const addMenu = async (menu) => {
    if (!session?.user) return;
    const { data, error } = await supabase.from('menus').insert([{ ...menu, user_id: session.user.id }]).select();
    if (data) setMenus([...menus, data[0]]);
    if (error) console.error(error);
  };

  const updateMenu = async (id, updated) => {
    const { data, error } = await supabase.from('menus').update(updated).eq('id', id).select();
    if (data) setMenus(menus.map(m => m.id === id ? data[0] : m));
    if (error) console.error(error);
  };

  const deleteMenu = async (id) => {
    await supabase.from('menus').delete().eq('id', id);
    setMenus(menus.filter(m => m.id !== id));
  };

  // Customer Actions
  const addCustomer = async (customer) => {
    if (!session?.user) return;
    const { data, error } = await supabase.from('customers').insert([{ ...customer, user_id: session.user.id }]).select();
    if (data) setCustomers([...customers, data[0]]);
    if (error) console.error(error);
  };

  const updateCustomer = async (id, updated) => {
    const { data, error } = await supabase.from('customers').update(updated).eq('id', id).select();
    if (data) setCustomers(customers.map(c => c.id === id ? data[0] : c));
    if (error) console.error(error);
  };

  const deleteCustomer = async (id) => {
    await supabase.from('customers').delete().eq('id', id);
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Transaction Actions
  const addTransaction = async (transaction) => {
    if (!session?.user) return;
    const payload = {
      user_id: session.user.id,
      customer_id: transaction.customerId,
      total: transaction.total,
      status: 'unpaid',
      items: transaction.items
    };
    const { data, error } = await supabase.from('transactions').insert([payload]).select();
    if (data) setTransactions([data[0], ...transactions]);
    if (error) console.error(error);
  };
  
  const markAsPaid = async (customerId) => {
    const { data, error } = await supabase.from('transactions')
      .update({ status: 'paid', paid_date: new Date().toISOString() })
      .eq('customer_id', customerId)
      .eq('status', 'unpaid')
      .select();
      
    if (data && !error) {
      // Update local state based on returned updated data
      const updatedIds = new Set(data.map(d => d.id));
      setTransactions(transactions.map(t => updatedIds.has(t.id) ? data.find(d => d.id === t.id) : t));
    }
  };

  const deleteTransaction = async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <WarungContext.Provider value={{
      session, loading, logout,
      menus, addMenu, updateMenu, deleteMenu,
      customers, addCustomer, updateCustomer, deleteCustomer,
      transactions, addTransaction, markAsPaid, deleteTransaction
    }}>
      {children}
    </WarungContext.Provider>
  );
};
