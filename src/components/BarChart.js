import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Set up the dimensions of the chart
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 80, left: 70 };

    // Select and configure the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#ffffff')
      .style('margin', '50px')
      .style('overflow', 'visible');

    // Clear previous elements
    svg.selectAll('*').remove();

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i + 1)) // Month numbers 1-12
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - margin.bottom, margin.top]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((d, i) => d3.timeFormat("%B %Y")(new Date(2022, i+10))))
      .selectAll("text") // Rotate X-axis labels
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i + 1))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d))
      .attr('fill', '#d12a48');

    // Add chart title
    svg.append("text")
      .attr("x", width / 2)             
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Monthly Sum of Max Methane Plume Concentrations (ppm m)");

    // Add X-axis label (pushed further down to avoid overlapping)
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 100) // Adjusted y position to push it down further
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Months");

    // Add Y-axis label (pushed left to avoid overlap)
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${margin.left - 50},${height / 2})rotate(-90)`) // Adjusted transform
      .style("font-size", "12px")
      .text("Sum of Max Concentrations (ppm m)");

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
