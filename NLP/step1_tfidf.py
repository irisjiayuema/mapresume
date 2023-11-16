import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

import numpy as np
from pyspark.sql import SparkSession, functions, types

from pyspark.sql.types import ArrayType, IntegerType, FloatType, StringType
from pyspark.sql.functions import ltrim, rtrim, trim, regexp_replace
from pyspark.sql.functions import udf

from pyspark.ml.feature import StopWordsRemover
import nltk
#nltk.download('stopwords')
from nltk.corpus import stopwords

def encode(text):
    enc = tokenizer.encode(text)
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

    df_cleaned = df_filtered.select(ltrim(rtrim(regexp_replace(df_filtered['JT'], "[\n\r]", " "))).alias('Job_Title'),
        ltrim(rtrim(regexp_replace(df_filtered['Company'], "[\n\r]", " "))).alias('Company'),
        df_filtered['JD'].alias('Job_Description'),
        ltrim(rtrim(regexp_replace(df_filtered['Link'], "[\n\r]", " "))).alias('Link'),
        ltrim(rtrim(regexp_replace(df_filtered['Location'], "[\n\r]", " "))).alias('Location'),
        ltrim(rtrim(regexp_replace(df_filtered['Validate'], "[\n\r]", " "))).alias('Validate')
        )


    remover = StopWordsRemover(stopWords=stopwords_eng)
    remover.setInputCol("Job_Description")
    remover.setOutputCol("sw")

    remover.transform(df_cleaned).show()
    df_encoding.show()

    #df_encoding.write.json(output, compression='gzip', mode='overwrite')
    
    
if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    inputs = 'Glassdoor_test_clean.json'
    output = 'tokenized_data_tfidf'

    stopwords_eng = stopwords.words('english')

    main(inputs)