numbers = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'}
def find_count_of_numbers_in_text(text):
    """
    Counting the number of digits in string.

    Parameters:
    text(string): text

    Return:
    res(int): count of number in string
    """
    res = 0
    for c in text:
        if(c in numbers):
            res+=1
    return res

def task3():
    """
    Perform third task.
    """
    print("Counting the number of digits in string")
    text = input("Input text: ")
    res = find_count_of_numbers_in_text(text)

    print(f"Count of numbers in text: {res}")    
    print()    