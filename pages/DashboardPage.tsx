import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// === Types mirroring the HTML data model ===
export type UserRecord = {
  reference_number: string;
  patient_name?: string;
  passport_no?: string;
  status: 'approved' | 'pending' | 'rejected' | string;
  phone_number?: string;
  primary_doctor?: string;
  email_address?: string;
  country?: string;
  rejectReason?: string;
  authorization_letter?: string;
  medical_doc?: string;
};

const TOKEN_KEY = 'authToken';
const EXP_KEY = 'authTokenExpiry';

// --- Utilities replicated from the HTML ---
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXP_KEY);
}
function decodeJwtExp(token: string | null) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && typeof payload.exp === 'number') return payload.exp * 1000;
  } catch {}
  return null;
}
function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  const stored = localStorage.getItem(EXP_KEY);
  let exp = stored ? Number(stored) : decodeJwtExp(token);
  if (!exp) return true;
  return Date.now() < exp;
}

// Clean the possibly messy file URL coming from API (kept identical to HTML logic)
function cleanFileUrl(rawUrl?: string | null): string | null {
  const urlMatch = rawUrl?.match(/https?:\/\/[^\s]+/);
  return urlMatch ? encodeURI(urlMatch[0]) : null;
}

// === Component ===
const DashboardPage: React.FC = () => {
  // Theme (light/dark) state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Auth/session
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [authGuardTriggered, setAuthGuardTriggered] = useState(false);

  // Data
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const [filtered, setFiltered] = useState<UserRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [query, setQuery] = useState<string>('');

  // Previews
  const [authPreviewUrl, setAuthPreviewUrl] = useState<string | null>(null);
  const [authPreviewName, setAuthPreviewName] = useState<string>('');
  const [medicalPreviewUrl, setMedicalPreviewUrl] = useState<string | null>(null);
  const [medicalPreviewName, setMedicalPreviewName] = useState<string>('');

  const authUploadRef = useRef<HTMLInputElement | null>(null);
  const medUploadRef = useRef<HTMLInputElement | null>(null);

  // Inject Bootstrap + Icons like the HTML did (safe to keep if your app already includes them; they'll be de-duped by id)
  useEffect(() => {
    const ensureLink = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    };
    const ensureScript = (id: string, src: string) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    ensureLink(
      'bootstrap-icons-css',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css'
    );
    ensureLink('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
    // Needed for offcanvas/modal behaviors
    ensureScript('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js');
  }, []);

  // Apply CSS variables/styles exactly like the HTML (scoped to this component via a wrapper class)
  const styleBlock = `
    :root {
      --bg-light: #ffffff;
      --text-light: #212529;
      --sidebar-light: #f8f9fa;
      --card-bg-light: #ffffff;
      --border-light: #dee2e6;
      --table-stripe-light: rgba(0, 0, 0, 0.05);

      --bg-dark: #1a202c;
      --text-dark: #e2e8f0;
      --sidebar-dark: #2d3748;
      --card-bg-dark: #2d3748;
      --border-dark: #4a5568;
      --table-stripe-dark: rgba(255, 255, 255, 0.05);
    }
    .moh-root { background-color: var(--bg-light); color: var(--text-light); transition: background-color .3s,color .3s; }
    .moh-root.dark-mode { background-color: var(--bg-dark); color: var(--text-dark); }
    .moh-root .main-content { margin-left: 250px; }
    .moh-root .sidebar { width: 250px; background-color: var(--sidebar-light); position: fixed; top:0; left:0; height:100vh; }
    .moh-root.dark-mode .sidebar { background-color: var(--sidebar-dark); }
    .moh-root.dark-mode .text-black { color: var(--text-dark) !important; }

    .moh-root .card, .moh-root .modal-content { background-color: var(--card-bg-light); border-color: var(--border-light); }
    .moh-root.dark-mode .card, .moh-root.dark-mode .modal-content { background-color: var(--card-bg-dark); border-color: var(--border-dark); }

    .moh-root .table { color: var(--text-light); }
    .moh-root.dark-mode .table { color: var(--text-dark); border-color: var(--border-dark); }
    .moh-root .table-striped>tbody>tr:nth-of-type(odd)>* { background-color: var(--table-stripe-light); }
    .moh-root.dark-mode .table-striped>tbody>tr:nth-of-type(odd)>* { background-color:#e3e3e3; }

    .moh-root .form-control { border-color: var(--border-light); }
    .moh-root.dark-mode .form-control { background-color: #4a5568; color: var(--text-dark); border-color: #718096; }
    .moh-root.dark-mode .form-control::placeholder { color: #a0aec0; }
    .moh-root.dark-mode .btn-close { filter: invert(1); }
    .moh-root .offcanvas { background-color: var(--bg-light); }
    .moh-root.dark-mode .offcanvas { background-color: var(--sidebar-dark); }

    @media (max-width: 768px){ .moh-root .sidebar{ position:static;width:100%; } .moh-root .main-content{ margin-left:0; }}
    .moh-root .search-wrapper { position: relative; }
    .moh-root .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; z-index: 1; }
    .moh-root #search-bar { padding-left: 40px; }
    .moh-root .active-item { background-color: #1a8754 !important; color: #fff !important; }
  `;

  // Apply theme to body class (for global effects like modal backdrops) AND to local root wrapper
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const themeIconClass = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';

  // Typewriter effect
  useEffect(() => {
    const text = 'What can I help with?';
    const el = document.getElementById('typewriter');
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const id = window.setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
      } else {
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Auth guard on mount
  useEffect(() => {
    if (!isTokenValid()) {
      // Mimic HTML: hard redirect to login
      clearAuth();
      window.location.replace('/#/login');
    }
  }, []);

  // Fetch helper mirrors HTML's fetchWithAuth
  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', 'Bearer ' + token);
    const finalOptions: RequestInit = { ...options, headers };
    try {
      const resp = await fetch(url, finalOptions);
      if ([401, 402, 403].includes(resp.status)) {
        if (!authGuardTriggered) {
          setAuthGuardTriggered(true);
          setSessionModalOpen(true);
        }
        throw new Error('Auth error: ' + resp.status);
      }
      const data = await resp.json();
      return { ok: resp.ok, status: resp.status, data } as { ok: boolean; status: number; data: any };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('fetchWithAuth error:', err);
      throw err;
    }
  }, [authGuardTriggered]);

  const fetchUsersSecure = useCallback(async (): Promise<UserRecord[]> => {
    try {
      const response = await fetchWithAuth('https://medical-permits.vercel.app/getAllUsersData');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.users)) return data.users;
      return [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch users:', error);
      return [];
    }
  }, [fetchWithAuth]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await fetchUsersSecure();
      setAllUsers(users);
      setFiltered(users);
      setSelectedUser(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchUsersSecure]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search logic like the HTML (ref no. or patient name)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    const next = allUsers.filter((u) =>
      String(u.reference_number).toLowerCase().includes(q) || String(u.patient_name || '').toLowerCase().includes(q)
    );
    setFiltered(next);
  }, [query, allUsers]);

  // When a user is selected, initialize file previews from their URLs
  useEffect(() => {
    if (!selectedUser) return;
    const authorizationLetter = cleanFileUrl(selectedUser.authorization_letter);
    const medicalDoc = cleanFileUrl(selectedUser.medical_doc);
    setAuthPreviewUrl(authorizationLetter);
    setAuthPreviewName(authorizationLetter ? authorizationLetter.split('/').pop() || '' : '');
    setMedicalPreviewUrl(medicalDoc);
    setMedicalPreviewName(medicalDoc ? medicalDoc.split('/').pop() || '' : '');
  }, [selectedUser]);

  // Status helpers
  const statusBadgeClass = (status: UserRecord['status']) => {
    if (status === 'rejected') return 'bg-danger';
    if (status === 'pending') return 'bg-warning';
    return 'bg-success'; // approved or anything else
  };

  const onClickLogout = () => {
    clearAuth();
    window.location.replace('/#/login');
  };

  const onApprove = async (u: UserRecord) => {
    await statusUpdate(u, 'approved');
  };
  const onPending = async (u: UserRecord) => {
    await statusUpdate(u, 'pending');
  };
  const onReject = async (u: UserRecord) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (reason) await statusUpdate(u, 'rejected', reason);
  };

  async function statusUpdate(user: UserRecord, status: 'approved' | 'pending' | 'rejected', reason?: string) {
    const payload: any = { status };
    if (reason) payload.rejectReason = reason;
    try {
      const res = await fetchWithAuth(`https://medical-permits.vercel.app/update/${user.reference_number}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert(`Status updated to ${status}!`);
        await loadData();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Status update error:', e);
    }
  }

  // Form submit (PUT with FormData) like the HTML
  const onSubmitDetails: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    // API expects referenceNumber
    fd.append('referenceNumber', selectedUser.reference_number);
    const authFile = authUploadRef.current?.files?.[0];
    const medFile = medUploadRef.current?.files?.[0];
    if (authFile) fd.append('authorization_letter', authFile);
    if (medFile) fd.append('medical_doc', medFile);

    try {
      const res = await fetchWithAuth(
        `https://medical-permits.vercel.app/updateData/${selectedUser.reference_number}`,
        { method: 'PUT', body: fd }
      );
      if (res.ok) {
        alert('Data updated!');
        await loadData();
      } else {
        alert('Update failed.');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Update error:', err);
      if (!authGuardTriggered) alert('An error occurred.');
    }
  };

  // Derived UI pieces
  const UsersTable = useMemo(() => (
    <div className="container my-5" style={{ display: 'flex', flexDirection: 'column', padding: 10, borderRadius: 10 }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Users List</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#007438', color: 'white' }}>
            <tr>
              <th style={{ padding: 12, fontWeight: 'bold' }}>Reference Number</th>
              <th style={{ padding: 12, fontWeight: 'bold' }}>Patient Name</th>
              <th style={{ padding: 12, fontWeight: 'bold' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.reference_number}>
                <td style={{ padding: 12 }}>{u.reference_number}</td>
                <td style={{ padding: 12 }}>{u.patient_name}</td>
                <td style={{ padding: 12 }}>{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ), [filtered]);

  const DetailsView = useMemo(() => {
    if (!selectedUser) return null;
    return (
      <div className="container my-5" style={{ display: 'flex', flexDirection: 'column', padding: 10, borderRadius: 10 }}>
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white"><h3 className="mb-0">Edit User Details</h3></div>
          <div className="card-body">
            <form id="userDetailsForm" onSubmit={onSubmitDetails}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Reference Number:</strong></label>
                  <input type="text" className="form-control" value={selectedUser.reference_number} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Status:</strong></label>
                  <input type="text" className="form-control" value={selectedUser.status} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Patient Name:</strong></label>
                  <input name="patientName" type="text" className="form-control" defaultValue={selectedUser.patient_name || 'N/A'} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>ID Number:</strong></label>
                  <input type="text" className="form-control" value={selectedUser.passport_no || ''} readOnly />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Phone Number:</strong></label>
                  <input name="phoneNumber" type="text" className="form-control" defaultValue={selectedUser.phone_number || 'N/A'} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Primary Doctor:</strong></label>
                  <input name="primaryDoctor" type="text" className="form-control" defaultValue={selectedUser.primary_doctor || 'N/A'} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>E-mail Address:</strong></label>
                  <input name="emailAddress" type="email" className="form-control" defaultValue={selectedUser.email_address || 'N/A'} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Country:</strong></label>
                  <input name="country" type="text" className="form-control" defaultValue={selectedUser.country || 'N/A'} />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label"><strong>Reject Reason:</strong></label>
                  <textarea name="rejectReason" className="form-control" rows={2} defaultValue={selectedUser.rejectReason || ''} />
                </div>
              </div>
              <hr />

              <div className="d-flex justify-content-between flex-column flex-md-row gap-3">
                <div className="col-md-6 me-md-3">
                  <p><strong>Authorization Letter:</strong></p>
                  <div className="file-preview" style={{ width: '100%', height: 200, border: '1px dashed #ddd', borderRadius: 5, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {authPreviewUrl ? (
                      String(authPreviewUrl).toLowerCase().endsWith('.pdf') ? (
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                          <img src="https://icon-library.com/images/doc-icon/doc-icon-4.jpg" alt="PDF Icon" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                        </div>
                      ) : (
                        <img src={authPreviewUrl} alt="Authorization" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <span className="text-muted">Missing</span>
                    )}
                  </div>
                  <a
                    href={authPreviewUrl || '#'}
                    className="btn btn-outline-primary btn-sm w-100 mt-2"
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!authPreviewUrl}
                    style={!authPreviewUrl ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
                    download={authPreviewName || undefined}
                  >
                    Download
                  </a>
                  <input ref={authUploadRef} type="file" className="d-none" accept=".pdf,.png,.jpeg,.jpg" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setAuthPreviewUrl(URL.createObjectURL(f));
                    setAuthPreviewName(f.name);
                  }} />
                  <button type="button" className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={() => authUploadRef.current?.click()}>
                    Upload
                  </button>
                </div>

                <div className="col-md-6">
                  <p><strong>Medical Document:</strong></p>
                  <div className="file-preview" style={{ width: '100%', height: 200, border: '1px dashed #ddd', borderRadius: 5, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {medicalPreviewUrl ? (
                      String(medicalPreviewUrl).toLowerCase().endsWith('.pdf') ? (
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                          <img src="https://icon-library.com/images/doc-icon/doc-icon-4.jpg" alt="PDF Icon" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                        </div>
                      ) : (
                        <img src={medicalPreviewUrl} alt="Medical" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <span className="text-muted">Missing</span>
                    )}
                  </div>
                  <a
                    href={medicalPreviewUrl || '#'}
                    className="btn btn-outline-primary btn-sm w-100 mt-2"
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!medicalPreviewUrl}
                    style={!medicalPreviewUrl ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
                    download={medicalPreviewName || undefined}
                  >
                    Download
                  </a>
                  <input ref={medUploadRef} type="file" className="d-none" accept=".pdf,.png,.jpeg,.jpg" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setMedicalPreviewUrl(URL.createObjectURL(f));
                    setMedicalPreviewName(f.name);
                  }} />
                  <button type="button" className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={() => medUploadRef.current?.click()}>
                    Upload
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-success">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => { setSelectedUser(null); setQuery(''); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-success btn-sm" onClick={() => onApprove(selectedUser)}>Approve</button>
          <button className="btn btn-danger btn-sm" onClick={() => onReject(selectedUser)}>Reject</button>
          <button className="btn btn-warning btn-sm" onClick={() => onPending(selectedUser)}>Pending</button>
        </div>
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, authPreviewUrl, authPreviewName, medicalPreviewUrl, medicalPreviewName]);

  return (
    <div className={`moh-root ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <style>{styleBlock}</style>

      {/* Session Expired Modal (controlled) */}
      {sessionModalOpen && (
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-labelledby="sessionExpiredLabel" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title" id="sessionExpiredLabel">Session expired</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
                  setSessionModalOpen(false);
                  clearAuth();
                  window.location.replace('/#/login');
                }} />
              </div>
              <div className="modal-body">Your session has expired. Please log in again.</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => {
                  clearAuth();
                  window.location.replace('/#/login');
                }}>Go to Login</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar d-none d-md-flex flex-column p-3 max-vh-100" style={{ overflowY: 'auto', scrollbarWidth: 'none' as any, msOverflowStyle: 'none' as any, zIndex: 1050 }}>
          <div style={{ color: '#007438', maxWidth: '80%', margin: '0 auto 20px auto', display: 'block' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="img-fluid">
              <path d="M12 2L1 9l4 1.5V15h2V10.5l5 2.5 5-2.5V15h2V10.5L23 9l-11-7zm0 10.5L6.5 9.5l5.5-2.5 5.5 2.5L12 12.5zM3 17v2h18v-2H3z" />
            </svg>
          </div>
          <img style={{ width: 120, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} src="./components/img/logo.png" alt="" />
          <h2
            id="dashboard-title"
            className="text-center text-black"
            style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => { setSelectedUser(null); setQuery(''); setFiltered(allUsers); }}
          >
            Dashboard
          </h2>

          <div className="search-wrapper mb-3">
            <i className="bi bi-search search-icon" />
            <input
              type="text"
              id="search-bar"
              className="form-control"
              placeholder="Search by Reference or Name"
              style={{ fontSize: 14 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className="nav flex-column flex-grow-1" id="data-list" style={{ fontSize: 12 }}>
            {filtered.map((u) => {
              const isActive = selectedUser?.reference_number === u.reference_number;
              const displayRight = (u.patient_name && u.patient_name.trim()) ? u.patient_name : u.passport_no;
              return (
                <li
                  key={u.reference_number}
                  className={`list-group-item d-flex justify-content-between align-items-center ${isActive ? 'active-item' : ''}`}
                  style={{ border: 'none', backgroundColor: 'transparent', marginBottom: 20, cursor: 'pointer' }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'); }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget.style.backgroundColor = 'transparent'); }}
                  onClick={() => setSelectedUser(u)}
                >
                  <span>{u.reference_number} - {displayRight}</span>
                  <span className={`badge rounded-circle ${statusBadgeClass(u.status)}`} style={{ width: 10, height: 10 }}>&nbsp;</span>
                </li>
              );
            })}
          </ul>

          <button id="theme-toggle" className="btn btn-outline-secondary mt-3 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={toggleTheme}>
            <i className={themeIconClass} />
            <span>Toggle Theme</span>
          </button>

          <button id="logoutButton" className="btn btn-danger d-flex align-items-center justify-content-center gap-2" onClick={onClickLogout}>
            <i className="bi bi-box-arrow-right" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile burger for offcanvas (optional; content not mirrored to keep single source of truth) */}
        <button
          className="btn d-md-none m-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasSidebar"
          aria-controls="offcanvasSidebar"
          style={{ width: 50, height: 50, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, zIndex: 1050, position: 'relative', backgroundColor: 'white' }}
        >
          <i className="bi bi-list" style={{ fontSize: 25 }} />
        </button>

        <div className="offcanvas offcanvas-start text-dark" tabIndex={-1} id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
          {/* (Optional) mirror sidebar content here for mobile if you want the exact offcanvas experience */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Dashboard</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>
          <div className="offcanvas-body">
            <div className="search-wrapper mb-3">
              <i className="bi bi-search search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search by Reference or Name"
                style={{ fontSize: 14 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <ul className="nav flex-column" style={{ fontSize: 12 }}>
              {filtered.map((u) => (
                <li key={`m-${u.reference_number}`} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', backgroundColor: 'transparent', marginBottom: 12 }} onClick={() => setSelectedUser(u)}>
                  <span>{u.reference_number} - {(u.patient_name && u.patient_name.trim()) ? u.patient_name : u.passport_no}</span>
                  <span className={`badge rounded-circle ${statusBadgeClass(u.status)}`} style={{ width: 10, height: 10 }}>&nbsp;</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-outline-secondary mt-3 d-flex align-items-center justify-content-center gap-2 w-100" onClick={toggleTheme}>
              <i className={themeIconClass} />
              <span>Toggle Theme</span>
            </button>
            <button className="btn btn-danger mt-2 w-100 d-flex align-items-center justify-content-center gap-2" onClick={onClickLogout}>
              <i className="bi bi-box-arrow-right" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow-1 overflow-auto p-4 d-flex align-items-center justify-content-center flex-column min-vh-100 main-content">

          <div className="input-container d-flex flex-column align-items-center" style={{ maxWidth: 1200, width: '100%' }}>
            <h3 className="text-center mb-4" id="typewriter" />
            {/* Either Users table or User details */}
            {selectedUser ? DetailsView : UsersTable}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
