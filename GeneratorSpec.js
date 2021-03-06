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
      expect(testGenerator.leftElements.length).toEqual(0)
      expect(testGenerator.rightElements.length).toEqual(0)
    })

    it('should clear elements', function () {
      testGenerator.leftElements.push('a')
      testGenerator.rightElements.push('a')
      expect(testGenerator.leftElements.length).toEqual(1)
      expect(testGenerator.rightElements.length).toEqual(1)
      testGenerator.removeAllElements()
      expect(testGenerator.leftElements.length).toEqual(0)
      expect(testGenerator.rightElements.length).toEqual(0)
    })

    describe('if align is left', function () {
      it('should add element to left', function () {
        testGenerator.addElement(testElement, LEFT_ALIGN)
        expect(testGenerator.leftElements.length).toEqual(1)
      })

      it('should build statusline preview', function () {
        testGenerator.leftElements.push(testElement)
        let preview = testGenerator.buildPreview(LEFT_ALIGN)

        expect(preview).toEqual('[+]')
      })

      it('should build statusline code', function () {
        testGenerator.leftElements.push(testElement)
        let out = testGenerator.buildOutput()

        expect(out).toEqual('set laststatus=2\nset statusline=\nset statusline+=%m\n')
      })

      it('should remove last left element', function () {
        testGenerator.leftElements.push(testElement)
        expect(testGenerator.leftElements.length).toEqual(1)

        testGenerator.removeElement(LEFT_ALIGN)
        expect(testGenerator.leftElements.length).toEqual(0)
      })
    })

    describe('if align is right', function () {
      it('should add element to right', function () {
        testGenerator.addElement(testElement, RIGHT_ALIGN)
        expect(testGenerator.rightElements.length).toEqual(1)
      })

      it('should build statusline preview', function () {
        testGenerator.rightElements.push(testElement)
        let preview = testGenerator.buildPreview(RIGHT_ALIGN)

        expect(preview).toEqual('[+]')
      })

      it('should build statusline code', function () {
        testGenerator.rightElements.push(testElement)
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
      testGenDom.setAlign(LEFT_ALIGN)
      testGenDom.addElement(testElement)
      expect(testGenDom.generator.leftElements.length).toEqual(1)
    })

    it('should add element to right', function () {
      testGenDom.setAlign(RIGHT_ALIGN)
      testGenDom.addElement(testElement)
      expect(testGenDom.generator.rightElements.length).toEqual(1)
    })

    it('should update output', function () {
      testGenDom.generator.addElement(testElement, LEFT_ALIGN)
      testGenDom.updateOutput()

      expect(output.value).toEqual('set laststatus=2set statusline=set statusline+=%m')
    })

    it('should update preview text on left', function () {
      testGenDom.generator.addElement(testElement, LEFT_ALIGN)
      testGenDom.updatePreview()

      expect(leftPreview.innerHTML).toEqual('[+]')
    })

    it('should update preview text on right', function () {
      testGenDom.setAlign(RIGHT_ALIGN)
      testGenDom.generator.addElement(testElement, RIGHT_ALIGN)
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

    it('should undo last added element', function () {
      testGenDom.generator.addElement(testElement, LEFT_ALIGN)
      testGenDom.generator.addElement(testElement, LEFT_ALIGN)
      expect(testGenDom.generator.leftElements.length).toEqual(2)

      testGenDom.undo()

      expect(testGenDom.generator.leftElements.length).toEqual(1)
    })

    it('should change foreground and background colours', function () {
      let element = testGenDom.addColour('green', 'lightgray')
      testGenDom.generator.addElement(element, LEFT_ALIGN)
      testGenDom.generator.addElement(testElement, LEFT_ALIGN)
      testGenDom.updatePreview()
      expect(leftPreview.innerHTML).toEqual('<span style="color:green;background-color:lightgray;">[+]</span>')
    })

    it('should undo and remove button', function () {
      let element = testGenDom.addColour('green', 'lightgray')
      testGenDom.generator.addElement(element, LEFT_ALIGN)
      testGenDom.update()
      expect(testGenDom.colourButtons.length).toEqual(1)

      testGenDom.undo()
      expect(testGenDom.colourButtons.length).toEqual(0)
    })
  })
})
