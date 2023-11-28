import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

import numpy as np
from pyspark.sql import SparkSession, functions, types

from pyspark.sql.types import ArrayType, IntegerType, FloatType, StringType
from pyspark.sql.functions import ltrim, rtrim, trim, regexp_replace
from pyspark.sql.functions import udf

from pyspark.ml.feature import HashingTF as MLHashingTF
from pyspark.ml.feature import IDF as MLIDF
from pyspark.sql.types import DoubleType

from pyspark.ml.feature import StopWordsRemover
import nltk
#nltk.download('stopwords')
from nltk.corpus import stopwords
import pyspark.sql.functions as F

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


    remover = StopWordsRemover(stopWords=stopwords_eng, inputCol="tokens_lower", outputCol="stop")

    df = df_cleaned.withColumn("tokens", F.split("Job_Description", "\\s+")).withColumn("tokens_lower", F.expr("transform(tokens, x -> lower(x))"))
    df_stop = remover.transform(df).select(df["Job_Description"], 'stop')
    
    htf = MLHashingTF(inputCol="stop", outputCol="tf")
    tf = htf.transform(df_stop)

    idf = MLIDF(inputCol="tf", outputCol="idf")
    tfidf = idf.fit(tf).transform(tf)

    #sum_ = udf(lambda v: float(v.values.sum()), DoubleType())
    #tfidf.withColumn("idf_sum", sum_("idf")).show()
    
    df_resume = spark.createDataFrame([{'resume': resume}])
    df_resume_cleaned = df_resume.withColumn("tokens", F.split("resume", "\\s+")).withColumn("tokens_lower", F.expr("transform(tokens, x -> lower(x))"))
    df_resume_stop = remover.transform(df_resume_cleaned).select(df_resume_cleaned["resume"], 'stop')

    df_resume_tf = htf.transform(df_resume_stop)
    df_resume_tfidf = idf.fit(tf).transform(df_resume_tf)
    
    resume_tfidf = (df_resume_tfidf.take(1))[0]
    print(resume_tfidf['idf'])



    #remover.transform(df_cleaned).show()
    #df_encoding.show()

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

    resume = '''  Chen Wang is a software developer at Huawei in Shenzhen, China. He is a key contributor to commercialized Distributed Cache Service for Redis project. He has also worked as Tech Lead in 6-member Autodesk Civil3D team, fostering cross -functional collaboration within "Development, Environment, and Extension" Squad. His resume matches jobs based on his work experience and his knowledge of programming languages such as C/C++, Python, and Spark. He also has a master's degree in Professional Computer Science from Simon Fraser University in Vancouver, Canada, and a PhD in Software Engineering from the University of California, Irvine. He currently works for Huawei in the Shenzhen branch of the company's software development division, which is based in China. '''

    main(inputs)