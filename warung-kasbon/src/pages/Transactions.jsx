import React, { useContext, useState } from 'react';
import { WarungContext } from '../context/WarungContext';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Transactions = () => {
  const { customers, menus, addTransaction } = useContext(WarungContext);
  const navigate = useNavigate();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState([]);
  
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const addToCart = (menuId) => {
    if (!menuId) return;
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return;

    const existingItem = cart.find(item => item.menuId === menuId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuId === menuId 
          ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, { menuId: menu.id, name: menu.name, price: menu.price, qty: 1, subtotal: menu.price }]);
    }
  };

  const updateQty = (menuId, delta) => {
    setCart(cart.map(item => {
      if (item.menuId === menuId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty, subtotal: newQty * item.price } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.menuId !== menuId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = () => {
    if (!selectedCustomerId || cart.length === 0) {
      alert('Pilih pelanggan dan masukkan minimal 1 menu pesanan.');
      return;
    }

    addTransaction({
      customerId: selectedCustomerId,
      items: cart,
      total: total
    });

    // Reset form
    setSelectedCustomerId('');
    setCart([]);
    alert('Kasbon berhasil dicatat!');
    navigate('/');
  };

  if (customers.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h3 className="text-sambal" style={{ marginBottom: '10px' }}>Belum Ada Pelanggan</h3>
        <p className="text-muted" style={{ marginBottom: '20px' }}>Silakan tambah pelanggan terlebih dahulu di menu Pelanggan.</p>
        <button className="btn btn-primary" onClick={() => navigate('/customers')}>Ke Halaman Pelanggan</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Catat Kasbon Baru</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Kolom Input */}
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="input-group">
              <label>Pilih Pelanggan</label>
              <select 
                className="input-control" 
                value={selectedCustomerId} 
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">-- Pilih Pelanggan --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Pilih Menu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menus.map(menu => (
                <div key={menu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{menu.name}</div>
                    <div className="text-muted" style={{ fontSize: '13px' }}>{formatRupiah(menu.price)}</div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => addToCart(menu.id)}>
                    <Plus size={16} /> Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Keranjang (Rincian Pesanan) */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <ShoppingCart size={20} className="text-daun" /> Rincian Pesanan
            </h3>

            {cart.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>Belum ada pesanan.</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.menuId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--color-border)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.name}</div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>{formatRupiah(item.price)}</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{ fontWeight: '600' }}>{formatRupiah(item.subtotal)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--color-bg)', padding: '4px', borderRadius: '20px' }}>
                        <button className="icon-btn" style={{ padding: '2px' }} onClick={() => updateQty(item.menuId, -1)}>-</button>
                        <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button className="icon-btn" style={{ padding: '2px' }} onClick={() => updateQty(item.menuId, 1)}>+</button>
                        <button className="icon-btn danger" style={{ marginLeft: '4px' }} onClick={() => removeFromCart(item.menuId)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '24px', fontSize: '18px' }}>
                  <span style={{ fontWeight: '600' }}>Total Kasbon:</span>
                  <span className="text-sambal" style={{ fontWeight: '700', fontSize: '22px' }}>{formatRupiah(total)}</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }} onClick={handleSubmit}>
                  Simpan Transaksi Kasbon
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
