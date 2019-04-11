describe("Generator", function() {

    beforeEach(function() {
        generator = new Generator();
        genDom = new GeneratorDom();
    });

    describe("Testing Generator", function() {
        it("should be empty on initialise", function() {
            expect(generator.elements.length).toEqual(0);
        });

        describe("when element is added", function() {
            it("should increment elements length", function() {
                expect(generator.elements.length).toEqual(0);
                generator.addElement("t");
                expect(generator.elements.length).toEqual(1);
            });
        });

        describe("when an element is removed", function() {
            it("should decrement elements array length", function() {
                generator.elements.push("t");
                expect(generator.elements.length).toEqual(1);

                generator.removeElement();
                expect(generator.elements.length).toEqual(0);
            });
        });

        it("should build statusline code", function() {
            let element = {
                out: "%m",
                preview: "[+]",
            };
            generator.elements.push(element);
            let out = generator.buildOutput();

            expect(out).toEqual("statusline+=%m");
        });

        it("should build statusline preview", function() {
            let element = {
                out: "%m",
                preview: "[+]",
            };
            generator.elements.push(element);
            let preview = generator.buildPreview();

            expect(preview).toEqual("[+]");
        });
    });

    describe("Testing webpage", function() {
        it("should initialise with add button", function() {
            const form = document.createElement("form");
            let button;
            for (let i = 0; i < options.length; i++) {
                button = document.createElement("button");
                button.innerHTML = options[i].title;
                form.appendChild(button);
            }
            expect(genDom.init()).toEqual(form);
        });
    });
});
