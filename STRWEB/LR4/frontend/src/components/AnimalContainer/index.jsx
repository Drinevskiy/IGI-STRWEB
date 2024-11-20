import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import {AnimalCard} from './AnimalCard'; // Adjust the import path as necessary
import './AnimalContainer.css';
import axios from '../../utils/axios';
import {useAuth} from '../../utils/AuthContext';

const AnimalContainer = () => {
    const [animals, setAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortProperty, setSortProperty] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const navigate = useNavigate();
    const location = useLocation();
    const { token, saveToken } = useAuth();

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await axios.get('/animals');
                setAnimals(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchAnimals();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        console.log(accessToken);
        if (accessToken) {
            saveToken(accessToken);
        }
    }, [location]);

    function addAnimal(){
        navigate('/add-animal');
    }

    const filteredAnimals = animals
        .filter(animal => animal.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            let comparison = 0;

            if (sortProperty === 'date_of_birth') {
                // Convert date_of_birth strings to Date objects for comparison
                const dateA = new Date(a.date_of_birth);
                const dateB = new Date(b.date_of_birth);
                comparison = dateA - dateB; // This will yield a positive or negative number
            } else if (sortProperty === 'aviary') {
                // Sort by aviary name
                const aviaryA = a.aviary.name.toLowerCase();
                const aviaryB = b.aviary.name.toLowerCase();
                comparison = aviaryA.localeCompare(aviaryB);
            } else {
                if (a[sortProperty] < b[sortProperty]) {
                    comparison = -1;
                } else if (a[sortProperty] > b[sortProperty]) {
                    comparison = 1;
                }
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    return (
        <>
        <div id="animal-container-elements">
            <input 
                    type="text" 
                    placeholder="Поиск по имени..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <select 
                    value={sortProperty} 
                    onChange={(e) => setSortProperty(e.target.value)}
                >
                    <option value="name">Имя</option>
                    <option value="type">Вид</option>
                    <option value="family">Семейство</option>
                    <option value="date_of_birth">Возраст</option>
                    <option value="aviary">Вольер</option>
                </select>
                <div className='sorting-input'>
                    <input 
                            id="sorting"
                            type="checkbox" 
                            checked={sortDirection === 'desc'} 
                            onChange={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} 
                        />
                    <label for="sorting">
                        Сортировать по убыванию
                    </label>
                </div>
                </div>
            <div className="animal-cards-container">
                
                {filteredAnimals.map((animal) => (
                    <AnimalCard key={animal._id} animal={animal} />
                ))}
                {/* {animals.map((animal) => (
                    <AnimalCard key={animal._id} animal={animal} />
                ))} */}
            </div>
            <div id='add-animal-button'>
                <button onClick={addAnimal}>Добавить</button>
            </div>
        </>
    );
};

export {AnimalContainer};