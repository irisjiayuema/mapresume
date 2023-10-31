from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import json
import os
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
                
                return JsonResponse({'received_data': file_path})
    else:
        return HttpResponse('Method not allowed', status=405)