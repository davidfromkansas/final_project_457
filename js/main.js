/*
 * Root file that handles instances of all the charts and loads the visualization
 * CITATION: This main.js file was taken and modified from the Electoral Charts Assignment
 */
(function () {
  var instance = null;

  var attrEnum = {
    0: "housing_units",
    1: "mean_travel_time",
    2: "median_household_income",
    3: "median_rent",
    4: "population",
    5: "racial_diversity_index"
  };

  /**
   * Creates instances for every chart (classes created to handle each chart;
   * the classes are defined in the respective javascript files.
   */
  function init() {
    // quick startup
    // python -m http.server
    let subBoroughHandler = {};
    let attributeHandler = {};
    var map = new Map(subBoroughHandler, attrEnum);
    var attrSelector = new AttributeSelector(map, attributeHandler);
    var timeline = new Timeline("timeline", attrEnum);
    $(subBoroughHandler).bind("subBoroughSelected", function (event, subBorough) {
      // update timeline
      // console.log(subBorough);
      timeline.subBoroughSelected(subBorough);
    });
    $(attributeHandler).bind("attributeSelected", function (event, attr) {
      // update map and timeline
      console.log("handler", attr);
      map.updateVis(attr ? attr : []);
      if (attr) timeline.attributeSelected(attr);
    });

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
      .width(500)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(data)
      .default(new Date(2005, 1, 1))
      .on('onchange', val => {
        let year = d3.timeFormat('%Y')(val);
        if (year != currentlySelectedYear) {
          d3.select("#yearSelected").text(year);
          map.updateCurrentYear(year); // 2005 is the default starting year
          currentlySelectedYear = year;
        }
      });
    var g = d3.select("#slider").append("svg")
      .attr("width", 600)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)");
    g.call(slider);
  }

  /**
   *
   * @constructor
   */
  function Main() {
    if (instance !== null) {
      throw new Error("Cannot instantiate more than one Class");
    }
  }

  /**
   *
   * @returns {Main singleton class |*}
   */
  Main.getInstance = function () {
    var self = this
    if (self.instance == null) {
      self.instance = new Main();

      //called only once when the class is initialized
      init();
    }
    return instance;
  }

  Main.getInstance();
})();
