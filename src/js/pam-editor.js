var marked = require('marked');
var syncscroll = require('./syncscroll');

// default values of options
const defaultOptions = {
    width: "100%",
    height: "512px",
    tools: [
        "heading", "bold", "italic", "strikethrough", "|",
        "link", "quote", "horizon", "|", "unordered-list", "ordered-list", "table", "image", "|",
        "code", "code-block", "|",
        "toggle-side-by-side", "toggle-editor", "toggle-preview", "|",
        "toggle-scroll-syncro", "toggle-scroll-separate"
    ],
    status: [
        "mode",
        "scroll",
    ],
    placeholder: [
        "Please write markdown..."
    ],
    defaultText: [
        ""
    ],
};

// items and functions of toolbar
const toolset = {
    "heading": {
        text: "heading",
        action: toggleHeading,
        className: "fas fa-heading"
    },
    "bold": {
        text: "bold",
        action: toggleBold,
        className: "fas fa-bold",
    },
    "italic": {
        text: "italic",
        action: toggleItalic,
        className: "fas fa-italic",
    },
    "strikethrough": {
        text: "strikethrough",
        action: toggleStrikethrough,
        className: "fas fa-strikethrough",
    },
    "link": {
        text: "link",
        action: toggleLink,
        className: "fas fa-link",
    },
    "quote": {
        text: "quote",
        action: toggleQuote,
        className: "fas fa-quote-right",
    },
    "horizon": {
        text: "horizon",
        action: toggleHorizon,
        className: "fas fa-minus",
    },
    "unordered-list": {
        text: "list-ul",
        action: toggleUnorderedList,
        className: "fas fa-list-ul",
    },
    "ordered-list": {
        text: "list-ol",
        action: toggleOrderedList,
        className: "fas fa-list-ol",
    },
    "table": {
        text: "table",
        action: toggleTable,
        className: "fas fa-table",
    },
    "image": {
        text: "image",
        action: toggleImage,
        className: "far fa-image",
    },
    "code": {
        text: "code",
        action: toggleCode,
        className: "fas fa-code",
    },
    "code-block": {
        text: "code-block",
        action: toggleCodeBlock,
        className: "far fa-file-code",
    },
    "toggle-side-by-side": {
        text: "toggle-side-by-side",
        action: toggleSideBySide,
        className: "fas fa-columns",
    },
    "toggle-editor": {
        text: "toggle-editor",
        action: toggleEditor,
        className: "fas fa-edit",
    },
    "toggle-preview": {
        text: "toggle-preview",
        action: togglePreview,
        className: "far fa-eye",
    },
    "toggle-scroll-syncro": {
        text: "toggle-scroll-syncro",
        action: toggleScrollSyncro,
        className: "fas fa-clone",
    },
    "toggle-scroll-separate": {
        text: "toggle-scroll-separate",
        action: toggleScrollSeparate,
        className: "fas fa-pause",
    },
}

// actions of toolbar
function textEntry (self, wordStart, wordEnd) {
    var editor = self.editor
    var textarea = document.querySelector("#" + editor.id + " .editor");

    var sentence = textarea.value;
    var len = sentence.length;
    var cursorStart = textarea.selectionStart;
    var cursorEnd = textarea.selectionEnd;

    var before = sentence.slice(0, cursorStart);
    var middle = sentence.slice(cursorStart, cursorEnd);
    var after = sentence.slice(cursorEnd, len);

    textarea.value = before + wordStart + middle + wordEnd + after;

    self.renderPreview();
}

function toggleHeading(self) {
    if (!self) {return}
    return textEntry(self, "#", "");
}

function toggleBold(self) {
    if (!self) {return}
    return textEntry(self, "**", "**");
}

function toggleItalic(self) {
    if (!self) {return}
    return textEntry(self, "*", "*");
}

function toggleStrikethrough(self) {
    if (!self) {return}
    return textEntry(self, "~", "~");
}

function toggleLink(self) {
    if (!self) {return}
    return textEntry(self, "[text](url)", "");
}

function toggleQuote(self) {
    if (!self) {return}
    return textEntry(self, ">", "");
}

