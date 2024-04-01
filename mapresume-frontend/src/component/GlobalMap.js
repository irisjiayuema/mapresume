import React, { useEffect, useRef,useLayoutEffect,useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_usaLow from "@amcharts/amcharts5-geodata/usaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import  '../assets/style/GlobalMap.css';
import { getData } from '../service/ApiService';

const GlobalMap = () => {
  const mockData = [
    { id: "US-AL", value: 4447100 },
    { id: "US-AK", value: 626932 },
    { id: "US-AZ", value: 5130632 },
    { id: "US-AR", value: 2673400 },
    { id: "US-CA", value: 33871648 },
    { id: "US-CO", value: 4301261 },
    { id: "US-CT", value: 3405565 },
    { id: "US-DE", value: 783600 },
    { id: "US-FL", value: 15982378 },
    { id: "US-GA", value: 8186453 },
    { id: "US-HI", value: 1211537 },
    { id: "US-ID", value: 1293953 },
    { id: "US-IL", value: 12419293 },
    { id: "US-IN", value: 6080485 },
    { id: "US-IA", value: 2926324 },
    { id: "US-KS", value: 2688418 },
    { id: "US-KY", value: 4041769 },
    { id: "US-LA", value: 4468976 },
    { id: "US-ME", value: 1274923 },
    { id: "US-MD", value: 5296486 },
    { id: "US-MA", value: 6349097 },
    { id: "US-MI", value: 9938444 },
    { id: "US-MN", value: 4919479 },
    { id: "US-MS", value: 2844658 },
    { id: "US-MO", value: 5595211 },
    { id: "US-MT", value: 902195 },
    { id: "US-NE", value: 1711263 },
    { id: "US-NV", value: 1998257 },
    { id: "US-NH", value: 1235786 },
    { id: "US-NJ", value: 8414350 },
    { id: "US-NM", value: 1819046 },
    { id: "US-NY", value: 18976457 },
    { id: "US-NC", value: 8049313 },
    { id: "US-ND", value: 642200 },
    { id: "US-OH", value: 11353140 },
    { id: "US-OK", value: 3450654 },
    { id: "US-OR", value: 3421399 },
    { id: "US-PA", value: 12281054 },
    { id: "US-RI", value: 1048319 },
    { id: "US-SC", value: 4012012 },
    { id: "US-SD", value: 754844 },
    { id: "US-TN", value: 5689283 },
    { id: "US-TX", value: 20851820 },
    { id: "US-UT", value: 2233169 },
    { id: "US-VT", value: 608827 },
    { id: "US-VA", value: 7078515 },
    { id: "US-WA", value: 5894121 },
    { id: "US-WV", value: 1808344 },
    { id: "US-WI", value: 5363675 },
    { id: "US-WY", value: 493782 }
  ]
  const filterData = [
    { id: "US-AL", value: 4100 },
    { id: "US-AK", value: 632 },
    { id: "US-AZ", value: 51332 },
    { id: "US-AR", value: 26400 },
    { id: "US-CA", value: 338648 },
    { id: "US-CO", value: 430261 },
    { id: "US-CT", value: 345565 },
    { id: "US-DE", value: 78300 },
    { id: "US-FL", value: 59278 },
    { id: "US-GA", value: 81453 },
    { id: "US-HI", value: 12137 },
    { id: "US-ID", value: 1953 },
    { id: "US-IL", value: 12293 },
    { id: "US-IN", value: 6485 },
    { id: "US-IA", value: 29324 },
    { id: "US-KS", value: 26818 },
    { id: "US-KY", value: 41769 },
    { id: "US-LA", value: 68976 },
    { id: "US-ME", value: 74923 },
    { id: "US-MD", value: 96486 },
    { id: "US-MA", value: 49097 },
    { id: "US-MI", value: 38444 },
    { id: "US-MN", value: 19479 },
    { id: "US-MS", value: 44658 },
    { id: "US-MO", value: 95211 },
    { id: "US-MT", value: 2195 },
    { id: "US-NE", value: 11263 },
    { id: "US-NV", value: 98257 },
    { id: "US-NH", value: 35786 },
    { id: "US-NJ", value: 14350 },
    { id: "US-NM", value: 19046 },
    { id: "US-NY", value: 976457 },
    { id: "US-NC", value: 49313 },
    { id: "US-ND", value: 2200 },
    { id: "US-OH", value: 353140 },
    { id: "US-OK", value: 50654 },
    { id: "US-OR", value: 21399 },
    { id: "US-PA", value: 281054 },
    { id: "US-RI", value: 48319 },
    { id: "US-SC", value: 12012 },
    { id: "US-SD", value: 4844 },
    { id: "US-TN", value: 89283 },
    { id: "US-TX", value: 851820 },
    { id: "US-UT", value: 33169 },
    { id: "US-VT", value: 6827 },
    { id: "US-VA", value: 78515 },
    { id: "US-WA", value: 94121 },
    { id: "US-WV", value: 18344 },
    { id: "US-WI", value: 63675 },
    { id: "US-WY", value: 3782 }
  ]
  const chartRef = useRef(null);

  const [jobData, setJobData] = useState(mockData);

  

  useLayoutEffect(() => {


    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    let chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
      }));
      
      chartRef.current = chart;
      

      // Create main polygon series for countries
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
      let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow 
      }));
      
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true
      });
      
      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });
      
      polygonSeries.mapPolygons.template.states.create("active", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });
      
      
      // Create series for background fill
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.1,
        strokeOpacity: 0
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });
      
      let graticuleSeries = chart.series.unshift(
        am5map.GraticuleSeries.new(root, {
          step: 10
        })
      );
      
      graticuleSeries.mapLines.template.set("strokeOpacity", 0.1)
      
      // create line series for trajectory lines
      // this will be invisible line (note strokeOpacity = 0) along which invisible points will animate
      let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0
      });

      // this will be visible line. Lines will connectg animating points so they will look like animated
      let animatedLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      animatedLineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0.6
      });

      // destination series
      var citySeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
      );

      // visible city circles
      citySeries.bullets.push(function() {
        
        var circle = am5.Circle.new(root, {
          radius: 5,
          tooltipText: "{title}",
          tooltipY: 0,

          fill: am5.color(0xffba00),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2
        });

        return am5.Bullet.new(root, {
          sprite: circle
        });
      });

      // invisible series which will animate along invisible lines
      var animatedBulletSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
      );

      animatedBulletSeries.bullets.push(function() {
        var circle = am5.Circle.new(root, {
          radius: 0
        });

        return am5.Bullet.new(root, {
          sprite: circle
        });
      });

      const contries = [
        {
          id: "united_kingdom",
          title: "United Kingdom",
          geometry: { type: "Point", coordinates: [-3.435973, 55.378051] }
        },
        {
          id: "canada",
          title: "Canada",
          geometry: { type: "Point", coordinates: [-106.346771, 56.130366] }
        },
        {
          id: "switzerland",
          title: "Switzerland",
          geometry: { type: "Point", coordinates: [8.227512, 46.818188] }
        },
        {
          id: "germany",
          title: "Germany",
          geometry: { type: "Point", coordinates: [10.451526, 51.165691] }
        },
        {
          id: "france",
          title: "France",
          geometry: { type: "Point", coordinates: [2.213749, 46.227638] }
        },
        {
          id: "india",
          title: "India",
          geometry: { type: "Point", coordinates: [78.96288, 20.593684] }
        },
        {
          id: "australia",
          title: "Australia",
          geometry: { type: "Point", coordinates: [133.775136, -25.274398] }
        },
        {
          id: "netherlands",
          title: "Netherlands",
          geometry: { type: "Point", coordinates: [5.291266, 52.132633] }
        },
        {
          id: "sweden",
          title: "Sweden",
          geometry: { type: "Point", coordinates: [18.643501, 60.128161] }
        },
        {
          id: "japan",
          title: "Japan",
          geometry: { type: "Point", coordinates: [138.252924, 36.204824] }
        }
      
      ];

      const states = [
        {
          id: "california",
          title: "California",
          geometry: { type: "Point", coordinates: [-119.417932, 36.778261] }
        },
        {
          id: "new_york",
          title: "New York",
          geometry: { type: "Point", coordinates: [-74.005973, 40.712775] }
        },
        {
          id: "texas",
          title: "Texas",
          geometry: { type: "Point", coordinates: [-99.901813, 31.968599] }
        },
        {
          id: "wisconsin",
          title: "Wisconsin",
          geometry: { type: "Point", coordinates: [-89.398528, 43.78444] }
        },
        {
          id: "georgia",
          title: "Georgia",
          geometry: { type: "Point", coordinates: [-82.907123, 32.165622] }
        },
        {
          id: "pennsylvania",
          title: "Pennsylvania",
          geometry: { type: "Point", coordinates: [-77.194525, 41.203322] }
        },
        {
          id: "colorado",
          title: "Colorado",
          geometry: { type: "Point", coordinates: [-105.782067, 39.550051] }
        },
        {
          id: "washington",
          title: "Washington",
          geometry: { type: "Point", coordinates: [-120.740139, 47.751074] }
        },
        {
          id: "florida",
          title: "Florida",
          geometry: { type: "Point", coordinates: [-81.515754, 27.664827] }
        },
        {
          id: "new_jersey",
          title: "New Jersey",
          geometry: { type: "Point", coordinates: [-74.405661, 40.058324] }
        },
        {
          id: "maryland",
          title: "Maryland",
          geometry: { type: "Point", coordinates: [-76.641271, 39.045755] }
        },
        {
          id: "north_carolina",
          title: "North Carolina",
          geometry: { type: "Point", coordinates: [-79.0193, 35.759573] }
        },
        {
          id: "illinois",
          title: "Illinois",
          geometry: { type: "Point", coordinates: [-89.398528, 40.633125] }
        }
      ]
  

      citySeries.data.setAll(contries.concat(states));

      
      // Prepare line series data
      // let destinations = contries.map(item=>item.id);
      let destMap = {
        "united_kingdom": ["california","new_york","texas"],
        "canada": ["california","new_york","wisconsin"],
        "switzerland": ["california","new_york","georgia"],
        "germany": ['new_york','california', 'pennsylvania'],
        "france": ['new_york','california', 'colorado'],
        "india": ['texas','washington', 'florida'],
        "australia": ['california','new_york','new_jersey'],
        "netherlands": ['california', 'new_york'],
        "sweden": ['california', 'maryland','north_carolina'],
        "japan": ['new_york','california', 'illinois']
      };


      // this will do all the animations
      am5.array.each(Object.keys(destMap), function(did) {

        var destinationDataItem = citySeries.getDataItemById(did);

        for(let i = 0; i < destMap[did].length; i++){
          let originDataItem = citySeries.getDataItemById(destMap[did][i]);
          let lineDataItem = lineSeries.pushDataItem({});
          lineDataItem.set("pointsToConnect", [destinationDataItem,originDataItem])
  
          var startDataItem = animatedBulletSeries.pushDataItem({});
          startDataItem.setAll({
            lineDataItem: lineDataItem,
            positionOnLine: 0
          });
  
          var endDataItem = animatedBulletSeries.pushDataItem({});
          endDataItem.setAll({
            lineDataItem: lineDataItem,
            positionOnLine: 1
          });
  
          var animatedLineDataItem = animatedLineSeries.pushDataItem({});
          animatedLineDataItem.set("pointsToConnect", [endDataItem,startDataItem])
  
          var lon0 = originDataItem.get("longitude");
          var lat0 = originDataItem.get("latitude");
  
          var lon1 = destinationDataItem.get("longitude");
          var lat1 = destinationDataItem.get("latitude");
          
  
          var distance = Math.hypot(lon1 - lon0, lat1 - lat0);
          var duration = distance * 100;
  
          animateStart(endDataItem,startDataItem,duration);
        }
        
      });

      function animateStart(startDataItem, endDataItem, duration) {

        var startAnimation = startDataItem.animate({
          key: "positionOnLine",
          from: 0,
          to: 1,
          duration: duration
        });

        startAnimation.events.on("stopped", function() {
          animateEnd(startDataItem, endDataItem, duration);
        });
      }

      function animateEnd(startDataItem, endDataItem, duration) {
        startDataItem.set("positionOnLine", 0)
        var endAnimation = endDataItem.animate({
          key: "positionOnLine",
          from: 0,
          to: 1,
          duration: duration
        })

        endAnimation.events.on("stopped", function() {
          animateStart(startDataItem, endDataItem, duration);
        });
      }


      let previousPolygon;
      
      polygonSeries.mapPolygons.template.on("active", function(active, target) {
        if (previousPolygon && previousPolygon !== target) {
          previousPolygon.set("active", false);
        }
        if (target.get("active")) {
          selectCountry(target.dataItem.get("id"));
        }
        previousPolygon = target;

      });
      
      function selectCountry(id) {
        let dataItem = polygonSeries.getDataItemById(id);
        let target = dataItem.get("mapPolygon");
        if (target) {
          new Promise(function(resolve,reject) {
            let centroid = target.geoCentroid();
            if (centroid) {
              let animationsCompleted = 0; 
              const checkAnimationsCompleted = () => {
                animationsCompleted += 1;
                if (animationsCompleted === 2) { 
                  resolve();
                }
              };

              let animationX = chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
              let animationY = chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });

              animationX.events.on("stopped", checkAnimationsCompleted);
              animationY.events.on("stopped", checkAnimationsCompleted);
            } else {
              reject(new Error("Centroid not found."));
            }
          }).then(()=>{
            let country = dataItem.get("id");
            let map;

            switch(country) {
              case "US":
                map = "usaLow.json";
                break;
              default:
                break;
            }
          
            if (map) {
                // am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/" + map, chart)
                // .then(function(result) {
                    
                    // let geodata = am5.JSONParser.parse(result.response);
                    // geodata.features = geodata.features
                    //   .filter(feature => feature.properties.id !== "US-AK"&& feature.properties.id !== "US-HI");
                    // countrySeries.setAll({
                    //   geoJSON: geodata
                    // });
                    

                    let centroid = target.geoCentroid();

                    countrySeries.show();
                    polygonSeries.hide();
                    citySeries.hide();
                    lineSeries.hide();
                    animatedLineSeries.hide();
                    homeButton.show();
                    heatLegend.show();
                    toggleButton.show();

                    chart.zoomToGeoPoint(centroid, 3, true);
              // });
            }
          });
        }
      }
    
      polygonSeries.events.on("datavalidated", function() {
       selectCountry("CA");
      });

      let modifiedGeoJSON = JSON.parse(JSON.stringify(am5geodata_usaLow));
      modifiedGeoJSON.features = modifiedGeoJSON.features.filter(feature => feature.properties.id !== "US-AK"&& feature.properties.id !== "US-HI");
      
      var countrySeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        id: "countrySeries",
        geoJSON: modifiedGeoJSON,
        valueField: "value",
        calculateAggregates: true,
        visible: false
      }));
      
      countrySeries.mapPolygons.template.setAll({
        tooltipText: "{name}:{value}",
        interactive: true
      });
      
      countrySeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonActive")
      });
      
      countrySeries.set("heatRules", [{
        target: countrySeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xff621f),
        max: am5.color(0x661f00),
        key: "fill"
      }]);
      
      countrySeries.mapPolygons.template.events.on("pointerover", function(ev) {
        heatLegend.showValue(ev.target.dataItem.get("value"));
      });

      const getAndParseData = async (params) => {
        try {
          console.log(params);
          const response = await getData('/job_count',params);
          const data = response.map(item => {
            return {
              id: 'US-'+item.name,
              value: item.value
            };
          });
          console.log(data);

          setJobData(data);
          countrySeries.data.setAll(jobData);

        } catch (error) {
          console.log(error);
        }
      };

      getAndParseData({})
      // countrySeries.data.setAll(jobData);




      var heatLegend = chart.children.push(am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0xff621f),
        endColor: am5.color(0x661f00),
        startText: "Lowest",
        endText: "Highest",
        stepCount: 5,
        visible: false
      }));
      
      heatLegend.startLabel.setAll({
        fontSize: 12,
        fill: heatLegend.get("startColor")
      });
      
      heatLegend.endLabel.setAll({
        fontSize: 12,
        fill: heatLegend.get("endColor")
      });
      
      countrySeries.events.on("datavalidated", function () {
        heatLegend.set("startValue", countrySeries.getPrivate("valueLow"));
        heatLegend.set("endValue", countrySeries.getPrivate("valueHigh"));
      });
      
  
      let homeButton = chart.children.push(am5.Button.new(root, {
        paddingTop: 10,
        paddingBottom: 10,
        x: am5.percent(100),
        centerX: am5.percent(100),
        opacity: 0,
        interactiveChildren: false,
        icon: am5.Graphics.new(root, {
          svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
          // svgPath: "M3,12 L9,6 L9,10 L15,10 L15,14 L9,14 L9,18 L3,12 Z",
          fill: am5.color(0xffffff)
        }),
        scale:2
      }));
      

      let label = am5.Label.new(root,{
        x: am5.percent(50),
        y: am5.percent(95),
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fontSize: 15
      });

      let modal = am5.Modal.new(root, {
        content: '<h3 style="text-align: center;">Job Filter</h3>',
      });

      let toggleButton = root.container.children.push(am5.Button.new(root, {
        label: am5.Label.new(root, { text: "Filter Options" }),
        y: am5.percent(1),
        x: am5.percent(45),
        visible: false,
      }));

      let modalSetup = false;
      toggleButton.events.on("click", function() {
            if (!modalSetup) {
              
              let listContainer = document.createElement("div");
              listContainer.style.display = "flex";
              listContainer.style.flexDirection = "row";
              listContainer.style.alignItems = "center";
              listContainer.style.justifyContent = "center";
              listContainer.style.padding = "20px";
              
              let buttonContainer = document.createElement("div");
              buttonContainer.style.display = "flex";
              buttonContainer.style.flexDirection = "row";
              buttonContainer.style.alignItems = "center";
              buttonContainer.style.justifyContent = "center";
              buttonContainer.style.padding = "20px";


              let companyIndsutrySelect = document.createElement("select");
              companyIndsutrySelect.multiple = true;
              companyIndsutrySelect.id = "multiCompanySelectDropdown";

              let jobIndsutrySelect = document.createElement("select");
              jobIndsutrySelect.multiple = true;
              jobIndsutrySelect.id = "multiJobSelectDropdown";

              let expLevelSelect = document.createElement("select");
              expLevelSelect.multiple = true;
              expLevelSelect.id = "multiJobSelectDropdown";

              ["All","Computer Software", "Tech", "Manufactory", "Banking", "Retail", "Option 7", "Option 8"].forEach(optionText => {
                  let option = document.createElement("option");
                  option.value = optionText;
                  option.text = optionText;
                  companyIndsutrySelect.appendChild(option);
              });

              ["All","Insurance", "Software Engineer", "Data Analyst", "Quant Researcher", "Option 6", "Option 7", "Option 8"].forEach(optionText => {
                let option = document.createElement("option");
                option.value = optionText;
                option.text = optionText;
                jobIndsutrySelect.appendChild(option);
              });

              ["All","Internship", "Entry level", "Intermediate Level", "Senior Level", "VP Level", "Elementary School"].forEach(optionText => {
                let option = document.createElement("option");
                option.value = optionText;
                option.text = optionText;
                expLevelSelect.appendChild(option);
              });

              let okButton = document.createElement("input");
              okButton.type = "button";
              okButton.value = "OK";
              okButton.addEventListener("click", function() {
                let selectedCompanyIndustries = Array.from(companyIndsutrySelect.selectedOptions).map(option => option.value);
                let selectedJobIndustries = Array.from(jobIndsutrySelect.selectedOptions).map(option => option.value);
                let selectedExpLevels = Array.from(expLevelSelect.selectedOptions).map(option => option.value);

                let displayText = `Companies: ${selectedCompanyIndustries.join(', ')} | ` +
                `Jobs: ${selectedJobIndustries.join(', ')} | ` +
                `Exp Levels: ${selectedExpLevels.join(', ')}`;
                
                console.log(displayText);
            
                getAndParseData({company_industry:selectedCompanyIndustries[0],industry_name:selectedJobIndustries[0],formatted_experience_level:selectedExpLevels[0]})
                // setJobData(filterData);

                modal.close();
              });
              
              let cancelButton = document.createElement("input");
              cancelButton.type = "button";
              cancelButton.value = "Cancel";
              cancelButton.addEventListener("click", function() {
                modal.cancel();
              });
              
              okButton.classList.add("modal-button");
              cancelButton.classList.add("modal-button");
              
              listContainer.appendChild(companyIndsutrySelect);
              listContainer.appendChild(jobIndsutrySelect);
              listContainer.appendChild(expLevelSelect);

              buttonContainer.appendChild(okButton);
              buttonContainer.appendChild(cancelButton);

              modal.getPrivate("content").appendChild(listContainer);
              modal.getPrivate("content").appendChild(buttonContainer);
              
              modalSetup = true;
            }
            modal.open();
        }
      );
      

      homeButton.events.on("click", function() {
        chart.goHome();

        countrySeries.hide();
        homeButton.hide();
        heatLegend.hide();
        toggleButton.hide();

        polygonSeries.show();
        citySeries.show();
        lineSeries.show();
        animatedLineSeries.show();
      });

      return () => {
        root.dispose();
      };
      
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.series.each((series) => {
        if (series.get("id") === "countrySeries"){
          series.data.setAll(jobData);
          // chartRef.current.zoomToGeoPoint(centroid, 3, true);
        }
      });
    }
  },[jobData]);


  return (
    <div>
      <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>
    </div>

  );
};

export default GlobalMap;
