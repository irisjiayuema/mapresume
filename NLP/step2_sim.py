import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from sentence_transformers import SentenceTransformer

import numpy as np
from pyspark.sql import SparkSession

from pyspark.sql.types import FloatType
from pyspark.sql.functions import udf

# this function encodes the given text using the AutoTokenizer and truncates/pads as necessary
def encode(text):
    enc = [x.item() for x in list(tokenizer.encode(text))]
    return enc

# get the cosine similarity between encodings
def sim(job, res=False):
    A = np.array(job)
    B = np.array(resume_enc)
    sim = np.dot(A,B)
    if res == True:
        return sim.item()
    else:
        return sim.item()/max_score

def main(inputs):

    # read the json
    df_encoding = spark.read.json(inputs)
    df_filtered = df_encoding

    # add the cosine similarity to the resume as a column
    cos_sim_udf = udf(sim, FloatType())
    df_sim = df_filtered.withColumn('Similarity', cos_sim_udf(df_filtered['Encoding'])).orderBy('Similarity', ascending=False)
        
    df_sim.show()

    # print the top 10
    results = df_sim.drop('Encoding').toJSON().take(10)
    print(results)

if __name__ == '__main__':
    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')

    # get the processed data
    inputs = 'tokenized_data_dot'

    # set the models
    tokenizer = SentenceTransformer("msmarco-distilbert-dot-v5")

    # extract keywords from the resume and encode
    resume = sys.argv[1]
    resume_enc = encode(resume)

    max_score = sim(resume_enc, True)

    main(inputs)