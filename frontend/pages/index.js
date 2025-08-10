import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
    fetchQueue(t);
    fetchAppts(t);
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
    } catch {
      alert('Login failed.');
    }
  }

  async function fetchQueue(authToken = token) {
    try {
      const res = await fetch(api + '/queue', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
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
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch appointments');
      setAppointments(await res.json());
    } catch {
      alert('Could not load appointments.');
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

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '30px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2563eb' }}>Front Desk System — Demo UI</h1>

      {!token ? (
        <button
          onClick={login}
          style={{
            display: 'block',
            margin: '20px auto',
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '12px 25px',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(37, 99, 235, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#2563eb')}
        >
          Auto-login seeded admin
        </button>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: 6,
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(6, 95, 70, 0.3)',
          }}
        >
          Logged in as Admin
        </div>
      )}

      <section style={{ marginTop: 40 }}>
        <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, color: '#2563eb' }}>Queue</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 15, marginBottom: 20 }}>
          <input
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            style={{
              flexGrow: 1,
              padding: '10px 14px',
              fontSize: 16,
              borderRadius: 6,
              border: '1.5px solid #ccc',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => (e.target.style.borderColor = '#2563eb')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />
          <button
            onClick={addToQueue}
            style={{
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 6,
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 3px 6px rgba(22, 163, 74, 0.4)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = '#15803d')}
            onMouseLeave={e => (e.target.style.backgroundColor = '#16a34a')}
          >
            Add Walk-in
          </button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {queue.length === 0 ? (
            <li style={{ color: '#6b7280', fontStyle: 'italic' }}>No patients in queue</li>
          ) : (
            queue.map(q => (
              <li
                key={q.id}
                style={{
                  padding: '10px 15px',
                  marginBottom: 8,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 6,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  <strong>#{q.queueNumber}</strong> — {q.patientName}
                </span>
                <select
                  value={q.status}
                  onChange={e => updateQueueStatus(q.id, e.target.value)}
                  style={{
                    fontWeight: '600',
                    color:
                      q.status === 'waiting'
                        ? '#facc15'
                        : q.status === 'done'
                        ? '#10b981'
                        : '#6b7280',
                    textTransform: 'capitalize',
                    borderRadius: 4,
                    border: '1.5px solid #ccc',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="waiting">Waiting</option>
                  <option value="with doctor">With Doctor</option>
                  <option value="done">Done</option>
                </select>
              </li>
            ))
          )}
        </ul>
      </section>

      <section style={{ marginTop: 50 }}>
        <h2 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, color: '#2563eb' }}>Appointments</h2>
        <button
          onClick={() => fetchAppts()}
          style={{
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 3px 6px rgba(37, 99, 235, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#1e40af')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#2563eb')}
        >
          Refresh
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {appointments.length === 0 ? (
            <li style={{ color: '#6b7280', fontStyle: 'italic' }}>No appointments available</li>
          ) : (
            appointments.map(a => (
              <li
                key={a.id}
                style={{
                  backgroundColor: '#f9fafb',
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 15,
                  color: '#374151',
                }}
              >
                <div>
                  <strong>{a.patientName}</strong> — {a.timeslot} —{' '}
                  <span
                    style={{
                      fontWeight: '600',
                      color: a.status === 'confirmed' ? '#10b981' : '#f59e0b',
                      textTransform: 'capitalize',
                    }}
                  >
                    {a.status}
                  </span>{' '}
                  {a.doctor ? (
                    <em>
                      — Dr. {a.doctor.name.replace(/^Dr\.?\s*/i, '')}
                      {a.doctor.availability?.length > 0 && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                          Availability: {a.doctor.availability.join(', ')}
                        </div>
                      )}
                    </em>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
        <p style={{ fontStyle: 'italic', color: '#9ca3af', marginTop: 10 }}>
          Use Postman or backend endpoints to create appointments (quick demo).
        </p>
      </section>
    </div>
  );
}
