'use strict'

/* global */
const LEFT_ALIGN = 'L'
const RIGHT_ALIGN = 'R'

let options = [
  {
    title: 'Modified flag',
    out: '%m',
    preview: '[+]',
    buttonColour: 'dark'
  },
  {
    title: 'Help flag',
    out: '%h',
    preview: '[Help]',
    buttonColour: 'dark'
  },
  {
    title: 'Read-only flag',
    out: '%r',
    preview: '[RO]',
    buttonColour: 'dark'
  },
  {
    title: 'Short filename',
    out: '%f',
    preview: 'myscript.js',
    buttonColour: 'dark'
  },
  {
    title: 'Long filename',
    out: '%F',
    preview: '/home/tom/myscript.js',
    buttonColour: 'dark'
  },
  {
    title: 'Current line number',
    out: '%l',
    preview: '74',
    buttonColour: 'dark'
  },
  {
    title: 'Total line number',
    out: '%L',
    preview: '99',
    buttonColour: 'dark'
  },
  {
    title: 'Current column number',
    out: '%c',
    preview: '74',
    buttonColour: 'dark'
  },
  {
    title: 'Percent of file',
    out: '%P',
    preview: '75%',
    buttonColour: 'dark'
  },
  {
    title: 'File type',
    out: '%y',
    preview: '[javascript]',
    buttonColour: 'dark'
  },
  {
    title: 'File format',
    out: '%{&ff}',
    preview: 'dos',
    buttonColour: 'dark'
  },
  {
    title: 'File encoding',
    out: '%{strlen(&fenc)?&fenc:\'none\'}',
    preview: 'utf-8',
    buttonColour: 'dark'
  },
  {
    title: 'Keymap name',
    out: '%k',
    preview: '&lt;gb&gt;',
    buttonColour: 'dark'
  },
  {
    title: 'Buffer number',
    out: '%n',
    preview: '2',
    buttonColour: 'dark'
  },
  {
    title: 'Window number',
    out: '%{winnr()}',
    preview: '1',
    buttonColour: 'dark'
  },
  {
    title: 'Git branch',
    out: '%{b:gitbranch}',
    preview: '(master)',
    buttonColour: 'primary',
    extra: `
function! StatuslineGitBranch()
  let b:gitbranch=""
  if &modifiable
    lcd %:p:h
    let l:gitrevparse=system("git rev-parse --abbrev-ref HEAD")
    lcd -
    if l:gitrevparse!~"fatal: not a git repository"
      let b:gitbranch="(".substitute(l:gitrevparse, '\\n', '', 'g').") "
    endif
  endif
endfunction

augroup GetGitBranch
  autocmd!
  autocmd VimEnter,WinEnter,BufEnter * call StatuslineGitBranch()
augroup END
`
  },
  {
    title: 'Mode',
    out: '%{StatuslineMode()}',
    preview: 'INSERT',
    buttonColour: 'primary',
    extra: `
function! StatuslineMode()
  let l:mode=mode()
  if l:mode==#"n"
    return "NORMAL"
  elseif l:mode==?"v"
    return "VISUAL"
  elseif l:mode==#"i"
    return "INSERT"
  elseif l:mode==#"R"
    return "REPLACE"
  elseif l:mode==?"s"
    return "SELECT"
  elseif l:mode==#"t"
    return "TERMINAL"
  elseif l:mode==#"c"
    return "COMMAND"
  elseif l:mode==#"!"
    return "SHELL"
  endif
endfunction
`
  },
  {
    title: 'Current time',
    out: '%{strftime(\\"%H:%M\\")}',
    preview: '11:45',
    buttonColour: 'primary'
  },
  {
    title: 'Space character',
    out: '\\ ',
    preview: ' ',
    buttonColour: 'info'
  },
  {
    title: 'Pipe character',
    out: '|',
    preview: '|',
    buttonColour: 'info'
  },
  {
    title: 'Colon character',
    out: ':',
    preview: ':',
    buttonColour: 'info'
  },
  {
    title: 'Slash character',
    out: '/',
    preview: '/',
    buttonColour: 'info'
  },
  {
    title: 'Left chevron character',
    out: '<',
    preview: '&lt;',
    buttonColour: 'info'
  },
  {
    title: 'Right chevron character',
    out: '>',
    preview: '&gt;',
    buttonColour: 'info'
  },
  {
    title: 'Reset colour',
    out: '%9*',
    preview: '<span style="color:white;background-color:black;">',
    buttonColour: 'light',
    extra: 'hi User9 ctermbg=black ctermfg=white guibg=black guifg=white\n'
  }
]

