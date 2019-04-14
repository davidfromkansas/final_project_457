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

  // data: sub borough data
  // selectedAttr: int corresponding to attrEnum
  function getDomain(data, selectedAttr) {
    // get min
    let attr = attrEnum[selectedAttr]
    console.log(data[attr].actual);
    let minVal = d3.min(data[attr].actual, function(d) {
  	  return d[attr];
  	});
    let maxVal = d3.max(data[attr].actual, function(d) {
  	  return d[attr];
  	});
    return [minVal*.9, maxVal]
  }

  /**
   * Creates instances for every chart (classes created to handle each chart;
   * the classes are defined in the respective javascript files.
   */
  function init() {
    // quick startup
    // python -m http.server
    let subBoroughHandler = {};
    let attributeHandler = {};
    // 2 sub boroushs will always be selected
    let subBorough1, subBorough2;
    // user will always have at least one attribute selected
    let attr1 = 0, attr2 = 1;

    let alternate = 0; // delete when dropdowns are added

    var map = new Map(subBoroughHandler, attrEnum);
    var attrSelector = new AttributeSelector(map, attributeHandler);
    var barchart2 = new BarChart("q2", attrEnum, 2, true, true, attr1);
    var barchart1 = new BarChart("q1", attrEnum, 1, false, true, attr2);
    var barchart3 = new BarChart("q3", attrEnum, 3, true, true, attr1);
    var barchart4 = new BarChart("q4", attrEnum, 4, false, true, attr2);
    var yearSlider = new YearSlider(map);

    $(subBoroughHandler).bind("subBoroughSelected", function (event, subBorough) {
      // update timeline
      if(subBorough.num === 1) {
        barchart2.subBoroughSelected(subBorough.data);
        barchart1.subBoroughSelected(subBorough.data);
        subBorough1 = subBorough;
      } else {
        barchart3.subBoroughSelected(subBorough.data);
        barchart4.subBoroughSelected(subBorough.data);
        subBorough2 = subBorough;
      }
    });
    $(attributeHandler).bind("attributeSelected", function (event, attr) {
      // update map and timeline
      // map.updateVis(attr ? attr : []);
      if(alternate) {
        alternate = 0
        attr1 = attr[0]
        $("#subBorough1-title").empty().append("<h4 class=barchart-title>" + attrEnum[attr[attr.length-1]] +"</h4>")
        let xDomain = getDomain(subBorough1.data, attr[attr.length-1])
        barchart2.attributeSelected(attr[attr.length-1], xDomain);
        barchart3.attributeSelected(attr[attr.length-1], xDomain);

      } else {
        alternate = 1
        attr2 = attr[0]
        $("#subBorough2-title").empty().append("<h4 class=barchart-title>" + attrEnum[attr[attr.length-1]] +"</h4>")
        let xDomain = getDomain(subBorough2.data, attr[attr.length-1])
        barchart1.attributeSelected(attr[attr.length-1], xDomain);
        barchart4.attributeSelected(attr[attr.length-1], xDomain);
      }
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
