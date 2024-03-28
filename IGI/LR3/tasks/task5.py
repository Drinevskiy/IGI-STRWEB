from sup_func.generate_list import generate_float_list
from sup_func.generate_list import input_float_list
from sup_func.correct_input import input_int

def sum_after_last_number(float_list, number):
    """
    Sum numbers after last number.

    Parameters:
    float_list(list): list of float
    number(float): number after which the numbers need to be summed 

    Return:
    sum(float): Sum of numbers after last number
    """
    sum = 0
    if(number in float_list):
        index = len(float_list) - float_list[-1::-1].index(number) - 1
        for item in float_list[index:]:
            sum += item
    return sum

def count_pos_even_elements(float_list):
    """
    Return count of positive even elements.

    Parameters:
    float_list(list): list of float

    Return:
    count(int): count of positive even elements
    """
    count = 0
    for item in float_list[::2]:
        if(item > 0):
            count+=1
    return count


def task5():
    """
    Perform fifth task.
    """
    float_list = []
    print("This program processes list of float.")
    size = 0
    print("Input size of list:", end = " ")
    size = input_int()
    print("Generate list - 1\nInput list - 2")
    while(True):
        print("Choose number to fill list:", end = " ")
        choose = input_int()
        match choose:
            case 1:
                float_list = generate_float_list(size)
                break
            case 2: 
                float_list = input_float_list(size)
                break
            case _:        
                print("Incorrect input. Try again.")
    print(float_list)
    print(f"Sum of numbers after last 0: {sum_after_last_number(float_list, 0)}")
    print(f"Count of positive even elements: {count_pos_even_elements(float_list)}")
    print()
        