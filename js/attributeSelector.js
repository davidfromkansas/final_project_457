function AttributeSelector(map, _attributeHandler) {
    this.map = map;
    this.attributeHandler = _attributeHandler;
    this.init();
}


AttributeSelector.prototype.init = function() {
    var vis = this;
    // by default, the third attribute (median_household_income) is selected
    $("#attr1-selector a").click(function() {
      let selectedAttribute = $(this).attr("value")-1;
      $(vis.attributeHandler).trigger("attributeSelected1", selectedAttribute);
    })
    $("#attr2-selector a").click(function() {
      let selectedAttribute = $(this).attr("value")-1;
      $(vis.attributeHandler).trigger("attributeSelected2", selectedAttribute);
    })
}
