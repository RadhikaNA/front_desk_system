import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(api + '/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.token);
    } catch {
      alert('Invalid credentials');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb' }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'grid', gap: 10, marginTop: 20 }}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: '10px', borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '10px', borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px', border: 'none', borderRadius: 4 }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
