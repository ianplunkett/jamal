/*
const vis = d3.select("#graph")
          .append("svg");

const w = 900,
      h = 400;

vis.attr("width", w)
    .attr("height", h)
    .text("AST Graph")
    .select("#graph");

const nodes = [
    {x: 10, y: 290, radius: 10, color: "green", label: "+"},
    {x: 110, y: 80, radius: 10, color: "purple", label: "list"},
    {x: 210, y: 290, radius: 10, color: "steelblue", label: "1"}
];

const links = [
    {source: nodes[0], target: nodes[1]},
    {source: nodes[2], target: nodes[1]},
    {source: nodes[0], target: nodes[2]}
];

vis.selectAll("circle.nodes")
    .data(nodes)
    .enter()
    .append("svg:circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d) { return d.color; });

const text = vis.selectAll("text")
          .data(nodes)
          .enter()
          .append("text");

const textLabels = text
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .text(function(d) { return d.label;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "red");

vis.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", function(d) {return d.source.x;})
    .attr("y1", function(d) {return d.source.y;})
    .attr("x2", function(d) {return d.target.x;})
    .attr("y2", function(d) {return d.target.y;})
    .style("stroke", "rgb(6,120,155)");
*/ 
