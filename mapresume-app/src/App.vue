<template>
  <div>
    <nav class="navbar">
      <img alt="Vue logo" src="./assets/logo.png">
      <ul class="nav-links">
        <li><a href="#Home" class="nav-link">Home</a></li>
        <li><a href="#Resume Analysis System" class="nav-link">Resume Analysis System</a></li>
        <li><a href="#About" class="nav-link">About</a></li>
      </ul>
    </nav>

    <div class="main-container">
      <h1 class="title">Resume Analysis System</h1>
      <div v-if="responseMessage" class="response-message">{{ responseMessage }}</div>
      <div class="upload-container">
        <input type="file" ref="fileInput" @change="handleFileChange" class="file-input" />
        <button @click="uploadFile" class="button upload-button">Upload PDF</button>
        <button @click="matchResume" class="button match-button">Match</button>
      </div>
      <progress v-show="isProcessing" max="100" :value="progress"></progress>

      <div v-if="matchData.length" class="card-container">
        <div class="job-card">
          <h3><strong>Company:</strong> {{ currentJob.Company }}</h3>
          <p><strong>Job Title:</strong> {{ currentJob.jobTitle }}</p>
          <p><strong>Location:</strong> {{ currentJob.location }}</p>
          <p><strong>Validate:</strong> {{ currentJob.validate }}</p>
          <p><strong>Job Description:</strong> {{ currentJob.JobDescription }}</p>
          <p><strong>Cosine Similarity:</strong> {{ currentJob.cosineSimilarity }}</p>
          <a :href="currentJob.link" target="_blank">Job Link</a>
        </div>

        <div class="navigation">
          <button @click="navigateJob('previous')" class="nav-button">Previous</button>
          <span class="page-number">{{ currentIndex + 1 }}/{{ matchData.length }}</span>
          <button @click="navigateJob('next')" class="nav-button">Next</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      responseMessage: null,
      matchData: [],
      progress: 0,
      isProcessing: false,
      currentIndex: 0,
    };
  },
  computed: {
    currentJob() {
      return this.matchData[this.currentIndex];
    }
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('resume_file', this.selectedFile);

        axios.post('http://127.0.0.1:8000/upload/', formData)
          .then((response) => {
            this.responseMessage = response.data;
          })
          .catch((error) => {
            console.error('Axios Error:', error);
            alert(error);
          });
      } else {
        console.warn('No file selected');
      }
    },
    startProgressBar() {
      this.progress = 0;
      this.isProcessing = true;
      const interval = setInterval(() => {
        this.progress++;
        if (this.progress >= 100) {
          clearInterval(interval);
          //this.isProcessing = false;
        }
      }, 800); // 800ms interval for a total duration of 80 seconds
    },
    processMatchData(data) {
      return Object.values(data).map(item => ({
        Company: item.Company,
        jobTitle: item.Job_Title,
        JobDescription: item.Job_Description,
        link: item.Link,
        location: item.Location,
        validate: item.Validate,
        cosineSimilarity: item.Cosine_Similarity.toFixed(2)
      }));
    },
    matchResume() {
      this.startProgressBar();
      axios.get('http://127.0.0.1:8000/match/')
        .then((response) => {
          this.matchData = this.processMatchData(response.data);
          this.progress = 100;
        })
        .catch((error) => {
          console.error('Match Error:', error);
          alert('Error: ' + error.message);
        });
    },
    navigateJob(direction) {
      if (direction === 'next' && this.currentIndex < this.matchData.length - 1) {
        this.currentIndex++;
      } else if (direction === 'previous' && this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
  },
};
</script>



<style>
.main-container {
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.upload-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #f9f9f9;
}

.file-input {
  flex-grow: 1;
  margin-right: 10px;
  border: 1px solid #ddd;
  padding: 6px 10px;
  border-radius: 4px;
}

.button {
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.upload-button, .match-button {
  background-color: #007bff;
}

.upload-button:hover, .match-button:hover {
  background-color: #0069d9;
}

.response-message {
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  padding: 4px 8px;
  border-radius: 4px;
  color: #333;
  font-size: 0.9em;
}

.match-data {
  width: 100%;
  height: 200px;
  margin-top: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-family: monospace;
  background-color: #fffff;
  resize: none;
}

.main-container {
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
  background-color: #F4F8FA; /* Keep the container background white for contrast */
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

body {
  background-color: #F4F8FA; /* This is an example light blue color */
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

/* Navbar styles */
.navbar {
  background-color: #6495ED; /* Adjust to match your theme */
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.nav-link {
  display: block;
  padding: 8px 15px;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #0069d9;
}

/* Styles for the progress bar */
progress {
  width: 80%;
  height: 20px; /* Increased height for a thicker bar */
  margin-top: 20px;
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Optional shadow */
  overflow: hidden; /* Ensures the inside stays within the rounded corners */
}

progress::-webkit-progress-bar {
  background-color: #f3f3f3;
  border-radius: 15px;
}

progress::-webkit-progress-value {
  background: linear-gradient(to right, #4caf50, #81c784); /* Gradient fill */
  border-radius: 15px;
  animation: progressBarAnimation 80s linear; /* Animation over 80 seconds */
}

progress::-moz-progress-bar {
  background: linear-gradient(to right, #4caf50, #81c784); /* Gradient for Firefox */
  border-radius: 15px;
  animation: progressBarAnimation 80s linear; /* Animation for Firefox */
}

@keyframes progressBarAnimation {
  0% { width: 0%; }
  100% { width: 100%; }
}


/* ... job card styles ... */

.job-card {
  padding: 20px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #f9f9f9;
  text-align: left;
  max-width: 800px;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.nav-button {
  padding: 8px 16px;
  margin: 0 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #0069d9;
}

.page-number {
  font-size: 1em;
  margin: 0 10px;
}

.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
