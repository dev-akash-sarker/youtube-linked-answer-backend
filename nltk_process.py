import nltk
from nltk.tokenize import word_tokenize
import sys
import json

nltk.download('punkt')

def tokenize_sentence(sentence):
    words = word_tokenize(sentence)
    return words

if __name__ == "__main__":
    # Read input from Node.js
    input_data = json.loads(sys.stdin.readline())

    # Process the input and send the result back to Node.js
    result = tokenize_sentence(input_data["sentence"])
    print(json.dumps(result))

    # Flush the output to ensure it's sent immediately
    sys.stdout.flush()
