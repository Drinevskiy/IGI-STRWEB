import math
from sup_func.correct_input import input_float

def check_range(input_func):
    def output_func(*args):
        x = args[0]
        eps = args[1]
        if(abs(x) > 1):
            print("The value of x is out of bounds. x will be assigned the value of the nearest boundary.")
            if(x > 1): 
                x = 1
            else:
                x = -1   
        return input_func(x, eps)         
    return output_func    

@check_range
def arcsin_series(x, eps):
    """
    Сalculates the value of the arcsin using a series expansion with a given accuracy.

    Parameters:
    x(float): argument of function arcsin
    eps(float): accuracy

    Return:
    result(float): function value
    n(int): count of iterations
    """
    n = 0
    term = x
    result = x
    while abs(term) > eps and n < 500:
        n += 1
        term *= x * x * (2 * n - 1) * (2 * n - 1) / (2 * n * (2 * n + 1))
        result += term
    return result, n

def task1():
    """
    Perform first task.
    """
    print("Calculates the value of the arcsin using a series expansion with a given accuracy.")
    print("Input value x:", end = " ")
    x = input_float()
    print("Input accuracy eps:", end = " ")
    eps = input_float()
    result, n = arcsin_series(x, eps)
    x1 = x
    print(f"Row: arcsin({x}) = {result}")
    try:
        print(f"Module math: arcsin({x1}) = {math.asin(x)}")
    except:
        if(x > 1): 
            x = 1
        else:
            x = -1  
        print(f"Module math: arcsin({x1}) = {math.asin(x)}")
    print(f"Number of row members = {n}")
    print(f"Accuracy = {eps}")
    print()
