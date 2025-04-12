import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import addButtonImg from '../img/mas_flask.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Usamos navigate en lugar de window.location
      return;
    }

    const fetchData = async () => {
      try {
        // Obtener usuario actual
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);

        // Obtener lista de usuarios
        const response = await fetch('http://127.0.0.1:5000/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Añadimos navigate como dependencia

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Bienvenido, <span>{userData?.name}</span></h1>
          <p>{userData?.email}</p>
        </div>
        <button 
          className="logout-btn" 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      <section className="users-section">
        <div className="section-header">
          <h2>Listado de Usuarios</h2>
          <img 
            src={addButtonImg} 
            alt="Agregar usuario" 
            className="add-user-button"
            onClick={() => navigate('/create-user')}
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;