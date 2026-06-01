import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WarungContext } from './context/WarungContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CustomerManagement } from './pages/CustomerManagement';
import { MenuManagement } from './pages/MenuManagement';
import { Transactions } from './pages/Transactions';
import { Invoice } from './pages/Invoice';
import { Auth } from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useContext(WarungContext);
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function App() {
  const { session } = useContext(WarungContext);

  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/" replace /> : <Auth />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
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
