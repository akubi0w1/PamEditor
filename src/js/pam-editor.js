function PamEditor(elem, options) {
    var editor = document.createElement("div");
    editor.id = elem;
    editor.className = "PamEditor";
    document.body.appendChild(editor);
    console.log(options.height);

    this.render();
}

PamEditor.prototype = {
    render: function () {
        this.createToolbar();
    },

    createToolbar: function () {
        tools = [
            "bold", "italic", "delete",
        ];

        // toolbarの生成？
        var toolBlock = document.createElement("div");
        toolBlock.className = "PamEditor-tools";

        const setToolbar = tools.map(tool => {
            document
        });
    },
}