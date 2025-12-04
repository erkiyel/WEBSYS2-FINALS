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
        // Reset specialist fields when switching to Customer
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
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
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
          />
          <select
            name="role"
            className="w-full p-2 border rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Customer">Customer</option>
            <option value="Specialist">Specialist</option>
          </select>
          
          {formData.role === 'Specialist' && (
            <>
              <input
                name="shop_name"
                placeholder="Shop Name"
                required
                className="w-full p-2 border rounded"
                value={formData.shop_name || ''}
                onChange={handleChange}
              />
              <select
                name="specialty_element_id"
                required
                className="w-full p-2 border rounded"
                value={formData.specialty_element_id || ''}
                onChange={handleChange}
              >
                <option value="">Select Specialty Element</option>
                {elements.map(element => (
                  <option key={element.element_id} value={element.element_id}>
                    {element.element_name}
                  </option>
                ))}
              </select>
              <input
                name="contact_info"
                placeholder="Contact Info"
                className="w-full p-2 border rounded"
                value={formData.contact_info || ''}
                onChange={handleChange}
              />
            </>
          )}
          
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}