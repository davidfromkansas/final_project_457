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

  var attrFormattedEnum = {
    "-1": "No Attribute Selected",
    0: "Housing Units",
    1: "Mean Travel Time",
    2: "Median Household Income",
    3: "Median Rent",
    4: "Population",
    5: "Racial Diversity Index"
  };

  var yearEnum = {
    2005: 0,
    2006: 1,
    2007: 2,
    2008: 3,
    2009: 4,
    2010: 5,
    2011: 6,
    2012: 7,
    2013: 8,
    2014: 9,
    2015: 10,
    2016: 11
  }

  // data: sub borough data
  // selectedAttr: int corresponding to attrEnum
  function getDomain(data1, data2, selectedAttr) {
    // get min
    let attr = attrEnum[selectedAttr]
    let minVal1 = d3.min(data1[attr].actual, function(d) {
  	  return d[attr];
  	});
    let maxVal1 = d3.max(data1[attr].actual, function(d) {
  	  return d[attr];
  	});

    let minVal2 = d3.min(data2[attr].actual, function(d) {
      return d[attr];
    });
    let maxVal2 = d3.max(data2[attr].actual, function(d) {
      return d[attr];
    });
    return [Math.min(minVal1*.9, minVal2*.9), Math.max(maxVal1, maxVal2)]
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
    let attr1 = 2, attr2;
    $("#subBorough1-title").empty().append("<h4 class=barchart-title>" + attrFormattedEnum[attr1] +"</h4>")
    var map = new Map(subBoroughHandler, attrEnum, yearEnum);
    var attrSelector = new AttributeSelector(map, attributeHandler);
    var barchart2 = new BarChart("q2", attrEnum, 2, true, true, attr1);
    var barchart1 = new BarChart("q1", attrEnum, 1, false, true, attr2);
    var barchart3 = new BarChart("q3", attrEnum, 3, true, true, attr1);
    var barchart4 = new BarChart("q4", attrEnum, 4, false, true, attr2);
    var yearSlider = new YearSlider(map);

    $(subBoroughHandler).bind("subBoroughSelected", function (event, subBorough) {
      // update barcharts
      if(subBorough.num === 1) {
        subBorough1 = subBorough;
        barchart2.subBoroughSelected(subBorough.data);
        if(attr2) {
          barchart1.subBoroughSelected(subBorough.data);
        }
      } else {
        subBorough2 = subBorough;
        barchart3.subBoroughSelected(subBorough.data);
        if(attr2) {
          barchart4.subBoroughSelected(subBorough.data);
        }
      }

      let xDomain1, xDomain2;
      if(subBorough1 && subBorough2) {
        xDomain1 = getDomain(subBorough1.data, subBorough2.data, attr1)
        barchart2.attributeSelected(attr1, xDomain1, subBorough1.data);
        barchart3.attributeSelected(attr1, xDomain1, subBorough2.data);
        if(attr2 >= 0) {
          xDomain2 = getDomain(subBorough1.data, subBorough2.data, attr2)
          barchart1.attributeSelected(attr2, xDomain2, subBorough1.data);
          barchart4.attributeSelected(attr2, xDomain2, subBorough2.data);
        }
      }
    });

    $(attributeHandler).bind("attributeSelected1", function (event, attr) {
      // update map and timeline
      $("#dropdownMenuButton1").text(attrFormattedEnum[attr])
      attr1 = attr;
      let selectedAttr = [attr1];
      if(attr2) {
          selectedAttr = [attr1, attr2]
      }
      let xDomain = getDomain(subBorough1.data, subBorough2.data, attr1)
      map.updateSelectedAttributes(selectedAttr);
      $("#subBorough1-title").empty().append("<h4 class=barchart-title>" + attrFormattedEnum[attr] +"</h4>")

      barchart2.attributeSelected(attr1, xDomain, subBorough1.data);
      barchart3.attributeSelected(attr1, xDomain, subBorough2.data);
    });

    $(attributeHandler).bind("attributeSelected2", function (event, attr) {
      // update map and timeline
      $("#dropdownMenuButton2").text(attrFormattedEnum[attr])
      attr2 = attr;
      let selectedAttr = [attr1, attr2];
      let xDomain = attr2 === -1 ? [0, 1] : getDomain(subBorough1.data, subBorough2.data, attr)
      // need to update map behavior so that it handles switch to "None"
      if(attr2 >= 0) {
        map.updateSelectedAttributes(selectedAttr);
      }
      $("#subBorough2-title").empty().append("<h4 class=barchart-title>" + attrFormattedEnum[attr] +"</h4>")

      barchart1.attributeSelected(attr2, xDomain, subBorough1.data);
      barchart4.attributeSelected(attr2, xDomain, subBorough2.data);
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
