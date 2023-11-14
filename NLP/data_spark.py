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

def main():
    # read data
    columns = ['Job Title',
                'Job Description',
                'Job Type',
                'Categories',
                'Location',
                'City',
                'State',
                'Country',
                'Zip Code',
                'Address',
                'Salary From',
                'Salary To',
                'Salary Period',
                'Apply Url',
                'Apply Email',
                'Employees',
                'Industry',
                'Company Name',
                'Employer Email',
                'Employer Website',
                'Employer Phone',
                'Employer Logo',
                'Companydescription',
                'Employer Location',
                'Employer City',
                'Employer State',
                'Employer Country',
                'Employer Zip Code',
                'Uniq Id',
                'Crawl Timestamp']
    
    sch_cols = []
    for col in columns:
        sch_cols.append(types.StructField(col, types.StringType()))
    sch = types.StructType(sch_cols)

    df = spark.read.csv("../Static Data/indeed.csv", header=True)
    # filter out null Job Descriptions
    df_filtered = df.where(df['Job Description'].isNotNull())
    
    tokenize_dbert_udf = udf(encode, ArrayType(IntegerType()))
    df_encoding = df_filtered.withColumn('Encoding_Distilbert', tokenize_dbert_udf(df['Job Description']))

    cos_sim_udf = udf(cos_sim, FloatType())
    df_cos_sim = df_encoding.withColumn('Cosine_Similarity', cos_sim_udf(df_encoding['Encoding_Distilbert']))\
        .orderBy('Cosine_Similarity', ascending=False)

    results = df_cos_sim.select('Job Title', 'Company Name', 'Job Description', 'Apply Url', 'Encoding_Distilbert', 'Cosine_Similarity').take(10)
    print(results)
    # {Job Title: ---, Company: ---, Job Description: ---, Apply Url: ---, Cosine_Similarity: ---}
    
if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    distilbert_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

    # sample resume
    resume = '''XinTan is studying at SimonFraser University in Burnaby, Canada. He is working on a $15,000 scholarship at Apple in Suzhou, China. His major is Computer Science and his minors are Computer Engineering and Environmental Engineering. He also works as a developer for Apple's iOS app, Apple Watch, and Macbook Pro. He has also worked for Google and Facebook. He lives in China with his parents. He plans to study in the U.S. in the fall. He hopes to work for Apple in the future, but hasn't yet decided on a major or a major, and is currently working on his Master's degree in computer science and environmental engineering at Simon Fraser University, Burnaby. He works with Apple's iWatch, Apple's iPhone, and Apple Watch.'''
    resume_enc = encode(resume)

    main()