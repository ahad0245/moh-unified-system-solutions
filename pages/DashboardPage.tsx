import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllUsers } from '../services/api';
import type { User } from '../types';
import { MOHLogo } from '../components/icons/MOHLogo';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { SearchIcon } from '../components/icons/SearchIcon';

const StatusPill: React.FC<{ status: User['status'] }> = ({ status }) => {
    const statusStyles = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
    };
    const statusDotStyles = {
        approved: 'bg-green-500',
        pending: 'bg-yellow-500',
        rejected: 'bg-red-500',
    }

    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full inline-flex items-center gap-2 ${statusStyles[status]}`}>
             <span className={`h-2 w-2 rounded-full ${statusDotStyles[status]}`}></span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const DashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (authContext?.token) {
        try {
          setLoading(true);
          const data = await getAllUsers(authContext.token);
          setUsers(data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch user data.');
          if (err instanceof Error && err.message.includes('401')) {
             authContext.logout();
             navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchUsers();
  }, [authContext?.token, authContext, navigate]);

  const handleLogout = () => {
    authContext?.logout();
    navigate('/login');
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-800 text-white flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <MOHLogo className="h-10 w-10 text-brand-accent" />
          <h1 className="text-2xl font-bold">MOH</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Reference or Name"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {filteredUsers.map(user => (
              <li key={user._id}>
                <a href="#" className="block p-2 rounded-md hover:bg-gray-700 truncate text-sm" title={user.patientName}>
                  {user.patientName}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          <LogoutIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">What can I help with?</h2>
        
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
             <h3 className="text-xl font-semibold">Users List</h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="p-6 text-center">Loading users...</p>
            ) : error ? (
              <p className="p-6 text-center text-red-500">{error}</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">Reference Number</th>
                    <th className="p-4 font-semibold text-sm text-gray-600">Patient Name</th>
                    <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 whitespace-nowrap text-sm">{user.referenceNumber}</td>
                      <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.patientName}</td>
                      <td className="p-4 whitespace-nowrap text-sm"><StatusPill status={user.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filteredUsers.length === 0 && !loading && (
              <p className="text-center p-6 text-gray-500">No users found.</p>
            )}
          </div>
        </div>

        <button className="fixed bottom-10 right-10 bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105">
            To add a new request, click here
        </button>
      </main>
    </div>
  );
};

export default DashboardPage;