let colours = ['black',
  'darkred',
  'darkgreen',
  'brown',
  'darkblue',
  'darkmagenta',
  'darkcyan',
  'lightgray',
  'darkgray',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'grey',
  'lightred',
  'lightgreen',
  'lightyellow',
  'lightblue',
  'lightmagenta',
  'lightcyan']

/* -- */

function Generator () {
  this.elements = []
};

Generator.prototype.addElement = function (element) {
  this.elements.push(element)
}

Generator.prototype.removeElement = function (align) {
  return this.elements.pop()
}

Generator.prototype.removeAllElements = function () {
  while (this.elements.length) {
    this.elements.pop()
  }
}

Generator.prototype.buildOutputElementString = function (elements) {
  let output = ''
  let extra = ''
  let colours = ''

  for (let i = 0; i < elements.length; i++) {
    let curr = elements[i]
    output += 'set statusline+=' + curr.out + '\n'
    let isColourElement = curr.title.startsWith('btnColour') || curr.title === 'Reset colour'
    if (isColourElement && !colours.includes(curr.extra)) {
      colours += curr.extra
    }
    if (!isColourElement && curr.extra != null) {
      extra += curr.extra
    }
  }

  return {
    output: output,
    extra: extra,
    colours: colours
  }
}

Generator.prototype.buildOutput = function () {
  let output = 'set laststatus=2\nset statusline=\n'
  let extra = ''
  let colours = ''

  let leftElements = this.splitElements().left
  let rightElements = this.splitElements().right

  let leftElementsString = this.buildOutputElementString(leftElements)
  let rightElementsString = this.buildOutputElementString(rightElements)
  output += leftElementsString.output
  extra += leftElementsString.extra
  colours += leftElementsString.colours

  if (rightElements.length) {
    output += 'set statusline+=%=\n'
    output += rightElementsString.output
    extra += rightElementsString.extra
    colours += rightElementsString.colours
  }

  return output + colours + extra
}

Generator.prototype.buildPreview = function (align) {
  let preview = ''
  let elements = this.splitElements(align)

  for (let i = 0; i < elements.length; i++) {
    let curr = elements[i]
    preview += curr.preview
  }
  return preview
}

Generator.prototype.splitElements = function(align) {
  let leftElements = []
  let rightElements = []

  let alignNext = LEFT_ALIGN

  for (let i = 0; i < this.elements.length; i++) {
    let curr = this.elements[i]
    if (curr === LEFT_ALIGN) {
      alignNext = LEFT_ALIGN
    } else if (curr === RIGHT_ALIGN) {
      alignNext = RIGHT_ALIGN
    } else {
      if (alignNext === LEFT_ALIGN) {
        leftElements.push(curr)
      } else {
        rightElements.push(curr)
      }
    }
  }

  if (align === LEFT_ALIGN) {
    return leftElements
  } else if (align === RIGHT_ALIGN) {
    return rightElements
  } else {
    return {
      left: leftElements,
      right: rightElements
    }
  }
}


function GeneratorDom () {
  this.generator = new Generator()
  this.setAlign(LEFT_ALIGN)
  this.numColours = 0
  this.colourButtons = []
};

GeneratorDom.prototype.initButtons = function () {
  const form = document.createElement('form')
  let button
  let _this = this
  for (let i = 0; i < options.length; i++) {
    button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn btn-' + options[i].buttonColour)
    button.innerHTML = options[i].title
    button.addEventListener('click', function () {
      _this.addElement(options[i])
      _this.update()
    }, false)
    form.appendChild(button)
  }
  return form
}

GeneratorDom.prototype.initDropdowns = function () {
  const form = document.createElement('form')
  const fgcolours = document.createElement('select')
  const bgcolours = document.createElement('select')
  fgcolours.setAttribute('id', 'fgcolours')
  bgcolours.setAttribute('id', 'bgcolours')
  let colourOption
  for (let i = 0; i < colours.length; i++) {
    colourOption = document.createElement('option')
    colourOption.textContent = colours[i]
    colourOption.value = colours[i]
    fgcolours.appendChild(colourOption)
  }
  for (let i = 0; i < colours.length; i++) {
    colourOption = document.createElement('option')
    colourOption.textContent = colours[i]
    colourOption.value = colours[i]
    bgcolours.appendChild(colourOption)
  }
  let addColourButton = document.createElement('button')
  addColourButton = document.createElement('button')
  addColourButton.setAttribute('type', 'button')
  addColourButton.setAttribute('class', 'btn btn-light')
  addColourButton.innerHTML = 'Add colour'
  let _this = this
  addColourButton.addEventListener('click', function () {
    let fg = document.getElementById('fgcolours').value
    let bg = document.getElementById('bgcolours').value
    _this.addColour(fg, bg)
    _this.update()
  }, false)
  form.innerHTML += '<br>Foreground colour:<br>'
  form.appendChild(fgcolours)
  form.innerHTML += '<br>Background colour:<br>'
  form.appendChild(bgcolours)
  form.innerHTML += '<br><br>'
  form.appendChild(addColourButton)
  return form
}

