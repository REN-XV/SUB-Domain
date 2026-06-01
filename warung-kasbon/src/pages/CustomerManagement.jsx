import React, { useContext, useState } from 'react';
import { WarungContext } from '../context/WarungContext';
import { Plus, Edit2, Trash2, X, Phone } from 'lucide-react';

export const CustomerManagement = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useContext(WarungContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleOpenForm = (customer = null) => {
    if (customer) {
      setFormData({ name: customer.name, phone: customer.phone || '' });
      setEditingId(customer.id);
    } else {
      setFormData({ name: '', phone: '' });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      updateCustomer(editingId, { name: formData.name, phone: formData.phone });
    } else {
      addCustomer({ name: formData.name, phone: formData.phone });
    }
    setIsFormOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Daftar Pelanggan</h2>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Tambah Pelanggan
        </button>
      </div>

      {isFormOpen && (
        <div className="card animate-slide-up" style={{ marginBottom: '24px', borderLeft: '4px solid var(--color-sambal)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>{editingId ? 'Edit Pelanggan' : 'Pelanggan Baru'}</h3>
            <button className="icon-btn" onClick={() => setIsFormOpen(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ flex: '1 1 200px', margin: 0 }}>
              <label>Nama Pelanggan *</label>
              <input 
                type="text" 
                className="input-control" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Misal: Budi"
                autoFocus
                required
              />
            </div>
            <div className="input-group" style={{ flex: '1 1 150px', margin: 0 }}>
              <label>No. HP / WhatsApp</label>
              <input 
                type="text" 
                className="input-control" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Misal: 08123456789"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', backgroundColor: 'var(--color-sambal)' }}>Simpan</button>
          </form>
        </div>
      )}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Pelanggan</th>
              <th>Kontak</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td style={{ fontWeight: '500' }}>{customer.name}</td>
                <td>
                  {customer.phone ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
                      <Phone size={14} /> {customer.phone}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="icon-btn" onClick={() => handleOpenForm(customer)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="icon-btn danger" onClick={() => deleteCustomer(customer.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }} className="text-muted">
                  Belum ada pelanggan. Silakan tambah pelanggan baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
