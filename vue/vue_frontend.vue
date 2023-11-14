<template>
  <div class="container">
    <!-- Title -->
    <h1>{{ msg }}</h1>

    <!-- Notification -->
    <div v-if="notification" class="notification">{{ notification }}</div>

    <!-- Upload Section -->
    <section class="upload-section">
      <input type="file" ref="fileInput" @change="handleFileUpload" accept=".pdf" />
      <button @click="submitFile">Submit</button>
      <button v-if="uploaded" @click="matchJobs">Match Jobs</button>
    </section>

    <!-- Progress Bar -->
    <div v-if="isProcessing" class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Results Section -->
    <section v-if="jobs && jobs.length" class="results-section">
      <h2>Matched Jobs:</h2>
      <ul>
        <li v-for="job in jobs" :key="job.id" class="job-description">
          {{ job.description }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Resume Analysis System')
const uploaded = ref(false)
const jobs = ref([])
const fileInput = ref(null)
const notification = ref('') // For notification messages
const isProcessing = ref(false) // For showing the progress bar
const progress = ref(0) // Progress bar percentage

const handleFileUpload = () => {
  const file = fileInput.value.files[0]
  if (file && file.type === 'application/pdf') {
    uploaded.value = true
  } else {
    alert('Please upload a valid PDF file.')
  }
}
  
const submitFile = () => {
  if (!fileInput.value.files[0]) {
    alert('Please choose a file first.')
    return
  }
  notification.value = 'Resume Processing~'

  // Start processing and show progress bar
  isProcessing.value = true
  let interval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(interval)
      isProcessing.value = false
      notification.value = 'Processing completed!'
    }
  }, 1000)

  // Hide the notification after 20 seconds
  setTimeout(() => {
    notification.value = ''
  }, 50000)
}

const matchJobs = () => {
  jobs.value = [
    { id: 1, description: 'Software Engineer at TechCorp' },
    { id: 2, description: 'Frontend Developer at WebWorks' },
    { id: 3, description: 'Vue.js Specialist at VueVentures' },
  ]
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f8;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.notification {
  padding: 0.5rem 1rem;
  background-color: #2ecc71;
  color: white;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.upload-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.results-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  width: 70%;
  max-width: 600px;
}

.results-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  color: #333;
}

.results-section ul {
  list-style: none;
  padding: 0;
}

.job-description {
  font-size: 1.2rem;
  margin: 15px 0;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  transition: background-color 0.3s;
}

.job-description:hover {
  background-color: #e8e8e8;
}

.progress-bar {
  width: 70%;
  max-width: 600px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress {
  height: 100%;
  width: 0;
  background-color: #2ecc71;
  transition: width 0.5s;
}
</style>
