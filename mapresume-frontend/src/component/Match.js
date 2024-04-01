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
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

function Match() {

  const mockData = [{
    company_name: 'Google',
    title: 'Software Engineer',
    location: 'Mountain View, CA',
    description: 'Design and develop software for Google products.',
    Similarity: 0.9,
    job_posting_url: 'https://www.google.com'
  }, {
    company_name: 'Facebook',
    title: 'Product Manager',
    location: 'Menlo Park, CA',
    description: 'Manage product development and work with engineering teams.',
    Similarity: 0.85,
    job_posting_url: 'https://www.facebook.com'
  }]
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [currentJob, setCurrentJob] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);

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
      // const data = await postFile(file);
      setIsMatched(true);
      console.log('success!')
      // console.log(data);
      const jobsList = mockData;
      // const jobsList = [];

      // const numRows = data.columns[0].values.length;

      // for (let i = 0; i < numRows; i++) {
      //     const job = {};
      //     data.columns.forEach(column => {
      //         job[column.name] = column.values[i];
      //     });
      //     jobsList.push(job);
      // }
      setIsLoading(false);
      console.log(jobsList);
      setMatchData(jobsList); 
      setCurrentJob(jobsList[0]);

    } catch (error) {
      console.log(error)
      setResponseMessage('Error matching resume');
      setIsLoading(false);
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

  useEffect(() => {
    if (matchData.length > 0) {
      setIsChartVisible(true);
    }
  }, [matchData]);

  useEffect(() => {
    setResponseMessage('');
  }, [file]);


  useEffect(() => {

    let pieRoot = am5.Root.new("chartdivpie");

    pieRoot.setThemes([
      am5themes_Animated.new(pieRoot)
    ]);

    let pieChart = pieRoot.container.children.push(
      am5percent.PieChart.new(pieRoot, {
        endAngle: 270
      })
    );

    let pieSeries = pieChart.series.push(
      am5percent.PieSeries.new(pieRoot, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );
    
    pieSeries.states.create("hidden", {
      endAngle: -90
    });
    
    pieSeries.data.setAll([{
      category: "Lithuania",
      value: 501.9
    }, {
      category: "Czechia",
      value: 301.9
    }, {
      category: "Ireland",
      value: 201.1
    }, {
      category: "Germany",
      value: 165.8
    }, {
      category: "Australia",
      value: 139.9
    }, {
      category: "Austria",
      value: 128.3
    }, {
      category: "UK",
      value: 99
    }]);

    let colRoot = am5.Root.new("chartdivcol");

    colRoot.setThemes([
      am5themes_Animated.new(colRoot)
    ]);

    var data = [{
      name: "Monica",
      steps: 45688,
      pictureSettings: {
        src: "https://gravatar.com/avatar/6ca6c3894af90d520f742c184ab6f107?s=400&d=robohash&r=x"
      }
    }, {
      name: "Joey",
      steps: 35781,
      pictureSettings: {
        src: "https://gravatar.com/avatar/95ed238718879e6e983d057858cbc262?s=400&d=robohash&r=x"
      }
    }, {
      name: "Ross",
      steps: 25464,
      pictureSettings: {
        src: "https://gravatar.com/avatar/421a49afd758f0e1b8db5c1a207cd068?s=400&d=robohash&r=x"
      }
    }, {
      name: "Phoebe",
      steps: 18788,
      pictureSettings: {
        src: "https://gravatar.com/avatar/a22846acb3f182b8518f79d9e1f2507e?s=400&d=robohash&r=x"
      }
    }, {
      name: "Rachel",
      steps: 15465,
      pictureSettings: {
        src: "https://gravatar.com/avatar/f7619ec0ae579240efb33cd12fceaddd?s=400&d=robohash&r=x"
      }
    }, {
      name: "Chandler",
      steps: 11561,
      pictureSettings: {
        src: "https://gravatar.com/avatar/ee162a6d3e9678de2389e4e340f0c5f7?s=400&d=robohash&r=x"
      }
    }];
    
    // Create chart
    var colChart = colRoot.container.children.push(
      am5xy.XYChart.new(colRoot, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingBottom: 50,
        paddingTop: 40,
        paddingLeft:0,
        paddingRight:0
      })
    );
    
    // Create axes
    
    var xRenderer = am5xy.AxisRendererX.new(colRoot, {
      minorGridEnabled:true,
      minGridDistance:60
    });
    xRenderer.grid.template.set("visible", false);
    
    var xAxis = colChart.xAxes.push(
      am5xy.CategoryAxis.new(colRoot, {
        paddingTop:40,
        categoryField: "name",
        renderer: xRenderer
      })
    );
    
    
    var yRenderer = am5xy.AxisRendererY.new(colRoot, {});
    yRenderer.grid.template.set("strokeDasharray", [3]);
    
    var yAxis = colChart.yAxes.push(
      am5xy.ValueAxis.new(colRoot, {
        min: 0,
        renderer: yRenderer
      })
    );
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = colChart.series.push(
      am5xy.ColumnSeries.new(colRoot, {
        name: "Income",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "steps",
        categoryXField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(colRoot, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueY}"
        })
      })
    );
    
    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxWidth: 50,
      fillOpacity: 0.8
    });
    
    var currentlyHovered;
    
    series.columns.template.events.on("pointerover", function (e) {
      handleHover(e.target.dataItem);
    });
    
    series.columns.template.events.on("pointerout", function (e) {
      handleOut();
    });
    
    function handleHover(dataItem) {
      if (dataItem && currentlyHovered !== dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        var bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }
    
    function handleOut() {
      if (currentlyHovered) {
        var bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }
    
    let circleTemplate = am5.Template.new({});
    
    series.bullets.push(function (colRoot, series, dataItem) {
      let bulletContainer = am5.Container.new(colRoot, {});
      let circle = bulletContainer.children.push(
        am5.Circle.new(
          colRoot,
          {
            radius: 34
          },
          circleTemplate
        )
      );
    
      let maskCircle = bulletContainer.children.push(
        am5.Circle.new(colRoot, { radius: 27 })
      );
    
      // only containers can be masked, so we add image to another container
      let imageContainer = bulletContainer.children.push(
        am5.Container.new(colRoot, {
          mask: maskCircle
        })
      );
    
      imageContainer.children.push(
        am5.Picture.new(colRoot, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60
        })
      );
    
      return am5.Bullet.new(colRoot, {
        locationY: 0,
        sprite: bulletContainer
      });
    });
    
    // heatrule
    series.set("heatRules", [
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: series.columns.template,
        key: "fill"
      },
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: circleTemplate,
        key: "fill"
      }
    ]);
    
    series.data.setAll(data);
    xAxis.data.setAll(data);
    
    var cursor = colChart.set("cursor", am5xy.XYCursor.new(colRoot, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);
    
    cursor.events.on("cursormoved", function () {
      var dataItem = series.get("tooltip").dataItem;
      if (dataItem) {
        handleHover(dataItem);
      } else {
        handleOut();
      }
    });
    


    // Clean up
    return () => {
      pieRoot.dispose();
      colRoot.dispose();
    };
  }, []);

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
      
      {matchData.length > 0 && isDisplaying && (
        <div className="card-container">
          <div className="job-card">
            <h3><strong>Company:</strong> {currentJob.company_name}</h3>
            <p><strong>Job Title:</strong> {currentJob.title}</p>
            <p><strong>Location:</strong> {currentJob.location}</p>
            <p><strong>Job Description:</strong> {currentJob.description}</p>
            <p><strong>Similarity:</strong> {currentJob.Similarity}</p>
            <Link href={currentJob.job_posting_url} underline="hover">
                Job Link
            </Link>

          </div>

          <div className="navigation">
            <button onClick={() => navigateJob('previous')} className="nav-button">Previous</button>
            <span className="page-number">{currentIndex + 1}/{matchData.length}</span>
            <button onClick={() => navigateJob('next')} className="nav-button">Next</button>
          </div>
        </div>
      )}


      {isMatched && <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" size="medium" color="primary" onClick={()=>setIsDisplaying(!isDisplaying)}>
          <NavigationIcon/>
        </Fab>
      </Box>}

      <div id="chartdivpie" style={{display: isChartVisible ? 'block' : 'none', width: "100%", height: "400px" }}></div>
      <div id="chartdivcol" style={{display: isChartVisible ? 'block' : 'none', width: "100%", height: "400px" }}></div>

    </div>
  );
}

export default Match;