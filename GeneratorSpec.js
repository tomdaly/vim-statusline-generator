describe("Generator", function() {

    beforeEach(function() {
        generator = new Generator();
    });

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
