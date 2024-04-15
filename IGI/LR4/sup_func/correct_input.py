def input_int():
    """
    Input int and check it.

    Return:
    number(int): entered number
    """
    number = 0
    while (True):
        try:
            number = int(input())
            break
        except ValueError:
            print("Incorrect input. Try again.")
    return number


def input_float():
    """
    Input float and check it.

    Return:
    number(float): entered number
    """
    number = 0
    while (True):
        try:
            number = float(input())
            break
        except ValueError:
            print("Incorrect input. Try again.")
    return number