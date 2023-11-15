import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from transformers import AutoTokenizer
import numpy as np
from pyspark.sql import SparkSession, functions, types

from pyspark.sql.types import ArrayType, IntegerType, FloatType
from pyspark.sql.functions import udf

max_len = 512

def encode(text):
    enc = distilbert_tokenizer.encode(text)
    len_enc = len(enc)
    if len_enc < max_len:
        enc += [0] * (max_len - len_enc)
    if len_enc > max_len:
        enc = enc[:max_len]
    return enc

def main(inputs):

    df = spark.read.json(inputs)
    # filter out null Job Descriptions
    df_filtered = df.where(df['JD'].isNotNull())

    #df_cleaned = df_filtered.select('JT', df_filtered['JT'].strip())
    
    tokenize_dbert_udf = udf(encode, ArrayType(IntegerType()))
    #df_encoding = df_cleaned.withColumn('Encoding_Distilbert', tokenize_dbert_udf(df['JD']))
    df_encoding = df_filtered.withColumn('Encoding_Distilbert', tokenize_dbert_udf(df['JD']))

    df_encoding.write.json(output, compression='gzip', mode='overwrite')
    
    
if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    inputs = 'Test2.json'
    output = 'tokenized_data'

    distilbert_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

    main(inputs)