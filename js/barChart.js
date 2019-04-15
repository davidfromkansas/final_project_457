
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
	this.xAxisClass = "x-axis"+this.quadrant
  this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BarChart.prototype.initVis = function(){
	let vis = this;
	vis.margin = { top: 0, right: 30, bottom: 25, left: 55 };
  // if(vis.quadrant === 4) {
  //   vis.margin.bottom = 25;
  // }
  if(!vis.displayX) {
    vis.margin.top += vis.margin.bottom - 5
    vis.margin.bottom = 5
  }
  if(!vis.displayY) {
    // vis.margin.left = 5
    // vis.margin.right = 10
  }
  vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
  vis.height = ($("#grid").height()/2.7) - vis.margin.top - vis.margin.bottom;

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
  			.attr("class", vis.xAxisClass)
  			.attr("transform", "translate(0," + vis.height + ")")
  }

  if(vis.displayY) {
    vis.yAxis = d3.axisLeft()
  			.scale(vis.y);
		vis.svg.append("text")
			.attr("class", "y-axis-title"+vis.quadrant)
			.attr("transform", "rotate(-90)")
			.attr("y", 0-vis.margin.left)
      .attr("x",0 - (vis.height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Years");
    vis.svg.append("g")
        .attr("class", "y-axis")
  }
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	let vis = this;
	if(!vis.selectedAttr) {
		vis.displayData = []
		d3.select("."+vis.xAxisClass).remove();
		vis.removedAxis = true;
	} else {
		vis.displayData = vis.selectedData[vis.selectedAttr].actual;
	}
	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

BarChart.prototype.updateVis = function(){
	let vis = this;
  let data = vis.displayData;

  let bars = vis.svg.selectAll(".bar"+vis.quadrant).data(data)
  bars.enter()
      .append("rect")
      .merge(bars)
      .attr("class", "bar"+vis.quadrant)
      .attr("x", Math.abs(2))
      .attr("y", function(d) {
        return vis.y(d.year)
      })
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return vis.x(d[vis.selectedAttr])
      })
      .attr("height", vis.y.bandwidth() - 1)
      .attr("fill", "#DFCFBE");
  bars.exit().remove()

  if(vis.displayX && vis.selectedAttr) {
		if(vis.removedAxis) {
			vis.xAxis = d3.axisBottom()
	        .scale(vis.x);
	    vis.svg.append("g")
	  			.attr("class", vis.xAxisClass)
	  			.attr("transform", "translate(0," + vis.height + ")")
		}
    vis.xAxis.ticks(5)
    d3.select("." + vis.xAxisClass).call(vis.xAxis);
  }
  if(vis.displayY) {
    d3.selectAll(".y-axis").call(vis.yAxis);

  }
}

BarChart.prototype.subBoroughSelected = function(subBorough){
	let vis = this;
	if(vis.selectedAttr) {
		vis.selectedData = subBorough;
	  vis.wrangleData();
	}
}

BarChart.prototype.attributeSelected = function(attr, xDomain, subBorough){
	let vis = this;
  vis.selectedAttr = vis.attrEnum[attr];
  vis.x.domain(xDomain);
  vis.selectedData = subBorough;
	// console.log(vis.quadrant);
  vis.wrangleData();
}
