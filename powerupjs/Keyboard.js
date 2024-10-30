"use strict";

var powerupjs = (function (powerupjs) {

    function handleKeyDown(evt) {
        var code = evt.keyCode;
        if (code < 0 || code > 255)
            return;
        if (!powerupjs.Keyboard.keys[code].down)
            powerupjs.Keyboard.keys[code].pressed = true;
        powerupjs.Keyboard.keys[code].down = true;
    }

    function handleKeyUp(evt) {
        var code = evt.keyCode;
        if (code < 0 || code > 255)
            return;
        powerupjs.Keyboard.keys[code].down = false;
    }

    function Keyboard_Singleton() {
        this.keys = [];
        for (var i = 0; i < 256; ++i)
            this.keys.push(new powerupjs.ButtonState());
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    }

    Keyboard_Singleton.prototype.reset = function () {
        for (var i = 0; i < 256; ++i)
            this.keys[i].pressed = false;
    };

    Keyboard_Singleton.prototype.pressed = function (key) {
        return this.keys[key].pressed;
    };

    Keyboard_Singleton.prototype.down = function (key) {
        return this.keys[key].down;
    };

    powerupjs.Keyboard = new Keyboard_Singleton();
    return powerupjs;

})(powerupjs || {});
