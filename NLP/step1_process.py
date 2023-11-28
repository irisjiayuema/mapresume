import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from transformers import AutoTokenizer
import numpy as np
from pyspark.sql import SparkSession

from pyspark.sql.types import ArrayType, IntegerType
from pyspark.sql.functions import ltrim, rtrim, regexp_replace
from pyspark.sql.functions import udf

# this is the value of the model's maximum number of tokens
max_len = 512

# this function encodes the given text using the AutoTokenizer and truncates/pads as necessary
def encode(text):
    enc = tokenizer.encode(text)
    len_enc = len(enc)
    if len_enc < max_len:
        enc += [0] * (max_len - len_enc)
    if len_enc > max_len:
        enc = enc[:max_len]
    return enc


def main(inputs):

    # read the json 
    df = spark.read.json(inputs)
    # filter out null Job Descriptions
    df_filtered = df.where(df['JD'].isNotNull())

    # clean the text formatting of the columns
    # note that lowercase was not applied to maintain important acronyms
    df_cleaned = df_filtered.select(ltrim(rtrim(regexp_replace(df_filtered['JT'], "[\n\r]", " "))).alias('Job_Title'),
        ltrim(rtrim(regexp_replace(df_filtered['Company'], "[\n\r]", " "))).alias('Company'),
        df_filtered['JD'].alias('Job_Description'),
        ltrim(rtrim(regexp_replace(df_filtered['Link'], "[\n\r]", " "))).alias('Link'),
        ltrim(rtrim(regexp_replace(df_filtered['Location'], "[\n\r]", " "))).alias('Location'),
        ltrim(rtrim(regexp_replace(df_filtered['Validate'], "[\n\r]", " "))).alias('Validate')
        )
    
    # apply the encoding
    tokenize_dbert_udf = udf(encode, ArrayType(IntegerType()))
    df_encoding = df_cleaned.withColumn('Encoding', tokenize_dbert_udf(df_cleaned['Job_Description']))
    
    # check the encoding by outputting to standard output
    df_encoding.show()
    # save the encoded data
    df_encoding.write.json(output, compression='gzip', mode='overwrite')
    
    
if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')

    inputs = 'Glassdoor_test_clean.json'
    output = 'tokenized_data'

    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

    main(inputs)