// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginForm(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
      <form onSubmit={handleLogin} style={{background:'#fff', padding:24, borderRadius:8, boxShadow:'0 0 8px rgba(0,0,0,0.1)'}}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /><br />
        <button type="submit">Login</button>
        {msg && <p style={{color:'red'}}>{msg}</p>}
      </form>
    </div>
  );
}
