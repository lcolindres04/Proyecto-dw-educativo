import React, { useState, useEffect } from 'react';

const API_URL = "https://backend-educativo-dw.onrender.com"

function App() {
  const [estudiante, setEstudiante] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [actividades, setActividades] = useState([]);
  const [actividadActual, setActividadActual] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [modoDocente, setModoDocente] = useState(false);

  const [pregunta, setPregunta] = useState({});
  const [puntaje, setPuntaje] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const [memoryCards, setMemoryCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/actividades`)
      .then(res => res.json())
      .then(data => setActividades(data))
      .catch(err => console.error(err));
  }, []);

  const registrarEstudiante = (e) => {
    e.preventDefault();
    if (!nombre || !edad) return;
    fetch(`${API_URL}/estudiantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, edad: parseInt(edad) })
    })
      .then(res => res.json())
      .then(data => setEstudiante(data))
      .catch(err => console.error(err));
  };

  const iniciarJuego = (act) => {
    setActividadActual(act);
    setPuntaje(0);
    setFeedback(null);
    generarPregunta(act.id);
  };

  const generarPregunta = (id) => {
    setFeedback(null);
    if (id === 1) {
      setPregunta({
        text: '¿El pez vive ______ del agua?',
        opciones: ['Adentro 🌊', 'Afuera 🏜️'],
        correcta: 'Adentro 🌊',
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80'
      });
    } else if (id === 2) {
      setPregunta({
        text: 'El sol está ______ en el cielo',
        opciones: ['Arriba ☀️', 'Abajo ⬇️'],
        correcta: 'Arriba ☀️',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
      });
    } else if (id === 3) {
      setPregunta({
        text: 'Si el perrito está a tu lado, está ______',
        opciones: ['Cerca 🐶', 'Lejos 🏔️'],
        correcta: 'Cerca 🐶',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
      });
    } else if (id === 4) {
      setPregunta({
        text: 'El sombrero se coloca ______ de la cabeza',
        opciones: ['Encima 🎩', 'Debajo 👟'],
        correcta: 'Encima 🎩',
        image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80'
      });
    } else if (id === 5) {
      const figuras = ['Círculo 🔴', 'Cuadrado 🟦', 'Triángulo 🔺', 'Rectángulo 🟢'];
      const pick = figuras[Math.floor(Math.random() * figuras.length)];
      setPregunta({
        text: `Selecciona la figura solicitada: ${pick}`,
        opciones: figuras,
        correcta: pick,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
      });
    } else if (id === 6) {
      const items = ['🐶', '🐱', '🐭', '🐹', '🐶', '🐱', '🐭', '🐹'];
      setMemoryCards(items.sort(() => Math.random() - 0.5));
      setFlipped([]);
      setMatched([]);
    } else if (id === 7) {
      const n1 = Math.floor(Math.random() * 9) + 1;
      const n2 = Math.floor(Math.random() * 9) + 1;
      const ans = n1 * n2;
      const ops = [ans, ans + 2, ans - 1, ans + 5].sort(() => Math.random() - 0.5);
      setPregunta({ text: `¿Cuánto es ${n1} x ${n2}?`, opciones: ops, correcta: ans });
    } else if (id === 8) {
      setPregunta({ text: '¿Cuánto es 1/4 + 2/4?', opciones: ['3/4', '2/8', '3/8', '1/2'], correcta: '3/4' });
    } else if (id === 9) {
      const val1 = (Math.random() * 5).toFixed(1);
      const val2 = 2;
      const ans = (parseFloat(val1) * val2).toFixed(1);
      setPregunta({ text: `¿Cuánto es ${val1} x ${val2}?`, opciones: [ans, (parseFloat(ans) + 1.1).toFixed(1), (parseFloat(ans) - 0.5).toFixed(1)], correcta: ans });
    }
  };

  const responder = (op) => {
    if (op.toString() === pregunta.correcta.toString()) {
      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);
      setFeedback({ type: 'success', text: '¡Excelente! Respuesta Correcta 🎉⭐' });
      guardarProgreso(nuevoPuntaje);
    } else {
      setFeedback({ type: 'error', text: '¡Inténtalo de nuevo! ❌' });
    }
  };

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatched(prev => {
          const next = [...prev, ...newFlipped];
          if (next.length === memoryCards.length) {
            const nuevoPuntaje = puntaje + 50;
            setPuntaje(nuevoPuntaje);
            setFeedback({ type: 'success', text: '¡Completaste la memoria! 🎉' });
            guardarProgreso(nuevoPuntaje);
          }
          return next;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const guardarProgreso = (pts) => {
    fetch(`${API_URL}/progresos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estudiante_id: estudiante.id,
        actividad_id: actividadActual.id,
        puntaje: pts
      })
    }).catch(err => console.error(err));
  };

  const cargarDocente = () => {
    setModoDocente(true);
    fetch(`${API_URL}/estudiantes`).then(res => res.json()).then(data => setEstudiantesList(data));
    cargarReportes('');
  };

  const cargarReportes = (id) => {
    const url = id ? `${API_URL}/progresos?estudiante_id=${id}` : `${API_URL}/progresos`;
    fetch(url).then(res => res.json()).then(data => setReportes(data));
  };

  return (
    <div className="app-container">
      <header>
        <h1>🎮 Portal Educativo EduKids 📚</h1>
        <p>Aprende Jugando: Matemáticas, Lógica y Memoria</p>
        <div className="hero-media">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" alt="Niños estudiando" className="hero-img" />
          <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80" alt="Educación Infantil" className="hero-img" />
        </div>
      </header>

      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <button className="btn-secondary" onClick={() => { setModoDocente(!modoDocente); if(!modoDocente) cargarDocente(); }}>
          {modoDocente ? '🎮 Volver a Juegos' : '👩‍🏫 Tablero de Docentes'}
        </button>
      </div>

      {modoDocente ? (
        <div className="card">
          <h2>📊 Reporte de Progreso de Estudiantes</h2>
          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Filtrar por Estudiante:</label>
            <select value={filtroEstudiante} onChange={(e) => { setFiltroEstudiante(e.target.value); cargarReportes(e.target.value); }}>
              <option value="">Todos los estudiantes</option>
              {estudiantesList.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Edad</th>
                <th>Actividad</th>
                <th>Nivel</th>
                <th>Puntaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map(r => (
                <tr key={r.id}>
                  <td>{r.estudiante}</td>
                  <td>{r.edad} años</td>
                  <td>{r.actividad}</td>
                  <td>{r.nivel}</td>
                  <td><strong>{r.puntaje} pts</strong></td>
                  <td>{new Date(r.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !estudiante ? (
        <div className="card">
          <h2>🌟 Registro del Estudiante</h2>
          <form onSubmit={registrarEstudiante}>
            <div className="form-group">
              <label>Nombre del Niño o Niña:</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej. Sofía" />
            </div>
            <div className="form-group">
              <label>Edad:</label>
              <input type="number" value={edad} onChange={e => setEdad(e.target.value)} required min="3" max="12" placeholder="Ej. 6" />
            </div>
            <button type="submit" className="btn-primary">🚀 ¡Comenzar a Jugar!</button>
          </form>
        </div>
      ) : !actividadActual ? (
        <div className="card">
          <h2>¡Hola, {estudiante.nombre}! 👋 Elige tu juego interactivo</h2>
          
          <h3 style={{ marginTop: '20px', color: '#6c5ce7' }}>🎨 Nivel Pre-Primario</h3>
          <div className="grid-2">
            {actividades.filter(a => a.nivel === 'pre_primario').map(act => (
              <button key={act.id} className="btn-primary" onClick={() => iniciarJuego(act)}>{act.titulo}</button>
            ))}
          </div>

          <h3 style={{ marginTop: '25px', color: '#d63031' }}>📐 Nivel Primario</h3>
          <div className="grid-2">
            {actividades.filter(a => a.nivel === 'primario').map(act => (
              <button key={act.id} className="btn-secondary" onClick={() => iniciarJuego(act)}>{act.titulo}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <button onClick={() => setActividadActual(null)} style={{ marginBottom: '15px' }}>⬅️ Volver al menú</button>
          <h2>{actividadActual.titulo}</h2>
          <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Puntaje Acumulado: <strong>{puntaje} pts ⭐</strong></p>

          {pregunta.image && (
            <img src={pregunta.image} alt="Ilustración actividad" className="img-illustration" />
          )}

          {actividadActual.id === 6 ? (
            <div>
              <p style={{ textAlign: 'center', fontSize: '1.2rem', margin: '10px 0' }}>¡Encuentra todas las parejas de animalitos!</p>
              <div className="grid-memory">
                {memoryCards.map((card, idx) => (
                  <div key={idx} className="memory-card" onClick={() => handleCardClick(idx)}>
                    {flipped.includes(idx) || matched.includes(idx) ? card : '❓'}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '20px 0', fontSize: '1.5rem', textAlign: 'center' }}>{pregunta.text}</h3>
              <div className="grid-2">
                {pregunta.opciones && pregunta.opciones.map((op, idx) => (
                  <button key={idx} className="btn-option" onClick={() => responder(op)}>{op}</button>
                ))}
              </div>
            </div>
          )}

          {feedback && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.text}
              {feedback.type === 'success' && actividadActual.id !== 6 && (
                <button style={{ marginLeft: '15px' }} className="btn-primary" onClick={() => generarPregunta(actividadActual.id)}>Siguiente Pregunta ➡️</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
