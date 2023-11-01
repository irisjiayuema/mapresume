import os
import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+
print(sys.executable)
os.system("pip install transformers")

from transformers import (
    TokenClassificationPipeline,
    AutoModelForTokenClassification,
    AutoTokenizer,
)
from transformers.pipelines import AggregationStrategy
import numpy as np
from pyspark.sql import SparkSession, functions, types
from girder.api.describe import Description

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

    df = spark.read.csv("../Static Data/indeed_full.csv", header=True)

    keywordsUDF = functions.udf(extractor)
    df.withColumn("Keywords", keywordsUDF(df['Job Description'])).select("Keywords").show()

if __name__ == '__main__':
    spark = SparkSession.builder.appName('Temperature Range SQL').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext

    model_name = "ml6team/keyphrase-extraction-kbir-inspec"
    extractor = KeyphraseExtractionPipeline(model=model_name)

    main()