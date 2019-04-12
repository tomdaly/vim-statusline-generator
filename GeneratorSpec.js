"use strict";

let testElement = {
    out: "%m",
    preview: "[+]",
};

describe("testGenerator", function() {

    let testGenerator;

    describe("Testing testGenerator", function() {
        beforeEach(function() {
            testGenerator = new Generator();
        });

        it("elements should be empty on initialise", function() {
            expect(testGenerator.leftElements.length).toEqual(0);
            expect(testGenerator.rightElements.length).toEqual(0);
        });


        it("should clear elements", function() {
            testGenerator.leftElements.push("a");
            testGenerator.rightElements.push("a");
            expect(testGenerator.leftElements.length).toEqual(1);
            expect(testGenerator.rightElements.length).toEqual(1);
            testGenerator.removeAllElements();
            expect(testGenerator.leftElements.length).toEqual(0);
            expect(testGenerator.rightElements.length).toEqual(0);
        });

        describe("if align is left", function() {
            it("should add element to left", function() {
                testGenerator.addElement(testElement, true);
                expect(testGenerator.leftElements.length).toEqual(1);
            });

            it("should build statusline preview", function() {
                testGenerator.leftElements.push(testElement);
                let preview = testGenerator.buildPreview("left");

                expect(preview).toEqual("[+]");
            });

            it("should build statusline code", function() {
                testGenerator.leftElements.push(testElement);
                let out = testGenerator.buildOutput();

                expect(out).toEqual("statusline+=%m\n");
            });
        });

        describe("if align is right", function() {
            it("should add element to right", function() {
                testGenerator.addElement(testElement, false);
                expect(testGenerator.rightElements.length).toEqual(1);
            });

            it("should build statusline preview", function() {
                testGenerator.rightElements.push(testElement);
                let preview = testGenerator.buildPreview("right");

                expect(preview).toEqual("[+]");
            });

            it("should build statusline code", function() {
                testGenerator.rightElements.push(testElement);
                let out = testGenerator.buildOutput();

                expect(out).toEqual("statusline+=%=\nstatusline+=%m\n");
            });
        });
    });

    describe("Testing webpage", function() {

        let testGenDom, output, leftPreview, rightPreview, leftButton, rightButton;

        beforeEach(function() {
            output = document.createElement("input");
            leftPreview = document.createElement("input");
            rightPreview = document.createElement("input");
            leftButton = document.createElement("button");
            rightButton = document.createElement("button");
            output.setAttribute("id", "output");
            leftPreview.setAttribute("id", "leftPreview");
            rightPreview.setAttribute("id", "rightPreview");
            leftButton.setAttribute("id", "leftButton");
            rightButton.setAttribute("id", "rightButton");
            document.body.appendChild(output);
            document.body.appendChild(leftPreview);
            document.body.appendChild(rightPreview);
            document.body.appendChild(leftButton);
            document.body.appendChild(rightButton);
            testGenDom = new GeneratorDom();
        });

        afterEach(function() {
            document.body.removeChild(output);
            document.body.removeChild(leftPreview);
            document.body.removeChild(rightPreview);
            document.body.removeChild(leftButton);
            document.body.removeChild(rightButton);
        });

        it("should initialise with buttons", function() {
            const form = document.createElement("form");
            let button;
            for (let i = 0; i < options.length; i++) {
                button = document.createElement("button");
                button.innerHTML = options[i].title;
                form.appendChild(button);
            }
            expect(testGenDom.init().childNodes.length).not.toBeLessThan(0);
        });

        it("should update output", function() {
            testGenDom.generator.addElement(testElement, true);
            testGenDom.updateOutput();

            expect(output.value).toEqual("statusline+=%m");
        });

        it("should update preview text on left", function() {
            testGenDom.generator.addElement(testElement, true);
            testGenDom.alignLeft(true);
            testGenDom.updatePreview();

            expect(leftPreview.innerHTML).toEqual("[+]");
        });

        it("should update preview text on right", function() {
            testGenDom.generator.addElement(testElement, false);
            testGenDom.alignLeft(false);
            testGenDom.updatePreview();

            expect(rightPreview.innerHTML).toEqual("[+]");
        });

        it("should clear output and preview", function() {
            output.value = "fo";
            leftPreview.value = "ob";
            rightPreview.value = "ar";
            testGenDom.clear();

            expect(output.value).toEqual("");
            expect(leftPreview.innerHTML).toEqual("");
            expect(rightPreview.innerHTML).toEqual("");
        });
    });
});
