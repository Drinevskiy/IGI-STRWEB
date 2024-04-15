from abc import ABC, abstractmethod
from math import pi, tan, sin, cos
import matplotlib.pyplot as plt

class Shape(ABC):
    """
    The Shape class is an abstract base class for shapes.
    """
    @abstractmethod
    def area(self):
        """
        Abstract method for calculating the area of a shape.
        """
        pass


class Color:
    """
    The Color class represents a color.
    """
    def __init__(self, color):
        """
        Initializes the Color with a color.
        """
        self._color = color
    
    @property
    def color(self):
        """
        Getter for the color.
        """
        return self._color
    
    @color.setter
    def color(self, clr):
        """
        Setter for the color.
        """
        self._color = clr
    
class Pentagon(Shape):
    """
    The Pentagon class represents a pentagon and extends the Shape class.
    """
    def __init__(self, name, a, color):
        """
        Initializes the Pentagon with a name, a side length, and a color.
        """
        self._name = name
        self._a = a
        self._color = Color(color)

    def __format__(self, format_spec):
        """
        Formats the Pentagon information.
        """
        if format_spec == 'a':
            return str(self._a)
        elif format_spec == 'color':
            return self._color.color
        elif format_spec == 'name':
            return self._name
        elif format_spec == 'area':
            return str(self.area())
        return self._name + ', ' + str(self._a) + ', ' + self._color.color + ', ' + str(self.area())
        
    @property
    def name(self):
        """
        Getter for the name.
        """
        return self._name
    
    @name.setter
    def name(self, value):
        """
        Setter for the name.
        """
        self._name = value

    @property
    def a(self):
        """
        Getter for the side length.
        """
        return self._a
    
    @a.setter
    def a(self, value):
        """
        Setter for the side length.
        """
        if not isinstance(value, int) or value <= 0:
           value = 1
        self._a = value    

    def area(self):
        """
        Calculates the area of the pentagon.
        """
        return (5.0/4)*self._a**2/tan(pi/5)   
    
    def get_pentagon_coordinates(self):
        """
        Calculates the coordinates of the pentagon.
        """
        x = 0
        y = 0
        r = self._a / (2 * sin(pi / 5))  
        return [x + r * cos(2 * pi * i / 5) for i in range(1, 6)], [y + r * sin(2 * pi * i / 5) for i in range(1, 6)]

    
    def draw_shape(self, text):
        """
        Draws the pentagon and saves it to a file.
        """
        filename = "tasks/task4/pentagon.png"
        fig, ax = plt.subplots()

        x_coords, y_coords = self.get_pentagon_coordinates()
        
        try:
            ax.fill(x_coords, y_coords, color=self._color.color)
        except Exception as e:
            print("An error occurred while filling the shape:", str(e))
            return

        ax.text(min(x_coords), min(y_coords), text, fontsize=9)
        plt.savefig(filename)
        plt.show()