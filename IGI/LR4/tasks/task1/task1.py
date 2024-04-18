import pickle
import csv

class Shop:
    """
    The Shop class represents a shop that can save and load product information.
    """
    def __init__(self, filename_pickle, filename_csv, products):
        """
        Initializes the shop with file names and products.
        """
        self.__filename_pickle = filename_pickle
        self.__filename_csv = filename_csv
        self.products = products

    @property
    def filename_txt(self):
        """
        Getter for the txt file name.
        """
        return self.__filename_pickle 

    @filename_txt.setter
    def filename_txt(self, value):
        """
        Setter for the txt file name.
        """
        self.__filename_pickle = value

    @property
    def filename_csv(self):
        """
        Getter for the csv file name.
        """
        return self.__filename_csv
    
    @filename_csv.setter
    def filename_txt(self, value):
        """
        Setter for the csv file name.
        """
        self.__filename_csv = value

    def save_pickle(self):
        """
        Saves the product information in a pickle file.
        """
        try:
            with open(self.__filename_pickle, "wb") as fh:
                pickle.dump(self.products, fh)
        except Exception as ex:
            print(f"{ex}")
            
    def load_pickle(self):
        """
        Loads the product information from a pickle file.
        """
        try:
            with open(self.__filename_pickle, "rb") as fh:
                return pickle.load(fh)
        except Exception as ex:
            print(f"{ex}")
            
    def save_csv(self):
        """
        Saves the product information in a csv file.
        """
        try:
            with open(self.__filename_csv, 'w', encoding="utf-8", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=["Product", "Old", "New"], quoting=csv.QUOTE_ALL)
                writer.writeheader()
                for key, value in sorted(self.products.items()):
                    writer.writerow(dict(Product=key, Old=value[0], New=value[1]))
        except Exception as ex:
            print(f"{ex}")
                
    def load_csv(self):
        """
        Loads the product information from a csv file.
        """
        products = dict()
        try:
            with open(self.__filename_csv, newline="") as f:
                reader = csv.reader(f)
                for row in list(reader):
                    products[row[0]] = [row[1], row[2]]
        except Exception as ex:
            print(f"{ex}")
        return products

class ExtendedShop(Shop):
    """
    The ExtendedShop class extends the functionality of the Shop class, adding search and price analysis.
    """
    def __init__(self, filename_txt, filename_csv, products):
        """
        Initializes the extended shop with file names and products.
        """
        super().__init__(filename_txt, filename_csv, products)        
    def search(self, query):
        """
        Searches for a product in the shop. If the product is found, it prints the old and new prices. 
        If the product is not found, it prints a message.
        """
        if (query in self.products):
            print(f"{query} - old: {self.products[query][0]}, new: {self.products[query][1]}")
        else: 
            print("Product was not found")
    def price_increase(self):
        """
        Analyzes the price increase of the products. 
        Returns a dictionary with the products that had a price increase and the percentage of the increase.
        """
        products = dict()
        for key, value in self.products.items():
            if (value[0] < value[1]):
                    products[key] = round((value[1]/value[0] - 1) * 100, 2)
        return products


def task1():
    """
    The task1 function creates an ExtendedShop object, saves the product information in a csv file, 
    loads the product information from the csv file, searches for a product, and prints the products that had a price increase.
    """
    products = {"apple" : [12, 15],
                "banana" : [9, 7],
                "cucumber": [7, 9],
                "pineapple": [21, 24],
                "orange": [10, 8],
                "mandarine": [8, 11]}
    filename_pickle = r"D:\Study\4 semestr\IGI\253502_Drinevskiy_8\IGI\LR4\tasks\task1\products.pickle"
    filename_csv = r"D:\Study\4 semestr\IGI\253502_Drinevskiy_8\IGI\LR4\tasks\task1\products.csv"
    shop = ExtendedShop(filename_pickle, filename_csv, products)
    shop.save_pickle()
    products2 = shop.load_pickle()
    shop.search(input("Find: "))
    print(products2)   
    print(shop.price_increase())