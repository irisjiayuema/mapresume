<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
    <div v-if="data"> <!-- Wrapper element with v-if -->
      <div v-for="(item, index) in data" :key="index"> <!-- v-for is on a child element -->
        <h2>{{ item.Company }}</h2>
        <p>{{ item.Job_Description }}</p>
        <p><strong>Title:</strong> {{ item.Job_Title }}</p>
        <p><strong>Location:</strong> {{ item.Location }}</p>
        <a :href="item.Link" target="_blank">Job Posting</a>
        <p><strong>Similarity:</strong> {{ item.Cosine_Similarity }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: null
    }
  },
  methods: {
    fetchData() {
      axios.get('http://127.0.0.1:8000/match')
        .then(response => {
          // Assuming the response data is in the format shown in your image
          this.data = Object.values(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  }
}
</script>
