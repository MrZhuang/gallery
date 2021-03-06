define("gallery/formatter/0.0.8/formatter-debug", [], function(require, exports, module) {
    /*!
 * v0.0.8
 * Copyright (c) 2013 First Opinion
 * formatter.js is open sourced under the MIT license.
 *
 * thanks to digitalBush/jquery.maskedinput for some of the trickier
 * keycode handling
 */
    !function(a, b, c) {
        "undefined" != typeof module && module.exports ? module.exports = c() : "function" == typeof define && define.amd ? define(c) : b[a] = c();
    }("Formatter", this, function() {
        function a(a, c) {
            var e = this;
            if (e.el = a, !e.el) throw new TypeError("Must provide an existing element");
            if (e.opts = i.extend({}, b, c), "undefined" == typeof e.opts.pattern) throw new TypeError("Must provide a pattern");
            var f = d.parse(e.opts.pattern);
            e.mLength = f.mLength, e.chars = f.chars, e.inpts = f.inpts, e.hldrs = {}, e.focus = 0, 
            i.addListener(e.el, "keydown", function(a) {
                e._keyDown(a);
            }), i.addListener(e.el, "keypress", function(a) {
                e._keyPress(a);
            }), i.addListener(e.el, "paste", function(a) {
                e._paste(a);
            }), e.opts.persistent && (e._processKey("", !1), e.el.blur(), i.addListener(e.el, "focus", function(a) {
                e._focus(a);
            }), i.addListener(e.el, "click", function(a) {
                e._focus(a);
            }), i.addListener(e.el, "touchstart", function(a) {
                e._focus(a);
            }));
        }
        var b = {
            persistent: !1,
            repeat: !1,
            placeholder: " "
        }, c = {
            9: /[0-9]/,
            a: /[A-Za-z]/,
            "*": /[A-Za-z0-9]/
        };
        a.prototype.resetPattern = function(a) {
            this.sel = h.get(this.el), this.val = this.el.value, this.delta = 0, this._removeChars();
            var b = d.parse(a);
            this.mLength = b.mLength, this.chars = b.chars, this.inpts = b.inpts, this._processKey("", !1);
        }, a.prototype._keyDown = function(a) {
            var b = a.which || a.keyCode;
            return b && i.isDelKey(b) ? (this._processKey(null, b), i.preventDefault(a)) : void 0;
        }, a.prototype._keyPress = function(a) {
            var b, c;
            return a.which ? b = a.which : (b = a.keyCode, c = i.isSpecialKey(b)), i.isDelKey(b) || c || i.isModifier(a) ? void 0 : (this._processKey(String.fromCharCode(b), !1), 
            i.preventDefault(a));
        }, a.prototype._paste = function(a) {
            return this._processKey(i.getClip(a), !1), i.preventDefault(a);
        }, a.prototype._focus = function() {
            var a = this;
            setTimeout(function() {
                var b = h.get(a.el), c = b.end > a.focus;
                isFirstChar = 0 === b.end, (c || isFirstChar) && h.set(a.el, a.focus);
            }, 0);
        }, a.prototype._processKey = function(a, b) {
            if (this.sel = h.get(this.el), this.val = this.el.value, this.delta = 0, this.sel.begin !== this.sel.end) this.delta = -1 * Math.abs(this.sel.begin - this.sel.end), 
            this.val = i.removeChars(this.val, this.sel.begin, this.sel.end); else if (b && 46 == b) this._delete(); else if (b && this.sel.begin - 1 >= 0) this.val = i.removeChars(this.val, this.sel.end - 1, this.sel.end), 
            this.delta = -1; else if (b) return !0;
            b || (this.val = i.addChars(this.val, a, this.sel.begin), this.delta += a.length), 
            this._formatValue();
        }, a.prototype._delete = function() {
            for (;this.chars[this.sel.begin]; ) this._nextPos();
            this.sel.begin < this.val.length && (this._nextPos(), this.val = i.removeChars(this.val, this.sel.end - 1, this.sel.end), 
            this.delta = -1);
        }, a.prototype._nextPos = function() {
            this.sel.end++, this.sel.begin++;
        }, a.prototype._formatValue = function() {
            this.newPos = this.sel.end + this.delta, this._removeChars(), this._validateInpts(), 
            this._addChars(), this.el.value = this.val.substr(0, this.mLength), h.set(this.el, this.newPos);
        }, a.prototype._removeChars = function() {
            this.sel.end > this.focus && (this.delta += this.sel.end - this.focus);
            for (var a = 0, b = 0; b <= this.mLength; b++) {
                var c, d = this.chars[b], e = this.hldrs[b], f = b + a;
                f = b >= this.sel.begin ? f + this.delta : f, c = this.val.charAt(f), (d && d == c || e && e == c) && (this.val = i.removeChars(this.val, f, f + 1), 
                a--);
            }
            this.hldrs = {}, this.focus = this.val.length;
        }, a.prototype._validateInpts = function() {
            for (var a = 0; a < this.val.length; a++) {
                var b = this.inpts[a], d = !c[b], e = !c[b].test(this.val.charAt(a)), f = this.inpts[a];
                (d || e) && f && (this.val = i.removeChars(this.val, a, a + 1), this.focusStart--, 
                this.newPos--, this.delta--, a--);
            }
        }, a.prototype._addChars = function() {
            if (this.opts.persistent) {
                for (var a = 0; a <= this.mLength; a++) this.val.charAt(a) || (this.val = i.addChars(this.val, this.opts.placeholder, a), 
                this.hldrs[a] = this.opts.placeholder), this._addChar(a);
                for (;this.chars[this.focus]; ) this.focus++;
            } else for (var b = 0; b <= this.val.length; b++) {
                if (this.delta <= 0 && b == this.focus) return !0;
                this._addChar(b);
            }
        }, a.prototype._addChar = function(a) {
            var b = this.chars[a];
            return b ? (i.isBetween(a, [ this.sel.begin - 1, this.newPos + 1 ]) && (this.newPos++, 
            this.delta++), a <= this.focus && this.focus++, this.hldrs[a] && (delete this.hldrs[a], 
            this.hldrs[a + 1] = this.opts.placeholder), this.val = i.addChars(this.val, b, a), 
            void 0) : !0;
        };
        var d = {}, e = 4, f = new RegExp("{{([^}]+)}}", "g"), g = function(a) {
            for (var b, c = []; b = f.exec(a); ) c.push(b);
            return c;
        };
        d.parse = function(a) {
            var b = {
                inpts: {},
                chars: {}
            }, c = g(a), d = a.length, f = 0, h = 0, i = 0, j = function(a) {
                for (var c = a.length, d = 0; c > d; d++) b.inpts[h] = a.charAt(d), h++;
                f++, i += a.length + e - 1;
            };
            for (i; d > i; i++) i == c[f].index ? j(c[f][1]) : b.chars[i - f * e] = a.charAt(i);
            return b.mLength = i - f * e, b;
        };
        var h = {};
        h.get = function(a) {
            if ("number" == typeof a.selectionStart) return {
                begin: a.selectionStart,
                end: a.selectionEnd
            };
            var b = document.selection.createRange();
            if (b && b.parentElement() == a) {
                var c = a.createTextRange(), d = a.createTextRange(), e = a.value.length;
                return c.moveToBookmark(b.getBookmark()), d.collapse(!1), c.compareEndPoints("StartToEnd", d) > -1 ? {
                    begin: e,
                    end: e
                } : {
                    begin: -c.moveStart("character", -e),
                    end: -c.moveEnd("character", -e)
                };
            }
            return {
                begin: 0,
                end: 0
            };
        }, h.set = function(a, b) {
            if (a.setSelectionRange) a.focus(), a.setSelectionRange(b, b); else if (a.createTextRange) {
                var c = a.createTextRange();
                c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", b), c.select();
            }
        };
        var i = {}, j = "undefined" != typeof navigator ? navigator.userAgent : null, k = /iphone/i.test(j);
        return i.extend = function(a) {
            for (var b = 1; b < arguments.length; b++) for (var c in arguments[b]) a[c] = arguments[b][c];
            return a;
        }, i.addChars = function(a, b, c) {
            return a.substr(0, c) + b + a.substr(c, a.length);
        }, i.removeChars = function(a, b, c) {
            return a.substr(0, b) + a.substr(c, a.length);
        }, i.isBetween = function(a, b) {
            return b.sort(function(a, b) {
                return a - b;
            }), a > b[0] && a < b[1];
        }, i.addListener = function(a, b, c) {
            return "undefined" != typeof a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c);
        }, i.preventDefault = function(a) {
            return a.preventDefault ? a.preventDefault() : a.returnValue = !1;
        }, i.getClip = function(a) {
            return a.clipboardData ? a.clipboardData.getData("Text") : window.clipboardData ? window.clipboardData.getData("Text") : void 0;
        }, i.isDelKey = function(a) {
            return 8 === a || 46 === a || k && 127 === a;
        }, i.isSpecialKey = function(a) {
            var b = {
                35: "end",
                36: "home",
                37: "leftarrow",
                38: "uparrow",
                39: "rightarrow",
                40: "downarrow"
            };
            return b[a];
        }, i.isModifier = function(a) {
            return a.ctrlKey || a.altKey || a.metaKey;
        }, a;
    });
});
