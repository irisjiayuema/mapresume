import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from sentence_transformers import SentenceTransformer
import numpy as np
from pyspark.sql import SparkSession
import subprocess
from pyspark.sql.types import ArrayType, FloatType
from pyspark.sql.functions import ltrim, rtrim, regexp_replace
from pyspark.sql.functions import udf

# this function encodes the given text using the AutoTokenizer and truncates/pads as necessary
def encode(text):
    enc = [x.item() for x in list(tokenizer.encode(text))]
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
    tokenize_udf = udf(encode, ArrayType(FloatType()))
    df_encoding = df_cleaned.withColumn('Encoding', tokenize_udf(df_cleaned['Job_Description']))
    
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
    output = 'tokenized_data_dot'

    tokenizer = SentenceTransformer("msmarco-distilbert-dot-v5")

    main(inputs)
    result = subprocess.run('hdfs dfs -copyFromLocal tokenized_data_dot tokenized_data_dot', shell=True, stdout=subprocess.PIPE, text=True)
    print(result.stdout)