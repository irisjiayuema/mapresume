# MapResume

## CMPT 733 Final Project

## Video
https://youtu.be/QRmiVC7k4V4

Website (Live until April 9, 2024): http://54.213.254.255/

## Frontend
We used AWS to deploy. To run it locally, follow the instructions here
```
cd ./mapresume-frontend
npm install
npm run start
```

The website will run on localhost:3000.

## Backend - ServerlessAPI

We deployed our resource on Azure Portal which contains the following components

- API - Azure Function Apps
	- Related code are stored in ./APIs folder
- VM - Linux 
	- Git clone repo into this VM
	- Install required packages to run ./NLP/Step1 (optional - run if data updated) and ./NLP/Step2 
- DataServer - MySQL database
	- Upload Kaggle data into this database
> Note: resources mentioned above will be available until April 9, 2024

## How to Navigate the Website
The website consist of following subpages

- Home: Interactive map which you can explore the market trends under different filters
- Charts: Correlation and scatter plot
- Match: Upload resume and get top 10 matched jobs and show more metrics about your matches
- About: Contributor information
