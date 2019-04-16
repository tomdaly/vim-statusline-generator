"use strict";

let options = [
    {
        title: "Modified flag",
        out: "%m",
        preview: "[+]",
        buttonColour: "dark"
    },
    {
        title: "Help flag",
        out: "%h",
        preview: "[Help]",
        buttonColour: "dark"
    },
    {
        title: "Read-only flag",
        out: "%r",
        preview: "[RO]",
        buttonColour: "dark"
    },
    {
        title: "Short filename",
        out: "%f",
        preview: "myscript.js",
        buttonColour: "dark"
    },
    {
        title: "Long filename",
        out: "%F",
        preview: "/home/tom/myscript.js",
        buttonColour: "dark"
    },
    {
        title: "Current line number",
        out: "%l",
        preview: "74",
        buttonColour: "dark"
    },
    {
        title: "Total line number",
        out: "%L",
        preview: "99",
        buttonColour: "dark"
    },
    {
        title: "Percent of file",
        out: "%P",
        preview: "75%",
        buttonColour: "dark"
    },
    {
        title: "File type",
        out: "%y",
        preview: "[javascript]",
        buttonColour: "dark"
    },
    {
        title: "File format",
        out: "%{&ff}",
        preview: "dos",
        buttonColour: "dark"
    },
    {
        title: "File encoding",
        out: "%{strlen(&fenc)?&fenc:'none'}",
        preview: "utf-8",
        buttonColour: "dark"
    },
    {
        title: "Git branch",
        out: "%{b:gitbranch}",
        preview: "(master)",
        buttonColour: "primary",
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
        title: "Mode",
        out: "%{StatuslineMode()}",
        preview: "INSERT",
        buttonColour: "primary",
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
  endif
endfunction
`
    },
    {
        title: "Current time",
        out: "%{strftime(\"%H:%M\")}",
        preview: "11:45",
        buttonColour: "primary"
    },
    {
        title: "Space character",
        out: " ",
        preview: " ",
        buttonColour: "info"
    },
    {
        title: "Pipe character",
        out: "|",
        preview: "|",
        buttonColour: "info"
    },
    {
        title: "Colon character",
        out: ":",
        preview: ":",
        buttonColour: "info"
    },
    {
        title: "Slash character",
        out: "/",
        preview: "/",
        buttonColour: "info"
    },
    {
        title: "Left chevron character",
        out: "<",
        preview: "<",
        buttonColour: "info"
    },
    {
        title: "Right chevron character",
        out: ">",
        preview: ">",
        buttonColour: "info"
    },
    {
        title: "<font color=\"red\">Red foreground</font>",
        out: "%1*\\",
        preview: "<font color=\"red\">",
        buttonColour: "light",
        extra: "hi User1 ctermbg=black ctermfg=red guibg=black guifg=red\n"
    },
    {
        title: "<font color=\"blue\">Blue foreground</font>",
        out: "%2*\\",
        preview: "<font color=\"blue\">",
        buttonColour: "light",
        extra: "hi User2 ctermbg=black ctermfg=blue guibg=black guifg=blue\n"
    },
    {
        title: "<font color=\"green\">Green foreground</font>",
        out: "%3*\\",
        preview: "<font color=\"green\">",
        buttonColour: "light",
        extra: "hi User3 ctermbg=black ctermfg=green guibg=black guifg=green\n"
    },
    {
        title: "<font color=\"black\">Reset foreground</font>",
        out: "%9*\\",
        preview: "<font color=\"black\">",
        buttonColour: "light",
        extra: "hi User9 NONE\n"
    },
];

function Generator() {
    this.leftElements = [];
    this.rightElements = [];
};

Generator.prototype.addElement = function(element, isLeftAlign) {
    if (isLeftAlign) {
        this.leftElements.push(element);
    } else {
        this.rightElements.push(element);
    }
};

Generator.prototype.removeAllElements = function() {
    while (this.leftElements.length) {
        this.leftElements.pop();
    }
    while (this.rightElements.length) {
        this.rightElements.pop();
    }
};

Generator.prototype.buildOutput = function() {
    let output = "set laststatus=2\n";
    let extra = "";
    for (let i = 0; i < this.leftElements.length; i++) {
        let curr = this.leftElements[i];
        output += "set statusline+=" + curr.out + "\n";
        if (curr.extra != null) {
            extra += curr.extra;
        }
    }
    if (this.rightElements.length) {
        output += "set statusline+=%=\n";
    }
    for (let i = 0; i < this.rightElements.length; i++) {
        let curr = this.rightElements[i];
        output += "set statusline+=" + curr.out + "\n";
        if (curr.extra != null) {
            extra += curr.extra;
        }
    }
    return output + extra;
};

Generator.prototype.buildPreview = function(align) {
    let preview = "";
    let elements;
    if (align == "left") {
        elements = this.leftElements;
    } else {
        elements = this.rightElements;
    }
    for (let i = 0; i < elements.length; i++) {
        let curr = elements[i];
        preview += curr.preview;
    }
    return preview;
};

function GeneratorDom() { 
    this.generator = new Generator();
    this.leftAlign = true;
    this.alignLeft(true);
};

GeneratorDom.prototype.init = function() {
    const form = document.createElement("form");
    let button;
    let _this = this;
    for (let i = 0; i < options.length; i++) {
        button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-" + options[i].buttonColour);
        button.innerHTML = options[i].title;
        button.addEventListener("click", function() {
            _this.generator.addElement(options[i], _this.leftAlign);
            _this.update();
        }, false);
        form.appendChild(button);
    }
    return form;
};

GeneratorDom.prototype.update = function() {
    this.updateOutput();
    this.updatePreview();
};

GeneratorDom.prototype.updateOutput = function() {
    const output = document.getElementById("output");
    output.value = this.generator.buildOutput();
};

GeneratorDom.prototype.updatePreview = function() {
    if(this.leftAlign) {
        let preview = document.getElementById("leftPreview");
        preview.innerHTML = this.generator.buildPreview("left");
    } else {
        let preview = document.getElementById("rightPreview");
        preview.innerHTML = this.generator.buildPreview("right");
    }
};

GeneratorDom.prototype.clear = function() {
    const output = document.getElementById("output");
    const leftPreview = document.getElementById("leftPreview");
    const rightPreview = document.getElementById("rightPreview");
    output.value = "";
    leftPreview.innerHTML = "";
    rightPreview.innerHTML = "";
    this.generator.removeAllElements();
};

GeneratorDom.prototype.alignLeft = function(state) {
    this.leftAlign = state;
    if(this.leftAlign) {
        document.getElementById("leftButton").setAttribute("style", "border: 4px inset black");
        document.getElementById("rightButton").setAttribute("style", "");
    } else {
        document.getElementById("rightButton").setAttribute("style", "border: 4px inset black");
        document.getElementById("leftButton").setAttribute("style", "");
    }
};
