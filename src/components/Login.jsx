import React, { useState } from 'react';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Opción 1: Usar HTTPS (recomendado)
      //const apiUrl = process.env.REACT_APP_API_URL || 'https://18.222.162.217';
      
      // Opción 2: Si necesitas HTTP temporalmente (solo desarrollo)
      const apiUrl = process.env.REACT_APP_API_URL || 'http://18.222.162.217';
      if (window.location.protocol === 'https:' && apiUrl.startsWith('http:')) {
      throw new Error('No se permiten conexiones HTTP desde HTTPS');
      }

      const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.msg || 'Error en la autenticación');
      }

      const data = await response.json();
      
      // Almacenamiento seguro (considera usar HttpOnly cookies en producción)
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirección segura
      window.location.href = '/dashboard';

    } catch (err) {
      setError(err.message === 'Failed to fetch' 
        ? 'Error de conexión con el servidor. Verifica tu conexión a internet.' 
        : err.message || 'Error desconocido');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="login-error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="login-label">Email:</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="login-form-group">
          <label className="login-label">Contraseña:</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Cargando...
            </>
          ) : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;