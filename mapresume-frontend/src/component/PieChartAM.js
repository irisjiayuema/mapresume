import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";


export default function PieChartAM({data}) {
    useEffect(()=>{
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
        
        pieSeries.data.setAll(data);
        return () => {
            pieRoot.dispose();
        };
    },[])
    return (
        <div>
            <h2>Skills Distribution</h2>
            <div id="chartdivpie" style={{ width: "100%", height: "400px" }}></div>
        </div>
        
    );
}