function toggleHorizon(self) {
    if (!self) {return}
    return textEntry(self, "---", "");
}

function toggleUnorderedList(self) {
    if (!self) {return}
    return textEntry(self, "- ", "");
}

function toggleOrderedList(self) {
    if (!self) {return}
    return textEntry(self, "1. ", "");
}

function toggleTable(self) {
    if (!self) { return }
    var text = "| head | head | head |\n|:---:|:---:|:---:|\n| body | body | body |\n";
    return textEntry(self, text, "");
}

function toggleImage(self) {
    if (!self) { return }
    return textEntry(self, "![text](url)", "")
}

function toggleCode(self) {
    if (!self) {return}
    return textEntry(self, "`", "`");
}

function toggleCodeBlock(self) {
    if (!self) {return}
    return textEntry(self, "```\n", "\n```");
}

function toggleSideBySide (self) {
    if (!self) {
        return
    }
    var editor = self.editor;
    var elem = document.querySelector("#" + editor.id + " .edit-block");
    if (elem.className.indexOf("side") > -1) {
        return
    }
    elem.className = "edit-block side";
    elem = document.querySelector("#" + editor.id + " .preview-block");
    elem.className = "preview-block side";

    document.querySelector("#" + editor.id + " .mode").textContent = "sidebyside";
    
}

function toggleEditor(self) {
    if (!self) {
        return
    }
    var editor = self.editor;
    var elem = document.querySelector("#" + editor.id + " .edit-block");
    if(elem.className.indexOf("only") > -1) {
        return
    }
    elem.className = "edit-block only";
    elem = document.querySelector("#" + editor.id + " .preview-block");
    elem.className = "preview-block";
    document.querySelector("#" + editor.id + " .mode").textContent = "edit";
}

function togglePreview (self) {
    if (!self) {
        return
    }
    var editor = self.editor;
    var elem = document.querySelector("#" + editor.id + " .preview-block");
    if(elem.className.indexOf("only") > -1) {
        return
    }
    elem.className = "preview-block only";
    elem = document.querySelector("#" + editor.id + " .edit-block");
    elem.className = "edit-block";

    document.querySelector("#" + editor.id + " .mode").textContent = "preview";
}

function toggleScrollSyncro (self) {
    if (!self) { return }
    var editor = self.editor;
    var elem = document.querySelector("#" + editor.id + " .editor");
    if(elem.className.indexOf("syncscroll") > -1) {
        return;
    }
    elem.className = "editor syncscroll";
    elem = document.querySelector("#" + editor.id + " .preview");
    elem.className = "preview syncscroll";
    syncscroll.reset();

    document.querySelector("#" + editor.id + " .scroll").textContent = "syncro";
}

function toggleScrollSeparate (self) {
    if (!self) { return }
    var editor = self.editor;
    var elem = document.querySelector("#" + editor.id + " .editor");
    if(elem.className.indexOf("syncscroll") <= -1) {
        return;
    }
    elem.className = "editor";
    elem = document.querySelector("#" + editor.id + " .preview");
    elem.className = "preview";
    syncscroll.reset();

    document.querySelector("#" + editor.id + " .scroll").textContent = "separate";
}

// TODO: getBody, setBody?

// editor
function PamEditor(id, options) {
    var editor = document.createElement("div");
    editor.id = id;
    editor.className = "PamEditor";
    this.editor = editor;
    this.options = {};
    if(options) {
        this.options = options;
    }

    // setting marked
    this.initMarkdown();

    // render preview
    this.render();

    // setting live preview
    document.querySelector("#" + id + " .editor").onkeyup = this.renderLivePreview;

    // options
    this.setOptions();
    
    this.renderPreview()
}

