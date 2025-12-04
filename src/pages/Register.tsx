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
    role: 'Customer',
    shop_name: '',
    specialty_element_id: '',
    contact_info: ''
  });
  const [elements, setElements] = useState<Element[]>([]);
  const [error, setError] = useState('');
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
    
    try {
      let dataToSend: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      if (formData.role === 'Specialist') {
        dataToSend.shop_name = formData.shop_name;
        dataToSend.specialty_element_id = formData.specialty_element_id;
        dataToSend.contact_info = formData.contact_info;
      }
      
      const response = await authAPI.register(dataToSend);
      if (response.data.message === 'User registered successfully') {
        navigate('/login');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-one') {
      if (name === 'role' && value === 'Customer') {
        setFormData({
          ...formData,
          [name]: value as 'Customer' | 'Specialist',
          shop_name: '',
          specialty_element_id: '',
          contact_info: ''
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center mb-6">
            Create Account
          </h2>
          
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Username</legend>
              <input
                name="username"
                className="input input-bordered w-full"
                placeholder="Choose a username"
                required
                value={formData.username}
                onChange={handleChange}
              />
              <p className="label-text-alt">Required</p>
            </fieldset>
            
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <p className="label-text-alt">Required</p>
            </fieldset>
            
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                name="password"
                type="password"
                className="input input-bordered w-full"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
              <p className="label-text-alt">Minimum 6 characters</p>
            </fieldset>
            
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Account Type</legend>
              <select
                name="role"
                className="select select-bordered w-full"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Customer">Customer</option>
                <option value="Specialist">Specialist</option>
              </select>
              <p className="label-text-alt">Choose your role</p>
            </fieldset>
            
            {formData.role === 'Specialist' && (
              <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-base-200/50">
                <h3 className="text-lg font-bold">Specialist Information</h3>
                
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Shop Name</legend>
                  <input
                    name="shop_name"
                    className="input input-bordered w-full"
                    placeholder="Your shop name"
                    required
                    value={formData.shop_name || ''}
                    onChange={handleChange}
                  />
                  <p className="label-text-alt">Required for specialists</p>
                </fieldset>
                
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Specialty Element</legend>
                  <select
                    name="specialty_element_id"
                    className="select select-bordered w-full"
                    value={formData.specialty_element_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">Choose your specialty</option>
                    {elements.map(element => (
                      <option key={element.element_id} value={element.element_id}>
                        {element.element_name}
                      </option>
                    ))}
                  </select>
                  <p className="label-text-alt">Required for specialists</p>
                </fieldset>
                
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Contact Information</legend>
                  <input
                    name="contact_info"
                    className="input input-bordered w-full"
                    placeholder="Optional contact details"
                    value={formData.contact_info || ''}
                    onChange={handleChange}
                  />
                  <p className="label-text-alt">Optional</p>
                </fieldset>
              </div>
            )}
            
            <div className="card-actions justify-center mt-6">
              <button type="submit" className="btn btn-success w-full">
                Create Account
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
            </div>
          </form>
          
          <div className="divider">OR</div>
          
          <div className="text-center">
            <p className="mb-2">Already have an account?</p>
            <Link to="/login" className="link link-info">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}