import tasks.task5.matrix as mtr
import sup_func.correct_input

def task5():
    """
    The task5 function performs the fifth task. It inputs the row size and column size, creates a MyMatrix object,
    prints the matrix, sorts the matrix by the last column, prints the sorted matrix, calculates the mean of the last column
    using numpy and a custom function, and prints the calculated means.
    """
    print("Input row size:", end=" ")
    n = sup_func.correct_input.input_int()
    print("Input column size:", end=" ")
    m = sup_func.correct_input.input_int()
    matrix = mtr.MyMatrix(n, m)
    print(matrix)
    matrix.sort_by_last_column()
    print(matrix)
    mean = round(matrix.mean_last_column(), 2)
    my_mean = round(matrix.my_mean_last_column(), 2)
    print(f"Mean(numpy) = {mean}")
    print(f"Mean(my function) = {my_mean}")