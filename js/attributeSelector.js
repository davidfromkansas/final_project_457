function AttributeSelector(m) {
    var self = this;
    self.map = m;
    self.init();
}


AttributeSelector.prototype.init = function() {
    var self = this;
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
        // console.log("checkbox " + this.value + " is " + this.checked);
        // console.log(selectedAttributes);
        self.map.updateVis(selectedAttributes);
      }
    }
}
