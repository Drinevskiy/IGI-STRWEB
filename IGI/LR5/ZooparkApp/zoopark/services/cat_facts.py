import requests
import logging

def get_fact():
    # API endpoint
    url = "https://catfact.ninja/fact"

    # Make a GET request to the API
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Get the JSON data from the response
        data = response.json()
        
        # Extract the cat fact from the data
        cat_fact = data["fact"]
        
        # Print the cat fact
        logging.info(f"Получен случайный факт про кошек.")
        return cat_fact
    else:
        logging.error(f"Ошибка при получении факта про кошек. Код: {response.status_code}")
        return "Произошлла ошибка"
        # Handle the error