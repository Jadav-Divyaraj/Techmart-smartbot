"""
TechMart AI - NLP Utilities
Tokenization, stemming, and bag-of-words for PyTorch model
"""

import numpy as np
import nltk
from nltk.stem.porter import PorterStemmer

nltk.download('punkt', quiet=True)
stemmer = PorterStemmer()


def tokenize(sentence):
    """Split sentence into array of words/tokens."""
    return nltk.word_tokenize(sentence)


def stem(word):
    """Find the root form of the word."""
    return stemmer.stem(word.lower())


def bag_of_words(tokenized_sentence, words):
    """
    Return bag of words array:
    1 for each known word that exists in the sentence, 0 otherwise.
    
    Example:
    sentence = ["hello", "how", "are", "you"]
    words = ["hi", "hello", "I", "you", "bye", "thank", "cool"]
    bog   = [  0 ,    1 ,    0 ,   1 ,    0 ,    0 ,      0]
    """
    sentence_words = [stem(word) for word in tokenized_sentence]
    bag = np.zeros(len(words), dtype=np.float32)
    for idx, w in enumerate(words):
        if w in sentence_words:
            bag[idx] = 1
    return bag
