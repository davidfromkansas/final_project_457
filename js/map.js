Map = function(_subBoroughHandler){
    this.subBoroughHandler = _subBoroughHandler;
    this.initVis();
}


Map.prototype.initVis = function () {

    var vis = this;

    d3.queue()
        .defer(d3.json, "../data/data.json")
        .defer(d3.json, "../data/nyc_sub_borough_area.geojson")
        .awaitAll(function (error, results) {
            // gentrificationData is a dictionary where the key represents the
            // subborough name and the value is the actual data (ex. income, demographics, etc.)
            self.gentrificationData = results[0]
            self.geojson = results[1]

            self.map = d3.select("#subborough")

            var path = d3.geoPath().projection(d3.geoConicConformal()
                .parallels([33, 45])
                .rotate([96, -39])
                .fitSize([960, 500], self.geojson));

            self.map.selectAll("path")
                .data(self.geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "#0fb9b1")
                .attr("stroke", "#fed330")
                .on("mouseover", function (d) {
                    d3.select(this).attr("fill", "#fed330")
                    var subboroughData = self.gentrificationData[d.properties.subborough]
                    d3.select("#title").text(d.properties.subborough)
                }).on("mouseout", function () {
                    d3.select(this).attr("fill", "#0fb9b1")
                }).on("click", function(d) {
                    var subboroughData = gentrificationData[d.properties.subborough]
                    $(vis.subBoroughHandler).trigger("subBoroughSelected", subboroughData);
                });
        });


    d3.json("../data/borough_boundaries.geojson", function (geojsonBoro) {

        var map = d3.select("#borough")

        self.geojsonBoro = geojsonBoro;

        var path = d3.geoPath().projection(d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([960, 500], geojsonBoro));


        map.selectAll("path")
            .data(geojsonBoro.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#0fb9b1")
            .attr("stroke", "#fed330").on("mouseover", function () {
                d3.select(this).attr("fill", "#fed330")
            }).on("mouseout", function () {
                d3.select(this).attr("fill", "#0fb9b1")
            });
    });
}

Map.prototype.updateVis = function(selectedAttributes) {
  // selectedAttribue[i] == "0" means MEDIAN HOUSEHOLD INCOME
  // selectedAttribue[i] == "1" means POPULATION
  // selectedAttribue[i] == "2" means POVERTY RATE
  // selectedAttribue[i] == "3" means RACIAL DIVERSITY INDEX
  // selectedAttribue[i] == "4" means UNEMPLOYMENT RATE

  var self = this;

  var blueScale = d3.scaleOrdinal(d3.schemeBlues[9]);

  // var scaler = d3.scaleLinear()
  //   .domain([d3.min(), d3.max()])
  //   .range([0, 1000]);

  // console.log("SCALING: " + scaler(160) + " " + scaler(15) + " " + scaler(30));

  self.map.selectAll("path")
      .data(self.geojson.features)
      .attr("fill", function(d) {
        var average = 0;
        var numAttributes = selectedAttributes.length;
        if(selectedAttributes.includes("0")) {
          average += self.gentrificationData[d.properties.subborough].median_household_income[2005];
        }
        if(selectedAttributes.includes("1")) {
          average += self.gentrificationData[d.properties.subborough].population[2005];
        }
        if(selectedAttributes.includes("2")) {
          average += self.gentrificationData[d.properties.subborough].poverty_rate[2005];
        }
        if(selectedAttributes.includes("3")) {
          average += self.gentrificationData[d.properties.subborough].racial_diversity_index[2005];
        }
        if(selectedAttributes.includes("4")) {
          average += self.gentrificationData[d.properties.subborough].unemployment_rate[2005];
        }
        average = average / numAttributes;
        console.log(average);
        return blueScale(average);
      })
      .attr("stroke", function(d) {
        return ("black");
      })
      .on("mouseover", function (d) {
        self.lastColor = d3.select(this).attr("fill");
        // Hovering over subborough will display name and console.log the data of subborough
        d3.select(this).attr("fill", "#fed330")
        var subboroughData = self.gentrificationData[d.properties.subborough]
        d3.select("#title").text(d.properties.subborough)
        console.log(subboroughData)
        console.log(self.lastColor);
      }).on("mouseout", function (d) {
        //reset the color back to how it was before
        d3.select(this).attr("fill", self.lastColor);
      });
  // console.log(selectedAttributes);
}
