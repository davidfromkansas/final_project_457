/*
 * Root file that handles instances of all the charts and loads the visualization
 * CITATION: This main.js file was taken and modified from the Electoral Charts Assignment
 */
(function () {
    var instance = null;

    var attrEnum = {
      0: "median_household_income",
      1: "population",
      2: "poverty_rate",
      3: "racial_diversity_index",
      4: "unemployment_rate"
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
        var map = new Map(subBoroughHandler);
        var attrSelector = new AttributeSelector(map, attributeHandler);
        var timeline = new Timeline("timeline", attrEnum);
        $(subBoroughHandler).bind("subBoroughSelected", function(event, subBorough){
      		// update timeline
          // console.log(subBorough);
          timeline.subBoroughSelected(subBorough);
      	});
        $(attributeHandler).bind("attributeSelected", function(event, attr){
      		// update map and timeline
          map.updateVis(attr ? attr : []);
          if(attr) timeline.attributeSelected(attr);
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
