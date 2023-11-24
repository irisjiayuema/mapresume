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

from pyspark.sql.types import ArrayType, IntegerType, FloatType
from pyspark.sql.functions import udf, lower, regexp_replace, size, split

from numpy.linalg import norm

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

max_len = 512

def encode(text):
    enc = tokenizer.encode(text)
    len_enc = len(enc)
    if len_enc < max_len:
        enc += [0] * (max_len - len_enc)
    if len_enc > max_len:
        enc = enc[:max_len]
    return enc

def cos_sim(job):
    A = np.array(job)
    B = np.array(resume_enc)
    sim = float(np.dot(A,B)/(norm(A)*norm(B)))
    return sim

def main(inputs):

    df_encoding = spark.read.json(inputs)

    print(resume_keywords)

    cos_sim_udf = udf(cos_sim, FloatType())

    #df_filtered = df_encoding.filter(df_encoding['Job_Description'].rlike('({})\d'.format('|'.join(resume_keywords))))
    df_keywords = df_encoding.withColumn('keys', regexp_replace(df_encoding['Job_Description'], resume_keywords, '~~~'))
    df_keys = df_keywords.withColumn('Keywords_count', size(split(df_keywords['keys'], r"~~~")) - 1)
    df_filtered = df_keys.filter(df_keys['Keywords_count'] > 0)
    
    #df_filtered = df_encoding.filter(df_encoding['Job_Description'].rlike(resume_keywords))
    df_filtered.orderBy('Keywords_count', ascending = False).show()

    df_cos_sim = df_filtered.withColumn('Cosine_Similarity', cos_sim_udf(df_encoding['Encoding']))\
        .orderBy('Cosine_Similarity', ascending=False)   
    df_cos_sim.show()
    results = df_cos_sim.drop('Encoding').toJSON().take(10)
    print(results)
    # {Job Title: ---, Company: ---, Job Description: ---, Apply Url: ---, Cosine_Similarity: ---}

if __name__ == '__main__':
    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    inputs = 'tokenized_data'

    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    extractor = KeyphraseExtractionPipeline(model='ml6team/keyphrase-extraction-kbir-inspec')#"ml6team/keyphrase-extraction-distilbert-openkp")

    resume = sys.argv[1]
    resume_keywords = '|'.join(list(extractor(resume)))
    
    resume_enc = encode(resume)

    main(inputs)