# The program is designed to perform tasks from laboratory
# work №3 "Standard data types, collections, functions, modules.".
# Author: Drinevskiy Kirill
# Date: 27.03.2024
# Version: 1.0
from tasks.task1 import task1
from tasks.task2 import task2
from tasks.task3 import task3
from tasks.task4 import task4
from tasks.task5 import task5
from sup_func.correct_input import input_int

while (True):
    print("""First task - 1\nSecond task - 2\nThird task - 3
Fourth task - 4\nFifth task - 5\nExit - 6""")
    print("Choose number to perform task", end=" ")
    choose = input_int()
    match choose:
        case 1:
            task1()
        case 2:
            task2()
        case 3:
            task3()
        case 4:
            task4()
        case 5:
            task5()
        case 6:
            break
        case _:
            print("Incorrect input. Try again.")
print("Exit")
