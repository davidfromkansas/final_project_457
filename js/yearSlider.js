YearSlider = function (_map) {
    this.map = _map;
    this.initSlider();
}


YearSlider.prototype.initSlider = function () {

    // add slider which lets users select a specific year
    var years = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
    data = []
    for (var i = 0; i < 12; i++) {
        data.push(new Date(years[i], 1, 1));
    }
    var currentlySelectedYear = 2005
    var slider = d3.sliderBottom()
        .min(new Date(2005, 1, 1))
        .max(new Date(2016, 1, 1))
        .step(1000 * 60 * 60 * 24 * 365)  // citation: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        .width(window.innerWidth / 4)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(data)
        .default(new Date(2005, 1, 1))
        .on('onchange', val => {
            let year = d3.timeFormat('%Y')(val);
            if (year != currentlySelectedYear) {
                d3.select("#yearSelected").text(year);
                this.map.updateCurrentYear(year); // 2005 is the default starting year
                currentlySelectedYear = year;
            }
        });

    var g = d3.select("#slider").append("svg")
        .attr("width", function () {
            return window.innerWidth / 3
        })
        .append("g")
        .attr("transform", "translate(30,30)").attr("margin", "auto");
    g.call(slider);
}