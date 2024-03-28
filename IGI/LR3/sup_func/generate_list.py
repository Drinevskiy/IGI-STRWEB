import random
import sup_func.correct_input

def generate_float_list(size):
    """
    Generate list of random float value.

    Parameters:
    size(int): length of list

    Return:
    float_list(list): generated list with random values
    """
    index = 0
    float_list = list()
    while(index < size):
        float_list.append(random.uniform(-100000,100000))
        index+=1
    return float_list

def input_float_list(size):
    """
    Manually filling in the list by the user.

    Parameters:
    size(int): length of list

    Return:
    float_list(list): filled list with user's values
    """
    a = 1
    index = 0
    float_list = list()
    while(index < size):
        print("Input value:", end = " ")
        a = sup_func.correct_input.input_float()
        float_list.append(a)
        index+=1
    return float_list        
