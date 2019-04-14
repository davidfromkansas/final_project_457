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
    for(var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].onchange = function() {
        // console.log("CHANGED TO: " + this.value);
        selectedAttributes = [];
        for(var j = 0; j < dropdowns.length; j++) {
          selectedAttributes.push(dropdowns[j].value);
        }
        // console.log(selectedAttributes);
        $(vis.attributeHandler).trigger("attributeSelected", [selectedAttributes]);
      }
    }
}
