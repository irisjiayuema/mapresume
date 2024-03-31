import polars as pl
import numpy as np
import sys

from sentence_transformers import SentenceTransformer

# Function to encode text using the sentence transformer
def encode(text, tokenizer):
    return np.array([x.item() for x in tokenizer.encode(text)])

# get the similarity between encodings
def sim(job, res=False):
    A = np.array(job)
    B = np.array(resume_enc)
    sim = np.dot(A,B)
    if res == True:
        return sim.item()
    else:
        return sim.item()/max_score

# Main function to process data
def main(input):
    # Read the JSON data into a Polars DataFrame
    df = pl.read_parquet(input)

    # Apply the similarity function and sort by similarity
    df = df.with_columns([pl.col("Encoding").map_elements(sim, return_dtype=pl.Float64).alias("Similarity")])
    df = df.sort("Similarity", descending=True)

    # Print the top 10 results
    top_10_results = df.drop("Encoding").head(10)
    print(top_10_results.write_json())

if __name__ == '__main__':
    # Get inputs and the resume text
    input = 'processed.parquet'
    resume = sys.argv[1]  # Assuming the resume text is passed as the first command line argument

    # Initialize the sentence transformer model
    tokenizer = SentenceTransformer("msmarco-distilbert-dot-v5")

    # Encode the resume text
    resume_enc = encode(resume, tokenizer)
    max_score = np.dot(resume_enc, resume_enc).item()

    # Execute main function
    main(input)
