import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [token, setToken] = useState('');
  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [apptPatientName, setApptPatientName] = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptTimeslot, setApptTimeslot] = useState('');
  const [apptDate, setApptDate] = useState(null);
  const [apptDoctorId, setApptDoctorId] = useState('');
  const [apptStatus, setApptStatus] = useState('pending');

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
    fetchQueue(t);
    fetchAppts(t);
    fetchDoctors(t);
  }, []);

  async function login() {
    try {
      const res = await fetch(api + '/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password123' }),
      });
      if (!res.ok) throw new Error('Login failed');
      const j = await res.json();
      localStorage.setItem('token', j.accessToken);
      setToken(j.accessToken);
      alert('Logged in as admin (seeded).');
      fetchQueue(j.accessToken);
      fetchAppts(j.accessToken);
      fetchDoctors(j.accessToken);
    } catch {
      alert('Login failed.');
    }
  }

  async function fetchQueue(authToken = token) {
    try {
      const res = await fetch(api + '/queue', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch queue');
      setQueue(await res.json());
    } catch {
      alert('Could not load queue.');
    }
  }

  async function addToQueue() {
    if (!patientName) return alert('Enter patient name');
    try {
      const res = await fetch(api + '/queue', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patientName }),
      });
      if (!res.ok) throw new Error('Failed to add to queue');
      setPatientName('');
      fetchQueue();
    } catch {
      alert('Failed to add patient to queue.');
    }
  }

  async function fetchAppts(authToken = token) {
    try {
      const res = await fetch(api + '/appointments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch appointments');
      setAppointments(await res.json());
    } catch {
      alert('Could not load appointments.');
    }
  }

  async function fetchDoctors(authToken = token) {
    try {
      const res = await fetch(api + '/doctors', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch doctors');
      setDoctors(await res.json());
    } catch {
      alert('Could not load doctors.');
    }
  }

  async function updateQueueStatus(id, newStatus) {
    try {
      const res = await fetch(api + `/queue/${id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchQueue();
    } catch {
      alert('Failed to update patient status.');
    }
  }

  async function addAppointment() {
    if (!apptPatientName || !apptPhone || !apptTimeslot || !apptDoctorId || !apptDate) {
      return alert('Fill all fields');
    }
    try {
      const formattedDate = apptDate.toISOString().split('T')[0];
      const res = await fetch(api + '/appointments', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientName: apptPatientName,
          phone: apptPhone,
          timeslot: apptTimeslot,
          date: formattedDate,
          doctorId: Number(apptDoctorId),
          status: apptStatus,
        }),
      });
      if (!res.ok) throw new Error('Failed to add appointment');
      setApptPatientName('');
      setApptPhone('');
      setApptTimeslot('');
      setApptDate(null);
      setApptDoctorId('');
      setApptStatus('pending');
      fetchAppts();
    } catch {
      alert('Failed to add appointment.');
    }
  }

  async function deleteAppointment(id) {
    if (!confirm('Delete this appointment?')) return;
    try {
      const res = await fetch(api + `/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete appointment');
      fetchAppts();
    } catch {
      alert('Failed to delete appointment.');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', fontFamily: "'Segoe UI', sans-serif", color: '#333' }}>
      <h1 style={{ textAlign: 'center', color: '#2563eb' }}>Front Desk System — Demo UI</h1>

      {!token ? (
        <button onClick={login} style={{ display: 'block', margin: '20px auto', backgroundColor: '#2563eb', color: '#fff', padding: '12px 25px', border: 'none', borderRadius: 6 }}>
          Auto-login seeded admin
        </button>
      ) : (
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: 6 }}>
          Logged in as Admin
        </div>
      )}

      {/* Queue Section */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, color: '#2563eb' }}>Queue</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 15, marginBottom: 20 }}>
          <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter patient name" style={{ flexGrow: 1, padding: '10px 14px' }} />
          <button onClick={addToQueue} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6 }}>
            Add Walk-in
          </button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {queue.length === 0 ? (
            <li style={{ color: '#6b7280', fontStyle: 'italic' }}>No patients in queue</li>
          ) : (
            queue.map(q => (
              <li key={q.id} style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <strong>#{q.queueNumber}</strong> — {q.patientName}
                </span>
                <select value={q.status} onChange={e => updateQueueStatus(q.id, e.target.value)}>
                  <option value="waiting">Waiting</option>
                  <option value="with doctor">With Doctor</option>
                  <option value="done">Done</option>
                </select>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Appointments Section */}
      <section style={{ marginTop: 50 }}>
        <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, color: '#2563eb' }}>Appointments</h2>

        {/* Add Appointment Form */}
        <div style={{ display: 'grid', gap: 10, marginTop: 15, marginBottom: 20 }}>
          <input value={apptPatientName} onChange={e => setApptPatientName(e.target.value)} placeholder="Patient name" />
          <input value={apptPhone} onChange={e => setApptPhone(e.target.value)} placeholder="Phone number" />
          <DatePicker
            selected={apptDate}
            onChange={date => setApptDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select appointment date"
          />
          <input value={apptTimeslot} onChange={e => setApptTimeslot(e.target.value)} placeholder="Timeslot (e.g., 10:00 AM)" />
          <select value={apptDoctorId} onChange={e => setApptDoctorId(e.target.value)}>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} ({d.specialization})
              </option>
            ))}
          </select>
          <select value={apptStatus} onChange={e => setApptStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>
          <button onClick={addAppointment} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6 }}>
            Add Appointment
          </button>
        </div>

        {/* Appointment Table */}
        {appointments.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No appointments available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Name</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Phone</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Date</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Timeslot</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Status</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Doctor</th>
                <th style={{ padding: 10, border: '1px solid #d1d5db' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>{a.patientName}</td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>{a.phone}</td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>{a.date}</td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>{a.timeslot}</td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db', fontWeight: '600', color: a.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>
                    {a.status}
                  </td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>
                    {a.doctor ? `Dr. ${a.doctor.name} (${a.doctor.specialization})` : '—'}
                  </td>
                  <td style={{ padding: 10, border: '1px solid #d1d5db' }}>
                    <button onClick={() => deleteAppointment(a.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
