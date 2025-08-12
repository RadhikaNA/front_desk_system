// frontend/pages/index.js
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  if (!token) {
    return <Login onLoginSuccess={setToken} />;
  }

  return <MainApp token={token} setToken={setToken} />;
}

/* ---------- Simple Login component (embedded so you can copy/paste without adding files) ---------- */
function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function doLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(api + '/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Login failed');
      }
      const j = await res.json();
      localStorage.setItem('token', j.accessToken);
      onLoginSuccess(j.accessToken);
    } catch (err) {
      alert('Login failed: ' + (err.message || err));
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', fontFamily: "'Segoe UI', sans-serif", padding: 20, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb' }}>Front Desk Login</h2>
      <form onSubmit={doLogin} style={{ display: 'grid', gap: 10 }}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px 12px', border: 'none', borderRadius: 6 }}>
          Login
        </button>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          Seeded creds: <strong>admin / password123</strong>
        </div>
      </form>
    </div>
  );
}

/* ---------- Main app (index) ---------- */
function MainApp({ token, setToken }) {
  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Queues
  const [patientName, setPatientName] = useState('');

  // Appointments form
  const [apptPatientName, setApptPatientName] = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptTimeslot, setApptTimeslot] = useState('');
  const [apptDate, setApptDate] = useState(null);
  const [apptDoctorId, setApptDoctorId] = useState('');
  const [apptStatus, setApptStatus] = useState('pending');

  // Doctors (manage UI)
  const [doctorForm, setDoctorForm] = useState({
    id: null,
    name: '',
    specialization: '',
    gender: '',
    location: '',
    availability: '', // comma-separated in UI
  });
  const [doctorFilter, setDoctorFilter] = useState({ specialization: '', location: '', availability: '' });
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) return;
    fetchQueue();
    fetchAppts();
    fetchDoctors();
  }, [token]);

  /* ---------------- Queue methods ---------------- */
  async function fetchQueue() {
    try {
      const res = await fetch(api + '/queue', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch queue');
      setQueue(await res.json());
    } catch (err) {
      console.error(err);
      // Do not spam user; show a small alert
      // alert('Could not load queue.');
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
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to add to queue');
      }
      setPatientName('');
      fetchQueue();
    } catch (err) {
      alert('Failed to add patient to queue: ' + (err.message || err));
    }
  }

  // Remove queue entry (set status removed) - backend supports updateQueue
  async function removeQueueEntry(id) {
    if (!confirm('Remove this patient from queue?')) return;
    try {
      const res = await fetch(api + `/queue/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'removed' }),
      });
      if (!res.ok) throw new Error('Failed to remove queue entry');
      fetchQueue();
    } catch (err) {
      alert('Failed to remove queue entry: ' + (err.message || err));
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
    } catch (err) {
      alert('Failed to update patient status: ' + (err.message || err));
    }
  }

  /* ---------------- Appointments methods ---------------- */
  async function fetchAppts() {
    try {
      const res = await fetch(api + '/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch appointments');
      setAppointments(await res.json());
    } catch (err) {
      console.error(err);
      // alert('Could not load appointments.');
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
        // backend expects doctorId (we added logic in service to accept doctorId)
        body: JSON.stringify({
          patientName: apptPatientName,
          phone: apptPhone,
          timeslot: apptTimeslot,
          date: formattedDate,
          doctorId: Number(apptDoctorId),
          status: apptStatus,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to add appointment');
      }
      // reset
      setApptPatientName('');
      setApptPhone('');
      setApptTimeslot('');
      setApptDate(null);
      setApptDoctorId('');
      setApptStatus('pending');
      fetchAppts();
    } catch (err) {
      alert('Failed to add appointment: ' + (err.message || err));
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
    } catch (err) {
      alert('Failed to delete appointment: ' + (err.message || err));
    }
  }

  /* ---------------- Doctors (manage on index page) ---------------- */
  // Fetch doctors with optional filters (calls backend /doctors)
  async function fetchDoctors() {
    try {
      const qs = new URLSearchParams();
      if (doctorFilter.specialization) qs.append('specialization', doctorFilter.specialization);
      if (doctorFilter.location) qs.append('location', doctorFilter.location);
      if (doctorFilter.availability) qs.append('availability', doctorFilter.availability);
      const url = api + '/doctors' + (qs.toString() ? `?${qs.toString()}` : '');
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch doctors');
      setDoctors(await res.json());
    } catch (err) {
      console.error(err);
      // alert('Could not load doctors.');
    }
  }

  // Add or update doctor
  async function saveDoctor() {
    // prepare availability as array
    const availabilityArray = doctorForm.availability
      ? doctorForm.availability.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const payload = {
      name: doctorForm.name,
      specialization: doctorForm.specialization,
      gender: doctorForm.gender,
      location: doctorForm.location,
      availability: availabilityArray,
    };

    try {
      if (editingDoctorId) {
        const res = await fetch(api + `/doctors/${editingDoctorId}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || 'Failed to update doctor');
        }
        setEditingDoctorId(null);
      } else {
        const res = await fetch(api + '/doctors', {
          method: 'POST',
          headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || 'Failed to add doctor');
        }
      }
      // reset form and refresh list
      setDoctorForm({ id: null, name: '', specialization: '', gender: '', location: '', availability: '' });
      fetchDoctors();
    } catch (err) {
      alert('Failed to save doctor: ' + (err.message || err));
    }
  }

  function editDoctorLocal(d) {
    setEditingDoctorId(d.id);
    setDoctorForm({
      id: d.id,
      name: d.name || '',
      specialization: d.specialization || '',
      gender: d.gender || '',
      location: d.location || '',
      availability: (d.availability && Array.isArray(d.availability) ? d.availability.join(', ') : d.availability) || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteDoctor(id) {
    if (!confirm('Delete this doctor? This will not remove existing appointments (but they will reference a missing doctor).')) return;
    try {
      const res = await fetch(api + `/doctors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete doctor');
      fetchDoctors();
    } catch (err) {
      alert('Failed to delete doctor: ' + (err.message || err));
    }
  }

  function clearDoctorForm() {
    setEditingDoctorId(null);
    setDoctorForm({ id: null, name: '', specialization: '', gender: '', location: '', availability: '' });
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
  }

  return (
    <div style={{ maxWidth: 1100, margin: '16px auto 80px', fontFamily: "'Segoe UI', sans-serif", color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ color: '#2563eb' }}>Front Desk System</h1>
        <div>
          <button onClick={logout} style={{ backgroundColor: '#dc2626', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
            Logout
          </button>
        </div>
      </div>

      {/* ---------------- Doctor Management Section ---------------- */}
      <section style={{ marginBottom: 30, padding: 12, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0, color: '#1e3a8a' }}>Manage Doctors</h2>

        {/* Doctor Form: add/edit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          <input placeholder="Name" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} />
          <input placeholder="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
          <select value={doctorForm.gender} onChange={(e) => setDoctorForm({ ...doctorForm, gender: e.target.value })}>
            <option value="">Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          <input placeholder="Location" value={doctorForm.location} onChange={(e) => setDoctorForm({ ...doctorForm, location: e.target.value })} />
          <input placeholder="Availability (comma separated - e.g. 09:00-12:00, 14:00-17:00)" value={doctorForm.availability} onChange={(e) => setDoctorForm({ ...doctorForm, availability: e.target.value })} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={saveDoctor} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
              {editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
            </button>
            <button onClick={clearDoctorForm} style={{ backgroundColor: '#9ca3af', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="Filter specialization" value={doctorFilter.specialization} onChange={(e) => setDoctorFilter({ ...doctorFilter, specialization: e.target.value })} />
          <input placeholder="Filter location" value={doctorFilter.location} onChange={(e) => setDoctorFilter({ ...doctorFilter, location: e.target.value })} />
          <input placeholder="Filter availability (e.g. 09:00)" value={doctorFilter.availability} onChange={(e) => setDoctorFilter({ ...doctorFilter, availability: e.target.value })} />
          <button onClick={fetchDoctors} style={{ backgroundColor: '#10b981', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
            Apply Filters
          </button>
          <button onClick={() => { setDoctorFilter({ specialization: '', location: '', availability: '' }); fetchDoctors(); }} style={{ backgroundColor: '#6b7280', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
            Clear Filters
          </button>
        </div>

        {/* Doctor List */}
        <div style={{ marginTop: 14 }}>
          {doctors.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No doctors found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Specialization</th>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Gender</th>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Location</th>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Availability</th>
                  <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{d.name}</td>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{d.specialization}</td>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{d.gender || '—'}</td>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{d.location || '—'}</td>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{Array.isArray(d.availability) ? d.availability.join(', ') : d.availability || '—'}</td>
                    <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>
                      <button onClick={() => editDoctorLocal(d)} style={{ marginRight: 6, padding: '6px 8px' }}>Edit</button>
                      <button onClick={() => deleteDoctor(d.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 4 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ---------------- Queue Section ---------------- */}
      <section style={{ marginBottom: 30 }}>
        <h2 style={{ color: '#1e3a8a' }}>Queue</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, marginBottom: 12 }}>
          <input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" style={{ flexGrow: 1, padding: 8 }} />
          <button onClick={addToQueue} style={{ backgroundColor: '#16a34a', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
            Add Walk-in
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          {queue.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No patients in queue</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
              {queue.map((q) => (
                <li key={q.id} style={{ padding: 12, backgroundColor: '#f8fafc', border: '1px solid #e6e6e6', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>#{q.queueNumber}</strong> — {q.patientName} {q.doctor ? <em>— Dr. {q.doctor.name}</em> : null}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={q.status} onChange={(e) => updateQueueStatus(q.id, e.target.value)} style={{ padding: 6 }}>
                      <option value="waiting">Waiting</option>
                      <option value="with doctor">With Doctor</option>
                      <option value="done">Done</option>
                      <option value="removed">Removed</option>
                    </select>
                    <button onClick={() => removeQueueEntry(q.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 4 }}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------------- Appointments Section ---------------- */}
      <section>
        <h2 style={{ color: '#1e3a8a' }}>Appointments</h2>

        {/* Add Appointment Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginTop: 12 }}>
          <input placeholder="Patient name" value={apptPatientName} onChange={(e) => setApptPatientName(e.target.value)} />
          <input placeholder="Phone number" value={apptPhone} onChange={(e) => setApptPhone(e.target.value)} />
          <div>
            <DatePicker selected={apptDate} onChange={(date) => setApptDate(date)} dateFormat="yyyy-MM-dd" placeholderText="Select appointment date" />
          </div>
          <input placeholder="Timeslot (e.g., 09:00 AM - 10:00 AM)" value={apptTimeslot} onChange={(e) => setApptTimeslot(e.target.value)} />
          <select value={apptDoctorId} onChange={(e) => setApptDoctorId(e.target.value)}>
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} ({d.specialization})
              </option>
            ))}
          </select>
          <select value={apptStatus} onChange={(e) => setApptStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={addAppointment} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
              Add Appointment
            </button>
            <button onClick={fetchAppts} style={{ backgroundColor: '#6b7280', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>
              Refresh Appts
            </button>
          </div>
        </div>

        {/* Appointments table */}
        <div style={{ marginTop: 16 }}>
          {appointments.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No appointments available</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Phone</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Date</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Timeslot</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Status</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Doctor</th>
                  <th style={{ padding: 8, border: '1px solid #e6e6e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>{a.patientName}</td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>{a.phone}</td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>{a.date}</td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>{a.timeslot}</td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6', fontWeight: 600, color: a.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>
                      {a.status}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>{a.doctor ? `Dr. ${a.doctor.name} (${a.doctor.specialization})` : '—'}</td>
                    <td style={{ padding: 8, border: '1px solid #e6e6e6' }}>
                      <button onClick={() => deleteAppointment(a.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 4 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