PamEditor.prototype.setOptions = function () {
    // width
    if(this.options.width) {
        document.getElementById(this.editor.id).style.width = this.options.width;
    }
    
    // height
    if(!this.editor.style.height && this.options.height) {
        document.querySelector("#" + this.editor.id + " .editor").style.height = this.options.height;
        document.querySelector("#" + this.editor.id + " .preview").style.height = this.options.height;
    }

    // status
    if (!this.options.status) {
        this.options.status = defaultOptions.status;
    }
    this.options.status.map(status => {
        document.querySelector("#" + this.editor.id + " ." + status).style.display = "inline-block";
    });

    // placeholder
    if (!this.options.placeholder) {
        this.options.placeholder = defaultOptions.placeholder;
    }
    document.querySelector("#" + this.editor.id + " .editor").placeholder = this.options.placeholder;

    // default text
    if (this.options.defaultText){
        document.querySelector("#" + this.editor.id + " .editor").value = this.options.defaultText;
    }
}


PamEditor.prototype.render = function () {
    // setting toolbar
    var toolbar = this.createToolbar();
    this.editor.appendChild(toolbar);

    // setting editor
    var editor = this.createEditor();
    this.editor.appendChild(editor);

    // setting status
    var statusbar = this.createStatus();
    this.editor.appendChild(statusbar);

    // render
    document.body.appendChild(this.editor);
};

PamEditor.prototype.createToolbar = function () {
    // setting tools
    var tools = defaultOptions.tools;
    if(this.options.tools) {
        tools = this.options.tools;
    }

    var self = this;

    // toolbarの生成
    var toolbar = document.createElement("div");
    toolbar.className = "PamEditor-toolbar";
    tools.map(tool => {
            if (tool === "|") {
            var elem = document.createElement("span");
            elem.innerHTML = tool;
        } else {
            var elem = document.createElement("button");
            elem.onclick = function(){toolset[tool].action(self);};
            elem.innerHTML = '<i class="' + toolset[tool].className + '"></i>';
        }
        toolbar.appendChild(elem);
    });
    return toolbar
};

PamEditor.prototype.createEditor = function () {
    // editorの生成
    var editor = document.createElement("div");
    editor.className = "PamEditor-editor";

    // edit block
    var editBlock = this.createEditBlock(this.editor.id);
    editor.appendChild(editBlock);

    // preview block
    var previewBlock = this.createPreviewBlock(this.editor.id);
    editor.appendChild(previewBlock);

    return editor
};

PamEditor.prototype.createEditBlock = function () {
    // edit-blockの生成
    var editBlock = document.createElement("div");
    editBlock.className = "edit-block side";

    var editArea = document.createElement("textarea");
    editArea.className = "editor syncscroll";
    editArea.title = this.editor.id;

    editBlock.appendChild(editArea);
    return editBlock;
};

PamEditor.prototype.createPreviewBlock = function () {
    var previewBlock = document.createElement("div");
    previewBlock.className = "preview-block side";

    var previewArea = document.createElement("div");
    previewArea.className = "preview syncscroll";
    previewArea.title = this.editor.id;

    previewBlock.appendChild(previewArea);
    return previewBlock;
};

PamEditor.prototype.createStatus = function () {
    const st = {
        mode: "sidebyside",
        scroll: "syncro",
    };
    
    // create statusbar
    var statusbar = document.createElement("div");
    statusbar.className = "PamEditor-status";

    for (let[key, value] of Object.entries(st)){
        var elem = document.createElement("span");
        elem.className = key;
        elem.innerHTML = value;
        statusbar.appendChild(elem);
    }
    return statusbar;
};

PamEditor.prototype.initMarkdown = function() {
    if(marked){
        // setting option
        marked.setOptions({
            pedantic: false,
            gfm: true,
            breaks: true,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            xhtml: false,
            gfm: true,
            tables: true,
            highlight: function(code, lang) {
                return window.hljs.highlightAuto(code).value;
            },
        });
    }
};

PamEditor.prototype.renderPreview = function () {
    var id = this.editor.id;
    var text = document.querySelector("#" + id + " .editor").value;
    document.querySelector("#" + id + " .preview").innerHTML = marked(text);
}

PamEditor.prototype.renderLivePreview = function () {
    var id = this.title;
    document.querySelector("#" + id + " .preview").innerHTML = marked(this.value);

}

PamEditor.prototype.getMarkdownText = function() {
    return document.querySelector("#" + this.editor.id + " .editor").value;
}

PamEditor.prototype.getHtmlText = function() {
    return marked(this.getMarkdownText());
}


module.exports = PamEditor;
