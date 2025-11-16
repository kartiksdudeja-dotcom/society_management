// frontend/src/pages/AdminCreateUser.jsx
import React, { useState } from 'react';
import API from '../services/api';

export default function AdminCreateUser(){
  const [form, setForm] = useState({ name:'', email:'', flatNumber:'', password:'123456', role:'member' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/users', form);
      setMsg('User created');
      setForm({ name:'', email:'', flatNumber:'', password:'123456', role:'member' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Create User</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required /><br />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required /><br />
        <input placeholder="Flat" value={form.flatNumber} onChange={e=>setForm({...form, flatNumber:e.target.value})} required /><br />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select><br />
        <button type="submit">Create</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
