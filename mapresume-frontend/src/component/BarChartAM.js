import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

export default function BarChartAM({data}) {
    useEffect(()=>{
        let colRoot = am5.Root.new("chartdivcol");

        colRoot.setThemes([
        am5themes_Animated.new(colRoot)
        ]);

        
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
            categoryField: "state",
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
            name: "State",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "state",
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
    },[])
    return (
        <div id="chartdivcol" style={{ width: "100%", height: "400px" }}></div>
    )
}
