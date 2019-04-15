Map = function (_subBoroughHandler, _attrEnum, _yearEnum) {
  this.subBoroughHandler = _subBoroughHandler;
  this.attrEnum = _attrEnum;
  this.yearEnum = _yearEnum;
  this.subBorough1Selected = false;
  this.initVis();
}


Map.prototype.initVis = function () {
  var vis = this;

  vis.svg = d3.select("#subborough")
              .append("svg").attr("width", window.innerWidth / 3)
              .attr("height", window.innerHeight / 1);

  vis.currentYear = 2005; // 2005 is the default year
  vis.selectedAttributes = ["3", "0"];

  // https://bl.ocks.org/tiffylou/88f58da4599c9b95232f5c89a6321992
  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  d3.queue()
    .defer(d3.json, "data/data.json")
    .defer(d3.json, "data/nyc_sub_borough_area.geojson")
    .awaitAll(function (error, results) {
      // gentrificationData is a dictionary where the key represents the
      // subborough name and the value is the actual data (ex. income, demographics, etc.)
      vis.gentrificationData = results[0]
      vis.geojson = results[1]

      var path = d3.geoPath().projection(d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([window.innerWidth / 3, window.innerHeight], vis.geojson));

      vis.svg.selectAll("path")
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
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);

          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");


        }).on("mouseout", function () {
          d3.select(this).attr("fill", "#0fb9b1")

          tooltip.transition()
            .duration(500)
            .style("opacity", 0);

        }).on("click", function (d) {
          var subboroughData = vis.gentrificationData[d.properties.subborough]
          let subBoroughNum;
          d3.select(this).attr("fill", "#fed330")
          if(!vis.subBorough1Selected) {
            subBoroughNum = 1;
            vis.subBorough1Selected = true;
          } else {
            subBoroughNum = 2;
            vis.subBorough1Selected = false;
          }
          $(vis.subBoroughHandler).trigger("subBoroughSelected",
            {num: subBoroughNum, data: subboroughData, name: d.properties.subborough});
        });

        let initSubBorough1 = "Borough Park",
          initSubBorough2 = "East New York/Starrett City"
        $(vis.subBoroughHandler).trigger("subBoroughSelected",
          {num: 1, data: vis.gentrificationData[initSubBorough1], name: initSubBorough1});
        $(vis.subBoroughHandler).trigger("subBoroughSelected",
          {num: 2, data: vis.gentrificationData[initSubBorough2], name: initSubBorough2});

        vis.color = d3.scaleLinear()
      								.domain([0, 1])
      								.range([d3.rgb("#FFFFFF"), d3.rgb('#3D9970')]);

        vis.updateVis();
    });
}


// updates current year and calls updateVis to generate currentYear data
// Note: Whenever this function is called, we should also somehow call updateVis to update the map - DLT
Map.prototype.updateCurrentYear = function (newYear) {
  var vis = this;
  vis.currentYear = newYear;
  vis.updateVis();
}

Map.prototype.updateSelectedAttributes = function(selectedAttributes) {
  var vis = this;
  vis.selectedAttributes = selectedAttributes;
  vis.updateVis();
}


Map.prototype.updateVis = function() {
  var vis = this;

  var blueScale = d3.scaleOrdinal(d3.schemeBlues[9]);

  vis.svg.selectAll("path")
    .data(vis.geojson.features)
    .attr("fill", function (d) {
      // var average = 0;
      // var numAttributes = vis.selectedAttributes.length;
      var score = 0;

      // TODO: CHANGE HOW WE CALCULATE THE SCORE
      // CALCULATING SCORE HERE

      vis.selectedAttributes.forEach(function(attr) {
        let data = vis.gentrificationData[d.properties.subborough][vis.attrEnum[attr]].normalized;
        // console.log(data);
        //if the two selected attributes aren't the same
        if(vis.selectedAttributes[0] != vis.selectedAttributes[1]) {
          //if the user has selected two viable attributes
          if(attr != 0) {
            score += data[vis.yearEnum[vis.currentYear]][vis.attrEnum[attr]];
          }
        } else {
          score = data[vis.yearEnum[vis.currentYear]][vis.attrEnum[attr]];
        }
        // let currAttr = vis.attrEnum[attr];
        // let sum = 0;
        // data.forEach(function(val) {
        //   sum += val[currAttr];
        // })
        // average += (sum / data.length);
      });
      // return vis.color(score)
      // return vis.color(vis.gentrificationData[d.properties.subborough]);
      return blueScale(score);
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
