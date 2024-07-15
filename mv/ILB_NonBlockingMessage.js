//=============================================================================
// ILB_NonBlockingMessage.js
//=============================================================================

/*:
 * @plugindesc Creates a non blocking text message
 * @author I_LIKE_BREAD7
 *
 * @help
 *
 * Plugin Command:
 *   ILB_NonBlockingMessage text            # Displays message containing "text"
 *   ILB_NonBlockingMessagePermanent text   # Displays message containing "text" permanently until closed with the ILB_NonBlockingMessageClose command
 *   ILB_NonBlockingMessageClose            # Closes permanent message
 *   ILB_NonBlockingMessageXY 10 20 center  # Sets x = 10, y = 20 and align = center (align in optional)
 */

(function() {

    var _ILB_text;
    var _ILB_x = 0;
    var _ILB_y = 0;
    var _ILB_align = 'center';
    var _ILB_permanent = false;

    //-----------------------------------------------------------------------------
    // ILB_NonBlockingMessage
    //
    // The window for displaying the non blocking message
    function ILB_NonBlockingMessage() {
        this.initialize.apply(this, arguments);
    }

    ILB_NonBlockingMessage.prototype = Object.create(Window_MapName.prototype);
    ILB_NonBlockingMessage.prototype.constructor = ILB_NonBlockingMessage;

    ILB_NonBlockingMessage.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (_ILB_permanent) {
            this.updateFadeIn();
            return;
        }
        if (this._showCount > 0) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    };

    ILB_NonBlockingMessage.prototype.refresh = function() {
        this.contents.clear();
        if (_ILB_text) {
            var width = this.contentsWidth();
            this.drawBackground(_ILB_x, _ILB_y, width, this.lineHeight());
            this.drawText(_ILB_text, _ILB_x, _ILB_y, width, _ILB_align);
        }
    };

    ILB_NonBlockingMessage.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
    
    ILB_NonBlockingMessage.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    var _ILB_nonBlockingMessage = null;
    var oldSceneMapcreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        oldSceneMapcreateDisplayObjects.call(this);
        _ILB_nonBlockingMessage = new ILB_NonBlockingMessage();
        this.addChild(_ILB_nonBlockingMessage);
    };

    var oldPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        oldPluginCommand.call(this, command, args);
        switch (command) {
            case 'ILB_NonBlockingMessage':
                _ILB_permanent = false;
                _ILB_text = _ILB_nonBlockingMessage.convertEscapeCharacters(args.join(' '));
                _ILB_nonBlockingMessage.open();
            break;
            case 'ILB_NonBlockingMessagePermanent':
                _ILB_permanent = true;
                _ILB_text = _ILB_nonBlockingMessage.convertEscapeCharacters(args.join(' '));
                _ILB_nonBlockingMessage.open();
            break;
            case 'ILB_NonBlockingMessageXY':
                _ILB_x = Number(args[0]);
                _ILB_y = Number(args[1]);
                if (args[2]) {
                    _ILB_align = args[2];
                }
            break;
            case 'ILB_NonBlockingMessageClose':
                _ILB_permanent = false;
                _ILB_nonBlockingMessage.close();
            break;
        }
    };

})();