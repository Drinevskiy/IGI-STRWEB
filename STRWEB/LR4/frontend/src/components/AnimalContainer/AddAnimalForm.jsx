import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const AddAnimalForm = () => {
    const [animalData, setAnimalData] = useState({
        name: '',
        description: '',
        type: '',
        family: '',
        date_of_birth: '',
        date_of_receipt: '',
        aviary: { _id: '', name: '' },
        photo: '',
    });

    const [aviaries, setAviaries] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAviaries = async () => {
            try {
                const response = await axios.get('/aviary'); // Adjust endpoint as necessary
                setAviaries(response.data);
            } catch (error) {
                console.error('Ошибка при получении вольеров:', error);
                setErrorMessage('Не удалось загрузить данные о вольерах.');
            }
        };

        fetchAviaries();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setAnimalData((prevData) => ({
            ...prevData,
            [name]: name === 'aviary' ? { ...prevData.aviary, _id: value } : type === 'file' ? files[0] : value,
        }));
    };

    const handleAviaryChange = (e) => {
        const selectedAviary = aviaries.find(aviary => aviary._id === e.target.value);
        setAnimalData((prevData) => ({
            ...prevData,
            aviary: selectedAviary || { _id: '', name: '' },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { date_of_birth, date_of_receipt } = animalData;

        const date_receipt = new Date(date_of_receipt);
        const date_birth = new Date(date_of_birth);
        const date_now = new Date();
        // Validate that date of receipt is not earlier than date of birth
        if (date_receipt > date_now || date_birth > date_now) {
            setErrorMessage('Нельзя указать дату позже текущей.');
            return;
        }
        if (date_receipt < date_birth) {
            setErrorMessage('Дата поступления не может быть раньше даты рождения.');
            return;
        }
        // console.log(animalData);
        if (animalData.photo) {
            const formDataToUpload = new FormData();
            formDataToUpload.append('image', animalData.photo);
            
            axios.post('/upload', formDataToUpload, { withCredentials: true })
            .then(res => {
                const animData = {
                    name: animalData.name,
                    description: animalData.description,
                    type: animalData.type,
                    family: animalData.family,
                    date_of_birth: animalData.date_of_birth,
                    date_of_receipt: animalData.date_of_receipt,
                    aviary: animalData.aviary._id,
                    image: res.data.url
                };
                const token = localStorage.getItem('token');
                axios.post('/animals', animData,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }).then(response => {
                    
                    if (response.status === 201) {
                        setSuccessMessage('Животное успешно добавлено!');
                        setErrorMessage(''); // Clear any previous error messages
                        // Reset form
                        setAnimalData({
                            name: '',
                            description: '',
                            type: '',
                            family: '',
                            date_of_birth: '',
                            date_of_receipt: '',
                            aviary: { _id: '', name: '' },
                        });
                    }
                }).catch(error => {
                    if(error.response.status === 403){
                        navigate('/login');
                    }
                    console.error('Ошибка при добавлении животного:', error);
                    setErrorMessage('Произошла ошибка при добавлении животного.');
                })
            }) // Получаем URL загруженного изображения
            .catch (error => {
                console.error(error);
                setErrorMessage('Ошибка при загрузке изображения.');
                return;
            });
        }
    };

    return (
        <form className="new-animal-form" onSubmit={handleSubmit}>
            <h2 style={{textAlign: "center"}}>Добавить животное</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="form-group">
                <label htmlFor="name">Имя:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={animalData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Описание:</label>
                <textarea
                    id="description"
                    name="description"
                    value={animalData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="type">Вид:</label>
                <input
                    type="text"
                    id="type"
                    name="type"
                    value={animalData.type}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="family">Семейство:</label>
                <input
                    type="text"
                    id="family"
                    name="family"
                    value={animalData.family}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="date_of_birth">Дата рождения:</label>
                <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={animalData.date_of_birth}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="date_of_receipt">Дата поступления:</label>
                <input
                    type="date"
                    id="date_of_receipt"
                    name="date_of_receipt"
                    value={animalData.date_of_receipt}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="aviary">Название вольера:</label>
                <select
                    id="aviary"
                    name="aviary"
                    value={animalData.aviary._id}
                    onChange={handleAviaryChange}
                    required
                >
                    <option value="">Выберите вольер</option>
                    {aviaries.map((aviary) => (
                        <option key={aviary._id} value={aviary._id}>
                            {aviary.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>
                    Фото:
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <button type="submit">Добавить животное</button>
        </form>
    );
};

export { AddAnimalForm };