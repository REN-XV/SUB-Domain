import React, { useContext } from 'react';
import { WarungContext } from '../context/WarungContext';
import { Wallet, Users, Receipt } from 'lucide-react';

export const Dashboard = () => {
  const { transactions, customers } = useContext(WarungContext);

  const unpaidTransactions = transactions.filter(t => t.status === 'unpaid');
  const totalDebt = unpaidTransactions.reduce((sum, t) => sum + t.total, 0);
  
  const customersWithDebt = new Set(unpaidTransactions.map(t => t.customer_id)).size;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Ringkasan Hari Ini</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--color-sambal)' }}>
          <div style={{ padding: '15px', backgroundColor: 'var(--color-sambal-light)', borderRadius: '50%', color: 'var(--color-sambal)' }}>
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Total Piutang (Kasbon)</p>
            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--color-text-main)' }}>{formatRupiah(totalDebt)}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--color-daun-pisang)' }}>
          <div style={{ padding: '15px', backgroundColor: 'var(--color-daun-muda)', borderRadius: '50%', color: 'var(--color-daun-pisang)' }}>
            <Users size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Pelanggan Berhutang</p>
            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--color-text-main)' }}>{customersWithDebt} Orang</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '4px solid var(--color-kayu)' }}>
          <div style={{ padding: '15px', backgroundColor: 'var(--color-kayu-light)', borderRadius: '50%', color: 'var(--color-kayu)' }}>
            <Receipt size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '4px' }}>Transaksi Belum Lunas</p>
            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--color-text-main)' }}>{unpaidTransactions.length} Transaksi</h3>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Kasbon Terbaru</h2>
      <div className="card table-container">
        {unpaidTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {unpaidTransactions.slice(0, 5).map(t => {
                const customer = customers.find(c => c.id === t.customer_id);
                return (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td>{customer ? customer.name : 'Unknown'}</td>
                    <td style={{ fontWeight: '500' }}>{formatRupiah(t.total)}</td>
                    <td><span className="badge badge-red">Belum Lunas</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>Belum ada catatan kasbon.</p>
        )}
      </div>
    </div>
  );
};
