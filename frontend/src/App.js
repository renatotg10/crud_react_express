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
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestão de Colaboradores</h1>

            <div className="card mb-4">
                <div className="card-header">Adicionar/Editar Colaborador</div>
                <div className="card-body">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editId ? updateColaborador() : addColaborador();
                        }}
                    >
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    placeholder="Cargo"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                    placeholder="Idade"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="submit" className="btn btn-primary">
                                {editId ? 'Atualizar' : 'Adicionar'}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => {
                                        setNome('');
                                        setCargo('');
                                        setIdade('');
                                        setEditId(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead>
                    <tr className="table-primary">
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Idade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {colaboradores.map((colaborador) => (
                        <tr key={colaborador.id}>
                            <td>{colaborador.nome}</td>
                            <td>{colaborador.cargo}</td>
                            <td>{colaborador.idade}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {
                                        setNome(colaborador.nome);
                                        setCargo(colaborador.cargo);
                                        setIdade(colaborador.idade);
                                        setEditId(colaborador.id);
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteColaborador(colaborador.id)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;