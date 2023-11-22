<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileChange" />
    <button @click="uploadFile">Upload PDF</button>
    <div v-if="responseMessage">{{ responseMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedFile: null,
      responseMessage: null,
    };
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
            alert(response.data)
          })
          .catch((error) => {
            console.error('Axios Error:', error); // Log the full error details
            alert(error)
            //alert(error)
          });
      } else {
        // Handle the case where no file is selected
        console.warn('No file selected');
      }
    },
  },
};
</script>
