var marked = require('marked');

// items and functions of toolbar
const toolset = {
    "heading": {
        text: "heading",
        action: "",
        className: "fas fa-heading"
    },
    "bold": {
        text: "bold",
        action: toggleBold,
        className: "fas fa-bold",
    },
    "italic": {
        text: "italic",
        action: "",
        className: "fas fa-italic",
    },
    "strikethrough": {
        text: "strikethrough",
        action: "",
        className: "fas fa-strikethrough",
    },
    "unordered-list": {
        text: "list-ul",
        action: "",
        className: "fas fa-list-ul",
    },
    "ordered-list": {
        text: "list-ol",
        action: "",
        className: "fas fa-list-ol",
    },
    "link": {
        text: "link",
        action: "",
        className: "fas fa-link",
    },
    "quote": {
        text: "quote",
        action: "",
        className: "fas fa-quote-right",
    },
    "image": {
        text: "image",
        action: "",
        className: "far fa-image",
    },
    "code": {
        text: "code",
        action: "",
        className: "fas fa-code",
    },
    "code-block": {
        text: "code-block",
        action: "",
        className: "far fa-file-code",
    },
    "table": {
        text: "table",
        action: "",
        className: "fas fa-table",
    },
    "horizon": {
        text: "horizon",
        action: "",
        className: "fas fa-minus",
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
    "toggle-side-by-side": {
        text: "toggle-side-by-side",
        action: toggleSideBySide,
        className: "fas fa-columns",
    }

}

function toggleBold() {
    console.log("toggle bold");
}

function toggleEditor() {
    console.log("toggleEditor");
}

function togglePreview () {
    console.log("togglePreview");
}

function toggleSideBySide () {
    console.log("toggle side by side");
}


function renderPreview (id) {
    var text = document.querySelector("#" + id + " .editor").value;
    document.querySelector("#" + id + " .preview").innerHTML = marked(text);
}


// editor
function PamEditor(id, options) {
    // console.log(options.height);
    var editor = document.createElement("div");
    editor.id = id;
    editor.className = "PamEditor";
    this.editor = editor;

    // markedのoptionを設定
    this.initMarkdown();

    // editorのレンダリング
    this.render(id);

    //renderPreview(id);
    renderPreview(id);
}

PamEditor.prototype.render = function (id) {
    // setting toolbar
    var toolbar = this.createToolbar();
    this.editor.appendChild(toolbar);

    // setting editor
    var editor = this.createEditor(id);
    this.editor.appendChild(editor);

    // setting status
    var statusbar = this.createStatus();
    this.editor.appendChild(statusbar);

    // render
    document.body.appendChild(this.editor);
};

PamEditor.prototype.createToolbar = function () {
    const tools = [
        "heading", "bold", "italic", "strikethrough", "|",
        "link", "quote", "horizon", "|", "unordered-list", "ordered-list", "table", "image", "|",
        "code", "code-block", "|",
        "toggle-side-by-side", "toggle-editor", "toggle-preview"
    ];


    // toolbarの生成
    var toolbar = document.createElement("div");
    toolbar.className = "PamEditor-toolbar";
    const setToolbar = tools.map(tool => {
            if (tool === "|") {
            var elem = document.createElement("span");
            elem.innerHTML = tool;
        } else {
            var elem = document.createElement("button");
            elem.onclick = toolset[tool].action;
            elem.innerHTML = '<i class="' + toolset[tool].className + '"></i>';
        }
        toolbar.appendChild(elem);
    });
    return toolbar
};

PamEditor.prototype.createEditor = function (id) {
    // editorの生成
    var editor = document.createElement("div");
    editor.className = "PamEditor-editor";
    
    // edit block
    var editBlock = this.createEditBlock(id);
    editor.appendChild(editBlock);

    // preview block
    var previewBlock = this.createPreviewBlock(id);
    editor.appendChild(previewBlock);

    return editor


};

PamEditor.prototype.createEditBlock = function (id) {
    // edit-blockの生成
    var editBlock = document.createElement("div");
    editBlock.className = "edit-block";

    var editArea = document.createElement("textarea");
    editArea.className = "editor syncscroll";
    editArea.title = id;
    editArea.onkeyup = function(){renderPreview(id)};

    editBlock.appendChild(editArea);
    return editBlock;
};

PamEditor.prototype.createPreviewBlock = function (id) {
    var previewBlock = document.createElement("div");
    previewBlock.className = "preview-block";

    // TODO: name
    var previewArea = document.createElement("div");
    previewArea.className = "preview syncscroll";
    previewArea.title = id;

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
            // highlight: function(code) {
            //     return require('highlight.js').highlightAuto(code).value;
            // },
            pedantic: false,
            gfm: true,
            breaks: true,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

        // render?
    }
};

module.exports = PamEditor;