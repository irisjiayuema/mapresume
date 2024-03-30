import axios from 'axios';
import FormData from 'form-data';

async function postFile(file) {
  const formData = new FormData();
  formData.append('resume_file', file);

  const requestOptions = {
    method: 'post',
    url: 'https://cmpt733functionapp1.azurewebsites.net/api/step2',
    data: formData,
  };

  try {
    const response = await axios(requestOptions);
    console.log('File uploaded successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

const apiClient = axios.create({
  // baseURL: 'http://localhost:8080', 
  baseURL: 'https://cmpt733functionapp1.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


const getData = async (endpoint,params={}) => {
  try {
    const response = await apiClient.get(endpoint,{ params });
    return response.data; 
  } catch (error) {
    
    throw error;
  }
};


const postData = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data; 
    } catch (error) {
        throw error;
    }
}


export {getData,postData,postFile};