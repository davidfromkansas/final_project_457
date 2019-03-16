function Map() {
    var self = this;
    self.init();
}


Map.prototype.init = function () {

    var self = this;





    d3.json("../data/fine-grain.geojson", function (geojson) {

        var map = d3.select("#subborough")

        var path = d3.geoPath().projection(d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([960, 500], geojson));


        map.selectAll("path")
            .data(geojson.features)
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

    d3.json("../data/borough_boundaries.geojson", function (geojson) {

        var map = d3.select("#borough")

        var path = d3.geoPath().projection(d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([960, 500], geojson));


        map.selectAll("path")
            .data(geojson.features)
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



