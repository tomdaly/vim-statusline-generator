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

Generator.prototype.buildOutput = function() {
    let output = "";
    if (this.elements.length) {
        output = "statusline+=";
    }
    for (let i = 0; i < this.elements.length; i++) {
        let curr = this.elements[i];
        output += curr.out;
    }
    return output;
};

Generator.prototype.buildPreview = function() {
    let preview = "";
    for (let i = 0; i < this.elements.length; i++) {
        let curr = this.elements[i];
        preview += curr.preview;
    }
    return preview;
};
