import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, BarController } from 'chart.js';

// Registra los componentes necesarios para Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, BarController);

const TaskStats = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Obtener estadísticas desde el backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/task-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const data = response.data;

        // Verifica si los datos tienen información de usuarios
        if (Array.isArray(data)) {
          setStats(data);

          // Prepara los datos para el gráfico
          setChartData({
            labels: data.map((stat) => stat.username || 'Usuario desconocido'),
            datasets: [
              {
                data: data.map((stat) => stat.count || 0),
                backgroundColor: data.map((stat) => stat.color || '#6c757d'), // Usa los colores del usuario
              },
            ],
          });
        } else {
          console.error('El formato de los datos no es el esperado:', data);
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <h2>Estadísticas de Tareas</h2>
      <table
        style={{
          width: '80%',
          margin: '0 auto',
          borderCollapse: 'collapse',
          marginBottom: '20px',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Usuario</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Tareas</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {stat.username || 'Usuario desconocido'} {/* Mostrar nombre del usuario */}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                {stat.count || 0} {/* Mostrar cantidad de tareas completadas */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {chartData ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false, // Oculta la leyenda completamente
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default TaskStats;
