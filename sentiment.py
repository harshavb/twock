from pattern.text.en import sentiment
import sys

print(sentiment(sys.argv[1]))
sys.stdout.flush()