import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from transformers import (
    TokenClassificationPipeline,
    AutoModelForTokenClassification,
    AutoTokenizer,
)
from transformers.pipelines import AggregationStrategy
import numpy as np
from pyspark.sql import SparkSession, functions, types
from girder.api.describe import Description

from pyspark.sql.types import ArrayType, IntegerType
from pyspark.sql.functions import udf

from numpy.linalg import norm

def encode(text):
    enc = distilbert_tokenizer.encode(text)
    pad = np.pad(enc, (0, max(0, 512 - len(enc))), 'constant')
    return list(pad)

def cos_sim(job):
    A = np.array(job)
    B = np.array(resume_enc)
    return np.dot(A,B)/(norm(A)*norm(B))

# Define keyphrase extraction pipeline
class KeyphraseExtractionPipeline(TokenClassificationPipeline):
    def __init__(self, model, *args, **kwargs):
        super().__init__(
            model=AutoModelForTokenClassification.from_pretrained(model),
            tokenizer=AutoTokenizer.from_pretrained(model),
            *args,
            **kwargs
        )
    def postprocess(self, all_outputs):
        results = super().postprocess(
            all_outputs=all_outputs,
            aggregation_strategy=AggregationStrategy.SIMPLE,
        )
        return np.unique([result.get("word").strip() for result in results])

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
    df_filtered = df = df.where(df['Job Description'].isNotNull())
    
    #keywordsUDF = functions.udf(extractor)
    # tokenize_udf = udf(tokenizer.encode, ArrayType(IntegerType()))
    tokenize_dbert_udf = udf(encode, ArrayType(IntegerType()))
    cos_sim_udf = udf(cos_sim, IntegerType())
    
    #df_keywords = df_filtered.withColumn("Keywords", keywordsUDF(df['Job Description']))
    # df_encoding = df_filtered.withColumns({"Encoding_Extractor": tokenize_udf(df['Job Description']),
    #                         'Encoding_Distilbert': tokenize_dbert_udf(df['Job Description'])})

    # df_encoding.select(['Job Description', 'Encoding_Extractor', 'Encoding_Distilbert']).show(truncate=False)

    df_encoding = df_filtered.withColumn('Encoding_Distilbert', tokenize_dbert_udf(df['Job Description']))
    df_cos_sim = df_encoding.withColumn('Cosine_Similarity', cos_sim_udf(df_encoding['Encoding_Distilbert']))\
        .orderBy('Cosine_Similarity', ascending=False)

    results = df_cos_sim.take(10)
    print(results)

if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Temperature Range SQL').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    model_name = "ml6team/keyphrase-extraction-kbir-inspec"
    extractor = KeyphraseExtractionPipeline(model=model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    distilbert_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

    # sample resume
    resume = 'Software'
    resume_enc = encode(resume)

    main()