from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import json
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
    if request.method == 'POST':
        data = json.loads(request.body)
        string_array = data.get('strings', [])
        resume_filename = data.get('resume_file', '')
        fs = FileSystemStorage()
        if fs.exists(pdf_filename):
            with fs.open(pdf_filename, 'rb') as pdf_file:
                # Now pdf_file is a file object for the previously saved PDF
                # Your logic here, for example, read the file, process it etc.
                # Now you have resume and user filter input
                # You can use resume to match jobs
                pass

        return JsonResponse({'received_data': string_array})
    else:
        return HttpResponse('Method not allowed', status=405)