import React from 'react';
import { useState,useEffect } from 'react';
import '../assets/style/Match.css';
import {postFile} from '../service/ApiService.js';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Link } from '@mui/material';
import PieChartAM from './PieChartAM.js';
import BarChartAM from './BarChartAM.js';
import JobIndustryBar from './JobIndustryBar.js';
import { DataGrid } from '@mui/x-data-grid';


function Match() {
  const mockData = [
    {
      company_name: 'Google',
      title: 'Software Engineer',
      location: 'Mountain View, CA',
      description: 'Design and develop software for Google products.',
      Similarity: 0.9,
      job_posting_url: 'https://www.google.com',
      skill_name: 'Python',
      industry_name:'Software Development',
      compensation_type:'BASE_SALARY',
      currency:'USD',
      work_type:'CONTRACT',
      med_salary:'100000',
      state_abbr: 'CA'

    }, {
      company_name: 'Facebook',
      title: 'Product Manager',
      location: 'Menlo Park, CA',
      description: 'Manage product development and work with engineering teams.',
      Similarity: 0.85,
      job_posting_url: 'https://www.facebook.com',
      skill_name: 'Java',
      industry_name:'Staffing and Recruiting',
      compensation_type:'BASE_SALARY',
      currency:'USD',
      work_type:'CONTRACT',
      med_salary:'100000',
      state_abbr: 'CA'

  },{
      company_name: 'Another Company',
      title: 'Data Scientist',
      location: 'Somewhere, CA',
      description: 'Analyze data and build predictive models.',
      Similarity: 0.75,
      job_posting_url: 'https://www.example.com',
      skill_name: 'Python',
      industry_name:'IT Services and IT Consulting',
      compensation_type:'BASE_SALARY',
      currency:'USD',
      work_type:'CONTRACT',
      med_salary:'100000',
      state_abbr: 'NY'
  }];

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Position', width: 160 },
    { field: 'work_type', headerName: 'Position Type', width: 130 },
    { field: 'company_name', headerName: 'Company Name', width: 150 },
    { field: 'compensation_type', headerName: 'Compensation', width: 120 },
    { field: 'med_salary', headerName: 'Salary',  width: 80 },
    { field: 'currency', headerName: 'Currency', width: 80 },

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
  ]

  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [jobIndustryData, setJobIndustryData] = useState([]);
  const [statAnalysis, setStatAnalysis] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const matchResume = async () => {
    if (!file) {
      setResponseMessage('Please upload a file');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await postFile(file);
      setIsMatched(true);
      console.log('success!')
      // console.log(data);
      // const jobsList = mockData;
      const jobsList = [];

      const numRows = data.columns[0].values.length;

      for (let i = 0; i < numRows; i++) {
          const job = {};
          data.columns.forEach(column => {
              job[column.name] = column.values[i];
          });
          jobsList.push(job);
      }
      setIsLoading(false);
      setMatchData(jobsList); 
      setCurrentJob(jobsList[0]);

    } catch (error) {
      console.log(error)
      setResponseMessage('Error matching resume');
      setIsLoading(false);
    }
    
  };

  // const navigateJob = (direction) => {
  //   let newIndex = currentIndex;
  //   if (direction === 'previous') {
  //     newIndex = Math.max(0, currentIndex - 1);
  //   } else if (direction === 'next') {
  //     newIndex = Math.min(matchData.length - 1, currentIndex + 1);
  //   }
  //   setCurrentIndex(newIndex);
  //   setCurrentJob(matchData[newIndex] || {});
  // };

  useEffect(() => {
    if (matchData.length > 0) {
      setIsChartVisible(true);
    }else{
      return;
    }

    const skillCount = matchData.reduce((acc, {skill_name}) => {
      acc[skill_name] = (acc[skill_name] || 0) + 1;
      return acc;
    }, {});
    
    const result = Object.entries(skillCount).map(([category, value]) => ({ category, value }));
    
    setPieData(result);

    const jobIndustryCount = matchData.reduce((acc, {industry_name}) => {
      acc[industry_name] = (acc[industry_name] || 0) + 1;
      return acc;
    }
    ,{});

    const jobIndustryRes = Object.entries(jobIndustryCount).map(([industry, value]) => ({ industry, value }));
    setJobIndustryData(jobIndustryRes);

    const statisticData = matchData.map((job,index) => { return { 
          id: index+1,
          company_name: job.company_name, 
          title: job.title, 
          work_type: job.work_type,
          compensation_type: job.compensation_type,  
          experience_level: job.formatted_experience_level, 
          med_salary: job.med_salary, 
          currency:job.currency
        }});

    setStatAnalysis(statisticData);

    const jobLocationCount = matchData.reduce((acc, {state_abbr}) => {
      acc[state_abbr] = (acc[state_abbr] || 0) + 1;
      return acc;
    },{});

    const jobLocationRes = Object.entries(jobLocationCount).map(([state, value]) => ({ state, value }));

    setBarData(jobLocationRes);

  }, [matchData]);

  useEffect(() => {
    setResponseMessage('');
  }, [file]);

  useEffect(() => {

  }, [currentJob]);
  return (
    <div className="main-container">
      <h1 className="title">Map Resume</h1>
      {responseMessage && <div className="response-message">{responseMessage}</div>}
      <div className="upload-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <LoadingButton
            loading = {isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            onClick={matchResume}
        >
          Match
        </LoadingButton>
      </div>
      

      {statAnalysis && statAnalysis.length>0 &&  <DataGrid
          rows={statAnalysis}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          onCellClick={(params, event) => {
            // setCurrentJob(matchData[params.row.id - 1]);
            setCurrentJob({ ...matchData[params.row.id - 1] });
            // console.log(currentJob.title);
          }}
      />}

      {matchData.length > 0 && isDisplaying && (
        <div className="card-container">
          <div className="job-card">
            <h3><strong>Company:</strong> {currentJob['company_name']}</h3>
            <p><strong>Job Title:</strong> {currentJob['title']}</p>
            <p><strong>Location:</strong> {currentJob['location']}</p>
            <p><strong>Description:</strong> {currentJob['company_description']}</p>
            <p><strong>Similarity:</strong> {currentJob['Similarity']}</p>
            <Link href={currentJob['job_posting_url']} underline="hover">
                Job Link
            </Link>

          </div>

          {/* <div className="navigation">
            <button onClick={() => navigateJob('previous')} className="nav-button">Pre</button>
            <span className="page-number">{currentIndex + 1}/{matchData.length}</span>
            <button onClick={() => navigateJob('next')} className="nav-button">Next</button>
          </div> */}
        </div>
      )}

      {isMatched && <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" size="medium" color="primary" onClick={()=>setIsDisplaying(!isDisplaying)}>
          <NavigationIcon/>
        </Fab>
      </Box>}
      
      <div style={{display: isChartVisible ? 'block' : 'none'}}>{jobIndustryData && jobIndustryData.length > 0 && <JobIndustryBar data={jobIndustryData} />}</div>
      <div style={{display: isChartVisible ? 'block' : 'none'}}>{pieData && pieData.length > 0 && <PieChartAM data={pieData} />}</div>
      <div style={{display: isChartVisible ? 'block' : 'none'}}>{barData && barData.length > 0 && <BarChartAM data={barData} />}</div>

      
      
    </div>
  );
}

export default Match;