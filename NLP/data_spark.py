import sys
assert sys.version_info >= (3, 5) # make sure we have Python 3.5+

from pyspark.sql import SparkSession, functions, types

# add more functions as necessary

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
    df.show()

if __name__ == '__main__':
    spark = SparkSession.builder.appName('Temperature Range SQL').getOrCreate()
    assert spark.version >= '3.0' # make sure we have Spark 3.0+
    spark.sparkContext.setLogLevel('WARN')
    sc = spark.sparkContext
    main()