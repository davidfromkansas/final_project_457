Map = function (_subBoroughHandler) {
  this.subBoroughHandler = _subBoroughHandler;
  this.initVis();
}


Map.prototype.initVis = function () {

  var vis = this;

  d3.queue()
    .defer(d3.json, "data/data.json")
    .defer(d3.json, "data/nyc_sub_borough_area.geojson")
    .awaitAll(function (error, results) {
      // gentrificationData is a dictionary where the key represents the
      // subborough name and the value is the actual data (ex. income, demographics, etc.)
      vis.gentrificationData = results[0]
      vis.geojson = results[1]

      vis.map = d3.select("#subborough")

      var path = d3.geoPath().projection(d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([960, 500], vis.geojson));

      vis.map.selectAll("path")
        .data(vis.geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#0fb9b1")
        .attr("stroke", "#fed330")
        .on("mouseover", function (d) {
          d3.select(this).attr("fill", "#fed330")
          var subboroughData = vis.gentrificationData[d.properties.subborough]
          d3.select("#title").text(d.properties.subborough)
        }).on("mouseout", function () {
          d3.select(this).attr("fill", "#0fb9b1")
        }).on("click", function (d) {
          var subboroughData = vis.gentrificationData[d.properties.subborough]
          $(vis.subBoroughHandler).trigger("subBoroughSelected", subboroughData);
        });
    });
}

Map.prototype.updateVis = function (selectedAttributes) {
  // selectedAttribue[i] == "0" means MEDIAN HOUSEHOLD INCOME
  // selectedAttribue[i] == "1" means POPULATION
  // selectedAttribue[i] == "2" means POVERTY RATE
  // selectedAttribue[i] == "3" means RACIAL DIVERSITY INDEX
  // selectedAttribue[i] == "4" means UNEMPLOYMENT RATE

  var vis = this;

  var blueScale = d3.scaleOrdinal(d3.schemeBlues[9]);

  vis.map.selectAll("path")
    .data(vis.geojson.features)
    .attr("fill", function (d) {
      var average = 0;
      var numAttributes = selectedAttributes.length;
      if (selectedAttributes.includes("0")) {
        average += vis.gentrificationData[d.properties.subborough].median_household_income[1].income;
      }
      if (selectedAttributes.includes("1")) {
        average += vis.gentrificationData[d.properties.subborough].population[1].population;
      }
      if (selectedAttributes.includes("2")) {
        average += vis.gentrificationData[d.properties.subborough].poverty_rate[1].poverty_rate;
      }
      if (selectedAttributes.includes("3")) {
        average += vis.gentrificationData[d.properties.subborough].racial_diversity_index[1].racial_diversity_index;
      }
      if (selectedAttributes.includes("4")) {
        average += vis.gentrificationData[d.properties.subborough].unemployment_rate[1].unemployment_rate;
      }
      average = average / numAttributes;
      return blueScale(average);
    })
    .attr("stroke", function (d) {
      return ("black");
    })
    .on("mouseover", function (d) {
      vis.lastColor = d3.select(this).attr("fill");
      // Hovering over subborough will display name and console.log the data of subborough
      d3.select(this).attr("fill", "#fed330")
      var subboroughData = vis.gentrificationData[d.properties.subborough]
      d3.select("#title").text(d.properties.subborough)
    }).on("mouseout", function (d) {
      //reset the color back to how it was before
      d3.select(this).attr("fill", vis.lastColor);
    });
}
