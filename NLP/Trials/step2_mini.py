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
from pyspark.sql import SparkSession

from pyspark.sql.types import FloatType
from pyspark.sql.functions import udf, regexp_replace, size, split

from numpy.linalg import norm

# keyphrase extraction model - as https://huggingface.co/ml6team/keyphrase-extraction-kbir-inspec
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

# get the cosine similarity between encodings
def cos_sim(job):
    A = np.array(job)
    B = np.array(resume_enc)
    sim = float(np.dot(A,B)/(norm(A)*norm(B)))
    return sim


def main(inputs):

    # read the json
    df_encoding = spark.read.json(inputs)
    df_encoding.show()
    # filter to only job descriptions with key words
    df_keywords = df_encoding.withColumn('keys', regexp_replace(df_encoding['Job_Description'], resume_keywords, '~~~'))
    df_keys = df_keywords.withColumn('Keywords_count', size(split(df_keywords['keys'], r"~~~")) - 1)
    df_filtered = df_keys.filter(df_keys['Keywords_count'] > 0)

    # add the cosine similarity to the resume as a column
    cos_sim_udf = udf(cos_sim, FloatType())
    df_cos_sim = df_filtered.withColumn('Cosine_Similarity', cos_sim_udf(df_filtered['Encoding'])).drop(df_filtered['keys']).drop(df_filtered['Keywords_count']) \
        .orderBy('Cosine_Similarity', ascending=False)  
    df_cos_sim.show()

    # print the top 10
    results = df_cos_sim.drop('Encoding').toJSON().take(10)
    print(results)

if __name__ == '__main__':
    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')

    # get the processed data
    inputs = 'tokenized_data'

    # set the models
    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    extractor = KeyphraseExtractionPipeline(model='ml6team/keyphrase-extraction-kbir-inspec')#"ml6team/keyphrase-extraction-distilbert-openkp")

    # extract keywords from the resume and encode
    resume = sys.argv[1]
    resume_keywords = '|'.join(list(extractor(resume)))
    resume_enc = encode(resume)

    main(inputs)