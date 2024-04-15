import sup_func.correct_input
from tasks.task4.shape import Pentagon
import sup_func

def task4():
    """
    The task4 function performs the fourth task. It inputs the figure name, side length, and color,
    creates a Pentagon object, prints the Pentagon information, inputs the text on the graphic, and draws the Pentagon.
    """
    name = input("Input figure name: ")
    print("Input side length:", end=" ")
    a = sup_func.correct_input.input_int()
    color = input("Input figure color: ")
    pentagon = Pentagon(name, a, color)
    print("Name: {:name} Side: {:a} Color: {:color} Area: {:area}".format(pentagon, pentagon, pentagon, pentagon))
    text = input("Input text on graphic: ")
    pentagon.draw_shape(text)