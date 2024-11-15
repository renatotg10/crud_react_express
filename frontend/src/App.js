import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [colaboradores, setColaboradores] = useState([]);
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [idade, setIdade] = useState('');
    const [editId, setEditId] = useState(null);

    const apiUrl = 'http://localhost:5000/colaboradores';

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                setColaboradores(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar colaboradores', error);
            });
    }, []);

    const addColaborador = () => {
        axios.post(apiUrl, { nome, cargo, idade })
            .then(() => {
                setNome('');
                setCargo('');
                setIdade('');
                setEditId(null);
                axios.get(apiUrl).then(response => setColaboradores(response.data));
            })
            .catch(error => console.error('Erro ao adicionar colaborador', error));
    };

    const updateColaborador = () => {
        axios.put(`${apiUrl}/${editId}`, { nome, cargo, idade })
            .then(() => {
                setNome('');
                setCargo('');
                setIdade('');
                setEditId(null);
                axios.get(apiUrl).then(response => setColaboradores(response.data));
            })
            .catch(error => console.error('Erro ao atualizar colaborador', error));
    };

    const deleteColaborador = (id) => {
        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                axios.get(apiUrl).then(response => setColaboradores(response.data));
            })
            .catch(error => console.error('Erro ao deletar colaborador', error));
    };

    return (
        <div className="App">
            <h1>Gestão de Colaboradores</h1>
            <div>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" />
                <input type="text" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade" />
                {editId ? (
                    <button onClick={updateColaborador}>Atualizar</button>
                ) : (
                    <button onClick={addColaborador}>Adicionar</button>
                )}
            </div>

            <ul>
                {colaboradores.map((colaborador) => (
                    <li key={colaborador.id}>
                        {colaborador.nome} - {colaborador.cargo} - {colaborador.idade} anos
                        <button onClick={() => {
                            setNome(colaborador.nome);
                            setCargo(colaborador.cargo);
                            setIdade(colaborador.idade);
                            setEditId(colaborador.id);
                        }}>Editar</button>
                        <button onClick={() => deleteColaborador(colaborador.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;