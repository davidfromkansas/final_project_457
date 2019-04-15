
/*
 * CorrelationVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _attrEnum				-- attribute enum
 * @param _displayY		    -- boolean display years
 * @param _displayX		    -- boolean display x axis
 */

BarChart = function(_parentElement, _attrEnum, _quadrant, _displayY, _displayX, _attr){
	this.parentElement = _parentElement;
	this.attrEnum = _attrEnum;
  this.quadrant = _quadrant;
  this.displayY = _displayY;
  this.displayX = _displayX;
  this.selectedAttr = this.attrEnum[_attr]
  this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 0, right: 30, bottom: 25, left: 35 };
  if(!vis.displayX) {
    vis.margin.top += vis.margin.bottom - 5
    vis.margin.bottom = 5
  }
  if(!vis.displayY) {
    // vis.margin.left = 5
    // vis.margin.right = 10
  }
  vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
  vis.height = ($("#grid").height()/2) - vis.margin.top - vis.margin.bottom;

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
      .paddingInner(0.1);

  if(vis.displayX) {
    vis.xAxis = d3.axisBottom()
        .scale(vis.x);
    vis.svg.append("g")
  			.attr("class", "x-axis axis")
  			.attr("transform", "translate(0," + vis.height + ")")
  }

  if(vis.displayY) {
    vis.yAxis = d3.axisLeft()
  			.scale(vis.y);
    vis.svg.append("g")
        .attr("class", "y-axis axis")
  }
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;
  vis.displayData = vis.selectedData[vis.selectedAttr].actual;
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

  let bars = vis.svg.selectAll(".bar"+vis.quadrant).data(data)
  bars.attr("x", Math.abs(vis.margin.left - vis.margin.right - 2))
      .attr("y", function(d) {
        return vis.y(d.year)
      })
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return vis.x(d[vis.selectedAttr])
      })
      .attr("height", vis.y.bandwidth() - 1)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("fill", "steelblue");
  bars.enter()
      .append("rect")
      .merge(bars)
      .attr("class", "bar"+vis.quadrant)
      .attr("x", Math.abs(vis.margin.left - vis.margin.right - 2))
      .attr("y", function(d) {
        return vis.y(d.year)
      })
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return vis.x(d[vis.selectedAttr])
      })
      .attr("height", vis.y.bandwidth() - 1)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("fill", "steelblue");
  bars.exit().remove()

  if(vis.displayX) {
    vis.xAxis.ticks(5)
    d3.selectAll(".x-axis").call(vis.xAxis);
  }
  if(vis.displayY) {
    d3.selectAll(".y-axis").call(vis.yAxis);
  }
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

BarChart.prototype.attributeSelected = function(attr, xDomain, subBorough){
	var vis = this;
  vis.selectedAttr = vis.attrEnum[attr];
  vis.x.domain(xDomain);
  vis.selectedData = subBorough;
  console.log(vis.selectedAttr, vis.quadrant);
  vis.wrangleData();
}
