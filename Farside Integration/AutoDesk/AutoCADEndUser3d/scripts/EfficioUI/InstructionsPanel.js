﻿/////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.DockingPanel
// by Philippe Leefsma, May 2015
//
/////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.InstructionsPanel = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);
    var _isMinimized = false;
    var _panel = null;
    var _loaded = false;

    this.isLoaded = function () {
        return _loaded;
    }

    /////////////////////////////////////////////////////////////////
    // Extension load callback
    //
    /////////////////////////////////////////////////////////////////
    this.load = function () {

        _panel = new Panel(
          viewer.container,
          guid());

        _panel.setVisible(true);

        console.log('Autodesk.ADN.Viewing.Extension.InstructionsPanel loaded');
        _loaded = true;
        return true;
    }

    /////////////////////////////////////////////////////////////////
    //  Extension unload callback
    //
    /////////////////////////////////////////////////////////////////
    this.unload = function () {

        _panel.setVisible(false);

        console.log('Autodesk.ADN.Viewing.Extension.InstructionsPanel unloaded');
        _loaded = false;
        return true;
    }

    this.minimize = function () {
        if (!_isMinimized) {
            _isMinimized = !_isMinimized;

            $(_panel.container).addClass(
              'docking-panel-minimized');
        }
    }

    this.maximize = function () {
        if (_isMinimized) {
            _isMinimized = !_isMinimized;

            $(_panel.container).removeClass(
              'docking-panel-minimized');
        }
    }

    /////////////////////////////////////////////////////////////////
    // Generates random guid to use as DOM id
    //
    /////////////////////////////////////////////////////////////////
    function guid() {

        var d = new Date().getTime();

        var guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
          /[xy]/g,
          function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });

        return guid;
    }

    /////////////////////////////////////////////////////////////////
    // The demo Panel
    //
    /////////////////////////////////////////////////////////////////
    var Panel = function (
      parentContainer, id) {

        var _thisPanel = this;

        _thisPanel.content = document.createElement('div');

        Autodesk.Viewing.UI.DockingPanel.call(
          this,
          parentContainer,
          id,
          'Instructions',
          { shadow: true });

        $(_thisPanel.container).addClass('docking-panel');

        /////////////////////////////////////////////////////////////
        // Custom html
        //
        /////////////////////////////////////////////////////////////

        var micInstructions;
        var navInstructions;
        var anchorID = guid();

        if (Efficio.DeviceManager.RegisteredDevices.Microphone.IsConnected()) {
            micInstructions = 'Efficio has detected that you have a microphone connected!' +
                '<br/><br/>' +
                'You can reopen these instructions at any time by saying "Open Instructions"';

            navInstructions = 'say or click';
        }
        else {

            micInstructions = 'Efficio has detected that you do not have a microphone connected!  ' +
                'Connect a microphone and reload this page to experience Efficio speech recognition.';

            navInstructions = 'click';
        }

        var html = [

          '<div class="instructions"><br/>',
          'Welcome to Efficio with AutoCAD!',
          '<br/><br/>',
          'Here we plan on demoing some of the cool features we are working on.',
          '<br/><br/>',
          micInstructions,
          '<br/><br/>',
          'To move on to the next part of the demo, ' + navInstructions + ' <a href="#" id="' + anchorID + '">Verbal Instructions</a>',
          '</div>'
        ];

        $(_thisPanel.container).append(html.join('\n'));

        if (anchorID) {
            $('#' + anchorID).click(procedeToNext)
        }

        /////////////////////////////////////////////////////////////
        // button clicked handler
        //
        /////////////////////////////////////////////////////////////
        function procedeToNext(event) {
            event.preventDefault();
            Efficio.Configuration.ActionToFunctionMapping.AudioCommands[":command Instructions"]('verbal');
            return false;
        }

        /////////////////////////////////////////////////////////////
        // setVisible override (not used in that sample)
        //
        /////////////////////////////////////////////////////////////
        _thisPanel.setVisible = function (show) {

            Autodesk.Viewing.UI.DockingPanel.prototype.
              setVisible.call(this, show);
        }

        /////////////////////////////////////////////////////////////
        // initialize override
        //
        /////////////////////////////////////////////////////////////
        _thisPanel.initialize = function () {

            this.title = this.createTitleBar(
              this.titleLabel ||
              this.container.id);

            this.closer = this.createCloseButton();

            this.container.appendChild(this.title);
            this.title.appendChild(this.closer);
            this.container.appendChild(this.content);

            this.initializeMoveHandlers(this.title);
            this.initializeCloseHandler(this.closer);
        };

        /////////////////////////////////////////////////////////////
        // onTitleDoubleClick override
        //
        /////////////////////////////////////////////////////////////

        _thisPanel.onTitleDoubleClick = function (event) {

            _isMinimized = !_isMinimized;

            if (_isMinimized) {

                $(_thisPanel.container).addClass(
                  'docking-panel-minimized');
            }
            else {
                $(_thisPanel.container).removeClass(
                  'docking-panel-minimized');
            }
        };
    };

    /////////////////////////////////////////////////////////////
    // Set up JS inheritance
    //
    /////////////////////////////////////////////////////////////
    Panel.prototype = Object.create(
      Autodesk.Viewing.UI.DockingPanel.prototype);

    Panel.prototype.constructor = Panel;

    /////////////////////////////////////////////////////////////
    // Add needed CSS
    //
    /////////////////////////////////////////////////////////////
    var css = [

      'form.docking-panel-controls{',
        'margin: 20px;',
      '}',

      'input.docking-panel-name {',
        'height: 30px;',
        'margin-left: 5px;',
        'margin-bottom: 5px;',
        'margin-top: 5px;',
        'border-radius:5px;',
      '}',

      'div.docking-panel {',
        'top: 0px;',
        'left: 0px;',
        'width: 305px;',
        'height: 100%;',
        'resize: none;',
      '}',

      'div.docking-panel-minimized {',
        'height: 34px;',
        'min-height: 34px',
      '}',

      'div.instructions {',
        'color: #fff;',
        'padding: 10px',
      '}'

    ].join('\n');

    $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.InstructionsPanel.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.InstructionsPanel.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.InstructionsPanel;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.InstructionsPanel',
  Autodesk.ADN.Viewing.Extension.InstructionsPanel);