import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ramana from '../images/p3.jpeg';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import apiService from '../../../apiService';
const SuperAdminLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const SAid = Cookies.get('SAid');
    const verified = Cookies.get('verified');

    if (SAid && verified === 'true') {
      navigate('/SA_dash');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username' && !value) {
      setErrors({ ...errors, username: 'Username is required' });
    } else if (name === 'password' && !value) {
      setErrors({ ...errors, password: 'Password is required' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async () => {
    if (formData.username && formData.password) {
      try {
        const response = await apiService.post('/SAlogin', {
          username: formData.username,
          password: formData.password
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
  
        console.log(response);
        toast.success('Logged in successfully!', { autoClose: 5000 });
  
        const expiresInThirtyDays = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });
        
        // Set new cookies
        Cookies.set('role', 'SA', {expires:expiresInThirtyDays});
        Cookies.set('verified', true, { expires: expiresInThirtyDays });
        Cookies.set('name', response.data.name, { expires: expiresInThirtyDays });
        Cookies.set('SAid', response.data.SAid, { expires: expiresInThirtyDays });
        
  
        navigate('/SA_dash');
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        toast.error('Invalid credentials', { autoClose: 5000 });
      }
    } else {
      setErrors({
        username: !formData.username ? 'Username is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
    }
  };
  
  

  return (
    <div className='login'>
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '85vh' }}>
      <img  alt='logo' className='rounded mb-3' src={ramana} style={{ width: '200px', height: 'auto' }} />

        <div className="border rounded shadow p-3 d-flex flex-column align-items-center bg-white" style={{ width: '100%', maxWidth: '500px' }}>
          <h4 className='fw-bold mb-4 mt-2 text-nowrap' style={{ fontFamily: 'monospace' }}>
            SuperAdmin Login <i className="fa-solid fa-right-to-bracket"></i>
          </h4>

          <TextField
            label="Username"
            variant="outlined"
            className="w-100 mb-3"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={Boolean(errors.username)}
            helperText={errors.username}
            InputLabelProps={{ className: 'fw-bold text-secondary' }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            className="w-100 mb-3"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputLabelProps={{ className: 'fw-bold text-secondary' }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className='w-50'
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
