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
    var barchart4 = new BarChart("q4", attrEnum, true, 4);
    var barchart1 = new BarChart("q1", attrEnum, true, 1);
    var barchart3 = new BarChart("q3", attrEnum, true, 3);
    var barchart2 = new BarChart("q2", attrEnum, true, 2);
    var yearSlider = new YearSlider(map);

    $(subBoroughHandler).bind("subBoroughSelected", function (event, subBorough) {
      // update timeline
      console.log(subBorough);
      // barchart4.subBoroughSelected(subBorough);
      // barchart1.subBoroughSelected(subBorough);
      // barchart3.subBoroughSelected(subBorough);
      // barchart2.subBoroughSelected(subBorough);
    });
    $(attributeHandler).bind("attributeSelected", function (event, attr) {
      // update map and timeline
      console.log("handler", attr);
      map.updateVis(attr ? attr : []);
      // if (attr) timeline.attributeSelected(attr);
    });


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
