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

function toggleEditor(editor) {
    var elem = document.querySelector("#" + editor.id + " .edit-block");
    if(elem.className.indexOf("only") > -1) {
        return
    }
    elem.className = "edit-block only";
    elem = document.querySelector("#" + editor.id + " .preview-block");
    elem.className = "preview-block";
    document.querySelector("#" + editor.id + " .mode").textContent = "edit";
}

function togglePreview (editor) {
    var elem = document.querySelector("#" + editor.id + " .preview-block");
    if(elem.className.indexOf("only") > -1) {
        return
    }
    elem.className = "preview-block only";
    elem = document.querySelector("#" + editor.id + " .edit-block");
    elem.className = "edit-block";

    document.querySelector("#" + editor.id + " .mode").textContent = "preview";
}

function toggleSideBySide (editor) {
    var elem = document.querySelector("#" + editor.id + " .edit-block");
    if (elem.className.indexOf("side") > -1) {
        return
    }
    elem.className = "edit-block side";
    elem = document.querySelector("#" + editor.id + " .preview-block");
    elem.className = "preview-block side";

    document.querySelector("#" + editor.id + " .mode").textContent = "sidebyside";
    
}


// function renderPreview (id) {
//     var text = document.querySelector("#" + id + " .editor").value;
//     document.querySelector("#" + id + " .preview").innerHTML = marked(text);
// }


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
    this.render();
    this.initPreview()

    // setting live preview
    document.querySelector("#" + id + " .editor").onkeyup = this.renderPreview;
    
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
    const tools = [
        "heading", "bold", "italic", "strikethrough", "|",
        "link", "quote", "horizon", "|", "unordered-list", "ordered-list", "table", "image", "|",
        "code", "code-block", "|",
        "toggle-side-by-side", "toggle-editor", "toggle-preview"
    ];

    var editor = this.editor;

    // toolbarの生成
    var toolbar = document.createElement("div");
    toolbar.className = "PamEditor-toolbar";
    const setToolbar = tools.map(tool => {
            if (tool === "|") {
            var elem = document.createElement("span");
            elem.innerHTML = tool;
        } else {
            var elem = document.createElement("button");
            elem.onclick = function(){toolset[tool].action(editor);};
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

    // TODO: name
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

PamEditor.prototype.initPreview = function () {
    var id = this.editor.id;
    var text = document.querySelector("#" + id + " .editor").value;
    document.querySelector("#" + id + " .preview").innerHTML = marked(text);
}

PamEditor.prototype.renderPreview = function () {
    var id = this.title;
    document.querySelector("#" + id + " .preview").innerHTML = marked(this.value);
}

// bind
PamEditor.toggleEditor = toggleEditor;


PamEditor.prototype.toggleEditor = function () {
    console.log(this);
}



module.exports = PamEditor;