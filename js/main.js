/*
 * Root file that handles instances of all the charts and loads the visualization
 * CITATION: This main.js file was taken and modified from the Electoral Charts Assignment
 */
(function () {
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
      // quick startup
      // python -m http.server
        let subBoroughHandler = {};
        var map = new Map(subBoroughHandler);
        var timeline = new Timeline("timeline");
        $(subBoroughHandler).bind("subBoroughSelected", function(event, subBorough){
      		// update timeline
          console.log(subBorough);
          timeline.subBoroughSelected(subBorough);
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
