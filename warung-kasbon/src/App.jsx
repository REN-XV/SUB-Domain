import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CustomerManagement } from './pages/CustomerManagement';
import { MenuManagement } from './pages/MenuManagement';
import { Transactions } from './pages/Transactions';
import { Invoice } from './pages/Invoice';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="invoice" element={<Invoice />} />
      </Route>
    </Routes>
  );
}

export default App;
