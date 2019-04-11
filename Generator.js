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

Generator.prototype.buildString = function() {
    let statuslineString = "";
    if (this.elements.length) {
        statuslineString = "statusline+=";
    }
    while (this.elements.length) {
        statuslineString += this.elements.pop();
    }
    return statuslineString;
};
