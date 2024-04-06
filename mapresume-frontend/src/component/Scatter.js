import React, { useEffect,useState } from "react";
import { useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Switch from './Switch';

export default function Scatter() {
    const [scatterData, setScatterData] = useState([]);
    const [data, setData] = useState([]);
    const chartRef = useRef(null);

    const handleChange = (param)=>{
        console.log(param);
        let transformedData = [];
        switch(param){
          case 1:
              transformedData = data.views_vs_applies.map(item => ({
                  ax: item[0],
                  ay: item[1]
              }));
              break;
          case 2:
              transformedData = data.company_size_vs_company_follower_count.map(item => ({
                  ax: item[0],
                  ay: item[1]
              }));
              break;
          case 3:
              transformedData = data.max_salary_vs_company_follower_count.map(item => ({
                  ax: item[0],
                  ay: item[1]
              }));
              break;
          case 4:
              transformedData = data.views_vs_max_salary.map(item => ({
                  ax: item[0],
                  ay: item[1]
              }));
              break;
          case 5:
              transformedData = data.applies_vs_max_salary.map(item => ({
                  ax: item[0],
                  ay: item[1]
              }));
              break;
          default:
      }
      setScatterData(transformedData);
    }
    

    useEffect(() => {
      const url = 'https://cmpt733functionapp1.azurewebsites.net/api/scatter_plots'
      fetch(url)
      .then(response => response.json())
      .then(data => {
          setData(data);
      })
      .catch(error => console.error('Error fetching the data:', error));

        let root = am5.Root.new("chartdiv");
        
        root.setThemes([
            am5themes_Animated.new(root)
          ]);
        
        
         
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelY: "zoomXY",
            pinchZoomX:true,
            pinchZoomY:true
          }));
        
        chartRef.current = chart;

          var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
            tooltip: am5.Tooltip.new(root, {})
          }));
        
            //   // Adding title to X Axis
            //   var xAxisTitle = xAxis.children.push(am5.Label.new(root, {
            //   text: "views",
            //   fontWeight: "bold",
            //   fontSize: 18,
            //   centerY: am5.percent(100),
            //   centerX: am5.percent(-500)
            // }));
          
          xAxis.ghostLabel.set("forceHidden", true);
          
          var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
          }));
          
            //   // Adding title to Y Axis
            //   var yAxisTitle = yAxis.children.push(am5.Label.new(root, {
            //   text: "applies",
            //   fontWeight: "bold",
            //   fontSize: 18,
            //   centerY: am5.percent(100),
            //   centerX: am5.percent(-500)
            // }));
        
        
          yAxis.ghostLabel.set("forceHidden", true);
    
          var series0 = chart.series.push(am5xy.LineSeries.new(root, {
            id: "series0",
            calculateAggregates: true,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "ay",
            valueXField: "ax",
            tooltip: am5.Tooltip.new(root, {
              labelText: "x: {valueX} y:{valueY}"
            })
          }));
          
          
          // Add bullet
          // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
          series0.bullets.push(function() {
            var graphics = am5.Triangle.new(root, {
              fill: series0.get("fill"),
              width: 15,
              height: 13
            });
            return am5.Bullet.new(root, {
              sprite: graphics
            });
          });
          
          
          
          series0.strokes.template.set("strokeOpacity", 0);
          
          var trendSeries0 = chart.series.push(am5xy.LineSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "y",
            valueXField: "x",
            stroke: series0.get("stroke")
          }));
          
          trendSeries0.data.setAll([
            { x: 1, y: 2 },
            { x: 12, y: 11 }
          ])
          
          
          chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            snapToSeries: [series0]
          }));
          
          // Add scrollbars
          // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
          chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
          }));
          
          chart.set("scrollbarY", am5.Scrollbar.new(root, {
            orientation: "vertical"
          }));

      

    }, []);

    useEffect(() => {
        console.log(scatterData);
        if (chartRef.current) {
            chartRef.current.series.each((series) => {
              if (series.get("id") === "series0"){
                series.data.setAll(scatterData);
              }
          });
        }
    }, [scatterData]);
      


    return (
        <div>
            <Switch onClickFunction={handleChange}/>
            <div id="chartdiv" style={{ width: "100%", height: "500px"}}></div>
        </div>
    );
}