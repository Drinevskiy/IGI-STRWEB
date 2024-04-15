import numpy as np

class Matrix:
    """
    The Matrix class represents a matrix with n rows and m columns.
    """
    def __init__(self, n, m):
        """
        Initializes the Matrix with n rows and m columns, and fills it with random integers between -20 and 20.
        """
        self._n = n
        self._m = m
        self._matrix = np.random.randint(-20, 20, (n, m))

    def __str__(self):
        """
        Returns a string representation of the Matrix.
        """
        return f"Количество строк: {self._n}, количество столбцов: {self._m}.\n{self._matrix}"

    def sort_by_last_column(self):
        """
        Sorts the rows of the Matrix in descending order by the last column.
        """
        sorted_indices = np.argsort(self._matrix[:, -1])[::-1]
        self._matrix = self._matrix[sorted_indices]

class StatisticMatrixMixin:
    """
    The StatisticMatrixMixin class is a mixin that provides statistical methods for a matrix.
    """
    def mean(self):
        """
        Calculates the mean of the matrix.
        """
        return np.mean(self._matrix)
    
    def mean_last_column(self):
        """
        Calculates the mean of the last column of the matrix.
        """
        return np.mean(self._matrix[:, -1])
    
    def my_mean_last_column(self):
        """
        Calculates the mean of the last column of the matrix using the number of rows.
        """
        return np.sum(self._matrix[:, -1]) / self._n
    
    def median(self):
        """
        Calculates the median of the matrix.
        """
        return np.median(self._matrix)
    
    def corrcoef(self):
        """
        Calculates the correlation coefficient of the matrix.
        """
        return np.corrcoef(self._matrix)
    
    def var(self):
        """
        Calculates the variance of the matrix.
        """
        return np.var(self._matrix)
    
    def std(self):
        """
        Calculates the standard deviation of the matrix.
        """
        return np.std(self._matrix)
    
class MyMatrix(StatisticMatrixMixin, Matrix):
    """
    The MyMatrix class extends the Matrix class and includes the StatisticMatrixMixin.
    """
    pass