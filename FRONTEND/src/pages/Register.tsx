import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Element } from '../types';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role: 'Customer' | 'Specialist';
  shop_name?: string;
  specialty_element_id?: string;
  contact_info?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    role: 'Customer'
  });
  const [elements, setElements] = useState<Element[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadElements();
  }, []);

  const loadElements = async () => {
    try {
      const response = await authAPI.getElements();
      setElements(response.data);
    } catch (error) {
      console.error('Failed to load elements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'Specialist' && {
          shop_name: formData.shop_name,
          specialty_element_id: formData.specialty_element_id,
          contact_info: formData.contact_info
        })
      };
      
      const response = await authAPI.register(dataToSend);
      if (response.data.message === 'User registered successfully') {
        navigate('/login', { state: { success: 'Account created successfully!' } });
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'role' && value === 'Customer') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        shop_name: '',
        specialty_element_id: '',
        contact_info: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const roleBenefits = {
    Customer: ['Browse magical scrolls', 'Purchase for your collection', 'Track order history'],
    Specialist: ['Craft and sell scrolls', 'Manage your inventory', 'Set your prices']
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6" data-theme="luxury">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Join Magic Scrolls Shop
            </h1>
            <p className="text-base-content/70">Begin your magical journey</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">Account Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    className="input input-bordered input-primary w-full"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="input input-bordered input-primary w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  className="input input-bordered input-primary w-full"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Select Your Role</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {(['Customer', 'Specialist'] as const).map((role) => (
                  <div
                    key={role}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.role === role
                        ? 'border-primary bg-primary/5'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        role,
                        ...(role === 'Customer' && {
                          shop_name: '',
                          specialty_element_id: '',
                          contact_info: ''
                        })
                      }));
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${
                        formData.role === role ? 'bg-primary' : 'bg-base-300'
                      }`}></div>
                      <span className="font-semibold">{role}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-base-content/70">
                      {roleBenefits[role].map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Fields */}
            {formData.role === 'Specialist' && (
              <div className="space-y-6 pt-6 border-t border-base-300">
                <h2 className="text-xl font-semibold text-primary">Specialist Details</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Shop Name</span>
                  </label>
                  <input
                    type="text"
                    name="shop_name"
                    placeholder="Your shop name"
                    className="input input-bordered input-primary w-full"
                    value={formData.shop_name || ''}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Specialty Element</span>
                  </label>
                  <select
                    name="specialty_element_id"
                    className="select select-bordered select-primary w-full"
                    value={formData.specialty_element_id || ''}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select element</option>
                    {elements.map(element => (
                      <option key={element.element_id} value={element.element_id}>
                        {element.element_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Contact Information</span>
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    placeholder="How can we contact you?"
                    className="input input-bordered input-primary w-full"
                    value={formData.contact_info || ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control pt-6">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-base-300 text-center">
            <p className="text-base-content/70">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}