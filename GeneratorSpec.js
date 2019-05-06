'use strict'

let testElement = {
  title: 'test',
  out: '%m',
  preview: '[+]'
}

describe('testGenerator', function () {
  let testGenerator

  describe('Testing testGenerator', function () {
    beforeEach(function () {
      testGenerator = new Generator()
    })

    it('elements should be empty on initialise', function () {
      expect(testGenerator.elements.length).toEqual(0)
    })

    it('should clear elements', function () {
      testGenerator.elements.push('a')
      expect(testGenerator.elements.length).toEqual(1)
      testGenerator.removeAllElements()
      expect(testGenerator.elements.length).toEqual(0)
    })

    it('should remove last element', function () {
      testGenerator.addElement(testElement)
      expect(testGenerator.elements.length).toEqual(1)

      testGenerator.removeElement()
      expect(testGenerator.elements.length).toEqual(0)
    })

    it('should add element to left', function () {
      testGenerator.addElement(testElement)
      expect(testGenerator.elements.length).toEqual(1)
    })

    it ('should split left and right elements', function () {
      testGenerator.addElement(testElement)
      testGenerator.addElement(RIGHT_ALIGN)
      testGenerator.addElement(testElement)
      testGenerator.addElement(testElement)

      let left = testGenerator.splitElements(LEFT_ALIGN)
      let right = testGenerator.splitElements(RIGHT_ALIGN)

      expect(left.length).toEqual(1)
      expect(right.length).toEqual(2)
    })

    describe('if align is left', function () {
      it('should build statusline preview', function () {
        testGenerator.addElement(LEFT_ALIGN)
        testGenerator.addElement(testElement)
        let preview = testGenerator.buildPreview(LEFT_ALIGN);

        expect(preview).toEqual('[+]')
      })

      it('should build statusline code', function () {
        testGenerator.addElement(LEFT_ALIGN)
        testGenerator.addElement(testElement)
        let out = testGenerator.buildOutput()

        expect(out).toEqual('set laststatus=2\nset statusline=\nset statusline+=%m\n')
      })
    })

    describe('if align is right', function () {
      it('should build statusline preview', function () {
        testGenerator.addElement(RIGHT_ALIGN)
        testGenerator.addElement(testElement)
        let preview = testGenerator.buildPreview(RIGHT_ALIGN)

        expect(preview).toEqual('[+]')
      })

      it('should build statusline code', function () {
        testGenerator.addElement(RIGHT_ALIGN)
        testGenerator.addElement(testElement)
        let out = testGenerator.buildOutput()

        expect(out).toEqual('set laststatus=2\nset statusline=\nset statusline+=%=\nset statusline+=%m\n')
      })
    })
  })

  describe('Testing webpage', function () {
    let testGenDom, output, leftPreview, rightPreview, leftButton, rightButton, options, dropdowns

    beforeEach(function () {
      output = document.createElement('input')
      leftPreview = document.createElement('input')
      rightPreview = document.createElement('input')
      leftButton = document.createElement('button')
      rightButton = document.createElement('button')
      options = document.createElement('div')
      dropdowns = document.createElement('div')
      output.setAttribute('id', 'output')
      leftPreview.setAttribute('id', 'leftPreview')
      rightPreview.setAttribute('id', 'rightPreview')
      leftButton.setAttribute('id', 'leftButton')
      rightButton.setAttribute('id', 'rightButton')
      options.setAttribute('id', 'options')
      dropdowns.setAttribute('id', 'dropdowns')
      document.body.appendChild(output)
      document.body.appendChild(leftPreview)
      document.body.appendChild(rightPreview)
      document.body.appendChild(leftButton)
      document.body.appendChild(rightButton)
      document.body.appendChild(options)
      document.body.appendChild(dropdowns)
      testGenDom = new GeneratorDom()
    })

    afterEach(function () {
      document.body.removeChild(output)
      document.body.removeChild(leftPreview)
      document.body.removeChild(rightPreview)
      document.body.removeChild(leftButton)
      document.body.removeChild(rightButton)
      document.body.removeChild(options)
      document.body.removeChild(dropdowns)
    })

    it('should initialise with buttons', function () {
      expect(testGenDom.initButtons().childNodes.length).not.toBeLessThan(0)
    })

    it('should initialise with dropdowns', function () {
      expect(testGenDom.initDropdowns().childNodes.length).not.toBeLessThan(0)
    })

    it('should add element to left', function () {
      testGenDom.addElement(testElement)
      expect(testGenDom.generator.elements.length).toEqual(2)
    })

    it('should add element to right', function () {
      testGenDom.setAlign(RIGHT_ALIGN)
      testGenDom.addElement(testElement)
      expect(testGenDom.generator.elements.length).toEqual(3)
    })

    it('should update output', function () {
      testGenDom.generator.addElement(testElement)
      testGenDom.updateOutput()

      expect(output.value).toEqual('set laststatus=2set statusline=set statusline+=%m')
    })

    it('should update preview text on left', function () {
      testGenDom.setAlign(LEFT_ALIGN)
      testGenDom.generator.addElement(testElement)
      testGenDom.updatePreview()

      expect(leftPreview.innerHTML).toEqual('[+]')
    })

    it('should update preview text on right', function () {
      testGenDom.setAlign(RIGHT_ALIGN)
      testGenDom.generator.addElement(testElement)
      testGenDom.updatePreview()
      expect(rightPreview.innerHTML).toEqual('[+]')
    })

    it('should clear output and preview', function () {
      output.value = 'fo'
      leftPreview.value = 'ob'
      rightPreview.value = 'ar'
      testGenDom.clear()

      expect(output.value).toEqual('')
      expect(leftPreview.innerHTML).toEqual('')
      expect(rightPreview.innerHTML).toEqual('')
    })

    it('should undo last added element and align element', function () {
      testGenDom.generator.addElement(testElement)
      testGenDom.generator.addElement(LEFT_ALIGN)
      expect(testGenDom.generator.elements.length).toEqual(3)

      testGenDom.undo()

      expect(testGenDom.generator.elements.length).toEqual(1)
    })

    it('should change foreground and background colours', function () {
      testGenDom.addColour('green', 'lightgray')
      testGenDom.generator.addElement(testElement)
      testGenDom.updatePreview()
      expect(leftPreview.innerHTML).toEqual('<span style="color:green;background-color:lightgray;">[+]</span>')
    })

    it('should undo and remove button', function () {
      testGenDom.addColour('green', 'lightgray')
      testGenDom.update()
      expect(testGenDom.colourButtons.length).toEqual(1)

      testGenDom.undo()
      expect(testGenDom.colourButtons.length).toEqual(0)
    })
  })
})
