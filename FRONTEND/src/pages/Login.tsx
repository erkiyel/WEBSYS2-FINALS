import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      if (response.data.message === 'Login successful') {
        const role = response.data.user.role;
        navigate(`/${role.toLowerCase()}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6" data-theme="luxury">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📜</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Magic Scrolls Shop
            </h1>
            <p className="text-base-content/70">Welcome back, adventurer</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-control mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Signing in...' : 'Enter the Shop'}
              </button>
            </div>
          </form>
          
          {/* Divider */}
          <div className="divider my-8">OR</div>
          
          {/* Register Link */}
          <div className="text-center">
            <p className="text-base-content/70 mb-4">New to our magical realm?</p>
            <Link
              to="/register"
              className="btn btn-outline btn-primary w-full"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}