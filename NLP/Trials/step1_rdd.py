import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from pyspark import SparkConf, SparkContext

from transformers import (
    TokenClassificationPipeline,
    AutoModelForTokenClassification,
    AutoTokenizer,
)
from transformers.pipelines import AggregationStrategy
from transformers import AutoTokenizer
import numpy as np

from pyspark.sql import SparkSession

import json

max_len = 512

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
        keywords = list(np.unique([result.get("word").strip() for result in results]))
        keywords_str = ';'.join(keywords)
        return keywords_str

def encode(text):
    enc = tokenizer.encode(text)
    len_enc = len(enc)
    if len_enc < max_len:
        enc += [0] * (max_len - len_enc)
    if len_enc > max_len:
        enc = enc[:max_len]
    return enc

def main(inputs):

    rdd = spark.read.json("test.json", multiLine=True)
    #rdd_filtered = rdd.filter(lambda x: x['JD'].isNotNull())
    print(rdd.take(1))

    # # filter out null Job Descriptions
    # df_filtered = df.where(df['JD'].isNotNull())

    # df_cleaned = df_filtered.select(ltrim(rtrim(regexp_replace(df_filtered['JT'], "[\n\r]", " "))).alias('Job_Title'),
    #     ltrim(rtrim(regexp_replace(df_filtered['Company'], "[\n\r]", " "))).alias('Company'),
    #     df_filtered['JD'].alias('Job_Description'),
    #     ltrim(rtrim(regexp_replace(df_filtered['Link'], "[\n\r]", " "))).alias('Link'),
    #     ltrim(rtrim(regexp_replace(df_filtered['Location'], "[\n\r]", " "))).alias('Location'),
    #     ltrim(rtrim(regexp_replace(df_filtered['Validate'], "[\n\r]", " "))).alias('Validate')
    #     )
    
    # tokenize_dbert_udf = udf(encode, ArrayType(IntegerType()))
    # # keywords_udf = udf(extractor, StringType())
    # #df_encoding = df_cleaned.withColumns({'Encoding': tokenize_dbert_udf(df_cleaned['Job_Description']),
    # #    'Keywords': keywords_udf(df_cleaned['Job_Description'])})
    # df_encoding = df_cleaned.withColumn('Encoding', tokenize_dbert_udf(df_cleaned['Job_Description']))
    
    # df_encoding.show()

    # df_encoding.write.json(output, compression='gzip', mode='overwrite')
    
    
if __name__ == '__main__':

    # set up
    spark = SparkSession.builder.appName('Final Project').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')

    conf = SparkConf().setAppName('example code')
    sc = SparkContext(conf=conf)
    sc.setLogLevel('WARN')

    inputs = 'Glassdoor_test_clean.json'
    output = 'tokenized_data'

    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    # Load pipeline
    model_name = "ml6team/keyphrase-extraction-kbir-inspec"
    extractor = KeyphraseExtractionPipeline(model=model_name)

    # stopwords_eng = set(stopwords.words('english'))

    main(inputs)