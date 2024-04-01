from sup_func.correct_input import input_int


def sum_second_number():
    """
    Sums up every second number.
    The end of the cycle is the input of the number 0.

    Return:
    res(int): sum of every second number
    """
    a = 1
    even = False
    res = 0
    while (a != 0):
        print("Input value:", end=" ")
        a = input_int()
        if (even):
            res += a
        even = not even
    return res


def task2():
    """
    Perform second task.
    """
    print("Sums up every second number")
    print(f"Result: {sum_second_number()}")
    print()
