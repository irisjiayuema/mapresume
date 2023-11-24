<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
    <div v-if="data" v-for="(item, index) in data" :key="index">
      <h2>{{ item.Company }}</h2>
      <p>{{ item.Job_Description }}</p>
      <p><strong>Title:</strong> {{ item.Job_Title }}</p>
      <p><strong>Location:</strong> {{ item.Location }}</p>
      <p><strong>Link:</strong> <a :href="item.Link" target="_blank">Job Posting</a></p>
      <p><strong>Similarity:</strong> {{ item.Cosine_Similarity }}</p>
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
