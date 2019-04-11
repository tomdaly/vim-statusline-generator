const genDom = new GeneratorDom();
document.getElementById("options").appendChild(genDom.init());
document.getElementById("clearButton").addEventListener("click", function() {
    genDom.clear();
});
document.getElementById("leftButton").addEventListener("click", function() {
    genDom.alignLeft(true);
});
document.getElementById("rightButton").addEventListener("click", function() {
    genDom.alignLeft(false);
});
