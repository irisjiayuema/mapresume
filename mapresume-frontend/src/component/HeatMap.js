import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


export default function HeatMap() {
    useEffect(() => {
        var root = am5.Root.new("chartdiv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);
      
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingLeft: 0,
            paddingRight: 0,
            layout: root.verticalLayout
            })
        );
        
        // Create axes and their renderers
        var yRenderer = am5xy.AxisRendererY.new(root, {
            visible: false,
            minGridDistance: 20,
            inversed: true,
            minorGridEnabled: true
        });
        
        yRenderer.grid.template.set("visible", false);
        
        var yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(root, {
            renderer: yRenderer,
            categoryField: "category"
            })
        );
        
        var xRenderer = am5xy.AxisRendererX.new(root, {
            visible: false,
            minGridDistance: 30,
            inversed: true,
            minorGridEnabled: true
        });
        
        xRenderer.grid.template.set("visible", false);
        
        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: "category"
            })
        );
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
            calculateAggregates: true,
            stroke: am5.color(0xffffff),
            clustered: false,
            xAxis: xAxis,
            yAxis: yAxis,
            categoryXField: "x",
            categoryYField: "y",
            valueField: "value"
            })
        );
        
        series.columns.template.setAll({
            tooltipText: "{value}",
            strokeOpacity: 1,
            strokeWidth: 2,
            cornerRadiusTL: 5,
            cornerRadiusTR: 5,
            cornerRadiusBL: 5,
            cornerRadiusBR: 5,
            width: am5.percent(100),
            height: am5.percent(100),
            templateField: "columnSettings"
        });
        
        var circleTemplate = am5.Template.new({});
        
        // Add heat rule
        // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
        series.set("heatRules", [{
            target: circleTemplate,
            min: 10,
            max: 35,
            dataField: "value",
            key: "radius"
        }]);
        
        series.bullets.push(function () {
            return am5.Bullet.new(root, {
            sprite: am5.Circle.new(
                root,
                {
                fill: am5.color(0x000000),
                fillOpacity: 0.5,
                strokeOpacity: 0
                },
                circleTemplate
            )
            });
        });
        
        series.bullets.push(function () {
            return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
                fill: am5.color(0xffffff),
                populateText: true,
                centerX: am5.p50,
                centerY: am5.p50,
                fontSize: 10,
                text: "{value}"
            })
            });
        });
        
        var colors = {
            critical: am5.color(0xca0101),
            bad: am5.color(0xe17a2d),
            medium: am5.color(0xe1d92d),
            good: am5.color(0x5dbe24),
            verygood: am5.color(0x0b7d03)
        };
        
         // Fetch and update data
        fetch('https://cmpt733functionapp1.azurewebsites.net/api/correlation')
        .then(response => response.json())
        .then(data => {
            var processedData = [];
            Object.keys(data).forEach(yCategory => {
            Object.keys(data[yCategory]).forEach(xCategory => {
                processedData.push({
                y: yCategory,
                x: xCategory,
                columnSettings: {
                    fill: determineColor(data[yCategory][xCategory])
                },
                value: parseFloat(data[yCategory][xCategory].toFixed(2))
                });
            });
            });

            series.data.setAll(processedData);

            yAxis.data.setAll([
            { category: "views" },
            { category: "applies" },
            { category: "max_salary" },
            { category: "company_size" },
            { category: "company_follower_count" }
            ]);

            xAxis.data.setAll([
            { category: "company_follower_count" },
            { category: "company_size" },
            { category: "max_salary" },
            { category: "applies" },
            { category: "views" }
            ]);

            chart.appear(1000, 100);
        })
        .catch(error => console.error('Error fetching data:', error));

        // Utility function to determine color based on value
        function determineColor(value) {
        if (value > 0.5) return colors.verygood;
        if (value > 0.2) return colors.good;
        if (value > 0) return colors.medium;
        if (value > -0.2) return colors.bad;
        return colors.critical;
        }

    },[]);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "" }}>
            <div id="chartdiv" style={{ width: "80%", height: "500px"}}></div>
        </div>
    );
}