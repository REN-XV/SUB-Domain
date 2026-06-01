import React, { useContext, useState, useRef } from 'react';
import { WarungContext } from '../context/WarungContext';
import { Printer, CheckCircle, UtensilsCrossed } from 'lucide-react';

export const Invoice = () => {
  const { customers, transactions, markAsPaid } = useContext(WarungContext);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePay = () => {
    if(window.confirm('Apakah Anda yakin tagihan ini sudah dibayar lunas?')) {
      markAsPaid(selectedCustomerId);
      alert('Tagihan berhasil dilunasi!');
      setSelectedCustomerId('');
    }
  };

  const customerUnpaidTransactions = transactions.filter(t => t.customerId === selectedCustomerId && t.status === 'unpaid');
  const totalDebt = customerUnpaidTransactions.reduce((sum, t) => sum + t.total, 0);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Group items
  const allItems = [];
  customerUnpaidTransactions.forEach(t => {
    t.items.forEach(item => {
      allItems.push({ ...item, date: t.date });
    });
  });

  return (
    <div>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 100%;
              padding: 20px;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
            .app-container { padding: 0 !important; }
            .desktop-sidebar { display: none !important; }
            .main-content { padding: 0 !important; }
          }
        `}
      </style>

      <div className="no-print" style={{ marginBottom: '24px' }}>
        <h2>Cetak Nota Kasbon</h2>
        <p className="text-muted" style={{ marginBottom: '16px' }}>Pilih pelanggan untuk melihat dan mencetak rincian tagihan kasbon.</p>
        
        <div className="card" style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <label>Pilih Pelanggan</label>
            <select 
              className="input-control" 
              value={selectedCustomerId} 
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">-- Pilih Pelanggan --</option>
              {customers.map(c => {
                const debtCount = transactions.filter(t => t.customerId === c.id && t.status === 'unpaid').length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} {debtCount > 0 ? `(${debtCount} transaksi)` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {selectedCustomerId && customerUnpaidTransactions.length > 0 && (
        <div className="card animate-slide-up" id="printable-invoice" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff' }}>
          
          <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--color-daun-pisang)', marginBottom: '8px' }}>
              <UtensilsCrossed size={32} />
            </div>
            <h2 style={{ margin: '0 0 4px 0', color: 'var(--color-text-main)' }}>WARUNGKU</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Nota Tagihan Kasbon</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
            <div>
              <div className="text-muted">Kepada Yth:</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{selectedCustomer?.name}</div>
              <div>{selectedCustomer?.phone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-muted">Tanggal Cetak:</div>
              <div style={{ fontWeight: '500' }}>{new Date().toLocaleDateString('id-ID')}</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left' }}>Item / Tanggal</th>
                  <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>{new Date(item.date).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '500' }}>{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--color-daun-muda)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: '600', color: 'var(--color-daun-pisang)' }}>TOTAL TAGIHAN:</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-daun-pisang)' }}>{formatRupiah(totalDebt)}</span>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={18} /> Cetak Nota
            </button>
            <button className="btn btn-primary" onClick={handlePay}>
              <CheckCircle size={18} /> Lunasi Tagihan
            </button>
          </div>

        </div>
      )}

      {selectedCustomerId && customerUnpaidTransactions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <CheckCircle size={48} className="text-daun" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 className="text-daun" style={{ marginBottom: '8px' }}>Semua Lunas!</h3>
          <p className="text-muted">Pelanggan ini tidak memiliki tagihan kasbon yang belum dibayar.</p>
        </div>
      )}

    </div>
  );
};
