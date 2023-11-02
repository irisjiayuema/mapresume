from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import json
import os
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

import PyPDF2

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

def extract_and_summarize(pdf):
    text = extract_text_from_pdf(pdf)
    summarizer = ResumeSummarizer()
    summary = summarizer.summarize(text)
    print("Summary:", summary)


def extract_text_from_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


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
        #data = json.loads(request.body)
        #string_array = data.get('strings', [])
        #resume_filename = data.get('resume_file', '')
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
                
                string_test = extract_and_summarize(pdf_file)
                print(string_test)


                return JsonResponse({'received_data': file_path})
    else:
        return HttpResponse('Method not allowed', status=405)