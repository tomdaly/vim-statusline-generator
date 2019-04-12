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
};

Generator.prototype.addElement = function(element) {
    this.elements.push(element);
};

Generator.prototype.removeElement = function() {
    this.elements.pop();
};

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

function GeneratorDom() { 
    this.generator = new Generator();
};

GeneratorDom.prototype.init = function() {
    const form = document.createElement("form");
    let button;
    let _this = this;
    for (let i = 0; i < options.length; i++) {
        button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-dark");
        button.innerHTML = options[i].title;
        button.addEventListener("click", function() {
            _this.generator.addElement(options[i]);
            _this.update();
        }, false);
        form.appendChild(button);
    }
    return form;
};

GeneratorDom.prototype.update = function() {
    const output = document.getElementById("output");
    const preview = document.getElementById("preview");
    output.setAttribute("value", this.generator.buildOutput());
    preview.setAttribute("value", this.generator.buildPreview());
};


const genDom = new GeneratorDom();
document.getElementById("options").appendChild(genDom.init());
