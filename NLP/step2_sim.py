import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from transformers import (
    AutoModelForTokenClassification,
    AutoTokenizer,
)
from transformers.pipelines import AggregationStrategy
import numpy as np
from pyspark.sql import SparkSession, functions, types
from girder.api.describe import Description

from pyspark.sql.types import ArrayType, IntegerType, FloatType
from pyspark.sql.functions import udf

from numpy.linalg import norm

def encode(text):
    enc = distilbert_tokenizer.encode(text)
    len_enc = len(enc)
    if len_enc < 512:
        enc += [0] * (512 - len_enc)
    return enc

def cos_sim(job):
    A = np.array(job)
    B = np.array(resume_enc)
    sim = float(np.dot(A,B)/(norm(A)*norm(B)))
    return sim

def main(inputs, resume_enc):

    df_encoding = spark.read.json(inputs)

    cos_sim_udf = udf(cos_sim, FloatType())
    df_cos_sim = df_encoding.withColumn('Cosine_Similarity', cos_sim_udf(df_encoding['Encoding_Distilbert']))\
        .orderBy('Cosine_Similarity', ascending=False)    

    results = df_cos_sim.drop('Encoding_Distilbert').toJSON().take(10)
    print(results)
    # {Job Title: ---, Company: ---, Job Description: ---, Apply Url: ---, Cosine_Similarity: ---}

if __name__ == '__main__':
    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    inputs = 'tokenized_data'

    distilbert_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

    resume = sys.argv[0]
    resume_enc = encode(resume)

    main(inputs, resume_enc)