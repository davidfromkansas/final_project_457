function AttributeSelector(map, _attributeHandler) {
    this.map = map;
    this.attributeHandler = _attributeHandler;
    this.init();
}


AttributeSelector.prototype.init = function() {
    var vis = this;
    //by default, the first attribute (median household income) is selected
    var selectedAttributes = ["0"];

    var checkboxes = document.getElementsByClassName("chkbx");
    for(var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].firstElementChild.onchange = function() {
        if(this.checked) {
          selectedAttributes.push(this.value);
        } else {
          for(var i = 0; i < selectedAttributes.length; i++) {
            if (selectedAttributes[i] === this.value) {
             selectedAttributes.splice(i, 1);
            }
          }
        }
        // vis.map.updateVis(selectedAttributes);

        $(vis.attributeHandler).trigger("attributeSelected", selectedAttributes);
      }
    }
}
