import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // Adjust the import path as necessary
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const EditAnimalForm = () => {
    const location = useLocation();
    console.log(location);
    const [animalData, setAnimalData] = useState({
        name: location.state.animal.name,
        description: location.state.animal.description,
        type: location.state.animal.type,
        family: location.state.animal.family,
        date_of_birth: location.state.animal.date_of_birth.substring(0,10),
        date_of_receipt: location.state.animal.date_of_receipt.substring(0,10),
        aviary: location.state.animal.aviary,
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
        // const image = location.state.animal.photo ? location.state.animal.photo : 'uploads/lapka.jpg';
        // axios.get(image, { responseType: 'blob' })
        // .then(response => {
        //     const imageUrl = URL.createObjectURL(response.data);
        //     console.log(imageUrl);
        //     console.log(animalData);
        //     setAnimalData((prevData) => ({
        //         ...prevData,
        //         photo: imageUrl,
        //     }));
        //     // setImage(imageUrl);
        // })
        // .catch(error =>
        //     console.error('Ошибка при получении животного:', error)
        // );
        fetchAviaries();
    }, []);

    if(Object.keys(location.state.animal).length === 0){
        return <Navigate to='/'/>;
    }
    
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
        console.log(animalData);
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
                axios.patch(`/animals/${location.state.animal._id}`, animData,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }).then(response => {
                    if (response.status === 200) {
                        setSuccessMessage('Животное успешно обновлено!');
                        setErrorMessage(''); // Clear any previous error messages
                    }
                }).catch(error => {
                    if(error.response.status === 403){
                        navigate('/login');
                    }
                    console.error('Ошибка при обновлении животного:', error);
                    setErrorMessage('Произошла ошибка при обновлении животного.');
                })
            }) // Получаем URL загруженного изображения
            .catch (error => {
                console.error(error);
                setErrorMessage('Ошибка при загрузке изображения.');
                return;
            });
        }
        else{
            const animData = {
                name: animalData.name,
                description: animalData.description,
                type: animalData.type,
                family: animalData.family,
                date_of_birth: animalData.date_of_birth,
                date_of_receipt: animalData.date_of_receipt,
                aviary: animalData.aviary._id,
            };
            const token = localStorage.getItem('token');
            axios.patch(`/animals/${location.state.animal._id}`, animData,{
                headers: {
                Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            }).then(response => {
                
                if (response.status === 200) {
                    setSuccessMessage('Животное успешно обновлено!');
                    setErrorMessage(''); // Clear any previous error messages
                }
            }).catch(error => {
                if(error.response.status === 403){
                    navigate('/login');
                }
                console.error('Ошибка при обновлении животного:', error);
                setErrorMessage('Произошла ошибка при обновлении животного.');
            })
        }
    };
    
    return (
        <form className="new-animal-form" onSubmit={handleSubmit}>
            <h2 style={{textAlign: "center"}}>Изменить животное</h2>
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
                    />
                </label>
            </div>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export { EditAnimalForm };