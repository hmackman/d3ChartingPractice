// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// data

d3.csv("assets/data/data.csv", function(error, healthData) {
    if (error) throw error;
  
    // Parse the data
    // Format the data and convert to numerical values
    // =================================
  
    // Format the data
    healthData.forEach(function(data) {
      data.id = +data.id;
      data.state = data.state
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;

    });
});


// append svg and group
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// scales
var xPovertyScale = d3.scaleLinear()
    .domain([0, d3.max(usData, d => d.poverty)])
    .range([0, width]);

var yHealthScale = d3.scaleLinear()
    .domain([0, d3.max(usData, d => d.healthcare)])
    .range([0, width]);


  var bottomAxis = d3.axisBottom(xPovertyScale);
  var leftAxis = d3.axisLeft(yHealthScale);


  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xPovertyScale(d.poverty))
    .attr("cy", d => yHealthScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "darkblue")
    .attr("opacity", "0.3")

  var tooltip = d3.tip()
    .attr("class","tooltip")
    .html(function(data) {
        var state = data.state;
        var poverty1 = +data.poverty;
        var healthcare1 = +data.healthcare;
        return ('<strong>' + state + '</strong>' + '<br> Poverty Percentage: ' + poverty + '%' + '<br> Lacks Healthcare Percentage: ' + healthcare + '%');
  });

  chartGroup.call(tooltip);

  circlesGroup.on("mouseover", function (data) {
    tooltip.show(data, this);
  })
  // Create "mouseout" event listener to hide tooltip
      .on("mouseout", function (data) {
        tooltip.hide(data);
  });

  svg.selectAll(".dot")
  .data(healthData)
  .enter()
  .append("text")
  .text(function (data) { return data.abbr; })
  .attr("x", function (data) {
      return xPovertyScale(data.poverty  +2);
  })
  .attr("y", function (data) {
      return yHealthScale(data.healthcare -1.5);
  })
  .attr("font-size", "10px")
  .attr("fill", "white")
  .style("text-anchor", "middle");

//   Create axis labels
chartGroup
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

// x-axis labels
chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");







