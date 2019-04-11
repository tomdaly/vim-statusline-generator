describe("Generator", function() {

    beforeEach(function() {
        generator = new Generator();
    });

    it("should be empty on initialise", function() {
        expect(generator.elements.length).toEqual(0);
    });
});
