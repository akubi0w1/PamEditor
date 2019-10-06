function PamEditor(id, options) {
    // console.log(options.height);

    this.render(id);
}

PamEditor.prototype.render = function (id) {
    // エディタのdiv作成
    var editor = document.createElement("div");
    editor.id = id;
    editor.className = "PamEditor";

    // setting toolbar
    var toolbar = this.createToolbar();
    editor.appendChild(toolbar);

    // render
    document.body.appendChild(editor);
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
            elem.innerHTML = tool;
        }
        toolbar.appendChild(elem);
    });
    return toolbar
}