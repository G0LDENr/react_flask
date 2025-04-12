import React, { useState } from 'react';
 import '../css/login.css'; // Asegúrate que la ruta sea correcta
 
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
       const response = await fetch('https://127.0.0.1:5000/user/login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email, password }),
       });
 
       const data = await response.json();
 
       if (response.ok) {
         localStorage.setItem('token', data.access_token);
         localStorage.setItem('user', JSON.stringify(data.user));
         window.location.href = '/dashboard';
       } else {
         setError(data.msg || 'Credenciales incorrectas');
       }
     } catch (err) {
       setError('Error de conexión con el servidor');
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
           />
         </div>
         <br />
         <button 
           type="submit" 
           className="login-button"
           disabled={loading}
         >
           {loading ? 'Cargando...' : 'Ingresar'}
         </button>
       </form>
     </div>
   );
 };
 
 export default Login;