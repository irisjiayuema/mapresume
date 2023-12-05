from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import json
import os
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess
import PyPDF2
from sshtunnel import SSHTunnelForwarder
import paramiko
import ast
from transformers import BartForConditionalGeneration, BartTokenizer

class ResumeSummarizer:
    def __init__(self):
        self.tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
        self.model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

    def summarize(self, text):
        inputs = self.tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
        outputs = self.model.generate(inputs, max_length=300, min_length=150, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content


def extract_and_summarize(pdf):
    text = extract_text_from_pdf(pdf)
    # print(text)
    # file_path = '/Users/yanzhiyao/Downloads/big-data-lab-I-final/Django/upload/tan.txt'
    # text = read_text_file(file_path)
    # print(text)
    # summarizer = ResumeSummarizer()
    # summary = summarizer.summarize(text)
    return text


def extract_text_from_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:  # Ensure there is text on the page
            text += page_text + " "  # Add a space after each page's text
    return text.strip()  # Remove any leading or trailing whitespace

def execute_spark(input_string):
    cmd = (f"bash -lc '/opt/bin/spark-submit /home/cwa260/big-data-lab-I-final/NLP/step2_sim.py \"{input_string}\" '")
    remote_server_ip = 'cluster.cs.sfu.ca'
    ssh_username = 'cwa260'
    ssh_password = 'Qwer19951029'
    remote_port = 24

    with SSHTunnelForwarder(
        (remote_server_ip, remote_port),
        ssh_username=ssh_username,
        ssh_password=ssh_password,
        local_bind_addresses=[('localhost', 8088), ('localhost', 9870)],
        remote_bind_addresses=[('controller.local', 8088), ('controller.local', 9870)]
    ) as server:
        
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(remote_server_ip, port=remote_port, username=ssh_username, password=ssh_password)
        
        stdin, stdout, stderr = ssh_client.exec_command(cmd)
        stdin_str = stdout.read().decode()
        stderr_str = stderr.read().decode()
        ssh_client.close()
        return stdin_str, stderr_str

@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        resume_file = request.FILES['resume_file']
        fs = FileSystemStorage()
        filename = fs.save(resume_file.name, resume_file)
        # do not parse the resume until user specify the filter info
        return HttpResponse(f"'{filename}' resume uploaded successfully")
    else:
        return render(request, 'upload.html')
    

@csrf_exempt
def match_jobs(request):
    if request.method == 'GET':
        fs = FileSystemStorage()
        list_of_files = fs.listdir('')[1]  # Replace 'your_directory_here' with the appropriate directory
        list_of_files.sort(key=lambda x: fs.get_created_time(os.path.join('', x)))  # Sort by creation time

        if list_of_files:
            latest_file = list_of_files[-1]
            file_path = fs.path(latest_file)
            with fs.open(file_path, 'rb') as pdf_file:
                # Now pdf_file is a file object for the previously saved PDF
                # Your logic here, for example, read the file, process it etc.
                # Now you have resume and user filter input
                # You can use resume to match jobs
                
                input_string = extract_and_summarize(pdf_file)
                print(input_string)

                stdin_str, stderr_str = execute_spark(input_string)
                index = stdin_str.find("['{")
                stdin_str = stdin_str[index:]
                #print(index)
                #print(stdin_str)
                evaluated_list = ast.literal_eval(stdin_str)
                combined_data = {}
                for index, json_str in enumerate(evaluated_list):
                    try:
                        data = json.loads(json_str)
                        combined_data[f'item_{index}'] = data
                    except json.JSONDecodeError as e:
                        return JsonResponse({'error': f'Invalid JSON at index {index}'}, status=400)
                
                # Return the combined data as a JsonResponse
                return JsonResponse(combined_data)
                
    else:
        return HttpResponse('Method not allowed', status=405)
