function AttributeSelector(map, _attributeHandler) {
    this.map = map;
    this.attributeHandler = _attributeHandler;
    this.init();
}


AttributeSelector.prototype.init = function() {
    var vis = this;
    //by default, the third attribute (median_household_income) is selected
    // var selectedAttributes = ["2"];

    var dropdowns = document.getElementsByClassName("dropdown");
    for(let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].onchange = function() {
        let selectedAttribute = dropdowns[i].options[dropdowns[i].selectedIndex].value-1;
        $(vis.attributeHandler).trigger("attributeSelected" + (i+1), selectedAttribute);
      }
    }
}
