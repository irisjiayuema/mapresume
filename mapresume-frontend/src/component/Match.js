import React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import '../assets/style/Match.css';
import { getData, postFile} from '../service/ApiService.js';



function Match() {
  const mockData = [{
    Company: 'Google',
    jobTitle: 'Software Engineer',
    location: 'Mountain View, CA',
    JobDescription: 'Design and develop software for Google products.',
    cosineSimilarity: 0.9,
    link: 'https://www.google.com'
  }, {
    Company: 'Facebook',
    jobTitle: 'Product Manager',
    location: 'Menlo Park, CA',
    JobDescription: 'Manage product development and work with engineering teams.',
    cosineSimilarity: 0.85,
    link: 'https://www.facebook.com'
  }]
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matchData, setMatchData] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [testText,setTestText] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const matchResume = async () => {
    if (!file) {
      setResponseMessage('Please upload a file');
      return;
    }
    setIsProcessing(true);
    try {
      const data = await postFile(file);
      console.log('success!')
      console.log(data);
      setTestText(data);
      setMatchData(mockData); 
      setCurrentJob(mockData[0]);
    } catch (error) {
      console.log(error)
      setResponseMessage('Error matching resume');
    }
    
  };


  const navigateJob = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'previous') {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'next') {
      newIndex = Math.min(matchData.length - 1, currentIndex + 1);
    }
    setCurrentIndex(newIndex);
    setCurrentJob(matchData[newIndex] || {});
  };

  return (
    <div className="main-container">
      <h1 className="title">Map Resume</h1>
      {responseMessage && <div className="response-message">{responseMessage}</div>}
      <div className="upload-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={matchResume}
        >
          Match
        </Button>
        {/* <Button onClick={matchResume} variant="contained"  startIcon={<PlayCircleFilledWhiteIcon />}>Match</Button> */}
      </div>
      {isProcessing && <progress max="100" value={progress}></progress>}

      {matchData.length > 0 && (
        <div className="card-container">
          <div className="job-card">
            <h3><strong>Company:</strong> {currentJob.Company}</h3>
            <p><strong>Job Title:</strong> {currentJob.jobTitle}</p>
            <p><strong>Location:</strong> {currentJob.location}</p>
            <p><strong>Job Description:</strong> {currentJob.JobDescription}</p>
            <p><strong>Similarity:</strong> {currentJob.cosineSimilarity}</p>
            <a href={currentJob.link} target="_blank" rel="noopener noreferrer">Job Link</a>
          </div>

          <div className="navigation">
            <button onClick={() => navigateJob('previous')} className="nav-button">Previous</button>
            <span className="page-number">{currentIndex + 1}/{matchData.length}</span>
            <button onClick={() => navigateJob('next')} className="nav-button">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Match;