import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UtensilsCrossed } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registrasi berhasil! Silakan periksa email Anda (jika wajib konfirmasi) atau coba login.');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '20px' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-daun-pisang)' }}>
          <UtensilsCrossed size={48} />
        </div>
        <h2 style={{ marginBottom: '8px' }}>WarungKu</h2>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          {isLogin ? 'Masuk ke akun kasbon warung Anda' : 'Buat akun warung baru'}
        </p>

        <form onSubmit={handleAuth} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@email.com"
            />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="input-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px' }}>
          {isLogin ? (
            <span>Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} className="text-daun" style={{ fontWeight: '600' }}>Daftar di sini</a></span>
          ) : (
            <span>Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} className="text-daun" style={{ fontWeight: '600' }}>Masuk di sini</a></span>
          )}
        </div>
      </div>
    </div>
  );
};
