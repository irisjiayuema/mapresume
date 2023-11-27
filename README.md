# big-data-lab-I-final
CMPT 732 Final

To run Django on localhost

On your Terminal or Console
1. run cmd: pip install django
2. pip install django-cors-headers
3. pip install PyPDF2
4. pip install sshtunnel
5. pip install transformers
6. change directory to "...\big-data-lab-I-final\Django"
7. run cmd: python manage.py runserver
this should start the Django server, you can check by visiting http://127.0.0.1:8000/

Some tips for Django
1. Since Django is a backend server, you can use postman to simulate user request
2. For Core logic and Resume Parsing, you only need to modify this file D:\GitHubRepo\big-data-lab-I-final\Django\upload\views.py

To run VUE on localhost

On your Terminal or Console
1. cd to project folder
2. npm install -g @vue/cli
3. vue create my-vue-app (mapresume-app already created)
4. cd mapresume-app
5. npm run serve
6. http://localhost:8080/
