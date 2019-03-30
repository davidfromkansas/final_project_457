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
            var gentrificationData = results[0]
            var geojson = results[1]

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
                .attr("stroke", "#fed330")
                .on("mouseover", function (d) {
                    d3.select(this).attr("fill", "#fed330")
                    var subboroughData = gentrificationData[d.properties.subborough]
                    d3.select("#title").text(d.properties.subborough)
                }).on("mouseout", function () {
                    d3.select(this).attr("fill", "#0fb9b1")
                }).on("click", function(d) {
                    var subboroughData = gentrificationData[d.properties.subborough]
                    $(vis.subBoroughHandler).trigger("subBoroughSelected", subboroughData);
                });
        });

}
