'use strict';

var ace = require('brace');
require('brace/theme/cobalt');
require('brace/theme/solarized_dark');
require('brace/mode/javascript');

function createElement(str) {
  const container = document.createElement('div');
  container.innerHTML = str.trim();
  return container.firstChild;
}

document.title = 'ready set js'

window.addEventListener('load', function() {
  document.body.appendChild(createElement(`
    <style>
      body {
        margin: 0;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
      }

      .left {
        position: absolute;
        left: 0;
        top: 0;
        width: 50vw;
        height: 100vh;
      }

      .right {
        position: absolute;
        left: 50vw;
        top: 0;
        width: 50vw;
        height: 100vh;
      }

      iframe {
        border: 0;
      }
    </style>
  `));

  const div = createElement(`<div class='left' id='editor'></div>`);
  document.body.appendChild(div);

  var editor = ace.edit('editor');
  editor.getSession().setMode("ace/mode/javascript");
  editor.setTheme('ace/theme/solarized_dark');

  editor.setOptions({
    tabSize: 2,
    softTab: true,
    printMargin: false,
    displayIndentGuides: true
  });

  editor.setValue(
`'use strict';

// readysetjs config: {"autoRun": true}

// Tip: If you set autoRun to false, you can execute
// with Ctrl+Enter or Cmd+Enter.

window.addEventListener('load', () => {
  document.body.appendChild(
    document.createTextNode('Hello world!')
  );
});
`
  );

  window.editor = editor;
  window.Buffer = Buffer;

  window.run = () => {
    if (window.outputFrame) {
      window.outputFrame.remove();
      window.outputFrame = undefined;
    }

    window.outputFrame = createElement(`<iframe class='right' src='data:text/html;base64,${
      (new Buffer(
`<!DOCTYPE html>
<html>
<head>
<title>readysetjs output</title>

<script>
${editor.getValue()}
</scri${''}pt>

</head>
<body>
</body>
</html>
`
      )).toString('base64')
    }'></iframe>`);

    window.output = window.outputFrame.contentWindow;

    document.body.appendChild(window.outputFrame);
  };

  editor.on('change', () => {
    const code = editor.getValue();
    const firstLine = code.split('\n')[0] || '';
    const prefix = '// readysetjs config: ';

    let config = {autoRun: false};

    if (firstLine.substring(0, prefix.length) === prefix) {
      try {
        config = JSON.parse(firstLine.substring(prefix.length));
      } catch(e) {
        console.error(e);
      }
    }

    if (config.autoRun) {
      window.run();
    }
  });

  window.addEventListener('keydown', event => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      window.run();
      event.preventDefault();
    }
  });

  window.run();
});
