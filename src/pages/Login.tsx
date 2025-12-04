import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      if (response.data.message === 'Login successful') {
        const role = response.data.user.role;
        navigate(`/${role.toLowerCase()}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            required
            className="w-full p-2 border rounded"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <div className="text-center">
          <Link to="/register" className="text-blue-600 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}