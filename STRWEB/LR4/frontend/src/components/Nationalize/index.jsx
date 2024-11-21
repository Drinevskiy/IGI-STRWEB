import React, { Component } from 'react';
import axios from 'axios';

class Nationalize extends Component {
  state = {
    name: '',
    results: [],
    error: null,
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value, error: null });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name } = this.state;

    if (!name) {
      this.setState({ error: 'Пожалуйста, введите имя' });
      return;
    }

    try {
      const response = await axios.get('https://api.nationalize.io', {
        params: { name },
      });
      this.setState({ results: response.data.country, error: null });
    } catch (error) {
      this.setState({ error: 'Ошибка при получении данных' });
    }
  };

  render() {
    const { name, results, error } = this.state;

    return (
      <div style={{textAlign: 'center'}}>
        <h1 >Определение национальности по имени</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={this.handleChange}
            placeholder="Введите имя"
            required
          />
          <button type="submit">Отправить</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {results.length > 0 && (
          <div>
            <h2>Вероятные национальности:</h2>
            <ul style={{listStyleType: 'none'}}>
              {results.map((country) => (
                <li key={country.country_id}>
                  {country.country_id}: {Math.round(country.probability * 100)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export {Nationalize};