GeneratorDom.prototype.addElement = function (element) {
  this.generator.addElement(element)
}

GeneratorDom.prototype.update = function () {
  this.updateOutput()
  this.updatePreview()
}

GeneratorDom.prototype.updateOutput = function () {
  const output = document.getElementById('output')
  output.value = this.generator.buildOutput()
}

GeneratorDom.prototype.updatePreview = function () {
  if (this.align === LEFT_ALIGN) {
    let preview = document.getElementById('leftPreview')
    preview.innerHTML = this.generator.buildPreview(LEFT_ALIGN)
  } else {
    let preview = document.getElementById('rightPreview')
    preview.innerHTML = this.generator.buildPreview(RIGHT_ALIGN)
  }
}

GeneratorDom.prototype.clear = function () {
  const output = document.getElementById('output')
  const leftPreview = document.getElementById('leftPreview')
  const rightPreview = document.getElementById('rightPreview')
  output.value = ''
  leftPreview.innerHTML = ''
  rightPreview.innerHTML = ''
  this.generator.removeAllElements()
  const options = document.getElementById('options')
  for (let i = 0; i < this.colourButtons.length; i++) {
    options.removeChild(this.colourButtons[i])
  }
  this.colourButtons = []
}

GeneratorDom.prototype.undo = function () {
  let removed, realign
  do {
    removed = this.generator.removeElement()
    if (removed === LEFT_ALIGN) {
      realign = RIGHT_ALIGN
    } else if (removed === RIGHT_ALIGN) {
      realign = LEFT_ALIGN
    }
  } while (removed === LEFT_ALIGN || removed === RIGHT_ALIGN)

  if (removed != null && removed.title.startsWith('btnColour')) {
    let button = document.getElementById(removed.title)
    document.getElementById('options').removeChild(button)
    this.colourButtons.pop()
  }

  if (realign != null) {
    this.align = realign
    this.setAlign(realign)
  }
  this.update()
}

GeneratorDom.prototype.setAlign = function (align) {
  if (this.align != align) {
    this.generator.addElement(align)
    this.align = align
  }

  if (this.align === LEFT_ALIGN) {
    document.getElementById('leftButton').setAttribute('style', 'border: 4px inset black')
    document.getElementById('rightButton').setAttribute('style', '')
  } else {
    document.getElementById('rightButton').setAttribute('style', 'border: 4px inset black')
    document.getElementById('leftButton').setAttribute('style', '')
  }
}

GeneratorDom.prototype.addColour = function (foreground, background) {
  let numColours = this.colourButtons.length
  if (numColours < 8) {
    numColours++
    const form = document.getElementById('options')
    let colourButton = document.createElement('button')
    colourButton.setAttribute('type', 'button')
    colourButton.setAttribute('id', 'btnColour' + numColours)
    colourButton.setAttribute('class', 'btn btn-light')
    colourButton.setAttribute('style', 'color:' + foreground + ';background-color:' + background + ';')
    colourButton.innerHTML = 'Colour ' + numColours
    let colourElement = {
      title: 'btnColour' + numColours,
      out: '%' + numColours + '*',
      preview: '<span style="color:' + foreground + ';background-color:' + background + ';">',
      extra: 'hi User' + numColours + ' ctermbg=' + background + ' ctermfg=' + foreground + ' guibg=' + background + ' guifg=' + foreground + '\n'
    }
    let _this = this
    colourButton.addEventListener('click', function () {
      _this.addElement(colourElement)
      _this.update()
    }, false)
    form.appendChild(colourButton)
    this.colourButtons.push(colourButton)
    this.addElement(colourElement)
    return colourElement
  } else {
    alert('Vim only allows for 8 colours! Please remove a colour by undoing')
  }
}
