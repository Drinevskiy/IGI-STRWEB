import re
import zipfile 
from datetime import datetime

class Analyzer:
    """
    The Analyzer class is a base class that reads a text file.
    """
    __file_input = "tasks/task2/input.txt"
    def __init__(self):
        """
        Initializes the Analyzer with the text from the file.
        """
        self._text = self.read_file()

    @property
    def text(self):
        """
        Getter for the text.
        """
        return self._text
    
    @text.setter
    def text(self, value):
        """
        Setter for the text.
        """
        self._text = value

    def read_file(self):
        """
        Reads the text from the file.
        """
        try:
            with open(Analyzer.__file_input, "r", encoding="utf-8") as fl:
                return fl.read()
        except Exception as ex:
            print(f"Reading error. {ex}")
            return ""

class TextAnalyzer(Analyzer):
    """
    The TextAnalyzer class extends the Analyzer class and provides methods for text analysis.
    """
    def __init__(self):
        """
        Initializes the TextAnalyzer with the text from the file.
        """
        super().__init__()

    def count_narrative_sentences(self):
        """
        Counts the number of narrative sentences in the text.
        """
        return len(re.findall(r"\.", self._text)) - 2 * (self.__count_ellipsis() + self.__count_initials())

    def count_interrogative_sentences(self):
        """
        Counts the number of interrogative sentences in the text.
        """
        return len(re.findall(r"\?+", self._text))
        
    def count_exclamation_sentences(self):
        """
        Counts the number of exclamation sentences in the text.
        """
        return len(re.findall(r"\!+", self._text))

    def count_sentences(self):
        """
        Counts the total number of sentences in the text.
        """
        return self.count_narrative_sentences() + self.count_interrogative_sentences() + self.count_exclamation_sentences()
    
    def __count_characters(self):
        """
        Counts the number of characters in the text.
        """
        return len(re.findall(r"\w", self._text))

    def __count_words(self):
        """
        Counts the number of words in the text.
        """
        return len(re.findall(r"[A-Za-z’]+", self._text))

    def average_sentence_length(self):
        """
        Calculates the average sentence length in the text.
        """
        return self.__count_characters() / self.count_sentences()
    
    def average_word_length(self):
        """
        Calculates the average word length in the text.
        """
        return self.__count_characters() / self.__count_words()

    def count_smiles(self):
        """
        Counts the number of smiles in the text.
        """
        return len(re.findall(r"[;:]-*(\(+|\)+|\[+|\]+)", self._text))

    def get_upper_case_numbers(self):
        """
        Finds all the upper case words and numbers in the text.
        """
        return re.findall(r"\b[A-Z1-9]+\b", self._text) 
    
    def __count_ellipsis(self):
        """
        Counts the number of ellipsis in the text.
        """
        return len(re.findall(r"\.{3}", self._text))
    
    def __count_initials(self):
        """
        Counts the number of initials in the text.
        """
        return len(re.findall(r'\b[A-Z]\.\s*[A-Z]\.\s*[A-Z][A-Za-z0-9]+\b', self._text))
    
    def get_longest_l_word(self):
        """
        Finds the longest word that starts with 'l' in the text.
        """
        return sorted(re.findall(r"\b[l|L]+[a-zA-Z’]+\b", self._text), key=len, reverse=True)[0]

    def repeatable_words(self):
        """
        Finds all the repeatable words in the text.
        """
        return set(re.findall(r"\b(\w+)\b(?=.*\b\1\b)", self._text, re.DOTALL))

    def print_info(self):
        """
        Prints the text analysis information.
        """
        print("Narrative:", self.count_narrative_sentences())
        print("Interrogative:",  self.count_interrogative_sentences())
        print("Exlamation:", self.count_exclamation_sentences())
        print("Sentences:", self.count_sentences())
        print("Average sentence length:", self.average_sentence_length())
        print("Average word length:", self.average_word_length())
        print("Smiles:", self.count_smiles())
        print("Upper case and numbers:", self.get_upper_case_numbers())
        print("Longest word starts with 'l':", self.get_longest_l_word())
        print("Repeatable words:", self.repeatable_words())

    @staticmethod
    def check_password(password):
        """
        Checks if the password is valid.
        """
        return bool(re.findall(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_]{8,}$", password))
    
class Archiver():
    """
    The Archiver class saves the analysis results to a file and a zip archive.
    """
    file_output = "tasks/task2/output.txt"
    filename_zip = "tasks/task2/result.zip"
    def __init__(self, analyzer):
        """
        Initializes the Archiver with an Analyzer object.
        """
        self.analyzer = analyzer

    def save_to_file(self):
        """
        Saves the analysis results to a file.
        """
        try:
            with open(Archiver.file_output, "w", encoding="utf-8") as file:
                file.write(f"Narrative: {self.analyzer.count_narrative_sentences()}\n")
                file.write(f"Interrogative: {self.analyzer.count_interrogative_sentences()}\n")
                file.write(f"Exlamation: {self.analyzer.count_exclamation_sentences()}\n")
                file.write(f"Sentences: {self.analyzer.count_sentences()}\n")
                file.write(f"Average sentence length: {self.analyzer.average_sentence_length()}\n")
                file.write(f"Average word length: {self.analyzer.average_word_length()}\n")
                file.write(f"Smiles: {self.analyzer.count_smiles()}\n")
                file.write(f"Upper case and numbers: {self.analyzer.get_upper_case_numbers()}\n")
                file.write(f"Longest word starts with 'l': {self.analyzer.get_longest_l_word()}\n")
                file.write(f"Repeatable words: {self.analyzer.repeatable_words()}\n")              
        except Exception as ex:
            print("Error with writing results:", ex)
    
    def write_to_zip(self):
        """
        Writes the file with the analysis results to a zip archive.
        """
        try:
            with zipfile.ZipFile(Archiver.filename_zip, "w") as zip:
                zip.write(Archiver.file_output)
        except Exception as ex:
            print("Error with archives file:", ex)
    
    def print_info_about_zip(self):
        """
        Prints information about the file in the zip archive.
        """
        try:
            with zipfile.ZipFile(Archiver.filename_zip, "r") as zip:
                file_info = zip.getinfo(Archiver.file_output)
                print("Information about file in archive:")
                print(f"File name: {file_info.filename}")
                print(f"File size(bytes): {file_info.file_size}")
                print(f"Time of creating file: {datetime(*file_info.date_time)}")
        except Exception as ex:
            print("Error with archives file:", ex)