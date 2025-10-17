import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { AdminIcon } from '../components/icons/AdminIcon';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // This case should be handled by the context provider existing in the tree
    // but as a fallback we can render a message or redirect.
    return <p>Auth context is not available.</p>;
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-lg p-8 mt-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-100 dark:bg-slate-700 rounded-full p-4">
                <AdminIcon className="w-10 h-10 text-brand-accent"/>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Admin Login</h1>
            <p className="text-gray-500 dark:text-slate-400">Access your dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-slate-300"
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
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
           <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-brand-accent hover:text-sky-500 dark:hover:text-sky-300">
                &larr; Back to Home
            </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
