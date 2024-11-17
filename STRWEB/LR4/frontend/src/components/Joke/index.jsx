import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Joke = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJoke();
  }, []);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      setJoke(response.data);
    } catch (err) {
      setError('Ошибка при получении шутки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Случайная шутка</h1>
      <form>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {joke && (
        <div>
          <p><strong>Вопрос:</strong> {joke.setup}</p>
          <p><strong>Ответ:</strong> {joke.punchline}</p>
        </div>
      )}
      <button onClick={fetchJoke}>Получить новую шутку</button>
      </form>
    </div>
  );
};

export {Joke};