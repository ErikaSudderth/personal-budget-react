import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function Chart2(props) {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current).append("svg").append("g");

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    const width = 960;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.budget);

    const arc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", `translate(${width / 2}, ${height / 2})`);

    const key = d => d.data.title;

    const color = d3
      .scaleOrdinal()
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00"
      ]);

    const change = data => {
      const slice = svg
        .select(".slices")
        .selectAll("path.slice")
        .data(pie(data), key);

      slice
        .enter()
        .append("path")
        .attr("class", "slice")
        .style("fill", d => color(d.data.title))
        .merge(slice)
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          const current = this._current || d;
          const interpolate = d3.interpolate(current, d);
          this._current = interpolate(0); // Save current state
          return t => arc(interpolate(t));
        });

      slice.exit().remove();

      const text = svg.select(".labels").selectAll("text").data(pie(data), key);

      text
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text(d => d.data.title)
        .merge(text)
        .transition()
        .duration(1000)
        .attrTween("transform", function (d) {
          const current = this._current || d;
          const interpolate = d3.interpolate(current, d);
          this._current = interpolate(0); // Save current state
          return t => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween("text-anchor", d => {
          return () => (midAngle(d) < Math.PI ? "start" : "end");
        });

      text.exit().remove();

      const polyline = svg
        .select(".lines")
        .selectAll("polyline")
        .data(pie(data), key);

      polyline
        .enter()
        .append("polyline")
        .merge(polyline)
        .transition()
        .duration(1000)
        .attrTween("points", function (d) {
          const current = this._current || d;
          const interpolate = d3.interpolate(current, d);
          this._current = interpolate(0); // Save current state
          return t => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    };

    const midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;

    const getData = async () => {
      try {
        const data = props.budgetData.myBudget;
        change(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getData();
  });

  return <div id="chart2" ref={svgRef} />;
}

export default Chart2;
