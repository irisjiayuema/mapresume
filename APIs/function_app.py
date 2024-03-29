import azure.functions as func
import logging
import azure.functions as func
import logging
import os
import sys
import subprocess
import json
import subprocess
import PyPDF2
from sshtunnel import SSHTunnelForwarder
import paramiko
import ast
from transformers import BartForConditionalGeneration, BartTokenizer
from azure.identity import DefaultAzureCredential
import pymssql
import tempfile
from PyPDF2 import PdfReader

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
server = 'sfu733server.database.windows.net'
database = 'JobInfoData'
username = 'sfu733login'
password = 'sfu733password!!'


def run_spark_submit_via_ssh(input_string):
    ssh_key_path = "MLVM_key.pem"  # Consider securely fetching this from Azure Key Vault
    ssh_host = "20.55.107.3"
    ssh_user = "azureuser"
    #spark_command = "/home/chen.wang.ms/big-data-lab-I-final/myprojectenv/bin/spark-submit /home/chen.wang.ms/big-data-lab-I-final/NLP/step2_sim.py \"software\""
    spark_command = f"bash -lc 'cd /home/chen.wang.ms/big-data-lab-I-final/NLP; /home/chen.wang.ms/.local/bin/spark-submit step2_polars.py \"{input_string}\" '"
    #ssh -i C:\Users\chenw\OneDrive\Desktop\BigDataII\MLVM_key.pem azureuser@20.55.107.3
    # Initialize SSH client
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect using private key
    private_key = paramiko.RSAKey.from_private_key_file(ssh_key_path)
    ssh.connect(hostname=ssh_host, username=ssh_user, pkey=private_key)

    # Execute command
    stdin, stdout, stderr = ssh.exec_command(spark_command)
    output = stdout.read()

    # Cleanup
    ssh.close()

    return output

def extract_text_from_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:  # Ensure there is text on the page
            text += page_text + " "  # Add a space after each page's text
    return text.strip()  # Remove any leading or trailing whitespace

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
@app.route(route="step2", methods=['GET'])
def sql_query_demo(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_pdf:
            temp_pdf.write(req.get_body())
            temp_pdf_path = temp_pdf.name
        
        with open(temp_pdf_path, 'rb') as pdf_file:
            input_string = extract_text_from_pdf(pdf_file)
            
        out = run_spark_submit_via_ssh(input_string)
        return func.HttpResponse(f"output:, {out}", status_code=200)
    except Exception as e:
        error_message = str(e).encode('utf-8')
        return func.HttpResponse(f"exception happened!!!: {error_message}", status_code=500)
    
@app.route(route="job_count", methods=['GET'], auth_level=func.AuthLevel.ANONYMOUS)
def job_count(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Extract parameters from the query string
        industry_name = req.params.get('industry_name')
        company_industry = req.params.get('company_industry')
        formatted_experience_level = req.params.get('formatted_experience_level')

        # Start with the base query
        query = "SELECT location, COUNT(*) AS JobCount FROM jobs_all"
        conditions = []
        params = []

        # Append conditions and parameters only if they are provided
        if industry_name:
            conditions.append("industry_name = %s")
            params.append(industry_name)
        if company_industry:
            conditions.append("company_industry = %s")
            params.append(company_industry)
        if formatted_experience_level:
            conditions.append("formatted_experience_level = %s")
            params.append(formatted_experience_level)

        # If there are conditions, append them to the query
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        # Add the GROUP BY and ORDER BY clauses
        query += " GROUP BY location ORDER BY JobCount DESC;"

        # Assuming 'server', 'username', 'password', and 'database' are defined elsewhere
        cnxn = pymssql.connect(server=server, user=username, password=password, database=database)
        cursor = cnxn.cursor(as_dict=True)

        # Execute the dynamically constructed query
        cursor.execute(query, tuple(params))

        # Fetch data
        rows = cursor.fetchall()
        data = [{"name": row["location"], "value": row["JobCount"]} for row in rows]

        # Close the connection
        cursor.close()
        cnxn.close()

        if data:
            # Convert the data to JSON and return it
            json_data = json.dumps(data)
            return func.HttpResponse(body=json_data, status_code=200, mimetype="application/json")
        else:
            return func.HttpResponse("No data found", status_code=404)
    except pymssql.Error as e:
        # Log and return the database-related error message
        logging.error(f'Database error: {str(e)}')
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    except Exception as e:
        # Log and return any other error message
        logging.error(f'Error: {str(e)}')
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)

    

@app.route(route="jobs_average_salary", auth_level=func.AuthLevel.ANONYMOUS)
def jobs_average_salary(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Extract parameters from the query string
        company_industry = req.params.get('company_industry')
        job_industry = req.params.get('industry_name')
        experience_level = req.params.get('formatted_experience_level')

        # Start with the base query
        query = "SELECT location, AVG(med_salary) AS AverageSalary FROM jobs_all"
        conditions = []
        params = []

        # Append conditions and parameters only if they are provided
        if company_industry:
            conditions.append("company_industry = %s")
            params.append(company_industry)
        if job_industry:
            conditions.append("industry_name = %s")
            params.append(job_industry)
        if experience_level:
            conditions.append("formatted_experience_level = %s")
            params.append(experience_level)

        # If there are conditions, append them to the query
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " GROUP BY location ORDER BY AverageSalary DESC;"
        
        # Assuming 'server', 'username', 'password', and 'database' are defined elsewhere
        cnxn = pymssql.connect(server=server, user=username, password=password, database=database)
        cursor = cnxn.cursor(as_dict=True)

        # Execute the dynamically constructed query
        cursor.execute(query, tuple(params))

        # Fetch data
        rows = cursor.fetchall()
        data = [{"name": row["location"], "value": row["AverageSalary"]} for row in rows]

        # Close the connection
        cursor.close()
        cnxn.close()

        if data:
            # Convert the data to JSON and return it
            json_data = json.dumps(data)
            return func.HttpResponse(body=json_data, status_code=200, mimetype="application/json")
        else:
            return func.HttpResponse("No data found", status_code=404)
    except pymssql.Error as e:
        # Log and return the database-related error message
        logging.error(f'Database error: {str(e)}')
        return func.HttpResponse(f"Database error: {str(e)}", status_code=500)
    except Exception as e:
        # Log and return any other error message
        logging.error(f'Error: {str(e)}')
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
