
/*
 * CorrelationVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _attrEnum				-- attribute enum
 * @param _displayYears		-- boolean display years
 */

BarChart = function(_parentElement, _attrEnum, _displayYears, _quadrant){
	this.parentElement = _parentElement;
	this.attrEnum = _attrEnum;
  this.displayYears = _displayYears;
  this.quadrant = _quadrant;
  this.selectedAttr = this.attrEnum["0"]
  this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 20, right: 60, bottom: 30, left: 60 };

  vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
  vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales and axes
  vis.x = d3.scaleLinear()
      .range([0, vis.width])
      // set domain later

  vis.y = d3.scaleBand()
      .range([vis.height, 0])
      .domain([2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016])
      .paddingInner(0.05);

  vis.xAxis = d3.axisBottom()
      .scale(vis.x);

  vis.yAxis = d3.axisLeft()
			.scale(vis.y);

	vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")")
	vis.svg.append("g")
      .attr("class", "y-axis axis")
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;
  vis.displayData = vis.selectedData[vis.selectedAttr].actual;

  console.log("displayData", vis.displayData);
	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

BarChart.prototype.updateVis = function(){
	var vis = this;
  let data = vis.displayData;

	var dataMax = d3.max(data, function(d) {
	  return d[vis.selectedAttr];
	});
  console.log([0, dataMax]);

  vis.x.domain([0 ,dataMax]);
  let barHeight = vis.height/(data.length+10)
  let bars = vis.svg.selectAll(".bar").data(data)
  bars.enter()
      .append("rect")
      .merge(bars)
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d) {
        return vis.y(d.year)
      })
      .attr("width", function(d) {
        return vis.x(d[vis.selectedAttr])
      })
      .attr("height", vis.y.bandwidth())
      .attr("stroke", "black")
      .attr("stroke-width", 2);
      d3.select(".x-axis").call(vis.xAxis);
      d3.select(".y-axis").call(vis.yAxis);
	// let lines = vis.svg.selectAll(".line").data(data)
	// lines.enter()
	// 		.append("line")
	// 		.merge(lines)
	// 		.attr("class", "line")
	// 		.attr("x1", function(d) {  return vis.x(new Date(d.year1, 0, 1)); })
	// 		.attr("y1", function(d) { return vis.y(d.data1); })
	// 		.attr("x2", function(d) { return vis.x(new Date(d.year2, 0, 1)); })
	// 		.attr("y2", function(d) { return vis.y(d.data2); })
	// 		.attr("stroke", "black")
	// 		.attr("stroke-width", 2);
  //
	// d3.select(".x-axis").call(vis.xAxis);
	// d3.select(".y-axis").call(vis.yAxis);
}

BarChart.prototype.subBoroughSelected = function(subBorough){
	var vis = this;
	if(vis.selectedAttr) {
		vis.selectedData = subBorough;
	  vis.wrangleData();
	} else {
		alert("Please select an attribute");
	}
}

BarChart.prototype.attributeSelected = function(attr){
	var vis = this;
	console.log(attr);
	if(vis.selectedAttr) {
		vis.selectedAttr = this.attrEnum[attr];
		vis.wrangleData();
	} else {
		vis.selectedAttr = this.attrEnum[attr];
	}
}
