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
        
        // Set data
        // https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data
        var data = [
            {
            y: "Views",
            x: "Company Followers",
            columnSettings: {
                fill: colors.medium
            },
            value: 20
            },
            {
            y: "Applies",
            x: "Company Followers",
            columnSettings: {
                fill: colors.good
            },
            value: 15
            },
            {
            y: "Max Salary",
            x: "Company Followers",
            columnSettings: {
                fill: colors.verygood
            },
            value: 25
            },
            {
            y: "Company Size",
            x: "Company Followers",
            columnSettings: {
                fill: colors.verygood
            },
            value: 15
            },
            {
            y: "Company Followers",
            x: "Company Followers",
            columnSettings: {
                fill: colors.verygood
            },
            value: 12
            },
            {
            y: "Views",
            x: "Company Size",
            columnSettings: {
                fill: colors.bad
            },
            value: 30
            },
            {
            y: "Applies",
            x: "Company Size",
            columnSettings: {
                fill: colors.medium
            },
            value: 24
            },
            {
            y: "Max Salary",
            x: "Company Size",
            columnSettings: {
                fill: colors.good
            },
            value: 25
            },
            {
            y: "Company Size",
            x: "Company Size",
            columnSettings: {
                fill: colors.verygood
            },
            value: 15
            },
            {
            y: "Company Followers",
            x: "Company Size",
            columnSettings: {
                fill: colors.verygood
            },
            value: 25
            },
            {
            y: "Views",
            x: "Max Salary",
            columnSettings: {
                fill: colors.bad
            },
            value: 33
            },
            {
            y: "Applies",
            x: "Max Salary",
            columnSettings: {
                fill: colors.bad
            },
            value: 14
            },
            {
            y: "Max Salary",
            x: "Max Salary",
            columnSettings: {
                fill: colors.medium
            },
            value: 20
            },
            {
            y: "Company Size",
            x: "Max Salary",
            columnSettings: {
                fill: colors.good
            },
            value: 19
            },
            {
            y: "Company Followers",
            x: "Max Salary",
            columnSettings: {
                fill: colors.good
            },
            value: 25
            },
            {
            y: "Views",
            x: "Applies",
            columnSettings: {
                fill: colors.critical
            },
            value: 31
            },
            {
            y: "Applies",
            x: "Applies",
            columnSettings: {
                fill: colors.critical
            },
            value: 24
            },
            {
            y: "Max Salary",
            x: "Applies",
            columnSettings: {
                fill: colors.bad
            },
            value: 25
            },
            {
            y: "Company Size",
            x: "Applies",
            columnSettings: {
                fill: colors.medium
            },
            value: 15
            },
            {
            y: "Company Followers",
            x: "Applies",
            columnSettings: {
                fill: colors.good
            },
            value: 15
            },
            {
            y: "Views",
            x: "Views",
            columnSettings: {
                fill: colors.critical
            },
            value: 12
            },
            {
            y: "Applies",
            x: "Views",
            columnSettings: {
                fill: colors.critical
            },
            value: 14
            },
            {
            y: "Max Salary",
            x: "Views",
            columnSettings: {
                fill: colors.critical
            },
            value: 15
            },
            {
            y: "Company Size",
            x: "Views",
            columnSettings: {
                fill: colors.bad
            },
            value: 25
            },
            {
            y: "Company Followers",
            x: "Views",
            columnSettings: {
                fill: colors.medium
            },
            value: 19
            }
        ];
        
        series.data.setAll(data);
        
        yAxis.data.setAll([
            { category: "Views" },
            { category: "Applies" },
            { category: "Max Salary" },
            { category: "Company Size" },
            { category: "Company Followers" }
        ]);
        
        xAxis.data.setAll([
            { category: "Views" },
            { category: "Applies" },
            { category: "Max Salary" },
            { category: "Company Size" },
            { category: "Company Followers" }
        ]);
    },[]);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "" }}>
            <div id="chartdiv" style={{ width: "80%", height: "500px"}}></div>
        </div>
    );
}