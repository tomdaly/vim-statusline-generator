describe("testGenerator", function() {

    beforeEach(function() {
        testGenerator = new Generator();
        testGenDom = new GeneratorDom();
    });

    describe("Testing testGenerator", function() {
        it("should be empty on initialise", function() {
            expect(testGenerator.elements.length).toEqual(0);
        });

        describe("when element is added", function() {
            it("should increment elements length", function() {
                expect(testGenerator.elements.length).toEqual(0);
                testGenerator.addElement("t");
                expect(testGenerator.elements.length).toEqual(1);
            });
        });

        describe("when an element is removed", function() {
            it("should decrement elements array length", function() {
                testGenerator.elements.push("t");
                expect(testGenerator.elements.length).toEqual(1);

                testGenerator.removeElement();
                expect(testGenerator.elements.length).toEqual(0);
            });
        });

        it("should build statusline code", function() {
            let element = {
                out: "%m",
                preview: "[+]",
            };
            testGenerator.elements.push(element);
            let out = testGenerator.buildOutput();

            expect(out).toEqual("statusline+=%m");
        });

        it("should build statusline preview", function() {
            let element = {
                out: "%m",
                preview: "[+]",
            };
            testGenerator.elements.push(element);
            let preview = testGenerator.buildPreview();

            expect(preview).toEqual("[+]");
        });

        it("should clear elements", function() {
            testGenerator.elements.push("a");
            expect(testGenerator.elements.length).toEqual(1);
            testGenerator.removeAllElements();
            expect(testGenerator.elements.length).toEqual(0);
        });
    });

    describe("Testing webpage", function() {
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

        it("should update output and preview text", function() {
            const output = document.createElement("input");
            const preview = document.createElement("input");
            output.setAttribute("id", "output");
            preview.setAttribute("id", "preview");
            document.body.appendChild(output);
            document.body.appendChild(preview);
            testGenDom.generator.addElement(options[0]);
            testGenDom.update();

            expect(output.value).toEqual("statusline+=%m");
            expect(preview.value).toEqual("[+]");
            document.body.removeChild(output);
            document.body.removeChild(preview);
        });

        it("should clear output and preview", function() {
            const output = document.createElement("input");
            const preview = document.createElement("input");
            output.setAttribute("id", "output");
            preview.setAttribute("id", "preview");
            output.setAttribute("value", "foo");
            preview.setAttribute("value", "bar");
            document.body.appendChild(output);
            document.body.appendChild(preview);

            testGenDom.clear();

            expect(output.value).toEqual("");
            expect(preview.value).toEqual("");
            document.body.removeChild(output);
            document.body.removeChild(preview);
        });
    });
});
