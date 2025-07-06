import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [number, setNumber] = useState("");
  const [takenNumbers, setTakenNumbers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/numbers`).then((res) => {
      setTakenNumbers(res.data.map((n) => n.number));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (takenNumbers.includes(parseInt(number))) {
      alert("Ese número ya está reservado.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reserve`, {
        name,
        surname,
        phone,
        number,
      });
      alert("¡Te has registrado correctamente!");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al reservar el número");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Sorteo a beneficio del Tío Ramón Araujo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Apellido"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Teléfono con prefijo internacional (ej: +34600000000)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Número a elegir (1-200)"
          type="number"
          min="1"
          max="200"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Participar</button>
      </form>
      <h2 className="mt-6 text-xl font-semibold">Números ya elegidos:</h2>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {takenNumbers.map((n) => (
          <span key={n} className="bg-gray-200 p-2 rounded text-center">{n}</span>
        ))}
      </div>
    </div>
  );
}

export default App;
