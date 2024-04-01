def delete_punctuation(list_of_string):
    """
    Delete "." and "," from each string of the list if they are present there.

    Parameter:
    list_of_string(list): list of strings

    Return:
    temp_list(list): list of strings without punctuation.
    """
    temp_list = []
    for item in list_of_string:
        if (item[-1] == "," or item[-1] == "."):
            item = item[:-1]
        temp_list.append(item)
    return temp_list


def count_of_words_with_length(list_of_string, length):
    """
    Counts the number of words with a given length.

    Parameters:
    list_of_string(list): list of strings
    length(int): length of word

    Return:
    res(int): count of words with given length
    """
    res = 0
    for item in list_of_string:
        if (len(item) == length):
            res += 1
    return res


def sort_text_by_words_length(list_of_string):
    """
    Sorts the list of strings in descending order of length.

    Parameters:
    list_of_string(list): list of strings

    Return:
    list_of_string(list): list of strings in descending order of length
    """
    return sorted(list_of_string, key=len, reverse=True)


def dictionary_of_vowel_consonant_equal(list_of_string):
    """
    Returns a dictionary of words with the same
    number of consonants and vowels and their indexes.

    Parameters:
    list_of_string(list): list of strings

    Return:
    dictionary(dict): dictionary(key - word, value - index) of words
    with the same number of consonants and vowels and their indexes.
    """
    length = len(list_of_string)
    index = 0
    vowels = "aeiou"
    dictionary = dict()
    while index < length:
        word = list_of_string[index].lower()
        vowel_count = len([letter for letter in word if letter in vowels])
        consonant_count = len([letter for
                               letter in word if letter not in vowels])
        if (vowel_count == consonant_count):
            dictionary[list_of_string[index]] = index + 1
        index += 1
    return dictionary


def task4():
    """
    Perform fourth task.
    """
    text = """So she was considering in her own mind,
    as well as she could, for the hot day made
    her feel very sleepy and stupid, whether
    the pleasure of making a daisy-chain would be
    worth the trouble of getting up and
    picking the daisies, when suddenly a
    White Rabbit with pink eyes ran close by her."""
    split_text = text.split()
    split_text = delete_punctuation(split_text)

    count_of_words_with_length_3 = count_of_words_with_length(split_text, 3)
    print(f"Count of words with length 3: {count_of_words_with_length_3}.")
    print()

    print("""Dictionary(key - word, value - index) of words with
the same number of consonants and vowels and their indexes.""")
    dictionary = dictionary_of_vowel_consonant_equal(split_text)
    print(dictionary)
    print()

    print("List of strings in descending order of length.")
    sorted_text = sort_text_by_words_length(split_text)
    print(sorted_text)
    print()
