function PamEditor(id, options) {
    // console.log(options.height);
    var editor = document.createElement("div");
    editor.id = id;
    editor.className = "PamEditor";
    this.editor = editor;

    this.render();
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
}

PamEditor.prototype.createToolbar = function () {
    tools = [
        "bold", "italic", "delete", "|", "preview",
    ];

    // toolbarの生成
    var toolbar = document.createElement("div");
    toolbar.className = "PamEditor-toolbar";
    const setToolbar = tools.map(tool => {
        if (tool === "|") {
            var elem = document.createElement("span");
        } else {
            var elem = document.createElement("button");
        }
        elem.innerHTML = tool;
        toolbar.appendChild(elem);
    });
    return toolbar
}

PamEditor.prototype.createEditor = function () {
    // editorの生成
    var editor = document.createElement("div");
    editor.className = "PamEditor-editor";
    
    // edit block
    var editBlock = this.createEditBlock();
    editor.appendChild(editBlock);

    // preview block
    var previewBlock = this.createPreviewBlock();
    editor.appendChild(previewBlock);

    return editor


}

PamEditor.prototype.createEditBlock = function () {
    // edit-blockの生成
    var editBlock = document.createElement("div");
    editBlock.className = "edit-block";

    // TODO: name, onkeyup追加
    var editArea = document.createElement("textarea");
    editArea.className = "editor syncscroll";

    editBlock.appendChild(editArea);
    return editBlock;
}

PamEditor.prototype.createPreviewBlock = function () {
    var previewBlock = document.createElement("div");
    previewBlock.className = "preview-block";

    // TODO: name
    var previewArea = document.createElement("div");
    previewArea.className = "preview sysncscroll";

    previewBlock.appendChild(previewArea);
    return previewBlock;
}

PamEditor.prototype.createStatus = function () {
    st = {
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
}