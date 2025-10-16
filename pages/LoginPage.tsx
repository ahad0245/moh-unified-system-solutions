import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { MOHLogo } from '../components/icons/MOHLogo';
import Header from '@/components/Header';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!authContext) {
      setError("Authentication context is not available.");
      setLoading(false);
      return;
    }

    try {
      const { token } = await apiLogin(email, password);
      authContext.login(token);
      // Redirect to the new vanilla JS dashboard page
      window.location.assign('dashboard.html');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-brand-secondary rounded-xl shadow-lg">
        <div className="text-center">
            <MOHLogo className="h-16 w-16 text-brand-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Sign In</h2>
            <p className="text-gray-500 dark:text-slate-400">Access your MOH dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="admin@moh.gov"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-white dark:focus:ring-offset-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;