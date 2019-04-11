"use strict";

let options = [
    {
        title: "Modified flag",
        out: "%m",
        preview: "[+]"
    },
];

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

function GeneratorDom() { }

GeneratorDom.prototype.init = function() {
    const form = document.createElement("form");
    let button;
    for (let i = 0; i < options.length; i++) {
        button = document.createElement("button");
        button.innerHTML = options[i].title;
        form.appendChild(button);
    }
    return form;
};
