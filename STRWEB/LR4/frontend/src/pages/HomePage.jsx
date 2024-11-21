import React, { useState, useEffect } from "react";
import { SearchSort } from "../components";
import { useNavigate } from "react-router-dom";
import { AnimalContainer } from "../components";
import axios from '../utils/axios';

const HomePage = () => {
    const [animals, setAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortProperty, setSortProperty] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await axios.get('/animals');
                setAnimals(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    const filteredAnimals = animals
        .filter(animal => animal.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            let comparison = 0;

            if (sortProperty === 'date_of_birth') {
                const dateA = new Date(a.date_of_birth);
                const dateB = new Date(b.date_of_birth);
                comparison = dateB - dateA;
            } else if (sortProperty === 'aviary') {
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

    function addAnimal(){
        navigate('/add-animal');
    }

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <SearchSort 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortProperty={sortProperty}
                setSortProperty={setSortProperty}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
            />
            <AnimalContainer animals={filteredAnimals} />
            <div id='add-animal-button'>
                <button onClick={addAnimal}>Добавить</button>
            </div>
        </>
    );
};

export { HomePage };