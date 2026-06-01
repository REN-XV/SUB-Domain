import React, { useContext, useState } from 'react';
import { WarungContext } from '../context/WarungContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const MenuManagement = () => {
  const { menus, addMenu, updateMenu, deleteMenu } = useContext(WarungContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '' });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const handleOpenForm = (menu = null) => {
    if (menu) {
      setFormData({ name: menu.name, price: menu.price });
      setEditingId(menu.id);
    } else {
      setFormData({ name: '', price: '' });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    if (editingId) {
      updateMenu(editingId, { name: formData.name, price: Number(formData.price) });
    } else {
      addMenu({ name: formData.name, price: Number(formData.price) });
    }
    setIsFormOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Daftar Menu</h2>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {isFormOpen && (
        <div className="card animate-slide-up" style={{ marginBottom: '24px', borderLeft: '4px solid var(--color-daun-pisang)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>{editingId ? 'Edit Menu' : 'Menu Baru'}</h3>
            <button className="icon-btn" onClick={() => setIsFormOpen(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ flex: '1 1 200px', margin: 0 }}>
              <label>Nama Menu</label>
              <input 
                type="text" 
                className="input-control" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Misal: Nasi Goreng"
                autoFocus
              />
            </div>
            <div className="input-group" style={{ flex: '1 1 150px', margin: 0 }}>
              <label>Harga (Rp)</label>
              <input 
                type="number" 
                className="input-control" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="Misal: 15000"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Simpan</button>
          </form>
        </div>
      )}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Nama Menu</th>
              <th>Harga</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(menu => (
              <tr key={menu.id}>
                <td>{menu.name}</td>
                <td style={{ fontWeight: '500' }}>{formatRupiah(menu.price)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="icon-btn" onClick={() => handleOpenForm(menu)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="icon-btn danger" onClick={() => deleteMenu(menu.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }} className="text-muted">
                  Belum ada menu. Silakan tambah menu baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
