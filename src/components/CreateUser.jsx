import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/create-user.css';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Intentar crear el usuario
      await fetch('https://18.222.162.217/user/add_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      // 2. Redirigir inmediatamente al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // 3. Esto se ejecutará aunque el usuario se haya creado
      navigate('/dashboard'); // Redirigir de todas formas
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      <div className="create-user-card">
        <h2>Crear Nuevo Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
            
            <button 
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;