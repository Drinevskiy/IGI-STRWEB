import matplotlib.pyplot as plt
import numpy as np
import statistics
from sup_func.correct_input import input_float

class Function:
    """
    The Function class calculates the value of the arcsin using a series expansion with a given accuracy.
    """
    MAX_ITERATION = 500
    def __init__(self):
        """
        Initializes the Function with the input values.
        """
        self._x, self._epsilon = self.input_values()
        self._results = []
        self._n = 0
        self._values = []
        
    def input_values(self):
        """
        Inputs the value x and the accuracy eps.
        """
        print("Input value x:", end=" ")
        x = input_float()
        print("Input accuracy eps:", end=" ")
        eps = input_float()
        return x, eps
    
    def check_range(input_func):
        """
        Decorator for checking the range for arcsin.

        Parameters:
        input_func(def): function for checking the range

        Return:
        output_func(def): checked function
        """
        def output_func(*args):
            x = args[2]
            eps = args[3]
            if (abs(x) > 1):
                print("""The value of x is out of bounds.
                    x will be assigned the value of the nearest boundary.""")
                if (x > 1):
                    x = 1
                else:
                    x = -1
            return input_func(args[1], x, eps)
        return output_func


    @check_range
    def arcsin_series(self, x, eps):
        """
        Calculates the value of the arcsin using a series expansion with a given accuracy.

        Parameters:
        x(float): argument of function arcsin
        eps(float): accuracy
        """
        self._results = []
        self._n = 0
        self._values = []
        term = x
        result = 0
        self._values.clear()
        while abs(term) > eps and self._n < Function.MAX_ITERATION:
            self._n += 1
            result += term
            self._values.append(term)
            term *= x * x * (2 * self._n - 1) * (2 * self._n - 1) / (2 * self._n * (2 * self._n + 1))
            self._results.append(result)


class ExtendedFunction(Function):
    """
    The ExtendedFunction class extends the Function class and provides methods for drawing the function and the sequence,
    and calculating the mean, median, mode, variance, and standard deviation of the sequence.
    """
    file_fun = "tasks/task3/fun.png"
    file_seq = "tasks/task3/seq.png"


    def __init__(self):
        """
        Initializes the ExtendedFunction with the input values.
        """
        super().__init__()
    

    def draw_fun(self):
        """
        Draws the function arcsin(x).
        """
        x = np.arange(-1, 1, 0.01)
        y = np.arcsin(x)       
        plt.plot(x, y, color='black', linewidth=2)
        plt.ylim(-1.7,1.7)
        plt.legend(['График функции'])
        plt.xlabel('x')
        plt.ylabel('y')
        plt.title('График функции arcsin(x)')
        plt.text(-1, 1,"Функция определена при |x|<=1")
        plt.grid(True)
        plt.savefig(self.file_fun)
        plt.show()


    def draw_seq(self):
        """
        Draws the sequence of the series expansion.
        """
        self.arcsin_series(self, self._x, self._epsilon)
        plt.plot([i + 1 for i in range(self._n)], self._results)
        plt.xlim(left=0, right=self._n + 1)
        plt.ylim(bottom=-1.7,top=1.7)
        plt.xlabel('Итерация')
        plt.ylabel('y')
        plt.legend(['График функции'])
        plt.title('График последовательности разложения ряда')
        plt.annotate("Достигнута заданная точность", 
                     xy=(self._n, self._results[self._n - 1]), 
                     xytext=(self._n / 2, 0),
                     arrowprops=dict(facecolor="blue", shrink=0.09))
        plt.grid(True)
        plt.savefig(self.file_seq)
        plt.show()
    

    def mean_sequence(self):
        """
        Calculates the mean of the sequence.
        """
        if len(self._values) == 0:
            return None   
        return statistics.mean(self._values)
    
    def median_sequence(self):
        """
        Calculates the median of the sequence.
        """
        if len(self._values) == 0:
            return None   
        return statistics.median(self._values)
    
    def mode_sequence(self):
        """
        Calculates the mode of the sequence.
        """
        if len(self._values) == 0:
            return None   
        return statistics.mode(self._values)
    
    def variance_sequence(self):
        """
        Calculates the variance of the sequence.
        """
        if len(self._values) == 0:
            return None   
        return statistics.variance(self._values)
    
    def stdev_sequence(self):
        """
        Calculates the standard deviation of the sequence.
        """
        if len(self._values) == 0:
            return None   
        return statistics.stdev(self._values)
    

def task3():
    """
    Third task calculates the value of the arcsin using
    a series expansion with a given accuracy, draws the function and the sequence, and calculates
    the mean, median, mode, variance, and standard deviation of the sequence.
    """
    print("""Calculates the value of the arcsin using
a series expansion with a given accuracy.""")
    func = ExtendedFunction()
    func.draw_seq()
    func.draw_fun()
    mean = func.mean_sequence()
    median = func.median_sequence()
    mode = func.mode_sequence()
    variance = func.variance_sequence()
    stdev = func.stdev_sequence()
    print(f"Mean: {mean}\nMedian: {median}\nMode: {mode}\nVariance: {variance}\nStandard deviation: {stdev}\n")