import requests
import logging

def get_photo():
    # API endpoint
    url = "https://dog.ceo/api/breeds/image/random"

    # Make a GET request to the API
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Get the JSON data from the response
        data = response.json()
        
        # Extract the cat fact from the data
        dog_photo = data["message"]
        
        # Print the cat fact
        logging.info(f"Получено случайное фото собаки.")
        return dog_photo
    else:
        logging.error(f"Ошибка при получении фото собаки. Код: {response.status_code}")
        return "Произошлла ошибка"
        # Handle the error