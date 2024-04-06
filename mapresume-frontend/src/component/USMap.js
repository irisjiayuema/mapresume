import React, { useEffect, useRef,useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_usaLow from "@amcharts/amcharts5-geodata/usaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const USMap = () => {
    const chartRef = useRef(null);
    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([
        am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            projection: am5map.geoMercator()
        }));

        chartRef.current = chart;
        // Create polygon series

        let modifiedGeoJSON = JSON.parse(JSON.stringify(am5geodata_usaLow));
        modifiedGeoJSON.features = modifiedGeoJSON.features.filter(feature => feature.properties.id !== "US-AK"&& feature.properties.id !== "US-HI");

        var polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
            geoJSON: modifiedGeoJSON
            })
        );
        polygonSeries.mapPolygons.each(function(polygon) {
            if (polygon.dataItem.get("id") === "US-AK") { // Alaska's ID in most geodata sets
                polygon.hide();
            }
        });
        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}"
        });
        
        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0x297373)
        });
        


        var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {lineType:"curved"}));
        
        lineSeries.mapLines.template.setAll({
            stroke: root.interfaceColors.get("alternativeBackground"),
            strokeOpacity: 0.6
        });

            // destination series
            var citySeries = chart.series.push(
            am5map.MapPointSeries.new(root, {})
            );

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

            // arrow series
            var arrowSeries = chart.series.push(
                am5map.MapPointSeries.new(root, {})
            );

            arrowSeries.bullets.push(function() {
            var arrow = am5.Graphics.new(root, {
                fill: am5.color(0x000000),
                stroke: am5.color(0x000000),
                draw: function (display) {
                display.moveTo(0, -3);
                display.lineTo(8, 0);
                display.lineTo(0, 3);
                display.lineTo(0, -3);
                }
            });

            return am5.Bullet.new(root, {
                    sprite: arrow
                });
            });

            var cities = [
                {
                    id: "london",
                    title: "London",
                    geometry: { type: "Point", coordinates: [-0.1262, 51.5002] },
                  },
                  {
                    id: "brussels",
                    title: "Brussels",
                    geometry: { type: "Point", coordinates: [4.3676, 50.8371] }
                  }, {
                    id: "prague",
                    title: "Prague",
                    geometry: { type: "Point", coordinates: [14.4205, 50.0878] }
                  }, {
                    id: "athens",
                    title: "Athens",
                    geometry: { type: "Point", coordinates: [23.7166, 37.9792] }
                  }, {
                    id: "reykjavik",
                    title: "Reykjavik",
                    geometry: { type: "Point", coordinates: [-21.8952, 64.1353] }
                  }, {
                    id: "dublin",
                    title: "Dublin",
                    geometry: { type: "Point", coordinates: [-6.2675, 53.3441] }
                  },
                {
                    id: "seattle",
                    title: "Seattle",
                    geometry: { type: "Point", coordinates: [-122.3321, 47.6062] }
                },
                {
                    id: "san_diego",
                    title: "San Diego",
                    geometry: { type: "Point", coordinates: [-117.1611, 32.7157] }
                },
                {
                    id: "dallas",
                    title: "Dallas",
                    geometry: { type: "Point", coordinates: [-96.7970, 32.7767] }
                },
                {
                    id: "san_jose",
                    title: "San Jose",
                    geometry: { type: "Point", coordinates: [-121.8863, 37.3382] }
                },
                {
                    id: "austin",
                    title: "Austin",
                    geometry: { type: "Point", coordinates: [-97.7431, 30.2672] }
                },
                {
                    id: "chicago",
                    title: "Chicago",
                    geometry: { type: "Point", coordinates: [-87.6298, 41.8781] }
                },
                {
                    id: "houston",
                    title: "Houston",
                    geometry: { type: "Point", coordinates: [-95.3698, 29.7604] }
                },
                {
                    id: "los angeles",
                    title: "Los Angeles",
                    geometry: { type: "Point", coordinates: [-118.2437, 34.0522] }
                },
                {
                    id: "new york",
                    title: "New York",
                    geometry: { type: "Point", coordinates: [-74, 40.43] }
                }
            ];

            citySeries.data.setAll(cities);

            // prepare line series data
            var destinations = ["new york","reykjavik","brussels","london"];
            // London coordinates
            var originLongitude = -97.7431;
            var originLatitude = 30.2672;

            am5.array.each(destinations, function (did) {
                var destinationDataItem = citySeries.getDataItemById(did);
                var lineDataItem = lineSeries.pushDataItem({ geometry: { type: "LineString", coordinates: [[originLongitude, originLatitude], [destinationDataItem.get("longitude"), destinationDataItem.get("latitude")]] } });

                arrowSeries.pushDataItem({
                    lineDataItem: lineDataItem,
                    positionOnLine: 0.5,
                    autoRotate: true
                });
            })

            // polygonSeries.events.on("datavalidated", function () {
            // chart.zoomToGeoPoint({ longitude: -0.1262, latitude: 51.5002 }, 3);
            // })
           

    }, []);

    return (
        <div id="chartdiv" style={{width: "100%", height: "750px" }}></div>
    );
}

export default USMap;