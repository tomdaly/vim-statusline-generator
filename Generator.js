"use strict";

function Generator() {
    this.elements = [];
}

Generator.prototype.addElement = function(element) {
    this.elements.push(element);
}

Generator.prototype.removeElement = function() {
    this.elements.pop();
}
