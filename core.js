function json2xml(t, e) {
    var i = function(t, e, n) {
            var r = "";
            if (t instanceof Array)
                for (var o = 0, s = t.length; s > o; o++) r += n + i(t[o], e, n + " ") + "\n";
            else if ("object" == typeof t) {
                var a = !1;
                r += n + "<" + e;
                for (var l in t) "@" == l.charAt(0) ? r += " " + l.substr(1) + '="' + ("" + t[l]) + '"' : a = !0;
                if (r += a ? ">" : "/>", a) {
                    for (var l in t) "#text" == l ? r += t[l] : "#cdata" == l ? r += "<![CDATA[" + t[l] + "]]>" : "@" != l.charAt(0) && (r += i(t[l], l, n + "  "));
                    r += ("\n" == r.charAt(r.length - 1) ? n : "") + "</" + e + ">"
                }
            } else r += n + "<" + e + ">" + ("" + t) + "</" + e + ">";
            return r
        },
        n = "";
    for (var r in t) n += i(t[r], r, "");
    return e ? n.replace(/\t/g, e) : n.replace(/\t|\n/g, "")
}

function xml2json(t, e) {
    var i = {
        toObj: function(t) {
            var e = {};
            if (1 == t.nodeType) {
                if (t.attributes.length)
                    for (var n = 0; t.attributes.length > n; n++) e["@" + t.attributes[n].nodeName] = "" + (t.attributes[n].nodeValue || "");
                if (t.firstChild) {
                    for (var r = 0, o = 0, s = !1, a = t.firstChild; a; a = a.nextSibling) 1 == a.nodeType ? s = !0 : 3 == a.nodeType && a.nodeValue.match(/[^ \f\n\r\t\v]/) ? r++ : 4 == a.nodeType && o++;
                    if (s)
                        if (2 > r && 2 > o) {
                            i.removeWhite(t);
                            for (var a = t.firstChild; a; a = a.nextSibling) 3 == a.nodeType ? e["#text"] = i.escape(a.nodeValue) : 4 == a.nodeType ? e["#cdata"] = i.escape(a.nodeValue) : e[a.nodeName] ? e[a.nodeName] instanceof Array ? e[a.nodeName][e[a.nodeName].length] = i.toObj(a) : e[a.nodeName] = [e[a.nodeName], i.toObj(a)] : e[a.nodeName] = i.toObj(a)
                        } else t.attributes.length ? e["#text"] = i.escape(i.innerXml(t)) : e = i.escape(i.innerXml(t));
                    else if (r) t.attributes.length ? e["#text"] = i.escape(i.innerXml(t)) : e = i.escape(i.innerXml(t));
                    else if (o)
                        if (o > 1) e = i.escape(i.innerXml(t));
                        else
                            for (var a = t.firstChild; a; a = a.nextSibling) e["#cdata"] = i.escape(a.nodeValue)
                }
                t.attributes.length || t.firstChild || (e = null)
            } else 9 == t.nodeType ? e = i.toObj(t.documentElement) : alert("unhandled node type: " + t.nodeType);
            return e
        },
        toJson: function(t, e, n) {
            var r = e ? '"' + e + '"' : "";
            if (t instanceof Array) {
                for (var o = 0, s = t.length; s > o; o++) t[o] = i.toJson(t[o], "", n + " ");
                r += (e ? ":[" : "[") + (t.length > 1 ? "\n" + n + "  " + t.join(",\n" + n + "  ") + "\n" + n : t.join("")) + "]"
            } else if (null == t) r += (e && ":") + "null";
            else if ("object" == typeof t) {
                var a = [];
                for (var l in t) a[a.length] = i.toJson(t[l], l, n + "  ");
                r += (e ? ":{" : "{") + (a.length > 1 ? "\n" + n + "  " + a.join(",\n" + n + "  ") + "\n" + n : a.join("")) + "}"
            } else r += "string" == typeof t ? (e && ":") + '"' + ("" + t) + '"' : (e && ":") + ("" + t);
            return r
        },
        innerXml: function(t) {
            var e = "";
            if ("innerHTML" in t) e = t.innerHTML;
            else
                for (var i = function(t) {
                    var e = "";
                    if (1 == t.nodeType) {
                        e += "<" + t.nodeName;
                        for (var n = 0; t.attributes.length > n; n++) e += " " + t.attributes[n].nodeName + '="' + ("" + (t.attributes[n].nodeValue || "")) + '"';
                        if (t.firstChild) {
                            e += ">";
                            for (var r = t.firstChild; r; r = r.nextSibling) e += i(r);
                            e += "</" + t.nodeName + ">"
                        } else e += "/>"
                    } else 3 == t.nodeType ? e += t.nodeValue : 4 == t.nodeType && (e += "<![CDATA[" + t.nodeValue + "]]>");
                    return e
                }, n = t.firstChild; n; n = n.nextSibling) e += i(n);
            return e
        },
        escape: function(t) {
            return t.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
        },
        removeWhite: function(t) {
            t.normalize();
            for (var e = t.firstChild; e;)
                if (3 == e.nodeType)
                    if (e.nodeValue.match(/[^ \f\n\r\t\v]/)) e = e.nextSibling;
                    else {
                        var n = e.nextSibling;
                        t.removeChild(e), e = n
                    } else 1 == e.nodeType ? (i.removeWhite(e), e = e.nextSibling) : e = e.nextSibling;
            return t
        }
    };
    9 == t.nodeType && (t = t.documentElement);
    var n = i.toJson(i.toObj(i.removeWhite(t)), t.nodeName, " ");
    return "{\n" + e + (e ? n.replace(/\t/g, e) : n.replace(/\t|\n/g, "")) + "\n}"
}
with(define("app/data/data.js", [], function(t) {
    "use strict";
    return {
        local: t("./local"),
        remote: t("./remote")
    }
}), define("app/module/base/app.js", [], function(t) {
    "use strict";
    t("common/statistic/statistic"), window.console && "product" != seajs.config.data.debug || (window.console = {
        log: function() {
            return !1
        }
    });
    var e = t("../../patched/shop"),
        i = t("../../reader/reader"),
        n = t("../../view/view"),
        r = t("../../action/action"),
        o = t("util"),
        s = {
            maxPages: 7,
            traitDouble: !1,
            traits: null
        };
    return function(a, l) {
        var c = o.parseUrl(location.href),
            u = {
                global: s,
                uuid: c.query.id,
                revision: c.query.v,
                ready: function() {
                    var t = new n({
                        reader: h
                    });
                    new r({
                        view: t,
                        reader: h
                    }), l && l()
                }
            };
        _.extend(u.global, a);
        var h = new i(u);
        e(), window.reader = h, window.db = t("widget/viperdb/viperdb")
    }
}), define("app/view/view.js", [], function(t) {
    "use strict";

    function e(t, e) {
        return _.isFunction(t) ? t : (e = e || o, e.create(t))
    }
    var i = t("widget/mask/mask"),
        n = t("event"),
        r = t("tpl"),
        o = t("./base"),
        s = n.create(),
        a = s.prototype;
    return a.VIEWS = [], a.init = function(t) {
        this.supInit.apply(this, arguments), r.parse("#template-box"), this.__reader = t.reader, this.__injectPro(), this.modules = {}, this.VIEWS.forEach(function(t) {
            var e = t[2] || {};
            e.delay || this.instance(t[0])
        }.bind(this)), $(".j-page-wrapper").css("visibility", ""), !!this.__reader.getBook().typo.trial_mode && $(".j-buybook").show(), this.listenTo(this.__reader, "all", this.__onEvent.bind(this))
    }, a.__onEvent = function(t) {
        var e = _.rest(arguments);
        _.each(this.modules, function(i) {
            var n = i["_" + t];
            n && n.apply(i, e)
        }, this)
    }, a.__injectPro = function() {
        var t = i.prototype;
        t.show = t.show.aop(function() {
            this.__reader.block(1)
        }.bind(this)), t.hide = t.hide.aop(function() {
            this.__reader.block(0)
        }.bind(this))
    }, a.instance = function(t) {
        var e = _.find(this.VIEWS, function(e) {
            return t == e[0]
        });
        if (e) {
            var i = e[1],
                n = e[2] || {},
                r = n.selector || ".j-md-" + t;
            this.modules[t] = new i({
                el: r,
                reader: this.__reader
            })
        }
    }, s.mixTo = function(t) {
        _.each(t, function(t) {
            var i = _.find(a.VIEWS, function(e) {
                return e[0] == t[0]
            });
            if (i) {
                var n = _.indexOf(a.VIEWS, i);
                a.VIEWS[n][1] = e(t[1], a.VIEWS[n][1]), a.VIEWS[n][2] = _.extend(a.VIEWS[n][2] || {}, t[2])
            } else a.VIEWS.push([t[0], e(t[1]), t[2]])
        }, this)
    }, s
}), define("viperjs/widget/mask/mask.js", [], function(t, e, i) {
    var n = t("core"),
        r = t("util"),
        o = t("base"),
        s = t("el"),
        a = t("config"),
        l = s.pushCSS(".#<uispace>{position:fixed;_position:absolute;z-index:2000;top:0;bottom:0;left:0;right:0;width:100%;height:100%;opacity:.4;background:#000;filter: alpha(opacity=40);}"),
        c = n.create(),
        u = c.extend(o);
    u.init = function(t) {
        t = t || {}, t.parent = t.parent || document.body, this.supInit(t)
    }, u.__initXGui = function() {
        this.className = this.options.className || l
    }, u.show = function() {
        return this.__fullScreen(this.el), this.options.stc && $(document.body).css("overflow", "hidden"), c._$supro.show.apply(this, arguments)
    }, u.hide = function() {
        return this.options.stc && $(document.body).css("overflow", ""), c._$supro.hide.apply(this, arguments)
    }, u.__fullScreen = function() {}, a.browser.trident0 || (u.__fullScreen = u.__fullScreen.aop(function(t) {
        var e = t.args[0],
            i = e.style,
            n = r.getPageBox();
        i.width = n.scrollWidth + "px", i.height = n.scrollHeight + "px"
    })), i.exports = c
}), define("viperjs/base/event.js", [], function(t) {
    var e = t("core"),
        i = /\s+/,
        n = function(t, e, n, r) {
            if (!n) return !0;
            if ("object" == typeof n)
                for (var o in n) t[e].apply(t, [o, n[o]].concat(r));
            else {
                if (!i.test(n)) return !0;
                for (var s = n.split(i), a = 0, l = s.length; l > a; a++) t[e].apply(t, [s[a]].concat(r))
            }
        },
        r = function(t, e) {
            var i, n = -1,
                r = t.length;
            switch (e.length) {
                case 0:
                    for (; r > ++n;)(i = t[n]).callback.call(i.ctx);
                    return;
                case 1:
                    for (; r > ++n;)(i = t[n]).callback.call(i.ctx, e[0]);
                    return;
                case 2:
                    for (; r > ++n;)(i = t[n]).callback.call(i.ctx, e[0], e[1]);
                    return;
                case 3:
                    for (; r > ++n;)(i = t[n]).callback.call(i.ctx, e[0], e[1], e[2]);
                    return;
                default:
                    for (; r > ++n;)(i = t[n]).callback.apply(i.ctx, e)
            }
        },
        o = {
            on: function(t, e, i) {
                if (!n(this, "on", t, [e, i]) || !e) return this;
                this._events || (this._events = {});
                var r = this._events[t] || (this._events[t] = []);
                return r.push({
                    callback: e,
                    context: i,
                    ctx: i || this
                }), this
            },
            once: function(t, e, i) {
                if (!n(this, "once", t, [e, i]) || !e) return this;
                var r = this,
                    o = _.once(function() {
                        r.off(t, o), e.apply(this, arguments)
                    });
                return o._callback = e, this.on(t, o, i), this
            },
            off: function(t, e, i) {
                var r, o, s, a, l, c, u, h;
                if (!this._events || !n(this, "off", t, [e, i])) return this;
                if (!t && !e && !i) return this._events = {}, this;
                for (a = t ? [t] : _.keys(this._events), l = 0, c = a.length; c > l; l++)
                    if (t = a[l], r = this._events[t]) {
                        if (s = [], e || i)
                            for (u = 0, h = r.length; h > u; u++) o = r[u], (e && e !== o.callback && e !== o.callback._callback || i && i !== o.context) && s.push(o);
                        this._events[t] = s
                    }
                return this
            },
            trigger: function(t) {
                if (!this._events) return this;
                var e = Array.prototype.slice.call(arguments, 1);
                if (!n(this, "trigger", t, e)) return this;
                var i = this._events[t],
                    o = this._events.all;
                return i && r(i, e), o && r(o, arguments), this
            },
            listenTo: function(t, e, i) {
                var n = this._listeners || (this._listeners = {}),
                    r = t._listenerId || (t._listenerId = _.uniqueId("l"));
                return n[r] = t, t.on(e, "object" == typeof e ? this : i, this), this
            },
            stopListening: function(t, e, i) {
                var n = this._listeners;
                if (n) {
                    if (t) t.off(e, "object" == typeof e ? this : i, this), e || i || delete n[t._listenerId];
                    else {
                        "object" == typeof e && (i = this);
                        for (var r in n) n[r].off(e, i, this);
                        this._listeners = {}
                    }
                    return this
                }
            }
        },
        s = e.create(),
        a = _.extend(s.prototype, o);
    return a.init = function(t) {
        t = t || {}, _.each(_.functions(t), function(e) {
            this.on(e, t[e], this)
        }, this), this.__events_dom = {}
    }, a.recycle = function() {
        this.constructor.recycle(this)
    }, s.recycle = function() {
        var t = function(t, e, i) {
            this.recycle(t), i.splice(e, 1)
        };
        return function(e) {
            if (!e) return null;
            if (!_.isArray(e)) {
                if (!(e instanceof this)) {
                    var i = e.constructor;
                    return i.recycle && i.recycle(e), null
                }
                return e == this.__instance && delete this.__instance, e == this.__inctanse && delete this.__inctanse, e.__destroy(), null
            }
            _.each(e, t, this)
        }
    }(), a.__destroy = function() {
        this.off(), this.stopListening(), this.__doClearDomEvent()
    }, a.__doInitDomEvent = function() {
        var t = +new Date,
            e = function(e) {
                if (e && !(3 > e.length)) {
                    this.__events_dom["de-" + t++] = e;
                    var i = $(e[0]);
                    $(i).on.apply(i, e.slice(1))
                }
            };
        return function(t) {
            _.each(t, e, this)
        }
    }(), a.__doClearDomEvent = function() {
        var t = function(t, e, i) {
            delete i[e];
            var n = $(t[0]);
            $(n).off.apply(n, t.slice(1))
        };
        return function() {
            _.each(this.__events_dom, t)
        }
    }(), a.addEvent = a.setEvent = a.on, a.fireEvent = a.trigger, a.removeEvent = a.off, s.Events = o, s.extend = function(t) {
        return _.extend(t, o), t
    }, s
}), define("viperjs/widget/template/tpl.js", [], function(t, e, i) {
    var n = {},
        r = t("./jst"),
        o = t("el"),
        s = t("widget/ajax/loader.js"),
        a = t("widget/template/template_item"),
        l = i.exports,
        c = t("util"),
        u = +new Date + "-";
    return l.parse = function() {
        var t = 0,
            e = function() {
                t > 0 || (t = 0, $(document).trigger("templateready"))
            },
            i = function(t) {
                var e = $(t).data("src");
                if (e) {
                    var i = t.ownerDocument.location.href;
                    return e = e.split(","), _.each(e, function(t, e, n) {
                        n[e] = c.absolute(t, i)
                    }), e
                }
            },
            n = function(t) {
                if (t) {
                    var e = i(t);
                    e && s.queueStyle(e, {
                        version: $(t).data("version")
                    }), o.addStyle(t.value)
                }
            },
            r = function(i) {
                t--, o.addScript(i), e()
            },
            a = function(e) {
                if (e) {
                    var n = i(e),
                        a = e.value;
                    if (n) {
                        t++;
                        var l = {
                            version: $(e).data("version"),
                            onloaded: r.bind(null, a)
                        };
                        return window.setTimeout(s.queueScript.bind(null, n, l), 0), void 0
                    }
                    o.addScript(a)
                }
            },
            u = function(i) {
                t--, l.parse(i), e()
            },
            h = function(e) {
                if (e) {
                    var n = i(e)[0];
                    if (n) {
                        t++;
                        var r = {
                            version: $(e).data("version"),
                            onloaded: u
                        };
                        window.setTimeout(s.loadHtml.bind(null, n, r), 0)
                    }
                }
            },
            d = function(i, n) {
                t--, l.addText(i, n || ""), e()
            },
            f = function(e) {
                if (e && e.id) {
                    var n = e.id,
                        r = i(e)[0];
                    if (r) {
                        t++;
                        var o = r + (0 > r.indexOf("?") ? "?" : "&") + ($(e).data("version") || ""),
                            s = {
                                method: "GET",
                                success: d.bind(null, n)
                            };
                        window.setTimeout($.ajax.bind($, o, s), 0)
                    }
                }
            },
            p = function(t) {
                var e = t.name.toLowerCase();
                switch (e) {
                    case "jst":
                        return l.addJst(t, !0), void 0;
                    case "txt":
                        return l.addText(t.id, t.value || ""), void 0;
                    case "json":
                        return l.addJson(t.id, t.value || ""), void 0;
                    case "ntp":
                        return l.addNode(t.value || "", t.id), void 0;
                    case "js":
                        return a(t), void 0;
                    case "css":
                        return n(t), void 0;
                    case "html":
                        return h(t), void 0;
                    case "res":
                        return f(t), void 0
                }
            };
        return function(t, i) {
            if (t = $(t).get(0), i && $(document).one("templateready", i), t) {
                var n = "TEXTAREA" == t.tagName ? [t] : t.getElementsByTagName("textarea");
                _.each(n, p), $(t).detach()
            }
            return e(), this
        }
    }(), l.addText = function(t, e) {
        return n[t] = e || "", this
    }, l.getText = function(t) {
        return n[t] || ""
    }, l.addJson = function() {
        return function(t, e) {
            return n[t] = e || "", this
        }
    }(), l.getJson = function(t) {
        return o.text2json(n[t] || "")
    }, l.addNode = function(t, e) {
        return e = e || "node-" + +new Date, t = $(t).get(0) || t, l.addText(u + e, t), $(t).detach(), e
    }, l.getNode = function(t) {
        if (!t) return null;
        t = u + t;
        var e = l.getText(t);
        return e ? (_.isString(e) && (e = o.html2node(e), l.addText(t, e)), $(e).clone().get(0)) : null
    }, l.setJst = r.setDefault, l.addJst = r.add, l.getJst = r.get, l.renderJst = r.render, l.addCss = function(t, e) {
        return l.addText(t, e), t
    }, l.getCss = function(t) {
        var e = l.getText(t);
        o.addStyle(e)
    }, l.renderItems = a, l
}), define("app/view/base.js", [], function(t) {
    "use strict";
    var e = t("base"),
        i = e.create(),
        n = i.prototype;
    return n.init = function(t) {
        this.__reader = t.reader, this.supInit.apply(this, arguments), this.setup && this.setup()
    }, i
}), define("viperjs/base/core.js", [], function(t) {
    "use strict";
    var e = t("underscore"),
        i = t("jquery");
    return window.vp = window.vp || {}, vp.o = {}, vp.r = [], vp._ = e, vp.$ = i, vp.f = function() {
        return !1
    }, vp.p = function(t) {
        if (!t || !t.length) return null;
        for (var e = window, i = t.split("."), n = i.length, r = "window" == i[0] ? 1 : 0; n > r; e = e[i[r]] = e[i[r]] || {}, r++);
        return e
    }, vp.q = function(t, e) {
        t = t || vp.O;
        for (var i = e.split("."), n = 0, r = i.length; r > n && (t = t[i[n]], t); n++);
        return t
    }, vp.create = function() {
        var t = function() {
            return this.init.apply(this, arguments)
        };
        return t.extend = function(t, i) {
            i || e.extend(this, e.pick(t, e.functions(t))), this._$super = t, this._$supro = t.prototype;
            var n = function() {};
            n.prototype = t.prototype, this.prototype = new n;
            var r = this.prototype;
            r.constructor = this;
            var o, s = {
                init: "supInit",
                __init: "__supInit",
                __destroy: "__supDestroy",
                initialize: "supInitialize",
                __initNode: "__supInitNode",
                __doBuild: "__supDoBuild",
                __onShow: "__supOnShow",
                __onHide: "__supOnHide",
                __onRefresh: "__supOnRefresh"
            };
            for (var a in s) o = s[a], r[a] = function(t) {
                return function() {
                    this[t].apply(this, arguments)
                }
            }(o);
            var l = {
                    supInit: "init",
                    __supInit: "__init",
                    __supDestroy: "__destroy",
                    supInitialize: "initialize",
                    __supInitNode: "__initNode",
                    __supDoBuild: "__doBuild",
                    __supOnShow: "__onShow",
                    __supOnHide: "__onHide",
                    __supOnRefresh: "__onRefresh"
                },
                c = t;
            for (var a in l) o = l[a], r[a] = function(e) {
                return function() {
                    var i = c.prototype[e];
                    c = c._$super || t, i && i.apply(this, arguments), c = t
                }
            }(o);
            return r
        }, t.create = function(t) {
            var i = vp.create(),
                n = i.extend(this);
            return e.extend(n, t), i
        }, t.getInstance = function(t) {
            return t = t || {}, this.__instance || (this.__instance = new this(t)), this.__instance
        }, t
    }, Function.prototype.aop = function(t, e) {
        var i = function() {
                return !1
            },
            e = e || i,
            t = t || i,
            n = this;
        return function() {
            var i = {
                args: Array.prototype.slice.call(arguments, 0)
            };
            return t.call(this, i), i.stopped || (i.value = n.apply(this, i.args), e.call(this, i)), i.value
        }
    }, vp.pushCSSText = function(t) {
        var e = i("<style>" + t + "</style>");
        return i("head").append(e), e
    }, window._ = vp._, window.$ = vp.$, window._o = vp.o, window._f = vp.f, window._r = vp.r, e.ex = function(t, e) {
        if (!t || !e) return t;
        for (var i in t) t.hasOwnProperty(i) && null != e[i] && (t[i] = e[i]);
        return t
    }, window.console || (vp.p("console").log = vp.f, vp.p("console").error = vp.f), window.vp
}), define("viperjs/base/util.js", [], function(t, e) {
    var i = e;
    i.object2string = function(t, e, i) {
        if (!t) return "";
        var n = [];
        for (var r in t) _.isArray(t[r]) || (t[r] = [t[r]]), _.each(t[r], function(t) {
            n.push(encodeURIComponent(r) + "=" + (i ? encodeURIComponent(t) : t))
        });
        return n.join(e || ",")
    }, i.object2query = function(t) {
        return i.object2string(t, "&", !0)
    }, i.string2object = function(t, e) {
        var i = {};
        return (t || "").split(e).forEach(function(t) {
            var e = t.split("=");
            if (e && e.length) {
                var n = e.shift();
                n && (i[decodeURIComponent(n)] = decodeURIComponent(e.join("=")))
            }
        }), i
    }, i.query2object = function(t) {
        return i.string2object(t, "&", !0)
    }, i.parseUrl = function() {
        var t = /^https?:\/\/.*?\//i,
            e = /[?#]/;
        return function(n) {
            var r = {
                href: n
            };
            n = (n || "").replace(t, "/").split(e);
            var o = 1;
            return "/" == n[0] && 0 == (n[1] || "").indexOf("/") && (o = 2), r.path = n.splice(0, o).join("?"), r.query = i.query2object(n.join("&")), r
        }
    }(), i.getPageBox = function() {
        var t = document.body,
            e = document.documentElement,
            i = {
                scrollTop: Math.max(t.scrollTop, e.scrollTop),
                scrollLeft: Math.max(t.scrollLeft, e.scrollLeft),
                clientWidth: Math.max(t.clientWidth, t.offsetWidth, e.clientWidth, e.offsetWidth),
                clientHeight: Math.max(t.clientHeight, t.offsetHeight, e.clientHeight, e.offsetHeight)
            };
        return i.scrollWidth = Math.max(i.clientWidth, t.scrollWidth, e.scrollWidth), i.scrollHeight = Math.max(i.clientHeight, t.scrollHeight, e.scrollHeight), i
    }, i.getArea = function() {
        var t = function(t) {
            return +t.substr(t, t.length - 2) || 0
        };
        return function(e) {
            var i = $(e);
            return {
                width: t(i.css("margin-left")) + i.outerWidth() + t(i.css("margin-right")),
                height: t(i.css("margin-top")) + i.outerHeight() + t(i.css("margin-bottom"))
            }
        }
    }(), i.length = function() {
        var t = /[^\x00-\xfff]/g;
        return function(e) {
            return ("" + (e || "")).replace(t, "**").length
        }
    }(), i.id = function(t) {
        var e = $(t),
            i = e.attr("id");
        return i || (i = _.uniqueId("auto-id-"), e.attr("id", i)), i
    }, i.focus = function(t, e) {
        var i = $(t);
        if (i.length) {
            var n = 0,
                r = "js-focus";
            _.isNumber(e) ? n = e : _.isString(e) ? r = e : _.isObject(e) && (n = e.mode || n, r = e.clazz || r);
            var o = parseInt(i.data("mode"));
            return isNaN(o) || (n = o), o = i.data("focus"), o && (r = o), i.blur(function() {
                $(this).val() && 0 !== n || $(this).removeClass(r)
            }), i.focus(function() {
                $(this).addClass(r)
            }), this
        }
    }, i.getArgsByReg = function(t) {
        var e = window.location.href.replace(/https?\:\/\//, ""),
            i = e.match(t);
        return i.forEach(function(t, e) {
            i[e] = decodeURI(i[e])
        }), i.shift(), i
    }, i.format = function() {
        var t = {
                i: !0,
                r: /\byyyy|yy|MM|M|dd|d|HH|H|mm|ms|ss|m|s\b/g
            },
            e = function(t) {
                return t = parseInt(t) || 0, (10 > t ? "0" : "") + t
            };
        return function(n, r) {
            return n && r ? (n = i.var2date(n), t.yyyy = n.getFullYear(), t.yy = ("" + t.yyyy).substr(2), t.M = n.getMonth() + 1, t.MM = e(t.M), t.d = n.getDate(), t.dd = e(t.d), t.H = n.getHours(), t.HH = e(t.H), t.m = n.getMinutes(), t.mm = e(t.m), t.s = n.getSeconds(), t.ss = e(t.s), t.ms = n.getMilliseconds(), i.encode(t, r)) : ""
        }
    }(), i.encode = function(t, e) {
        return t && e && e.replace ? e.replace(t.r, function(e) {
            var i = t[t.i ? e : e.toLowerCase()];
            return null != i ? i : e
        }) : e || ""
    }, i.var2date = function(t) {
        var e = t;
        return _.isString(t) && (e = new Date(Date.parse(t))), _.isDate(t) || (e = new Date(t)), e
    }, i.getScrollViewPort = function(t) {
        if (t = $(t).get(0)) {
            for (t = t.parentNode; t && !(t.scrollHeight > t.clientHeight);) t = t.parentNode;
            if (t) return t
        }
        var e = document.body.scrollHeight,
            i = document.documentElement.scrollHeight;
        return i >= e ? document.documentElement : document.body
    }, i.scrollTo = function(t) {
        var e = $(t).eq(0).offset();
        return window.scrollTo(e.top, e.left), this
    }, i.absolute = function() {
        var t = /([^\/:])\/.*$/,
            e = /\/[^\/]+$/,
            i = /[#\?]/,
            n = location.href.split(/[?#]/)[0],
            r = document.createElement("a"),
            o = function(t) {
                return (t || "").indexOf("://") > 0
            },
            s = function(t) {
                return (t || "").split(i)[0].replace(e, "/")
            },
            a = function(e, i) {
                return 0 == e.indexOf("/") ? i.replace(t, "$1") + e : s(i) + e
            };
        return n = s(n),
            function(t, e) {
                return t = (t || "").trim(), o(e) || (e = n), t ? o(t) ? t : (t = a(t, e), r.href = t, t = r.href, o(t) ? t : r.getAttribute("href", 4)) : e
            }
    }(), i.parseLocation = function() {
        var t = /^https?:\/\/.*?\//i,
            e = /[?#]/;
        return function(n) {
            var r = {
                href: n
            };
            n = (n || "").replace(t, "/").split(e);
            var o = 1;
            return "/" == n[0] && 0 == (n[1] || "").indexOf("/") && (o = 2), r.path = n.splice(0, o).join("?"), r.query = i.query2object(n.join("&")), r
        }
    }(), i.safeDelete = function(t, e) {
        if (!_.isArray(e)) {
            try {
                delete t[e]
            } catch (n) {
                t[e] = void 0
            }
            return this
        }
        return _.each(e, i.safeDelete.bind(_u, t)), this
    }, i.url2origin = function() {
        var t = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(e) {
            return t.test(e || "") ? RegExp.$1.toLowerCase() : ""
        }
    }()
}), define("viperjs/base/base.js", [], function(t) {
    var e = t("core"),
        i = t("el"),
        n = t("event"),
        r = e.create(),
        o = r.extend(n),
        s = /^(\S+)\s*(.*)$/,
        a = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    return o.init = o.__init = function(t) {
        this.supInit.apply(this, arguments), t = t || {}, this.cid = _.uniqueId("view"), this.__configure(t), this.__initXGui(), this.__initNode(), this.initialize(t), this.delegateEvents(), i.dumpCSS(), !!t.parent && this.appendTo(t.parent)
    }, o.$ = function(t) {
        return this.$el.find(t)
    }, o.__configure = function(t) {
        this.options && (t = _.extend({}, _.result(this, "options"), t)), _.extend(this, _.pick(t, a)), this.options = t
    }, o.__initXGui = function() {
        this.__tpl = this.options.template
    }, o.__initNode = function() {
        var t;
        if (this.tagName = this.tagName || "div", this.el) this.setElement(this.el, !1);
        else {
            var e = _.extend({}, _.result(this, "attributes"));
            this.id && (e.id = _.result(this, "id")), this.className && (e["class"] = _.result(this, "className")), t = this.__tpl ? $(this.__tpl).attr(e) : $("<" + _.result(this, "tagName") + ">").attr(e), this.setElement(t, !1)
        }
    }, o.initialize = function() {
        return this
    }, o.appendTo = function(t) {
        this.__body && ($.isFunction(t) ? this.__parent = t(this.__body) : (this.__parent = $(t || "body").get(0), $(this.__body).appendTo($(this.__parent))))
    }, o.getBody = function() {
        return this.__body
    }, o.show = function() {
        return $(this.__body).show(), this
    }, o.hide = function() {
        return $(this.__body).hide(), this
    }, o.remove = function() {
        return this.$el.remove(), this.stopListening(), this
    }, o.render = function() {
        return this
    }, o.setElement = function(t, e) {
        return this.$el && this.undelegateEvents(), this.$el = t instanceof $ ? t : $(t), this.__body = this.el = this.$el[0], e !== !1 && this.delegateEvents(), this
    }, o.delegateEvents = function(t) {
        if (t || (t = _.result(this, "events"))) {
            this.undelegateEvents();
            for (var e in t) {
                var i = t[e];
                if (_.isFunction(i) || (i = this[t[e]]), !i) throw Error('Method "' + t[e] + '" does not exist');
                var n = e.match(s),
                    r = n[1],
                    o = n[2];
                i = _.bind(i, this), r += ".delegateEvents" + this.cid, "" === o ? this.$el.on(r, i) : this.$el.on(r, o, i)
            }
        }
    }, o.undelegateEvents = function() {
        this.$el.off(".delegateEvents" + this.cid)
    }, o.__destroy = function() {
        this.__supDestroy(), this.remove()
    }, r
}), define("viperjs/base/element.js", [], function(t, e, i) {
    t("core");
    var n, r = i.exports,
        o = {};
    r.create = function() {
        var t = {
            a: {
                href: "#",
                hideFocus: !0
            },
            style: {
                type: "text/css"
            },
            link: {
                type: "text/css",
                rel: "stylesheet"
            },
            iframe: {
                frameBorder: 0
            },
            script: {
                defer: !0,
                type: "text/javascript"
            }
        };
        return function(e, i, n) {
            var r = document.createElement(e);
            return _.extend(r, t[e.toLowerCase()]), i && (r.className = i), n = $(n).get(0), n && n.appendChild(r), r
        }
    }(), r.addScript = function(t) {
        try {
            if (t = t.trim()) return Function(t)()
        } catch (e) {
            console.error(e.message), console.error(e.stack)
        }
    }, r.addStyle = function() {
        var t = /[\s\r\n]+/gi;
        return function(e) {
            if (e = (e || "").trim().replace(t, " ")) {
                var i = $("<style>" + e + "</style>");
                return $("head").append(i), i.get(0)
            }
        }
    }(), r.pushCSS = function() {
        var t = /#<.*?>/g,
            e = +new Date;
        return function(i) {
            n || (n = []);
            var r = "auto-" + e++;
            return n.push(i.replace(t, r)), r
        }
    }(), r.dumpCSS = function() {
        return n && (r.addStyle(n.join("")), n = null), this
    }, r.text2json = function(t) {
        var e = "return " + t;
        try {
            if (e = e.trim()) return Function(e)()
        } catch (i) {
            console.error(i.message), console.error(i.stack)
        }
    }, r.text2type = function(t, e) {
        switch (t = t || "", e) {
            case "xml":
                t = _e._$xml2dom(t);
                break;
            case "json":
                try {
                    t = JSON.parse(t)
                } catch (i) {
                    t = null
                }
        }
        return t
    }, r.html2node = function(t) {
        var e = document.createElement("div");
        e.innerHTML = t;
        var i = $(e).children().toArray();
        return i.length > 1 ? e : i[0]
    }, r.createXFrame = function() {
        var t = function() {
                return location.hostname == document.domain ? "about:blank" : 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})();'
            },
            e = function(t) {
                t = t.trim();
                var e = $("<iframe></iframe>");
                return t ? (e.attr("name", t), e) : e
            };
        return function(i) {
            i = i || _o;
            var n = e(i.name || "");
            i.visible || n.hide(), _.isFunction(i.onload) && n.on("load", function(t) {
                n.attr("src") && (n.unbind("load"), i.onload(t))
            });
            var r = i.parent;
            if (_.isFunction(r)) try {
                r(n)
            } catch (o) {} else $(r || document.body).append(n);
            var s = i.src || t();
            return window.setTimeout(function() {
                n.attr("src", s)
            }, 0), n
        }
    }(), r.id = function(t) {
        if (t = _e._$get(t)) {
            var e = t.id ? t.id : "auto-id-" + _u._$randString(16);
            return t.id = e, _e._$get(e) != t && (o[e] = t), e
        }
    }, r.get = function(t) {
        var e = o["" + t];
        return e ? e : _.isString(t) || _.isNumber(t) ? document.getElementById(t) : t
    }
}), define("viperjs/base/config.js", [], function(t, e) {
    var i = window.navigator.platform,
        n = window.navigator.userAgent,
        r = {
            mac: i,
            win: i,
            linux: i,
            ipad: n,
            ipod: n,
            iphone: i,
            android: n
        };
    for (var o in r) r[o] = RegExp(o, "i").test(r[o]);
    r.ios = r.ipad || r.iphone || r.ipod, r.tablet = r.ipad, r.desktop = r.mac || r.win || r.linux && !r.android, r.portable = r.ios || r.android;
    var s = {
        engine: "unknow",
        release: "unknow",
        browser: "unknow",
        version: "unknow",
        prefix: {
            css: "",
            pro: "",
            clz: ""
        }
    };
    if (e.kernel = s, /msie\s+(.*?);/i.test(n)) {
        s.engine = "trident", s.browser = "ie", s.version = RegExp.$1, s.prefix = {
            css: "ms",
            pro: "ms",
            clz: "MS",
            evt: "MS"
        };
        var a = {
            6: "2.0",
            7: "3.0",
            8: "4.0",
            9: "5.0",
            10: "6.0"
        };
        s.release = a[document.documentMode] || a[parseInt(s.version)]
    } else /webkit\/?([\d.]+?)(?=\s|$)/i.test(n) ? (s.engine = "webkit", s.release = RegExp.$1 || "", s.prefix = {
        css: "webkit",
        pro: "webkit",
        clz: "WebKit"
    }) : /rv\:(.*?)\)\s+gecko\//i.test(n) ? (s.engine = "gecko", s.release = RegExp.$1 || "", s.browser = "firefox", s.prefix = {
        css: "Moz",
        pro: "moz",
        clz: "Moz"
    }, /firefox\/(.*?)(?=\s|$)/i.test(n) && (s.version = RegExp.$1 || "")) : /presto\/(.*?)\s/i.test(n) && (s.engine = "presto", s.release = RegExp.$1 || "", s.browser = "opera", s.prefix = {
        css: "O",
        pro: "o",
        clz: "O"
    }, /version\/(.*?)(?=\s|$)/i.test(n) && (s.version = RegExp.$1 || "")); if ("unknow" == s.browser)
        for (var l, a = ["chrome", "maxthon", "safari"], c = 0, u = a.length; u > c; c++)
            if (l = "safari" == a[c] ? "version" : a[c], RegExp(l + "/(.*?)(?=\\s|$)", "i").test(n)) {
                s.browser = a[c], s.version = RegExp.$1.trim();
                break
            }
    e.platform = r;
    var h = "trident" != s.engine;
    e.browser = {
        gecko: "gecko" != s.engine,
        webkit: "webkit" != s.engine,
        presto: "presto" != s.engine,
        trident0: h || s.release > "2.0",
        trident1: h || "6.0" > s.release,
        trident2: h || s.release > "3.0",
        trident: h || s.release >= "6.0"
    }, e.isSupportCss3 = function() {
        return e.browser.trident1 || e.browser.trident2 ? !1 : !0
    }
}), define("viperjs/gallery/underscore/1.0/underscore.js", [], function(t, e, i) {
    (function() {
        var t = this,
            n = t._,
            r = {},
            o = Array.prototype,
            s = Object.prototype,
            a = Function.prototype,
            l = o.push,
            c = o.slice,
            u = o.concat,
            h = s.toString,
            d = s.hasOwnProperty,
            f = o.forEach,
            p = o.map,
            g = o.reduce,
            _ = o.reduceRight,
            m = o.filter,
            v = o.every,
            y = o.some,
            b = o.indexOf,
            w = o.lastIndexOf,
            x = Array.isArray,
            k = Object.keys,
            T = a.bind,
            C = function(t) {
                return t instanceof C ? t : this instanceof C ? (this._wrapped = t, void 0) : new C(t)
            };
        e !== void 0 ? (i !== void 0 && i.exports && (e = i.exports = C), e._ = C) : t._ = C, C.VERSION = "1.4.4";
        var S = C.each = C.forEach = function(t, e, i) {
            if (null != t)
                if (f && t.forEach === f) t.forEach(e, i);
                else if (t.length === +t.length) {
                for (var n = 0, o = t.length; o > n; n++)
                    if (e.call(i, t[n], n, t) === r) return
            } else
                for (var s in t)
                    if (C.has(t, s) && e.call(i, t[s], s, t) === r) return
        };
        C.map = C.collect = function(t, e, i) {
            var n = [];
            return null == t ? n : p && t.map === p ? t.map(e, i) : (S(t, function(t, r, o) {
                n[n.length] = e.call(i, t, r, o)
            }), n)
        };
        var E = "Reduce of empty array with no initial value";
        C.reduce = C.foldl = C.inject = function(t, e, i, n) {
            var r = arguments.length > 2;
            if (null == t && (t = []), g && t.reduce === g) return n && (e = C.bind(e, n)), r ? t.reduce(e, i) : t.reduce(e);
            if (S(t, function(t, o, s) {
                r ? i = e.call(n, i, t, o, s) : (i = t, r = !0)
            }), !r) throw new TypeError(E);
            return i
        }, C.reduceRight = C.foldr = function(t, e, i, n) {
            var r = arguments.length > 2;
            if (null == t && (t = []), _ && t.reduceRight === _) return n && (e = C.bind(e, n)), r ? t.reduceRight(e, i) : t.reduceRight(e);
            var o = t.length;
            if (o !== +o) {
                var s = C.keys(t);
                o = s.length
            }
            if (S(t, function(a, l, c) {
                l = s ? s[--o] : --o, r ? i = e.call(n, i, t[l], l, c) : (i = t[l], r = !0)
            }), !r) throw new TypeError(E);
            return i
        }, C.find = C.detect = function(t, e, i) {
            var n;
            return j(t, function(t, r, o) {
                return e.call(i, t, r, o) ? (n = t, !0) : void 0
            }), n
        }, C.filter = C.select = function(t, e, i) {
            var n = [];
            return null == t ? n : m && t.filter === m ? t.filter(e, i) : (S(t, function(t, r, o) {
                e.call(i, t, r, o) && (n[n.length] = t)
            }), n)
        }, C.reject = function(t, e, i) {
            return C.filter(t, function(t, n, r) {
                return !e.call(i, t, n, r)
            }, i)
        }, C.every = C.all = function(t, e, i) {
            e || (e = C.identity);
            var n = !0;
            return null == t ? n : v && t.every === v ? t.every(e, i) : (S(t, function(t, o, s) {
                return (n = n && e.call(i, t, o, s)) ? void 0 : r
            }), !!n)
        };
        var j = C.some = C.any = function(t, e, i) {
            e || (e = C.identity);
            var n = !1;
            return null == t ? n : y && t.some === y ? t.some(e, i) : (S(t, function(t, o, s) {
                return n || (n = e.call(i, t, o, s)) ? r : void 0
            }), !!n)
        };
        C.contains = C.include = function(t, e) {
            return null == t ? !1 : b && t.indexOf === b ? -1 != t.indexOf(e) : j(t, function(t) {
                return t === e
            })
        }, C.invoke = function(t, e) {
            var i = c.call(arguments, 2),
                n = C.isFunction(e);
            return C.map(t, function(t) {
                return (n ? e : t[e]).apply(t, i)
            })
        }, C.pluck = function(t, e) {
            return C.map(t, function(t) {
                return t[e]
            })
        }, C.where = function(t, e, i) {
            return C.isEmpty(e) ? i ? null : [] : C[i ? "find" : "filter"](t, function(t) {
                for (var i in e)
                    if (e[i] !== t[i]) return !1;
                return !0
            })
        }, C.findWhere = function(t, e) {
            return C.where(t, e, !0)
        }, C.max = function(t, e, i) {
            if (!e && C.isArray(t) && t[0] === +t[0] && 65535 > t.length) return Math.max.apply(Math, t);
            if (!e && C.isEmpty(t)) return -1 / 0;
            var n = {
                computed: -1 / 0,
                value: -1 / 0
            };
            return S(t, function(t, r, o) {
                var s = e ? e.call(i, t, r, o) : t;
                s >= n.computed && (n = {
                    value: t,
                    computed: s
                })
            }), n.value
        }, C.min = function(t, e, i) {
            if (!e && C.isArray(t) && t[0] === +t[0] && 65535 > t.length) return Math.min.apply(Math, t);
            if (!e && C.isEmpty(t)) return 1 / 0;
            var n = {
                computed: 1 / 0,
                value: 1 / 0
            };
            return S(t, function(t, r, o) {
                var s = e ? e.call(i, t, r, o) : t;
                n.computed > s && (n = {
                    value: t,
                    computed: s
                })
            }), n.value
        }, C.shuffle = function(t) {
            var e, i = 0,
                n = [];
            return S(t, function(t) {
                e = C.random(i++), n[i - 1] = n[e], n[e] = t
            }), n
        };
        var $ = function(t) {
            return C.isFunction(t) ? t : function(e) {
                return e[t]
            }
        };
        C.sortBy = function(t, e, i) {
            var n = $(e);
            return C.pluck(C.map(t, function(t, e, r) {
                return {
                    value: t,
                    index: e,
                    criteria: n.call(i, t, e, r)
                }
            }).sort(function(t, e) {
                var i = t.criteria,
                    n = e.criteria;
                if (i !== n) {
                    if (i > n || void 0 === i) return 1;
                    if (n > i || void 0 === n) return -1
                }
                return t.index < e.index ? -1 : 1
            }), "value")
        };
        var N = function(t, e, i, n) {
            var r = {},
                o = $(e || C.identity);
            return S(t, function(e, s) {
                var a = o.call(i, e, s, t);
                n(r, a, e)
            }), r
        };
        C.groupBy = function(t, e, i) {
            return N(t, e, i, function(t, e, i) {
                (C.has(t, e) ? t[e] : t[e] = []).push(i)
            })
        }, C.countBy = function(t, e, i) {
            return N(t, e, i, function(t, e) {
                C.has(t, e) || (t[e] = 0), t[e]++
            })
        }, C.sortedIndex = function(t, e, i, n) {
            i = null == i ? C.identity : $(i);
            for (var r = i.call(n, e), o = 0, s = t.length; s > o;) {
                var a = o + s >>> 1;
                r > i.call(n, t[a]) ? o = a + 1 : s = a
            }
            return o
        }, C.toArray = function(t) {
            return t ? C.isArray(t) ? c.call(t) : t.length === +t.length ? C.map(t, C.identity) : C.values(t) : []
        }, C.size = function(t) {
            return null == t ? 0 : t.length === +t.length ? t.length : C.keys(t).length
        }, C.first = C.head = C.take = function(t, e, i) {
            return null == t ? void 0 : null == e || i ? t[0] : c.call(t, 0, e)
        }, C.initial = function(t, e, i) {
            return c.call(t, 0, t.length - (null == e || i ? 1 : e))
        }, C.last = function(t, e, i) {
            return null == t ? void 0 : null == e || i ? t[t.length - 1] : c.call(t, Math.max(t.length - e, 0))
        }, C.rest = C.tail = C.drop = function(t, e, i) {
            return c.call(t, null == e || i ? 1 : e)
        }, C.compact = function(t) {
            return C.filter(t, C.identity)
        };
        var D = function(t, e, i) {
            return S(t, function(t) {
                C.isArray(t) ? e ? l.apply(i, t) : D(t, e, i) : i.push(t)
            }), i
        };
        C.flatten = function(t, e) {
            return D(t, e, [])
        }, C.without = function(t) {
            return C.difference(t, c.call(arguments, 1))
        }, C.uniq = C.unique = function(t, e, i, n) {
            C.isFunction(e) && (n = i, i = e, e = !1);
            var r = i ? C.map(t, i, n) : t,
                o = [],
                s = [];
            return S(r, function(i, n) {
                (e ? n && s[s.length - 1] === i : C.contains(s, i)) || (s.push(i), o.push(t[n]))
            }), o
        }, C.union = function() {
            return C.uniq(u.apply(o, arguments))
        }, C.intersection = function(t) {
            var e = c.call(arguments, 1);
            return C.filter(C.uniq(t), function(t) {
                return C.every(e, function(e) {
                    return C.indexOf(e, t) >= 0
                })
            })
        }, C.difference = function(t) {
            var e = u.apply(o, c.call(arguments, 1));
            return C.filter(t, function(t) {
                return !C.contains(e, t)
            })
        }, C.zip = function() {
            for (var t = c.call(arguments), e = C.max(C.pluck(t, "length")), i = Array(e), n = 0; e > n; n++) i[n] = C.pluck(t, "" + n);
            return i
        }, C.object = function(t, e) {
            if (null == t) return {};
            for (var i = {}, n = 0, r = t.length; r > n; n++) e ? i[t[n]] = e[n] : i[t[n][0]] = t[n][1];
            return i
        }, C.indexOf = function(t, e, i) {
            if (null == t) return -1;
            var n = 0,
                r = t.length;
            if (i) {
                if ("number" != typeof i) return n = C.sortedIndex(t, e), t[n] === e ? n : -1;
                n = 0 > i ? Math.max(0, r + i) : i
            }
            if (b && t.indexOf === b) return t.indexOf(e, i);
            for (; r > n; n++)
                if (t[n] === e) return n;
            return -1
        }, C.lastIndexOf = function(t, e, i) {
            if (null == t) return -1;
            var n = null != i;
            if (w && t.lastIndexOf === w) return n ? t.lastIndexOf(e, i) : t.lastIndexOf(e);
            for (var r = n ? i : t.length; r--;)
                if (t[r] === e) return r;
            return -1
        }, C.range = function(t, e, i) {
            1 >= arguments.length && (e = t || 0, t = 0), i = arguments[2] || 1;
            for (var n = Math.max(Math.ceil((e - t) / i), 0), r = 0, o = Array(n); n > r;) o[r++] = t, t += i;
            return o
        }, C.bind = function(t, e) {
            if (t.bind === T && T) return T.apply(t, c.call(arguments, 1));
            var i = c.call(arguments, 2);
            return function() {
                return t.apply(e, i.concat(c.call(arguments)))
            }
        }, C.partial = function(t) {
            var e = c.call(arguments, 1);
            return function() {
                return t.apply(this, e.concat(c.call(arguments)))
            }
        }, C.bindAll = function(t) {
            var e = c.call(arguments, 1);
            return 0 === e.length && (e = C.functions(t)), S(e, function(e) {
                t[e] = C.bind(t[e], t)
            }), t
        }, C.memoize = function(t, e) {
            var i = {};
            return e || (e = C.identity),
                function() {
                    var n = e.apply(this, arguments);
                    return C.has(i, n) ? i[n] : i[n] = t.apply(this, arguments)
                }
        }, C.delay = function(t, e) {
            var i = c.call(arguments, 2);
            return setTimeout(function() {
                return t.apply(null, i)
            }, e)
        }, C.defer = function(t) {
            return C.delay.apply(C, [t, 1].concat(c.call(arguments, 1)))
        }, C.throttle = function(t, e) {
            var i, n, r, o, s = 0,
                a = function() {
                    s = new Date, r = null, o = t.apply(i, n)
                };
            return function() {
                var l = new Date,
                    c = e - (l - s);
                return i = this, n = arguments, 0 >= c ? (clearTimeout(r), r = null, s = l, o = t.apply(i, n)) : r || (r = setTimeout(a, c)), o
            }
        }, C.debounce = function(t, e, i) {
            var n, r;
            return function() {
                var o = this,
                    s = arguments,
                    a = function() {
                        n = null, i || (r = t.apply(o, s))
                    },
                    l = i && !n;
                return clearTimeout(n), n = setTimeout(a, e), l && (r = t.apply(o, s)), r
            }
        }, C.once = function(t) {
            var e, i = !1;
            return function() {
                return i ? e : (i = !0, e = t.apply(this, arguments), t = null, e)
            }
        }, C.wrap = function(t, e) {
            return function() {
                var i = [t];
                return l.apply(i, arguments), e.apply(this, i)
            }
        }, C.compose = function() {
            var t = arguments;
            return function() {
                for (var e = arguments, i = t.length - 1; i >= 0; i--) e = [t[i].apply(this, e)];
                return e[0]
            }
        }, C.after = function(t, e) {
            return 0 >= t ? e() : function() {
                return 1 > --t ? e.apply(this, arguments) : void 0
            }
        }, C.keys = k || function(t) {
            if (t !== Object(t)) throw new TypeError("Invalid object");
            var e = [];
            for (var i in t) C.has(t, i) && (e[e.length] = i);
            return e
        }, C.values = function(t) {
            var e = [];
            for (var i in t) C.has(t, i) && e.push(t[i]);
            return e
        }, C.pairs = function(t) {
            var e = [];
            for (var i in t) C.has(t, i) && e.push([i, t[i]]);
            return e
        }, C.invert = function(t) {
            var e = {};
            for (var i in t) C.has(t, i) && (e[t[i]] = i);
            return e
        }, C.functions = C.methods = function(t) {
            var e = [];
            for (var i in t) C.isFunction(t[i]) && e.push(i);
            return e.sort()
        }, C.extend = function(t) {
            return S(c.call(arguments, 1), function(e) {
                if (e)
                    for (var i in e) t[i] = e[i]
            }), t
        }, C.pick = function(t) {
            var e = {},
                i = u.apply(o, c.call(arguments, 1));
            return S(i, function(i) {
                i in t && (e[i] = t[i])
            }), e
        }, C.omit = function(t) {
            var e = {},
                i = u.apply(o, c.call(arguments, 1));
            for (var n in t) C.contains(i, n) || (e[n] = t[n]);
            return e
        }, C.defaults = function(t) {
            return S(c.call(arguments, 1), function(e) {
                if (e)
                    for (var i in e) null == t[i] && (t[i] = e[i])
            }), t
        }, C.clone = function(t) {
            return C.isObject(t) ? C.isArray(t) ? t.slice() : C.extend({}, t) : t
        }, C.tap = function(t, e) {
            return e(t), t
        };
        var M = function(t, e, i, n) {
            if (t === e) return 0 !== t || 1 / t == 1 / e;
            if (null == t || null == e) return t === e;
            t instanceof C && (t = t._wrapped), e instanceof C && (e = e._wrapped);
            var r = h.call(t);
            if (r != h.call(e)) return !1;
            switch (r) {
                case "[object String]":
                    return t == e + "";
                case "[object Number]":
                    return t != +t ? e != +e : 0 == t ? 1 / t == 1 / e : t == +e;
                case "[object Date]":
                case "[object Boolean]":
                    return +t == +e;
                case "[object RegExp]":
                    return t.source == e.source && t.global == e.global && t.multiline == e.multiline && t.ignoreCase == e.ignoreCase
            }
            if ("object" != typeof t || "object" != typeof e) return !1;
            for (var o = i.length; o--;)
                if (i[o] == t) return n[o] == e;
            i.push(t), n.push(e);
            var s = 0,
                a = !0;
            if ("[object Array]" == r) {
                if (s = t.length, a = s == e.length)
                    for (; s-- && (a = M(t[s], e[s], i, n)););
            } else {
                var l = t.constructor,
                    c = e.constructor;
                if (l !== c && !(C.isFunction(l) && l instanceof l && C.isFunction(c) && c instanceof c)) return !1;
                for (var u in t)
                    if (C.has(t, u) && (s++, !(a = C.has(e, u) && M(t[u], e[u], i, n)))) break;
                if (a) {
                    for (u in e)
                        if (C.has(e, u) && !s--) break;
                    a = !s
                }
            }
            return i.pop(), n.pop(), a
        };
        C.isEqual = function(t, e) {
            return M(t, e, [], [])
        }, C.isEmpty = function(t) {
            if (null == t) return !0;
            if (C.isArray(t) || C.isString(t)) return 0 === t.length;
            for (var e in t)
                if (C.has(t, e)) return !1;
            return !0
        }, C.isElement = function(t) {
            return !(!t || 1 !== t.nodeType)
        }, C.isArray = x || function(t) {
            return "[object Array]" == h.call(t)
        }, C.isObject = function(t) {
            return t === Object(t)
        }, S(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(t) {
            C["is" + t] = function(e) {
                return h.call(e) == "[object " + t + "]"
            }
        }), C.isArguments(arguments) || (C.isArguments = function(t) {
            return !(!t || !C.has(t, "callee"))
        }), C.isFunction = function(t) {
            return "function" == typeof t
        }, C.isFinite = function(t) {
            return isFinite(t) && !isNaN(parseFloat(t))
        }, C.isNaN = function(t) {
            return C.isNumber(t) && t != +t
        }, C.isBoolean = function(t) {
            return t === !0 || t === !1 || "[object Boolean]" == h.call(t)
        }, C.isNull = function(t) {
            return null === t
        }, C.isUndefined = function(t) {
            return void 0 === t
        }, C.has = function(t, e) {
            return d.call(t, e)
        }, C.noConflict = function() {
            return t._ = n, this
        }, C.identity = function(t) {
            return t
        }, C.times = function(t, e, i) {
            for (var n = Array(t), r = 0; t > r; r++) n[r] = e.call(i, r);
            return n
        }, C.random = function(t, e) {
            return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
        };
        var L = {
            escape: {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "/": "&#x2F;"
            }
        };
        L.unescape = C.invert(L.escape);
        var B = {
            escape: RegExp("[" + C.keys(L.escape).join("") + "]", "g"),
            unescape: RegExp("(" + C.keys(L.unescape).join("|") + ")", "g")
        };
        C.each(["escape", "unescape"], function(t) {
            C[t] = function(e) {
                return null == e ? "" : ("" + e).replace(B[t], function(e) {
                    return L[t][e]
                })
            }
        }), C.result = function(t, e) {
            if (null == t) return null;
            var i = t[e];
            return C.isFunction(i) ? i.call(t) : i
        }, C.mixin = function(t) {
            S(C.functions(t), function(e) {
                var i = C[e] = t[e];
                C.prototype[e] = function() {
                    var t = [this._wrapped];
                    return l.apply(t, arguments), R.call(this, i.apply(C, t))
                }
            })
        };
        var A = 0;
        C.uniqueId = function(t) {
            var e = ++A + "";
            return t ? t + e : e
        }, C.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var P = /(.)^/,
            I = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                " ": "t",
                "\u2028": "u2028",
                "\u2029": "u2029"
            },
            z = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        C.template = function(t, e, i) {
            var n;
            i = C.defaults({}, i, C.templateSettings);
            var r = RegExp([(i.escape || P).source, (i.interpolate || P).source, (i.evaluate || P).source].join("|") + "|$", "g"),
                o = 0,
                s = "__p+='";
            t.replace(r, function(e, i, n, r, a) {
                return s += t.slice(o, a).replace(z, function(t) {
                    return "\\" + I[t]
                }), i && (s += "'+\n((__t=(" + i + "))==null?'':_.escape(__t))+\n'"), n && (s += "'+\n((__t=(" + n + "))==null?'':__t)+\n'"), r && (s += "';\n" + r + "\n__p+='"), o = a + e.length, e
            }), s += "';\n", i.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
            try {
                n = Function(i.variable || "obj", "_", s)
            } catch (a) {
                throw a.source = s, a
            }
            if (e) return n(e, C);
            var l = function(t) {
                return n.call(this, t, C)
            };
            return l.source = "function(" + (i.variable || "obj") + "){\n" + s + "}", l
        }, C.chain = function(t) {
            return C(t).chain()
        };
        var R = function(t) {
            return this._chain ? C(t).chain() : t
        };
        C.mixin(C), S(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) {
            var e = o[t];
            C.prototype[t] = function() {
                var i = this._wrapped;
                return e.apply(i, arguments), "shift" != t && "splice" != t || 0 !== i.length || delete i[0], R.call(this, i)
            }
        }), S(["concat", "join", "slice"], function(t) {
            var e = o[t];
            C.prototype[t] = function() {
                return R.call(this, e.apply(this._wrapped, arguments))
            }
        }), C.extend(C.prototype, {
            chain: function() {
                return this._chain = !0, this
            },
            value: function() {
                return this._wrapped
            }
        })
    }).call(this)
}), define("viperjs/gallery/jquery/1.10.2/jquery-1.10.2.js", [], function(t, e, i) {
    "use strict";
    (function(t, e) {
        function n(t) {
            var e = t.length,
                i = he.type(t);
            return he.isWindow(t) ? !1 : 1 === t.nodeType && e ? !0 : "array" === i || "function" !== i && (0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }

        function r(t) {
            var e = Se[t] = {};
            return he.each(t.match(fe) || [], function(t, i) {
                e[i] = !0
            }), e
        }

        function o(t, i, n, r) {
            if (he.acceptData(t)) {
                var o, s, a = he.expando,
                    l = t.nodeType,
                    c = l ? he.cache : t,
                    u = l ? t[a] : t[a] && a;
                if (u && c[u] && (r || c[u].data) || n !== e || "string" != typeof i) return u || (u = l ? t[a] = ie.pop() || he.guid++ : a), c[u] || (c[u] = l ? {} : {
                    toJSON: he.noop
                }), ("object" == typeof i || "function" == typeof i) && (r ? c[u] = he.extend(c[u], i) : c[u].data = he.extend(c[u].data, i)), s = c[u], r || (s.data || (s.data = {}), s = s.data), n !== e && (s[he.camelCase(i)] = n), "string" == typeof i ? (o = s[i], null == o && (o = s[he.camelCase(i)])) : o = s, o
            }
        }

        function s(t, e, i) {
            if (he.acceptData(t)) {
                var n, r, o = t.nodeType,
                    s = o ? he.cache : t,
                    a = o ? t[he.expando] : he.expando;
                if (s[a]) {
                    if (e && (n = i ? s[a] : s[a].data)) {
                        he.isArray(e) ? e = e.concat(he.map(e, he.camelCase)) : e in n ? e = [e] : (e = he.camelCase(e), e = e in n ? [e] : e.split(" ")), r = e.length;
                        for (; r--;) delete n[e[r]];
                        if (i ? !l(n) : !he.isEmptyObject(n)) return
                    }(i || (delete s[a].data, l(s[a]))) && (o ? he.cleanData([t], !0) : he.support.deleteExpando || s != s.window ? delete s[a] : s[a] = null)
                }
            }
        }

        function a(t, i, n) {
            if (n === e && 1 === t.nodeType) {
                var r = "data-" + i.replace(je, "-$1").toLowerCase();
                if (n = t.getAttribute(r), "string" == typeof n) {
                    try {
                        n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Ee.test(n) ? he.parseJSON(n) : n
                    } catch (o) {}
                    he.data(t, i, n)
                } else n = e
            }
            return n
        }

        function l(t) {
            var e;
            for (e in t)
                if (("data" !== e || !he.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
            return !0
        }

        function c() {
            return !0
        }

        function u() {
            return !1
        }

        function h() {
            try {
                return G.activeElement
            } catch (t) {}
        }

        function d(t, e) {
            do t = t[e]; while (t && 1 !== t.nodeType);
            return t
        }

        function f(t, e, i) {
            if (he.isFunction(e)) return he.grep(t, function(t, n) {
                return !!e.call(t, n, t) !== i
            });
            if (e.nodeType) return he.grep(t, function(t) {
                return t === e !== i
            });
            if ("string" == typeof e) {
                if (He.test(e)) return he.filter(e, t, i);
                e = he.filter(e, t)
            }
            return he.grep(t, function(t) {
                return he.inArray(t, e) >= 0 !== i
            })
        }

        function p(t) {
            var e = Ve.split("|"),
                i = t.createDocumentFragment();
            if (i.createElement)
                for (; e.length;) i.createElement(e.pop());
            return i
        }

        function g(t, e) {
            return he.nodeName(t, "table") && he.nodeName(1 === e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
        }

        function _(t) {
            return t.type = (null !== he.find.attr(t, "type")) + "/" + t.type, t
        }

        function m(t) {
            var e = oi.exec(t.type);
            return e ? t.type = e[1] : t.removeAttribute("type"), t
        }

        function v(t, e) {
            for (var i, n = 0; null != (i = t[n]); n++) he._data(i, "globalEval", !e || he._data(e[n], "globalEval"))
        }

        function y(t, e) {
            if (1 === e.nodeType && he.hasData(t)) {
                var i, n, r, o = he._data(t),
                    s = he._data(e, o),
                    a = o.events;
                if (a) {
                    delete s.handle, s.events = {};
                    for (i in a)
                        for (n = 0, r = a[i].length; r > n; n++) he.event.add(e, i, a[i][n])
                }
                s.data && (s.data = he.extend({}, s.data))
            }
        }

        function b(t, e) {
            var i, n, r;
            if (1 === e.nodeType) {
                if (i = e.nodeName.toLowerCase(), !he.support.noCloneEvent && e[he.expando]) {
                    r = he._data(e);
                    for (n in r.events) he.removeEvent(e, n, r.handle);
                    e.removeAttribute(he.expando)
                }
                "script" === i && e.text !== t.text ? (_(e).text = t.text, m(e)) : "object" === i ? (e.parentNode && (e.outerHTML = t.outerHTML), he.support.html5Clone && t.innerHTML && !he.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === i && ii.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === i ? e.defaultSelected = e.selected = t.defaultSelected : ("input" === i || "textarea" === i) && (e.defaultValue = t.defaultValue)
            }
        }

        function w(t, i) {
            var n, r, o = 0,
                s = typeof t.getElementsByTagName !== J ? t.getElementsByTagName(i || "*") : typeof t.querySelectorAll !== J ? t.querySelectorAll(i || "*") : e;
            if (!s)
                for (s = [], n = t.childNodes || t; null != (r = n[o]); o++)!i || he.nodeName(r, i) ? s.push(r) : he.merge(s, w(r, i));
            return i === e || i && he.nodeName(t, i) ? he.merge([t], s) : s
        }

        function x(t) {
            ii.test(t.type) && (t.defaultChecked = t.checked)
        }

        function k(t, e) {
            if (e in t) return e;
            for (var i = e.charAt(0).toUpperCase() + e.slice(1), n = e, r = Ci.length; r--;)
                if (e = Ci[r] + i, e in t) return e;
            return n
        }

        function T(t, e) {
            return t = e || t, "none" === he.css(t, "display") || !he.contains(t.ownerDocument, t)
        }

        function C(t, e) {
            for (var i, n, r, o = [], s = 0, a = t.length; a > s; s++) n = t[s], n.style && (o[s] = he._data(n, "olddisplay"), i = n.style.display, e ? (o[s] || "none" !== i || (n.style.display = ""), "" === n.style.display && T(n) && (o[s] = he._data(n, "olddisplay", $(n.nodeName)))) : o[s] || (r = T(n), (i && "none" !== i || !r) && he._data(n, "olddisplay", r ? i : he.css(n, "display"))));
            for (s = 0; a > s; s++) n = t[s], n.style && (e && "none" !== n.style.display && "" !== n.style.display || (n.style.display = e ? o[s] || "" : "none"));
            return t
        }

        function S(t, e, i) {
            var n = vi.exec(e);
            return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : e
        }

        function E(t, e, i, n, r) {
            for (var o = i === (n ? "border" : "content") ? 4 : "width" === e ? 1 : 0, s = 0; 4 > o; o += 2) "margin" === i && (s += he.css(t, i + Ti[o], !0, r)), n ? ("content" === i && (s -= he.css(t, "padding" + Ti[o], !0, r)), "margin" !== i && (s -= he.css(t, "border" + Ti[o] + "Width", !0, r))) : (s += he.css(t, "padding" + Ti[o], !0, r), "padding" !== i && (s += he.css(t, "border" + Ti[o] + "Width", !0, r)));
            return s
        }

        function j(t, e, i) {
            var n = !0,
                r = "width" === e ? t.offsetWidth : t.offsetHeight,
                o = hi(t),
                s = he.support.boxSizing && "border-box" === he.css(t, "boxSizing", !1, o);
            if (0 >= r || null == r) {
                if (r = di(t, e, o), (0 > r || null == r) && (r = t.style[e]), yi.test(r)) return r;
                n = s && (he.support.boxSizingReliable || r === t.style[e]), r = parseFloat(r) || 0
            }
            return r + E(t, e, i || (s ? "border" : "content"), n, o) + "px"
        }

        function $(t) {
            var e = G,
                i = wi[t];
            return i || (i = N(t, e), "none" !== i && i || (ui = (ui || he("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(e.documentElement), e = (ui[0].contentWindow || ui[0].contentDocument).document, e.write("<!doctype html><html><body>"), e.close(), i = N(t, e), ui.detach()), wi[t] = i), i
        }

        function N(t, e) {
            var i = he(e.createElement(t)).appendTo(e.body),
                n = he.css(i[0], "display");
            return i.remove(), n
        }

        function D(t, e, i, n) {
            var r;
            if (he.isArray(e)) he.each(e, function(e, r) {
                i || Ei.test(t) ? n(t, r) : D(t + "[" + ("object" == typeof r ? e : "") + "]", r, i, n)
            });
            else if (i || "object" !== he.type(e)) n(t, e);
            else
                for (r in e) D(t + "[" + r + "]", e[r], i, n)
        }

        function M(t) {
            return function(e, i) {
                "string" != typeof e && (i = e, e = "*");
                var n, r = 0,
                    o = e.toLowerCase().match(fe) || [];
                if (he.isFunction(i))
                    for (; n = o[r++];) "+" === n[0] ? (n = n.slice(1) || "*", (t[n] = t[n] || []).unshift(i)) : (t[n] = t[n] || []).push(i)
            }
        }

        function L(t, i, n, r) {
            function o(l) {
                var c;
                return s[l] = !0, he.each(t[l] || [], function(t, l) {
                    var u = l(i, n, r);
                    return "string" != typeof u || a || s[u] ? a ? !(c = u) : e : (i.dataTypes.unshift(u), o(u), !1)
                }), c
            }
            var s = {},
                a = t === Wi;
            return o(i.dataTypes[0]) || !s["*"] && o("*")
        }

        function B(t, i) {
            var n, r, o = he.ajaxSettings.flatOptions || {};
            for (r in i) i[r] !== e && ((o[r] ? t : n || (n = {}))[r] = i[r]);
            return n && he.extend(!0, t, n), t
        }

        function A(t, i, n) {
            for (var r, o, s, a, l = t.contents, c = t.dataTypes;
                "*" === c[0];) c.shift(), o === e && (o = t.mimeType || i.getResponseHeader("Content-Type"));
            if (o)
                for (a in l)
                    if (l[a] && l[a].test(o)) {
                        c.unshift(a);
                        break
                    }
            if (c[0] in n) s = c[0];
            else {
                for (a in n) {
                    if (!c[0] || t.converters[a + " " + c[0]]) {
                        s = a;
                        break
                    }
                    r || (r = a)
                }
                s = s || r
            }
            return s ? (s !== c[0] && c.unshift(s), n[s]) : e
        }

        function P(t, e, i, n) {
            var r, o, s, a, l, c = {},
                u = t.dataTypes.slice();
            if (u[1])
                for (s in t.converters) c[s.toLowerCase()] = t.converters[s];
            for (o = u.shift(); o;)
                if (t.responseFields[o] && (i[t.responseFields[o]] = e), !l && n && t.dataFilter && (e = t.dataFilter(e, t.dataType)), l = o, o = u.shift())
                    if ("*" === o) o = l;
                    else if ("*" !== l && l !== o) {
                if (s = c[l + " " + o] || c["* " + o], !s)
                    for (r in c)
                        if (a = r.split(" "), a[1] === o && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                            s === !0 ? s = c[r] : c[r] !== !0 && (o = a[0], u.unshift(a[1]));
                            break
                        }
                if (s !== !0)
                    if (s && t["throws"]) e = s(e);
                    else try {
                        e = s(e)
                    } catch (h) {
                        return {
                            state: "parsererror",
                            error: s ? h : "No conversion from " + l + " to " + o
                        }
                    }
            }
            return {
                state: "success",
                data: e
            }
        }

        function I() {
            try {
                return new t.XMLHttpRequest
            } catch (e) {}
        }

        function z() {
            try {
                return new t.ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
        }

        function R() {
            return setTimeout(function() {
                Qi = e
            }), Qi = he.now()
        }

        function O(t, e, i) {
            for (var n, r = (sn[e] || []).concat(sn["*"]), o = 0, s = r.length; s > o; o++)
                if (n = r[o].call(i, e, t)) return n
        }

        function F(t, e, i) {
            var n, r, o = 0,
                s = on.length,
                a = he.Deferred().always(function() {
                    delete l.elem
                }),
                l = function() {
                    if (r) return !1;
                    for (var e = Qi || R(), i = Math.max(0, c.startTime + c.duration - e), n = i / c.duration || 0, o = 1 - n, s = 0, l = c.tweens.length; l > s; s++) c.tweens[s].run(o);
                    return a.notifyWith(t, [c, o, i]), 1 > o && l ? i : (a.resolveWith(t, [c]), !1)
                },
                c = a.promise({
                    elem: t,
                    props: he.extend({}, e),
                    opts: he.extend(!0, {
                        specialEasing: {}
                    }, i),
                    originalProperties: e,
                    originalOptions: i,
                    startTime: Qi || R(),
                    duration: i.duration,
                    tweens: [],
                    createTween: function(e, i) {
                        var n = he.Tween(t, c.opts, e, i, c.opts.specialEasing[e] || c.opts.easing);
                        return c.tweens.push(n), n
                    },
                    stop: function(e) {
                        var i = 0,
                            n = e ? c.tweens.length : 0;
                        if (r) return this;
                        for (r = !0; n > i; i++) c.tweens[i].run(1);
                        return e ? a.resolveWith(t, [c, e]) : a.rejectWith(t, [c, e]), this
                    }
                }),
                u = c.props;
            for (q(u, c.opts.specialEasing); s > o; o++)
                if (n = on[o].call(c, t, u, c.opts)) return n;
            return he.map(u, O, c), he.isFunction(c.opts.start) && c.opts.start.call(t, c), he.fx.timer(he.extend(l, {
                elem: t,
                anim: c,
                queue: c.opts.queue
            })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
        }

        function q(t, e) {
            var i, n, r, o, s;
            for (i in t)
                if (n = he.camelCase(i), r = e[n], o = t[i], he.isArray(o) && (r = o[1], o = t[i] = o[0]), i !== n && (t[n] = o, delete t[i]), s = he.cssHooks[n], s && "expand" in s) {
                    o = s.expand(o), delete t[n];
                    for (i in o) i in t || (t[i] = o[i], e[i] = r)
                } else e[n] = r
        }

        function H(t, e, i) {
            var n, r, o, s, a, l, c = this,
                u = {},
                h = t.style,
                d = t.nodeType && T(t),
                f = he._data(t, "fxshow");
            i.queue || (a = he._queueHooks(t, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
                a.unqueued || l()
            }), a.unqueued++, c.always(function() {
                c.always(function() {
                    a.unqueued--, he.queue(t, "fx").length || a.empty.fire()
                })
            })), 1 === t.nodeType && ("height" in e || "width" in e) && (i.overflow = [h.overflow, h.overflowX, h.overflowY], "inline" === he.css(t, "display") && "none" === he.css(t, "float") && (he.support.inlineBlockNeedsLayout && "inline" !== $(t.nodeName) ? h.zoom = 1 : h.display = "inline-block")), i.overflow && (h.overflow = "hidden", he.support.shrinkWrapBlocks || c.always(function() {
                h.overflow = i.overflow[0], h.overflowX = i.overflow[1], h.overflowY = i.overflow[2]
            }));
            for (n in e)
                if (r = e[n], en.exec(r)) {
                    if (delete e[n], o = o || "toggle" === r, r === (d ? "hide" : "show")) continue;
                    u[n] = f && f[n] || he.style(t, n)
                }
            if (!he.isEmptyObject(u)) {
                f ? "hidden" in f && (d = f.hidden) : f = he._data(t, "fxshow", {}), o && (f.hidden = !d), d ? he(t).show() : c.done(function() {
                    he(t).hide()
                }), c.done(function() {
                    var e;
                    he._removeData(t, "fxshow");
                    for (e in u) he.style(t, e, u[e])
                });
                for (n in u) s = O(d ? f[n] : 0, n, c), n in f || (f[n] = s.start, d && (s.end = s.start, s.start = "width" === n || "height" === n ? 1 : 0))
            }
        }

        function W(t, e, i, n, r) {
            return new W.prototype.init(t, e, i, n, r)
        }

        function X(t, e) {
            var i, n = {
                    height: t
                },
                r = 0;
            for (e = e ? 1 : 0; 4 > r; r += 2 - e) i = Ti[r], n["margin" + i] = n["padding" + i] = t;
            return e && (n.opacity = n.width = t), n
        }

        function Y(t) {
            return he.isWindow(t) ? t : 9 === t.nodeType ? t.defaultView || t.parentWindow : !1
        }
        var V, U, J = typeof e,
            K = t.location,
            G = t.document,
            Z = G.documentElement,
            Q = t.jQuery,
            te = t.$,
            ee = {},
            ie = [],
            ne = "1.10.2",
            re = ie.concat,
            oe = ie.push,
            se = ie.slice,
            ae = ie.indexOf,
            le = ee.toString,
            ce = ee.hasOwnProperty,
            ue = ne.trim,
            he = function(t, e) {
                return new he.fn.init(t, e, U)
            },
            de = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            fe = /\S+/g,
            pe = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            ge = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            _e = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            me = /^[\],:{}\s]*$/,
            ve = /(?:^|:|,)(?:\s*\[)+/g,
            ye = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            be = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
            we = /^-ms-/,
            xe = /-([\da-z])/gi,
            ke = function(t, e) {
                return e.toUpperCase()
            },
            Te = function(t) {
                (G.addEventListener || "load" === t.type || "complete" === G.readyState) && (Ce(), he.ready())
            },
            Ce = function() {
                G.addEventListener ? (G.removeEventListener("DOMContentLoaded", Te, !1), t.removeEventListener("load", Te, !1)) : (G.detachEvent("onreadystatechange", Te), t.detachEvent("onload", Te))
            };
        he.fn = he.prototype = {
            jquery: ne,
            constructor: he,
            init: function(t, i, n) {
                var r, o;
                if (!t) return this;
                if ("string" == typeof t) {
                    if (r = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : ge.exec(t), !r || !r[1] && i) return !i || i.jquery ? (i || n).find(t) : this.constructor(i).find(t);
                    if (r[1]) {
                        if (i = i instanceof he ? i[0] : i, he.merge(this, he.parseHTML(r[1], i && i.nodeType ? i.ownerDocument || i : G, !0)), _e.test(r[1]) && he.isPlainObject(i))
                            for (r in i) he.isFunction(this[r]) ? this[r](i[r]) : this.attr(r, i[r]);
                        return this
                    }
                    if (o = G.getElementById(r[2]), o && o.parentNode) {
                        if (o.id !== r[2]) return n.find(t);
                        this.length = 1, this[0] = o
                    }
                    return this.context = G, this.selector = t, this
                }
                return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : he.isFunction(t) ? n.ready(t) : (t.selector !== e && (this.selector = t.selector, this.context = t.context), he.makeArray(t, this))
            },
            selector: "",
            length: 0,
            toArray: function() {
                return se.call(this)
            },
            get: function(t) {
                return null == t ? this.toArray() : 0 > t ? this[this.length + t] : this[t]
            },
            pushStack: function(t) {
                var e = he.merge(this.constructor(), t);
                return e.prevObject = this, e.context = this.context, e
            },
            each: function(t, e) {
                return he.each(this, t, e)
            },
            ready: function(t) {
                return he.ready.promise().done(t), this
            },
            slice: function() {
                return this.pushStack(se.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(t) {
                var e = this.length,
                    i = +t + (0 > t ? e : 0);
                return this.pushStack(i >= 0 && e > i ? [this[i]] : [])
            },
            map: function(t) {
                return this.pushStack(he.map(this, function(e, i) {
                    return t.call(e, i, e)
                }))
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: oe,
            sort: [].sort,
            splice: [].splice
        }, he.fn.init.prototype = he.fn, he.extend = he.fn.extend = function() {
            var t, i, n, r, o, s, a = arguments[0] || {},
                l = 1,
                c = arguments.length,
                u = !1;
            for ("boolean" == typeof a && (u = a, a = arguments[1] || {}, l = 2), "object" == typeof a || he.isFunction(a) || (a = {}), c === l && (a = this, --l); c > l; l++)
                if (null != (o = arguments[l]))
                    for (r in o) t = a[r], n = o[r], a !== n && (u && n && (he.isPlainObject(n) || (i = he.isArray(n))) ? (i ? (i = !1, s = t && he.isArray(t) ? t : []) : s = t && he.isPlainObject(t) ? t : {}, a[r] = he.extend(u, s, n)) : n !== e && (a[r] = n));
            return a
        }, he.extend({
            expando: "jQuery" + (ne + Math.random()).replace(/\D/g, ""),
            noConflict: function(e) {
                return t.$ === he && (t.$ = te), e && t.jQuery === he && (t.jQuery = Q), he
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(t) {
                t ? he.readyWait++ : he.ready(!0)
            },
            ready: function(t) {
                if (t === !0 ? !--he.readyWait : !he.isReady) {
                    if (!G.body) return setTimeout(he.ready);
                    he.isReady = !0, t !== !0 && --he.readyWait > 0 || (V.resolveWith(G, [he]), he.fn.trigger && he(G).trigger("ready").off("ready"))
                }
            },
            isFunction: function(t) {
                return "function" === he.type(t)
            },
            isArray: Array.isArray || function(t) {
                return "array" === he.type(t)
            },
            isWindow: function(t) {
                return null != t && t == t.window
            },
            isNumeric: function(t) {
                return !isNaN(parseFloat(t)) && isFinite(t)
            },
            type: function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? ee[le.call(t)] || "object" : typeof t
            },
            isPlainObject: function(t) {
                var i;
                if (!t || "object" !== he.type(t) || t.nodeType || he.isWindow(t)) return !1;
                try {
                    if (t.constructor && !ce.call(t, "constructor") && !ce.call(t.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                if (he.support.ownLast)
                    for (i in t) return ce.call(t, i);
                for (i in t);
                return i === e || ce.call(t, i)
            },
            isEmptyObject: function(t) {
                var e;
                for (e in t) return !1;
                return !0
            },
            error: function(t) {
                throw Error(t)
            },
            parseHTML: function(t, e, i) {
                if (!t || "string" != typeof t) return null;
                "boolean" == typeof e && (i = e, e = !1), e = e || G;
                var n = _e.exec(t),
                    r = !i && [];
                return n ? [e.createElement(n[1])] : (n = he.buildFragment([t], e, r), r && he(r).remove(), he.merge([], n.childNodes))
            },
            parseJSON: function(i) {
                return t.JSON && t.JSON.parse ? t.JSON.parse(i) : null === i ? i : "string" == typeof i && (i = he.trim(i), i && me.test(i.replace(ye, "@").replace(be, "]").replace(ve, ""))) ? Function("return " + i)() : (he.error("Invalid JSON: " + i), e)
            },
            parseXML: function(i) {
                var n, r;
                if (!i || "string" != typeof i) return null;
                try {
                    t.DOMParser ? (r = new DOMParser, n = r.parseFromString(i, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(i))
                } catch (o) {
                    n = e
                }
                return n && n.documentElement && !n.getElementsByTagName("parsererror").length || he.error("Invalid XML: " + i), n
            },
            noop: function() {},
            globalEval: function(e) {
                e && he.trim(e) && (t.execScript || function(e) {
                    t.eval.call(t, e)
                })(e)
            },
            camelCase: function(t) {
                return t.replace(we, "ms-").replace(xe, ke)
            },
            nodeName: function(t, e) {
                return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
            },
            each: function(t, e, i) {
                var r, o = 0,
                    s = t.length,
                    a = n(t);
                if (i) {
                    if (a)
                        for (; s > o && (r = e.apply(t[o], i), r !== !1); o++);
                    else
                        for (o in t)
                            if (r = e.apply(t[o], i), r === !1) break
                } else if (a)
                    for (; s > o && (r = e.call(t[o], o, t[o]), r !== !1); o++);
                else
                    for (o in t)
                        if (r = e.call(t[o], o, t[o]), r === !1) break; return t
            },
            trim: ue && !ue.call(" ") ? function(t) {
                return null == t ? "" : ue.call(t)
            } : function(t) {
                return null == t ? "" : (t + "").replace(pe, "")
            },
            makeArray: function(t, e) {
                var i = e || [];
                return null != t && (n(Object(t)) ? he.merge(i, "string" == typeof t ? [t] : t) : oe.call(i, t)), i
            },
            inArray: function(t, e, i) {
                var n;
                if (e) {
                    if (ae) return ae.call(e, t, i);
                    for (n = e.length, i = i ? 0 > i ? Math.max(0, n + i) : i : 0; n > i; i++)
                        if (i in e && e[i] === t) return i
                }
                return -1
            },
            merge: function(t, i) {
                var n = i.length,
                    r = t.length,
                    o = 0;
                if ("number" == typeof n)
                    for (; n > o; o++) t[r++] = i[o];
                else
                    for (; i[o] !== e;) t[r++] = i[o++];
                return t.length = r, t
            },
            grep: function(t, e, i) {
                var n, r = [],
                    o = 0,
                    s = t.length;
                for (i = !!i; s > o; o++) n = !!e(t[o], o), i !== n && r.push(t[o]);
                return r
            },
            map: function(t, e, i) {
                var r, o = 0,
                    s = t.length,
                    a = n(t),
                    l = [];
                if (a)
                    for (; s > o; o++) r = e(t[o], o, i), null != r && (l[l.length] = r);
                else
                    for (o in t) r = e(t[o], o, i), null != r && (l[l.length] = r);
                return re.apply([], l)
            },
            guid: 1,
            proxy: function(t, i) {
                var n, r, o;
                return "string" == typeof i && (o = t[i], i = t, t = o), he.isFunction(t) ? (n = se.call(arguments, 2), r = function() {
                    return t.apply(i || this, n.concat(se.call(arguments)))
                }, r.guid = t.guid = t.guid || he.guid++, r) : e
            },
            access: function(t, i, n, r, o, s, a) {
                var l = 0,
                    c = t.length,
                    u = null == n;
                if ("object" === he.type(n)) {
                    o = !0;
                    for (l in n) he.access(t, i, l, n[l], !0, s, a)
                } else if (r !== e && (o = !0, he.isFunction(r) || (a = !0), u && (a ? (i.call(t, r), i = null) : (u = i, i = function(t, e, i) {
                    return u.call(he(t), i)
                })), i))
                    for (; c > l; l++) i(t[l], n, a ? r : r.call(t[l], l, i(t[l], n)));
                return o ? t : u ? i.call(t) : c ? i(t[0], n) : s
            },
            now: function() {
                return (new Date).getTime()
            },
            swap: function(t, e, i, n) {
                var r, o, s = {};
                for (o in e) s[o] = t.style[o], t.style[o] = e[o];
                r = i.apply(t, n || []);
                for (o in e) t.style[o] = s[o];
                return r
            }
        }), he.ready.promise = function(e) {
            if (!V)
                if (V = he.Deferred(), "complete" === G.readyState) setTimeout(he.ready);
                else if (G.addEventListener) G.addEventListener("DOMContentLoaded", Te, !1), t.addEventListener("load", Te, !1);
            else {
                G.attachEvent("onreadystatechange", Te), t.attachEvent("onload", Te);
                var i = !1;
                try {
                    i = null == t.frameElement && G.documentElement
                } catch (n) {}
                i && i.doScroll && function r() {
                    if (!he.isReady) {
                        try {
                            i.doScroll("left")
                        } catch (t) {
                            return setTimeout(r, 50)
                        }
                        Ce(), he.ready()
                    }
                }()
            }
            return V.promise(e)
        }, he.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
            ee["[object " + e + "]"] = e.toLowerCase()
        }), U = he(G),
        function(t, e) {
            function i(t, e, i, n) {
                var r, o, s, a, l, c, u, h, p, g;
                if ((e ? e.ownerDocument || e : O) !== M && D(e), e = e || M, i = i || [], !t || "string" != typeof t) return i;
                if (1 !== (a = e.nodeType) && 9 !== a) return [];
                if (B && !n) {
                    if (r = ye.exec(t))
                        if (s = r[1]) {
                            if (9 === a) {
                                if (o = e.getElementById(s), !o || !o.parentNode) return i;
                                if (o.id === s) return i.push(o), i
                            } else if (e.ownerDocument && (o = e.ownerDocument.getElementById(s)) && z(e, o) && o.id === s) return i.push(o), i
                        } else {
                            if (r[2]) return te.apply(i, e.getElementsByTagName(t)), i;
                            if ((s = r[3]) && k.getElementsByClassName && e.getElementsByClassName) return te.apply(i, e.getElementsByClassName(s)), i
                        }
                    if (k.qsa && (!A || !A.test(t))) {
                        if (h = u = R, p = e, g = 9 === a && t, 1 === a && "object" !== e.nodeName.toLowerCase()) {
                            for (c = d(t), (u = e.getAttribute("id")) ? h = u.replace(xe, "\\$&") : e.setAttribute("id", h), h = "[id='" + h + "'] ", l = c.length; l--;) c[l] = h + f(c[l]);
                            p = fe.test(t) && e.parentNode || e, g = c.join(",")
                        }
                        if (g) try {
                            return te.apply(i, p.querySelectorAll(g)), i
                        } catch (_) {} finally {
                            u || e.removeAttribute("id")
                        }
                    }
                }
                return w(t.replace(ce, "$1"), e, i, n)
            }

            function n() {
                function t(i, n) {
                    return e.push(i += " ") > C.cacheLength && delete t[e.shift()], t[i] = n
                }
                var e = [];
                return t
            }

            function r(t) {
                return t[R] = !0, t
            }

            function o(t) {
                var e = M.createElement("div");
                try {
                    return !!t(e)
                } catch (i) {
                    return !1
                } finally {
                    e.parentNode && e.parentNode.removeChild(e), e = null
                }
            }

            function s(t, e) {
                for (var i = t.split("|"), n = t.length; n--;) C.attrHandle[i[n]] = e
            }

            function a(t, e) {
                var i = e && t,
                    n = i && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || J) - (~t.sourceIndex || J);
                if (n) return n;
                if (i)
                    for (; i = i.nextSibling;)
                        if (i === e) return -1;
                return t ? 1 : -1
            }

            function l(t) {
                return function(e) {
                    var i = e.nodeName.toLowerCase();
                    return "input" === i && e.type === t
                }
            }

            function c(t) {
                return function(e) {
                    var i = e.nodeName.toLowerCase();
                    return ("input" === i || "button" === i) && e.type === t
                }
            }

            function u(t) {
                return r(function(e) {
                    return e = +e, r(function(i, n) {
                        for (var r, o = t([], i.length, e), s = o.length; s--;) i[r = o[s]] && (i[r] = !(n[r] = i[r]))
                    })
                })
            }

            function h() {}

            function d(t, e) {
                var n, r, o, s, a, l, c, u = W[t + " "];
                if (u) return e ? 0 : u.slice(0);
                for (a = t, l = [], c = C.preFilter; a;) {
                    (!n || (r = ue.exec(a))) && (r && (a = a.slice(r[0].length) || a), l.push(o = [])), n = !1, (r = de.exec(a)) && (n = r.shift(), o.push({
                        value: n,
                        type: r[0].replace(ce, " ")
                    }), a = a.slice(n.length));
                    for (s in C.filter)!(r = me[s].exec(a)) || c[s] && !(r = c[s](r)) || (n = r.shift(), o.push({
                        value: n,
                        type: s,
                        matches: r
                    }), a = a.slice(n.length));
                    if (!n) break
                }
                return e ? a.length : a ? i.error(t) : W(t, l).slice(0)
            }

            function f(t) {
                for (var e = 0, i = t.length, n = ""; i > e; e++) n += t[e].value;
                return n
            }

            function p(t, e, i) {
                var n = e.dir,
                    r = i && "parentNode" === n,
                    o = q++;
                return e.first ? function(e, i, o) {
                    for (; e = e[n];)
                        if (1 === e.nodeType || r) return t(e, i, o)
                } : function(e, i, s) {
                    var a, l, c, u = F + " " + o;
                    if (s) {
                        for (; e = e[n];)
                            if ((1 === e.nodeType || r) && t(e, i, s)) return !0
                    } else
                        for (; e = e[n];)
                            if (1 === e.nodeType || r)
                                if (c = e[R] || (e[R] = {}), (l = c[n]) && l[0] === u) {
                                    if ((a = l[1]) === !0 || a === T) return a === !0
                                } else if (l = c[n] = [u], l[1] = t(e, i, s) || T, l[1] === !0) return !0
                }
            }

            function g(t) {
                return t.length > 1 ? function(e, i, n) {
                    for (var r = t.length; r--;)
                        if (!t[r](e, i, n)) return !1;
                    return !0
                } : t[0]
            }

            function _(t, e, i, n, r) {
                for (var o, s = [], a = 0, l = t.length, c = null != e; l > a; a++)(o = t[a]) && (!i || i(o, n, r)) && (s.push(o), c && e.push(a));
                return s
            }

            function m(t, e, i, n, o, s) {
                return n && !n[R] && (n = m(n)), o && !o[R] && (o = m(o, s)), r(function(r, s, a, l) {
                    var c, u, h, d = [],
                        f = [],
                        p = s.length,
                        g = r || b(e || "*", a.nodeType ? [a] : a, []),
                        m = !t || !r && e ? g : _(g, d, t, a, l),
                        v = i ? o || (r ? t : p || n) ? [] : s : m;
                    if (i && i(m, v, a, l), n)
                        for (c = _(v, f), n(c, [], a, l), u = c.length; u--;)(h = c[u]) && (v[f[u]] = !(m[f[u]] = h));
                    if (r) {
                        if (o || t) {
                            if (o) {
                                for (c = [], u = v.length; u--;)(h = v[u]) && c.push(m[u] = h);
                                o(null, v = [], c, l)
                            }
                            for (u = v.length; u--;)(h = v[u]) && (c = o ? ie.call(r, h) : d[u]) > -1 && (r[c] = !(s[c] = h))
                        }
                    } else v = _(v === s ? v.splice(p, v.length) : v), o ? o(null, s, v, l) : te.apply(s, v)
                })
            }

            function v(t) {
                for (var e, i, n, r = t.length, o = C.relative[t[0].type], s = o || C.relative[" "], a = o ? 1 : 0, l = p(function(t) {
                    return t === e
                }, s, !0), c = p(function(t) {
                    return ie.call(e, t) > -1
                }, s, !0), u = [
                    function(t, i, n) {
                        return !o && (n || i !== $) || ((e = i).nodeType ? l(t, i, n) : c(t, i, n))
                    }
                ]; r > a; a++)
                    if (i = C.relative[t[a].type]) u = [p(g(u), i)];
                    else {
                        if (i = C.filter[t[a].type].apply(null, t[a].matches), i[R]) {
                            for (n = ++a; r > n && !C.relative[t[n].type]; n++);
                            return m(a > 1 && g(u), a > 1 && f(t.slice(0, a - 1).concat({
                                value: " " === t[a - 2].type ? "*" : ""
                            })).replace(ce, "$1"), i, n > a && v(t.slice(a, n)), r > n && v(t = t.slice(n)), r > n && f(t))
                        }
                        u.push(i)
                    }
                return g(u)
            }

            function y(t, e) {
                var n = 0,
                    o = e.length > 0,
                    s = t.length > 0,
                    a = function(r, a, l, c, u) {
                        var h, d, f, p = [],
                            g = 0,
                            m = "0",
                            v = r && [],
                            y = null != u,
                            b = $,
                            w = r || s && C.find.TAG("*", u && a.parentNode || a),
                            x = F += null == b ? 1 : Math.random() || .1;
                        for (y && ($ = a !== M && a, T = n); null != (h = w[m]); m++) {
                            if (s && h) {
                                for (d = 0; f = t[d++];)
                                    if (f(h, a, l)) {
                                        c.push(h);
                                        break
                                    }
                                y && (F = x, T = ++n)
                            }
                            o && ((h = !f && h) && g--, r && v.push(h))
                        }
                        if (g += m, o && m !== g) {
                            for (d = 0; f = e[d++];) f(v, p, a, l);
                            if (r) {
                                if (g > 0)
                                    for (; m--;) v[m] || p[m] || (p[m] = Z.call(c));
                                p = _(p)
                            }
                            te.apply(c, p), y && !r && p.length > 0 && g + e.length > 1 && i.uniqueSort(c)
                        }
                        return y && (F = x, $ = b), v
                    };
                return o ? r(a) : a
            }

            function b(t, e, n) {
                for (var r = 0, o = e.length; o > r; r++) i(t, e[r], n);
                return n
            }

            function w(t, e, i, n) {
                var r, o, s, a, l, c = d(t);
                if (!n && 1 === c.length) {
                    if (o = c[0] = c[0].slice(0), o.length > 2 && "ID" === (s = o[0]).type && k.getById && 9 === e.nodeType && B && C.relative[o[1].type]) {
                        if (e = (C.find.ID(s.matches[0].replace(ke, Te), e) || [])[0], !e) return i;
                        t = t.slice(o.shift().value.length)
                    }
                    for (r = me.needsContext.test(t) ? 0 : o.length; r-- && (s = o[r], !C.relative[a = s.type]);)
                        if ((l = C.find[a]) && (n = l(s.matches[0].replace(ke, Te), fe.test(o[0].type) && e.parentNode || e))) {
                            if (o.splice(r, 1), t = n.length && f(o), !t) return te.apply(i, n), i;
                            break
                        }
                }
                return j(t, c)(n, e, !B, i, fe.test(t)), i
            }
            var x, k, T, C, S, E, j, $, N, D, M, L, B, A, P, I, z, R = "sizzle" + -new Date,
                O = t.document,
                F = 0,
                q = 0,
                H = n(),
                W = n(),
                X = n(),
                Y = !1,
                V = function(t, e) {
                    return t === e ? (Y = !0, 0) : 0
                },
                U = typeof e,
                J = 1 << 31,
                K = {}.hasOwnProperty,
                G = [],
                Z = G.pop,
                Q = G.push,
                te = G.push,
                ee = G.slice,
                ie = G.indexOf || function(t) {
                    for (var e = 0, i = this.length; i > e; e++)
                        if (this[e] === t) return e;
                    return -1
                },
                ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                re = "[\\x20\\t\\r\\n\\f]",
                oe = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                se = oe.replace("w", "w#"),
                ae = "\\[" + re + "*(" + oe + ")" + re + "*(?:([*^$|!~]?=)" + re + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + se + ")|)|)" + re + "*\\]",
                le = ":(" + oe + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ae.replace(3, 8) + ")*)|.*)\\)|)",
                ce = RegExp("^" + re + "+|((?:^|[^\\\\])(?:\\\\.)*)" + re + "+$", "g"),
                ue = RegExp("^" + re + "*," + re + "*"),
                de = RegExp("^" + re + "*([>+~]|" + re + ")" + re + "*"),
                fe = RegExp(re + "*[+~]"),
                pe = RegExp("=" + re + "*([^\\]'\"]*)" + re + "*\\]", "g"),
                ge = RegExp(le),
                _e = RegExp("^" + se + "$"),
                me = {
                    ID: RegExp("^#(" + oe + ")"),
                    CLASS: RegExp("^\\.(" + oe + ")"),
                    TAG: RegExp("^(" + oe.replace("w", "w*") + ")"),
                    ATTR: RegExp("^" + ae),
                    PSEUDO: RegExp("^" + le),
                    CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + re + "*(even|odd|(([+-]|)(\\d*)n|)" + re + "*(?:([+-]|)" + re + "*(\\d+)|))" + re + "*\\)|)", "i"),
                    bool: RegExp("^(?:" + ne + ")$", "i"),
                    needsContext: RegExp("^" + re + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + re + "*((?:-\\d)?\\d*)" + re + "*\\)|)(?=[^-]|$)", "i")
                },
                ve = /^[^{]+\{\s*\[native \w/,
                ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                be = /^(?:input|select|textarea|button)$/i,
                we = /^h\d$/i,
                xe = /'|\\/g,
                ke = RegExp("\\\\([\\da-f]{1,6}" + re + "?|(" + re + ")|.)", "ig"),
                Te = function(t, e, i) {
                    var n = "0x" + e - 65536;
                    return n !== n || i ? e : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode(55296 | n >> 10, 56320 | 1023 & n)
                };
            try {
                te.apply(G = ee.call(O.childNodes), O.childNodes), G[O.childNodes.length].nodeType
            } catch (Ce) {
                te = {
                    apply: G.length ? function(t, e) {
                        Q.apply(t, ee.call(e))
                    } : function(t, e) {
                        for (var i = t.length, n = 0; t[i++] = e[n++];);
                        t.length = i - 1
                    }
                }
            }
            E = i.isXML = function(t) {
                var e = t && (t.ownerDocument || t).documentElement;
                return e ? "HTML" !== e.nodeName : !1
            }, k = i.support = {}, D = i.setDocument = function(t) {
                var i = t ? t.ownerDocument || t : O,
                    n = i.defaultView;
                return i !== M && 9 === i.nodeType && i.documentElement ? (M = i, L = i.documentElement, B = !E(i), n && n.attachEvent && n !== n.top && n.attachEvent("onbeforeunload", function() {
                    D()
                }), k.attributes = o(function(t) {
                    return t.className = "i", !t.getAttribute("className")
                }), k.getElementsByTagName = o(function(t) {
                    return t.appendChild(i.createComment("")), !t.getElementsByTagName("*").length
                }), k.getElementsByClassName = o(function(t) {
                    return t.innerHTML = "<div class='a'></div><div class='a i'></div>", t.firstChild.className = "i", 2 === t.getElementsByClassName("i").length
                }), k.getById = o(function(t) {
                    return L.appendChild(t).id = R, !i.getElementsByName || !i.getElementsByName(R).length
                }), k.getById ? (C.find.ID = function(t, e) {
                    if (typeof e.getElementById !== U && B) {
                        var i = e.getElementById(t);
                        return i && i.parentNode ? [i] : []
                    }
                }, C.filter.ID = function(t) {
                    var e = t.replace(ke, Te);
                    return function(t) {
                        return t.getAttribute("id") === e
                    }
                }) : (delete C.find.ID, C.filter.ID = function(t) {
                    var e = t.replace(ke, Te);
                    return function(t) {
                        var i = typeof t.getAttributeNode !== U && t.getAttributeNode("id");
                        return i && i.value === e
                    }
                }), C.find.TAG = k.getElementsByTagName ? function(t, i) {
                    return typeof i.getElementsByTagName !== U ? i.getElementsByTagName(t) : e
                } : function(t, e) {
                    var i, n = [],
                        r = 0,
                        o = e.getElementsByTagName(t);
                    if ("*" === t) {
                        for (; i = o[r++];) 1 === i.nodeType && n.push(i);
                        return n
                    }
                    return o
                }, C.find.CLASS = k.getElementsByClassName && function(t, i) {
                    return typeof i.getElementsByClassName !== U && B ? i.getElementsByClassName(t) : e
                }, P = [], A = [], (k.qsa = ve.test(i.querySelectorAll)) && (o(function(t) {
                    t.innerHTML = "<select><option selected=''></option></select>", t.querySelectorAll("[selected]").length || A.push("\\[" + re + "*(?:value|" + ne + ")"), t.querySelectorAll(":checked").length || A.push(":checked")
                }), o(function(t) {
                    var e = i.createElement("input");
                    e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("t", ""), t.querySelectorAll("[t^='']").length && A.push("[*^$]=" + re + "*(?:''|\"\")"), t.querySelectorAll(":enabled").length || A.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), A.push(",.*:")
                })), (k.matchesSelector = ve.test(I = L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && o(function(t) {
                    k.disconnectedMatch = I.call(t, "div"), I.call(t, "[s!='']:x"), P.push("!=", le)
                }), A = A.length && RegExp(A.join("|")), P = P.length && RegExp(P.join("|")), z = ve.test(L.contains) || L.compareDocumentPosition ? function(t, e) {
                    var i = 9 === t.nodeType ? t.documentElement : t,
                        n = e && e.parentNode;
                    return t === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(n)))
                } : function(t, e) {
                    if (e)
                        for (; e = e.parentNode;)
                            if (e === t) return !0;
                    return !1
                }, V = L.compareDocumentPosition ? function(t, e) {
                    if (t === e) return Y = !0, 0;
                    var n = e.compareDocumentPosition && t.compareDocumentPosition && t.compareDocumentPosition(e);
                    return n ? 1 & n || !k.sortDetached && e.compareDocumentPosition(t) === n ? t === i || z(O, t) ? -1 : e === i || z(O, e) ? 1 : N ? ie.call(N, t) - ie.call(N, e) : 0 : 4 & n ? -1 : 1 : t.compareDocumentPosition ? -1 : 1
                } : function(t, e) {
                    var n, r = 0,
                        o = t.parentNode,
                        s = e.parentNode,
                        l = [t],
                        c = [e];
                    if (t === e) return Y = !0, 0;
                    if (!o || !s) return t === i ? -1 : e === i ? 1 : o ? -1 : s ? 1 : N ? ie.call(N, t) - ie.call(N, e) : 0;
                    if (o === s) return a(t, e);
                    for (n = t; n = n.parentNode;) l.unshift(n);
                    for (n = e; n = n.parentNode;) c.unshift(n);
                    for (; l[r] === c[r];) r++;
                    return r ? a(l[r], c[r]) : l[r] === O ? -1 : c[r] === O ? 1 : 0
                }, i) : M
            }, i.matches = function(t, e) {
                return i(t, null, null, e)
            }, i.matchesSelector = function(t, e) {
                if ((t.ownerDocument || t) !== M && D(t), e = e.replace(pe, "='$1']"), !(!k.matchesSelector || !B || P && P.test(e) || A && A.test(e))) try {
                    var n = I.call(t, e);
                    if (n || k.disconnectedMatch || t.document && 11 !== t.document.nodeType) return n
                } catch (r) {}
                return i(e, M, null, [t]).length > 0
            }, i.contains = function(t, e) {
                return (t.ownerDocument || t) !== M && D(t), z(t, e)
            }, i.attr = function(t, i) {
                (t.ownerDocument || t) !== M && D(t);
                var n = C.attrHandle[i.toLowerCase()],
                    r = n && K.call(C.attrHandle, i.toLowerCase()) ? n(t, i, !B) : e;
                return r === e ? k.attributes || !B ? t.getAttribute(i) : (r = t.getAttributeNode(i)) && r.specified ? r.value : null : r
            }, i.error = function(t) {
                throw Error("Syntax error, unrecognized expression: " + t)
            }, i.uniqueSort = function(t) {
                var e, i = [],
                    n = 0,
                    r = 0;
                if (Y = !k.detectDuplicates, N = !k.sortStable && t.slice(0), t.sort(V), Y) {
                    for (; e = t[r++];) e === t[r] && (n = i.push(r));
                    for (; n--;) t.splice(i[n], 1)
                }
                return t
            }, S = i.getText = function(t) {
                var e, i = "",
                    n = 0,
                    r = t.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r) {
                        if ("string" == typeof t.textContent) return t.textContent;
                        for (t = t.firstChild; t; t = t.nextSibling) i += S(t)
                    } else if (3 === r || 4 === r) return t.nodeValue
                } else
                    for (; e = t[n]; n++) i += S(e);
                return i
            }, C = i.selectors = {
                cacheLength: 50,
                createPseudo: r,
                match: me,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(t) {
                        return t[1] = t[1].replace(ke, Te), t[3] = (t[4] || t[5] || "").replace(ke, Te), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                    },
                    CHILD: function(t) {
                        return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || i.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && i.error(t[0]), t
                    },
                    PSEUDO: function(t) {
                        var i, n = !t[5] && t[2];
                        return me.CHILD.test(t[0]) ? null : (t[3] && t[4] !== e ? t[2] = t[4] : n && ge.test(n) && (i = d(n, !0)) && (i = n.indexOf(")", n.length - i) - n.length) && (t[0] = t[0].slice(0, i), t[2] = n.slice(0, i)), t.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(t) {
                        var e = t.replace(ke, Te).toLowerCase();
                        return "*" === t ? function() {
                            return !0
                        } : function(t) {
                            return t.nodeName && t.nodeName.toLowerCase() === e
                        }
                    },
                    CLASS: function(t) {
                        var e = H[t + " "];
                        return e || (e = RegExp("(^|" + re + ")" + t + "(" + re + "|$)")) && H(t, function(t) {
                            return e.test("string" == typeof t.className && t.className || typeof t.getAttribute !== U && t.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(t, e, n) {
                        return function(r) {
                            var o = i.attr(r, t);
                            return null == o ? "!=" === e : e ? (o += "", "=" === e ? o === n : "!=" === e ? o !== n : "^=" === e ? n && 0 === o.indexOf(n) : "*=" === e ? n && o.indexOf(n) > -1 : "$=" === e ? n && o.slice(-n.length) === n : "~=" === e ? (" " + o + " ").indexOf(n) > -1 : "|=" === e ? o === n || o.slice(0, n.length + 1) === n + "-" : !1) : !0
                        }
                    },
                    CHILD: function(t, e, i, n, r) {
                        var o = "nth" !== t.slice(0, 3),
                            s = "last" !== t.slice(-4),
                            a = "of-type" === e;
                        return 1 === n && 0 === r ? function(t) {
                            return !!t.parentNode
                        } : function(e, i, l) {
                            var c, u, h, d, f, p, g = o !== s ? "nextSibling" : "previousSibling",
                                _ = e.parentNode,
                                m = a && e.nodeName.toLowerCase(),
                                v = !l && !a;
                            if (_) {
                                if (o) {
                                    for (; g;) {
                                        for (h = e; h = h[g];)
                                            if (a ? h.nodeName.toLowerCase() === m : 1 === h.nodeType) return !1;
                                        p = g = "only" === t && !p && "nextSibling"
                                    }
                                    return !0
                                }
                                if (p = [s ? _.firstChild : _.lastChild], s && v) {
                                    for (u = _[R] || (_[R] = {}), c = u[t] || [], f = c[0] === F && c[1], d = c[0] === F && c[2], h = f && _.childNodes[f]; h = ++f && h && h[g] || (d = f = 0) || p.pop();)
                                        if (1 === h.nodeType && ++d && h === e) {
                                            u[t] = [F, f, d];
                                            break
                                        }
                                } else if (v && (c = (e[R] || (e[R] = {}))[t]) && c[0] === F) d = c[1];
                                else
                                    for (;
                                        (h = ++f && h && h[g] || (d = f = 0) || p.pop()) && ((a ? h.nodeName.toLowerCase() !== m : 1 !== h.nodeType) || !++d || (v && ((h[R] || (h[R] = {}))[t] = [F, d]), h !== e)););
                                return d -= r, d === n || 0 === d % n && d / n >= 0
                            }
                        }
                    },
                    PSEUDO: function(t, e) {
                        var n, o = C.pseudos[t] || C.setFilters[t.toLowerCase()] || i.error("unsupported pseudo: " + t);
                        return o[R] ? o(e) : o.length > 1 ? (n = [t, t, "", e], C.setFilters.hasOwnProperty(t.toLowerCase()) ? r(function(t, i) {
                            for (var n, r = o(t, e), s = r.length; s--;) n = ie.call(t, r[s]), t[n] = !(i[n] = r[s])
                        }) : function(t) {
                            return o(t, 0, n)
                        }) : o
                    }
                },
                pseudos: {
                    not: r(function(t) {
                        var e = [],
                            i = [],
                            n = j(t.replace(ce, "$1"));
                        return n[R] ? r(function(t, e, i, r) {
                            for (var o, s = n(t, null, r, []), a = t.length; a--;)(o = s[a]) && (t[a] = !(e[a] = o))
                        }) : function(t, r, o) {
                            return e[0] = t, n(e, null, o, i), !i.pop()
                        }
                    }),
                    has: r(function(t) {
                        return function(e) {
                            return i(t, e).length > 0
                        }
                    }),
                    contains: r(function(t) {
                        return function(e) {
                            return (e.textContent || e.innerText || S(e)).indexOf(t) > -1
                        }
                    }),
                    lang: r(function(t) {
                        return _e.test(t || "") || i.error("unsupported lang: " + t), t = t.replace(ke, Te).toLowerCase(),
                            function(e) {
                                var i;
                                do
                                    if (i = B ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return i = i.toLowerCase(), i === t || 0 === i.indexOf(t + "-");
                                while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var i = t.location && t.location.hash;
                        return i && i.slice(1) === e.id
                    },
                    root: function(t) {
                        return t === L
                    },
                    focus: function(t) {
                        return t === M.activeElement && (!M.hasFocus || M.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                    },
                    enabled: function(t) {
                        return t.disabled === !1
                    },
                    disabled: function(t) {
                        return t.disabled === !0
                    },
                    checked: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && !!t.checked || "option" === e && !!t.selected
                    },
                    selected: function(t) {
                        return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
                    },
                    empty: function(t) {
                        for (t = t.firstChild; t; t = t.nextSibling)
                            if (t.nodeName > "@" || 3 === t.nodeType || 4 === t.nodeType) return !1;
                        return !0
                    },
                    parent: function(t) {
                        return !C.pseudos.empty(t)
                    },
                    header: function(t) {
                        return we.test(t.nodeName)
                    },
                    input: function(t) {
                        return be.test(t.nodeName)
                    },
                    button: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && "button" === t.type || "button" === e
                    },
                    text: function(t) {
                        var e;
                        return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || e.toLowerCase() === t.type)
                    },
                    first: u(function() {
                        return [0]
                    }),
                    last: u(function(t, e) {
                        return [e - 1]
                    }),
                    eq: u(function(t, e, i) {
                        return [0 > i ? i + e : i]
                    }),
                    even: u(function(t, e) {
                        for (var i = 0; e > i; i += 2) t.push(i);
                        return t
                    }),
                    odd: u(function(t, e) {
                        for (var i = 1; e > i; i += 2) t.push(i);
                        return t
                    }),
                    lt: u(function(t, e, i) {
                        for (var n = 0 > i ? i + e : i; --n >= 0;) t.push(n);
                        return t
                    }),
                    gt: u(function(t, e, i) {
                        for (var n = 0 > i ? i + e : i; e > ++n;) t.push(n);
                        return t
                    })
                }
            }, C.pseudos.nth = C.pseudos.eq;
            for (x in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) C.pseudos[x] = l(x);
            for (x in {
                submit: !0,
                reset: !0
            }) C.pseudos[x] = c(x);
            h.prototype = C.filters = C.pseudos, C.setFilters = new h, j = i.compile = function(t, e) {
                var i, n = [],
                    r = [],
                    o = X[t + " "];
                if (!o) {
                    for (e || (e = d(t)), i = e.length; i--;) o = v(e[i]), o[R] ? n.push(o) : r.push(o);
                    o = X(t, y(r, n))
                }
                return o
            }, k.sortStable = R.split("").sort(V).join("") === R, k.detectDuplicates = Y, D(), k.sortDetached = o(function(t) {
                return 1 & t.compareDocumentPosition(M.createElement("div"))
            }), o(function(t) {
                return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
            }) || s("type|href|height|width", function(t, i, n) {
                return n ? e : t.getAttribute(i, "type" === i.toLowerCase() ? 1 : 2)
            }), k.attributes && o(function(t) {
                return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
            }) || s("value", function(t, i, n) {
                return n || "input" !== t.nodeName.toLowerCase() ? e : t.defaultValue
            }), o(function(t) {
                return null == t.getAttribute("disabled")
            }) || s(ne, function(t, i, n) {
                var r;
                return n ? e : (r = t.getAttributeNode(i)) && r.specified ? r.value : t[i] === !0 ? i.toLowerCase() : null
            }), he.find = i, he.expr = i.selectors, he.expr[":"] = he.expr.pseudos, he.unique = i.uniqueSort, he.text = i.getText, he.isXMLDoc = i.isXML, he.contains = i.contains
        }(t);
        var Se = {};
        he.Callbacks = function(t) {
            t = "string" == typeof t ? Se[t] || r(t) : he.extend({}, t);
            var i, n, o, s, a, l, c = [],
                u = !t.once && [],
                h = function(e) {
                    for (n = t.memory && e, o = !0, a = l || 0, l = 0, s = c.length, i = !0; c && s > a; a++)
                        if (c[a].apply(e[0], e[1]) === !1 && t.stopOnFalse) {
                            n = !1;
                            break
                        }
                    i = !1, c && (u ? u.length && h(u.shift()) : n ? c = [] : d.disable())
                },
                d = {
                    add: function() {
                        if (c) {
                            var e = c.length;
                            (function r(e) {
                                he.each(e, function(e, i) {
                                    var n = he.type(i);
                                    "function" === n ? t.unique && d.has(i) || c.push(i) : i && i.length && "string" !== n && r(i)
                                })
                            })(arguments), i ? s = c.length : n && (l = e, h(n))
                        }
                        return this
                    },
                    remove: function() {
                        return c && he.each(arguments, function(t, e) {
                            for (var n;
                                (n = he.inArray(e, c, n)) > -1;) c.splice(n, 1), i && (s >= n && s--, a >= n && a--)
                        }), this
                    },
                    has: function(t) {
                        return t ? he.inArray(t, c) > -1 : !(!c || !c.length)
                    },
                    empty: function() {
                        return c = [], s = 0, this
                    },
                    disable: function() {
                        return c = u = n = e, this
                    },
                    disabled: function() {
                        return !c
                    },
                    lock: function() {
                        return u = e, n || d.disable(), this
                    },
                    locked: function() {
                        return !u
                    },
                    fireWith: function(t, e) {
                        return !c || o && !u || (e = e || [], e = [t, e.slice ? e.slice() : e], i ? u.push(e) : h(e)), this
                    },
                    fire: function() {
                        return d.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!o
                    }
                };
            return d
        }, he.extend({
            Deferred: function(t) {
                var e = [
                        ["resolve", "done", he.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", he.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", he.Callbacks("memory")]
                    ],
                    i = "pending",
                    n = {
                        state: function() {
                            return i
                        },
                        always: function() {
                            return r.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var t = arguments;
                            return he.Deferred(function(i) {
                                he.each(e, function(e, o) {
                                    var s = o[0],
                                        a = he.isFunction(t[e]) && t[e];
                                    r[o[1]](function() {
                                        var t = a && a.apply(this, arguments);
                                        t && he.isFunction(t.promise) ? t.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[s + "With"](this === n ? i.promise() : this, a ? [t] : arguments)
                                    })
                                }), t = null
                            }).promise()
                        },
                        promise: function(t) {
                            return null != t ? he.extend(t, n) : n
                        }
                    },
                    r = {};
                return n.pipe = n.then, he.each(e, function(t, o) {
                    var s = o[2],
                        a = o[3];
                    n[o[1]] = s.add, a && s.add(function() {
                        i = a
                    }, e[1 ^ t][2].disable, e[2][2].lock), r[o[0]] = function() {
                        return r[o[0] + "With"](this === r ? n : this, arguments), this
                    }, r[o[0] + "With"] = s.fireWith
                }), n.promise(r), t && t.call(r, r), r
            },
            when: function(t) {
                var e, i, n, r = 0,
                    o = se.call(arguments),
                    s = o.length,
                    a = 1 !== s || t && he.isFunction(t.promise) ? s : 0,
                    l = 1 === a ? t : he.Deferred(),
                    c = function(t, i, n) {
                        return function(r) {
                            i[t] = this, n[t] = arguments.length > 1 ? se.call(arguments) : r, n === e ? l.notifyWith(i, n) : --a || l.resolveWith(i, n)
                        }
                    };
                if (s > 1)
                    for (e = Array(s), i = Array(s), n = Array(s); s > r; r++) o[r] && he.isFunction(o[r].promise) ? o[r].promise().done(c(r, n, o)).fail(l.reject).progress(c(r, i, e)) : --a;
                return a || l.resolveWith(n, o), l.promise()
            }
        }), he.support = function(e) {
            var i, n, r, o, s, a, l, c, u, h = G.createElement("div");
            if (h.setAttribute("className", "t"), h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = h.getElementsByTagName("*") || [], n = h.getElementsByTagName("a")[0], !n || !n.style || !i.length) return e;
            o = G.createElement("select"), a = o.appendChild(G.createElement("option")), r = h.getElementsByTagName("input")[0], n.style.cssText = "top:1px;float:left;opacity:.5", e.getSetAttribute = "t" !== h.className, e.leadingWhitespace = 3 === h.firstChild.nodeType, e.tbody = !h.getElementsByTagName("tbody").length, e.htmlSerialize = !!h.getElementsByTagName("link").length, e.style = /top/.test(n.getAttribute("style")), e.hrefNormalized = "/a" === n.getAttribute("href"), e.opacity = /^0.5/.test(n.style.opacity), e.cssFloat = !!n.style.cssFloat, e.checkOn = !!r.value, e.optSelected = a.selected, e.enctype = !!G.createElement("form").enctype, e.html5Clone = "<:nav></:nav>" !== G.createElement("nav").cloneNode(!0).outerHTML, e.inlineBlockNeedsLayout = !1, e.shrinkWrapBlocks = !1, e.pixelPosition = !1, e.deleteExpando = !0, e.noCloneEvent = !0, e.reliableMarginRight = !0, e.boxSizingReliable = !0, r.checked = !0, e.noCloneChecked = r.cloneNode(!0).checked, o.disabled = !0, e.optDisabled = !a.disabled;
            try {
                delete h.test
            } catch (d) {
                e.deleteExpando = !1
            }
            r = G.createElement("input"), r.setAttribute("value", ""), e.input = "" === r.getAttribute("value"), r.value = "t", r.setAttribute("type", "radio"), e.radioValue = "t" === r.value, r.setAttribute("checked", "t"), r.setAttribute("name", "t"), s = G.createDocumentFragment(), s.appendChild(r), e.appendChecked = r.checked, e.checkClone = s.cloneNode(!0).cloneNode(!0).lastChild.checked, h.attachEvent && (h.attachEvent("onclick", function() {
                e.noCloneEvent = !1
            }), h.cloneNode(!0).click());
            for (u in {
                submit: !0,
                change: !0,
                focusin: !0
            }) h.setAttribute(l = "on" + u, "t"), e[u + "Bubbles"] = l in t || h.attributes[l].expando === !1;
            h.style.backgroundClip = "content-box", h.cloneNode(!0).style.backgroundClip = "", e.clearCloneStyle = "content-box" === h.style.backgroundClip;
            for (u in he(e)) break;
            return e.ownLast = "0" !== u, he(function() {
                var i, n, r, o = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                    s = G.getElementsByTagName("body")[0];
                s && (i = G.createElement("div"), i.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", s.appendChild(i).appendChild(h), h.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = h.getElementsByTagName("td"), r[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === r[0].offsetHeight, r[0].style.display = "", r[1].style.display = "none", e.reliableHiddenOffsets = c && 0 === r[0].offsetHeight, h.innerHTML = "", h.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", he.swap(s, null != s.style.zoom ? {
                    zoom: 1
                } : {}, function() {
                    e.boxSizing = 4 === h.offsetWidth
                }), t.getComputedStyle && (e.pixelPosition = "1%" !== (t.getComputedStyle(h, null) || {}).top, e.boxSizingReliable = "4px" === (t.getComputedStyle(h, null) || {
                    width: "4px"
                }).width, n = h.appendChild(G.createElement("div")), n.style.cssText = h.style.cssText = o, n.style.marginRight = n.style.width = "0", h.style.width = "1px", e.reliableMarginRight = !parseFloat((t.getComputedStyle(n, null) || {}).marginRight)), typeof h.style.zoom !== J && (h.innerHTML = "", h.style.cssText = o + "width:1px;padding:1px;display:inline;zoom:1", e.inlineBlockNeedsLayout = 3 === h.offsetWidth, h.style.display = "block", h.innerHTML = "<div></div>", h.firstChild.style.width = "5px", e.shrinkWrapBlocks = 3 !== h.offsetWidth, e.inlineBlockNeedsLayout && (s.style.zoom = 1)), s.removeChild(i), i = h = r = n = null)
            }), i = o = s = a = n = r = null, e
        }({});
        var Ee = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
            je = /([A-Z])/g;
        he.extend({
            cache: {},
            noData: {
                applet: !0,
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(t) {
                return t = t.nodeType ? he.cache[t[he.expando]] : t[he.expando], !!t && !l(t)
            },
            data: function(t, e, i) {
                return o(t, e, i)
            },
            removeData: function(t, e) {
                return s(t, e)
            },
            _data: function(t, e, i) {
                return o(t, e, i, !0)
            },
            _removeData: function(t, e) {
                return s(t, e, !0)
            },
            acceptData: function(t) {
                if (t.nodeType && 1 !== t.nodeType && 9 !== t.nodeType) return !1;
                var e = t.nodeName && he.noData[t.nodeName.toLowerCase()];
                return !e || e !== !0 && t.getAttribute("classid") === e
            }
        }), he.fn.extend({
            data: function(t, i) {
                var n, r, o = null,
                    s = 0,
                    l = this[0];
                if (t === e) {
                    if (this.length && (o = he.data(l), 1 === l.nodeType && !he._data(l, "parsedAttrs"))) {
                        for (n = l.attributes; n.length > s; s++) r = n[s].name, 0 === r.indexOf("data-") && (r = he.camelCase(r.slice(5)), a(l, r, o[r]));
                        he._data(l, "parsedAttrs", !0)
                    }
                    return o
                }
                return "object" == typeof t ? this.each(function() {
                    he.data(this, t)
                }) : arguments.length > 1 ? this.each(function() {
                    he.data(this, t, i)
                }) : l ? a(l, t, he.data(l, t)) : null
            },
            removeData: function(t) {
                return this.each(function() {
                    he.removeData(this, t)
                })
            }
        }), he.extend({
            queue: function(t, i, n) {
                var r;
                return t ? (i = (i || "fx") + "queue", r = he._data(t, i), n && (!r || he.isArray(n) ? r = he._data(t, i, he.makeArray(n)) : r.push(n)), r || []) : e
            },
            dequeue: function(t, e) {
                e = e || "fx";
                var i = he.queue(t, e),
                    n = i.length,
                    r = i.shift(),
                    o = he._queueHooks(t, e),
                    s = function() {
                        he.dequeue(t, e)
                    };
                "inprogress" === r && (r = i.shift(), n--), r && ("fx" === e && i.unshift("inprogress"), delete o.stop, r.call(t, s, o)), !n && o && o.empty.fire()
            },
            _queueHooks: function(t, e) {
                var i = e + "queueHooks";
                return he._data(t, i) || he._data(t, i, {
                    empty: he.Callbacks("once memory").add(function() {
                        he._removeData(t, e + "queue"), he._removeData(t, i)
                    })
                })
            }
        }), he.fn.extend({
            queue: function(t, i) {
                var n = 2;
                return "string" != typeof t && (i = t, t = "fx", n--), n > arguments.length ? he.queue(this[0], t) : i === e ? this : this.each(function() {
                    var e = he.queue(this, t, i);
                    he._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && he.dequeue(this, t)
                })
            },
            dequeue: function(t) {
                return this.each(function() {
                    he.dequeue(this, t)
                })
            },
            delay: function(t, e) {
                return t = he.fx ? he.fx.speeds[t] || t : t, e = e || "fx", this.queue(e, function(e, i) {
                    var n = setTimeout(e, t);
                    i.stop = function() {
                        clearTimeout(n)
                    }
                })
            },
            clearQueue: function(t) {
                return this.queue(t || "fx", [])
            },
            promise: function(t, i) {
                var n, r = 1,
                    o = he.Deferred(),
                    s = this,
                    a = this.length,
                    l = function() {
                        --r || o.resolveWith(s, [s])
                    };
                for ("string" != typeof t && (i = t, t = e), t = t || "fx"; a--;) n = he._data(s[a], t + "queueHooks"), n && n.empty && (r++, n.empty.add(l));
                return l(), o.promise(i)
            }
        });
        var $e, Ne, De = /[\t\r\n\f]/g,
            Me = /\r/g,
            Le = /^(?:input|select|textarea|button|object)$/i,
            Be = /^(?:a|area)$/i,
            Ae = /^(?:checked|selected)$/i,
            Pe = he.support.getSetAttribute,
            Ie = he.support.input;
        he.fn.extend({
            attr: function(t, e) {
                return he.access(this, he.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
                return this.each(function() {
                    he.removeAttr(this, t)
                })
            },
            prop: function(t, e) {
                return he.access(this, he.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
                return t = he.propFix[t] || t, this.each(function() {
                    try {
                        this[t] = e, delete this[t]
                    } catch (i) {}
                })
            },
            addClass: function(t) {
                var e, i, n, r, o, s = 0,
                    a = this.length,
                    l = "string" == typeof t && t;
                if (he.isFunction(t)) return this.each(function(e) {
                    he(this).addClass(t.call(this, e, this.className))
                });
                if (l)
                    for (e = (t || "").match(fe) || []; a > s; s++)
                        if (i = this[s], n = 1 === i.nodeType && (i.className ? (" " + i.className + " ").replace(De, " ") : " ")) {
                            for (o = 0; r = e[o++];) 0 > n.indexOf(" " + r + " ") && (n += r + " ");
                            i.className = he.trim(n)
                        }
                return this
            },
            removeClass: function(t) {
                var e, i, n, r, o, s = 0,
                    a = this.length,
                    l = 0 === arguments.length || "string" == typeof t && t;
                if (he.isFunction(t)) return this.each(function(e) {
                    he(this).removeClass(t.call(this, e, this.className))
                });
                if (l)
                    for (e = (t || "").match(fe) || []; a > s; s++)
                        if (i = this[s], n = 1 === i.nodeType && (i.className ? (" " + i.className + " ").replace(De, " ") : "")) {
                            for (o = 0; r = e[o++];)
                                for (; n.indexOf(" " + r + " ") >= 0;) n = n.replace(" " + r + " ", " ");
                            i.className = t ? he.trim(n) : ""
                        }
                return this
            },
            toggleClass: function(t, e) {
                var i = typeof t;
                return "boolean" == typeof e && "string" === i ? e ? this.addClass(t) : this.removeClass(t) : he.isFunction(t) ? this.each(function(i) {
                    he(this).toggleClass(t.call(this, i, this.className, e), e)
                }) : this.each(function() {
                    if ("string" === i)
                        for (var e, n = 0, r = he(this), o = t.match(fe) || []; e = o[n++];) r.hasClass(e) ? r.removeClass(e) : r.addClass(e);
                    else(i === J || "boolean" === i) && (this.className && he._data(this, "__className__", this.className), this.className = this.className || t === !1 ? "" : he._data(this, "__className__") || "")
                })
            },
            hasClass: function(t) {
                for (var e = " " + t + " ", i = 0, n = this.length; n > i; i++)
                    if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(De, " ").indexOf(e) >= 0) return !0;
                return !1
            },
            val: function(t) {
                var i, n, r, o = this[0]; {
                    if (arguments.length) return r = he.isFunction(t), this.each(function(i) {
                        var o;
                        1 === this.nodeType && (o = r ? t.call(this, i, he(this).val()) : t, null == o ? o = "" : "number" == typeof o ? o += "" : he.isArray(o) && (o = he.map(o, function(t) {
                            return null == t ? "" : t + ""
                        })), n = he.valHooks[this.type] || he.valHooks[this.nodeName.toLowerCase()], n && "set" in n && n.set(this, o, "value") !== e || (this.value = o))
                    });
                    if (o) return n = he.valHooks[o.type] || he.valHooks[o.nodeName.toLowerCase()], n && "get" in n && (i = n.get(o, "value")) !== e ? i : (i = o.value, "string" == typeof i ? i.replace(Me, "") : null == i ? "" : i)
                }
            }
        }), he.extend({
            valHooks: {
                option: {
                    get: function(t) {
                        var e = he.find.attr(t, "value");
                        return null != e ? e : t.text
                    }
                },
                select: {
                    get: function(t) {
                        for (var e, i, n = t.options, r = t.selectedIndex, o = "select-one" === t.type || 0 > r, s = o ? null : [], a = o ? r + 1 : n.length, l = 0 > r ? a : o ? r : 0; a > l; l++)
                            if (i = n[l], !(!i.selected && l !== r || (he.support.optDisabled ? i.disabled : null !== i.getAttribute("disabled")) || i.parentNode.disabled && he.nodeName(i.parentNode, "optgroup"))) {
                                if (e = he(i).val(), o) return e;
                                s.push(e)
                            }
                        return s
                    },
                    set: function(t, e) {
                        for (var i, n, r = t.options, o = he.makeArray(e), s = r.length; s--;) n = r[s], (n.selected = he.inArray(he(n).val(), o) >= 0) && (i = !0);
                        return i || (t.selectedIndex = -1), o
                    }
                }
            },
            attr: function(t, i, n) {
                var r, o, s = t.nodeType;
                if (t && 3 !== s && 8 !== s && 2 !== s) return typeof t.getAttribute === J ? he.prop(t, i, n) : (1 === s && he.isXMLDoc(t) || (i = i.toLowerCase(), r = he.attrHooks[i] || (he.expr.match.bool.test(i) ? Ne : $e)), n === e ? r && "get" in r && null !== (o = r.get(t, i)) ? o : (o = he.find.attr(t, i), null == o ? e : o) : null !== n ? r && "set" in r && (o = r.set(t, n, i)) !== e ? o : (t.setAttribute(i, n + ""), n) : (he.removeAttr(t, i), e))
            },
            removeAttr: function(t, e) {
                var i, n, r = 0,
                    o = e && e.match(fe);
                if (o && 1 === t.nodeType)
                    for (; i = o[r++];) n = he.propFix[i] || i, he.expr.match.bool.test(i) ? Ie && Pe || !Ae.test(i) ? t[n] = !1 : t[he.camelCase("default-" + i)] = t[n] = !1 : he.attr(t, i, ""), t.removeAttribute(Pe ? i : n)
            },
            attrHooks: {
                type: {
                    set: function(t, e) {
                        if (!he.support.radioValue && "radio" === e && he.nodeName(t, "input")) {
                            var i = t.value;
                            return t.setAttribute("type", e), i && (t.value = i), e
                        }
                    }
                }
            },
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(t, i, n) {
                var r, o, s, a = t.nodeType;
                if (t && 3 !== a && 8 !== a && 2 !== a) return s = 1 !== a || !he.isXMLDoc(t), s && (i = he.propFix[i] || i, o = he.propHooks[i]), n !== e ? o && "set" in o && (r = o.set(t, n, i)) !== e ? r : t[i] = n : o && "get" in o && null !== (r = o.get(t, i)) ? r : t[i]
            },
            propHooks: {
                tabIndex: {
                    get: function(t) {
                        var e = he.find.attr(t, "tabindex");
                        return e ? parseInt(e, 10) : Le.test(t.nodeName) || Be.test(t.nodeName) && t.href ? 0 : -1
                    }
                }
            }
        }), Ne = {
            set: function(t, e, i) {
                return e === !1 ? he.removeAttr(t, i) : Ie && Pe || !Ae.test(i) ? t.setAttribute(!Pe && he.propFix[i] || i, i) : t[he.camelCase("default-" + i)] = t[i] = !0, i
            }
        }, he.each(he.expr.match.bool.source.match(/\w+/g), function(t, i) {
            var n = he.expr.attrHandle[i] || he.find.attr;
            he.expr.attrHandle[i] = Ie && Pe || !Ae.test(i) ? function(t, i, r) {
                var o = he.expr.attrHandle[i],
                    s = r ? e : (he.expr.attrHandle[i] = e) != n(t, i, r) ? i.toLowerCase() : null;
                return he.expr.attrHandle[i] = o, s
            } : function(t, i, n) {
                return n ? e : t[he.camelCase("default-" + i)] ? i.toLowerCase() : null
            }
        }), Ie && Pe || (he.attrHooks.value = {
            set: function(t, i, n) {
                return he.nodeName(t, "input") ? (t.defaultValue = i, e) : $e && $e.set(t, i, n)
            }
        }), Pe || ($e = {
            set: function(t, i, n) {
                var r = t.getAttributeNode(n);
                return r || t.setAttributeNode(r = t.ownerDocument.createAttribute(n)), r.value = i += "", "value" === n || i === t.getAttribute(n) ? i : e
            }
        }, he.expr.attrHandle.id = he.expr.attrHandle.name = he.expr.attrHandle.coords = function(t, i, n) {
            var r;
            return n ? e : (r = t.getAttributeNode(i)) && "" !== r.value ? r.value : null
        }, he.valHooks.button = {
            get: function(t, i) {
                var n = t.getAttributeNode(i);
                return n && n.specified ? n.value : e
            },
            set: $e.set
        }, he.attrHooks.contenteditable = {
            set: function(t, e, i) {
                $e.set(t, "" === e ? !1 : e, i)
            }
        }, he.each(["width", "height"], function(t, i) {
            he.attrHooks[i] = {
                set: function(t, n) {
                    return "" === n ? (t.setAttribute(i, "auto"), n) : e
                }
            }
        })), he.support.hrefNormalized || he.each(["href", "src"], function(t, e) {
            he.propHooks[e] = {
                get: function(t) {
                    return t.getAttribute(e, 4)
                }
            }
        }), he.support.style || (he.attrHooks.style = {
            get: function(t) {
                return t.style.cssText || e
            },
            set: function(t, e) {
                return t.style.cssText = e + ""
            }
        }), he.support.optSelected || (he.propHooks.selected = {
            get: function(t) {
                var e = t.parentNode;
                return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
            }
        }), he.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            he.propFix[this.toLowerCase()] = this
        }), he.support.enctype || (he.propFix.enctype = "encoding"), he.each(["radio", "checkbox"], function() {
            he.valHooks[this] = {
                set: function(t, i) {
                    return he.isArray(i) ? t.checked = he.inArray(he(t).val(), i) >= 0 : e
                }
            }, he.support.checkOn || (he.valHooks[this].get = function(t) {
                return null === t.getAttribute("value") ? "on" : t.value
            })
        });
        var ze = /^(?:input|select|textarea)$/i,
            Re = /^key/,
            Oe = /^(?:mouse|contextmenu)|click/,
            Fe = /^(?:focusinfocus|focusoutblur)$/,
            qe = /^([^.]*)(?:\.(.+)|)$/;
        he.event = {
            global: {},
            add: function(t, i, n, r, o) {
                var s, a, l, c, u, h, d, f, p, g, _, m = he._data(t);
                if (m) {
                    for (n.handler && (c = n, n = c.handler, o = c.selector), n.guid || (n.guid = he.guid++), (a = m.events) || (a = m.events = {}), (h = m.handle) || (h = m.handle = function(t) {
                        return typeof he === J || t && he.event.triggered === t.type ? e : he.event.dispatch.apply(h.elem, arguments)
                    }, h.elem = t), i = (i || "").match(fe) || [""], l = i.length; l--;) s = qe.exec(i[l]) || [], p = _ = s[1], g = (s[2] || "").split(".").sort(), p && (u = he.event.special[p] || {}, p = (o ? u.delegateType : u.bindType) || p, u = he.event.special[p] || {}, d = he.extend({
                        type: p,
                        origType: _,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && he.expr.match.needsContext.test(o),
                        namespace: g.join(".")
                    }, c), (f = a[p]) || (f = a[p] = [], f.delegateCount = 0, u.setup && u.setup.call(t, r, g, h) !== !1 || (t.addEventListener ? t.addEventListener(p, h, !1) : t.attachEvent && t.attachEvent("on" + p, h))), u.add && (u.add.call(t, d), d.handler.guid || (d.handler.guid = n.guid)), o ? f.splice(f.delegateCount++, 0, d) : f.push(d), he.event.global[p] = !0);
                    t = null
                }
            },
            remove: function(t, e, i, n, r) {
                var o, s, a, l, c, u, h, d, f, p, g, _ = he.hasData(t) && he._data(t);
                if (_ && (u = _.events)) {
                    for (e = (e || "").match(fe) || [""], c = e.length; c--;)
                        if (a = qe.exec(e[c]) || [], f = g = a[1], p = (a[2] || "").split(".").sort(), f) {
                            for (h = he.event.special[f] || {}, f = (n ? h.delegateType : h.bindType) || f, d = u[f] || [], a = a[2] && RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = d.length; o--;) s = d[o], !r && g !== s.origType || i && i.guid !== s.guid || a && !a.test(s.namespace) || n && n !== s.selector && ("**" !== n || !s.selector) || (d.splice(o, 1), s.selector && d.delegateCount--, h.remove && h.remove.call(t, s));
                            l && !d.length && (h.teardown && h.teardown.call(t, p, _.handle) !== !1 || he.removeEvent(t, f, _.handle), delete u[f])
                        } else
                            for (f in u) he.event.remove(t, f + e[c], i, n, !0);
                    he.isEmptyObject(u) && (delete _.handle, he._removeData(t, "events"))
                }
            },
            trigger: function(i, n, r, o) {
                var s, a, l, c, u, h, d, f = [r || G],
                    p = ce.call(i, "type") ? i.type : i,
                    g = ce.call(i, "namespace") ? i.namespace.split(".") : [];
                if (l = h = r = r || G, 3 !== r.nodeType && 8 !== r.nodeType && !Fe.test(p + he.event.triggered) && (p.indexOf(".") >= 0 && (g = p.split("."), p = g.shift(), g.sort()), a = 0 > p.indexOf(":") && "on" + p, i = i[he.expando] ? i : new he.Event(p, "object" == typeof i && i), i.isTrigger = o ? 2 : 3, i.namespace = g.join("."), i.namespace_re = i.namespace ? RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, i.result = e, i.target || (i.target = r), n = null == n ? [i] : he.makeArray(n, [i]), u = he.event.special[p] || {}, o || !u.trigger || u.trigger.apply(r, n) !== !1)) {
                    if (!o && !u.noBubble && !he.isWindow(r)) {
                        for (c = u.delegateType || p, Fe.test(c + p) || (l = l.parentNode); l; l = l.parentNode) f.push(l), h = l;
                        h === (r.ownerDocument || G) && f.push(h.defaultView || h.parentWindow || t)
                    }
                    for (d = 0;
                        (l = f[d++]) && !i.isPropagationStopped();) i.type = d > 1 ? c : u.bindType || p, s = (he._data(l, "events") || {})[i.type] && he._data(l, "handle"), s && s.apply(l, n), s = a && l[a], s && he.acceptData(l) && s.apply && s.apply(l, n) === !1 && i.preventDefault();
                    if (i.type = p, !o && !i.isDefaultPrevented() && (!u._default || u._default.apply(f.pop(), n) === !1) && he.acceptData(r) && a && r[p] && !he.isWindow(r)) {
                        h = r[a], h && (r[a] = null), he.event.triggered = p;
                        try {
                            r[p]()
                        } catch (_) {}
                        he.event.triggered = e, h && (r[a] = h)
                    }
                    return i.result
                }
            },
            dispatch: function(t) {
                t = he.event.fix(t);
                var i, n, r, o, s, a = [],
                    l = se.call(arguments),
                    c = (he._data(this, "events") || {})[t.type] || [],
                    u = he.event.special[t.type] || {};
                if (l[0] = t, t.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, t) !== !1) {
                    for (a = he.event.handlers.call(this, t, c), i = 0;
                        (o = a[i++]) && !t.isPropagationStopped();)
                        for (t.currentTarget = o.elem, s = 0;
                            (r = o.handlers[s++]) && !t.isImmediatePropagationStopped();)(!t.namespace_re || t.namespace_re.test(r.namespace)) && (t.handleObj = r, t.data = r.data, n = ((he.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l), n !== e && (t.result = n) === !1 && (t.preventDefault(), t.stopPropagation()));
                    return u.postDispatch && u.postDispatch.call(this, t), t.result
                }
            },
            handlers: function(t, i) {
                var n, r, o, s, a = [],
                    l = i.delegateCount,
                    c = t.target;
                if (l && c.nodeType && (!t.button || "click" !== t.type))
                    for (; c != this; c = c.parentNode || this)
                        if (1 === c.nodeType && (c.disabled !== !0 || "click" !== t.type)) {
                            for (o = [], s = 0; l > s; s++) r = i[s], n = r.selector + " ", o[n] === e && (o[n] = r.needsContext ? he(n, this).index(c) >= 0 : he.find(n, this, null, [c]).length), o[n] && o.push(r);
                            o.length && a.push({
                                elem: c,
                                handlers: o
                            })
                        }
                return i.length > l && a.push({
                    elem: this,
                    handlers: i.slice(l)
                }), a
            },
            fix: function(t) {
                if (t[he.expando]) return t;
                var e, i, n, r = t.type,
                    o = t,
                    s = this.fixHooks[r];
                for (s || (this.fixHooks[r] = s = Oe.test(r) ? this.mouseHooks : Re.test(r) ? this.keyHooks : {}), n = s.props ? this.props.concat(s.props) : this.props, t = new he.Event(o), e = n.length; e--;) i = n[e], t[i] = o[i];
                return t.target || (t.target = o.srcElement || G), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, s.filter ? s.filter(t, o) : t
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(t, e) {
                    return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(t, i) {
                    var n, r, o, s = i.button,
                        a = i.fromElement;
                    return null == t.pageX && null != i.clientX && (r = t.target.ownerDocument || G, o = r.documentElement, n = r.body, t.pageX = i.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0), t.pageY = i.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)), !t.relatedTarget && a && (t.relatedTarget = a === t.target ? i.toElement : a), t.which || s === e || (t.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), t
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== h() && this.focus) try {
                            return this.focus(), !1
                        } catch (t) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === h() && this.blur ? (this.blur(), !1) : e
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return he.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : e
                    },
                    _default: function(t) {
                        return he.nodeName(t.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(t) {
                        t.result !== e && (t.originalEvent.returnValue = t.result)
                    }
                }
            },
            simulate: function(t, e, i, n) {
                var r = he.extend(new he.Event, i, {
                    type: t,
                    isSimulated: !0,
                    originalEvent: {}
                });
                n ? he.event.trigger(r, null, e) : he.event.dispatch.call(e, r), r.isDefaultPrevented() && i.preventDefault()
            }
        }, he.removeEvent = G.removeEventListener ? function(t, e, i) {
            t.removeEventListener && t.removeEventListener(e, i, !1)
        } : function(t, e, i) {
            var n = "on" + e;
            t.detachEvent && (typeof t[n] === J && (t[n] = null), t.detachEvent(n, i))
        }, he.Event = function(t, i) {
            return this instanceof he.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.returnValue === !1 || t.getPreventDefault && t.getPreventDefault() ? c : u) : this.type = t, i && he.extend(this, i), this.timeStamp = t && t.timeStamp || he.now(), this[he.expando] = !0, e) : new he.Event(t, i)
        }, he.Event.prototype = {
            isDefaultPrevented: u,
            isPropagationStopped: u,
            isImmediatePropagationStopped: u,
            preventDefault: function() {
                var t = this.originalEvent;
                this.isDefaultPrevented = c, t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
            },
            stopPropagation: function() {
                var t = this.originalEvent;
                this.isPropagationStopped = c, t && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = c, this.stopPropagation()
            }
        }, he.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(t, e) {
            he.event.special[t] = {
                delegateType: e,
                bindType: e,
                handle: function(t) {
                    var i, n = this,
                        r = t.relatedTarget,
                        o = t.handleObj;
                    return (!r || r !== n && !he.contains(n, r)) && (t.type = o.origType, i = o.handler.apply(this, arguments), t.type = e), i
                }
            }
        }), he.support.submitBubbles || (he.event.special.submit = {
            setup: function() {
                return he.nodeName(this, "form") ? !1 : (he.event.add(this, "click._submit keypress._submit", function(t) {
                    var i = t.target,
                        n = he.nodeName(i, "input") || he.nodeName(i, "button") ? i.form : e;
                    n && !he._data(n, "submitBubbles") && (he.event.add(n, "submit._submit", function(t) {
                        t._submit_bubble = !0
                    }), he._data(n, "submitBubbles", !0))
                }), e)
            },
            postDispatch: function(t) {
                t._submit_bubble && (delete t._submit_bubble, this.parentNode && !t.isTrigger && he.event.simulate("submit", this.parentNode, t, !0))
            },
            teardown: function() {
                return he.nodeName(this, "form") ? !1 : (he.event.remove(this, "._submit"), e)
            }
        }), he.support.changeBubbles || (he.event.special.change = {
            setup: function() {
                return ze.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (he.event.add(this, "propertychange._change", function(t) {
                    "checked" === t.originalEvent.propertyName && (this._just_changed = !0)
                }), he.event.add(this, "click._change", function(t) {
                    this._just_changed && !t.isTrigger && (this._just_changed = !1), he.event.simulate("change", this, t, !0)
                })), !1) : (he.event.add(this, "beforeactivate._change", function(t) {
                    var e = t.target;
                    ze.test(e.nodeName) && !he._data(e, "changeBubbles") && (he.event.add(e, "change._change", function(t) {
                        !this.parentNode || t.isSimulated || t.isTrigger || he.event.simulate("change", this.parentNode, t, !0)
                    }), he._data(e, "changeBubbles", !0))
                }), e)
            },
            handle: function(t) {
                var i = t.target;
                return this !== i || t.isSimulated || t.isTrigger || "radio" !== i.type && "checkbox" !== i.type ? t.handleObj.handler.apply(this, arguments) : e
            },
            teardown: function() {
                return he.event.remove(this, "._change"), !ze.test(this.nodeName)
            }
        }), he.support.focusinBubbles || he.each({
            focus: "focusin",
            blur: "focusout"
        }, function(t, e) {
            var i = 0,
                n = function(t) {
                    he.event.simulate(e, t.target, he.event.fix(t), !0)
                };
            he.event.special[e] = {
                setup: function() {
                    0 === i++ && G.addEventListener(t, n, !0)
                },
                teardown: function() {
                    0 === --i && G.removeEventListener(t, n, !0)
                }
            }
        }), he.fn.extend({
            on: function(t, i, n, r, o) {
                var s, a;
                if ("object" == typeof t) {
                    "string" != typeof i && (n = n || i, i = e);
                    for (s in t) this.on(s, i, n, t[s], o);
                    return this
                }
                if (null == n && null == r ? (r = i, n = i = e) : null == r && ("string" == typeof i ? (r = n, n = e) : (r = n, n = i, i = e)), r === !1) r = u;
                else if (!r) return this;
                return 1 === o && (a = r, r = function(t) {
                    return he().off(t), a.apply(this, arguments)
                }, r.guid = a.guid || (a.guid = he.guid++)), this.each(function() {
                    he.event.add(this, t, r, n, i)
                })
            },
            one: function(t, e, i, n) {
                return this.on(t, e, i, n, 1)
            },
            off: function(t, i, n) {
                var r, o;
                if (t && t.preventDefault && t.handleObj) return r = t.handleObj, he(t.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                if ("object" == typeof t) {
                    for (o in t) this.off(o, i, t[o]);
                    return this
                }
                return (i === !1 || "function" == typeof i) && (n = i, i = e), n === !1 && (n = u), this.each(function() {
                    he.event.remove(this, t, n, i)
                })
            },
            trigger: function(t, e) {
                return this.each(function() {
                    he.event.trigger(t, e, this)
                })
            },
            triggerHandler: function(t, i) {
                var n = this[0];
                return n ? he.event.trigger(t, i, n, !0) : e
            }
        });
        var He = /^.[^:#\[\.,]*$/,
            We = /^(?:parents|prev(?:Until|All))/,
            Xe = he.expr.match.needsContext,
            Ye = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        he.fn.extend({
            find: function(t) {
                var e, i = [],
                    n = this,
                    r = n.length;
                if ("string" != typeof t) return this.pushStack(he(t).filter(function() {
                    for (e = 0; r > e; e++)
                        if (he.contains(n[e], this)) return !0
                }));
                for (e = 0; r > e; e++) he.find(t, n[e], i);
                return i = this.pushStack(r > 1 ? he.unique(i) : i), i.selector = this.selector ? this.selector + " " + t : t, i
            },
            has: function(t) {
                var e, i = he(t, this),
                    n = i.length;
                return this.filter(function() {
                    for (e = 0; n > e; e++)
                        if (he.contains(this, i[e])) return !0
                })
            },
            not: function(t) {
                return this.pushStack(f(this, t || [], !0))
            },
            filter: function(t) {
                return this.pushStack(f(this, t || [], !1))
            },
            is: function(t) {
                return !!f(this, "string" == typeof t && Xe.test(t) ? he(t) : t || [], !1).length
            },
            closest: function(t, e) {
                for (var i, n = 0, r = this.length, o = [], s = Xe.test(t) || "string" != typeof t ? he(t, e || this.context) : 0; r > n; n++)
                    for (i = this[n]; i && i !== e; i = i.parentNode)
                        if (11 > i.nodeType && (s ? s.index(i) > -1 : 1 === i.nodeType && he.find.matchesSelector(i, t))) {
                            i = o.push(i);
                            break
                        }
                return this.pushStack(o.length > 1 ? he.unique(o) : o)
            },
            index: function(t) {
                return t ? "string" == typeof t ? he.inArray(this[0], he(t)) : he.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(t, e) {
                var i = "string" == typeof t ? he(t, e) : he.makeArray(t && t.nodeType ? [t] : t),
                    n = he.merge(this.get(), i);
                return this.pushStack(he.unique(n))
            },
            addBack: function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }
        }), he.each({
            parent: function(t) {
                var e = t.parentNode;
                return e && 11 !== e.nodeType ? e : null
            },
            parents: function(t) {
                return he.dir(t, "parentNode")
            },
            parentsUntil: function(t, e, i) {
                return he.dir(t, "parentNode", i)
            },
            next: function(t) {
                return d(t, "nextSibling")
            },
            prev: function(t) {
                return d(t, "previousSibling")
            },
            nextAll: function(t) {
                return he.dir(t, "nextSibling")
            },
            prevAll: function(t) {
                return he.dir(t, "previousSibling")
            },
            nextUntil: function(t, e, i) {
                return he.dir(t, "nextSibling", i)
            },
            prevUntil: function(t, e, i) {
                return he.dir(t, "previousSibling", i)
            },
            siblings: function(t) {
                return he.sibling((t.parentNode || {}).firstChild, t)
            },
            children: function(t) {
                return he.sibling(t.firstChild)
            },
            contents: function(t) {
                return he.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : he.merge([], t.childNodes)
            }
        }, function(t, e) {
            he.fn[t] = function(i, n) {
                var r = he.map(this, e, i);
                return "Until" !== t.slice(-5) && (n = i), n && "string" == typeof n && (r = he.filter(n, r)), this.length > 1 && (Ye[t] || (r = he.unique(r)), We.test(t) && (r = r.reverse())), this.pushStack(r)
            }
        }), he.extend({
            filter: function(t, e, i) {
                var n = e[0];
                return i && (t = ":not(" + t + ")"), 1 === e.length && 1 === n.nodeType ? he.find.matchesSelector(n, t) ? [n] : [] : he.find.matches(t, he.grep(e, function(t) {
                    return 1 === t.nodeType
                }))
            },
            dir: function(t, i, n) {
                for (var r = [], o = t[i]; o && 9 !== o.nodeType && (n === e || 1 !== o.nodeType || !he(o).is(n));) 1 === o.nodeType && r.push(o), o = o[i];
                return r
            },
            sibling: function(t, e) {
                for (var i = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && i.push(t);
                return i
            }
        });
        var Ve = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            Ue = / jQuery\d+="(?:null|\d+)"/g,
            Je = RegExp("<(?:" + Ve + ")[\\s/>]", "i"),
            Ke = /^\s+/,
            Ge = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            Ze = /<([\w:]+)/,
            Qe = /<tbody/i,
            ti = /<|&#?\w+;/,
            ei = /<(?:script|style|link)/i,
            ii = /^(?:checkbox|radio)$/i,
            ni = /checked\s*(?:[^=]|=\s*.checked.)/i,
            ri = /^$|\/(?:java|ecma)script/i,
            oi = /^true\/(.*)/,
            si = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            ai = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: he.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
            },
            li = p(G),
            ci = li.appendChild(G.createElement("div"));
        ai.optgroup = ai.option, ai.tbody = ai.tfoot = ai.colgroup = ai.caption = ai.thead, ai.th = ai.td, he.fn.extend({
            text: function(t) {
                return he.access(this, function(t) {
                    return t === e ? he.text(this) : this.empty().append((this[0] && this[0].ownerDocument || G).createTextNode(t))
                }, null, t, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var e = g(this, t);
                        e.appendChild(t)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var e = g(this, t);
                        e.insertBefore(t, e.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
                })
            },
            remove: function(t, e) {
                for (var i, n = t ? he.filter(t, this) : this, r = 0; null != (i = n[r]); r++) e || 1 !== i.nodeType || he.cleanData(w(i)), i.parentNode && (e && he.contains(i.ownerDocument, i) && v(w(i, "script")), i.parentNode.removeChild(i));
                return this
            },
            empty: function() {
                for (var t, e = 0; null != (t = this[e]); e++) {
                    for (1 === t.nodeType && he.cleanData(w(t, !1)); t.firstChild;) t.removeChild(t.firstChild);
                    t.options && he.nodeName(t, "select") && (t.options.length = 0)
                }
                return this
            },
            clone: function(t, e) {
                return t = null == t ? !1 : t, e = null == e ? t : e, this.map(function() {
                    return he.clone(this, t, e)
                })
            },
            html: function(t) {
                return he.access(this, function(t) {
                    var i = this[0] || {},
                        n = 0,
                        r = this.length;
                    if (t === e) return 1 === i.nodeType ? i.innerHTML.replace(Ue, "") : e;
                    if (!("string" != typeof t || ei.test(t) || !he.support.htmlSerialize && Je.test(t) || !he.support.leadingWhitespace && Ke.test(t) || ai[(Ze.exec(t) || ["", ""])[1].toLowerCase()])) {
                        t = t.replace(Ge, "<$1></$2>");
                        try {
                            for (; r > n; n++) i = this[n] || {}, 1 === i.nodeType && (he.cleanData(w(i, !1)), i.innerHTML = t);
                            i = 0
                        } catch (o) {}
                    }
                    i && this.empty().append(t)
                }, null, t, arguments.length)
            },
            replaceWith: function() {
                var t = he.map(this, function(t) {
                        return [t.nextSibling, t.parentNode]
                    }),
                    e = 0;
                return this.domManip(arguments, function(i) {
                    var n = t[e++],
                        r = t[e++];
                    r && (n && n.parentNode !== r && (n = this.nextSibling), he(this).remove(), r.insertBefore(i, n))
                }, !0), e ? this : this.remove()
            },
            detach: function(t) {
                return this.remove(t, !0)
            },
            domManip: function(t, e, i) {
                t = re.apply([], t);
                var n, r, o, s, a, l, c = 0,
                    u = this.length,
                    h = this,
                    d = u - 1,
                    f = t[0],
                    p = he.isFunction(f);
                if (p || !(1 >= u || "string" != typeof f || he.support.checkClone) && ni.test(f)) return this.each(function(n) {
                    var r = h.eq(n);
                    p && (t[0] = f.call(this, n, r.html())), r.domManip(t, e, i)
                });
                if (u && (l = he.buildFragment(t, this[0].ownerDocument, !1, !i && this), n = l.firstChild, 1 === l.childNodes.length && (l = n), n)) {
                    for (s = he.map(w(l, "script"), _), o = s.length; u > c; c++) r = l, c !== d && (r = he.clone(r, !0, !0), o && he.merge(s, w(r, "script"))), e.call(this[c], r, c);
                    if (o)
                        for (a = s[s.length - 1].ownerDocument, he.map(s, m), c = 0; o > c; c++) r = s[c], ri.test(r.type || "") && !he._data(r, "globalEval") && he.contains(a, r) && (r.src ? he._evalUrl(r.src) : he.globalEval((r.text || r.textContent || r.innerHTML || "").replace(si, "")));
                    l = n = null
                }
                return this
            }
        }), he.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(t, e) {
            he.fn[t] = function(t) {
                for (var i, n = 0, r = [], o = he(t), s = o.length - 1; s >= n; n++) i = n === s ? this : this.clone(!0), he(o[n])[e](i), oe.apply(r, i.get());
                return this.pushStack(r)
            }
        }), he.extend({
            clone: function(t, e, i) {
                var n, r, o, s, a, l = he.contains(t.ownerDocument, t);
                if (he.support.html5Clone || he.isXMLDoc(t) || !Je.test("<" + t.nodeName + ">") ? o = t.cloneNode(!0) : (ci.innerHTML = t.outerHTML, ci.removeChild(o = ci.firstChild)), !(he.support.noCloneEvent && he.support.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || he.isXMLDoc(t)))
                    for (n = w(o), a = w(t), s = 0; null != (r = a[s]); ++s) n[s] && b(r, n[s]);
                if (e)
                    if (i)
                        for (a = a || w(t), n = n || w(o), s = 0; null != (r = a[s]); s++) y(r, n[s]);
                    else y(t, o);
                return n = w(o, "script"), n.length > 0 && v(n, !l && w(t, "script")), n = a = r = null, o
            },
            buildFragment: function(t, e, i, n) {
                for (var r, o, s, a, l, c, u, h = t.length, d = p(e), f = [], g = 0; h > g; g++)
                    if (o = t[g], o || 0 === o)
                        if ("object" === he.type(o)) he.merge(f, o.nodeType ? [o] : o);
                        else if (ti.test(o)) {
                    for (a = a || d.appendChild(e.createElement("div")), l = (Ze.exec(o) || ["", ""])[1].toLowerCase(), u = ai[l] || ai._default, a.innerHTML = u[1] + o.replace(Ge, "<$1></$2>") + u[2], r = u[0]; r--;) a = a.lastChild;
                    if (!he.support.leadingWhitespace && Ke.test(o) && f.push(e.createTextNode(Ke.exec(o)[0])), !he.support.tbody)
                        for (o = "table" !== l || Qe.test(o) ? "<table>" !== u[1] || Qe.test(o) ? 0 : a : a.firstChild, r = o && o.childNodes.length; r--;) he.nodeName(c = o.childNodes[r], "tbody") && !c.childNodes.length && o.removeChild(c);
                    for (he.merge(f, a.childNodes), a.textContent = ""; a.firstChild;) a.removeChild(a.firstChild);
                    a = d.lastChild
                } else f.push(e.createTextNode(o));
                for (a && d.removeChild(a), he.support.appendChecked || he.grep(w(f, "input"), x), g = 0; o = f[g++];)
                    if ((!n || -1 === he.inArray(o, n)) && (s = he.contains(o.ownerDocument, o), a = w(d.appendChild(o), "script"), s && v(a), i))
                        for (r = 0; o = a[r++];) ri.test(o.type || "") && i.push(o);
                return a = null, d
            },
            cleanData: function(t, e) {
                for (var i, n, r, o, s = 0, a = he.expando, l = he.cache, c = he.support.deleteExpando, u = he.event.special; null != (i = t[s]); s++)
                    if ((e || he.acceptData(i)) && (r = i[a], o = r && l[r])) {
                        if (o.events)
                            for (n in o.events) u[n] ? he.event.remove(i, n) : he.removeEvent(i, n, o.handle);
                        l[r] && (delete l[r], c ? delete i[a] : typeof i.removeAttribute !== J ? i.removeAttribute(a) : i[a] = null, ie.push(r))
                    }
            },
            _evalUrl: function(t) {
                return he.ajax({
                    url: t,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }
        }), he.fn.extend({
            wrapAll: function(t) {
                if (he.isFunction(t)) return this.each(function(e) {
                    he(this).wrapAll(t.call(this, e))
                });
                if (this[0]) {
                    var e = he(t, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                        for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
                        return t
                    }).append(this)
                }
                return this
            },
            wrapInner: function(t) {
                return he.isFunction(t) ? this.each(function(e) {
                    he(this).wrapInner(t.call(this, e))
                }) : this.each(function() {
                    var e = he(this),
                        i = e.contents();
                    i.length ? i.wrapAll(t) : e.append(t)
                })
            },
            wrap: function(t) {
                var e = he.isFunction(t);
                return this.each(function(i) {
                    he(this).wrapAll(e ? t.call(this, i) : t)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    he.nodeName(this, "body") || he(this).replaceWith(this.childNodes)
                }).end()
            }
        });
        var ui, hi, di, fi = /alpha\([^)]*\)/i,
            pi = /opacity\s*=\s*([^)]*)/,
            gi = /^(top|right|bottom|left)$/,
            _i = /^(none|table(?!-c[ea]).+)/,
            mi = /^margin/,
            vi = RegExp("^(" + de + ")(.*)$", "i"),
            yi = RegExp("^(" + de + ")(?!px)[a-z%]+$", "i"),
            bi = RegExp("^([+-])=(" + de + ")", "i"),
            wi = {
                BODY: "block"
            },
            xi = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            ki = {
                letterSpacing: 0,
                fontWeight: 400
            },
            Ti = ["Top", "Right", "Bottom", "Left"],
            Ci = ["Webkit", "O", "Moz", "ms"];
        he.fn.extend({
            css: function(t, i) {
                return he.access(this, function(t, i, n) {
                    var r, o, s = {},
                        a = 0;
                    if (he.isArray(i)) {
                        for (o = hi(t), r = i.length; r > a; a++) s[i[a]] = he.css(t, i[a], !1, o);
                        return s
                    }
                    return n !== e ? he.style(t, i, n) : he.css(t, i)
                }, t, i, arguments.length > 1)
            },
            show: function() {
                return C(this, !0)
            },
            hide: function() {
                return C(this)
            },
            toggle: function(t) {
                return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                    T(this) ? he(this).show() : he(this).hide()
                })
            }
        }), he.extend({
            cssHooks: {
                opacity: {
                    get: function(t, e) {
                        if (e) {
                            var i = di(t, "opacity");
                            return "" === i ? "1" : i
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": he.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(t, i, n, r) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var o, s, a, l = he.camelCase(i),
                        c = t.style;
                    if (i = he.cssProps[l] || (he.cssProps[l] = k(c, l)), a = he.cssHooks[i] || he.cssHooks[l], n === e) return a && "get" in a && (o = a.get(t, !1, r)) !== e ? o : c[i];
                    if (s = typeof n, "string" === s && (o = bi.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(he.css(t, i)), s = "number"), !(null == n || "number" === s && isNaN(n) || ("number" !== s || he.cssNumber[l] || (n += "px"), he.support.clearCloneStyle || "" !== n || 0 !== i.indexOf("background") || (c[i] = "inherit"), a && "set" in a && (n = a.set(t, n, r)) === e))) try {
                        c[i] = n
                    } catch (u) {}
                }
            },
            css: function(t, i, n, r) {
                var o, s, a, l = he.camelCase(i);
                return i = he.cssProps[l] || (he.cssProps[l] = k(t.style, l)), a = he.cssHooks[i] || he.cssHooks[l], a && "get" in a && (s = a.get(t, !0, n)), s === e && (s = di(t, i, r)), "normal" === s && i in ki && (s = ki[i]), "" === n || n ? (o = parseFloat(s), n === !0 || he.isNumeric(o) ? o || 0 : s) : s
            }
        }), t.getComputedStyle ? (hi = function(e) {
            return t.getComputedStyle(e, null)
        }, di = function(t, i, n) {
            var r, o, s, a = n || hi(t),
                l = a ? a.getPropertyValue(i) || a[i] : e,
                c = t.style;
            return a && ("" !== l || he.contains(t.ownerDocument, t) || (l = he.style(t, i)), yi.test(l) && mi.test(i) && (r = c.width, o = c.minWidth, s = c.maxWidth, c.minWidth = c.maxWidth = c.width = l, l = a.width, c.width = r, c.minWidth = o, c.maxWidth = s)), l
        }) : G.documentElement.currentStyle && (hi = function(t) {
            return t.currentStyle
        }, di = function(t, i, n) {
            var r, o, s, a = n || hi(t),
                l = a ? a[i] : e,
                c = t.style;
            return null == l && c && c[i] && (l = c[i]), yi.test(l) && !gi.test(i) && (r = c.left, o = t.runtimeStyle, s = o && o.left, s && (o.left = t.currentStyle.left), c.left = "fontSize" === i ? "1em" : l, l = c.pixelLeft + "px", c.left = r, s && (o.left = s)), "" === l ? "auto" : l
        }), he.each(["height", "width"], function(t, i) {
            he.cssHooks[i] = {
                get: function(t, n, r) {
                    return n ? 0 === t.offsetWidth && _i.test(he.css(t, "display")) ? he.swap(t, xi, function() {
                        return j(t, i, r)
                    }) : j(t, i, r) : e
                },
                set: function(t, e, n) {
                    var r = n && hi(t);
                    return S(t, e, n ? E(t, i, n, he.support.boxSizing && "border-box" === he.css(t, "boxSizing", !1, r), r) : 0)
                }
            }
        }), he.support.opacity || (he.cssHooks.opacity = {
            get: function(t, e) {
                return pi.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
            },
            set: function(t, e) {
                var i = t.style,
                    n = t.currentStyle,
                    r = he.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
                    o = n && n.filter || i.filter || "";
                i.zoom = 1, (e >= 1 || "" === e) && "" === he.trim(o.replace(fi, "")) && i.removeAttribute && (i.removeAttribute("filter"), "" === e || n && !n.filter) || (i.filter = fi.test(o) ? o.replace(fi, r) : o + " " + r)
            }
        }), he(function() {
            he.support.reliableMarginRight || (he.cssHooks.marginRight = {
                get: function(t, i) {
                    return i ? he.swap(t, {
                        display: "inline-block"
                    }, di, [t, "marginRight"]) : e
                }
            }), !he.support.pixelPosition && he.fn.position && he.each(["top", "left"], function(t, i) {
                he.cssHooks[i] = {
                    get: function(t, n) {
                        return n ? (n = di(t, i), yi.test(n) ? he(t).position()[i] + "px" : n) : e
                    }
                }
            })
        }), he.expr && he.expr.filters && (he.expr.filters.hidden = function(t) {
            return 0 >= t.offsetWidth && 0 >= t.offsetHeight || !he.support.reliableHiddenOffsets && "none" === (t.style && t.style.display || he.css(t, "display"))
        }, he.expr.filters.visible = function(t) {
            return !he.expr.filters.hidden(t)
        }), he.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(t, e) {
            he.cssHooks[t + e] = {
                expand: function(i) {
                    for (var n = 0, r = {}, o = "string" == typeof i ? i.split(" ") : [i]; 4 > n; n++) r[t + Ti[n] + e] = o[n] || o[n - 2] || o[0];
                    return r
                }
            }, mi.test(t) || (he.cssHooks[t + e].set = S)
        });
        var Si = /%20/g,
            Ei = /\[\]$/,
            ji = /\r?\n/g,
            $i = /^(?:submit|button|image|reset|file)$/i,
            Ni = /^(?:input|select|textarea|keygen)/i;
        he.fn.extend({
            serialize: function() {
                return he.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var t = he.prop(this, "elements");
                    return t ? he.makeArray(t) : this
                }).filter(function() {
                    var t = this.type;
                    return this.name && !he(this).is(":disabled") && Ni.test(this.nodeName) && !$i.test(t) && (this.checked || !ii.test(t))
                }).map(function(t, e) {
                    var i = he(this).val();
                    return null == i ? null : he.isArray(i) ? he.map(i, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(ji, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: i.replace(ji, "\r\n")
                    }
                }).get()
            }
        }), he.param = function(t, i) {
            var n, r = [],
                o = function(t, e) {
                    e = he.isFunction(e) ? e() : null == e ? "" : e, r[r.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
                };
            if (i === e && (i = he.ajaxSettings && he.ajaxSettings.traditional), he.isArray(t) || t.jquery && !he.isPlainObject(t)) he.each(t, function() {
                o(this.name, this.value)
            });
            else
                for (n in t) D(n, t[n], i, o);
            return r.join("&").replace(Si, "+")
        }, he.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
            he.fn[e] = function(t, i) {
                return arguments.length > 0 ? this.on(e, null, t, i) : this.trigger(e)
            }
        }), he.fn.extend({
            hover: function(t, e) {
                return this.mouseenter(t).mouseleave(e || t)
            },
            bind: function(t, e, i) {
                return this.on(t, null, e, i)
            },
            unbind: function(t, e) {
                return this.off(t, null, e)
            },
            delegate: function(t, e, i, n) {
                return this.on(e, t, i, n)
            },
            undelegate: function(t, e, i) {
                return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", i)
            }
        });
        var Di, Mi, Li = he.now(),
            Bi = /\?/,
            Ai = /#.*$/,
            Pi = /([?&])_=[^&]*/,
            Ii = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            zi = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Ri = /^(?:GET|HEAD)$/,
            Oi = /^\/\//,
            Fi = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
            qi = he.fn.load,
            Hi = {},
            Wi = {},
            Xi = "*/".concat("*");
        try {
            Mi = K.href
        } catch (Yi) {
            Mi = G.createElement("a"), Mi.href = "", Mi = Mi.href
        }
        Di = Fi.exec(Mi.toLowerCase()) || [], he.fn.load = function(t, i, n) {
            if ("string" != typeof t && qi) return qi.apply(this, arguments);
            var r, o, s, a = this,
                l = t.indexOf(" ");
            return l >= 0 && (r = t.slice(l, t.length), t = t.slice(0, l)), he.isFunction(i) ? (n = i, i = e) : i && "object" == typeof i && (s = "POST"), a.length > 0 && he.ajax({
                url: t,
                type: s,
                dataType: "html",
                data: i
            }).done(function(t) {
                o = arguments, a.html(r ? he("<div>").append(he.parseHTML(t)).find(r) : t)
            }).complete(n && function(t, e) {
                a.each(n, o || [t.responseText, e, t])
            }), this
        }, he.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
            he.fn[e] = function(t) {
                return this.on(e, t)
            }
        }), he.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Mi,
                type: "GET",
                isLocal: zi.test(Di[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Xi,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": he.parseJSON,
                    "text xml": he.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(t, e) {
                return e ? B(B(t, he.ajaxSettings), e) : B(he.ajaxSettings, t)
            },
            ajaxPrefilter: M(Hi),
            ajaxTransport: M(Wi),
            ajax: function(t, i) {
                function n(t, i, n, r) {
                    var o, h, v, y, w, k = i;
                    2 !== b && (b = 2, l && clearTimeout(l), u = e, a = r || "", x.readyState = t > 0 ? 4 : 0, o = t >= 200 && 300 > t || 304 === t, n && (y = A(d, x, n)), y = P(d, y, x, o), o ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (he.lastModified[s] = w), w = x.getResponseHeader("etag"), w && (he.etag[s] = w)), 204 === t || "HEAD" === d.type ? k = "nocontent" : 304 === t ? k = "notmodified" : (k = y.state, h = y.data, v = y.error, o = !v)) : (v = k, (t || !k) && (k = "error", 0 > t && (t = 0))), x.status = t, x.statusText = (i || k) + "", o ? g.resolveWith(f, [h, k, x]) : g.rejectWith(f, [x, k, v]), x.statusCode(m), m = e, c && p.trigger(o ? "ajaxSuccess" : "ajaxError", [x, d, o ? h : v]), _.fireWith(f, [x, k]), c && (p.trigger("ajaxComplete", [x, d]), --he.active || he.event.trigger("ajaxStop")))
                }
                "object" == typeof t && (i = t, t = e), i = i || {};
                var r, o, s, a, l, c, u, h, d = he.ajaxSetup({}, i),
                    f = d.context || d,
                    p = d.context && (f.nodeType || f.jquery) ? he(f) : he.event,
                    g = he.Deferred(),
                    _ = he.Callbacks("once memory"),
                    m = d.statusCode || {},
                    v = {},
                    y = {},
                    b = 0,
                    w = "canceled",
                    x = {
                        readyState: 0,
                        getResponseHeader: function(t) {
                            var e;
                            if (2 === b) {
                                if (!h)
                                    for (h = {}; e = Ii.exec(a);) h[e[1].toLowerCase()] = e[2];
                                e = h[t.toLowerCase()]
                            }
                            return null == e ? null : e
                        },
                        getAllResponseHeaders: function() {
                            return 2 === b ? a : null
                        },
                        setRequestHeader: function(t, e) {
                            var i = t.toLowerCase();
                            return b || (t = y[i] = y[i] || t, v[t] = e), this
                        },
                        overrideMimeType: function(t) {
                            return b || (d.mimeType = t), this
                        },
                        statusCode: function(t) {
                            var e;
                            if (t)
                                if (2 > b)
                                    for (e in t) m[e] = [m[e], t[e]];
                                else x.always(t[x.status]);
                            return this
                        },
                        abort: function(t) {
                            var e = t || w;
                            return u && u.abort(e), n(0, e), this
                        }
                    };
                if (g.promise(x).complete = _.add, x.success = x.done, x.error = x.fail, d.url = ((t || d.url || Mi) + "").replace(Ai, "").replace(Oi, Di[1] + "//"), d.type = i.method || i.type || d.method || d.type, d.dataTypes = he.trim(d.dataType || "*").toLowerCase().match(fe) || [""], null == d.crossDomain && (r = Fi.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] === Di[1] && r[2] === Di[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (Di[3] || ("http:" === Di[1] ? "80" : "443")))), d.data && d.processData && "string" != typeof d.data && (d.data = he.param(d.data, d.traditional)), L(Hi, d, i, x), 2 === b) return x;
                c = d.global, c && 0 === he.active++ && he.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !Ri.test(d.type), s = d.url, d.hasContent || (d.data && (s = d.url += (Bi.test(s) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = Pi.test(s) ? s.replace(Pi, "$1_=" + Li++) : s + (Bi.test(s) ? "&" : "?") + "_=" + Li++)), d.ifModified && (he.lastModified[s] && x.setRequestHeader("If-Modified-Since", he.lastModified[s]), he.etag[s] && x.setRequestHeader("If-None-Match", he.etag[s])), (d.data && d.hasContent && d.contentType !== !1 || i.contentType) && x.setRequestHeader("Content-Type", d.contentType), x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Xi + "; q=0.01" : "") : d.accepts["*"]);
                for (o in d.headers) x.setRequestHeader(o, d.headers[o]);
                if (d.beforeSend && (d.beforeSend.call(f, x, d) === !1 || 2 === b)) return x.abort();
                w = "abort";
                for (o in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) x[o](d[o]);
                if (u = L(Wi, d, i, x)) {
                    x.readyState = 1, c && p.trigger("ajaxSend", [x, d]), d.async && d.timeout > 0 && (l = setTimeout(function() {
                        x.abort("timeout")
                    }, d.timeout));
                    try {
                        b = 1, u.send(v, n)
                    } catch (k) {
                        if (!(2 > b)) throw k;
                        n(-1, k)
                    }
                } else n(-1, "No Transport");
                return x
            },
            getJSON: function(t, e, i) {
                return he.get(t, e, i, "json")
            },
            getScript: function(t, i) {
                return he.get(t, e, i, "script")
            }
        }), he.each(["get", "post"], function(t, i) {
            he[i] = function(t, n, r, o) {
                return he.isFunction(n) && (o = o || r, r = n, n = e), he.ajax({
                    url: t,
                    type: i,
                    dataType: o,
                    data: n,
                    success: r
                })
            }
        }), he.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(t) {
                    return he.globalEval(t), t
                }
            }
        }), he.ajaxPrefilter("script", function(t) {
            t.cache === e && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
        }), he.ajaxTransport("script", function(t) {
            if (t.crossDomain) {
                var i, n = G.head || he("head")[0] || G.documentElement;
                return {
                    send: function(e, r) {
                        i = G.createElement("script"), i.async = !0, t.scriptCharset && (i.charset = t.scriptCharset), i.src = t.url, i.onload = i.onreadystatechange = function(t, e) {
                            (e || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, i.parentNode && i.parentNode.removeChild(i), i = null, e || r(200, "success"))
                        }, n.insertBefore(i, n.firstChild)
                    },
                    abort: function() {
                        i && i.onload(e, !0)
                    }
                }
            }
        });
        var Vi = [],
            Ui = /(=)\?(?=&|$)|\?\?/;
        he.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var t = Vi.pop() || he.expando + "_" + Li++;
                return this[t] = !0, t
            }
        }), he.ajaxPrefilter("json jsonp", function(i, n, r) {
            var o, s, a, l = i.jsonp !== !1 && (Ui.test(i.url) ? "url" : "string" == typeof i.data && !(i.contentType || "").indexOf("application/x-www-form-urlencoded") && Ui.test(i.data) && "data");
            return l || "jsonp" === i.dataTypes[0] ? (o = i.jsonpCallback = he.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, l ? i[l] = i[l].replace(Ui, "$1" + o) : i.jsonp !== !1 && (i.url += (Bi.test(i.url) ? "&" : "?") + i.jsonp + "=" + o), i.converters["script json"] = function() {
                return a || he.error(o + " was not called"), a[0]
            }, i.dataTypes[0] = "json", s = t[o], t[o] = function() {
                a = arguments
            }, r.always(function() {
                t[o] = s, i[o] && (i.jsonpCallback = n.jsonpCallback, Vi.push(o)), a && he.isFunction(s) && s(a[0]), a = s = e
            }), "script") : e
        });
        var Ji, Ki, Gi = 0,
            Zi = t.ActiveXObject && function() {
                var t;
                for (t in Ji) Ji[t](e, !0)
            };
        he.ajaxSettings.xhr = t.ActiveXObject ? function() {
            return !this.isLocal && I() || z()
        } : I, Ki = he.ajaxSettings.xhr(), he.support.cors = !!Ki && "withCredentials" in Ki, Ki = he.support.ajax = !!Ki, Ki && he.ajaxTransport(function(i) {
            if (!i.crossDomain || he.support.cors) {
                var n;
                return {
                    send: function(r, o) {
                        var s, a, l = i.xhr();
                        if (i.username ? l.open(i.type, i.url, i.async, i.username, i.password) : l.open(i.type, i.url, i.async), i.xhrFields)
                            for (a in i.xhrFields) l[a] = i.xhrFields[a];
                        i.mimeType && l.overrideMimeType && l.overrideMimeType(i.mimeType), i.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (a in r) l.setRequestHeader(a, r[a])
                        } catch (c) {}
                        l.send(i.hasContent && i.data || null), n = function(t, r) {
                            var a, c, u, h;
                            try {
                                if (n && (r || 4 === l.readyState))
                                    if (n = e, s && (l.onreadystatechange = he.noop, Zi && delete Ji[s]), r) 4 !== l.readyState && l.abort();
                                    else {
                                        h = {}, a = l.status, c = l.getAllResponseHeaders(), "string" == typeof l.responseText && (h.text = l.responseText);
                                        try {
                                            u = l.statusText
                                        } catch (d) {
                                            u = ""
                                        }
                                        a || !i.isLocal || i.crossDomain ? 1223 === a && (a = 204) : a = h.text ? 200 : 404
                                    }
                            } catch (f) {
                                r || o(-1, f)
                            }
                            h && o(a, u, h, c)
                        }, i.async ? 4 === l.readyState ? setTimeout(n) : (s = ++Gi, Zi && (Ji || (Ji = {}, he(t).unload(Zi)), Ji[s] = n), l.onreadystatechange = n) : n()
                    },
                    abort: function() {
                        n && n(e, !0)
                    }
                }
            }
        });
        var Qi, tn, en = /^(?:toggle|show|hide)$/,
            nn = RegExp("^(?:([+-])=|)(" + de + ")([a-z%]*)$", "i"),
            rn = /queueHooks$/,
            on = [H],
            sn = {
                "*": [
                    function(t, e) {
                        var i = this.createTween(t, e),
                            n = i.cur(),
                            r = nn.exec(e),
                            o = r && r[3] || (he.cssNumber[t] ? "" : "px"),
                            s = (he.cssNumber[t] || "px" !== o && +n) && nn.exec(he.css(i.elem, t)),
                            a = 1,
                            l = 20;
                        if (s && s[3] !== o) {
                            o = o || s[3], r = r || [], s = +n || 1;
                            do a = a || ".5", s /= a, he.style(i.elem, t, s + o); while (a !== (a = i.cur() / n) && 1 !== a && --l)
                        }
                        return r && (s = i.start = +s || +n || 0, i.unit = o, i.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2]), i
                    }
                ]
            };
        he.Animation = he.extend(F, {
            tweener: function(t, e) {
                he.isFunction(t) ? (e = t, t = ["*"]) : t = t.split(" ");
                for (var i, n = 0, r = t.length; r > n; n++) i = t[n], sn[i] = sn[i] || [], sn[i].unshift(e)
            },
            prefilter: function(t, e) {
                e ? on.unshift(t) : on.push(t)
            }
        }), he.Tween = W, W.prototype = {
            constructor: W,
            init: function(t, e, i, n, r, o) {
                this.elem = t, this.prop = i, this.easing = r || "swing", this.options = e, this.start = this.now = this.cur(), this.end = n, this.unit = o || (he.cssNumber[i] ? "" : "px")
            },
            cur: function() {
                var t = W.propHooks[this.prop];
                return t && t.get ? t.get(this) : W.propHooks._default.get(this)
            },
            run: function(t) {
                var e, i = W.propHooks[this.prop];
                return this.pos = e = this.options.duration ? he.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : W.propHooks._default.set(this), this
            }
        }, W.prototype.init.prototype = W.prototype, W.propHooks = {
            _default: {
                get: function(t) {
                    var e;
                    return null == t.elem[t.prop] || t.elem.style && null != t.elem.style[t.prop] ? (e = he.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0) : t.elem[t.prop]
                },
                set: function(t) {
                    he.fx.step[t.prop] ? he.fx.step[t.prop](t) : t.elem.style && (null != t.elem.style[he.cssProps[t.prop]] || he.cssHooks[t.prop]) ? he.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now
                }
            }
        }, W.propHooks.scrollTop = W.propHooks.scrollLeft = {
            set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
            }
        }, he.each(["toggle", "show", "hide"], function(t, e) {
            var i = he.fn[e];
            he.fn[e] = function(t, n, r) {
                return null == t || "boolean" == typeof t ? i.apply(this, arguments) : this.animate(X(e, !0), t, n, r)
            }
        }), he.fn.extend({
            fadeTo: function(t, e, i, n) {
                return this.filter(T).css("opacity", 0).show().end().animate({
                    opacity: e
                }, t, i, n)
            },
            animate: function(t, e, i, n) {
                var r = he.isEmptyObject(t),
                    o = he.speed(e, i, n),
                    s = function() {
                        var e = F(this, he.extend({}, t), o);
                        (r || he._data(this, "finish")) && e.stop(!0)
                    };
                return s.finish = s, r || o.queue === !1 ? this.each(s) : this.queue(o.queue, s)
            },
            stop: function(t, i, n) {
                var r = function(t) {
                    var e = t.stop;
                    delete t.stop, e(n)
                };
                return "string" != typeof t && (n = i, i = t, t = e), i && t !== !1 && this.queue(t || "fx", []), this.each(function() {
                    var e = !0,
                        i = null != t && t + "queueHooks",
                        o = he.timers,
                        s = he._data(this);
                    if (i) s[i] && s[i].stop && r(s[i]);
                    else
                        for (i in s) s[i] && s[i].stop && rn.test(i) && r(s[i]);
                    for (i = o.length; i--;) o[i].elem !== this || null != t && o[i].queue !== t || (o[i].anim.stop(n), e = !1, o.splice(i, 1));
                    (e || !n) && he.dequeue(this, t)
                })
            },
            finish: function(t) {
                return t !== !1 && (t = t || "fx"), this.each(function() {
                    var e, i = he._data(this),
                        n = i[t + "queue"],
                        r = i[t + "queueHooks"],
                        o = he.timers,
                        s = n ? n.length : 0;
                    for (i.finish = !0, he.queue(this, t, []), r && r.stop && r.stop.call(this, !0), e = o.length; e--;) o[e].elem === this && o[e].queue === t && (o[e].anim.stop(!0), o.splice(e, 1));
                    for (e = 0; s > e; e++) n[e] && n[e].finish && n[e].finish.call(this);
                    delete i.finish
                })
            }
        }), he.each({
            slideDown: X("show"),
            slideUp: X("hide"),
            slideToggle: X("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(t, e) {
            he.fn[t] = function(t, i, n) {
                return this.animate(e, t, i, n)
            }
        }), he.speed = function(t, e, i) {
            var n = t && "object" == typeof t ? he.extend({}, t) : {
                complete: i || !i && e || he.isFunction(t) && t,
                duration: t,
                easing: i && e || e && !he.isFunction(e) && e
            };
            return n.duration = he.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in he.fx.speeds ? he.fx.speeds[n.duration] : he.fx.speeds._default, (null == n.queue || n.queue === !0) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
                he.isFunction(n.old) && n.old.call(this), n.queue && he.dequeue(this, n.queue)
            }, n
        }, he.easing = {
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            }
        }, he.timers = [], he.fx = W.prototype.init, he.fx.tick = function() {
            var t, i = he.timers,
                n = 0;
            for (Qi = he.now(); i.length > n; n++) t = i[n], t() || i[n] !== t || i.splice(n--, 1);
            i.length || he.fx.stop(), Qi = e
        }, he.fx.timer = function(t) {
            t() && he.timers.push(t) && he.fx.start()
        }, he.fx.interval = 13, he.fx.start = function() {
            tn || (tn = setInterval(he.fx.tick, he.fx.interval))
        }, he.fx.stop = function() {
            clearInterval(tn), tn = null
        }, he.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, he.fx.step = {}, he.expr && he.expr.filters && (he.expr.filters.animated = function(t) {
            return he.grep(he.timers, function(e) {
                return t === e.elem
            }).length
        }), he.fn.offset = function(t) {
            if (arguments.length) return t === e ? this : this.each(function(e) {
                he.offset.setOffset(this, t, e)
            });
            var i, n, r = {
                    top: 0,
                    left: 0
                },
                o = this[0],
                s = o && o.ownerDocument;
            if (s) return i = s.documentElement, he.contains(i, o) ? (typeof o.getBoundingClientRect !== J && (r = o.getBoundingClientRect()), n = Y(s), {
                top: r.top + (n.pageYOffset || i.scrollTop) - (i.clientTop || 0),
                left: r.left + (n.pageXOffset || i.scrollLeft) - (i.clientLeft || 0)
            }) : r
        }, he.offset = {
            setOffset: function(t, e, i) {
                var n = he.css(t, "position");
                "static" === n && (t.style.position = "relative");
                var r, o, s = he(t),
                    a = s.offset(),
                    l = he.css(t, "top"),
                    c = he.css(t, "left"),
                    u = ("absolute" === n || "fixed" === n) && he.inArray("auto", [l, c]) > -1,
                    h = {},
                    d = {};
                u ? (d = s.position(), r = d.top, o = d.left) : (r = parseFloat(l) || 0, o = parseFloat(c) || 0), he.isFunction(e) && (e = e.call(t, i, a)), null != e.top && (h.top = e.top - a.top + r), null != e.left && (h.left = e.left - a.left + o), "using" in e ? e.using.call(t, h) : s.css(h)
            }
        }, he.fn.extend({
            position: function() {
                if (this[0]) {
                    var t, e, i = {
                            top: 0,
                            left: 0
                        },
                        n = this[0];
                    return "fixed" === he.css(n, "position") ? e = n.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), he.nodeName(t[0], "html") || (i = t.offset()), i.top += he.css(t[0], "borderTopWidth", !0), i.left += he.css(t[0], "borderLeftWidth", !0)), {
                        top: e.top - i.top - he.css(n, "marginTop", !0),
                        left: e.left - i.left - he.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent || Z; t && !he.nodeName(t, "html") && "static" === he.css(t, "position");) t = t.offsetParent;
                    return t || Z
                })
            }
        }), he.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, i) {
            var n = /Y/.test(i);
            he.fn[t] = function(r) {
                return he.access(this, function(t, r, o) {
                    var s = Y(t);
                    return o === e ? s ? i in s ? s[i] : s.document.documentElement[r] : t[r] : (s ? s.scrollTo(n ? he(s).scrollLeft() : o, n ? o : he(s).scrollTop()) : t[r] = o, e)
                }, t, r, arguments.length, null)
            }
        }), he.each({
            Height: "height",
            Width: "width"
        }, function(t, i) {
            he.each({
                padding: "inner" + t,
                content: i,
                "": "outer" + t
            }, function(n, r) {
                he.fn[r] = function(r, o) {
                    var s = arguments.length && (n || "boolean" != typeof r),
                        a = n || (r === !0 || o === !0 ? "margin" : "border");
                    return he.access(this, function(i, n, r) {
                        var o;
                        return he.isWindow(i) ? i.document.documentElement["client" + t] : 9 === i.nodeType ? (o = i.documentElement, Math.max(i.body["scroll" + t], o["scroll" + t], i.body["offset" + t], o["offset" + t], o["client" + t])) : r === e ? he.css(i, n, a) : he.style(i, n, r, a)
                    }, i, s ? r : e, s, null)
                }
            })
        }), he.fn.size = function() {
            return this.length
        }, he.fn.andSelf = he.fn.addBack, "object" == typeof i && i && "object" == typeof i.exports ? (t.jQuery = t.$ = he, i.exports = he) : (t.jQuery = t.$ = he, "function" == typeof define && define.amd && define("jquery", [], function() {
            return he
        }))
    })(window)
}), define("viperjs/widget/template/jst.js", [], function(t, e, i) {
    var n = i.exports,
        r = {},
        o = {};
    return n.setDefault = function(t) {
        _.extend(r, t)
    }, n.get = function(t, e, i) {
        return e = e || {}, i = i || {}, _.extend(e, r), _.extend(e, i), o[t](e)
    }, n.add = function(t, e) {
        if (!t) return "";
        var i, n = _.uniqueId("jst_");
        return _.isString(t) || (i = $(t).get(0)), i && (n = i.id || n, t = i.value || i.innerText, e || $(i).remove()), o[n] = _.template(t), n
    }, n.render = function(t, e, i, r) {
        return t = $(t).get(0), t && (t.innerHTML = n.get(e, i, r)), this
    }, n
}), define("viperjs/widget/ajax/loader.js", [], function(t, e, i) {
    var n = i.exports,
        r = t("widget/ajax/loader/style.js"),
        o = t("widget/ajax/loader/html.js"),
        s = t("widget/ajax/loader/script.js");
    n.loadScript = function(t, e) {
        return new s(e).load(t), this
    }, n.queueScript = function(t, e) {
        return new s(e).queue(t), this
    }, n.loadStyle = function(t, e) {
        return new r(e).load(t), this
    }, n.queueStyle = function(t, e) {
        return new r(e).queue(t), this
    }, n.loadHtml = function(t, e) {
        return new o(e).load(t), this
    }
}), define("viperjs/widget/template/template_item.js", [], function() {
    var t = function(t, e, i) {
        var n = [];
        if (!t || !t.length || !e) return n;
        i = i || _o;
        var r = t.length,
            o = parseInt(i.offset) || 0,
            s = Math.min(r, o + (parseInt(i.limit) || r)),
            a = {
                total: t.length,
                range: [o, s]
            };
        _.extend(a, i);
        for (var l, c = o; s > c; c++) a.index = c, a.data = t[c], l = new e(a), n.push(l);
        return n
    };
    return t
}), define("viperjs/widget/ajax/loader/style.js", [], function(t) {
    var e = t("./loader.js"),
        i = t("el"),
        n = e.create();
    return _proStyleLoader = n.prototype, _proStyleLoader.__getRequest = function() {
        return i.create("link")
    }, _proStyleLoader.__doRequest = function(t) {
        t.href = this.__url, document.head.appendChild(t)
    }, n
}), define("viperjs/widget/ajax/loader/html.js", [], function(t) {
    var e = t("./loader.js"),
        i = t("el"),
        n = e.create();
    return _proHtmlLoader = n.prototype, _proHtmlLoader.__getRequest = function() {
        var t = i.create("iframe");
        return t.style.display = "none", t
    }, _proHtmlLoader.__onError = function(t) {
        var e = (this.__getLoadData(this.__url) || _o).request;
        this.__doCallback("onerror", t), $(e).remove()
    }, _proHtmlLoader.__onLoaded = function() {
        var t = null,
            e = (this.__getLoadData(this.__url) || _o).request;
        try {
            t = e.contentWindow.document.body
        } catch (i) {}
        this.__doCallback("onloaded", t), $(e).remove()
    }, n
}), define("viperjs/widget/ajax/loader/script.js", [], function(t) {
    var e = t("./loader.js"),
        i = t("el"),
        n = e.create();
    return _proScriptLoader = n.prototype, _proScriptLoader.__reset = function(t) {
        this.__async = t.async, this.__charset = t.charset, this.__qopt.async = !1, this.__qopt.charset = this.__charset
    }, _proScriptLoader.__getRequest = function() {
        var t = i.create("script");
        return null != this.__async && (t.async = !!this.__async), null != this.__charset && (t.charset = this.__charset), t
    }, _proScriptLoader.__clearRequest = function(t) {
        $(t).remove()
    }, n
}), define("viperjs/widget/ajax/loader/loader.js", [], function(t) {
    var e = t("event"),
        i = t("util"),
        n = 6e4,
        r = e.create(),
        o = r.prototype;
    return o.init = function(t) {
        this.supInit(t), this.__qopt = {
            onerror: this.__onQueueError.bind(this),
            onloaded: this.__onQueueLoaded.bind(this)
        }, this.constructor.__cache || (this.constructor.__cache = {
            loaded: {}
        }), this.__reset(t)
    }, o.__reset = function(t) {
        this.__version = t.version, this.__timeout = t.timeout, this.__qopt.version = this.__version, this.__qopt.timeout = this.__timeout
    }, o.__delLoadData = function(t) {
        delete this.constructor.__cache[t]
    }, o.__getLoadData = function(t) {
        return this.constructor.__cache[t]
    }, o.__setLoadData = function(t, e) {
        this.constructor.__cache[t] = e
    }, o.__getRequest = _f, o.__clearRequest = function(t) {
        $(t).off()
    }, o.__doRequest = function(t) {
        t.src = this.__url, document.head.appendChild(t)
    }, o.__doClear = function() {
        var t = this.__getLoadData(this.__url);
        t && (window.clearTimeout(t.timer), this.__clearRequest(t.request), delete t.bind, delete t.timer, delete t.request, this.__delLoadData(this.__url), this.__getLoadData("loaded")[this.__url] = !0)
    }, o.__doCallback = function(t) {
        var e = this.__getLoadData(this.__url);
        if (e) {
            var i = e.bind;
            if (this.__doClear(), i && i.length > 0)
                for (var n; i.length;) {
                    n = i.shift();
                    try {
                        n.trigger(t, arguments[1])
                    } catch (r) {
                        console.error(r.message), console.error(r.stack)
                    }
                }
        }
    }, o.__onError = function(t) {
        this.__doCallback("onerror", t)
    }, o.__onLoaded = function() {
        this.__doCallback("onloaded")
    }, o.__doLoadQueue = function(t) {
        new this.constructor(this.__qopt).load(t)
    }, o.__onQueueCheck = function(t) {
        var e = this.__getLoadData(this.__key);
        e && (t && e.error++, e.loaded++, e.loaded < e.total || (this.__delLoadData(this.__key), this.trigger(e.error > 0 ? "onerror" : "onloaded")))
    }, o.__onQueueError = function() {
        this.__onQueueCheck(!0)
    }, o.__onQueueLoaded = function() {
        this.__onQueueCheck()
    }, o.load = function(t) {
        if (t = i.absolute(t), !t) return this.trigger("onerror", {
            code: 10001,
            message: "请指定要载入的资源地址！"
        }), this;
        if (this.__url = t, this.__version && (this.__url += (0 > this.__url.indexOf("?") ? "?" : "&") + this.__version), this.__getLoadData("loaded")[this.__url]) {
            try {
                this.trigger("onloaded")
            } catch (e) {
                console.error(e.message), console.error(e.stack)
            }
            return this
        }
        var r, o = this.__getLoadData(this.__url);
        return o ? (o.bind.unshift(this), o.timer = window.clearTimeout(o.timer)) : (r = this.__getRequest(), o = {
            request: r,
            bind: [this]
        }, this.__setLoadData(this.__url, o), $(r).on("load", this.__onLoaded.bind(this)), $(r).on("error", this.__onError.bind(this, {
            code: "code:errorsev",
            message: "无法加载指定资源文件[" + this.__url + "]！"
        }))), 0 != this.__timeout && (o.timer = window.setTimeout(this.__onError.bind(this, {
            code: "code:timeout",
            message: "指定资源文件[" + this.__url + "]载入超时！"
        }), this.__timeout || n)), r && this.__doRequest(r), this.trigger("onloading"), this
    }, o.queue = function(t) {
        if (!t || !t.length) return this.trigger("onerror", {
            code: 10001,
            message: "请指定要载入的资源队列！"
        }), this;
        this.__key = "ld-" + +new Date;
        var e = {
            error: 0,
            loaded: 0,
            total: t.length
        };
        this.__setLoadData(this.__key, e);
        for (var i = 0, n = t.length; n > i; i++) t[i] ? this.__doLoadQueue(t[i]) : e.total--;
        return this.trigger("onloading"), this
    }, r
}), define("app/data/local.js", [], function(t, e, i) {
    "use strict";
    var n = i.exports,
        r = t("widget/viperdb/viperdb");
    r.addCollection("welcome"), r.addCollection("history"), r.addCollection("preference"), n.getProgress = function(t, e) {
        return r.history.query({
            id: t,
            revision: e
        })[0]
    }, n.setProgress = function(t) {
        r.history.update(_.pick(t, "id", "revision"), {
            $set: _.pick(t, "position")
        }, !0)
    }, n.welcome = function(t) {
        return void 0 !== t ? (r.welcome.findOne() || r.welcome.insert({
            welcome: 1
        }), void 0) : r.welcome.findOne()
    }, n.prefer = function(t) {
        if (void 0 !== t) return r.preference.remove(), r.preference.insert({
            preference: t
        }), void 0;
        var e = r.preference.findOne() || {
            preference: "horizontal"
        };
        return e.preference
    }
}), define("app/data/remote.js", [], function(t, e, i) {
    "use strict";

    function n() {
        if (Date.prototype.toISOString) {
            var t = new Date,
                e = new Date(Number(t) - 6e4 * t.getTimezoneOffset()),
                i = e.toISOString();
            return i.substr(0, i.length - 1)
        }
        var t = new Date;
        return "{0}-{1}-{2}T{3}:{4}:{5}".format(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds())
    }

    function r(t) {
        return '["' + t + '", "", ""]'
    }

    function o(t, e) {
        for (var i = 0; t.length > i; i++)
            if (t[i] != e[i]) return t[i] - e[i];
        return 0
    }

    function s(t, e) {
        return [t, "" + e[3], "" + e[0], "" + e[1], "" + e[2]]
    }

    function a(t, e, i) {
        var n = u[t];
        return n || (n = {}, u[t] = n), i ? (n[e] = i, void 0) : n[e]
    }
    t("ext/json2xml.js"), t("ext/xml2json.js"), t("./bson"), t("widget/jquery_plugin/jquery.cookie.js");
    var l = i.exports,
        c = t("ext/util"),
        u = {},
        h = c.uuid,
        d = "2.4.0.25805",
        f = "2.0",
        p = "WebReader 1.0",
        g = "WebReader",
        m = 1,
        v = [],
        y = {};
    l.getChaptersWithNotes = function(t) {
        var e = "/sync/duokan/chapter_list",
            i = {
                user_id: $.cookie("user_id"),
                device_id: $.cookie("device_id"),
                app_id: $.cookie("app_id"),
                token: $.cookie("token"),
                book_id: t,
                client_build: p
            };
        return $.get(e, i, function(t) {
            if (t = JSON.parse(t), 0 === t.code && t.data) {
                var e = t.data;
                m = e.version, e.comment && $.each(e.comment, function(t, e) {
                    y[e] || (y[e] = {}), y[e].comment = !0
                }), e.bookmark && $.each(e.bookmark, function(t, e) {
                    y[e] || (y[e] = {}), y[e].bookmark = !0
                })
            }
        })
    }, l.chapterHasNote = function(t, e) {
        return y[t] && y[t][e]
    }, l.getBookDetail = function(t) {
        var e = $.Deferred(),
            i = a("detail", t);
        return i ? (window.setTimeout(function() {
            e.resolve(i)
        }, 0), e.promise()) : ($.ajax("/store/v0/web/book/" + t).done(function(n) {
            0 === n.result && n.book ? (i = c.formatBook(n.book), e.resolve(i), a("detail", t, i)) : (seajs.log("get book info faild"), e.resolve({}))
        }).fail(function() {
            e.resolve({})
        }), e.promise())
    }, l.getBookInfo = function(t, e, i) {
        var n = $.Deferred(),
            r = a("info", t + e);
        if (r) return window.setTimeout(function() {
            n.resolve(r)
        }, 0), n.promise();
        var o = "/book_info/" + t + "/" + e;
        return console.log("revision", i), i && "none" !== i && (o = o + "/" + i), $.getBSON(o + "?" + (new Date).getTime(), function(i) {
            n.resolve(i), a("info", t + e, i)
        }), n.promise()
    }, l.getPage = function(t, e) {
        var i = $.Deferred(),
            n = a("page", t);
        return n ? (window.setTimeout(function() {
            i.resolve(n)
        }, 0), i.promise()) : ($.getBSON("/page/" + e + "/" + t, function(e) {
            $.getBSONP(e.url, function(e) {
                i.resolve(e), a("page", t, e)
            }, function() {
                i.resolve(!1)
            })
        }, function() {
            i.resolve(!1)
        }), i.promise())
    }, l.getProgress = function(t) {
        var e = $.Deferred(),
            i = {
                ts: +new Date,
                bookids: t
            };
        return _.extend(i, c.getInfo()), $.get("/sync/duokan/progress", i, function(t) {
            t = JSON.parse(xml2json($.parseXML(t), ""));
            var i;
            if (t.result) e.fail();
            else {
                var n = t.Progress.BookInfo.ReadingData.ReadingDataItem.RefPos;
                i = [parseInt(n.ChapterIndex, 10), parseInt(n.ParaIndex, 10), parseInt(n.AtomIndex, 10), parseInt(n.Offset, 10)], e.resolve(i)
            }
        }), e.promise()
    }, String.prototype.format = function() {
        for (var t = this, e = 0; arguments.length > e; e++) {
            var i = RegExp("\\{" + e + "\\}", "gi");
            t = t.replace(i, arguments[e])
        }
        return t
    }, l.timestamp = n, l.dateFromString = function(t) {
        var e = new Date(t),
            i = new Date(Number(e) + 6e4 * e.getTimezoneOffset());
        return i
    }, l.setProgroess = function(t, e, i, r) {
        var o = {
                BookInfo: {
                    Version: "2.0",
                    BookID: t,
                    BookRevision: e,
                    KernelVersion: d,
                    DeviceID: c.getInfo().device_id,
                    ReadingData: {
                        ReadingDataItem: {
                            Type: "PROGRESS",
                            DataID: "0",
                            Color: "",
                            Tag: "",
                            CreateTime: n(),
                            LastModifyTime: n(),
                            RefContent: "",
                            RefPos: {
                                ChapterID: r,
                                Offset: i[3],
                                ChapterIndex: i[0],
                                ParaIndex: i[1],
                                AtomIndex: i[2]
                            }
                        }
                    }
                }
            },
            s = json2xml(o, ""),
            a = {
                bookid: t,
                data: s,
                version: "1.1"
            };
        return _.extend(a, c.getInfo()), $.post("/sync/duokan/progress", a, function(t) {
            t = JSON.parse(xml2json($.parseXML(t), "")), console.log("sync response: ", t)
        })
    }, l.getNotes = function(t, e) {
        function i(t) {
            var i = [];
            return $.each(t, function(t, n) {
                if ("comment" == e && "COMMENT" === n.Type) {
                    var r = _.clone(n.BeginRefPos).splice(2),
                        s = _.clone(n.EndRefPos).splice(2);
                    0 > o(r, d) && o(s, c) > 0 && i.push(n)
                } else if ("bookmark" == e && "BOOKMARK" == n.Type) {
                    var a = _.clone(n.RefPos).splice(2);
                    0 > o(a, d) && o(a, c) >= 0 && i.push(n)
                } else console.log("Error! note type mismatch")
            }), i
        }
        t--;
        var n = "/sync/duokan/chapter_note",
            s = window.reader.getBook(),
            a = s.typo.book_id,
            l = $.Deferred(),
            c = _.clone(s.typo.pages[t].position);
        c.splice(3);
        var u = c[0],
            h = 1e10,
            d = [h, h, h];
        s.typo.pages[t + 1] && (d = _.clone(s.typo.pages[t + 1].position), d.splice(3));
        var f = {
            user_id: $.cookie("user_id"),
            device_id: $.cookie("device_id"),
            app_id: $.cookie("app_id"),
            token: $.cookie("token"),
            book_id: a,
            start_index: r(u),
            end_index: r(u + 1),
            type: e,
            offset: 0,
            count: 1e3
        };
        if (v[u] && v[u][e]) l.resolve(i(v[u][e]));
        else {
            if (!this.chapterHasNote(u, e)) return l.resolve([]), l.promise();
            $.get(n, f, function(t) {
                if (t = JSON.parse(t), 0 === t.code && t.data) {
                    m = t.data.version, v[u] || (v[u] = {}), v[u][e] = t.data.items;
                    var n = i(t.data.items);
                    l.resolve(n)
                }
            })
        }
        return l.promise()
    }, l.uploadNotes = function(t) {
        var e = $.Deferred(),
            i = "/sync/duokan/note_j",
            r = window.reader.getBook(),
            o = r.typo.book_id,
            a = {
                "abstract": {
                    KernelVersion: d,
                    SpecVersion: f,
                    Revision: r.typo.revision
                }
            };
        t.add && (a.updated = [], $.each(t.add, function(t, e) {
            "bookmark" == e.type ? a.updated.push({
                CreateTime: n(),
                LastModifyTime: n(),
                RefPos: s(e.cid, e.ref_pos),
                DataID: e.id,
                RefContent: e.ref_content,
                Type: "BOOKMARK"
            }) : "comment" == e.type && a.updated.push({
                CreateTime: n(),
                LastModifyTime: n(),
                BeginRefPos: s(e.cid, e.begin_pos),
                EndRefPos: s(e.cid, e.end_pos),
                Content: e.content,
                DataID: e.id,
                RefContent: e.ref_content,
                Type: "COMMENT"
            });
            var i = -1;
            e.ref_pos ? i = e.ref_pos[0] : e.begin_pos && (i = e.begin_pos[0]), i >= 0 && v[i] && delete v[i][e.type], y[i] || (y[i] = {}), y[i][e.type] = !0
        })), t["delete"] && (a.deleted = [], $.each(t["delete"], function(t, e) {
            a.deleted.push(e.id);
            var i = -1;
            e.ref_pos ? i = e.ref_pos[0] : e.begin_pos && (i = e.begin_pos[0]), i >= 0 && v[i] && delete v[i][e.type]
        }));
        var l = {
            user_id: $.cookie("user_id"),
            device_id: $.cookie("device_id"),
            app_id: $.cookie("app_id"),
            token: $.cookie("token"),
            book_id: o,
            version: "" + m,
            book_name: r.typo.title,
            data: JSON.stringify(a),
            device_name: g,
            client_build: p
        };
        return console.log("upload note data: ", l), $.post(i, l, function(t) {
            t = JSON.parse(t), console.log("upload note response: ", t), t && t.data ? (m = t.data.version, e.resolve()) : e.reject()
        }.bind(this)), e.promise()
    }, l.uploadBookmarkAtPage = function(t, e) {
        t--;
        var i = window.reader.getBook(),
            n = i.typo.pages[t].position,
            r = i.typo.chapters[n[0]].cid,
            o = [{
                id: h(),
                cid: r,
                ref_pos: n,
                ref_content: e,
                type: "bookmark"
            }];
        return l.uploadNotes({
            add: o
        })
    }, l.deleteBookmarkAtPage = function(t) {
        l.uploadNotes({
            "delete": [t]
        })
    }, l.getAllNotes = function(t, e, i) {
        var n = "/sync/duokan/note_j_rw",
            r = window.reader.getBook(),
            o = r.typo.book_id,
            s = {
                user_id: $.cookie("user_id"),
                device_id: $.cookie("device_id"),
                app_id: $.cookie("app_id"),
                token: $.cookie("token"),
                book_id: o,
                type: t,
                offset: e,
                count: i,
                client_build: p
            },
            a = new $.Deferred;
        return $.get(n, s, function(t) {
            t = JSON.parse(t), t && 0 === t.code && t.data ? a.resolve(t.data) : (a.resolve({
                items: [],
                more: !1
            }), a.fail(t.code, t.message))
        }), a.promise()
    }, _.extend(l, t("./remote/coupon")), window.remote = l, window.globalCache = u
}), define("viperjs/widget/viperdb/viperdb.js", [], function(t) {
    "use strict";
    t("core");
    var e = t("gallery/store/1.3.5/store"),
        i = t("event"),
        n = t("../../base/config").browser,
        r = .1,
        o = "viper_database",
        s = ["insert", "remove", "query", "findOne", "update", "save", "addCollection", "removeCollection"],
        a = null,
        l = function() {
            a && a.__resetData()
        },
        c = function() {
            a && e.set(o, a.__data)
        },
        u = function() {
            var t = 0;
            return function() {
                return (new Date).getTime() + "" + t++
            }
        }(),
        h = function(t) {
            return JSON.parse(JSON.stringify(t))
        },
        d = function() {
            return !n.webkit || !n.gecko || !n.trident1
        },
        f = i.create(),
        p = f.prototype;
    return p.init = function(t) {
        this.supInit.apply(this, arguments), this.__resetData(t.data), this.__info = t.info
    }, p.__destroy = function() {
        this.__supDestroy();
        var t = this.__info.parent,
            e = this.__info.name;
        this.__data = {
            docs: [],
            collections: {}
        }, delete this.__info, t && (delete t[e], delete t.__data.collections[e]), c()
    }, p.__resetData = function(t) {
        t || (t = e.get(o) || {
            docs: [],
            collections: {}
        }), this.__data = t, _.each(this.__data.collections, function(t, e) {
            this[e] ? this[e].__resetData(t) : this[e] = new f({
                data: t,
                info: {
                    parent: this,
                    name: e
                }
            })
        }, this)
    }, p.__doFilter = function(t) {
        return t ? _.where(this.__data.docs, t) : this.__data.docs.slice()
    }, p.__removeDoc = function(t) {
        var e = _.indexOf(t, this.__data.docs);
        this.__data.docs.splice(e, 1)
    }, p.insert = function(t) {
        _.isArray(t) || (t = [t]), _.each(t, function(t) {
            t._id = u(), this.__data.docs.push(t)
        }, this), c()
    }, p.remove = function(t) {
        if (!t) return this.__data.docs = [], c(), void 0;
        var e = this.__doFilter(t);
        _.each(e, this.__removeDoc, this), c()
    }, p.query = function(t) {
        var e = this.__doFilter(t);
        return h(e)
    }, p.findOne = function(t) {
        var e = this.__doFilter(t);
        return e[0] ? h(e[0]) : void 0
    }, p.update = function() {
        var t = function(t) {
            var e = _.keys(t),
                i = _.filter(e, function(t) {
                    return "$" !== t.charAt(0)
                }),
                n = _.difference(e, i);
            return n = n.length ? _.omit(t, i) : {
                $replace: t
            }, i = _.extend.apply(_, _.values(n)), [i, n]
        };
        return function(e, i, n) {
            var r, o, s;
            o = t(i);
            var a = o[0],
                l = o[1];
            s = this.__doFilter(e), !s.length && n && (r = _.extend(e, a), r._id = u(), this.__data.docs.push(r), s = this.__doFilter(e)), _.each(s, function(t) {
                for (var e in l) switch (e) {
                    case "$replace":
                        o = _.indexOf(this.__data.docs, t), a._id = t._id, this.__data.docs[o] = a;
                        break;
                    case "$set":
                        _.extend(t, a);
                        break;
                    case "$unset":
                        o = _.indexOf(this.__data.docs, t), this.__data.docs[o] = _.omit(t, _.keys(l.$unset))
                }
            }, this), c()
        }
    }(), p.save = function(t) {
        var e;
        _.has(t, "_id") ? (e = _.findWhere(this.__data.docs, {
            _id: t._id
        }), _.extend(e, t)) : (t._id = u(), this.__data.docs.push(t))
    }, p.addCollection = function(t) {
        this[t] || (this.__data.collections[t] = {
            docs: [],
            collections: {}
        }, this[t] = new f({
            data: this.__data.collections[t],
            info: {
                parent: this,
                name: t
            }
        }), c())
    }, p.removeCollection = function(t) {
        this[t] && this[t].recycle()
    }, p.list = function() {
        return _.keys(this.__data.collections)
    }, d() ? window.addEventListener("storage", l) : (_.each(s, function(t) {
        p[t] = p[t].aop(function() {
            l()
        })
    }), window.setInterval(l, 5e3)), a = new f({
        data: e.get(o),
        info: {
            parent: null,
            name: "root"
        }
    }), a.addCollection("info"), a.info.findOne({
        version: r
    }) || (a.recycle(), a = new f({
        data: e.get(o),
        info: {
            parent: null,
            name: "root"
        }
    }), a.addCollection("info"), a.info.insert({
        version: r
    })), a
}), define("viperjs/gallery/store/1.3.5/store.js", [], function(t, e, i) {
    return function(t) {
        function e() {
            try {
                return l in t && t[l]
            } catch (e) {
                return !1
            }
        }

        function n(t) {
            return function() {
                var e = Array.prototype.slice.call(arguments, 0);
                e.unshift(o), u.appendChild(o), o.addBehavior("#default#userData"), o.load(l);
                var i = t.apply(s, e);
                return u.removeChild(o), i
            }
        }

        function r(t) {
            return t.replace(f, "___")
        }
        var o, s = {},
            a = t.document,
            l = "localStorage",
            c = "script";
        if (s.disabled = !1, s.set = function() {}, s.get = function() {}, s.remove = function() {}, s.clear = function() {}, s.transact = function(t, e, i) {
            var n = s.get(t);
            null == i && (i = e, e = null), n === void 0 && (n = e || {}), i(n), s.set(t, n)
        }, s.getAll = function() {}, s.forEach = function() {}, s.serialize = function(t) {
            return JSON.stringify(t)
        }, s.deserialize = function(t) {
            if ("string" != typeof t) return void 0;
            try {
                return JSON.parse(t)
            } catch (e) {
                return t || void 0
            }
        }, e()) o = t[l], s.set = function(t, e) {
            return void 0 === e ? s.remove(t) : (o.setItem(t, s.serialize(e)), e)
        }, s.get = function(t) {
            return s.deserialize(o.getItem(t))
        }, s.remove = function(t) {
            o.removeItem(t)
        }, s.clear = function() {
            o.clear()
        }, s.getAll = function() {
            var t = {};
            return s.forEach(function(e, i) {
                t[e] = i
            }), t
        }, s.forEach = function(t) {
            for (var e = 0; o.length > e; e++) {
                var i = o.key(e);
                t(i, s.get(i))
            }
        };
        else if (a.documentElement.addBehavior) {
            var u, h;
            try {
                h = new ActiveXObject("htmlfile"), h.open(), h.write("<" + c + ">document.w=window</" + c + '><iframe src="/favicon.ico"></iframe>'), h.close(), u = h.w.frames[0].document, o = u.createElement("div")
            } catch (d) {
                o = a.createElement("div"), u = a.body
            }
            var f = RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
            s.set = n(function(t, e, i) {
                return e = r(e), void 0 === i ? s.remove(e) : (t.setAttribute(e, s.serialize(i)), t.save(l), i)
            }), s.get = n(function(t, e) {
                return e = r(e), s.deserialize(t.getAttribute(e))
            }), s.remove = n(function(t, e) {
                e = r(e), t.removeAttribute(e), t.save(l)
            }), s.clear = n(function(t) {
                var e = t.XMLDocument.documentElement.attributes;
                t.load(l);
                for (var i, n = 0; i = e[n]; n++) t.removeAttribute(i.name);
                t.save(l)
            }), s.getAll = function() {
                var t = {};
                return s.forEach(function(e, i) {
                    t[e] = i
                }), t
            }, s.forEach = n(function(t, e) {
                for (var i, n = t.XMLDocument.documentElement.attributes, r = 0; i = n[r]; ++r) e(i.name, s.deserialize(t.getAttribute(i.name)))
            })
        }
        try {
            var p = "__storejs__";
            s.set(p, p), s.get(p) != p && (s.disabled = !0), s.remove(p)
        } catch (d) {
            s.disabled = !0
        }
        s.enabled = !s.disabled, i !== void 0 && i.exports ? i.exports = s : "function" == typeof define && define.amd ? define(s) : t.store = s
    }(this.window || global), window.store
}), define("app/data/bson.js", [], function(t) {
    "use strict";
    t("ext/jquery.jsonp.js"), t("ext/binary-parser.js"), t("ext/jquery.base64.js"), t("ext/dkbson.js");
    var e = {},
        i = 5e3,
        n = function(t, e, n) {
            var e = e || function() {},
                n = n || function() {},
                r = !1,
                o = setTimeout(function() {
                    n && (r = !0, n())
                }, i);
            return $.ajax({
                url: t,
                context: document.body,
                success: function(t) {
                    r || (clearTimeout(o), e(t))
                },
                error: function() {
                    r || (clearTimeout(o), n())
                }
            })
        };
    $.getBSONSetup = function(t) {
        _.extend(e, t)
    }, $.getBSON = function(t, i, r) {
        return n("/reader" + t, function(t) {
            var n = dkbson.decode(t);
            n = e.dataFilter(n), n && i(n)
        }, r)
    }, $.getBSONP = function(t, e, n) {
        var r;
        $.jsonp({
            url: t,
            cache: !0,
            callback: "duokan_page",
            success: function(t) {
                clearTimeout(r);
                var i = dkbson.decode(t);
                e(i)
            },
            timeout: i,
            error: n
        })
    }
}), define("viperjs/widget/jquery_plugin/jquery.cookie.js", [], function(t) {
    function e(t) {
        return t
    }

    function i(t) {
        return decodeURIComponent(t.replace(n, " "))
    }
    t("jquery");
    var n = /\+/g,
        r = $.cookie = function(t, n, o) {
            if (void 0 !== n) {
                if (o = $.extend({}, r.defaults, o), null === n && (o.expires = -1), "number" == typeof o.expires) {
                    var s = o.expires,
                        a = o.expires = new Date;
                    a.setDate(a.getDate() + s)
                }
                return n = r.json ? JSON.stringify(n) : n + "", document.cookie = [encodeURIComponent(t), "=", r.raw ? n : encodeURIComponent(n), o.expires ? "; expires=" + o.expires.toUTCString() : "", o.path ? "; path=" + o.path : "", o.domain ? "; domain=" + o.domain : "", o.secure ? "; secure" : ""].join("")
            }
            for (var l, c = r.raw ? e : i, u = document.cookie.split("; "), h = 0; l = u[h] && u[h].split("="); h++)
                if (c(l.shift()) === t) {
                    var d = c(l.join("="));
                    return r.json ? JSON.parse(d) : d
                }
            return null
        };
    r.defaults = {}, $.removeCookie = function(t, e) {
        return null !== $.cookie(t) ? ($.cookie(t, null, e), !0) : !1
    }
}), define("app/extension/util.js", [], function(t, e) {
    "use strict";
    var i = e;
    i.getInfo = function(t) {
        var e = {
            device_id: $.cookie("device_id"),
            app_id: $.cookie("app_id")
        };
        return t || (e.token = $.cookie("token"), e.user_id = $.cookie("user_id")), e
    }, i.formatBook = function(t) {
        var e = t.score + 0;
        return t.url = "/book/" + t.sid, t.last_url = t.url, t.pay_url = "/pay/" + t.sid, t.avail_price = void 0 !== t.new_price ? t.new_price : t.price, t.book_cover = t.cover.replace("!.$", "!e"), t.author_name = (t.authors || t.editors || t.translators || "佚名").split("\n"), t.star_level = e >= 2 ? Math.floor(e + .5) : 0, t.score = +e.toFixed(1), t
    }, i.uuid = t("./util/uuid")
}), define("app/data/remote/coupon.js", [], function(t) {
    "use strict";

    function e(t) {
        var e = {
            type: "POST",
            dataType: "json"
        };
        return e.data = {
            coupon_type: 0,
            ts: +new Date
        }, _.extend(e.data, a.getInfo(), t), $.ajax("/store/v0/coupon/list", e)
    }

    function i() {
        var t = $.Deferred();
        return e({
            status: 0
        }).done(function(e) {
            var i = e.items || [];
            0 == e.result ? i = _.filter(i, function(t) {
                return +new Date(1e3 * t.expire_time) > +new Date && +new Date(1e3 * t.start_time) <= +new Date
            }) : (console.log("get coupon list failure", e), i = []), t.resolve(i)
        }), t.promise()
    }

    function n(t) {
        var e = $.Deferred();
        return i().done(function(i) {
            i = c(i, t), e.resolve(i)
        }), e.promise()
    }

    function r(t) {
        var e = _.pluck(t, "value");
        return e = _.map(e, function(t) {
            return +t
        }), _.union(e)
    }

    function o(t) {
        var e = $.Deferred();
        t && e.done(t), h = h || s.get(u);
        var n = h,
            o = +new Date,
            l = a.getInfo().user_id;
        return !n || o > n.t || l !== n.user_id ? (s.remove(u), n = {
            t: 0,
            user_id: l,
            list: []
        }, i().done(function(t) {
            n.list = r(t), n.t = o + d, e.resolve(n.list), s.set(u, n)
        })) : e.resolve(n.list), e.promise()
    }
    var s = t("gallery/store/1.3.5/store"),
        a = t("common"),
        l = 18e6,
        c = function(t, e) {
            if (e = e || 0, t = _.filter(t, function(t) {
                return +t.value >= e
            }), 0 == t.length) return t;
            var i = +new Date,
                n = _.groupBy(t, function(t) {
                    var e = new Date(t.expire_time).getTime();
                    return l > e - i ? "time" : "price"
                });
            return n.time = _.sortBy(n.time, function(t) {
                return 1e4 * +new Date(t.expire_time) + (+t.value - e)
            }), n.price = _.sortBy(n.price, function(t) {
                return 1e13 * (+t.value - e) + +new Date(t.expire_time)
            }), _.union(n.time, n.price)
        },
        u = "coupons",
        h = null,
        d = 864e5;
    return {
        coupon_list: e,
        coupon_active: i,
        couponActiveSorted: n,
        couponType: o
    }
}), define("app/extension/jquery.jsonp.js", [], function(t) {
    "use strict";
    t("jquery"),
    function(t) {
        function e() {}

        function i(t) {
            s = [t]
        }

        function n(t, e, i) {
            return t && t.apply(e.context || e, i)
        }

        function r(t) {
            return /\?/.test(t) ? "&" : "?"
        }

        function o(o) {
            function f(t) {
                J++ || (K(), W && (S[Y] = {
                    s: [t]
                }), O && (t = O.apply(o, [t])), n(I, o, [t, w, o]), n(R, o, [o, w]))
            }

            function D(t) {
                J++ || (K(), W && t != x && (S[Y] = t), n(z, o, [o, t]), n(R, o, [o, t]))
            }
            o = t.extend({}, j, o);
            var M, L, B, A, P, I = o.success,
                z = o.error,
                R = o.complete,
                O = o.dataFilter,
                F = o.callbackParameter,
                q = o.callback,
                H = o.cache,
                W = o.pageCache,
                X = o.charset,
                Y = o.url,
                V = o.data,
                U = o.timeout,
                J = 0,
                K = e;
            return T && T(function(t) {
                t.done(I).fail(z), I = t.resolve, z = t.reject
            }).promise(o), o.abort = function() {
                !J++ && K()
            }, n(o.beforeSend, o, [o]) === !1 || J ? o : (Y = Y || c, V = V ? "string" == typeof V ? V : t.param(V, o.traditional) : c, Y += V ? r(Y) + V : c, F && (Y += r(Y) + encodeURIComponent(F) + "=?"), !H && !W && (Y += r(Y) + "_" + (new Date).getTime() + "="), Y = Y.replace(/=\?(&|$)/, "=" + q + "$1"), W && (M = S[Y]) ? M.s ? f(M.s[0]) : D(M) : (k[q] = i, B = t(b)[0], B.id = d + E++, X && (B[l] = X), $ && 11.6 > $.version() ? (A = t(b)[0]).text = "document.getElementById('" + B.id + "')." + g + "()" : B[a] = a, N && (B.htmlFor = B.id, B.event = p), B[_] = B[g] = B[m] = function(t) {
                if (!B[v] || !/i/.test(B[v])) {
                    try {
                        B[p] && B[p]()
                    } catch (e) {}
                    t = s, s = 0, t ? f(t[0]) : D(u)
                }
            }, B.src = Y, K = function() {
                P && clearTimeout(P), B[m] = B[_] = B[g] = null, C[y](B), A && C[y](A)
            }, C[h](B, L = C.firstChild), A && C[h](A, L), P = U > 0 && setTimeout(function() {
                D(x)
            }, U)), o)
        }
        var s, a = "async",
            l = "charset",
            c = "",
            u = "error",
            h = "insertBefore",
            d = "_jqjsp",
            f = "on",
            p = f + "click",
            g = f + u,
            _ = f + "load",
            m = f + "readystatechange",
            v = "readyState",
            y = "removeChild",
            b = "<script>",
            w = "success",
            x = "timeout",
            k = window,
            T = t.Deferred,
            C = t("head")[0] || document.documentElement,
            S = {},
            E = 0,
            j = {
                callback: d,
                url: location.href
            },
            $ = k.opera,
            N = !!t("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;
        o.setup = function(e) {
            t.extend(j, e)
        }, t.jsonp = o
    }(jQuery)
}), BinaryParser = function(t, e) {
    this.bigEndian = t, this.allowExceptions = e
}, {
    p: BinaryParser.prototype
}) {
    with(p.encodeFloat = function(t, e, i) {
        var n, o, s, a, l, c = Math.pow(2, i - 1) - 1,
            u = -c + 1,
            h = c,
            d = u - e,
            f = isNaN(v = parseFloat(t)) || v == -1 / 0 || v == +1 / 0 ? v : 0,
            p = 0,
            g = 2 * c + 1 + e + 3,
            _ = Array(g),
            m = 0 > (v = 0 !== f ? 0 : v),
            v = Math.abs(v),
            y = Math.floor(v),
            b = v - y;
        for (n = g; n; _[--n] = 0);
        for (n = c + 2; y && n; _[--n] = y % 2, y = Math.floor(y / 2));
        for (n = c + 1; b > 0 && n;
            (_[++n] = ((b *= 2) >= 1) - 0) && --b);
        for (n = -1; g > ++n && !_[n];);
        if (_[(o = e - 1 + (n = (p = c + 1 - n) >= u && h >= p ? n + 1 : c + 1 - (p = u - 1))) + 1]) {
            if (!(s = _[o]))
                for (a = o + 2; !s && g > a; s = _[a++]);
            for (a = o + 1; s && --a >= 0;
                (_[a] = !_[a] - 0) && (s = 0));
        }
        for (n = 0 > n - 2 ? -1 : n - 3; g > ++n && !_[n];);
        for ((p = c + 1 - n) >= u && h >= p ? ++n : u > p && (p != c + 1 - g && d > p && this.warn("encodeFloat::float underflow"), n = c + 1 - (p = u - 1)), (y || 0 !== f) && (this.warn(y ? "encodeFloat::float overflow" : "encodeFloat::" + f), p = h + 1, n = c + 2, f == -1 / 0 ? m = 1 : isNaN(f) && (_[n] = 1)), v = Math.abs(p + c), a = i + 1, l = ""; --a; l = v % 2 + l, v = v >>= 1);
        for (v = 0, a = 0, n = (l = (m ? "1" : "0") + l + _.slice(n, n + e).join("")).length, r = []; n; v += (1 << a) * l.charAt(--n), 7 == a && (r[r.length] = String.fromCharCode(v), v = 0), a = (a + 1) % 8);
        return r[r.length] = v ? String.fromCharCode(v) : "", (this.bigEndian ? r.reverse() : r).join("")
    }, p.encodeInt = function(t, e) {
        var i = Math.pow(2, e),
            n = [];
        for ((t >= i || -(i >> 1) > t) && this.warn("encodeInt::overflow") && (t = 0), 0 > t && (t += i); t; n[n.length] = String.fromCharCode(t % 256), t = Math.floor(t / 256));
        for (e = -(-e >> 3) - n.length; e--; n[n.length] = "\0");
        return (this.bigEndian ? n.reverse() : n).join("")
    }, p.decodeFloat = function(t, e, i) {
        var n, r, o, s = ((s = new this.Buffer(this.bigEndian, t)).checkBuffer(e + i + 1), s),
            a = Math.pow(2, i - 1) - 1,
            l = s.readBits(e + i, 1),
            c = s.readBits(e, i),
            u = 0,
            h = 2,
            d = s.buffer.length + (-e >> 3) - 1;
        do
            for (n = s.buffer[++d], r = e % 8 || 8, o = 1 << r; o >>= 1; n & o && (u += 1 / h), h *= 2); while (e -= r);
        return c == (a << 1) + 1 ? u ? 0 / 0 : l ? -1 / 0 : +1 / 0 : (1 + -2 * l) * (c || u ? c ? Math.pow(2, c - a) * (1 + u) : Math.pow(2, -a + 1) * u : 0)
    }, p.decodeInt = function(t, e, i) {
        var n = new this.Buffer(this.bigEndian, t),
            r = n.readBits(0, e),
            o = Math.pow(2, e);
        return i && r >= o / 2 ? r - o : r
    }, {
        p: (p.Buffer = function(t, e) {
            this.bigEndian = t || 0, this.buffer = [], this.setBuffer(e)
        }).prototype
    }) p.readBits = function(t, e) {
        function i(t, e) {
            for (++e; --e; t = 1073741824 == (1073741824 & (t %= 2147483648)) ? 2 * t : 2 * (t - 1073741824) + 2147483647 + 1);
            return t
        }
        if (0 > t || 0 >= e) return 0;
        this.checkBuffer(t + e);
        for (var n, r = t % 8, o = this.buffer.length - (t >> 3) - 1, s = this.buffer.length + (-(t + e) >> 3), a = o - s, l = (this.buffer[o] >> r & (1 << (a ? 8 - r : e)) - 1) + (a && (n = (t + e) % 8) ? (this.buffer[s++] & (1 << n) - 1) << (a-- << 3) - r : 0); a; l += i(this.buffer[s++], (a-- << 3) - r));
        return l
    }, p.setBuffer = function(t) {
        if (t) {
            for (var e, i = e = t.length, n = this.buffer = Array(e); i; n[e - i] = t.charCodeAt(--i));
            this.bigEndian && n.reverse()
        }
    }, p.hasNeededBits = function(t) {
        return this.buffer.length >= -(-t >> 3)
    }, p.checkBuffer = function(t) {
        if (!this.hasNeededBits(t)) throw Error("checkBuffer::missing bytes")
    };
    p.warn = function(t) {
        if (this.allowExceptions) throw Error(t);
        return 1
    }, p.toSmall = function(t) {
        return this.decodeInt(t, 8, !0)
    }, p.fromSmall = function(t) {
        return this.encodeInt(t, 8, !0)
    }, p.toByte = function(t) {
        return this.decodeInt(t, 8, !1)
    }, p.fromByte = function(t) {
        return this.encodeInt(t, 8, !1)
    }, p.toShort = function(t) {
        return this.decodeInt(t, 16, !0)
    }, p.fromShort = function(t) {
        return this.encodeInt(t, 16, !0)
    }, p.toWord = function(t) {
        return this.decodeInt(t, 16, !1)
    }, p.fromWord = function(t) {
        return this.encodeInt(t, 16, !1)
    }, p.toInt = function(t) {
        return this.decodeInt(t, 32, !0)
    }, p.fromInt = function(t) {
        return this.encodeInt(t, 32, !0)
    }, p.toDWord = function(t) {
        return this.decodeInt(t, 32, !1)
    }, p.fromDWord = function(t) {
        return this.encodeInt(t, 32, !1)
    }, p.toFloat = function(t) {
        return this.decodeFloat(t, 23, 8)
    }, p.fromFloat = function(t) {
        return this.encodeFloat(t, 23, 8)
    }, p.toDouble = function(t) {
        return this.decodeFloat(t, 52, 11)
    }, p.fromDouble = function(t) {
        return this.encodeFloat(t, 52, 11)
    }
}
define("app/extension/jquery.base64.js", [], function(t) {
    "use strict";
    t("jquery"), jQuery.base64 = function() {
        function t(t, e) {
            var i = o.indexOf(t.charAt(e));
            if (-1 === i) throw "Cannot decode base64";
            return i
        }

        function e(e) {
            var i, n, o = 0,
                s = e.length,
                a = [];
            if (e += "", 0 === s) return e;
            if (0 !== s % 4) throw "Cannot decode base64";
            for (e.charAt(s - 1) === r && (o = 1, e.charAt(s - 2) === r && (o = 2), s -= 4), i = 0; s > i; i += 4) n = t(e, i) << 18 | t(e, i + 1) << 12 | t(e, i + 2) << 6 | t(e, i + 3), a.push(String.fromCharCode(n >> 16, 255 & n >> 8, 255 & n));
            switch (o) {
                case 1:
                    n = t(e, i) << 18 | t(e, i + 1) << 12 | t(e, i + 2) << 6, a.push(String.fromCharCode(n >> 16, 255 & n >> 8));
                    break;
                case 2:
                    n = t(e, i) << 18 | t(e, i + 1) << 12, a.push(String.fromCharCode(n >> 16))
            }
            return a.join("")
        }

        function i(t, e) {
            var i = t.charCodeAt(e);
            if (i > 255) throw "INVALID_CHARACTER_ERR: DOM Exception 5";
            return i
        }

        function n(t) {
            if (1 !== arguments.length) throw "SyntaxError: exactly one argument required";
            t += "";
            var e, n, s = [],
                a = t.length - t.length % 3;
            if (0 === t.length) return t;
            for (e = 0; a > e; e += 3) n = i(t, e) << 16 | i(t, e + 1) << 8 | i(t, e + 2), s.push(o.charAt(n >> 18)), s.push(o.charAt(63 & n >> 12)), s.push(o.charAt(63 & n >> 6)), s.push(o.charAt(63 & n));
            switch (t.length - a) {
                case 1:
                    n = i(t, e) << 16, s.push(o.charAt(n >> 18) + o.charAt(63 & n >> 12) + r + r);
                    break;
                case 2:
                    n = i(t, e) << 16 | i(t, e + 1) << 8, s.push(o.charAt(n >> 18) + o.charAt(63 & n >> 12) + o.charAt(63 & n >> 6) + r)
            }
            return s.join("")
        }
        var r = "=",
            o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            s = "1.0";
        return {
            decode: e,
            encode: n,
            VERSION: s
        }
    }(jQuery)
}), define("app/extension/dkbson.js", [], function(t) {
    "use strict";
    t("jquery"), window.dkbson = function() {
        function t(t) {
            return decodeURIComponent(escape(t))
        }

        function e(t, e) {
            for (var i = 1, n = t.charCodeAt(e), r = n, o = 128; 4 >= i && 0 != (o & n);) o >>= 1, i++, r = (r << 1) % 256;
            for (var s = 0; i - 1 > s; s++) r >>= 1;
            var a = r;
            for (s = 1; i > s; s++) a = (a << 8) + t.charCodeAt(e + s);
            return [e + i, a]
        }

        function i(i, n, r) {
            var o, s = new BinaryParser;
            if (i == l.TYPE_INT8) o = s.toSmall(n.substr(r, 1)), r++;
            else if (i == l.TYPE_INT16) o = s.toShort(n.substr(r, 2)), r += 2;
            else if (i == l.TYPE_INT32) o = s.toInt(n.substr(r, 4)), r += 4;
            else if (i == l.TYPE_INT64) o = s.decodeInt(n.substr(r, 8), 64, !0), r += 8;
            else if (i == l.TYPE_DOUBLE) o = s.toDouble(n.substr(r, 8)), r += 8;
            else if (i == l.TYPE_FLOAT) o = s.toFloat(n.substr(r, 4)), r += 4;
            else if (i == l.TYPE_STRING) {
                var a = e(n, r);
                r = a[0];
                var c = a[1];
                o = n.substr(r, c), o = t(o), r += c
            } else i == l.TYPE_NULL ? (o = null, r++) : i == l.TYPE_BOOL ? (o = 0 === n.charCodeAt(r) ? !1 : !0, r++) : i == l.TYPE_REAL16 ? (o = s.toShort(n.substr(r, 2)), o /= 100, r += 2) : i == l.TYPE_REAL24 ? (o = s.toInt(n.substr(r, 3) + "\0"), o /= 1e3, r += 3) : i == l.TYPE_REAL32 ? (o = s.toInt(n.substr(r, 4)), o /= 1e4, r += 4) : console.log("error: unsupported type:" + i.charCodeAt(0));
            return [r, o]
        }

        function n(t, o) {
            var s = [],
                a = e(t, o);
            o = a[0];
            for (var c = a[1], u = c; u-- > 0;) {
                var h, d, f = t.charCodeAt(o),
                    p = o + 1;
                f == l.TYPE_OBJECT ? (h = r(t, p), o = h[0], d = h[1]) : f == l.TYPE_ARRAY ? (h = n(t, p), o = h[0], d = h[1]) : (h = i(f, t, p), o = h[0], d = h[1]), s.push(d)
            }
            return [o, s]
        }

        function r(t, o) {
            var s = e(t, o);
            o = s[0];
            for (var a = s[1], c = {}, u = a; u-- > 0;) {
                var h, d = t.charCodeAt(o),
                    f = "",
                    p = "";
                for (h = o + 1;
                    "\0" != t.charAt(h); h++) f += t.charAt(h);
                h++;
                var g;
                d == l.TYPE_OBJECT ? (g = r(t, h), o = g[0], p = g[1]) : d == l.TYPE_ARRAY ? (g = n(t, h), o = g[0], p = g[1]) : (g = i(d, t, h), o = g[0], p = g[1]), c[f] = p
            }
            return [o, c]
        }

        function o() {
            for (var t = ["hello\0", "hello\0È\0", " hello\0world", "hello\0\0\0B", " world\0xxxhello\0\0\0B", "@world\0xxx\0hello\0\0\0B", "Aworld\0hello\0\0\0B", "Aworld\0\0hello\0\0\0B", "1world\0\0@hello\0\0", "Aworld\0@x\0 abc@hello\0\0", "world\0ú\0@hello\0\0", "world\0Ä \0@hello\0\0", "world\0¨a\0\0@hello\0\0"], e = 0; t.length > e; e++) {
                var i = r(t[e], 0);
                console.log("decoded: "), console.log(i[1])
            }
        }

        function s() {
            for (var t = [
                ["X", [2, 7e3]],
                ["", [1, 127]],
                ["Áp", [3, 7e4]],
                ["àjÏÀ", [4, 7e6]]
            ], i = 0; t.length > i; i++) {
                var n = t[i][0],
                    r = t[i][1],
                    o = e(n, 0);
                if (o[0] != r[0] || o[1] != r[1]) return console.log("case failed: " + r), void 0
            }
            console.log("decode_length: passed.")
        }
        var a = jQuery,
            l = {
                TYPE_INT8: 1,
                TYPE_INT16: 2,
                TYPE_INT32: 3,
                TYPE_INT64: 4,
                TYPE_FLOAT: 16,
                TYPE_DOUBLE: 17,
                TYPE_REAL16: 18,
                TYPE_REAL24: 19,
                TYPE_REAL32: 20,
                TYPE_STRING: 32,
                TYPE_BOOL: 48,
                TYPE_NULL: 49,
                TYPE_OBJECT: 64,
                TYPE_ARRAY: 65
            };
        return {
            decode: function(t) {
                var e = a.base64.decode(t),
                    i = r(e, 0);
                return i[1]
            },
            test: function() {
                s(), o()
            }
        }
    }()
}), define("app/extension/util/uuid.js", [], function() {
    "use strict";

    function t() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }

    function e() {
        return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
    }
    return e
}), define("app/common/common.js", [], function(t, e) {
    "use strict";
    var i = e,
        n = t("widget/cookie/cookie"),
        r = t("common/login_frame");
    i.isLogin = function() {
        return !!n.get("user_id")
    }, i.login = function() {
        return (new r).show()
    }, i.getInfo = function(t) {
        var e = {
            device_id: n.get("device_id"),
            app_id: n.get("app_id")
        };
        return t || (e.token = n.get("token"), e.user_id = n.get("user_id")), e
    },
    function() {
        var t = function() {
                var t = _.toArray(arguments);
                t.push({
                    domain: e()
                }), n.set.apply(this, t)
            },
            e = function() {
                var t = window.location.host;
                return t.indexOf("duokan.com") >= 0 ? "duokan.com" : t.split(":")[0]
            },
            i = n.get("device_id");
        if (null == i || "" == i) {
            for (var r = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM", o = "", s = 0; 12 > s; s++) o += r.charAt(Math.ceil(1e8 * Math.random()) % r.length);
            i = "D900" + o
        }
        t("device_id", i, 360), t("app_id", "web", 360)
    }(), i.getCookie = n.get, i.addBasicCookie = function() {
        var t = _.toArray(arguments);
        t.push({
            domain: i.getBasicHost()
        }), n.set.apply(this, t)
    }, i.delBasicCookie = function(t) {
        n.remove(t, {
            domain: i.getBasicHost()
        })
    }, i.getBasicHost = function() {
        var t = window.location.host;
        return t.indexOf("duokan.com") >= 0 ? "duokan.com" : t.split(":")[0]
    }
}), define("viperjs/widget/cookie/cookie.js", [], function(t, e) {
    t("widget/jquery_plugin/jquery.cookie.js"), e.set = function(t, e, i, n) {
        var r = {
            path: "/"
        };
        i > 0 && (r.expires = i), _.extend(r, n), $.cookie(t, e, r)
    }, e.get = function(t) {
        return $.cookie(t)
    }, e.remove = function(t, e) {
        var i = {
            path: "/"
        };
        _.extend(i, e), $.removeCookie(t, i)
    }
}), define("app/common/login_frame.js", [], function(t) {
    var e = t("widget/layer/window"),
        i = t("tpl"),
        n = t("util"),
        r = e.create(),
        o = r.prototype;
    return o.__initXGui = function() {
        this.__tpl = i.getNode("ntp-login-frame")
    }, o.initialize = function() {
        this.supInitialize.apply(this, arguments), this.__build(), this.hide()
    }, o.__getUrl = function(t, e) {
        var i = {
            login: t,
            followup: e || "http://" + location.host
        };
        return i.followup += "?app_id=web", "/dk_id/api/xiaomi_web_reg?" + n.object2query(i)
    }, o.__build = function() {
        var t = this.__getUrl(0, location.href);
        this.$(".j-xiaomi").attr("href", t)
    }, r
}), define("viperjs/widget/layer/window.js", [], function(t) {
    var e = t("core"),
        i = t("util"),
        n = t("../mask/mask");
    $$Layer = t("./layer");
    var r = e.create(),
        o = r.extend($$Layer);
    return o.init = function(t) {
        t = t || {}, t.parent = t.parent || document.body, this.supInit(t), this.__setMask(t.mask), this.__setAlign(t.align), $(window).bind("resize", this.__doPositionAlign.bind(this)), this.$el.on("click", ".j-close", this.__onClose.bind(this))
    }, o.__setAlign = function() {
        var t = /\s+/,
            e = {
                left: 0,
                center: 1,
                right: 2,
                auto: 3
            },
            i = {
                top: 0,
                middle: 1,
                bottom: 2,
                auto: 3
            };
        return function(n) {
            this.__align = (n || "").split(t);
            var r = e[this.__align[0]];
            null == r && (r = 1), this.__align[0] = r;
            var r = i[this.__align[1]];
            return null == r && (r = 1), this.__align[1] = r, this
        }
    }(), o.__setMask = function(t) {
        return t ? t instanceof n ? (this.__mask = t.hide(), void 0) : _u._$isFunction(t) ? (this.__mask = t(), void 0) : (_u._$isString(t) && (this.__mask = new $$mask), void 0) : void 0
    }, o.__onClose = function() {
        return this.fireEvent("onclose"), this.hide(), !1
    }, o.__doPositionAlign = function() {
        var t = [
                function() {
                    return 0
                },
                function(t, e, i) {
                    return Math.max(0, t[i] + e[i] / 2)
                },
                function(t, e, i) {
                    return t[i] + e[i]
                }
            ],
            e = function(t) {
                var e = $(t).get(0),
                    i = {
                        scrollTop: e.scrollTop,
                        scrollLeft: e.scrollLeft,
                        clientWidth: e.clientWidth,
                        clientHeight: e.clientHeight,
                        scrollWidth: e.scrollWidth,
                        scrollHeight: e.scrollHeight
                    };
                return i
            },
            n = ["left", "top"];
        return function() {
            var r = {},
                o = (this.__body.style, this.__parent == document.body ? i.getPageBox() : e(this.__parent)),
                s = {
                    left: o.scrollLeft,
                    top: o.scrollTop
                },
                a = {
                    left: o.clientWidth - this.__body.offsetWidth,
                    top: o.clientHeight - this.__body.offsetHeight
                };
            "fixed" == this.$el.css("position") && (s = {
                left: 0,
                top: 0
            }), n.forEach(function(e, i) {
                var n = t[this.__align[i]];
                n && (r[e] = n(s, a, e))
            }, this), this.setPosition(r)
        }
    }(), o.show = function() {
        return this.__mask = this.__mask || new n, this.__mask.show(), r._$supro.show.apply(this, arguments)
    }, o.hide = function() {
        return this.__mask && this.__mask.hide(), r._$supro.hide.apply(this, arguments)
    }, r
}), define("viperjs/widget/layer/layer.js", [], function(t, e, i) {
    var n = t("core"),
        r = t("base"),
        o = n.create(),
        s = o.extend(r);
    i.exports = o, s.__doPositionAlign = function() {
        return !1
    }, s.__destroy = function() {
        this.$el.detach()
    }, s.show = function() {
        return $(this.__body).css("visibility", "hidden"), o._$supro.show.apply(this, arguments), this.__doPositionAlign(), $(this.__body).css("visibility", ""), this
    }, s.hide = function() {
        o._$supro.hide.apply(this, arguments), !!this.options.destroyable && this.__destroy()
    }, s.setPosition = function(t) {
        $(this.__body).css(t)
    }
}), define("app/common/keypress.js", [], function(t) {
    "use strict";

    function e(t, e) {
        var i = t.split("+"),
            o = i[i.length - 1].toUpperCase();
        (i[1] ? i[0] : "").toUpperCase();
        var s = r[o] || [];
        $(document).on(n, _.throttle(function(t) {
            var i = t.target;
            if (i && /INPUT|TEXTAREA|SELECT|OPTION/.test(i.nodeName)) {
                var n = i.getAttribute("type") || i.type || !1;
                if (!n || !/submit|button|cancel/i.tp) return !0
            }
            t.which, t.ctrlKey || !1, t.shiftKey || !1;
            var r = {
                key: t.which,
                ctrl: t.ctrlKey || !1,
                shift: t.shiftKey || !1
            }; - 1 !== _.indexOf(s, r.key) && e && e(r), t.stopped || (t.preventDefault(), t.stopPropagation())
        }, 250))
    }
    t("jquery");
    var i = {};
    i.isopera = "opera" in window, i.isopera12 = i.isopera && "getUserMedia" in navigator;
    var n = i.isopera && !i.isopera12 ? "keypress" : "keydown",
        r = {
            ESC: [27]
        };
    return e
}), define("viperjs/widget/dragger/dragger.js", [], function(t) {
    var e = t("event");
    util = t("util");
    var i = e.create();
    return _proDragger = i.prototype, _proDragger.init = function(t) {
        this.supInit(t), this.__overflow = !!t.overflow, this.__body = $(t.body).get(0), this.__view = $(t.view).get(0) || util.getScrollViewPort(this.__body), this.__mbar = $(t.mbar).get(0) || this.__body, this.__direction = parseInt(t.direction) || 0, this.__doInitDomEvent([
            [$(document), "mouseup", this.__onDragEnd.bind(this)],
            [$(document), "mousemove", this.__onDragging.bind(this)],
            [$(this.__mbar), "mousedown", this.__onDragStart.bind(this)]
        ])
    }, _proDragger.__destroy = function() {
        this.__supDestroy(), delete this.__body, delete this.__mbar, delete this.__view
    }, _proDragger.__getMaxRange = function() {
        return {
            x: Math.max(this.__view.clientWidth, this.__view.scrollWidth) - this.__body.offsetWidth,
            y: Math.max(this.__view.clientHeight, this.__view.scrollHeight) - this.__body.offsetHeight
        }
    }, _proDragger.__onDragStart = function(t) {
        t.stopPropagation(), t.preventDefault(), this.__offset || (this.__offset = {
            x: t.pageX,
            y: t.pageY
        }, this.__maxbox = this.__getMaxRange())
    }, _proDragger.__onDragging = function(t) {
        if (this.__offset) {
            var e = {
                    x: t.pageX,
                    y: t.pageY
                },
                i = e.x - this.__offset.x,
                n = e.y - this.__offset.y,
                r = {
                    top: (parseInt($(this.__body).css("top")) || 0) + n,
                    left: (parseInt($(this.__body).css("left")) || 0) + i
                };
            this.__offset = e, this.setPosition(r)
        }
    }, _proDragger.__onDragEnd = function() {
        this.__offset && (delete this.__maxbox, delete this.__offset, this.trigger("ondragend", this.getPosition()))
    }, _proDragger.setPosition = function(t) {
        if (!this.__overflow) {
            var e = this.__maxbox || this.__getMaxRange();
            t.top = Math.min(e.y, Math.max(0, t.top)), t.left = Math.min(e.x, Math.max(0, t.left))
        }
        var i = this.__body.style;
        return (0 == this.__direction || 2 == this.__direction) && (i.top = t.top + "px"), (0 == this.__direction || 1 == this.__direction) && (i.left = t.left + "px"), this.trigger("onchange", t), this
    }, _proDragger.getPosition = function() {
        return {
            left: parseInt($(this.__body).css("left")) || 0,
            top: parseInt($(this.__body).css("top")) || 0
        }
    }, i
}),
function(t) {
    var e, i, n = "0.4.2",
        r = "hasOwnProperty",
        o = /[\.\/]/,
        s = "*",
        a = function() {},
        l = function(t, e) {
            return t - e
        },
        c = {
            n: {}
        },
        u = function(t, n) {
            t += "";
            var r, o = i,
                s = Array.prototype.slice.call(arguments, 2),
                a = u.listeners(t),
                c = 0,
                h = [],
                d = {},
                f = [],
                p = e;
            e = t, i = 0;
            for (var g = 0, _ = a.length; _ > g; g++) "zIndex" in a[g] && (h.push(a[g].zIndex), 0 > a[g].zIndex && (d[a[g].zIndex] = a[g]));
            for (h.sort(l); 0 > h[c];)
                if (r = d[h[c++]], f.push(r.apply(n, s)), i) return i = o, f;
            for (g = 0; _ > g; g++)
                if (r = a[g], "zIndex" in r)
                    if (r.zIndex == h[c]) {
                        if (f.push(r.apply(n, s)), i) break;
                        do
                            if (c++, r = d[h[c]], r && f.push(r.apply(n, s)), i) break;
                        while (r)
                    } else d[r.zIndex] = r;
            else if (f.push(r.apply(n, s)), i) break;
            return i = o, e = p, f.length ? f : null
        };
    u._events = c, u.listeners = function(t) {
        var e, i, n, r, a, l, u, h, d = t.split(o),
            f = c,
            p = [f],
            g = [];
        for (r = 0, a = d.length; a > r; r++) {
            for (h = [], l = 0, u = p.length; u > l; l++)
                for (f = p[l].n, i = [f[d[r]], f[s]], n = 2; n--;) e = i[n], e && (h.push(e), g = g.concat(e.f || []));
            p = h
        }
        return g
    }, u.on = function(t, e) {
        if (t += "", "function" != typeof e) return function() {};
        for (var i = t.split(o), n = c, r = 0, s = i.length; s > r; r++) n = n.n, n = n.hasOwnProperty(i[r]) && n[i[r]] || (n[i[r]] = {
            n: {}
        });
        for (n.f = n.f || [], r = 0, s = n.f.length; s > r; r++)
            if (n.f[r] == e) return a;
        return n.f.push(e),
            function(t) {
                +t == +t && (e.zIndex = +t)
            }
    }, u.f = function(t) {
        var e = [].slice.call(arguments, 1);
        return function() {
            u.apply(null, [t, null].concat(e).concat([].slice.call(arguments, 0)))
        }
    }, u.stop = function() {
        i = 1
    }, u.nt = function(t) {
        return t ? RegExp("(?:\\.|\\/|^)" + t + "(?:\\.|\\/|$)").test(e) : e
    }, u.nts = function() {
        return e.split(o)
    }, u.off = u.unbind = function(t, e) {
        if (!t) return u._events = c = {
            n: {}
        }, void 0;
        var i, n, a, l, h, d, f, p = t.split(o),
            g = [c];
        for (l = 0, h = p.length; h > l; l++)
            for (d = 0; g.length > d; d += a.length - 2) {
                if (a = [d, 1], i = g[d].n, p[l] != s) i[p[l]] && a.push(i[p[l]]);
                else
                    for (n in i) i[r](n) && a.push(i[n]);
                g.splice.apply(g, a)
            }
        for (l = 0, h = g.length; h > l; l++)
            for (i = g[l]; i.n;) {
                if (e) {
                    if (i.f) {
                        for (d = 0, f = i.f.length; f > d; d++)
                            if (i.f[d] == e) {
                                i.f.splice(d, 1);
                                break
                            }!i.f.length && delete i.f
                    }
                    for (n in i.n)
                        if (i.n[r](n) && i.n[n].f) {
                            var _ = i.n[n].f;
                            for (d = 0, f = _.length; f > d; d++)
                                if (_[d] == e) {
                                    _.splice(d, 1);
                                    break
                                }!_.length && delete i.n[n].f
                        }
                } else {
                    delete i.f;
                    for (n in i.n) i.n[r](n) && i.n[n].f && delete i.n[n].f
                }
                i = i.n
            }
    }, u.once = function(t, e) {
        var i = function() {
            return u.unbind(t, i), e.apply(this, arguments)
        };
        return u.on(t, i)
    }, u.version = n, u.toString = function() {
        return "You are running Eve " + n
    }, t.eve = u
}(this),
function(t, e) {
    e(t, t.eve)
}(this, function(t, e) {
    function i(t) {
        if (i.is(t, "function")) return b ? t() : e.on("raphael.DOMload", t);
        if (i.is(t, V)) return i._engine.create[$](i, t.splice(0, 3 + i.is(t[0], X))).add(t);
        var n = Array.prototype.slice.call(arguments, 0);
        if (i.is(n[n.length - 1], "function")) {
            var r = n.pop();
            return b ? r.call(i._engine.create[$](i, n)) : e.on("raphael.DOMload", function() {
                r.call(i._engine.create[$](i, n))
            })
        }
        return i._engine.create[$](i, arguments)
    }

    function n(t) {
        if (Object(t) !== t) return t;
        var e = new t.constructor;
        for (var i in t) t[C](i) && (e[i] = n(t[i]));
        return e
    }

    function r(t, e) {
        for (var i = 0, n = t.length; n > i; i++)
            if (t[i] === e) return t.push(t.splice(i, 1)[0])
    }

    function o(t, e, i) {
        function n() {
            var o = Array.prototype.slice.call(arguments, 0),
                s = o.join("␀"),
                a = n.cache = n.cache || {},
                l = n.count = n.count || [];
            return a[C](s) ? (r(l, s), i ? i(a[s]) : a[s]) : (l.length >= 1e3 && delete a[l.shift()], l.push(s), a[s] = t[$](e, o), i ? i(a[s]) : a[s])
        }
        return n
    }

    function s() {
        return this.hex
    }

    function a(t, e) {
        for (var i = [], n = 0, r = t.length; r - 2 * !e > n; n += 2) {
            var o = [{
                x: +t[n - 2],
                y: +t[n - 1]
            }, {
                x: +t[n],
                y: +t[n + 1]
            }, {
                x: +t[n + 2],
                y: +t[n + 3]
            }, {
                x: +t[n + 4],
                y: +t[n + 5]
            }];
            e ? n ? r - 4 == n ? o[3] = {
                x: +t[0],
                y: +t[1]
            } : r - 2 == n && (o[2] = {
                x: +t[0],
                y: +t[1]
            }, o[3] = {
                x: +t[2],
                y: +t[3]
            }) : o[0] = {
                x: +t[r - 2],
                y: +t[r - 1]
            } : r - 4 == n ? o[3] = o[2] : n || (o[0] = {
                x: +t[n],
                y: +t[n + 1]
            }), i.push(["C", (-o[0].x + 6 * o[1].x + o[2].x) / 6, (-o[0].y + 6 * o[1].y + o[2].y) / 6, (o[1].x + 6 * o[2].x - o[3].x) / 6, (o[1].y + 6 * o[2].y - o[3].y) / 6, o[2].x, o[2].y])
        }
        return i
    }

    function l(t, e, i, n, r) {
        var o = -3 * e + 9 * i - 9 * n + 3 * r,
            s = t * o + 6 * e - 12 * i + 6 * n;
        return t * s - 3 * e + 3 * i
    }

    function c(t, e, i, n, r, o, s, a, c) {
        null == c && (c = 1), c = c > 1 ? 1 : 0 > c ? 0 : c;
        for (var u = c / 2, h = 12, d = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816], f = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], p = 0, g = 0; h > g; g++) {
            var _ = u * d[g] + u,
                m = l(_, t, i, r, s),
                v = l(_, e, n, o, a),
                y = m * m + v * v;
            p += f[g] * R.sqrt(y)
        }
        return u * p
    }

    function u(t, e, i, n, r, o, s, a, l) {
        if (!(0 > l || l > c(t, e, i, n, r, o, s, a))) {
            var u, h = 1,
                d = h / 2,
                f = h - d,
                p = .01;
            for (u = c(t, e, i, n, r, o, s, a, f); q(u - l) > p;) d /= 2, f += (l > u ? 1 : -1) * d, u = c(t, e, i, n, r, o, s, a, f);
            return f
        }
    }

    function h(t, e, i, n, r, o, s, a) {
        if (!(O(t, i) < F(r, s) || F(t, i) > O(r, s) || O(e, n) < F(o, a) || F(e, n) > O(o, a))) {
            var l = (t * n - e * i) * (r - s) - (t - i) * (r * a - o * s),
                c = (t * n - e * i) * (o - a) - (e - n) * (r * a - o * s),
                u = (t - i) * (o - a) - (e - n) * (r - s);
            if (u) {
                var h = l / u,
                    d = c / u,
                    f = +h.toFixed(2),
                    p = +d.toFixed(2);
                if (!(+F(t, i).toFixed(2) > f || f > +O(t, i).toFixed(2) || +F(r, s).toFixed(2) > f || f > +O(r, s).toFixed(2) || +F(e, n).toFixed(2) > p || p > +O(e, n).toFixed(2) || +F(o, a).toFixed(2) > p || p > +O(o, a).toFixed(2))) return {
                    x: h,
                    y: d
                }
            }
        }
    }

    function d(t, e, n) {
        var r = i.bezierBBox(t),
            o = i.bezierBBox(e);
        if (!i.isBBoxIntersect(r, o)) return n ? 0 : [];
        for (var s = c.apply(0, t), a = c.apply(0, e), l = ~~ (s / 5), u = ~~ (a / 5), d = [], f = [], p = {}, g = n ? 0 : [], _ = 0; l + 1 > _; _++) {
            var m = i.findDotsAtSegment.apply(i, t.concat(_ / l));
            d.push({
                x: m.x,
                y: m.y,
                t: _ / l
            })
        }
        for (_ = 0; u + 1 > _; _++) m = i.findDotsAtSegment.apply(i, e.concat(_ / u)), f.push({
            x: m.x,
            y: m.y,
            t: _ / u
        });
        for (_ = 0; l > _; _++)
            for (var v = 0; u > v; v++) {
                var y = d[_],
                    b = d[_ + 1],
                    w = f[v],
                    x = f[v + 1],
                    k = .001 > q(b.x - y.x) ? "y" : "x",
                    T = .001 > q(x.x - w.x) ? "y" : "x",
                    C = h(y.x, y.y, b.x, b.y, w.x, w.y, x.x, x.y);
                if (C) {
                    if (p[C.x.toFixed(4)] == C.y.toFixed(4)) continue;
                    p[C.x.toFixed(4)] = C.y.toFixed(4);
                    var S = y.t + q((C[k] - y[k]) / (b[k] - y[k])) * (b.t - y.t),
                        E = w.t + q((C[T] - w[T]) / (x[T] - w[T])) * (x.t - w.t);
                    S >= 0 && 1 >= S && E >= 0 && 1 >= E && (n ? g++ : g.push({
                        x: C.x,
                        y: C.y,
                        t1: S,
                        t2: E
                    }))
                }
            }
        return g
    }

    function f(t, e, n) {
        t = i._path2curve(t), e = i._path2curve(e);
        for (var r, o, s, a, l, c, u, h, f, p, g = n ? 0 : [], _ = 0, m = t.length; m > _; _++) {
            var v = t[_];
            if ("M" == v[0]) r = l = v[1], o = c = v[2];
            else {
                "C" == v[0] ? (f = [r, o].concat(v.slice(1)), r = f[6], o = f[7]) : (f = [r, o, r, o, l, c, l, c], r = l, o = c);
                for (var y = 0, b = e.length; b > y; y++) {
                    var w = e[y];
                    if ("M" == w[0]) s = u = w[1], a = h = w[2];
                    else {
                        "C" == w[0] ? (p = [s, a].concat(w.slice(1)), s = p[6], a = p[7]) : (p = [s, a, s, a, u, h, u, h], s = u, a = h);
                        var x = d(f, p, n);
                        if (n) g += x;
                        else {
                            for (var k = 0, T = x.length; T > k; k++) x[k].segment1 = _, x[k].segment2 = y, x[k].bez1 = f, x[k].bez2 = p;
                            g = g.concat(x)
                        }
                    }
                }
            }
        }
        return g
    }

    function p(t, e, i, n, r, o) {
        null != t ? (this.a = +t, this.b = +e, this.c = +i, this.d = +n, this.e = +r, this.f = +o) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0)
    }

    function g() {
        return this.x + L + this.y + L + this.width + " × " + this.height
    }

    function _(t, e, i, n, r, o) {
        function s(t) {
            return ((h * t + u) * t + c) * t
        }

        function a(t, e) {
            var i = l(t, e);
            return ((p * i + f) * i + d) * i
        }

        function l(t, e) {
            var i, n, r, o, a, l;
            for (r = t, l = 0; 8 > l; l++) {
                if (o = s(r) - t, e > q(o)) return r;
                if (a = (3 * h * r + 2 * u) * r + c, 1e-6 > q(a)) break;
                r -= o / a
            }
            if (i = 0, n = 1, r = t, i > r) return i;
            if (r > n) return n;
            for (; n > i;) {
                if (o = s(r), e > q(o - t)) return r;
                t > o ? i = r : n = r, r = (n - i) / 2 + i
            }
            return r
        }
        var c = 3 * e,
            u = 3 * (n - e) - c,
            h = 1 - c - u,
            d = 3 * i,
            f = 3 * (r - i) - d,
            p = 1 - d - f;
        return a(t, 1 / (200 * o))
    }

    function m(t, e) {
        var i = [],
            n = {};
        if (this.ms = e, this.times = 1, t) {
            for (var r in t) t[C](r) && (n[Q(r)] = t[r], i.push(Q(r)));
            i.sort(he)
        }
        this.anim = n, this.top = i[i.length - 1], this.percents = i
    }

    function v(t, n, r, o, s, a) {
        r = Q(r);
        var l, c, u, h, d, f, g = t.ms,
            m = {},
            v = {},
            y = {};
        if (o)
            for (w = 0, k = li.length; k > w; w++) {
                var b = li[w];
                if (b.el.id == n.id && b.anim == t) {
                    b.percent != r ? (li.splice(w, 1), u = 1) : c = b, n.attr(b.totalOrigin);
                    break
                }
            } else o = +v;
        for (var w = 0, k = t.percents.length; k > w; w++) {
            if (t.percents[w] == r || t.percents[w] > o * t.top) {
                r = t.percents[w], d = t.percents[w - 1] || 0, g = g / t.top * (r - d), h = t.percents[w + 1], l = t.anim[r];
                break
            }
            o && n.attr(t.anim[t.percents[w]])
        }
        if (l) {
            if (c) c.initstatus = o, c.start = new Date - c.ms * o;
            else {
                for (var T in l)
                    if (l[C](T) && (ne[C](T) || n.paper.customAttributes[C](T))) switch (m[T] = n.attr(T), null == m[T] && (m[T] = ie[T]), v[T] = l[T], ne[T]) {
                        case X:
                            y[T] = (v[T] - m[T]) / g;
                            break;
                        case "colour":
                            m[T] = i.getRGB(m[T]);
                            var S = i.getRGB(v[T]);
                            y[T] = {
                                r: (S.r - m[T].r) / g,
                                g: (S.g - m[T].g) / g,
                                b: (S.b - m[T].b) / g
                            };
                            break;
                        case "path":
                            var E = Pe(m[T], v[T]),
                                j = E[1];
                            for (m[T] = E[0], y[T] = [], w = 0, k = m[T].length; k > w; w++) {
                                y[T][w] = [0];
                                for (var $ = 1, D = m[T][w].length; D > $; $++) y[T][w][$] = (j[w][$] - m[T][w][$]) / g
                            }
                            break;
                        case "transform":
                            var M = n._,
                                L = Fe(M[T], v[T]);
                            if (L)
                                for (m[T] = L.from, v[T] = L.to, y[T] = [], y[T].real = !0, w = 0, k = m[T].length; k > w; w++)
                                    for (y[T][w] = [m[T][w][0]], $ = 1, D = m[T][w].length; D > $; $++) y[T][w][$] = (v[T][w][$] - m[T][w][$]) / g;
                            else {
                                var P = n.matrix || new p,
                                    I = {
                                        _: {
                                            transform: M.transform
                                        },
                                        getBBox: function() {
                                            return n.getBBox(1)
                                        }
                                    };
                                m[T] = [P.a, P.b, P.c, P.d, P.e, P.f], Re(I, v[T]), v[T] = I._.transform, y[T] = [(I.matrix.a - P.a) / g, (I.matrix.b - P.b) / g, (I.matrix.c - P.c) / g, (I.matrix.d - P.d) / g, (I.matrix.e - P.e) / g, (I.matrix.f - P.f) / g]
                            }
                            break;
                        case "csv":
                            var z = B(l[T])[A](x),
                                R = B(m[T])[A](x);
                            if ("clip-rect" == T)
                                for (m[T] = R, y[T] = [], w = R.length; w--;) y[T][w] = (z[w] - m[T][w]) / g;
                            v[T] = z;
                            break;
                        default:
                            for (z = [][N](l[T]), R = [][N](m[T]), y[T] = [], w = n.paper.customAttributes[T].length; w--;) y[T][w] = ((z[w] || 0) - (R[w] || 0)) / g
                    }
                    var O = l.easing,
                        F = i.easing_formulas[O];
                if (!F)
                    if (F = B(O).match(G), F && 5 == F.length) {
                        var q = F;
                        F = function(t) {
                            return _(t, +q[1], +q[2], +q[3], +q[4], g)
                        }
                    } else F = fe;
                if (f = l.start || t.start || +new Date, b = {
                    anim: t,
                    percent: r,
                    timestamp: f,
                    start: f + (t.del || 0),
                    status: 0,
                    initstatus: o || 0,
                    stop: !1,
                    ms: g,
                    easing: F,
                    from: m,
                    diff: y,
                    to: v,
                    el: n,
                    callback: l.callback,
                    prev: d,
                    next: h,
                    repeat: a || t.times,
                    origin: n.attr(),
                    totalOrigin: s
                }, li.push(b), o && !c && !u && (b.stop = !0, b.start = new Date - g * o, 1 == li.length)) return ui();
                u && (b.start = new Date - b.ms * o), 1 == li.length && ci(ui)
            }
            e("raphael.anim.start." + n.id, n, t)
        }
    }

    function y(t) {
        for (var e = 0; li.length > e; e++) li[e].el.paper == t && li.splice(e--, 1)
    }
    i.version = "2.1.0", i.eve = e;
    var b, w, x = /[, ]+/,
        k = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        },
        T = /\{(\d+)\}/g,
        C = "hasOwnProperty",
        S = {
            doc: document,
            win: t
        },
        E = {
            was: Object.prototype[C].call(S.win, "Raphael"),
            is: S.win.Raphael
        },
        j = function() {
            this.ca = this.customAttributes = {}
        },
        $ = "apply",
        N = "concat",
        D = "ontouchstart" in S.win || S.win.DocumentTouch && S.doc instanceof DocumentTouch,
        M = "",
        L = " ",
        B = String,
        A = "split",
        P = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel" [A](L),
        I = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        z = B.prototype.toLowerCase,
        R = Math,
        O = R.max,
        F = R.min,
        q = R.abs,
        H = R.pow,
        W = R.PI,
        X = "number",
        Y = "string",
        V = "array",
        U = Object.prototype.toString,
        J = (i._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i, /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),
        K = {
            NaN: 1,
            Infinity: 1,
            "-Infinity": 1
        },
        G = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        Z = R.round,
        Q = parseFloat,
        te = parseInt,
        ee = B.prototype.toUpperCase,
        ie = i._availableAttrs = {
            "arrow-end": "none",
            "arrow-start": "none",
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            "letter-spacing": 0,
            opacity: 1,
            path: "M0,0",
            r: 0,
            rx: 0,
            ry: 0,
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            transform: "",
            width: 0,
            x: 0,
            y: 0
        },
        ne = i._availableAnimAttrs = {
            blur: X,
            "clip-rect": "csv",
            cx: X,
            cy: X,
            fill: "colour",
            "fill-opacity": X,
            "font-size": X,
            height: X,
            opacity: X,
            path: "path",
            r: X,
            rx: X,
            ry: X,
            stroke: "colour",
            "stroke-opacity": X,
            "stroke-width": X,
            transform: "transform",
            width: X,
            x: X,
            y: X
        },
        re = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
        oe = {
            hs: 1,
            rg: 1
        },
        se = /,?([achlmqrstvxz]),?/gi,
        ae = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
        le = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
        ce = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,
        ue = (i._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, {}),
        he = function(t, e) {
            return Q(t) - Q(e)
        },
        de = function() {},
        fe = function(t) {
            return t
        },
        pe = i._rectPath = function(t, e, i, n, r) {
            return r ? [
                ["M", t + r, e],
                ["l", i - 2 * r, 0],
                ["a", r, r, 0, 0, 1, r, r],
                ["l", 0, n - 2 * r],
                ["a", r, r, 0, 0, 1, -r, r],
                ["l", 2 * r - i, 0],
                ["a", r, r, 0, 0, 1, -r, -r],
                ["l", 0, 2 * r - n],
                ["a", r, r, 0, 0, 1, r, -r],
                ["z"]
            ] : [
                ["M", t, e],
                ["l", i, 0],
                ["l", 0, n],
                ["l", -i, 0],
                ["z"]
            ]
        },
        ge = function(t, e, i, n) {
            return null == n && (n = i), [
                ["M", t, e],
                ["m", 0, -n],
                ["a", i, n, 0, 1, 1, 0, 2 * n],
                ["a", i, n, 0, 1, 1, 0, -2 * n],
                ["z"]
            ]
        },
        _e = i._getPath = {
            path: function(t) {
                return t.attr("path")
            },
            circle: function(t) {
                var e = t.attrs;
                return ge(e.cx, e.cy, e.r)
            },
            ellipse: function(t) {
                var e = t.attrs;
                return ge(e.cx, e.cy, e.rx, e.ry)
            },
            rect: function(t) {
                var e = t.attrs;
                return pe(e.x, e.y, e.width, e.height, e.r)
            },
            image: function(t) {
                var e = t.attrs;
                return pe(e.x, e.y, e.width, e.height)
            },
            text: function(t) {
                var e = t._getBBox();
                return pe(e.x, e.y, e.width, e.height)
            },
            set: function(t) {
                var e = t._getBBox();
                return pe(e.x, e.y, e.width, e.height)
            }
        },
        me = i.mapPath = function(t, e) {
            if (!e) return t;
            var i, n, r, o, s, a, l;
            for (t = Pe(t), r = 0, s = t.length; s > r; r++)
                for (l = t[r], o = 1, a = l.length; a > o; o += 2) i = e.x(l[o], l[o + 1]), n = e.y(l[o], l[o + 1]), l[o] = i, l[o + 1] = n;
            return t
        };
    if (i._g = S, i.type = S.win.SVGAngle || S.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML", "VML" == i.type) {
        var ve, ye = S.doc.createElement("div");
        if (ye.innerHTML = '<v:shape adj="1"/>', ve = ye.firstChild, ve.style.behavior = "url(#default#VML)", !ve || "object" != typeof ve.adj) return i.type = M;
        ye = null
    }
    i.svg = !(i.vml = "VML" == i.type), i._Paper = j, i.fn = w = j.prototype = i.prototype, i._id = 0, i._oid = 0, i.is = function(t, e) {
        return e = z.call(e), "finite" == e ? !K[C](+t) : "array" == e ? t instanceof Array : "null" == e && null === t || e == typeof t && null !== t || "object" == e && t === Object(t) || "array" == e && Array.isArray && Array.isArray(t) || U.call(t).slice(8, -1).toLowerCase() == e
    }, i.angle = function(t, e, n, r, o, s) {
        if (null == o) {
            var a = t - n,
                l = e - r;
            return a || l ? (180 + 180 * R.atan2(-l, -a) / W + 360) % 360 : 0
        }
        return i.angle(t, e, o, s) - i.angle(n, r, o, s)
    }, i.rad = function(t) {
        return t % 360 * W / 180
    }, i.deg = function(t) {
        return 180 * t / W % 360
    }, i.snapTo = function(t, e, n) {
        if (n = i.is(n, "finite") ? n : 10, i.is(t, V)) {
            for (var r = t.length; r--;)
                if (n >= q(t[r] - e)) return t[r]
        } else {
            t = +t;
            var o = e % t;
            if (n > o) return e - o;
            if (o > t - n) return e - o + t
        }
        return e
    }, i.createUUID = function(t, e) {
        return function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t, e).toUpperCase()
        }
    }(/[xy]/g, function(t) {
        var e = 0 | 16 * R.random(),
            i = "x" == t ? e : 8 | 3 & e;
        return i.toString(16)
    }), i.setWindow = function(t) {
        e("raphael.setWindow", i, S.win, t), S.win = t, S.doc = S.win.document, i._engine.initWin && i._engine.initWin(S.win)
    };
    var be = function(t) {
            if (i.vml) {
                var e, n = /^\s+|\s+$/g;
                try {
                    var r = new ActiveXObject("htmlfile");
                    r.write("<body>"), r.close(), e = r.body
                } catch (s) {
                    e = createPopup().document.body
                }
                var a = e.createTextRange();
                be = o(function(t) {
                    try {
                        e.style.color = B(t).replace(n, M);
                        var i = a.queryCommandValue("ForeColor");
                        return i = (255 & i) << 16 | 65280 & i | (16711680 & i) >>> 16, "#" + ("000000" + i.toString(16)).slice(-6)
                    } catch (r) {
                        return "none"
                    }
                })
            } else {
                var l = S.doc.createElement("i");
                l.title = "Raphaël Colour Picker", l.style.display = "none", S.doc.body.appendChild(l), be = o(function(t) {
                    return l.style.color = t, S.doc.defaultView.getComputedStyle(l, M).getPropertyValue("color")
                })
            }
            return be(t)
        },
        we = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")"
        },
        xe = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")"
        },
        ke = function() {
            return this.hex
        },
        Te = function(t, e, n) {
            if (null == e && i.is(t, "object") && "r" in t && "g" in t && "b" in t && (n = t.b, e = t.g, t = t.r), null == e && i.is(t, Y)) {
                var r = i.getRGB(t);
                t = r.r, e = r.g, n = r.b
            }
            return (t > 1 || e > 1 || n > 1) && (t /= 255, e /= 255, n /= 255), [t, e, n]
        },
        Ce = function(t, e, n, r) {
            t *= 255, e *= 255, n *= 255;
            var o = {
                r: t,
                g: e,
                b: n,
                hex: i.rgb(t, e, n),
                toString: ke
            };
            return i.is(r, "finite") && (o.opacity = r), o
        };
    i.color = function(t) {
        var e;
        return i.is(t, "object") && "h" in t && "s" in t && "b" in t ? (e = i.hsb2rgb(t), t.r = e.r, t.g = e.g, t.b = e.b, t.hex = e.hex) : i.is(t, "object") && "h" in t && "s" in t && "l" in t ? (e = i.hsl2rgb(t), t.r = e.r, t.g = e.g, t.b = e.b, t.hex = e.hex) : (i.is(t, "string") && (t = i.getRGB(t)), i.is(t, "object") && "r" in t && "g" in t && "b" in t ? (e = i.rgb2hsl(t), t.h = e.h, t.s = e.s, t.l = e.l, e = i.rgb2hsb(t), t.v = e.b) : (t = {
            hex: "none"
        }, t.r = t.g = t.b = t.h = t.s = t.v = t.l = -1)), t.toString = ke, t
    }, i.hsb2rgb = function(t, e, i, n) {
        this.is(t, "object") && "h" in t && "s" in t && "b" in t && (i = t.b, e = t.s, t = t.h, n = t.o), t *= 360;
        var r, o, s, a, l;
        return t = t % 360 / 60, l = i * e, a = l * (1 - q(t % 2 - 1)), r = o = s = i - l, t = ~~t, r += [l, a, 0, 0, a, l][t], o += [a, l, l, a, 0, 0][t], s += [0, 0, a, l, l, a][t], Ce(r, o, s, n)
    }, i.hsl2rgb = function(t, e, i, n) {
        this.is(t, "object") && "h" in t && "s" in t && "l" in t && (i = t.l, e = t.s, t = t.h), (t > 1 || e > 1 || i > 1) && (t /= 360, e /= 100, i /= 100), t *= 360;
        var r, o, s, a, l;
        return t = t % 360 / 60, l = 2 * e * (.5 > i ? i : 1 - i), a = l * (1 - q(t % 2 - 1)), r = o = s = i - l / 2, t = ~~t, r += [l, a, 0, 0, a, l][t], o += [a, l, l, a, 0, 0][t], s += [0, 0, a, l, l, a][t], Ce(r, o, s, n)
    }, i.rgb2hsb = function(t, e, i) {
        i = Te(t, e, i), t = i[0], e = i[1], i = i[2];
        var n, r, o, s;
        return o = O(t, e, i), s = o - F(t, e, i), n = 0 == s ? null : o == t ? (e - i) / s : o == e ? (i - t) / s + 2 : (t - e) / s + 4, n = 60 * ((n + 360) % 6) / 360, r = 0 == s ? 0 : s / o, {
            h: n,
            s: r,
            b: o,
            toString: we
        }
    }, i.rgb2hsl = function(t, e, i) {
        i = Te(t, e, i), t = i[0], e = i[1], i = i[2];
        var n, r, o, s, a, l;
        return s = O(t, e, i), a = F(t, e, i), l = s - a, n = 0 == l ? null : s == t ? (e - i) / l : s == e ? (i - t) / l + 2 : (t - e) / l + 4, n = 60 * ((n + 360) % 6) / 360, o = (s + a) / 2, r = 0 == l ? 0 : .5 > o ? l / (2 * o) : l / (2 - 2 * o), {
            h: n,
            s: r,
            l: o,
            toString: xe
        }
    }, i._path2string = function() {
        return this.join(",").replace(se, "$1")
    }, i._preload = function(t, e) {
        var i = S.doc.createElement("img");
        i.style.cssText = "position:absolute;left:-9999em;top:-9999em", i.onload = function() {
            e.call(this), this.onload = null, S.doc.body.removeChild(this)
        }, i.onerror = function() {
            S.doc.body.removeChild(this)
        }, S.doc.body.appendChild(i), i.src = t
    }, i.getRGB = o(function(t) {
        if (!t || (t = B(t)).indexOf("-") + 1) return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1,
            toString: s
        };
        if ("none" == t) return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            toString: s
        };
        !(oe[C](t.toLowerCase().substring(0, 2)) || "#" == t.charAt()) && (t = be(t));
        var e, n, r, o, a, l, c = t.match(J);
        return c ? (c[2] && (r = te(c[2].substring(5), 16), n = te(c[2].substring(3, 5), 16), e = te(c[2].substring(1, 3), 16)), c[3] && (r = te((a = c[3].charAt(3)) + a, 16), n = te((a = c[3].charAt(2)) + a, 16), e = te((a = c[3].charAt(1)) + a, 16)), c[4] && (l = c[4][A](re), e = Q(l[0]), "%" == l[0].slice(-1) && (e *= 2.55), n = Q(l[1]), "%" == l[1].slice(-1) && (n *= 2.55), r = Q(l[2]), "%" == l[2].slice(-1) && (r *= 2.55), "rgba" == c[1].toLowerCase().slice(0, 4) && (o = Q(l[3])), l[3] && "%" == l[3].slice(-1) && (o /= 100)), c[5] ? (l = c[5][A](re), e = Q(l[0]), "%" == l[0].slice(-1) && (e *= 2.55), n = Q(l[1]), "%" == l[1].slice(-1) && (n *= 2.55), r = Q(l[2]), "%" == l[2].slice(-1) && (r *= 2.55), ("deg" == l[0].slice(-3) || "°" == l[0].slice(-1)) && (e /= 360), "hsba" == c[1].toLowerCase().slice(0, 4) && (o = Q(l[3])), l[3] && "%" == l[3].slice(-1) && (o /= 100), i.hsb2rgb(e, n, r, o)) : c[6] ? (l = c[6][A](re), e = Q(l[0]), "%" == l[0].slice(-1) && (e *= 2.55), n = Q(l[1]), "%" == l[1].slice(-1) && (n *= 2.55), r = Q(l[2]), "%" == l[2].slice(-1) && (r *= 2.55), ("deg" == l[0].slice(-3) || "°" == l[0].slice(-1)) && (e /= 360), "hsla" == c[1].toLowerCase().slice(0, 4) && (o = Q(l[3])), l[3] && "%" == l[3].slice(-1) && (o /= 100), i.hsl2rgb(e, n, r, o)) : (c = {
            r: e,
            g: n,
            b: r,
            toString: s
        }, c.hex = "#" + (16777216 | r | n << 8 | e << 16).toString(16).slice(1), i.is(o, "finite") && (c.opacity = o), c)) : {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1,
            toString: s
        }
    }, i), i.hsb = o(function(t, e, n) {
        return i.hsb2rgb(t, e, n).hex
    }), i.hsl = o(function(t, e, n) {
        return i.hsl2rgb(t, e, n).hex
    }), i.rgb = o(function(t, e, i) {
        return "#" + (16777216 | i | e << 8 | t << 16).toString(16).slice(1)
    }), i.getColor = function(t) {
        var e = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: t || .75
            },
            i = this.hsb2rgb(e.h, e.s, e.b);
        return e.h += .075, e.h > 1 && (e.h = 0, e.s -= .2, 0 >= e.s && (this.getColor.start = {
            h: 0,
            s: 1,
            b: e.b
        })), i.hex
    }, i.getColor.reset = function() {
        delete this.start
    }, i.parsePathString = function(t) {
        if (!t) return null;
        var e = Se(t);
        if (e.arr) return je(e.arr);
        var n = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                r: 4,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0
            },
            r = [];
        return i.is(t, V) && i.is(t[0], V) && (r = je(t)), r.length || B(t).replace(ae, function(t, e, i) {
            var o = [],
                s = e.toLowerCase();
            if (i.replace(ce, function(t, e) {
                e && o.push(+e)
            }), "m" == s && o.length > 2 && (r.push([e][N](o.splice(0, 2))), s = "l", e = "m" == e ? "l" : "L"), "r" == s) r.push([e][N](o));
            else
                for (; o.length >= n[s] && (r.push([e][N](o.splice(0, n[s]))), n[s]););
        }), r.toString = i._path2string, e.arr = je(r), r
    }, i.parseTransformString = o(function(t) {
        if (!t) return null;
        var e = [];
        return i.is(t, V) && i.is(t[0], V) && (e = je(t)), e.length || B(t).replace(le, function(t, i, n) {
            var r = [];
            z.call(i), n.replace(ce, function(t, e) {
                e && r.push(+e)
            }), e.push([i][N](r))
        }), e.toString = i._path2string, e
    });
    var Se = function(t) {
        var e = Se.ps = Se.ps || {};
        return e[t] ? e[t].sleep = 100 : e[t] = {
            sleep: 100
        }, setTimeout(function() {
            for (var i in e) e[C](i) && i != t && (e[i].sleep--, !e[i].sleep && delete e[i])
        }), e[t]
    };
    i.findDotsAtSegment = function(t, e, i, n, r, o, s, a, l) {
        var c = 1 - l,
            u = H(c, 3),
            h = H(c, 2),
            d = l * l,
            f = d * l,
            p = u * t + 3 * h * l * i + 3 * c * l * l * r + f * s,
            g = u * e + 3 * h * l * n + 3 * c * l * l * o + f * a,
            _ = t + 2 * l * (i - t) + d * (r - 2 * i + t),
            m = e + 2 * l * (n - e) + d * (o - 2 * n + e),
            v = i + 2 * l * (r - i) + d * (s - 2 * r + i),
            y = n + 2 * l * (o - n) + d * (a - 2 * o + n),
            b = c * t + l * i,
            w = c * e + l * n,
            x = c * r + l * s,
            k = c * o + l * a,
            T = 90 - 180 * R.atan2(_ - v, m - y) / W;
        return (_ > v || y > m) && (T += 180), {
            x: p,
            y: g,
            m: {
                x: _,
                y: m
            },
            n: {
                x: v,
                y: y
            },
            start: {
                x: b,
                y: w
            },
            end: {
                x: x,
                y: k
            },
            alpha: T
        }
    }, i.bezierBBox = function(t, e, n, r, o, s, a, l) {
        i.is(t, "array") || (t = [t, e, n, r, o, s, a, l]);
        var c = Ae.apply(null, t);
        return {
            x: c.min.x,
            y: c.min.y,
            x2: c.max.x,
            y2: c.max.y,
            width: c.max.x - c.min.x,
            height: c.max.y - c.min.y
        }
    }, i.isPointInsideBBox = function(t, e, i) {
        return e >= t.x && t.x2 >= e && i >= t.y && t.y2 >= i
    }, i.isBBoxIntersect = function(t, e) {
        var n = i.isPointInsideBBox;
        return n(e, t.x, t.y) || n(e, t.x2, t.y) || n(e, t.x, t.y2) || n(e, t.x2, t.y2) || n(t, e.x, e.y) || n(t, e.x2, e.y) || n(t, e.x, e.y2) || n(t, e.x2, e.y2) || (t.x < e.x2 && t.x > e.x || e.x < t.x2 && e.x > t.x) && (t.y < e.y2 && t.y > e.y || e.y < t.y2 && e.y > t.y)
    }, i.pathIntersection = function(t, e) {
        return f(t, e)
    }, i.pathIntersectionNumber = function(t, e) {
        return f(t, e, 1)
    }, i.isPointInsidePath = function(t, e, n) {
        var r = i.pathBBox(t);
        return i.isPointInsideBBox(r, e, n) && 1 == f(t, [
            ["M", e, n],
            ["H", r.x2 + 10]
        ], 1) % 2
    }, i._removedFactory = function(t) {
        return function() {
            e("raphael.log", null, "Raphaël: you are calling to method “" + t + "” of removed object", t)
        }
    };
    var Ee = i.pathBBox = function(t) {
            var e = Se(t);
            if (e.bbox) return n(e.bbox);
            if (!t) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                x2: 0,
                y2: 0
            };
            t = Pe(t);
            for (var i, r = 0, o = 0, s = [], a = [], l = 0, c = t.length; c > l; l++)
                if (i = t[l], "M" == i[0]) r = i[1], o = i[2], s.push(r), a.push(o);
                else {
                    var u = Ae(r, o, i[1], i[2], i[3], i[4], i[5], i[6]);
                    s = s[N](u.min.x, u.max.x), a = a[N](u.min.y, u.max.y), r = i[5], o = i[6]
                }
            var h = F[$](0, s),
                d = F[$](0, a),
                f = O[$](0, s),
                p = O[$](0, a),
                g = f - h,
                _ = p - d,
                m = {
                    x: h,
                    y: d,
                    x2: f,
                    y2: p,
                    width: g,
                    height: _,
                    cx: h + g / 2,
                    cy: d + _ / 2
                };
            return e.bbox = n(m), m
        },
        je = function(t) {
            var e = n(t);
            return e.toString = i._path2string, e
        },
        $e = i._pathToRelative = function(t) {
            var e = Se(t);
            if (e.rel) return je(e.rel);
            i.is(t, V) && i.is(t && t[0], V) || (t = i.parsePathString(t));
            var n = [],
                r = 0,
                o = 0,
                s = 0,
                a = 0,
                l = 0;
            "M" == t[0][0] && (r = t[0][1], o = t[0][2], s = r, a = o, l++, n.push(["M", r, o]));
            for (var c = l, u = t.length; u > c; c++) {
                var h = n[c] = [],
                    d = t[c];
                if (d[0] != z.call(d[0])) switch (h[0] = z.call(d[0]), h[0]) {
                    case "a":
                        h[1] = d[1], h[2] = d[2], h[3] = d[3], h[4] = d[4], h[5] = d[5], h[6] = +(d[6] - r).toFixed(3), h[7] = +(d[7] - o).toFixed(3);
                        break;
                    case "v":
                        h[1] = +(d[1] - o).toFixed(3);
                        break;
                    case "m":
                        s = d[1], a = d[2];
                    default:
                        for (var f = 1, p = d.length; p > f; f++) h[f] = +(d[f] - (f % 2 ? r : o)).toFixed(3)
                } else {
                    h = n[c] = [], "m" == d[0] && (s = d[1] + r, a = d[2] + o);
                    for (var g = 0, _ = d.length; _ > g; g++) n[c][g] = d[g]
                }
                var m = n[c].length;
                switch (n[c][0]) {
                    case "z":
                        r = s, o = a;
                        break;
                    case "h":
                        r += +n[c][m - 1];
                        break;
                    case "v":
                        o += +n[c][m - 1];
                        break;
                    default:
                        r += +n[c][m - 2], o += +n[c][m - 1]
                }
            }
            return n.toString = i._path2string, e.rel = je(n), n
        },
        Ne = i._pathToAbsolute = function(t) {
            var e = Se(t);
            if (e.abs) return je(e.abs);
            if (i.is(t, V) && i.is(t && t[0], V) || (t = i.parsePathString(t)), !t || !t.length) return [
                ["M", 0, 0]
            ];
            var n = [],
                r = 0,
                o = 0,
                s = 0,
                l = 0,
                c = 0;
            "M" == t[0][0] && (r = +t[0][1], o = +t[0][2], s = r, l = o, c++, n[0] = ["M", r, o]);
            for (var u, h, d = 3 == t.length && "M" == t[0][0] && "R" == t[1][0].toUpperCase() && "Z" == t[2][0].toUpperCase(), f = c, p = t.length; p > f; f++) {
                if (n.push(u = []), h = t[f], h[0] != ee.call(h[0])) switch (u[0] = ee.call(h[0]), u[0]) {
                        case "A":
                            u[1] = h[1], u[2] = h[2], u[3] = h[3], u[4] = h[4], u[5] = h[5], u[6] = +(h[6] + r), u[7] = +(h[7] + o);
                            break;
                        case "V":
                            u[1] = +h[1] + o;
                            break;
                        case "H":
                            u[1] = +h[1] + r;
                            break;
                        case "R":
                            for (var g = [r, o][N](h.slice(1)), _ = 2, m = g.length; m > _; _++) g[_] = +g[_] + r, g[++_] = +g[_] + o;
                            n.pop(), n = n[N](a(g, d));
                            break;
                        case "M":
                            s = +h[1] + r, l = +h[2] + o;
                        default:
                            for (_ = 1, m = h.length; m > _; _++) u[_] = +h[_] + (_ % 2 ? r : o)
                    } else if ("R" == h[0]) g = [r, o][N](h.slice(1)), n.pop(), n = n[N](a(g, d)), u = ["R"][N](h.slice(-2));
                    else
                        for (var v = 0, y = h.length; y > v; v++) u[v] = h[v];
                switch (u[0]) {
                    case "Z":
                        r = s, o = l;
                        break;
                    case "H":
                        r = u[1];
                        break;
                    case "V":
                        o = u[1];
                        break;
                    case "M":
                        s = u[u.length - 2], l = u[u.length - 1];
                    default:
                        r = u[u.length - 2], o = u[u.length - 1]
                }
            }
            return n.toString = i._path2string, e.abs = je(n), n
        },
        De = function(t, e, i, n) {
            return [t, e, i, n, i, n]
        },
        Me = function(t, e, i, n, r, o) {
            var s = 1 / 3,
                a = 2 / 3;
            return [s * t + a * i, s * e + a * n, s * r + a * i, s * o + a * n, r, o]
        },
        Le = function(t, e, i, n, r, s, a, l, c, u) {
            var h, d = 120 * W / 180,
                f = W / 180 * (+r || 0),
                p = [],
                g = o(function(t, e, i) {
                    var n = t * R.cos(i) - e * R.sin(i),
                        r = t * R.sin(i) + e * R.cos(i);
                    return {
                        x: n,
                        y: r
                    }
                });
            if (u) T = u[0], C = u[1], x = u[2], k = u[3];
            else {
                h = g(t, e, -f), t = h.x, e = h.y, h = g(l, c, -f), l = h.x, c = h.y;
                var _ = (R.cos(W / 180 * r), R.sin(W / 180 * r), (t - l) / 2),
                    m = (e - c) / 2,
                    v = _ * _ / (i * i) + m * m / (n * n);
                v > 1 && (v = R.sqrt(v), i = v * i, n = v * n);
                var y = i * i,
                    b = n * n,
                    w = (s == a ? -1 : 1) * R.sqrt(q((y * b - y * m * m - b * _ * _) / (y * m * m + b * _ * _))),
                    x = w * i * m / n + (t + l) / 2,
                    k = w * -n * _ / i + (e + c) / 2,
                    T = R.asin(((e - k) / n).toFixed(9)),
                    C = R.asin(((c - k) / n).toFixed(9));
                T = x > t ? W - T : T, C = x > l ? W - C : C, 0 > T && (T = 2 * W + T), 0 > C && (C = 2 * W + C), a && T > C && (T -= 2 * W), !a && C > T && (C -= 2 * W)
            }
            var S = C - T;
            if (q(S) > d) {
                var E = C,
                    j = l,
                    $ = c;
                C = T + d * (a && C > T ? 1 : -1), l = x + i * R.cos(C), c = k + n * R.sin(C), p = Le(l, c, i, n, r, 0, a, j, $, [C, E, x, k])
            }
            S = C - T;
            var D = R.cos(T),
                M = R.sin(T),
                L = R.cos(C),
                B = R.sin(C),
                P = R.tan(S / 4),
                I = 4 / 3 * i * P,
                z = 4 / 3 * n * P,
                O = [t, e],
                F = [t + I * M, e - z * D],
                H = [l + I * B, c - z * L],
                X = [l, c];
            if (F[0] = 2 * O[0] - F[0], F[1] = 2 * O[1] - F[1], u) return [F, H, X][N](p);
            p = [F, H, X][N](p).join()[A](",");
            for (var Y = [], V = 0, U = p.length; U > V; V++) Y[V] = V % 2 ? g(p[V - 1], p[V], f).y : g(p[V], p[V + 1], f).x;
            return Y
        },
        Be = function(t, e, i, n, r, o, s, a, l) {
            var c = 1 - l;
            return {
                x: H(c, 3) * t + 3 * H(c, 2) * l * i + 3 * c * l * l * r + H(l, 3) * s,
                y: H(c, 3) * e + 3 * H(c, 2) * l * n + 3 * c * l * l * o + H(l, 3) * a
            }
        },
        Ae = o(function(t, e, i, n, r, o, s, a) {
            var l, c = r - 2 * i + t - (s - 2 * r + i),
                u = 2 * (i - t) - 2 * (r - i),
                h = t - i,
                d = (-u + R.sqrt(u * u - 4 * c * h)) / 2 / c,
                f = (-u - R.sqrt(u * u - 4 * c * h)) / 2 / c,
                p = [e, a],
                g = [t, s];
            return q(d) > "1e12" && (d = .5), q(f) > "1e12" && (f = .5), d > 0 && 1 > d && (l = Be(t, e, i, n, r, o, s, a, d), g.push(l.x), p.push(l.y)), f > 0 && 1 > f && (l = Be(t, e, i, n, r, o, s, a, f), g.push(l.x), p.push(l.y)), c = o - 2 * n + e - (a - 2 * o + n), u = 2 * (n - e) - 2 * (o - n), h = e - n, d = (-u + R.sqrt(u * u - 4 * c * h)) / 2 / c, f = (-u - R.sqrt(u * u - 4 * c * h)) / 2 / c, q(d) > "1e12" && (d = .5), q(f) > "1e12" && (f = .5), d > 0 && 1 > d && (l = Be(t, e, i, n, r, o, s, a, d), g.push(l.x), p.push(l.y)), f > 0 && 1 > f && (l = Be(t, e, i, n, r, o, s, a, f), g.push(l.x), p.push(l.y)), {
                min: {
                    x: F[$](0, g),
                    y: F[$](0, p)
                },
                max: {
                    x: O[$](0, g),
                    y: O[$](0, p)
                }
            }
        }),
        Pe = i._path2curve = o(function(t, e) {
            var i = !e && Se(t);
            if (!e && i.curve) return je(i.curve);
            for (var n = Ne(t), r = e && Ne(e), o = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            }, s = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            }, a = (function(t, e) {
                var i, n;
                if (!t) return ["C", e.x, e.y, e.x, e.y, e.x, e.y];
                switch (!(t[0] in {
                    T: 1,
                    Q: 1
                }) && (e.qx = e.qy = null), t[0]) {
                    case "M":
                        e.X = t[1], e.Y = t[2];
                        break;
                    case "A":
                        t = ["C"][N](Le[$](0, [e.x, e.y][N](t.slice(1))));
                        break;
                    case "S":
                        i = e.x + (e.x - (e.bx || e.x)), n = e.y + (e.y - (e.by || e.y)), t = ["C", i, n][N](t.slice(1));
                        break;
                    case "T":
                        e.qx = e.x + (e.x - (e.qx || e.x)), e.qy = e.y + (e.y - (e.qy || e.y)), t = ["C"][N](Me(e.x, e.y, e.qx, e.qy, t[1], t[2]));
                        break;
                    case "Q":
                        e.qx = t[1], e.qy = t[2], t = ["C"][N](Me(e.x, e.y, t[1], t[2], t[3], t[4]));
                        break;
                    case "L":
                        t = ["C"][N](De(e.x, e.y, t[1], t[2]));
                        break;
                    case "H":
                        t = ["C"][N](De(e.x, e.y, t[1], e.y));
                        break;
                    case "V":
                        t = ["C"][N](De(e.x, e.y, e.x, t[1]));
                        break;
                    case "Z":
                        t = ["C"][N](De(e.x, e.y, e.X, e.Y))
                }
                return t
            }), l = function(t, e) {
                if (t[e].length > 7) {
                    t[e].shift();
                    for (var i = t[e]; i.length;) t.splice(e++, 0, ["C"][N](i.splice(0, 6)));
                    t.splice(e, 1), h = O(n.length, r && r.length || 0)
                }
            }, c = function(t, e, i, o, s) {
                t && e && "M" == t[s][0] && "M" != e[s][0] && (e.splice(s, 0, ["M", o.x, o.y]), i.bx = 0, i.by = 0, i.x = t[s][1], i.y = t[s][2], h = O(n.length, r && r.length || 0))
            }, u = 0, h = O(n.length, r && r.length || 0); h > u; u++) {
                n[u] = a(n[u], o), l(n, u), r && (r[u] = a(r[u], s)), r && l(r, u), c(n, r, o, s, u), c(r, n, s, o, u);
                var d = n[u],
                    f = r && r[u],
                    p = d.length,
                    g = r && f.length;
                o.x = d[p - 2], o.y = d[p - 1], o.bx = Q(d[p - 4]) || o.x, o.by = Q(d[p - 3]) || o.y, s.bx = r && (Q(f[g - 4]) || s.x), s.by = r && (Q(f[g - 3]) || s.y), s.x = r && f[g - 2], s.y = r && f[g - 1]
            }
            return r || (i.curve = je(n)), r ? [n, r] : n
        }, null, je),
        Ie = (i._parseDots = o(function(t) {
            for (var e = [], n = 0, r = t.length; r > n; n++) {
                var o = {},
                    s = t[n].match(/^([^:]*):?([\d\.]*)/);
                if (o.color = i.getRGB(s[1]), o.color.error) return null;
                o.color = o.color.hex, s[2] && (o.offset = s[2] + "%"), e.push(o)
            }
            for (n = 1, r = e.length - 1; r > n; n++)
                if (!e[n].offset) {
                    for (var a = Q(e[n - 1].offset || 0), l = 0, c = n + 1; r > c; c++)
                        if (e[c].offset) {
                            l = e[c].offset;
                            break
                        }
                    l || (l = 100, c = r), l = Q(l);
                    for (var u = (l - a) / (c - n + 1); c > n; n++) a += u, e[n].offset = a + "%"
                }
            return e
        }), i._tear = function(t, e) {
            t == e.top && (e.top = t.prev), t == e.bottom && (e.bottom = t.next), t.next && (t.next.prev = t.prev), t.prev && (t.prev.next = t.next)
        }),
        ze = (i._tofront = function(t, e) {
            e.top !== t && (Ie(t, e), t.next = null, t.prev = e.top, e.top.next = t, e.top = t)
        }, i._toback = function(t, e) {
            e.bottom !== t && (Ie(t, e), t.next = e.bottom, t.prev = null, e.bottom.prev = t, e.bottom = t)
        }, i._insertafter = function(t, e, i) {
            Ie(t, i), e == i.top && (i.top = t), e.next && (e.next.prev = t), t.next = e.next, t.prev = e, e.next = t
        }, i._insertbefore = function(t, e, i) {
            Ie(t, i), e == i.bottom && (i.bottom = t), e.prev && (e.prev.next = t), t.prev = e.prev, e.prev = t, t.next = e
        }, i.toMatrix = function(t, e) {
            var i = Ee(t),
                n = {
                    _: {
                        transform: M
                    },
                    getBBox: function() {
                        return i
                    }
                };
            return Re(n, e), n.matrix
        }),
        Re = (i.transformPath = function(t, e) {
            return me(t, ze(t, e))
        }, i._extractTransform = function(t, e) {
            if (null == e) return t._.transform;
            e = B(e).replace(/\.{3}|\u2026/g, t._.transform || M);
            var n = i.parseTransformString(e),
                r = 0,
                o = 0,
                s = 0,
                a = 1,
                l = 1,
                c = t._,
                u = new p;
            if (c.transform = n || [], n)
                for (var h = 0, d = n.length; d > h; h++) {
                    var f, g, _, m, v, y = n[h],
                        b = y.length,
                        w = B(y[0]).toLowerCase(),
                        x = y[0] != w,
                        k = x ? u.invert() : 0;
                    "t" == w && 3 == b ? x ? (f = k.x(0, 0), g = k.y(0, 0), _ = k.x(y[1], y[2]), m = k.y(y[1], y[2]), u.translate(_ - f, m - g)) : u.translate(y[1], y[2]) : "r" == w ? 2 == b ? (v = v || t.getBBox(1), u.rotate(y[1], v.x + v.width / 2, v.y + v.height / 2), r += y[1]) : 4 == b && (x ? (_ = k.x(y[2], y[3]), m = k.y(y[2], y[3]), u.rotate(y[1], _, m)) : u.rotate(y[1], y[2], y[3]), r += y[1]) : "s" == w ? 2 == b || 3 == b ? (v = v || t.getBBox(1), u.scale(y[1], y[b - 1], v.x + v.width / 2, v.y + v.height / 2), a *= y[1], l *= y[b - 1]) : 5 == b && (x ? (_ = k.x(y[3], y[4]), m = k.y(y[3], y[4]), u.scale(y[1], y[2], _, m)) : u.scale(y[1], y[2], y[3], y[4]), a *= y[1], l *= y[2]) : "m" == w && 7 == b && u.add(y[1], y[2], y[3], y[4], y[5], y[6]), c.dirtyT = 1, t.matrix = u
                }
            t.matrix = u, c.sx = a, c.sy = l, c.deg = r, c.dx = o = u.e, c.dy = s = u.f, 1 == a && 1 == l && !r && c.bbox ? (c.bbox.x += +o, c.bbox.y += +s) : c.dirtyT = 1
        }),
        Oe = function(t) {
            var e = t[0];
            switch (e.toLowerCase()) {
                case "t":
                    return [e, 0, 0];
                case "m":
                    return [e, 1, 0, 0, 1, 0, 0];
                case "r":
                    return 4 == t.length ? [e, 0, t[2], t[3]] : [e, 0];
                case "s":
                    return 5 == t.length ? [e, 1, 1, t[3], t[4]] : 3 == t.length ? [e, 1, 1] : [e, 1]
            }
        },
        Fe = i._equaliseTransform = function(t, e) {
            e = B(e).replace(/\.{3}|\u2026/g, t), t = i.parseTransformString(t) || [], e = i.parseTransformString(e) || [];
            for (var n, r, o, s, a = O(t.length, e.length), l = [], c = [], u = 0; a > u; u++) {
                if (o = t[u] || Oe(e[u]), s = e[u] || Oe(o), o[0] != s[0] || "r" == o[0].toLowerCase() && (o[2] != s[2] || o[3] != s[3]) || "s" == o[0].toLowerCase() && (o[3] != s[3] || o[4] != s[4])) return;
                for (l[u] = [], c[u] = [], n = 0, r = O(o.length, s.length); r > n; n++) n in o && (l[u][n] = o[n]), n in s && (c[u][n] = s[n])
            }
            return {
                from: l,
                to: c
            }
        };
    i._getContainer = function(t, e, n, r) {
        var o;
        return o = null != r || i.is(t, "object") ? t : S.doc.getElementById(t), null != o ? o.tagName ? null == e ? {
            container: o,
            width: o.style.pixelWidth || o.offsetWidth,
            height: o.style.pixelHeight || o.offsetHeight
        } : {
            container: o,
            width: e,
            height: n
        } : {
            container: 1,
            x: t,
            y: e,
            width: n,
            height: r
        } : void 0
    }, i.pathToRelative = $e, i._engine = {}, i.path2curve = Pe, i.matrix = function(t, e, i, n, r, o) {
        return new p(t, e, i, n, r, o)
    },
    function(t) {
        function e(t) {
            return t[0] * t[0] + t[1] * t[1]
        }

        function n(t) {
            var i = R.sqrt(e(t));
            t[0] && (t[0] /= i), t[1] && (t[1] /= i)
        }
        t.add = function(t, e, i, n, r, o) {
            var s, a, l, c, u = [
                    [],
                    [],
                    []
                ],
                h = [
                    [this.a, this.c, this.e],
                    [this.b, this.d, this.f],
                    [0, 0, 1]
                ],
                d = [
                    [t, i, r],
                    [e, n, o],
                    [0, 0, 1]
                ];
            for (t && t instanceof p && (d = [
                [t.a, t.c, t.e],
                [t.b, t.d, t.f],
                [0, 0, 1]
            ]), s = 0; 3 > s; s++)
                for (a = 0; 3 > a; a++) {
                    for (c = 0, l = 0; 3 > l; l++) c += h[s][l] * d[l][a];
                    u[s][a] = c
                }
            this.a = u[0][0], this.b = u[1][0], this.c = u[0][1], this.d = u[1][1], this.e = u[0][2], this.f = u[1][2]
        }, t.invert = function() {
            var t = this,
                e = t.a * t.d - t.b * t.c;
            return new p(t.d / e, -t.b / e, -t.c / e, t.a / e, (t.c * t.f - t.d * t.e) / e, (t.b * t.e - t.a * t.f) / e)
        }, t.clone = function() {
            return new p(this.a, this.b, this.c, this.d, this.e, this.f)
        }, t.translate = function(t, e) {
            this.add(1, 0, 0, 1, t, e)
        }, t.scale = function(t, e, i, n) {
            null == e && (e = t), (i || n) && this.add(1, 0, 0, 1, i, n), this.add(t, 0, 0, e, 0, 0), (i || n) && this.add(1, 0, 0, 1, -i, -n)
        }, t.rotate = function(t, e, n) {
            t = i.rad(t), e = e || 0, n = n || 0;
            var r = +R.cos(t).toFixed(9),
                o = +R.sin(t).toFixed(9);
            this.add(r, o, -o, r, e, n), this.add(1, 0, 0, 1, -e, -n)
        }, t.x = function(t, e) {
            return t * this.a + e * this.c + this.e
        }, t.y = function(t, e) {
            return t * this.b + e * this.d + this.f
        }, t.get = function(t) {
            return +this[B.fromCharCode(97 + t)].toFixed(4)
        }, t.toString = function() {
            return i.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join()
        }, t.toFilter = function() {
            return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')"
        }, t.offset = function() {
            return [this.e.toFixed(4), this.f.toFixed(4)]
        }, t.split = function() {
            var t = {};
            t.dx = this.e, t.dy = this.f;
            var r = [
                [this.a, this.c],
                [this.b, this.d]
            ];
            t.scalex = R.sqrt(e(r[0])), n(r[0]), t.shear = r[0][0] * r[1][0] + r[0][1] * r[1][1], r[1] = [r[1][0] - r[0][0] * t.shear, r[1][1] - r[0][1] * t.shear], t.scaley = R.sqrt(e(r[1])), n(r[1]), t.shear /= t.scaley;
            var o = -r[0][1],
                s = r[1][1];
            return 0 > s ? (t.rotate = i.deg(R.acos(s)), 0 > o && (t.rotate = 360 - t.rotate)) : t.rotate = i.deg(R.asin(o)), t.isSimple = !(+t.shear.toFixed(9) || t.scalex.toFixed(9) != t.scaley.toFixed(9) && t.rotate), t.isSuperSimple = !+t.shear.toFixed(9) && t.scalex.toFixed(9) == t.scaley.toFixed(9) && !t.rotate, t.noRotation = !+t.shear.toFixed(9) && !t.rotate, t
        }, t.toTransformString = function(t) {
            var e = t || this[A]();
            return e.isSimple ? (e.scalex = +e.scalex.toFixed(4), e.scaley = +e.scaley.toFixed(4), e.rotate = +e.rotate.toFixed(4), (e.dx || e.dy ? "t" + [e.dx, e.dy] : M) + (1 != e.scalex || 1 != e.scaley ? "s" + [e.scalex, e.scaley, 0, 0] : M) + (e.rotate ? "r" + [e.rotate, 0, 0] : M)) : "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
        }
    }(p.prototype);
    var qe = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    w.safari = "Apple Computer, Inc." == navigator.vendor && (qe && 4 > qe[1] || "iP" == navigator.platform.slice(0, 2)) || "Google Inc." == navigator.vendor && qe && 8 > qe[1] ? function() {
        var t = this.rect(-99, -99, this.width + 99, this.height + 99).attr({
            stroke: "none"
        });
        setTimeout(function() {
            t.remove()
        })
    } : de;
    for (var He = function() {
        this.returnValue = !1
    }, We = function() {
        return this.originalEvent.preventDefault()
    }, Xe = function() {
        this.cancelBubble = !0
    }, Ye = function() {
        return this.originalEvent.stopPropagation()
    }, Ve = function(t) {
        var e = S.doc.documentElement.scrollTop || S.doc.body.scrollTop,
            i = S.doc.documentElement.scrollLeft || S.doc.body.scrollLeft;
        return {
            x: t.clientX + i,
            y: t.clientY + e
        }
    }, Ue = function() {
        return S.doc.addEventListener ? function(t, e, i, n) {
            var r = function(t) {
                var e = Ve(t);
                return i.call(n, t, e.x, e.y)
            };
            if (t.addEventListener(e, r, !1), D && I[e]) {
                var o = function(e) {
                    for (var r = Ve(e), o = e, s = 0, a = e.targetTouches && e.targetTouches.length; a > s; s++)
                        if (e.targetTouches[s].target == t) {
                            e = e.targetTouches[s], e.originalEvent = o, e.preventDefault = We, e.stopPropagation = Ye;
                            break
                        }
                    return i.call(n, e, r.x, r.y)
                };
                t.addEventListener(I[e], o, !1)
            }
            return function() {
                return t.removeEventListener(e, r, !1), D && I[e] && t.removeEventListener(I[e], r, !1), !0
            }
        } : S.doc.attachEvent ? function(t, e, i, n) {
            var r = function(t) {
                t = t || S.win.event;
                var e = S.doc.documentElement.scrollTop || S.doc.body.scrollTop,
                    r = S.doc.documentElement.scrollLeft || S.doc.body.scrollLeft,
                    o = t.clientX + r,
                    s = t.clientY + e;
                return t.preventDefault = t.preventDefault || He, t.stopPropagation = t.stopPropagation || Xe, i.call(n, t, o, s)
            };
            t.attachEvent("on" + e, r);
            var o = function() {
                return t.detachEvent("on" + e, r), !0
            };
            return o
        } : void 0
    }(), Je = [], Ke = function(t) {
        for (var i, n = t.clientX, r = t.clientY, o = S.doc.documentElement.scrollTop || S.doc.body.scrollTop, s = S.doc.documentElement.scrollLeft || S.doc.body.scrollLeft, a = Je.length; a--;) {
            if (i = Je[a], D && t.touches) {
                for (var l, c = t.touches.length; c--;)
                    if (l = t.touches[c], l.identifier == i.el._drag.id) {
                        n = l.clientX, r = l.clientY, (t.originalEvent ? t.originalEvent : t).preventDefault();
                        break
                    }
            } else t.preventDefault();
            var u, h = i.el.node,
                d = h.nextSibling,
                f = h.parentNode,
                p = h.style.display;
            S.win.opera && f.removeChild(h), h.style.display = "none", u = i.el.paper.getElementByPoint(n, r), h.style.display = p, S.win.opera && (d ? f.insertBefore(h, d) : f.appendChild(h)), u && e("raphael.drag.over." + i.el.id, i.el, u), n += s, r += o, e("raphael.drag.move." + i.el.id, i.move_scope || i.el, n - i.el._drag.x, r - i.el._drag.y, n, r, t)
        }
    }, Ge = function(t) {
        i.unmousemove(Ke).unmouseup(Ge);
        for (var n, r = Je.length; r--;) n = Je[r], n.el._drag = {}, e("raphael.drag.end." + n.el.id, n.end_scope || n.start_scope || n.move_scope || n.el, t);
        Je = []
    }, Ze = i.el = {}, Qe = P.length; Qe--;)(function(t) {
        i[t] = Ze[t] = function(e, n) {
            return i.is(e, "function") && (this.events = this.events || [], this.events.push({
                name: t,
                f: e,
                unbind: Ue(this.shape || this.node || S.doc, t, e, n || this)
            })), this
        }, i["un" + t] = Ze["un" + t] = function(e) {
            for (var n = this.events || [], r = n.length; r--;) n[r].name != t || !i.is(e, "undefined") && n[r].f != e || (n[r].unbind(), n.splice(r, 1), !n.length && delete this.events);
            return this
        }
    })(P[Qe]);
    Ze.data = function(t, n) {
        var r = ue[this.id] = ue[this.id] || {};
        if (0 == arguments.length) return r;
        if (1 == arguments.length) {
            if (i.is(t, "object")) {
                for (var o in t) t[C](o) && this.data(o, t[o]);
                return this
            }
            return e("raphael.data.get." + this.id, this, r[t], t), r[t]
        }
        return r[t] = n, e("raphael.data.set." + this.id, this, n, t), this
    }, Ze.removeData = function(t) {
        return null == t ? ue[this.id] = {} : ue[this.id] && delete ue[this.id][t], this
    }, Ze.getData = function() {
        return n(ue[this.id] || {})
    }, Ze.hover = function(t, e, i, n) {
        return this.mouseover(t, i).mouseout(e, n || i)
    }, Ze.unhover = function(t, e) {
        return this.unmouseover(t).unmouseout(e)
    };
    var ti = [];
    Ze.drag = function(t, n, r, o, s, a) {
        function l(l) {
            (l.originalEvent || l).preventDefault();
            var c = S.doc.documentElement.scrollTop || S.doc.body.scrollTop,
                u = S.doc.documentElement.scrollLeft || S.doc.body.scrollLeft;
            this._drag.x = l.clientX + u, this._drag.y = l.clientY + c, this._drag.id = l.identifier, !Je.length && i.mousemove(Ke).mouseup(Ge), Je.push({
                el: this,
                move_scope: o,
                start_scope: s,
                end_scope: a
            }), n && e.on("raphael.drag.start." + this.id, n), t && e.on("raphael.drag.move." + this.id, t), r && e.on("raphael.drag.end." + this.id, r), e("raphael.drag.start." + this.id, s || o || this, l.clientX + u, l.clientY + c, l)
        }
        return this._drag = {}, ti.push({
            el: this,
            start: l
        }), this.mousedown(l), this
    }, Ze.onDragOver = function(t) {
        t ? e.on("raphael.drag.over." + this.id, t) : e.unbind("raphael.drag.over." + this.id)
    }, Ze.undrag = function() {
        for (var t = ti.length; t--;) ti[t].el == this && (this.unmousedown(ti[t].start), ti.splice(t, 1), e.unbind("raphael.drag.*." + this.id));
        !ti.length && i.unmousemove(Ke).unmouseup(Ge), Je = []
    }, w.circle = function(t, e, n) {
        var r = i._engine.circle(this, t || 0, e || 0, n || 0);
        return this.__set__ && this.__set__.push(r), r
    }, w.rect = function(t, e, n, r, o) {
        var s = i._engine.rect(this, t || 0, e || 0, n || 0, r || 0, o || 0);
        return this.__set__ && this.__set__.push(s), s
    }, w.ellipse = function(t, e, n, r) {
        var o = i._engine.ellipse(this, t || 0, e || 0, n || 0, r || 0);
        return this.__set__ && this.__set__.push(o), o
    }, w.path = function(t) {
        t && !i.is(t, Y) && !i.is(t[0], V) && (t += M);
        var e = i._engine.path(i.format[$](i, arguments), this);
        return this.__set__ && this.__set__.push(e), e
    }, w.image = function(t, e, n, r, o) {
        var s = i._engine.image(this, t || "about:blank", e || 0, n || 0, r || 0, o || 0);
        return this.__set__ && this.__set__.push(s), s
    }, w.text = function(t, e, n) {
        var r = i._engine.text(this, t || 0, e || 0, B(n));
        return this.__set__ && this.__set__.push(r), r
    }, w.textbuffer = function() {
        var t = this;
        return {
            text: [],
            appendText: function(t, e, i, n) {
                n.x = t, n.y = e;
                var r = {
                    text: i,
                    attrs: n
                };
                this.text.push(r)
            },
            draw: function() {
                var e = i._engine.batchText(t, this.text);
                return e
            }
        }
    }, w.set = function(t) {
        !i.is(t, "array") && (t = Array.prototype.splice.call(arguments, 0, arguments.length));
        var e = new di(t);
        return this.__set__ && this.__set__.push(e), e.paper = this, e.type = "set", e
    }, w.setStart = function(t) {
        this.__set__ = t || this.set()
    }, w.setFinish = function() {
        var t = this.__set__;
        return delete this.__set__, t
    }, w.setSize = function(t, e) {
        return i._engine.setSize.call(this, t, e)
    }, w.setViewBox = function(t, e, n, r, o) {
        return i._engine.setViewBox.call(this, t, e, n, r, o)
    }, w.top = w.bottom = null, w.raphael = i;
    var ei = function(t) {
        var e = t.getBoundingClientRect(),
            i = t.ownerDocument,
            n = i.body,
            r = i.documentElement,
            o = r.clientTop || n.clientTop || 0,
            s = r.clientLeft || n.clientLeft || 0,
            a = e.top + (S.win.pageYOffset || r.scrollTop || n.scrollTop) - o,
            l = e.left + (S.win.pageXOffset || r.scrollLeft || n.scrollLeft) - s;
        return {
            y: a,
            x: l
        }
    };
    w.getElementByPoint = function(t, e) {
        var i = this,
            n = i.canvas,
            r = S.doc.elementFromPoint(t, e);
        if (S.win.opera && "svg" == r.tagName) {
            var o = ei(n),
                s = n.createSVGRect();
            s.x = t - o.x, s.y = e - o.y, s.width = s.height = 1;
            var a = n.getIntersectionList(s, null);
            a.length && (r = a[a.length - 1])
        }
        if (!r) return null;
        for (; r.parentNode && r != n.parentNode && !r.raphael;) r = r.parentNode;
        return r == i.canvas.parentNode && (r = n), r = r && r.raphael ? i.getById(r.raphaelid) : null
    }, w.getElementsByBBox = function(t) {
        var e = this.set();
        return this.forEach(function(n) {
            i.isBBoxIntersect(n.getBBox(), t) && e.push(n)
        }), e
    }, w.getById = function(t) {
        for (var e = this.bottom; e;) {
            if (e.id == t) return e;
            e = e.next
        }
        return null
    }, w.forEach = function(t, e) {
        for (var i = this.bottom; i;) {
            if (t.call(e, i) === !1) return this;
            i = i.next
        }
        return this
    }, w.getElementsByPoint = function(t, e) {
        var i = this.set();
        return this.forEach(function(n) {
            n.isPointInside(t, e) && i.push(n)
        }), i
    }, Ze.isPointInside = function(t, e) {
        var n = this.realPath = this.realPath || _e[this.type](this);
        return i.isPointInsidePath(n, t, e)
    }, Ze.getBBox = function(t) {
        if (this.removed) return {};
        var e = this._;
        return t ? ((e.dirty || !e.bboxwt) && (this.realPath = _e[this.type](this), e.bboxwt = Ee(this.realPath), e.bboxwt.toString = g, e.dirty = 0), e.bboxwt) : ((e.dirty || e.dirtyT || !e.bbox) && ((e.dirty || !this.realPath) && (e.bboxwt = 0, this.realPath = _e[this.type](this)), e.bbox = Ee(me(this.realPath, this.matrix)), e.bbox.toString = g, e.dirty = e.dirtyT = 0), e.bbox)
    }, Ze.clone = function() {
        if (this.removed) return null;
        var t = this.paper[this.type]().attr(this.attr());
        return this.__set__ && this.__set__.push(t), t
    }, Ze.glow = function(t) {
        if ("text" == this.type) return null;
        t = t || {};
        var e = {
                width: (t.width || 10) + (+this.attr("stroke-width") || 1),
                fill: t.fill || !1,
                opacity: t.opacity || .5,
                offsetx: t.offsetx || 0,
                offsety: t.offsety || 0,
                color: t.color || "#000"
            },
            i = e.width / 2,
            n = this.paper,
            r = n.set(),
            o = this.realPath || _e[this.type](this);
        o = this.matrix ? me(o, this.matrix) : o;
        for (var s = 1; i + 1 > s; s++) r.push(n.path(o).attr({
            stroke: e.color,
            fill: e.fill ? e.color : "none",
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            "stroke-width": +(e.width / i * s).toFixed(3),
            opacity: +(e.opacity / i).toFixed(3)
        }));
        return r.insertBefore(this).translate(e.offsetx, e.offsety)
    };
    var ii = function(t, e, n, r, o, s, a, l, h) {
            return null == h ? c(t, e, n, r, o, s, a, l) : i.findDotsAtSegment(t, e, n, r, o, s, a, l, u(t, e, n, r, o, s, a, l, h))
        },
        ni = function(t, e) {
            return function(n, r, o) {
                n = Pe(n);
                for (var s, a, l, c, u, h = "", d = {}, f = 0, p = 0, g = n.length; g > p; p++) {
                    if (l = n[p], "M" == l[0]) s = +l[1], a = +l[2];
                    else {
                        if (c = ii(s, a, l[1], l[2], l[3], l[4], l[5], l[6]), f + c > r) {
                            if (e && !d.start) {
                                if (u = ii(s, a, l[1], l[2], l[3], l[4], l[5], l[6], r - f), h += ["C" + u.start.x, u.start.y, u.m.x, u.m.y, u.x, u.y], o) return h;
                                d.start = h, h = ["M" + u.x, u.y + "C" + u.n.x, u.n.y, u.end.x, u.end.y, l[5], l[6]].join(), f += c, s = +l[5], a = +l[6];
                                continue
                            }
                            if (!t && !e) return u = ii(s, a, l[1], l[2], l[3], l[4], l[5], l[6], r - f), {
                                x: u.x,
                                y: u.y,
                                alpha: u.alpha
                            }
                        }
                        f += c, s = +l[5], a = +l[6]
                    }
                    h += l.shift() + l
                }
                return d.end = h, u = t ? f : e ? d : i.findDotsAtSegment(s, a, l[0], l[1], l[2], l[3], l[4], l[5], 1), u.alpha && (u = {
                    x: u.x,
                    y: u.y,
                    alpha: u.alpha
                }), u
            }
        },
        ri = ni(1),
        oi = ni(),
        si = ni(0, 1);
    i.getTotalLength = ri, i.getPointAtLength = oi, i.getSubpath = function(t, e, i) {
        if (1e-6 > this.getTotalLength(t) - i) return si(t, e).end;
        var n = si(t, i, 1);
        return e ? si(n, e).end : n
    }, Ze.getTotalLength = function() {
        var t = this.getPath();
        if (t) return this.node.getTotalLength ? this.node.getTotalLength() : ri(t)
    }, Ze.getPointAtLength = function(t) {
        var e = this.getPath();
        if (e) return oi(e, t)
    }, Ze.getPath = function() {
        var t, e = i._getPath[this.type];
        if ("text" != this.type && "set" != this.type) return e && (t = e(this)), t
    }, Ze.getSubpath = function(t, e) {
        var n = this.getPath();
        if (n) return i.getSubpath(n, t, e)
    };
    var ai = i.easing_formulas = {
        linear: function(t) {
            return t
        },
        "<": function(t) {
            return H(t, 1.7)
        },
        ">": function(t) {
            return H(t, .48)
        },
        "<>": function(t) {
            var e = .48 - t / 1.04,
                i = R.sqrt(.1734 + e * e),
                n = i - e,
                r = H(q(n), 1 / 3) * (0 > n ? -1 : 1),
                o = -i - e,
                s = H(q(o), 1 / 3) * (0 > o ? -1 : 1),
                a = r + s + .5;
            return 3 * (1 - a) * a * a + a * a * a
        },
        backIn: function(t) {
            var e = 1.70158;
            return t * t * ((e + 1) * t - e)
        },
        backOut: function(t) {
            t -= 1;
            var e = 1.70158;
            return t * t * ((e + 1) * t + e) + 1
        },
        elastic: function(t) {
            return t == !!t ? t : H(2, -10 * t) * R.sin(2 * (t - .075) * W / .3) + 1
        },
        bounce: function(t) {
            var e, i = 7.5625,
                n = 2.75;
            return 1 / n > t ? e = i * t * t : 2 / n > t ? (t -= 1.5 / n, e = i * t * t + .75) : 2.5 / n > t ? (t -= 2.25 / n, e = i * t * t + .9375) : (t -= 2.625 / n, e = i * t * t + .984375), e
        }
    };
    ai.easeIn = ai["ease-in"] = ai["<"], ai.easeOut = ai["ease-out"] = ai[">"], ai.easeInOut = ai["ease-in-out"] = ai["<>"], ai["back-in"] = ai.backIn, ai["back-out"] = ai.backOut;
    var li = [],
        ci = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function(t) {
            setTimeout(t, 16)
        },
        ui = function() {
            for (var t = +new Date, n = 0; li.length > n; n++) {
                var r = li[n];
                if (!r.el.removed && !r.paused) {
                    var o, s, a = t - r.start,
                        l = r.ms,
                        c = r.easing,
                        u = r.from,
                        h = r.diff,
                        d = r.to,
                        f = (r.t, r.el),
                        p = {},
                        g = {};
                    if (r.initstatus ? (a = (r.initstatus * r.anim.top - r.prev) / (r.percent - r.prev) * l, r.status = r.initstatus, delete r.initstatus, r.stop && li.splice(n--, 1)) : r.status = (r.prev + (r.percent - r.prev) * (a / l)) / r.anim.top, !(0 > a))
                        if (l > a) {
                            var _ = c(a / l);
                            for (var m in u)
                                if (u[C](m)) {
                                    switch (ne[m]) {
                                        case X:
                                            o = +u[m] + _ * l * h[m];
                                            break;
                                        case "colour":
                                            o = "rgb(" + [hi(Z(u[m].r + _ * l * h[m].r)), hi(Z(u[m].g + _ * l * h[m].g)), hi(Z(u[m].b + _ * l * h[m].b))].join(",") + ")";
                                            break;
                                        case "path":
                                            o = [];
                                            for (var y = 0, b = u[m].length; b > y; y++) {
                                                o[y] = [u[m][y][0]];
                                                for (var w = 1, x = u[m][y].length; x > w; w++) o[y][w] = +u[m][y][w] + _ * l * h[m][y][w];
                                                o[y] = o[y].join(L)
                                            }
                                            o = o.join(L);
                                            break;
                                        case "transform":
                                            if (h[m].real)
                                                for (o = [], y = 0, b = u[m].length; b > y; y++)
                                                    for (o[y] = [u[m][y][0]], w = 1, x = u[m][y].length; x > w; w++) o[y][w] = u[m][y][w] + _ * l * h[m][y][w];
                                            else {
                                                var k = function(t) {
                                                    return +u[m][t] + _ * l * h[m][t]
                                                };
                                                o = [
                                                    ["m", k(0), k(1), k(2), k(3), k(4), k(5)]
                                                ]
                                            }
                                            break;
                                        case "csv":
                                            if ("clip-rect" == m)
                                                for (o = [], y = 4; y--;) o[y] = +u[m][y] + _ * l * h[m][y];
                                            break;
                                        default:
                                            var T = [][N](u[m]);
                                            for (o = [], y = f.paper.customAttributes[m].length; y--;) o[y] = +T[y] + _ * l * h[m][y]
                                    }
                                    p[m] = o
                                }
                            f.attr(p),
                            function(t, i, n) {
                                setTimeout(function() {
                                    e("raphael.anim.frame." + t, i, n)
                                })
                            }(f.id, f, r.anim)
                        } else {
                            if (function(t, n, r) {
                                setTimeout(function() {
                                    e("raphael.anim.frame." + n.id, n, r), e("raphael.anim.finish." + n.id, n, r), i.is(t, "function") && t.call(n)
                                })
                            }(r.callback, f, r.anim), f.attr(d), li.splice(n--, 1), r.repeat > 1 && !r.next) {
                                for (s in d) d[C](s) && (g[s] = r.totalOrigin[s]);
                                r.el.attr(g), v(r.anim, r.el, r.anim.percents[0], null, r.totalOrigin, r.repeat - 1)
                            }
                            r.next && !r.stop && v(r.anim, r.el, r.next, null, r.totalOrigin, r.repeat)
                        }
                }
            }
            i.svg && f && f.paper && f.paper.safari(), li.length && ci(ui)
        },
        hi = function(t) {
            return t > 255 ? 255 : 0 > t ? 0 : t
        };
    Ze.animateWith = function(t, e, n, r, o, s) {
        var a = this;
        if (a.removed) return s && s.call(a), a;
        var l = n instanceof m ? n : i.animation(n, r, o, s);
        v(l, a, l.percents[0], null, a.attr());
        for (var c = 0, u = li.length; u > c; c++)
            if (li[c].anim == e && li[c].el == t) {
                li[u - 1].start = li[c].start;
                break
            }
        return a
    }, Ze.onAnimation = function(t) {
        return t ? e.on("raphael.anim.frame." + this.id, t) : e.unbind("raphael.anim.frame." + this.id), this
    }, m.prototype.delay = function(t) {
        var e = new m(this.anim, this.ms);
        return e.times = this.times, e.del = +t || 0, e
    }, m.prototype.repeat = function(t) {
        var e = new m(this.anim, this.ms);
        return e.del = this.del, e.times = R.floor(O(t, 0)) || 1, e
    }, i.animation = function(t, e, n, r) {
        if (t instanceof m) return t;
        (i.is(n, "function") || !n) && (r = r || n || null, n = null), t = Object(t), e = +e || 0;
        var o, s, a = {};
        for (s in t) t[C](s) && Q(s) != s && Q(s) + "%" != s && (o = !0, a[s] = t[s]);
        return o ? (n && (a.easing = n), r && (a.callback = r), new m({
            100: a
        }, e)) : new m(t, e)
    }, Ze.animate = function(t, e, n, r) {
        var o = this;
        if (o.removed) return r && r.call(o), o;
        var s = t instanceof m ? t : i.animation(t, e, n, r);
        return v(s, o, s.percents[0], null, o.attr()), o
    }, Ze.setTime = function(t, e) {
        return t && null != e && this.status(t, F(e, t.ms) / t.ms), this
    }, Ze.status = function(t, e) {
        var i, n, r = [],
            o = 0;
        if (null != e) return v(t, this, -1, F(e, 1)), this;
        for (i = li.length; i > o; o++)
            if (n = li[o], n.el.id == this.id && (!t || n.anim == t)) {
                if (t) return n.status;
                r.push({
                    anim: n.anim,
                    status: n.status
                })
            }
        return t ? 0 : r
    }, Ze.pause = function(t) {
        for (var i = 0; li.length > i; i++) li[i].el.id != this.id || t && li[i].anim != t || e("raphael.anim.pause." + this.id, this, li[i].anim) !== !1 && (li[i].paused = !0);
        return this
    }, Ze.resume = function(t) {
        for (var i = 0; li.length > i; i++)
            if (li[i].el.id == this.id && (!t || li[i].anim == t)) {
                var n = li[i];
                e("raphael.anim.resume." + this.id, this, n.anim) !== !1 && (delete n.paused, this.status(n.anim, n.status))
            }
        return this
    }, Ze.stop = function(t) {
        for (var i = 0; li.length > i; i++) li[i].el.id != this.id || t && li[i].anim != t || e("raphael.anim.stop." + this.id, this, li[i].anim) !== !1 && li.splice(i--, 1);
        return this
    }, e.on("raphael.remove", y), e.on("raphael.clear", y), Ze.toString = function() {
        return "Raphaël’s object"
    };
    var di = function(t) {
            if (this.items = [], this.length = 0, this.type = "set", t)
                for (var e = 0, i = t.length; i > e; e++)!t[e] || t[e].constructor != Ze.constructor && t[e].constructor != di || (this[this.items.length] = this.items[this.items.length] = t[e], this.length++)
        },
        fi = di.prototype;
    fi.push = function() {
        for (var t, e, i = 0, n = arguments.length; n > i; i++) t = arguments[i], !t || t.constructor != Ze.constructor && t.constructor != di || (e = this.items.length, this[e] = this.items[e] = t, this.length++);
        return this
    }, fi.pop = function() {
        return this.length && delete this[this.length--], this.items.pop()
    }, fi.forEach = function(t, e) {
        for (var i = 0, n = this.items.length; n > i; i++)
            if (t.call(e, this.items[i], i) === !1) return this;
        return this
    };
    for (var pi in Ze) Ze[C](pi) && (fi[pi] = function(t) {
        return function() {
            var e = arguments;
            return this.forEach(function(i) {
                i[t][$](i, e)
            })
        }
    }(pi));
    return fi.attr = function(t, e) {
            if (t && i.is(t, V) && i.is(t[0], "object"))
                for (var n = 0, r = t.length; r > n; n++) this.items[n].attr(t[n]);
            else
                for (var o = 0, s = this.items.length; s > o; o++) this.items[o].attr(t, e);
            return this
        }, fi.clear = function() {
            for (; this.length;) this.pop()
        }, fi.splice = function(t, e) {
            t = 0 > t ? O(this.length + t, 0) : t, e = O(0, F(this.length - t, e));
            var i, n = [],
                r = [],
                o = [];
            for (i = 2; arguments.length > i; i++) o.push(arguments[i]);
            for (i = 0; e > i; i++) r.push(this[t + i]);
            for (; this.length - t > i; i++) n.push(this[t + i]);
            var s = o.length;
            for (i = 0; s + n.length > i; i++) this.items[t + i] = this[t + i] = s > i ? o[i] : n[i - s];
            for (i = this.items.length = this.length -= e - s; this[i];) delete this[i++];
            return new di(r)
        }, fi.exclude = function(t) {
            for (var e = 0, i = this.length; i > e; e++)
                if (this[e] == t) return this.splice(e, 1), !0
        }, fi.animate = function(t, e, n, r) {
            (i.is(n, "function") || !n) && (r = n || null);
            var o, s, a = this.items.length,
                l = a,
                c = this;
            if (!a) return this;
            r && (s = function() {
                !--a && r.call(c)
            }), n = i.is(n, Y) ? n : s;
            var u = i.animation(t, e, n, s);
            for (o = this.items[--l].animate(u); l--;) this.items[l] && !this.items[l].removed && this.items[l].animateWith(o, u, u), this.items[l] && !this.items[l].removed || a--;
            return this
        }, fi.insertAfter = function(t) {
            for (var e = this.items.length; e--;) this.items[e].insertAfter(t);
            return this
        }, fi.getBBox = function() {
            for (var t = [], e = [], i = [], n = [], r = this.items.length; r--;)
                if (!this.items[r].removed) {
                    var o = this.items[r].getBBox();
                    t.push(o.x), e.push(o.y), i.push(o.x + o.width), n.push(o.y + o.height)
                }
            return t = F[$](0, t), e = F[$](0, e), i = O[$](0, i), n = O[$](0, n), {
                x: t,
                y: e,
                x2: i,
                y2: n,
                width: i - t,
                height: n - e
            }
        }, fi.clone = function(t) {
            t = this.paper.set();
            for (var e = 0, i = this.items.length; i > e; e++) t.push(this.items[e].clone());
            return t
        }, fi.toString = function() {
            return "Raphaël‘s set"
        }, fi.glow = function(t) {
            var e = this.paper.set();
            return this.forEach(function(i) {
                var n = i.glow(t);
                null != n && n.forEach(function(t) {
                    e.push(t)
                })
            }), e
        }, fi.isPointInside = function(t, e) {
            var i = !1;
            return this.forEach(function(n) {
                return n.isPointInside(t, e) ? (console.log("runned"), i = !0, !1) : void 0
            }), i
        }, i.registerFont = function(t) {
            if (!t.face) return t;
            this.fonts = this.fonts || {};
            var e = {
                    w: t.w,
                    face: {},
                    glyphs: {}
                },
                i = t.face["font-family"];
            for (var n in t.face) t.face[C](n) && (e.face[n] = t.face[n]);
            if (this.fonts[i] ? this.fonts[i].push(e) : this.fonts[i] = [e], !t.svg) {
                e.face["units-per-em"] = te(t.face["units-per-em"], 10);
                for (var r in t.glyphs)
                    if (t.glyphs[C](r)) {
                        var o = t.glyphs[r];
                        if (e.glyphs[r] = {
                            w: o.w,
                            k: {},
                            d: o.d && "M" + o.d.replace(/[mlcxtrv]/g, function(t) {
                                return {
                                    l: "L",
                                    c: "C",
                                    x: "z",
                                    t: "m",
                                    r: "l",
                                    v: "c"
                                }[t] || "M"
                            }) + "z"
                        }, o.k)
                            for (var s in o.k) o[C](s) && (e.glyphs[r].k[s] = o.k[s])
                    }
            }
            return t
        }, w.getFont = function(t, e, n, r) {
            if (r = r || "normal", n = n || "normal", e = +e || {
                normal: 400,
                bold: 700,
                lighter: 300,
                bolder: 800
            }[e] || 400, i.fonts) {
                var o = i.fonts[t];
                if (!o) {
                    var s = RegExp("(^|\\s)" + t.replace(/[^\w\d\s+!~.:_-]/g, M) + "(\\s|$)", "i");
                    for (var a in i.fonts)
                        if (i.fonts[C](a) && s.test(a)) {
                            o = i.fonts[a];
                            break
                        }
                }
                var l;
                if (o)
                    for (var c = 0, u = o.length; u > c && (l = o[c], l.face["font-weight"] != e || l.face["font-style"] != n && l.face["font-style"] || l.face["font-stretch"] != r); c++);
                return l
            }
        }, w.print = function(t, e, n, r, o, s, a, l) {
            s = s || "middle", a = O(F(a || 0, 1), -1), l = O(F(l || 1, 3), 1);
            var c, u = B(n)[A](M),
                h = 0,
                d = 0,
                f = M;
            if (i.is(r, "string") && (r = this.getFont(r)), r) {
                c = (o || 16) / r.face["units-per-em"];
                for (var p = r.face.bbox[A](x), g = +p[0], _ = p[3] - p[1], m = 0, v = +p[1] + ("baseline" == s ? _ + +r.face.descent : _ / 2), y = 0, b = u.length; b > y; y++) {
                    if ("\n" == u[y]) h = 0, k = 0, d = 0, m += _ * l;
                    else {
                        var w = d && r.glyphs[u[y - 1]] || {},
                            k = r.glyphs[u[y]];
                        h += d ? (w.w || r.w) + (w.k && w.k[u[y]] || 0) + r.w * a : 0, d = 1
                    }
                    k && k.d && (f += i.transformPath(k.d, ["t", h * c, m * c, "s", c, c, g, v, "t", (t - g) / c, (e - v) / c]))
                }
            }
            return this.path(f).attr({
                fill: "#000",
                stroke: "none"
            })
        }, w.add = function(t) {
            if (i.is(t, "array"))
                for (var e, n = this.set(), r = 0, o = t.length; o > r; r++) e = t[r] || {}, k[C](e.type) && n.push(this[e.type]().attr(e));
            return n
        }, i.format = function(t, e) {
            var n = i.is(e, V) ? [0][N](e) : arguments;
            return t && i.is(t, Y) && n.length - 1 && (t = t.replace(T, function(t, e) {
                return null == n[++e] ? M : n[e]
            })), t || M
        }, i.fullfill = function() {
            var t = /\{([^\}]+)\}/g,
                e = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
                i = function(t, i, n) {
                    var r = n;
                    return i.replace(e, function(t, e, i, n, o) {
                        e = e || n, r && (e in r && (r = r[e]), "function" == typeof r && o && (r = r()))
                    }), r = (null == r || r == n ? t : r) + ""
                };
            return function(e, n) {
                return (e + "").replace(t, function(t, e) {
                    return i(t, e, n)
                })
            }
        }(), i.ninja = function() {
            return E.was ? S.win.Raphael = E.is : delete Raphael, i
        }, i.st = fi,
        function(t, e, n) {
            function r() {
                /in/.test(t.readyState) ? setTimeout(r, 9) : i.eve("raphael.DOMload")
            }
            null == t.readyState && t.addEventListener && (t.addEventListener(e, n = function() {
                t.removeEventListener(e, n, !1), t.readyState = "complete"
            }, !1), t.readyState = "loading"), r()
        }(document, "DOMContentLoaded"), e.on("raphael.DOMload", function() {
            b = !0
        }),
        function() {
            if (i.svg) {
                var t = "hasOwnProperty",
                    e = String,
                    n = parseFloat,
                    r = parseInt,
                    o = Math,
                    s = o.max,
                    a = o.abs,
                    l = o.pow,
                    c = /[, ]+/,
                    u = i.eve,
                    h = "",
                    d = " ",
                    f = "http://www.w3.org/1999/xlink",
                    p = {
                        block: "M5,0 0,2.5 5,5z",
                        classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
                        diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
                        open: "M6,1 1,3.5 6,6",
                        oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
                    },
                    g = {};
                i.toString = function() {
                    return "Your browser supports SVG.\nYou are running Raphaël " + this.version
                };
                var _ = function(n, r) {
                        if (r) {
                            "string" == typeof n && (n = _(n));
                            for (var o in r) r[t](o) && ("xlink:" == o.substring(0, 6) ? n.setAttributeNS(f, o.substring(6), e(r[o])) : n.setAttribute(o, e(r[o])))
                        } else n = i._g.doc.createElementNS("http://www.w3.org/2000/svg", n), n.style && (n.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
                        return n
                    },
                    m = function(t, r) {
                        var c = "linear",
                            u = t.id + r,
                            d = .5,
                            f = .5,
                            p = t.node,
                            g = t.paper,
                            m = p.style,
                            v = i._g.doc.getElementById(u);
                        if (!v) {
                            if (r = e(r).replace(i._radial_gradient, function(t, e, i) {
                                if (c = "radial", e && i) {
                                    d = n(e), f = n(i);
                                    var r = 2 * (f > .5) - 1;
                                    l(d - .5, 2) + l(f - .5, 2) > .25 && (f = o.sqrt(.25 - l(d - .5, 2)) * r + .5) && .5 != f && (f = f.toFixed(5) - 1e-5 * r)
                                }
                                return h
                            }), r = r.split(/\s*\-\s*/), "linear" == c) {
                                var y = r.shift();
                                if (y = -n(y), isNaN(y)) return null;
                                var b = [0, 0, o.cos(i.rad(y)), o.sin(i.rad(y))],
                                    w = 1 / (s(a(b[2]), a(b[3])) || 1);
                                b[2] *= w, b[3] *= w, 0 > b[2] && (b[0] = -b[2], b[2] = 0), 0 > b[3] && (b[1] = -b[3], b[3] = 0)
                            }
                            var x = i._parseDots(r);
                            if (!x) return null;
                            if (u = u.replace(/[\(\)\s,\xb0#]/g, "_"), t.gradient && u != t.gradient.id && (g.defs.removeChild(t.gradient), delete t.gradient), !t.gradient) {
                                v = _(c + "Gradient", {
                                    id: u
                                }), t.gradient = v, _(v, "radial" == c ? {
                                    fx: d,
                                    fy: f
                                } : {
                                    x1: b[0],
                                    y1: b[1],
                                    x2: b[2],
                                    y2: b[3],
                                    gradientTransform: t.matrix.invert()
                                }), g.defs.appendChild(v);
                                for (var k = 0, T = x.length; T > k; k++) v.appendChild(_("stop", {
                                    offset: x[k].offset ? x[k].offset : k ? "100%" : "0%",
                                    "stop-color": x[k].color || "#fff"
                                }))
                            }
                        }
                        return _(p, {
                            fill: "url(#" + u + ")",
                            opacity: 1,
                            "fill-opacity": 1
                        }), m.fill = h, m.opacity = 1, m.fillOpacity = 1, 1
                    },
                    v = function(t) {
                        var e = t.getBBox(1);
                        _(t.pattern, {
                            patternTransform: t.matrix.invert() + " translate(" + e.x + "," + e.y + ")"
                        })
                    },
                    y = function(n, r, o) {
                        if ("path" == n.type) {
                            for (var s, a, l, c, u, d = e(r).toLowerCase().split("-"), f = n.paper, m = o ? "end" : "start", v = n.node, y = n.attrs, b = y["stroke-width"], w = d.length, x = "classic", k = 3, T = 3, C = 5; w--;) switch (d[w]) {
                                case "block":
                                case "classic":
                                case "oval":
                                case "diamond":
                                case "open":
                                case "none":
                                    x = d[w];
                                    break;
                                case "wide":
                                    T = 5;
                                    break;
                                case "narrow":
                                    T = 2;
                                    break;
                                case "long":
                                    k = 5;
                                    break;
                                case "short":
                                    k = 2
                            }
                            if ("open" == x ? (k += 2, T += 2, C += 2, l = 1, c = o ? 4 : 1, u = {
                                fill: "none",
                                stroke: y.stroke
                            }) : (c = l = k / 2, u = {
                                fill: y.stroke,
                                stroke: "none"
                            }), n._.arrows ? o ? (n._.arrows.endPath && g[n._.arrows.endPath]--, n._.arrows.endMarker && g[n._.arrows.endMarker]--) : (n._.arrows.startPath && g[n._.arrows.startPath]--, n._.arrows.startMarker && g[n._.arrows.startMarker]--) : n._.arrows = {}, "none" != x) {
                                var S = "raphael-marker-" + x,
                                    E = "raphael-marker-" + m + x + k + T;
                                i._g.doc.getElementById(S) ? g[S]++ : (f.defs.appendChild(_(_("path"), {
                                    "stroke-linecap": "round",
                                    d: p[x],
                                    id: S
                                })), g[S] = 1);
                                var j, $ = i._g.doc.getElementById(E);
                                $ ? (g[E]++, j = $.getElementsByTagName("use")[0]) : ($ = _(_("marker"), {
                                    id: E,
                                    markerHeight: T,
                                    markerWidth: k,
                                    orient: "auto",
                                    refX: c,
                                    refY: T / 2
                                }), j = _(_("use"), {
                                    "xlink:href": "#" + S,
                                    transform: (o ? "rotate(180 " + k / 2 + " " + T / 2 + ") " : h) + "scale(" + k / C + "," + T / C + ")",
                                    "stroke-width": (1 / ((k / C + T / C) / 2)).toFixed(4)
                                }), $.appendChild(j), f.defs.appendChild($), g[E] = 1), _(j, u);
                                var N = l * ("diamond" != x && "oval" != x);
                                o ? (s = n._.arrows.startdx * b || 0, a = i.getTotalLength(y.path) - N * b) : (s = N * b, a = i.getTotalLength(y.path) - (n._.arrows.enddx * b || 0)), u = {}, u["marker-" + m] = "url(#" + E + ")", (a || s) && (u.d = i.getSubpath(y.path, s, a)), _(v, u), n._.arrows[m + "Path"] = S, n._.arrows[m + "Marker"] = E, n._.arrows[m + "dx"] = N, n._.arrows[m + "Type"] = x, n._.arrows[m + "String"] = r
                            } else o ? (s = n._.arrows.startdx * b || 0, a = i.getTotalLength(y.path) - s) : (s = 0, a = i.getTotalLength(y.path) - (n._.arrows.enddx * b || 0)), n._.arrows[m + "Path"] && _(v, {
                                d: i.getSubpath(y.path, s, a)
                            }), delete n._.arrows[m + "Path"], delete n._.arrows[m + "Marker"], delete n._.arrows[m + "dx"], delete n._.arrows[m + "Type"], delete n._.arrows[m + "String"];
                            for (u in g)
                                if (g[t](u) && !g[u]) {
                                    var D = i._g.doc.getElementById(u);
                                    D && D.parentNode.removeChild(D)
                                }
                        }
                    },
                    b = {
                        "": [0],
                        none: [0],
                        "-": [3, 1],
                        ".": [1, 1],
                        "-.": [3, 1, 1, 1],
                        "-..": [3, 1, 1, 1, 1, 1],
                        ". ": [1, 3],
                        "- ": [4, 3],
                        "--": [8, 3],
                        "- .": [4, 3, 1, 3],
                        "--.": [8, 3, 1, 3],
                        "--..": [8, 3, 1, 3, 1, 3]
                    },
                    w = function(t, i, n) {
                        if (i = b[e(i).toLowerCase()]) {
                            for (var r = t.attrs["stroke-width"] || "1", o = {
                                round: r,
                                square: r,
                                butt: 0
                            }[t.attrs["stroke-linecap"] || n["stroke-linecap"]] || 0, s = [], a = i.length; a--;) s[a] = i[a] * r + (a % 2 ? 1 : -1) * o;
                            _(t.node, {
                                "stroke-dasharray": s.join(",")
                            })
                        }
                    },
                    x = function(n, o) {
                        var l = n.node,
                            u = n.attrs,
                            d = l.style.visibility;
                        l.style.visibility = "hidden";
                        for (var p in o)
                            if (o[t](p)) {
                                if (!i._availableAttrs[t](p)) continue;
                                var g = o[p];
                                switch (u[p] = g, p) {
                                    case "blur":
                                        n.blur(g);
                                        break;
                                    case "href":
                                    case "title":
                                    case "target":
                                        var b = l.parentNode;
                                        if ("a" != b.tagName.toLowerCase()) {
                                            var x = _("a");
                                            b.insertBefore(x, l), x.appendChild(l), b = x
                                        }
                                        "target" == p ? b.setAttributeNS(f, "show", "blank" == g ? "new" : g) : b.setAttributeNS(f, p, g);
                                        break;
                                    case "cursor":
                                        l.style.cursor = g;
                                        break;
                                    case "transform":
                                        n.transform(g);
                                        break;
                                    case "arrow-start":
                                        y(n, g);
                                        break;
                                    case "arrow-end":
                                        y(n, g, 1);
                                        break;
                                    case "clip-rect":
                                        var k = e(g).split(c);
                                        if (4 == k.length) {
                                            n.clip && n.clip.parentNode.parentNode.removeChild(n.clip.parentNode);
                                            var C = _("clipPath"),
                                                S = _("rect");
                                            C.id = i.createUUID(), _(S, {
                                                x: k[0],
                                                y: k[1],
                                                width: k[2],
                                                height: k[3]
                                            }), C.appendChild(S), n.paper.defs.appendChild(C), _(l, {
                                                "clip-path": "url(#" + C.id + ")"
                                            }), n.clip = S
                                        }
                                        if (!g) {
                                            var E = l.getAttribute("clip-path");
                                            if (E) {
                                                var j = i._g.doc.getElementById(E.replace(/(^url\(#|\)$)/g, h));
                                                j && j.parentNode.removeChild(j), _(l, {
                                                    "clip-path": h
                                                }), delete n.clip
                                            }
                                        }
                                        break;
                                    case "path":
                                        "path" == n.type && (_(l, {
                                            d: g ? u.path = i._pathToAbsolute(g) : "M0,0"
                                        }), n._.dirty = 1, n._.arrows && ("startString" in n._.arrows && y(n, n._.arrows.startString), "endString" in n._.arrows && y(n, n._.arrows.endString, 1)));
                                        break;
                                    case "width":
                                        if (l.setAttribute(p, g), n._.dirty = 1, !u.fx) break;
                                        p = "x", g = u.x;
                                    case "x":
                                        u.fx && (g = -u.x - (u.width || 0));
                                    case "rx":
                                        if ("rx" == p && "rect" == n.type) break;
                                    case "cx":
                                        l.setAttribute(p, g), n.pattern && v(n), n._.dirty = 1;
                                        break;
                                    case "height":
                                        if (l.setAttribute(p, g), n._.dirty = 1, !u.fy) break;
                                        p = "y", g = u.y;
                                    case "y":
                                        u.fy && (g = -u.y - (u.height || 0));
                                    case "ry":
                                        if ("ry" == p && "rect" == n.type) break;
                                    case "cy":
                                        l.setAttribute(p, g), n.pattern && v(n), n._.dirty = 1;
                                        break;
                                    case "r":
                                        "rect" == n.type ? _(l, {
                                            rx: g,
                                            ry: g
                                        }) : l.setAttribute(p, g), n._.dirty = 1;
                                        break;
                                    case "src":
                                        "image" == n.type && l.setAttributeNS(f, "href", g);
                                        break;
                                    case "stroke-width":
                                        (1 != n._.sx || 1 != n._.sy) && (g /= s(a(n._.sx), a(n._.sy)) || 1), n.paper._vbSize && (g *= n.paper._vbSize), l.setAttribute(p, g), u["stroke-dasharray"] && w(n, u["stroke-dasharray"], o), n._.arrows && ("startString" in n._.arrows && y(n, n._.arrows.startString), "endString" in n._.arrows && y(n, n._.arrows.endString, 1));
                                        break;
                                    case "stroke-dasharray":
                                        w(n, g, o);
                                        break;
                                    case "fill":
                                        var $ = e(g).match(i._ISURL);
                                        if ($) {
                                            C = _("pattern");
                                            var N = _("image");
                                            C.id = i.createUUID(), _(C, {
                                                x: 0,
                                                y: 0,
                                                patternUnits: "userSpaceOnUse",
                                                height: 1,
                                                width: 1
                                            }), _(N, {
                                                x: 0,
                                                y: 0,
                                                "xlink:href": $[1]
                                            }), C.appendChild(N),
                                            function(t) {
                                                i._preload($[1], function() {
                                                    var e = this.offsetWidth,
                                                        i = this.offsetHeight;
                                                    _(t, {
                                                        width: e,
                                                        height: i
                                                    }), _(N, {
                                                        width: e,
                                                        height: i
                                                    }), n.paper.safari()
                                                })
                                            }(C), n.paper.defs.appendChild(C), _(l, {
                                                fill: "url(#" + C.id + ")"
                                            }), n.pattern = C, n.pattern && v(n);
                                            break
                                        }
                                        var D = i.getRGB(g);
                                        if (D.error) {
                                            if (("circle" == n.type || "ellipse" == n.type || "r" != e(g).charAt()) && m(n, g)) {
                                                if ("opacity" in u || "fill-opacity" in u) {
                                                    var M = i._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g, h));
                                                    if (M) {
                                                        var L = M.getElementsByTagName("stop");
                                                        _(L[L.length - 1], {
                                                            "stop-opacity": ("opacity" in u ? u.opacity : 1) * ("fill-opacity" in u ? u["fill-opacity"] : 1)
                                                        })
                                                    }
                                                }
                                                u.gradient = g, u.fill = "none";
                                                break
                                            }
                                        } else delete o.gradient, delete u.gradient, !i.is(u.opacity, "undefined") && i.is(o.opacity, "undefined") && _(l, {
                                            opacity: u.opacity
                                        }), !i.is(u["fill-opacity"], "undefined") && i.is(o["fill-opacity"], "undefined") && _(l, {
                                            "fill-opacity": u["fill-opacity"]
                                        });
                                        D[t]("opacity") && _(l, {
                                            "fill-opacity": D.opacity > 1 ? D.opacity / 100 : D.opacity
                                        });
                                    case "stroke":
                                        D = i.getRGB(g), l.setAttribute(p, D.hex), "stroke" == p && D[t]("opacity") && _(l, {
                                            "stroke-opacity": D.opacity > 1 ? D.opacity / 100 : D.opacity
                                        }), "stroke" == p && n._.arrows && ("startString" in n._.arrows && y(n, n._.arrows.startString), "endString" in n._.arrows && y(n, n._.arrows.endString, 1));
                                        break;
                                    case "gradient":
                                        ("circle" == n.type || "ellipse" == n.type || "r" != e(g).charAt()) && m(n, g);
                                        break;
                                    case "opacity":
                                        u.gradient && !u[t]("stroke-opacity") && _(l, {
                                            "stroke-opacity": g > 1 ? g / 100 : g
                                        });
                                    case "fill-opacity":
                                        if (u.gradient) {
                                            M = i._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g, h)), M && (L = M.getElementsByTagName("stop"), _(L[L.length - 1], {
                                                "stop-opacity": g
                                            }));
                                            break
                                        }
                                    default:
                                        "font-size" == p && (g = r(g, 10) + "px");
                                        var B = p.replace(/(\-.)/g, function(t) {
                                            return t.substring(1).toUpperCase()
                                        });
                                        l.style[B] = g, n._.dirty = 1, l.setAttribute(p, g)
                                }
                            }
                        T(n, o), l.style.visibility = d
                    },
                    k = 1.2,
                    T = function(n, o) {
                        if ("text" == n.type && (o[t]("text") || o[t]("font") || o[t]("font-size") || o[t]("x") || o[t]("y"))) {
                            var s = n.attrs,
                                a = n.node,
                                l = a.firstChild ? r(i._g.doc.defaultView.getComputedStyle(a.firstChild, h).getPropertyValue("font-size"), 10) : 10;
                            if (o[t]("text")) {
                                for (s.text = o.text; a.firstChild;) a.removeChild(a.firstChild);
                                for (var c, u = e(o.text).split("\n"), d = [], f = 0, p = u.length; p > f; f++) c = _("tspan"), f && _(c, {
                                    dy: l * k,
                                    x: s.x
                                }), c.appendChild(i._g.doc.createTextNode(u[f])), a.appendChild(c), d[f] = c
                            } else
                                for (d = a.getElementsByTagName("tspan"), f = 0, p = d.length; p > f; f++) f ? _(d[f], {
                                    dy: l * k,
                                    x: s.x
                                }) : _(d[0], {
                                    dy: 0
                                });
                            _(a, {
                                x: s.x,
                                y: s.y
                            }), n._.dirty = 1;
                            var g = n._getBBox(),
                                m = s.y - (g.y + g.height / 2);
                            m && i.is(m, "finite") && _(d[0], {
                                dy: m
                            })
                        }
                    },
                    C = function(t, e) {
                        this[0] = this.node = t, t.raphael = !0, this.id = i._oid++, t.raphaelid = this.id, this.matrix = i.matrix(), this.realPath = null, this.paper = e, this.attrs = this.attrs || {}, this._ = {
                            transform: [],
                            sx: 1,
                            sy: 1,
                            deg: 0,
                            dx: 0,
                            dy: 0,
                            dirty: 1
                        }, !e.bottom && (e.bottom = this), this.prev = e.top, e.top && (e.top.next = this), e.top = this, this.next = null
                    },
                    S = i.el;
                C.prototype = S, S.constructor = C, i._engine.path = function(t, e) {
                    var i = _("path");
                    e.canvas && e.canvas.appendChild(i);
                    var n = new C(i, e);
                    return n.type = "path", x(n, {
                        fill: "none",
                        stroke: "#000",
                        path: t
                    }), n
                }, S.rotate = function(t, i, r) {
                    if (this.removed) return this;
                    if (t = e(t).split(c), t.length - 1 && (i = n(t[1]), r = n(t[2])), t = n(t[0]), null == r && (i = r), null == i || null == r) {
                        var o = this.getBBox(1);
                        i = o.x + o.width / 2, r = o.y + o.height / 2
                    }
                    return this.transform(this._.transform.concat([
                        ["r", t, i, r]
                    ])), this
                }, S.scale = function(t, i, r, o) {
                    if (this.removed) return this;
                    if (t = e(t).split(c), t.length - 1 && (i = n(t[1]), r = n(t[2]), o = n(t[3])), t = n(t[0]), null == i && (i = t), null == o && (r = o), null == r || null == o) var s = this.getBBox(1);
                    return r = null == r ? s.x + s.width / 2 : r, o = null == o ? s.y + s.height / 2 : o, this.transform(this._.transform.concat([
                        ["s", t, i, r, o]
                    ])), this
                }, S.translate = function(t, i) {
                    return this.removed ? this : (t = e(t).split(c), t.length - 1 && (i = n(t[1])), t = n(t[0]) || 0, i = +i || 0, this.transform(this._.transform.concat([
                        ["t", t, i]
                    ])), this)
                }, S.transform = function(e) {
                    var n = this._;
                    if (null == e) return n.transform;
                    if (i._extractTransform(this, e), this.clip && _(this.clip, {
                        transform: this.matrix.invert()
                    }), this.pattern && v(this), this.node && _(this.node, {
                        transform: this.matrix
                    }), 1 != n.sx || 1 != n.sy) {
                        var r = this.attrs[t]("stroke-width") ? this.attrs["stroke-width"] : 1;
                        this.attr({
                            "stroke-width": r
                        })
                    }
                    return this
                }, S.hide = function() {
                    return !this.removed && this.paper.safari(this.node.style.display = "none"), this
                }, S.show = function() {
                    return !this.removed && this.paper.safari(this.node.style.display = ""), this
                }, S.remove = function() {
                    if (!this.removed && this.node.parentNode) {
                        var t = this.paper;
                        t.__set__ && t.__set__.exclude(this), u.unbind("raphael.*.*." + this.id), this.gradient && t.defs.removeChild(this.gradient), i._tear(this, t), "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.removeChild(this.node.parentNode) : this.node.parentNode.removeChild(this.node);
                        for (var e in this) this[e] = "function" == typeof this[e] ? i._removedFactory(e) : null;
                        this.removed = !0
                    }
                }, S._getBBox = function() {
                    if ("none" == this.node.style.display) {
                        this.show();
                        var t = !0
                    }
                    var e = {};
                    try {
                        e = this.node.getBBox()
                    } catch (i) {} finally {
                        e = e || {}
                    }
                    return t && this.hide(), e
                }, S.attr = function(e, n) {
                    if (this.removed) return this;
                    if (null == e) {
                        var r = {};
                        for (var o in this.attrs) this.attrs[t](o) && (r[o] = this.attrs[o]);
                        return r.gradient && "none" == r.fill && (r.fill = r.gradient) && delete r.gradient, r.transform = this._.transform, r
                    }
                    if (null == n && i.is(e, "string")) {
                        if ("fill" == e && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
                        if ("transform" == e) return this._.transform;
                        for (var s = e.split(c), a = {}, l = 0, h = s.length; h > l; l++) e = s[l], a[e] = e in this.attrs ? this.attrs[e] : i.is(this.paper.customAttributes[e], "function") ? this.paper.customAttributes[e].def : i._availableAttrs[e];
                        return h - 1 ? a : a[s[0]]
                    }
                    if (null == n && i.is(e, "array")) {
                        for (a = {}, l = 0, h = e.length; h > l; l++) a[e[l]] = this.attr(e[l]);
                        return a
                    }
                    if (null != n) {
                        var d = {};
                        d[e] = n
                    } else null != e && i.is(e, "object") && (d = e);
                    for (var f in d) u("raphael.attr." + f + "." + this.id, this, d[f]);
                    for (f in this.paper.customAttributes)
                        if (this.paper.customAttributes[t](f) && d[t](f) && i.is(this.paper.customAttributes[f], "function")) {
                            var p = this.paper.customAttributes[f].apply(this, [].concat(d[f]));
                            this.attrs[f] = d[f];
                            for (var g in p) p[t](g) && (d[g] = p[g])
                        }
                    return x(this, d), this
                }, S.toFront = function() {
                    if (this.removed) return this;
                    "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.appendChild(this.node.parentNode) : this.node.parentNode.appendChild(this.node);
                    var t = this.paper;
                    return t.top != this && i._tofront(this, t), this
                }, S.toBack = function() {
                    if (this.removed) return this;
                    var t = this.node.parentNode;
                    return "a" == t.tagName.toLowerCase() ? t.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild) : t.firstChild != this.node && t.insertBefore(this.node, this.node.parentNode.firstChild), i._toback(this, this.paper), this.paper, this
                }, S.insertAfter = function(t) {
                    if (this.removed) return this;
                    var e = t.node || t[t.length - 1].node;
                    return e.nextSibling ? e.parentNode.insertBefore(this.node, e.nextSibling) : e.parentNode.appendChild(this.node), i._insertafter(this, t, this.paper), this
                }, S.insertBefore = function(t) {
                    if (this.removed) return this;
                    var e = t.node || t[0].node;
                    return e.parentNode.insertBefore(this.node, e), i._insertbefore(this, t, this.paper), this
                }, S.blur = function(t) {
                    var e = this;
                    if (0 !== +t) {
                        var n = _("filter"),
                            r = _("feGaussianBlur");
                        e.attrs.blur = t, n.id = i.createUUID(), _(r, {
                            stdDeviation: +t || 1.5
                        }), n.appendChild(r), e.paper.defs.appendChild(n), e._blur = n, _(e.node, {
                            filter: "url(#" + n.id + ")"
                        })
                    } else e._blur && (e._blur.parentNode.removeChild(e._blur), delete e._blur, delete e.attrs.blur), e.node.removeAttribute("filter");
                    return e
                }, i._engine.circle = function(t, e, i, n) {
                    var r = _("circle");
                    t.canvas && t.canvas.appendChild(r);
                    var o = new C(r, t);
                    return o.attrs = {
                        cx: e,
                        cy: i,
                        r: n,
                        fill: "none",
                        stroke: "#000"
                    }, o.type = "circle", _(r, o.attrs), o
                }, i._engine.rect = function(t, e, i, n, r, o) {
                    var s = _("rect");
                    t.canvas && t.canvas.appendChild(s);
                    var a = new C(s, t);
                    return a.attrs = {
                        x: e,
                        y: i,
                        width: n,
                        height: r,
                        r: o || 0,
                        rx: o || 0,
                        ry: o || 0,
                        fill: "none",
                        stroke: "#000"
                    }, a.type = "rect", _(s, a.attrs), a
                }, i._engine.ellipse = function(t, e, i, n, r) {
                    var o = _("ellipse");
                    t.canvas && t.canvas.appendChild(o);
                    var s = new C(o, t);
                    return s.attrs = {
                        cx: e,
                        cy: i,
                        rx: n,
                        ry: r,
                        fill: "none",
                        stroke: "#000"
                    }, s.type = "ellipse", _(o, s.attrs), s
                }, i._engine.image = function(t, e, i, n, r, o) {
                    var s = _("image");
                    _(s, {
                        x: i,
                        y: n,
                        width: r,
                        height: o,
                        preserveAspectRatio: "none"
                    }), s.setAttributeNS(f, "href", e), t.canvas && t.canvas.appendChild(s);
                    var a = new C(s, t);
                    return a.attrs = {
                        x: i,
                        y: n,
                        width: r,
                        height: o,
                        src: e
                    }, a.type = "image", a
                }, i._engine.text = function(t, e, n, r) {
                    var o = _("text");
                    t.canvas && t.canvas.appendChild(o);
                    var s = new C(o, t);
                    return s.attrs = {
                        x: e,
                        y: n,
                        "text-anchor": "middle",
                        text: r,
                        font: i._availableAttrs.font,
                        stroke: "none",
                        fill: "#000"
                    }, s.type = "text", x(s, s.attrs), s
                }, i._engine.batchText = function(t, e) {
                    for (var i = document.createDocumentFragment(), n = 0; e.length > n; n++) {
                        var r = e[n],
                            o = _("text");
                        jQuery(o).text(r.text).attr(r.attrs), i.appendChild(o)
                    }
                    t.canvas && t.canvas.appendChild(i)
                }, i._engine.setSize = function(t, e) {
                    return this.width = t || this.width, this.height = e || this.height, this.canvas.setAttribute("width", this.width), this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox), this
                }, i._engine.create = function() {
                    var t = i._getContainer.apply(0, arguments),
                        e = t && t.container,
                        n = t.x,
                        r = t.y,
                        o = t.width,
                        s = t.height;
                    if (!e) throw Error("SVG container not found.");
                    var a, l = _("svg"),
                        c = "overflow:hidden;";
                    return n = n || 0, r = r || 0, o = o || 512, s = s || 342, _(l, {
                        height: s,
                        version: 1.1,
                        width: o,
                        xmlns: "http://www.w3.org/2000/svg"
                    }), 1 == e ? (l.style.cssText = c + "position:absolute;left:" + n + "px;top:" + r + "px", i._g.doc.body.appendChild(l), a = 1) : (l.style.cssText = c + "position:relative", e.firstChild ? e.insertBefore(l, e.firstChild) : e.appendChild(l)), e = new i._Paper, e.width = o, e.height = s, e.canvas = l, e.clear(), e._left = e._top = 0, a && (e.renderfix = function() {}), e.renderfix(), e
                }, i._engine.setViewBox = function(t, e, i, n, r) {
                    u("raphael.setViewBox", this, this._viewBox, [t, e, i, n, r]);
                    var o, a, l = s(i / this.width, n / this.height),
                        c = this.top,
                        h = r ? "meet" : "xMinYMin";
                    for (null == t ? (this._vbSize && (l = 1), delete this._vbSize, o = "0 0 " + this.width + d + this.height) : (this._vbSize = l, o = t + d + e + d + i + d + n), _(this.canvas, {
                        viewBox: o,
                        preserveAspectRatio: h
                    }); l && c;) a = "stroke-width" in c.attrs ? c.attrs["stroke-width"] : 1, c.attr({
                        "stroke-width": a
                    }), c._.dirty = 1, c._.dirtyT = 1, c = c.prev;
                    return this._viewBox = [t, e, i, n, !!r], this
                }, i.prototype.renderfix = function() {
                    var t, e = this.canvas,
                        i = e.style;
                    try {
                        t = e.getScreenCTM() || e.createSVGMatrix()
                    } catch (n) {
                        t = e.createSVGMatrix()
                    }
                    var r = -t.e % 1,
                        o = -t.f % 1;
                    (r || o) && (r && (this._left = (this._left + r) % 1, i.left = this._left + "px"), o && (this._top = (this._top + o) % 1, i.top = this._top + "px"))
                }, i.prototype.clear = function() {
                    i.eve("raphael.clear", this);
                    for (var t = this.canvas; t.firstChild;) t.removeChild(t.firstChild);
                    this.bottom = this.top = null, (this.desc = _("desc")).appendChild(i._g.doc.createTextNode("Created with Raphaël " + i.version)), t.appendChild(this.desc), t.appendChild(this.defs = _("defs"))
                }, i.prototype.remove = function() {
                    u("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
                    for (var t in this) this[t] = "function" == typeof this[t] ? i._removedFactory(t) : null
                };
                var E = i.st;
                for (var j in S) S[t](j) && !E[t](j) && (E[j] = function(t) {
                    return function() {
                        var e = arguments;
                        return this.forEach(function(i) {
                            i[t].apply(i, e)
                        })
                    }
                }(j))
            }
        }(),
        function() {
            if (i.vml) {
                var t = "hasOwnProperty",
                    e = String,
                    n = parseFloat,
                    r = Math,
                    o = r.round,
                    s = r.max,
                    a = r.min,
                    l = r.abs,
                    c = "fill",
                    u = /[, ]+/,
                    h = i.eve,
                    d = " progid:DXImageTransform.Microsoft",
                    f = " ",
                    p = "",
                    g = {
                        M: "m",
                        L: "l",
                        C: "c",
                        Z: "x",
                        m: "t",
                        l: "r",
                        c: "v",
                        z: "x"
                    },
                    _ = /([clmz]),?([^clmz]*)/gi,
                    m = / progid:\S+Blur\([^\)]+\)/g,
                    v = /-?[^,\s-]+/g,
                    y = "position:absolute;left:0;top:0;width:1px;height:1px",
                    b = 21600,
                    w = {
                        path: 1,
                        rect: 1,
                        image: 1
                    },
                    x = {
                        circle: 1,
                        ellipse: 1
                    },
                    k = function(t) {
                        var n = /[ahqstv]/gi,
                            r = i._pathToAbsolute;
                        if (e(t).match(n) && (r = i._path2curve), n = /[clmz]/g, r == i._pathToAbsolute && !e(t).match(n)) {
                            var s = e(t).replace(_, function(t, e, i) {
                                var n = [],
                                    r = "m" == e.toLowerCase(),
                                    s = g[e];
                                return i.replace(v, function(t) {
                                    r && 2 == n.length && (s += n + g["m" == e ? "l" : "L"], n = []), n.push(o(t * b))
                                }), s + n
                            });
                            return s
                        }
                        var a, l, c = r(t);
                        s = [];
                        for (var u = 0, h = c.length; h > u; u++) {
                            a = c[u], l = c[u][0].toLowerCase(), "z" == l && (l = "x");
                            for (var d = 1, m = a.length; m > d; d++) l += o(a[d] * b) + (d != m - 1 ? "," : p);
                            s.push(l)
                        }
                        return s.join(f)
                    },
                    T = function(t, e, n) {
                        var r = i.matrix();
                        return r.rotate(-t, .5, .5), {
                            dx: r.x(e, n),
                            dy: r.y(e, n)
                        }
                    },
                    C = function(t, e, i, n, r, o) {
                        var s = t._,
                            a = t.matrix,
                            u = s.fillpos,
                            h = t.node,
                            d = h.style,
                            p = 1,
                            g = "",
                            _ = b / e,
                            m = b / i;
                        if (d.visibility = "hidden", e && i) {
                            if (h.coordsize = l(_) + f + l(m), d.rotation = o * (0 > e * i ? -1 : 1), o) {
                                var v = T(o, n, r);
                                n = v.dx, r = v.dy
                            }
                            if (0 > e && (g += "x"), 0 > i && (g += " y") && (p = -1), d.flip = g, h.coordorigin = n * -_ + f + r * -m, u || s.fillsize) {
                                var y = h.getElementsByTagName(c);
                                y = y && y[0], h.removeChild(y), u && (v = T(o, a.x(u[0], u[1]), a.y(u[0], u[1])), y.position = v.dx * p + f + v.dy * p), s.fillsize && (y.size = s.fillsize[0] * l(e) + f + s.fillsize[1] * l(i)), h.appendChild(y)
                            }
                            d.visibility = "visible"
                        }
                    };
                i.toString = function() {
                    return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
                };
                var S = function(t, i, n) {
                        for (var r = e(i).toLowerCase().split("-"), o = n ? "end" : "start", s = r.length, a = "classic", l = "medium", c = "medium"; s--;) switch (r[s]) {
                            case "block":
                            case "classic":
                            case "oval":
                            case "diamond":
                            case "open":
                            case "none":
                                a = r[s];
                                break;
                            case "wide":
                            case "narrow":
                                c = r[s];
                                break;
                            case "long":
                            case "short":
                                l = r[s]
                        }
                        var u = t.node.getElementsByTagName("stroke")[0];
                        u[o + "arrow"] = a, u[o + "arrowlength"] = l, u[o + "arrowwidth"] = c
                    },
                    E = function(r, l) {
                        r.attrs = r.attrs || {};
                        var h = r.node,
                            d = r.attrs,
                            g = h.style,
                            _ = w[r.type] && (l.x != d.x || l.y != d.y || l.width != d.width || l.height != d.height || l.cx != d.cx || l.cy != d.cy || l.rx != d.rx || l.ry != d.ry || l.r != d.r),
                            m = x[r.type] && (d.cx != l.cx || d.cy != l.cy || d.r != l.r || d.rx != l.rx || d.ry != l.ry),
                            v = r;
                        for (var y in l) l[t](y) && (d[y] = l[y]);
                        if (_ && (d.path = i._getPath[r.type](r), r._.dirty = 1), l.href && (h.href = l.href), l.title && (h.title = l.title), l.target && (h.target = l.target), l.cursor && (g.cursor = l.cursor), "blur" in l && r.blur(l.blur), (l.path && "path" == r.type || _) && (h.path = k(~e(d.path).toLowerCase().indexOf("r") ? i._pathToAbsolute(d.path) : d.path), "image" == r.type && (r._.fillpos = [d.x, d.y], r._.fillsize = [d.width, d.height], C(r, 1, 1, 0, 0, 0))), "transform" in l && r.transform(l.transform), m) {
                            var T = +d.cx,
                                E = +d.cy,
                                $ = +d.rx || +d.r || 0,
                                N = +d.ry || +d.r || 0;
                            h.path = i.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", o((T - $) * b), o((E - N) * b), o((T + $) * b), o((E + N) * b), o(T * b)), r._.dirty = 1
                        }
                        if ("clip-rect" in l) {
                            var M = e(l["clip-rect"]).split(u);
                            if (4 == M.length) {
                                M[2] = +M[2] + +M[0], M[3] = +M[3] + +M[1];
                                var L = h.clipRect || i._g.doc.createElement("div"),
                                    B = L.style;
                                B.clip = i.format("rect({1}px {2}px {3}px {0}px)", M), h.clipRect || (B.position = "absolute", B.top = 0, B.left = 0, B.width = r.paper.width + "px", B.height = r.paper.height + "px", h.parentNode.insertBefore(L, h), L.appendChild(h), h.clipRect = L)
                            }
                            l["clip-rect"] || h.clipRect && (h.clipRect.style.clip = "auto")
                        }
                        if (r.textpath) {
                            var A = r.textpath.style;
                            l.font && (A.font = l.font), l["font-family"] && (A.fontFamily = '"' + l["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, p) + '"'), l["font-size"] && (A.fontSize = l["font-size"]), l["font-weight"] && (A.fontWeight = l["font-weight"]), l["font-style"] && (A.fontStyle = l["font-style"])
                        }
                        if ("arrow-start" in l && S(v, l["arrow-start"]), "arrow-end" in l && S(v, l["arrow-end"], 1), null != l.opacity || null != l["stroke-width"] || null != l.fill || null != l.src || null != l.stroke || null != l["stroke-width"] || null != l["stroke-opacity"] || null != l["fill-opacity"] || null != l["stroke-dasharray"] || null != l["stroke-miterlimit"] || null != l["stroke-linejoin"] || null != l["stroke-linecap"]) {
                            var P = h.getElementsByTagName(c),
                                I = !1;
                            if (P = P && P[0], !P && (I = P = D(c)), "image" == r.type && l.src && (P.src = l.src), l.fill && (P.on = !0), (null == P.on || "none" == l.fill || null === l.fill) && (P.on = !1), P.on && l.fill) {
                                var z = e(l.fill).match(i._ISURL);
                                if (z) {
                                    P.parentNode == h && h.removeChild(P), P.rotate = !0, P.src = z[1], P.type = "tile";
                                    var R = r.getBBox(1);
                                    P.position = R.x + f + R.y, r._.fillpos = [R.x, R.y], i._preload(z[1], function() {
                                        r._.fillsize = [this.offsetWidth, this.offsetHeight]
                                    })
                                } else P.color = i.getRGB(l.fill).hex, P.src = p, P.type = "solid", i.getRGB(l.fill).error && (v.type in {
                                    circle: 1,
                                    ellipse: 1
                                } || "r" != e(l.fill).charAt()) && j(v, l.fill, P) && (d.fill = "none", d.gradient = l.fill, P.rotate = !1)
                            }
                            if ("fill-opacity" in l || "opacity" in l) {
                                var O = ((+d["fill-opacity"] + 1 || 2) - 1) * ((+d.opacity + 1 || 2) - 1) * ((+i.getRGB(l.fill).o + 1 || 2) - 1);
                                O = a(s(O, 0), 1), P.opacity = O, P.src && (P.color = "none")
                            }
                            h.appendChild(P);
                            var F = h.getElementsByTagName("stroke") && h.getElementsByTagName("stroke")[0],
                                q = !1;
                            !F && (q = F = D("stroke")), (l.stroke && "none" != l.stroke || l["stroke-width"] || null != l["stroke-opacity"] || l["stroke-dasharray"] || l["stroke-miterlimit"] || l["stroke-linejoin"] || l["stroke-linecap"]) && (F.on = !0), ("none" == l.stroke || null === l.stroke || null == F.on || 0 == l.stroke || 0 == l["stroke-width"]) && (F.on = !1);
                            var H = i.getRGB(l.stroke);
                            F.on && l.stroke && (F.color = H.hex), O = ((+d["stroke-opacity"] + 1 || 2) - 1) * ((+d.opacity + 1 || 2) - 1) * ((+H.o + 1 || 2) - 1);
                            var W = .75 * (n(l["stroke-width"]) || 1);
                            if (O = a(s(O, 0), 1), null == l["stroke-width"] && (W = d["stroke-width"]), l["stroke-width"] && (F.weight = W), W && 1 > W && (O *= W) && (F.weight = 1), F.opacity = O, l["stroke-linejoin"] && (F.joinstyle = l["stroke-linejoin"] || "miter"), F.miterlimit = l["stroke-miterlimit"] || 8, l["stroke-linecap"] && (F.endcap = "butt" == l["stroke-linecap"] ? "flat" : "square" == l["stroke-linecap"] ? "square" : "round"), l["stroke-dasharray"]) {
                                var X = {
                                    "-": "shortdash",
                                    ".": "shortdot",
                                    "-.": "shortdashdot",
                                    "-..": "shortdashdotdot",
                                    ". ": "dot",
                                    "- ": "dash",
                                    "--": "longdash",
                                    "- .": "dashdot",
                                    "--.": "longdashdot",
                                    "--..": "longdashdotdot"
                                };
                                F.dashstyle = X[t](l["stroke-dasharray"]) ? X[l["stroke-dasharray"]] : p
                            }
                            q && h.appendChild(F)
                        }
                        if ("text" == v.type) {
                            v.paper.canvas.style.display = p;
                            var Y = v.paper.span,
                                V = 100,
                                U = d.font && d.font.match(/\d+(?:\.\d*)?(?=px)/);
                            g = Y.style, d.font && (g.font = d.font), d["font-family"] && (g.fontFamily = d["font-family"]), d["font-weight"] && (g.fontWeight = d["font-weight"]), d["font-style"] && (g.fontStyle = d["font-style"]), U = n(d["font-size"] || U && U[0]) || 10, g.fontSize = U * V + "px", v.textpath.string && (Y.innerHTML = e(v.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                            var J = Y.getBoundingClientRect();
                            v.W = d.w = (J.right - J.left) / V, v.H = d.h = (J.bottom - J.top) / V, v.X = d.x, v.Y = d.y + v.H / 2, ("x" in l || "y" in l) && (v.path.v = i.format("m{0},{1}l{2},{1}", o(d.x * b), o(d.y * b), o(d.x * b) + 1));
                            for (var K = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"], G = 0, Z = K.length; Z > G; G++)
                                if (K[G] in l) {
                                    v._.dirty = 1;
                                    break
                                }
                            switch (d["text-anchor"]) {
                                case "start":
                                    v.textpath.style["v-text-align"] = "left", v.bbx = v.W / 2;
                                    break;
                                case "end":
                                    v.textpath.style["v-text-align"] = "right", v.bbx = -v.W / 2;
                                    break;
                                default:
                                    v.textpath.style["v-text-align"] = "center", v.bbx = 0
                            }
                            v.textpath.style["v-text-kern"] = !0
                        }
                    },
                    j = function(t, o, s) {
                        t.attrs = t.attrs || {};
                        var a = (t.attrs, Math.pow),
                            l = "linear",
                            c = ".5 .5";
                        if (t.attrs.gradient = o, o = e(o).replace(i._radial_gradient, function(t, e, i) {
                            return l = "radial", e && i && (e = n(e), i = n(i), a(e - .5, 2) + a(i - .5, 2) > .25 && (i = r.sqrt(.25 - a(e - .5, 2)) * (2 * (i > .5) - 1) + .5), c = e + f + i), p
                        }), o = o.split(/\s*\-\s*/), "linear" == l) {
                            var u = o.shift();
                            if (u = -n(u), isNaN(u)) return null
                        }
                        var h = i._parseDots(o);
                        if (!h) return null;
                        if (t = t.shape || t.node, h.length) {
                            t.removeChild(s), s.on = !0, s.method = "none", s.color = h[0].color, s.color2 = h[h.length - 1].color;
                            for (var d = [], g = 0, _ = h.length; _ > g; g++) h[g].offset && d.push(h[g].offset + f + h[g].color);
                            s.colors = d.length ? d.join() : "0% " + s.color, "radial" == l ? (s.type = "gradientTitle", s.focus = "100%", s.focussize = "0 0", s.focusposition = c, s.angle = 0) : (s.type = "gradient", s.angle = (270 - u) % 360), t.appendChild(s)
                        }
                        return 1
                    },
                    $ = function(t, e) {
                        this[0] = this.node = t, t.raphael = !0, this.id = i._oid++, t.raphaelid = this.id, this.X = 0, this.Y = 0, this.attrs = {}, this.paper = e, this.matrix = i.matrix(), this._ = {
                            transform: [],
                            sx: 1,
                            sy: 1,
                            dx: 0,
                            dy: 0,
                            deg: 0,
                            dirty: 1,
                            dirtyT: 1
                        }, !e.bottom && (e.bottom = this), this.prev = e.top, e.top && (e.top.next = this), e.top = this, this.next = null
                    },
                    N = i.el;
                $.prototype = N, N.constructor = $, N.transform = function(t) {
                    if (null == t) return this._.transform;
                    var n, r = this.paper._viewBoxShift,
                        o = r ? "s" + [r.scale, r.scale] + "-1-1t" + [r.dx, r.dy] : p;
                    r && (n = t = e(t).replace(/\.{3}|\u2026/g, this._.transform || p)), i._extractTransform(this, o + t);
                    var s, a = this.matrix.clone(),
                        l = this.skew,
                        c = this.node,
                        u = ~e(this.attrs.fill).indexOf("-"),
                        h = !e(this.attrs.fill).indexOf("url(");
                    if (a.translate(-.5, -.5), h || u || "image" == this.type)
                        if (l.matrix = "1 0 0 1", l.offset = "0 0", s = a.split(), u && s.noRotation || !s.isSimple) {
                            c.style.filter = a.toFilter();
                            var d = this.getBBox(),
                                g = this.getBBox(1),
                                _ = d.x - g.x,
                                m = d.y - g.y;
                            c.coordorigin = _ * -b + f + m * -b, C(this, 1, 1, _, m, 0)
                        } else c.style.filter = p, C(this, s.scalex, s.scaley, s.dx, s.dy, s.rotate);
                    else c.style.filter = p, l.matrix = e(a), l.offset = a.offset();
                    return n && (this._.transform = n), this
                }, N.rotate = function(t, i, r) {
                    if (this.removed) return this;
                    if (null != t) {
                        if (t = e(t).split(u), t.length - 1 && (i = n(t[1]), r = n(t[2])), t = n(t[0]), null == r && (i = r), null == i || null == r) {
                            var o = this.getBBox(1);
                            i = o.x + o.width / 2, r = o.y + o.height / 2
                        }
                        return this._.dirtyT = 1, this.transform(this._.transform.concat([
                            ["r", t, i, r]
                        ])), this
                    }
                }, N.translate = function(t, i) {
                    return this.removed ? this : (t = e(t).split(u), t.length - 1 && (i = n(t[1])), t = n(t[0]) || 0, i = +i || 0, this._.bbox && (this._.bbox.x += t, this._.bbox.y += i), this.transform(this._.transform.concat([
                        ["t", t, i]
                    ])), this)
                }, N.scale = function(t, i, r, o) {
                    if (this.removed) return this;
                    if (t = e(t).split(u), t.length - 1 && (i = n(t[1]), r = n(t[2]), o = n(t[3]), isNaN(r) && (r = null), isNaN(o) && (o = null)), t = n(t[0]), null == i && (i = t), null == o && (r = o), null == r || null == o) var s = this.getBBox(1);
                    return r = null == r ? s.x + s.width / 2 : r, o = null == o ? s.y + s.height / 2 : o, this.transform(this._.transform.concat([
                        ["s", t, i, r, o]
                    ])), this._.dirtyT = 1, this
                }, N.hide = function() {
                    return !this.removed && (this.node.style.display = "none"), this
                }, N.show = function() {
                    return !this.removed && (this.node.style.display = p), this
                }, N._getBBox = function() {
                    return this.removed ? {} : {
                        x: this.X + (this.bbx || 0) - this.W / 2,
                        y: this.Y - this.H,
                        width: this.W,
                        height: this.H
                    }
                }, N.remove = function() {
                    if (!this.removed && this.node.parentNode) {
                        this.paper.__set__ && this.paper.__set__.exclude(this), i.eve.unbind("raphael.*.*." + this.id), i._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape);
                        for (var t in this) this[t] = "function" == typeof this[t] ? i._removedFactory(t) : null;
                        this.removed = !0
                    }
                }, N.attr = function(e, n) {
                    if (this.removed) return this;
                    if (null == e) {
                        var r = {};
                        for (var o in this.attrs) this.attrs[t](o) && (r[o] = this.attrs[o]);
                        return r.gradient && "none" == r.fill && (r.fill = r.gradient) && delete r.gradient, r.transform = this._.transform, r
                    }
                    if (null == n && i.is(e, "string")) {
                        if (e == c && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
                        for (var s = e.split(u), a = {}, l = 0, d = s.length; d > l; l++) e = s[l], a[e] = e in this.attrs ? this.attrs[e] : i.is(this.paper.customAttributes[e], "function") ? this.paper.customAttributes[e].def : i._availableAttrs[e];
                        return d - 1 ? a : a[s[0]]
                    }
                    if (this.attrs && null == n && i.is(e, "array")) {
                        for (a = {}, l = 0, d = e.length; d > l; l++) a[e[l]] = this.attr(e[l]);
                        return a
                    }
                    var f;
                    null != n && (f = {}, f[e] = n), null == n && i.is(e, "object") && (f = e);
                    for (var p in f) h("raphael.attr." + p + "." + this.id, this, f[p]);
                    if (f) {
                        for (p in this.paper.customAttributes)
                            if (this.paper.customAttributes[t](p) && f[t](p) && i.is(this.paper.customAttributes[p], "function")) {
                                var g = this.paper.customAttributes[p].apply(this, [].concat(f[p]));
                                this.attrs[p] = f[p];
                                for (var _ in g) g[t](_) && (f[_] = g[_])
                            }
                        f.text && "text" == this.type && (this.textpath.string = f.text), E(this, f)
                    }
                    return this
                }, N.toFront = function() {
                    return !this.removed && this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && i._tofront(this, this.paper), this
                }, N.toBack = function() {
                    return this.removed ? this : (this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), i._toback(this, this.paper)), this)
                }, N.insertAfter = function(t) {
                    return this.removed ? this : (t.constructor == i.st.constructor && (t = t[t.length - 1]), t.node.nextSibling ? t.node.parentNode.insertBefore(this.node, t.node.nextSibling) : t.node.parentNode.appendChild(this.node), i._insertafter(this, t, this.paper), this)
                }, N.insertBefore = function(t) {
                    return this.removed ? this : (t.constructor == i.st.constructor && (t = t[0]), t.node.parentNode.insertBefore(this.node, t.node), i._insertbefore(this, t, this.paper), this)
                }, N.blur = function(t) {
                    var e = this.node.runtimeStyle,
                        n = e.filter;
                    return n = n.replace(m, p), 0 !== +t ? (this.attrs.blur = t, e.filter = n + f + d + ".Blur(pixelradius=" + (+t || 1.5) + ")", e.margin = i.format("-{0}px 0 0 -{0}px", o(+t || 1.5))) : (e.filter = n, e.margin = 0, delete this.attrs.blur), this
                }, i._engine.path = function(t, e) {
                    var i = D("shape");
                    i.style.cssText = y, i.coordsize = b + f + b, i.coordorigin = e.coordorigin;
                    var n = new $(i, e),
                        r = {
                            fill: "none",
                            stroke: "#000"
                        };
                    t && (r.path = t), n.type = "path", n.path = [], n.Path = p, E(n, r), e.canvas.appendChild(i);
                    var o = D("skew");
                    return o.on = !0, i.appendChild(o), n.skew = o, n.transform(p), n
                }, i._engine.rect = function(t, e, n, r, o, s) {
                    var a = i._rectPath(e, n, r, o, s),
                        l = t.path(a),
                        c = l.attrs;
                    return l.X = c.x = e, l.Y = c.y = n, l.W = c.width = r, l.H = c.height = o, c.r = s, c.path = a, l.type = "rect", l
                }, i._engine.ellipse = function(t, e, i, n, r) {
                    var o = t.path();
                    return o.attrs, o.X = e - n, o.Y = i - r, o.W = 2 * n, o.H = 2 * r, o.type = "ellipse", E(o, {
                        cx: e,
                        cy: i,
                        rx: n,
                        ry: r
                    }), o
                }, i._engine.circle = function(t, e, i, n) {
                    var r = t.path();
                    return r.attrs, r.X = e - n, r.Y = i - n, r.W = r.H = 2 * n, r.type = "circle", E(r, {
                        cx: e,
                        cy: i,
                        r: n
                    }), r
                }, i._engine.image = function(t, e, n, r, o, s) {
                    var a = i._rectPath(n, r, o, s),
                        l = t.path(a).attr({
                            stroke: "none"
                        }),
                        u = l.attrs,
                        h = l.node,
                        d = h.getElementsByTagName(c)[0];
                    return u.src = e, l.X = u.x = n, l.Y = u.y = r, l.W = u.width = o, l.H = u.height = s, u.path = a, l.type = "image", d.parentNode == h && h.removeChild(d), d.rotate = !0, d.src = e, d.type = "tile", l._.fillpos = [n, r], l._.fillsize = [o, s], h.appendChild(d), C(l, 1, 1, 0, 0, 0), l
                }, i._engine.text = function(t, n, r, s) {
                    var a = D("shape"),
                        l = D("path"),
                        c = D("textpath");
                    n = n || 0, r = r || 0, s = s || "", l.v = i.format("m{0},{1}l{2},{1}", o(n * b), o(r * b), o(n * b) + 1), l.textpathok = !0, c.string = e(s), c.on = !0, a.style.cssText = y, a.coordsize = b + f + b, a.coordorigin = "0 0";
                    var u = new $(a, t),
                        h = {
                            fill: "#000",
                            stroke: "none",
                            font: i._availableAttrs.font,
                            text: s
                        };
                    u.shape = a, u.path = l, u.textpath = c, u.type = "text", u.attrs.text = e(s), u.attrs.x = n, u.attrs.y = r, u.attrs.w = 1, u.attrs.h = 1, E(u, h), a.appendChild(c), a.appendChild(l), t.canvas.appendChild(a);
                    var d = D("skew");
                    return d.on = !0, a.appendChild(d), u.skew = d, u.transform(p), u
                }, i._engine.batchText = function(t, n) {
                    for (var r = document.createDocumentFragment(), s = 0; n.length > s; s++) {
                        var a = n[s].text,
                            l = D("shape"),
                            c = D("path"),
                            u = D("textpath"),
                            h = n[s].attrs;
                        h.source && l.setAttribute("source", h.source), h.x = h.x, h.y = h.y - h["font-size"] / 4, h["text-anchor"] = "start";
                        var d = h.x,
                            p = h.y;
                        c.v = i.format("m{0},{1}l{2},{1}", o(d * b), o(p * b), o(d * b) + 1), c.textpathok = !0, u.string = e(a), u.on = !0, l.style.cssText = y, l.coordsize = b + f + b, l.coordorigin = "0 0";
                        var g = new $(l, t);
                        g.shape = l, g.path = c, g.textpath = u, g.type = "text", g.attrs.text = e(a), g.attrs.x = d, g.attrs.y = p, g.attrs.w = 1, g.attrs.h = 1, E(g, h), l.appendChild(u), l.appendChild(c), r.appendChild(l)
                    }
                    return t.canvas.appendChild(r), r
                }, i._engine.setSize = function(t, e) {
                    var n = this.canvas.style;
                    return this.width = t, this.height = e, t == +t && (t += "px"), e == +e && (e += "px"), n.width = t, n.height = e, n.clip = "rect(0 " + t + " " + e + " 0)", this._viewBox && i._engine.setViewBox.apply(this, this._viewBox), this
                }, i._engine.setViewBox = function(t, e, n, r, o) {
                    i.eve("raphael.setViewBox", this, this._viewBox, [t, e, n, r, o]);
                    var a, l, c = this.width,
                        u = this.height,
                        h = 1 / s(n / c, r / u);
                    return o && (a = u / r, l = c / n, c > n * a && (t -= (c - n * a) / 2 / a), u > r * l && (e -= (u - r * l) / 2 / l)), this._viewBox = [t, e, n, r, !!o], this._viewBoxShift = {
                        dx: -t,
                        dy: -e,
                        scale: h
                    }, this.forEach(function(t) {
                        t.transform("...")
                    }), this
                };
                var D;
                i._engine.initWin = function(t) {
                    var e = t.document;
                    e.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
                    try {
                        !e.namespaces.rvml && e.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), D = function(t) {
                            return e.createElement("<rvml:" + t + ' class="rvml">')
                        }
                    } catch (i) {
                        D = function(t) {
                            return e.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
                        }
                    }
                }, i._engine.initWin(i._g.win), i._engine.create = function() {
                    var t = i._getContainer.apply(0, arguments),
                        e = t.container,
                        n = t.height,
                        r = t.width,
                        o = t.x,
                        s = t.y;
                    if (!e) throw Error("VML container not found.");
                    var a = new i._Paper,
                        l = a.canvas = i._g.doc.createElement("div"),
                        c = l.style;
                    return o = o || 0, s = s || 0, r = r || 512, n = n || 342, a.width = r, a.height = n, r == +r && (r += "px"), n == +n && (n += "px"), a.coordsize = 1e3 * b + f + 1e3 * b, a.coordorigin = "0 0", a.span = i._g.doc.createElement("span"), a.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", l.appendChild(a.span), c.cssText = i.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", r, n), 1 == e ? (i._g.doc.body.appendChild(l), c.left = o + "px", c.top = s + "px", c.position = "absolute") : e.firstChild ? e.insertBefore(l, e.firstChild) : e.appendChild(l), a.renderfix = function() {}, a
                }, i.prototype.clear = function() {
                    i.eve("raphael.clear", this), this.canvas.innerHTML = p, this.span = i._g.doc.createElement("span"), this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", this.canvas.appendChild(this.span), this.bottom = this.top = null
                }, i.prototype.remove = function() {
                    i.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas);
                    for (var t in this) this[t] = "function" == typeof this[t] ? i._removedFactory(t) : null;
                    return !0
                };
                var M = i.st;
                for (var L in N) N[t](L) && !M[t](L) && (M[L] = function(t) {
                    return function() {
                        var e = arguments;
                        return this.forEach(function(i) {
                            i[t].apply(i, e)
                        })
                    }
                }(L))
            }
        }(), E.was ? S.win.Raphael = i : Raphael = i, i
}), define("viperjs/gallery/nicescroll/jquery.nicescroll.js", [], function(t) {
    t("jquery"),
    function(t) {
        function e() {
            var t = document.getElementsByTagName("script"),
                e = t[t.length - 1].src.split("?")[0];
            return e.split("/").length > 0 ? e.split("/").slice(0, -1).join("/") + "/" : ""
        }

        function i(t, e, i) {
            for (var n = 0; e.length > n; n++) i(t, e[n])
        }
        var n = !1,
            r = !1,
            o = 5e3,
            s = 2e3,
            l = 0,
            c = t,
            u = e(),
            h = ["ms", "moz", "webkit", "o"],
            d = window.requestAnimationFrame || !1,
            f = window.cancelAnimationFrame || !1;
        if (!d)
            for (var p in h) {
                var g = h[p];
                d || (d = window[g + "RequestAnimationFrame"]), f || (f = window[g + "CancelAnimationFrame"] || window[g + "CancelRequestAnimationFrame"])
            }
        var _ = window.MutationObserver || window.WebKitMutationObserver || !1,
            m = {
                globalwindow: !1,
                zindex: "auto",
                cursoropacitymin: 0,
                cursoropacitymax: 1,
                cursorcolor: "#424242",
                cursorwidth: "5px",
                cursorborder: "1px solid #fff",
                cursorborderradius: "5px",
                scrollspeed: 60,
                mousescrollstep: 24,
                touchbehavior: !1,
                hwacceleration: !0,
                usetransition: !0,
                boxzoom: !1,
                dblclickzoom: !0,
                gesturezoom: !0,
                grabcursorenabled: !0,
                autohidemode: !0,
                background: "",
                iframeautoresize: !0,
                cursorminheight: 32,
                preservenativescrolling: !0,
                railoffset: !1,
                bouncescroll: !0,
                spacebarenabled: !0,
                railpadding: {
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                disableoutline: !0,
                horizrailenabled: !0,
                railalign: "right",
                railvalign: "bottom",
                enabletranslate3d: !0,
                enablemousewheel: !0,
                enablekeyboard: !0,
                smoothscroll: !0,
                sensitiverail: !0,
                enablemouselockapi: !0,
                cursorfixedheight: !1,
                directionlockdeadzone: 6,
                hidecursordelay: 400,
                nativeparentscrolling: !0,
                enablescrollonselection: !0,
                overflowx: !0,
                overflowy: !0,
                cursordragspeed: .3,
                rtlmode: !1,
                cursordragontouch: !1,
                oneaxismousemode: "auto"
            },
            v = !1,
            y = function() {
                function t() {
                    var t = ["-moz-grab", "-webkit-grab", "grab"];
                    (i.ischrome && !i.ischrome22 || i.isie) && (t = []);
                    for (var n = 0; t.length > n; n++) {
                        var r = t[n];
                        if (e.style.cursor = r, e.style.cursor == r) return r
                    }
                    return "url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize"
                }
                if (v) return v;
                var e = document.createElement("DIV"),
                    i = {};
                i.haspointerlock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document, i.isopera = "opera" in window, i.isopera12 = i.isopera && "getUserMedia" in navigator, i.isoperamini = "[object OperaMini]" === Object.prototype.toString.call(window.operamini), i.isie = "all" in document && "attachEvent" in e && !i.isopera, i.isieold = i.isie && !("msInterpolationMode" in e.style), i.isie7 = !(!i.isie || i.isieold || "documentMode" in document && 7 != document.documentMode), i.isie8 = i.isie && "documentMode" in document && 8 == document.documentMode, i.isie9 = i.isie && "performance" in window && document.documentMode >= 9, i.isie10 = i.isie && "performance" in window && document.documentMode >= 10, i.isie9mobile = /iemobile.9/i.test(navigator.userAgent), i.isie9mobile && (i.isie9 = !1), i.isie7mobile = !i.isie9mobile && i.isie7 && /iemobile/i.test(navigator.userAgent), i.ismozilla = "MozAppearance" in e.style, i.iswebkit = "WebkitAppearance" in e.style, i.ischrome = "chrome" in window, i.ischrome22 = i.ischrome && i.haspointerlock, i.ischrome26 = i.ischrome && "transition" in e.style, i.cantouch = "ontouchstart" in document.documentElement || "ontouchstart" in window, i.hasmstouch = window.navigator.msPointerEnabled || !1, i.ismac = /^mac$/i.test(navigator.platform), i.isios = i.cantouch && /iphone|ipad|ipod/i.test(navigator.platform), i.isios4 = i.isios && !("seal" in Object), i.isandroid = /android/i.test(navigator.userAgent), i.trstyle = !1, i.hastransform = !1, i.hastranslate3d = !1, i.transitionstyle = !1, i.hastransition = !1, i.transitionend = !1;
                for (var n = ["transform", "msTransform", "webkitTransform", "MozTransform", "OTransform"], r = 0; n.length > r; r++)
                    if (e.style[n[r]] !== void 0) {
                        i.trstyle = n[r];
                        break
                    }
                i.hastransform = 0 != i.trstyle, i.hastransform && (e.style[i.trstyle] = "translate3d(1px,2px,3px)", i.hastranslate3d = /translate3d/.test(e.style[i.trstyle])), i.transitionstyle = !1, i.prefixstyle = "", i.transitionend = !1;
                for (var n = ["transition", "webkitTransition", "MozTransition", "OTransition", "OTransition", "msTransition", "KhtmlTransition"], o = ["", "-webkit-", "-moz-", "-o-", "-o", "-ms-", "-khtml-"], s = ["transitionend", "webkitTransitionEnd", "transitionend", "otransitionend", "oTransitionEnd", "msTransitionEnd", "KhtmlTransitionEnd"], r = 0; n.length > r; r++)
                    if (n[r] in e.style) {
                        i.transitionstyle = n[r], i.prefixstyle = o[r], i.transitionend = s[r];
                        break
                    }
                return i.ischrome26 && (i.prefixstyle = o[1]), i.hastransition = i.transitionstyle, i.cursorgrabvalue = t(), i.hasmousecapture = "setCapture" in e, i.hasMutationObserver = _ !== !1, e = null, v = i, i
            },
            b = function(t, e) {
                function i() {
                    var t = v.doc.css(x.trstyle);
                    return t && "matrix" == t.substr(0, 6) ? t.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, "").split(/, +/) : !1
                }

                function a() {
                    var t = v.win;
                    if ("zIndex" in t) return t.zIndex();
                    for (; t.length > 0;) {
                        if (9 == t[0].nodeType) return !1;
                        var e = t.css("zIndex");
                        if (!isNaN(e) && 0 != e) return parseInt(e);
                        t = t.parent()
                    }
                    return !1
                }

                function h(t, e, i) {
                    var n = t.css(e),
                        r = parseFloat(n);
                    if (isNaN(r)) {
                        r = k[n] || 0;
                        var o = 3 == r ? i ? v.win.outerHeight() - v.win.innerHeight() : v.win.outerWidth() - v.win.innerWidth() : 1;
                        return v.isie8 && r && (r += 1), o ? r : 0
                    }
                    return r
                }

                function p(t, e, i, n) {
                    v._bind(t, e, function(n) {
                        var n = n ? n : window.event,
                            r = {
                                original: n,
                                target: n.target || n.srcElement,
                                type: "wheel",
                                deltaMode: "MozMousePixelScroll" == n.type ? 0 : 1,
                                deltaX: 0,
                                deltaZ: 0,
                                preventDefault: function() {
                                    return n.preventDefault ? n.preventDefault() : n.returnValue = !1, !1
                                },
                                stopImmediatePropagation: function() {
                                    n.stopImmediatePropagation ? n.stopImmediatePropagation() : n.cancelBubble = !0
                                }
                            };
                        return "mousewheel" == e ? (r.deltaY = -1 / 40 * n.wheelDelta, n.wheelDeltaX && (r.deltaX = -1 / 40 * n.wheelDeltaX)) : r.deltaY = n.detail, i.call(t, r)
                    }, n)
                }

                function g(t, e, i) {
                    var n, r;
                    0 == t.deltaMode ? (n = -Math.floor(t.deltaX * (v.opt.mousescrollstep / 54)), r = -Math.floor(t.deltaY * (v.opt.mousescrollstep / 54))) : 1 == t.deltaMode && (n = -Math.floor(t.deltaX * v.opt.mousescrollstep), r = -Math.floor(t.deltaY * v.opt.mousescrollstep)), e && v.opt.oneaxismousemode && 0 == n && r && (n = r, r = 0);
                    var o = 120;
                    if (n && (v.scrollmom && v.scrollmom.stop(), v.lastdeltax += n, v.debounced("mousewheelx", function() {
                        var t = v.lastdeltax;
                        v.lastdeltax = 0, v.rail.drag || v.doScrollLeftBy(t)
                    }, o)), r) {
                        if (v.opt.nativeparentscrolling && i && !v.ispage && !v.zoomactive)
                            if (0 > r) {
                                if (v.getScrollTop() >= v.page.maxh) return !0
                            } else if (0 >= v.getScrollTop()) return !0;
                        v.scrollmom && v.scrollmom.stop(), v.lastdeltay += r, v.opt.smoothscroll ? v.debounced("mousewheely", function() {
                            var t = v.lastdeltay;
                            v.lastdeltay = 0, v.rail.drag || v.doScrollBy(t)
                        }, o) : function() {
                            var t = v.lastdeltay;
                            v.lastdeltay = 0, v.rail.drag || v.doScrollBy(t)
                        }()
                    }
                    return t.stopImmediatePropagation(), t.preventDefault()
                }
                var v = this;
                if (this.version = "3.5.1", this.name = "nicescroll", this.me = e, this.opt = {
                    doc: c("body"),
                    win: !1
                }, c.extend(this.opt, m), this.opt.snapbackspeed = 80, t)
                    for (var b in v.opt) t[b] !== void 0 && (v.opt[b] = t[b]);
                this.doc = v.opt.doc, this.iddoc = this.doc && this.doc[0] ? this.doc[0].id || "" : "", this.ispage = /BODY|HTML/.test(v.opt.win ? v.opt.win[0].nodeName : this.doc[0].nodeName), this.haswrapper = v.opt.win !== !1, this.win = v.opt.win || (this.ispage ? c(window) : this.doc), this.docscroll = this.ispage && !this.haswrapper ? c(window) : this.win, this.body = c("body"), this.viewport = !1, this.isfixed = !1, this.iframe = !1, this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName, this.istextarea = "TEXTAREA" == this.win[0].nodeName, this.forcescreen = !1, this.canshowonmouseevent = "scroll" != v.opt.autohidemode, this.onmousedown = !1, this.onmouseup = !1, this.onmousemove = !1, this.onmousewheel = !1, this.onkeypress = !1, this.ongesturezoom = !1, this.onclick = !1, this.onscrollstart = !1, this.onscrollend = !1, this.onscrollcancel = !1, this.onzoomin = !1, this.onzoomout = !1, this.view = !1, this.page = !1, this.scroll = {
                    x: 0,
                    y: 0
                }, this.scrollratio = {
                    x: 0,
                    y: 0
                }, this.cursorheight = 20, this.scrollvaluemax = 0, this.checkrtlmode = !1, this.scrollrunning = !1, this.scrollmom = !1, this.observer = !1, this.observerremover = !1;
                do this.id = "ascrail" + s++; while (document.getElementById(this.id));
                this.rail = !1, this.cursor = !1, this.cursorfreezed = !1, this.selectiondrag = !1, this.zoom = !1, this.zoomactive = !1, this.hasfocus = !1, this.hasmousefocus = !1, this.visibility = !0, this.locked = !1, this.hidden = !1, this.cursoractive = !0, this.overflowx = v.opt.overflowx, this.overflowy = v.opt.overflowy, this.nativescrollingarea = !1, this.checkarea = 0, this.events = [], this.saved = {}, this.delaylist = {}, this.synclist = {}, this.lastdeltax = 0, this.lastdeltay = 0, this.detected = y();
                var x = c.extend({}, this.detected);
                this.canhwscroll = x.hastransform && v.opt.hwacceleration, this.ishwscroll = this.canhwscroll && v.haswrapper, this.istouchcapable = !1, x.cantouch && x.ischrome && !x.isios && !x.isandroid && (this.istouchcapable = !0, x.cantouch = !1), x.cantouch && x.ismozilla && !x.isios && !x.isandroid && (this.istouchcapable = !0, x.cantouch = !1), v.opt.enablemouselockapi || (x.hasmousecapture = !1, x.haspointerlock = !1), this.delayed = function(t, e, i, n) {
                    var r = v.delaylist[t],
                        o = (new Date).getTime();
                    return !n && r && r.tt ? !1 : (r && r.tt && clearTimeout(r.tt), r && r.last + i > o && !r.tt ? v.delaylist[t] = {
                        last: o + i,
                        tt: setTimeout(function() {
                            v.delaylist[t].tt = 0, e.call()
                        }, i)
                    } : r && r.tt || (v.delaylist[t] = {
                        last: o,
                        tt: 0
                    }, setTimeout(function() {
                        e.call()
                    }, 0)), void 0)
                }, this.debounced = function(t, e, i) {
                    var n = v.delaylist[t];
                    (new Date).getTime(), v.delaylist[t] = e, n || setTimeout(function() {
                        var e = v.delaylist[t];
                        v.delaylist[t] = !1, e.call()
                    }, i)
                }, this.synched = function(t, e) {
                    function i() {
                        v.onsync || (d(function() {
                            v.onsync = !1;
                            for (t in v.synclist) {
                                var e = v.synclist[t];
                                e && e.call(v), v.synclist[t] = !1
                            }
                        }), v.onsync = !0)
                    }
                    return v.synclist[t] = e, i(), t
                }, this.unsynched = function(t) {
                    v.synclist[t] && (v.synclist[t] = !1)
                }, this.css = function(t, e) {
                    for (var i in e) v.saved.css.push([t, i, t.css(i)]), t.css(i, e[i])
                }, this.scrollTop = function(t) {
                    return t === void 0 ? v.getScrollTop() : v.setScrollTop(t)
                }, this.scrollLeft = function(t) {
                    return t === void 0 ? v.getScrollLeft() : v.setScrollLeft(t)
                }, BezierClass = function(t, e, i, n, r, o, s) {
                    this.st = t, this.ed = e, this.spd = i, this.p1 = n || 0, this.p2 = r || 1, this.p3 = o || 0, this.p4 = s || 1, this.ts = (new Date).getTime(), this.df = this.ed - this.st
                }, BezierClass.prototype = {
                    B2: function(t) {
                        return 3 * t * t * (1 - t)
                    },
                    B3: function(t) {
                        return 3 * t * (1 - t) * (1 - t)
                    },
                    B4: function(t) {
                        return (1 - t) * (1 - t) * (1 - t)
                    },
                    getNow: function() {
                        var t = (new Date).getTime(),
                            e = 1 - (t - this.ts) / this.spd,
                            i = this.B2(e) + this.B3(e) + this.B4(e);
                        return 0 > e ? this.ed : this.st + Math.round(this.df * i)
                    },
                    update: function(t, e) {
                        return this.st = this.getNow(), this.ed = t, this.spd = e, this.ts = (new Date).getTime(), this.df = this.ed - this.st, this
                    }
                }, this.ishwscroll ? (this.doc.translate = {
                    x: 0,
                    y: 0,
                    tx: "0px",
                    ty: "0px"
                }, x.hastranslate3d && x.isios && this.doc.css("-webkit-backface-visibility", "hidden"), this.getScrollTop = function(t) {
                    if (!t) {
                        var e = i();
                        if (e) return 16 == e.length ? -e[13] : -e[5];
                        if (v.timerscroll && v.timerscroll.bz) return v.timerscroll.bz.getNow()
                    }
                    return v.doc.translate.y
                }, this.getScrollLeft = function(t) {
                    if (!t) {
                        var e = i();
                        if (e) return 16 == e.length ? -e[12] : -e[4];
                        if (v.timerscroll && v.timerscroll.bh) return v.timerscroll.bh.getNow()
                    }
                    return v.doc.translate.x
                }, this.notifyScrollEvent = document.createEvent ? function(t) {
                    var e = document.createEvent("UIEvents");
                    e.initUIEvent("scroll", !1, !0, window, 1), t.dispatchEvent(e)
                } : document.fireEvent ? function(t) {
                    var e = document.createEventObject();
                    t.fireEvent("onscroll"), e.cancelBubble = !0
                } : function() {}, x.hastranslate3d && v.opt.enabletranslate3d ? (this.setScrollTop = function(t, e) {
                    v.doc.translate.y = t, v.doc.translate.ty = -1 * t + "px", v.doc.css(x.trstyle, "translate3d(" + v.doc.translate.tx + "," + v.doc.translate.ty + ",0px)"), e || v.notifyScrollEvent(v.win[0])
                }, this.setScrollLeft = function(t, e) {
                    v.doc.translate.x = t, v.doc.translate.tx = -1 * t + "px", v.doc.css(x.trstyle, "translate3d(" + v.doc.translate.tx + "," + v.doc.translate.ty + ",0px)"), e || v.notifyScrollEvent(v.win[0])
                }) : (this.setScrollTop = function(t, e) {
                    v.doc.translate.y = t, v.doc.translate.ty = -1 * t + "px", v.doc.css(x.trstyle, "translate(" + v.doc.translate.tx + "," + v.doc.translate.ty + ")"), e || v.notifyScrollEvent(v.win[0])
                }, this.setScrollLeft = function(t, e) {
                    v.doc.translate.x = t, v.doc.translate.tx = -1 * t + "px", v.doc.css(x.trstyle, "translate(" + v.doc.translate.tx + "," + v.doc.translate.ty + ")"), e || v.notifyScrollEvent(v.win[0])
                })) : (this.getScrollTop = function() {
                    return v.docscroll.scrollTop()
                }, this.setScrollTop = function(t) {
                    return v.docscroll.scrollTop(t)
                }, this.getScrollLeft = function() {
                    return v.docscroll.scrollLeft()
                }, this.setScrollLeft = function(t) {
                    return v.docscroll.scrollLeft(t)
                }), this.getTarget = function(t) {
                    return t ? t.target ? t.target : t.srcElement ? t.srcElement : !1 : !1
                }, this.hasParent = function(t, e) {
                    if (!t) return !1;
                    for (var i = t.target || t.srcElement || t || !1; i && i.id != e;) i = i.parentNode || !1;
                    return i !== !1
                };
                var k = {
                    thin: 1,
                    medium: 3,
                    thick: 5
                };
                this.getOffset = function() {
                    if (v.isfixed) return {
                        top: parseFloat(v.win.css("top")),
                        left: parseFloat(v.win.css("left"))
                    };
                    if (!v.viewport) return v.win.offset();
                    var t = v.win.offset(),
                        e = v.viewport.offset();
                    return {
                        top: t.top - e.top + v.viewport.scrollTop(),
                        left: t.left - e.left + v.viewport.scrollLeft()
                    }
                }, this.updateScrollBar = function(t) {
                    if (v.ishwscroll) v.rail.css({
                        height: v.win.innerHeight()
                    }), v.railh && v.railh.css({
                        width: v.win.innerWidth()
                    });
                    else {
                        var e = v.getOffset(),
                            i = {
                                top: e.top,
                                left: e.left
                            };
                        i.top += h(v.win, "border-top-width", !0), (v.win.outerWidth() - v.win.innerWidth()) / 2, i.left += v.rail.align ? v.win.outerWidth() - h(v.win, "border-right-width") - v.rail.width : h(v.win, "border-left-width");
                        var n = v.opt.railoffset;
                        if (n && (n.top && (i.top += n.top), v.rail.align && n.left && (i.left += n.left)), v.locked || v.rail.css({
                            top: i.top,
                            left: i.left,
                            height: t ? t.h : v.win.innerHeight()
                        }), v.zoom && v.zoom.css({
                            top: i.top + 1,
                            left: 1 == v.rail.align ? i.left - 20 : i.left + v.rail.width + 4
                        }), v.railh && !v.locked) {
                            var i = {
                                    top: e.top,
                                    left: e.left
                                },
                                r = v.railh.align ? i.top + h(v.win, "border-top-width", !0) + v.win.innerHeight() - v.railh.height : i.top + h(v.win, "border-top-width", !0),
                                o = i.left + h(v.win, "border-left-width");
                            v.railh.css({
                                top: r,
                                left: o,
                                width: v.railh.width
                            })
                        }
                    }
                }, this.doRailClick = function(t, e, i) {
                    var n, r, o, s;
                    v.locked || (v.cancelEvent(t), e ? (n = i ? v.doScrollLeft : v.doScrollTop, o = i ? (t.pageX - v.railh.offset().left - v.cursorwidth / 2) * v.scrollratio.x : (t.pageY - v.rail.offset().top - v.cursorheight / 2) * v.scrollratio.y, n(o)) : (n = i ? v.doScrollLeftBy : v.doScrollBy, o = i ? v.scroll.x : v.scroll.y, s = i ? t.pageX - v.railh.offset().left : t.pageY - v.rail.offset().top, r = i ? v.view.w : v.view.h, o >= s ? n(r) : n(-r)))
                }, v.hasanimationframe = d, v.hascancelanimationframe = f, v.hasanimationframe ? v.hascancelanimationframe || (f = function() {
                    v.cancelAnimationFrame = !0
                }) : (d = function(t) {
                    return setTimeout(t, 15 - Math.floor(+new Date / 1e3) % 16)
                }, f = clearInterval), this.init = function() {
                    function t(e) {
                        if (v.selectiondrag) {
                            if (e) {
                                var i = v.win.outerHeight(),
                                    n = e.pageY - v.selectiondrag.top;
                                n > 0 && i > n && (n = 0), n >= i && (n -= i), v.selectiondrag.df = n
                            }
                            if (0 != v.selectiondrag.df) {
                                var r = 2 * -Math.floor(v.selectiondrag.df / 6);
                                v.doScrollBy(r), v.debounced("doselectionscroll", function() {
                                    t()
                                }, 50)
                            }
                        }
                    }

                    function e() {
                        v.iframexd = !1;
                        try {
                            var t = "contentDocument" in this ? this.contentDocument : this.contentWindow.document;
                            t.domain
                        } catch (e) {
                            v.iframexd = !0, t = !1
                        }
                        if (v.iframexd) return "console" in window && console.log("NiceScroll error: policy restriced iframe"), !0;
                        if (v.forcescreen = !0, v.isiframe && (v.iframe = {
                            doc: c(t),
                            html: v.doc.contents().find("html")[0],
                            body: v.doc.contents().find("body")[0]
                        }, v.getContentSize = function() {
                            return {
                                w: Math.max(v.iframe.html.scrollWidth, v.iframe.body.scrollWidth),
                                h: Math.max(v.iframe.html.scrollHeight, v.iframe.body.scrollHeight)
                            }
                        }, v.docscroll = c(v.iframe.body)), !x.isios && v.opt.iframeautoresize && !v.isiframe) {
                            v.win.scrollTop(0), v.doc.height("");
                            var i = Math.max(t.getElementsByTagName("html")[0].scrollHeight, t.body.scrollHeight);
                            v.doc.height(i)
                        }
                        v.lazyResize(30), x.isie7 && v.css(c(v.iframe.html), {
                            "overflow-y": "hidden"
                        }), v.css(c(v.iframe.body), {
                            "overflow-y": "hidden"
                        }), x.isios && v.haswrapper && v.css(c(t.body), {
                            "-webkit-transform": "translate3d(0,0,0)"
                        }), "contentWindow" in this ? v.bind(this.contentWindow, "scroll", v.onscroll) : v.bind(t, "scroll", v.onscroll), v.opt.enablemousewheel && v.bind(t, "mousewheel", v.onmousewheel), v.opt.enablekeyboard && v.bind(t, x.isopera ? "keypress" : "keydown", v.onkeypress), (x.cantouch || v.opt.touchbehavior) && (v.bind(t, "mousedown", v.ontouchstart), v.bind(t, "mousemove", function(t) {
                            v.ontouchmove(t, !0)
                        }), v.opt.grabcursorenabled && x.cursorgrabvalue && v.css(c(t.body), {
                            cursor: x.cursorgrabvalue
                        })), v.bind(t, "mouseup", v.ontouchend), v.zoom && (v.opt.dblclickzoom && v.bind(t, "dblclick", v.doZoom), v.ongesturezoom && v.bind(t, "gestureend", v.ongesturezoom))
                    }
                    if (v.saved.css = [], x.isie7mobile) return !0;
                    if (x.isoperamini) return !0;
                    if (x.hasmstouch && v.css(v.ispage ? c("html") : v.win, {
                        "-ms-touch-action": "none"
                    }), v.zindex = "auto", v.zindex = v.ispage || "auto" != v.opt.zindex ? v.opt.zindex : a() || "auto", v.ispage || "auto" == v.zindex || v.zindex > l && (l = v.zindex), v.isie && 0 == v.zindex && "auto" == v.opt.zindex && (v.zindex = "auto"), !v.ispage || !x.cantouch && !x.isieold && !x.isie9mobile) {
                        var i = v.docscroll;
                        v.ispage && (i = v.haswrapper ? v.win : v.doc), x.isie9mobile || v.css(i, {
                            "overflow-y": "hidden"
                        }), v.ispage && x.isie7 && ("BODY" == v.doc[0].nodeName ? v.css(c("html"), {
                            "overflow-y": "hidden"
                        }) : "HTML" == v.doc[0].nodeName && v.css(c("body"), {
                            "overflow-y": "hidden"
                        })), !x.isios || v.ispage || v.haswrapper || v.css(c("body"), {
                            "-webkit-overflow-scrolling": "touch"
                        });
                        var s = c(document.createElement("div"));
                        s.css({
                            position: "relative",
                            top: 0,
                            "float": "right",
                            width: v.opt.cursorwidth,
                            height: "0px",
                            "background-color": v.opt.cursorcolor,
                            border: v.opt.cursorborder,
                            "background-clip": "padding-box",
                            "-webkit-border-radius": v.opt.cursorborderradius,
                            "-moz-border-radius": v.opt.cursorborderradius,
                            "border-radius": v.opt.cursorborderradius
                        }), s.hborder = parseFloat(s.outerHeight() - s.innerHeight()), v.cursor = s;
                        var h = c(document.createElement("div"));
                        h.attr("id", v.id), h.addClass("nicescroll-rails");
                        var d, f, p = ["left", "right"];
                        for (var g in p) f = p[g], d = v.opt.railpadding[f], d ? h.css("padding-" + f, d + "px") : v.opt.railpadding[f] = 0;
                        h.append(s), h.width = Math.max(parseFloat(v.opt.cursorwidth), s.outerWidth()) + v.opt.railpadding.left + v.opt.railpadding.right, h.css({
                            width: h.width + "px",
                            zIndex: v.zindex,
                            background: v.opt.background,
                            cursor: "default"
                        }), h.visibility = !0, h.scrollable = !0, h.align = "left" == v.opt.railalign ? 0 : 1, v.rail = h, v.rail.drag = !1;
                        var m = !1;
                        if (!v.opt.boxzoom || v.ispage || x.isieold || (m = document.createElement("div"), v.bind(m, "click", v.doZoom), v.zoom = c(m), v.zoom.css({
                            cursor: "pointer",
                            "z-index": v.zindex,
                            backgroundImage: "url(" + u + "zoomico.png)",
                            height: 18,
                            width: 18,
                            backgroundPosition: "0px 0px"
                        }), v.opt.dblclickzoom && v.bind(v.win, "dblclick", v.doZoom), x.cantouch && v.opt.gesturezoom && (v.ongesturezoom = function(t) {
                            return t.scale > 1.5 && v.doZoomIn(t), .8 > t.scale && v.doZoomOut(t), v.cancelEvent(t)
                        }, v.bind(v.win, "gestureend", v.ongesturezoom))), v.railh = !1, v.opt.horizrailenabled) {
                            v.css(i, {
                                "overflow-x": "hidden"
                            });
                            var s = c(document.createElement("div"));
                            s.css({
                                position: "relative",
                                top: 0,
                                height: v.opt.cursorwidth,
                                width: "0px",
                                "background-color": v.opt.cursorcolor,
                                border: v.opt.cursorborder,
                                "background-clip": "padding-box",
                                "-webkit-border-radius": v.opt.cursorborderradius,
                                "-moz-border-radius": v.opt.cursorborderradius,
                                "border-radius": v.opt.cursorborderradius
                            }), s.wborder = parseFloat(s.outerWidth() - s.innerWidth()), v.cursorh = s;
                            var y = c(document.createElement("div"));
                            y.attr("id", v.id + "-hr"), y.addClass("nicescroll-rails"), y.height = Math.max(parseFloat(v.opt.cursorwidth), s.outerHeight()), y.css({
                                height: y.height + "px",
                                zIndex: v.zindex,
                                background: v.opt.background
                            }), y.append(s), y.visibility = !0, y.scrollable = !0, y.align = "top" == v.opt.railvalign ? 0 : 1, v.railh = y, v.railh.drag = !1
                        }
                        if (v.ispage) h.css({
                            position: "fixed",
                            top: "0px",
                            height: "100%"
                        }), h.align ? h.css({
                            right: "0px"
                        }) : h.css({
                            left: "0px"
                        }), v.body.append(h), v.railh && (y.css({
                            position: "fixed",
                            left: "0px",
                            width: "100%"
                        }), y.align ? y.css({
                            bottom: "0px"
                        }) : y.css({
                            top: "0px"
                        }), v.body.append(y));
                        else {
                            if (v.ishwscroll) {
                                "static" == v.win.css("position") && v.css(v.win, {
                                    position: "relative"
                                });
                                var b = "HTML" == v.win[0].nodeName ? v.body : v.win;
                                v.zoom && (v.zoom.css({
                                    position: "absolute",
                                    top: 1,
                                    right: 0,
                                    "margin-right": h.width + 4
                                }), b.append(v.zoom)), h.css({
                                    position: "absolute",
                                    top: 0
                                }), h.align ? h.css({
                                    right: 0
                                }) : h.css({
                                    left: 0
                                }), b.append(h), y && (y.css({
                                    position: "absolute",
                                    left: 0,
                                    bottom: 0
                                }), y.align ? y.css({
                                    bottom: 0
                                }) : y.css({
                                    top: 0
                                }), b.append(y))
                            } else {
                                v.isfixed = "fixed" == v.win.css("position");
                                var k = v.isfixed ? "fixed" : "absolute";
                                v.isfixed || (v.viewport = v.getViewport(v.win[0])), v.viewport && (v.body = v.viewport, 0 == /fixed|relative|absolute/.test(v.viewport.css("position")) && v.css(v.viewport, {
                                    position: "relative"
                                })), h.css({
                                    position: k
                                }), v.zoom && v.zoom.css({
                                    position: k
                                }), v.updateScrollBar(), v.body.append(h), v.zoom && v.body.append(v.zoom), v.railh && (y.css({
                                    position: k
                                }), v.body.append(y))
                            }
                            x.isios && v.css(v.win, {
                                "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
                                "-webkit-touch-callout": "none"
                            }), x.isie && v.opt.disableoutline && v.win.attr("hideFocus", "true"), x.iswebkit && v.opt.disableoutline && v.win.css({
                                outline: "none"
                            })
                        } if (v.opt.autohidemode === !1 ? (v.autohidedom = !1, v.rail.css({
                            opacity: v.opt.cursoropacitymax
                        }), v.railh && v.railh.css({
                            opacity: v.opt.cursoropacitymax
                        })) : v.opt.autohidemode === !0 || "leave" === v.opt.autohidemode ? (v.autohidedom = c().add(v.rail), x.isie8 && (v.autohidedom = v.autohidedom.add(v.cursor)), v.railh && (v.autohidedom = v.autohidedom.add(v.railh)), v.railh && x.isie8 && (v.autohidedom = v.autohidedom.add(v.cursorh))) : "scroll" == v.opt.autohidemode ? (v.autohidedom = c().add(v.rail), v.railh && (v.autohidedom = v.autohidedom.add(v.railh))) : "cursor" == v.opt.autohidemode ? (v.autohidedom = c().add(v.cursor), v.railh && (v.autohidedom = v.autohidedom.add(v.cursorh))) : "hidden" == v.opt.autohidemode && (v.autohidedom = !1, v.hide(), v.locked = !1), x.isie9mobile) {
                            v.scrollmom = new w(v), v.onmangotouch = function() {
                                var t = v.getScrollTop(),
                                    e = v.getScrollLeft();
                                if (t == v.scrollmom.lastscrolly && e == v.scrollmom.lastscrollx) return !0;
                                var i = t - v.mangotouch.sy,
                                    n = e - v.mangotouch.sx,
                                    r = Math.round(Math.sqrt(Math.pow(n, 2) + Math.pow(i, 2)));
                                if (0 != r) {
                                    var o = 0 > i ? -1 : 1,
                                        s = 0 > n ? -1 : 1,
                                        a = +new Date;
                                    if (v.mangotouch.lazy && clearTimeout(v.mangotouch.lazy), a - v.mangotouch.tm > 80 || v.mangotouch.dry != o || v.mangotouch.drx != s) v.scrollmom.stop(), v.scrollmom.reset(e, t), v.mangotouch.sy = t, v.mangotouch.ly = t, v.mangotouch.sx = e, v.mangotouch.lx = e, v.mangotouch.dry = o, v.mangotouch.drx = s, v.mangotouch.tm = a;
                                    else {
                                        v.scrollmom.stop(), v.scrollmom.update(v.mangotouch.sx - n, v.mangotouch.sy - i), a - v.mangotouch.tm, v.mangotouch.tm = a;
                                        var l = Math.max(Math.abs(v.mangotouch.ly - t), Math.abs(v.mangotouch.lx - e));
                                        v.mangotouch.ly = t, v.mangotouch.lx = e, l > 2 && (v.mangotouch.lazy = setTimeout(function() {
                                            v.mangotouch.lazy = !1, v.mangotouch.dry = 0, v.mangotouch.drx = 0, v.mangotouch.tm = 0, v.scrollmom.doMomentum(30)
                                        }, 100))
                                    }
                                }
                            };
                            var T = v.getScrollTop(),
                                C = v.getScrollLeft();
                            v.mangotouch = {
                                sy: T,
                                ly: T,
                                dry: 0,
                                sx: C,
                                lx: C,
                                drx: 0,
                                lazy: !1,
                                tm: 0
                            }, v.bind(v.docscroll, "scroll", v.onmangotouch)
                        } else {
                            if (x.cantouch || v.istouchcapable || v.opt.touchbehavior || x.hasmstouch) {
                                v.scrollmom = new w(v), v.ontouchstart = function(t) {
                                    if (t.pointerType && 2 != t.pointerType) return !1;
                                    if (v.hasmoving = !1, !v.locked) {
                                        if (x.hasmstouch)
                                            for (var e = t.target ? t.target : !1; e;) {
                                                var i = c(e).getNiceScroll();
                                                if (i.length > 0 && i[0].me == v.me) break;
                                                if (i.length > 0) return !1;
                                                if ("DIV" == e.nodeName && e.id == v.id) break;
                                                e = e.parentNode ? e.parentNode : !1
                                            }
                                        v.cancelScroll();
                                        var e = v.getTarget(t);
                                        if (e) {
                                            var n = /INPUT/i.test(e.nodeName) && /range/i.test(e.type);
                                            if (n) return v.stopPropagation(t)
                                        }
                                        if (!("clientX" in t) && "changedTouches" in t && (t.clientX = t.changedTouches[0].clientX, t.clientY = t.changedTouches[0].clientY), v.forcescreen) {
                                            var r = t,
                                                t = {
                                                    original: t.original ? t.original : t
                                                };
                                            t.clientX = r.screenX, t.clientY = r.screenY
                                        }
                                        if (v.rail.drag = {
                                            x: t.clientX,
                                            y: t.clientY,
                                            sx: v.scroll.x,
                                            sy: v.scroll.y,
                                            st: v.getScrollTop(),
                                            sl: v.getScrollLeft(),
                                            pt: 2,
                                            dl: !1
                                        }, v.ispage || !v.opt.directionlockdeadzone) v.rail.drag.dl = "f";
                                        else {
                                            var o = {
                                                    w: c(window).width(),
                                                    h: c(window).height()
                                                },
                                                s = {
                                                    w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                                                    h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                                                },
                                                a = Math.max(0, s.h - o.h),
                                                l = Math.max(0, s.w - o.w);
                                            v.rail.drag.ck = !v.rail.scrollable && v.railh.scrollable ? a > 0 ? "v" : !1 : v.rail.scrollable && !v.railh.scrollable ? l > 0 ? "h" : !1 : !1, v.rail.drag.ck || (v.rail.drag.dl = "f")
                                        } if (v.opt.touchbehavior && v.isiframe && x.isie) {
                                            var u = v.win.position();
                                            v.rail.drag.x += u.left, v.rail.drag.y += u.top
                                        }
                                        if (v.hasmoving = !1, v.lastmouseup = !1, v.scrollmom.reset(t.clientX, t.clientY), !x.cantouch && !this.istouchcapable && !x.hasmstouch) {
                                            var h = e ? /INPUT|SELECT|TEXTAREA/i.test(e.nodeName) : !1;
                                            if (!h) return !v.ispage && x.hasmousecapture && e.setCapture(), v.opt.touchbehavior ? (e.onclick && !e._onclick && (e._onclick = e.onclick, e.onclick = function(t) {
                                                return +new Date - v.scrollmom.lasttime, v.hasmoving ? !1 : (e._onclick.call(this, t), void 0)
                                            }), v.cancelEvent(t)) : v.stopPropagation(t);
                                            /SUBMIT|CANCEL|BUTTON/i.test(c(e).attr("type")) && (pc = {
                                                tg: e,
                                                click: !1
                                            }, v.preventclick = pc)
                                        }
                                    }
                                }, v.ontouchend = function(t) {
                                    return t.pointerType && 2 != t.pointerType ? !1 : v.rail.drag && 2 == v.rail.drag.pt && (v.scrollmom.doMomentum(), v.rail.drag = !1, v.hasmoving && (v.lastmouseup = !0, v.hideCursor(), x.hasmousecapture && document.releaseCapture(), !x.cantouch)) ? v.cancelEvent(t) : void 0
                                };
                                var S = v.opt.touchbehavior && v.isiframe && !x.hasmousecapture;
                                v.ontouchmove = function(t, e) {
                                    if (t.pointerType && 2 != t.pointerType) return !1;
                                    if (v.rail.drag && 2 == v.rail.drag.pt) {
                                        if (x.cantouch && t.original === void 0) return !0;
                                        v.hasmoving = !0, v.preventclick && !v.preventclick.click && (v.preventclick.click = v.preventclick.tg.onclick || !1, v.preventclick.tg.onclick = v.onpreventclick);
                                        var i = c.extend({
                                            original: t
                                        }, t);
                                        if (t = i, "changedTouches" in t && (t.clientX = t.changedTouches[0].clientX, t.clientY = t.changedTouches[0].clientY), v.forcescreen) {
                                            var n = t,
                                                t = {
                                                    original: t.original ? t.original : t
                                                };
                                            t.clientX = n.screenX, t.clientY = n.screenY
                                        }
                                        var r = ofy = 0;
                                        if (S && !e) {
                                            var o = v.win.position();
                                            r = -o.left, ofy = -o.top
                                        }
                                        var s = t.clientY + ofy,
                                            a = s - v.rail.drag.y,
                                            l = t.clientX + r,
                                            u = l - v.rail.drag.x,
                                            h = v.rail.drag.st - a;
                                        if (v.ishwscroll && v.opt.bouncescroll ? 0 > h ? h = Math.round(h / 2) : h > v.page.maxh && (h = v.page.maxh + Math.round((h - v.page.maxh) / 2)) : (0 > h && (h = 0, s = 0), h > v.page.maxh && (h = v.page.maxh, s = 0)), v.railh && v.railh.scrollable) {
                                            var d = v.rail.drag.sl - u;
                                            v.ishwscroll && v.opt.bouncescroll ? 0 > d ? d = Math.round(d / 2) : d > v.page.maxw && (d = v.page.maxw + Math.round((d - v.page.maxw) / 2)) : (0 > d && (d = 0, l = 0), d > v.page.maxw && (d = v.page.maxw, l = 0))
                                        }
                                        var f = !1;
                                        if (v.rail.drag.dl) f = !0, "v" == v.rail.drag.dl ? d = v.rail.drag.sl : "h" == v.rail.drag.dl && (h = v.rail.drag.st);
                                        else {
                                            var p = Math.abs(a),
                                                g = Math.abs(u),
                                                _ = v.opt.directionlockdeadzone;
                                            if ("v" == v.rail.drag.ck) {
                                                if (p > _ && .3 * p >= g) return v.rail.drag = !1, !0;
                                                g > _ && (v.rail.drag.dl = "f", c("body").scrollTop(c("body").scrollTop()))
                                            } else if ("h" == v.rail.drag.ck) {
                                                if (g > _ && .3 * g >= p) return v.rail.drag = !1, !0;
                                                p > _ && (v.rail.drag.dl = "f", c("body").scrollLeft(c("body").scrollLeft()))
                                            }
                                        } if (v.synched("touchmove", function() {
                                            v.rail.drag && 2 == v.rail.drag.pt && (v.prepareTransition && v.prepareTransition(0), v.rail.scrollable && v.setScrollTop(h), v.scrollmom.update(l, s), v.railh && v.railh.scrollable ? (v.setScrollLeft(d), v.showCursor(h, d)) : v.showCursor(h), x.isie10 && document.selection.clear())
                                        }), x.ischrome && v.istouchcapable && (f = !1), f) return v.cancelEvent(t)
                                    }
                                }
                            }
                            v.onmousedown = function(t, e) {
                                if (!v.rail.drag || 1 == v.rail.drag.pt) {
                                    if (v.locked) return v.cancelEvent(t);
                                    v.cancelScroll(), v.rail.drag = {
                                        x: t.clientX,
                                        y: t.clientY,
                                        sx: v.scroll.x,
                                        sy: v.scroll.y,
                                        pt: 1,
                                        hr: !!e
                                    };
                                    var i = v.getTarget(t);
                                    return !v.ispage && x.hasmousecapture && i.setCapture(), v.isiframe && !x.hasmousecapture && (v.saved.csspointerevents = v.doc.css("pointer-events"), v.css(v.doc, {
                                        "pointer-events": "none"
                                    })), v.cancelEvent(t)
                                }
                            }, v.onmouseup = function(t) {
                                if (v.rail.drag) {
                                    if (x.hasmousecapture && document.releaseCapture(), v.isiframe && !x.hasmousecapture && v.doc.css("pointer-events", v.saved.csspointerevents), 1 != v.rail.drag.pt) return;
                                    return v.rail.drag = !1, v.cancelEvent(t)
                                }
                            }, v.onmousemove = function(t) {
                                if (v.rail.drag) {
                                    if (1 != v.rail.drag.pt) return;
                                    if (x.ischrome && 0 == t.which) return v.onmouseup(t);
                                    if (v.cursorfreezed = !0, v.rail.drag.hr) {
                                        v.scroll.x = v.rail.drag.sx + (t.clientX - v.rail.drag.x), 0 > v.scroll.x && (v.scroll.x = 0);
                                        var e = v.scrollvaluemaxw;
                                        v.scroll.x > e && (v.scroll.x = e)
                                    } else {
                                        v.scroll.y = v.rail.drag.sy + (t.clientY - v.rail.drag.y), 0 > v.scroll.y && (v.scroll.y = 0);
                                        var i = v.scrollvaluemax;
                                        v.scroll.y > i && (v.scroll.y = i)
                                    }
                                    return v.synched("mousemove", function() {
                                        v.rail.drag && 1 == v.rail.drag.pt && (v.showCursor(), v.rail.drag.hr ? v.doScrollLeft(Math.round(v.scroll.x * v.scrollratio.x), v.opt.cursordragspeed) : v.doScrollTop(Math.round(v.scroll.y * v.scrollratio.y), v.opt.cursordragspeed))
                                    }), v.cancelEvent(t)
                                }
                            }, x.cantouch || v.opt.touchbehavior ? (v.onpreventclick = function(t) {
                                return v.preventclick ? (v.preventclick.tg.onclick = v.preventclick.click, v.preventclick = !1, v.cancelEvent(t)) : void 0
                            }, v.bind(v.win, "mousedown", v.ontouchstart), v.onclick = x.isios ? !1 : function(t) {
                                return v.lastmouseup ? (v.lastmouseup = !1, v.cancelEvent(t)) : !0
                            }, v.opt.grabcursorenabled && x.cursorgrabvalue && (v.css(v.ispage ? v.doc : v.win, {
                                cursor: x.cursorgrabvalue
                            }), v.css(v.rail, {
                                cursor: x.cursorgrabvalue
                            }))) : (v.hasTextSelected = "getSelection" in document ? function() {
                                return document.getSelection().rangeCount > 0
                            } : "selection" in document ? function() {
                                return "None" != document.selection.type
                            } : function() {
                                return !1
                            }, v.onselectionstart = function() {
                                v.ispage || (v.selectiondrag = v.win.offset())
                            }, v.onselectionend = function() {
                                v.selectiondrag = !1
                            }, v.onselectiondrag = function(e) {
                                v.selectiondrag && v.hasTextSelected() && v.debounced("selectionscroll", function() {
                                    t(e)
                                }, 250)
                            }), x.hasmstouch && (v.css(v.rail, {
                                "-ms-touch-action": "none"
                            }), v.css(v.cursor, {
                                "-ms-touch-action": "none"
                            }), v.bind(v.win, "MSPointerDown", v.ontouchstart), v.bind(document, "MSPointerUp", v.ontouchend), v.bind(document, "MSPointerMove", v.ontouchmove), v.bind(v.cursor, "MSGestureHold", function(t) {
                                t.preventDefault()
                            }), v.bind(v.cursor, "contextmenu", function(t) {
                                t.preventDefault()
                            })), this.istouchcapable && (v.bind(v.win, "touchstart", v.ontouchstart), v.bind(document, "touchend", v.ontouchend), v.bind(document, "touchcancel", v.ontouchend), v.bind(document, "touchmove", v.ontouchmove)), v.bind(v.cursor, "mousedown", v.onmousedown), v.bind(v.cursor, "mouseup", v.onmouseup), v.railh && (v.bind(v.cursorh, "mousedown", function(t) {
                                v.onmousedown(t, !0)
                            }), v.bind(v.cursorh, "mouseup", function(t) {
                                return v.rail.drag && 2 == v.rail.drag.pt ? void 0 : (v.rail.drag = !1, v.hasmoving = !1, v.hideCursor(), x.hasmousecapture && document.releaseCapture(), v.cancelEvent(t))
                            })), (v.opt.cursordragontouch || !x.cantouch && !v.opt.touchbehavior) && (v.rail.css({
                                cursor: "default"
                            }), v.railh && v.railh.css({
                                cursor: "default"
                            }), v.jqbind(v.rail, "mouseenter", function() {
                                v.canshowonmouseevent && v.showCursor(), v.rail.active = !0
                            }), v.jqbind(v.rail, "mouseleave", function() {
                                v.rail.active = !1, v.rail.drag || v.hideCursor()
                            }), v.opt.sensitiverail && (v.bind(v.rail, "click", function(t) {
                                v.doRailClick(t, !1, !1)
                            }), v.bind(v.rail, "dblclick", function(t) {
                                v.doRailClick(t, !0, !1)
                            }), v.bind(v.cursor, "click", function(t) {
                                v.cancelEvent(t)
                            }), v.bind(v.cursor, "dblclick", function(t) {
                                v.cancelEvent(t)
                            })), v.railh && (v.jqbind(v.railh, "mouseenter", function() {
                                v.canshowonmouseevent && v.showCursor(), v.rail.active = !0
                            }), v.jqbind(v.railh, "mouseleave", function() {
                                v.rail.active = !1, v.rail.drag || v.hideCursor()
                            }), v.opt.sensitiverail && (v.bind(v.railh, "click", function(t) {
                                v.doRailClick(t, !1, !0)
                            }), v.bind(v.railh, "dblclick", function(t) {
                                v.doRailClick(t, !0, !0)
                            }), v.bind(v.cursorh, "click", function(t) {
                                v.cancelEvent(t)
                            }), v.bind(v.cursorh, "dblclick", function(t) {
                                v.cancelEvent(t)
                            })))), x.cantouch || v.opt.touchbehavior ? (v.bind(x.hasmousecapture ? v.win : document, "mouseup", v.ontouchend), v.bind(document, "mousemove", v.ontouchmove), v.onclick && v.bind(document, "click", v.onclick), v.opt.cursordragontouch && (v.bind(v.cursor, "mousedown", v.onmousedown), v.bind(v.cursor, "mousemove", v.onmousemove), v.cursorh && v.bind(v.cursorh, "mousedown", function(t) {
                                v.onmousedown(t, !0)
                            }), v.cursorh && v.bind(v.cursorh, "mousemove", v.onmousemove))) : (v.bind(x.hasmousecapture ? v.win : document, "mouseup", v.onmouseup), v.bind(document, "mousemove", v.onmousemove), v.onclick && v.bind(document, "click", v.onclick), !v.ispage && v.opt.enablescrollonselection && (v.bind(v.win[0], "mousedown", v.onselectionstart), v.bind(document, "mouseup", v.onselectionend), v.bind(v.cursor, "mouseup", v.onselectionend), v.cursorh && v.bind(v.cursorh, "mouseup", v.onselectionend), v.bind(document, "mousemove", v.onselectiondrag)), v.zoom && (v.jqbind(v.zoom, "mouseenter", function() {
                                v.canshowonmouseevent && v.showCursor(), v.rail.active = !0
                            }), v.jqbind(v.zoom, "mouseleave", function() {
                                v.rail.active = !1, v.rail.drag || v.hideCursor()
                            }))), v.opt.enablemousewheel && (v.isiframe || v.bind(x.isie && v.ispage ? document : v.win, "mousewheel", v.onmousewheel), v.bind(v.rail, "mousewheel", v.onmousewheel), v.railh && v.bind(v.railh, "mousewheel", v.onmousewheelhr)), v.ispage || x.cantouch || /HTML|BODY/.test(v.win[0].nodeName) || (v.win.attr("tabindex") || v.win.attr({
                                tabindex: o++
                            }), v.opt.globalwindow && (v.tmp = v.win, v.win = document.body), v.jqbind(v.win, "focus", function(t) {
                                n = v.getTarget(t).id || !0, v.hasfocus = !0, v.canshowonmouseevent && v.noticeCursor()
                            }), v.jqbind(v.win, "blur", function() {
                                n = !1, v.hasfocus = !1
                            }), v.jqbind(v.win, "mouseenter", function(t) {
                                r = v.getTarget(t).id || !0, v.hasmousefocus = !0, v.canshowonmouseevent && v.noticeCursor()
                            }), v.jqbind(v.win, "mouseleave", function() {
                                r = !1, v.hasmousefocus = !1, v.rail.drag || v.hideCursor()
                            }), v.opt.globalwindow && (v.win = v.tmp))
                        } if (v.onkeypress = function(t) {
                            if (v.locked && 0 == v.page.maxh) return !0;
                            t = t ? t : window.e;
                            var e = v.getTarget(t);
                            if (e && /INPUT|TEXTAREA|SELECT|OPTION/.test(e.nodeName)) {
                                var i = e.getAttribute("type") || e.type || !1;
                                if (!i || !/submit|button|cancel/i.tp) return !0
                            }
                            if (v.opt.globalwindow || v.hasfocus || v.hasmousefocus && !n || v.ispage && !n && !r) {
                                var o = t.keyCode;
                                if (v.locked && 27 != o) return v.cancelEvent(t);
                                var s = t.ctrlKey || !1,
                                    a = t.shiftKey || !1,
                                    l = !1,
                                    c = {
                                        key: o,
                                        ctrl: s,
                                        shift: a
                                    };
                                if (v.dokeypress && v.dokeypress(c), c.stopped) return v.cancelEvent(t), void 0;
                                switch (o) {
                                    case 38:
                                    case 63233:
                                        v.doScrollBy(72), l = !0;
                                        break;
                                    case 40:
                                    case 63235:
                                        v.doScrollBy(-72), l = !0;
                                        break;
                                    case 37:
                                    case 63232:
                                        v.railh && (s ? v.doScrollLeft(0) : v.doScrollLeftBy(72), l = !0);
                                        break;
                                    case 39:
                                    case 63234:
                                        v.railh && (s ? v.doScrollLeft(v.page.maxw) : v.doScrollLeftBy(-72), l = !0);
                                        break;
                                    case 33:
                                    case 63276:
                                        v.doScrollBy(v.view.h), l = !0;
                                        break;
                                    case 34:
                                    case 63277:
                                        v.doScrollBy(-v.view.h), l = !0;
                                        break;
                                    case 36:
                                    case 63273:
                                        v.railh && s ? v.doScrollPos(0, 0) : v.doScrollTo(0), l = !0;
                                        break;
                                    case 35:
                                    case 63275:
                                        v.railh && s ? v.doScrollPos(v.page.maxw, v.page.maxh) : v.doScrollTo(v.page.maxh), l = !0;
                                        break;
                                    case 32:
                                        v.opt.spacebarenabled && (a ? v.doScrollBy(v.view.h) : v.doScrollBy(-v.view.h), l = !0);
                                        break;
                                    case 27:
                                        v.zoomactive && (v.doZoom(), l = !0)
                                }
                                if (l) return v.cancelEvent(t)
                            }
                        }, v.opt.enablekeyboard && v.bind(document, x.isopera && !x.isopera12 ? "keypress" : "keydown", v.onkeypress), v.bind(window, "resize", v.lazyResize), v.bind(window, "orientationchange", v.lazyResize), v.bind(window, "load", v.lazyResize), x.ischrome && !v.ispage && !v.haswrapper) {
                            var E = v.win.attr("style"),
                                j = parseFloat(v.win.css("width")) + 1;
                            v.win.css("width", j), v.synched("chromefix", function() {
                                v.win.attr("style", E)
                            })
                        }
                        v.onAttributeChange = function() {
                            v.lazyResize(250)
                        }, v.ispage || v.haswrapper || (_ !== !1 ? (v.observer = new _(function(t) {
                            t.forEach(v.onAttributeChange)
                        }), v.observer.observe(v.win[0], {
                            childList: !0,
                            characterData: !1,
                            attributes: !0,
                            subtree: !1
                        }), v.observerremover = new _(function(t) {
                            t.forEach(function(t) {
                                if (t.removedNodes.length > 0)
                                    for (var e in t.removedNodes)
                                        if (t.removedNodes[e] == v.win[0]) return v.remove()
                            })
                        }), v.observerremover.observe(v.win[0].parentNode, {
                            childList: !0,
                            characterData: !1,
                            attributes: !1,
                            subtree: !1
                        })) : (v.bind(v.win, x.isie && !x.isie9 ? "propertychange" : "DOMAttrModified", v.onAttributeChange), x.isie9 && v.win[0].attachEvent("onpropertychange", v.onAttributeChange), v.bind(v.win, "DOMNodeRemoved", function(t) {
                            t.target == v.win[0] && v.remove()
                        }))), !v.ispage && v.opt.boxzoom && v.bind(window, "resize", v.resizeZoom), v.istextarea && v.bind(v.win, "mouseup", v.lazyResize), v.checkrtlmode = !0, v.lazyResize(30)
                    }
                    "IFRAME" == this.doc[0].nodeName && (this.doc[0].readyState && "complete" == this.doc[0].readyState && setTimeout(function() {
                        e.call(v.doc[0], !1)
                    }, 500), v.bind(this.doc, "load", e))
                }, this.showCursor = function(t, e) {
                    void 0 !== t && this.onscrolling && this.onscrolling({
                        y: t,
                        x: e
                    }), v.cursortimeout && (clearTimeout(v.cursortimeout), v.cursortimeout = 0), v.rail && (v.autohidedom && (v.autohidedom.stop().css({
                        opacity: v.opt.cursoropacitymax
                    }), v.cursoractive = !0), v.rail.drag && 1 == v.rail.drag.pt || (t !== void 0 && t !== !1 && (v.scroll.y = Math.round(1 * t / v.scrollratio.y)), e !== void 0 && (v.scroll.x = Math.round(1 * e / v.scrollratio.x))), v.cursor.css({
                        height: v.cursorheight,
                        top: v.scroll.y
                    }), v.cursorh && (!v.rail.align && v.rail.visibility ? v.cursorh.css({
                        width: v.cursorwidth,
                        left: v.scroll.x + v.rail.width
                    }) : v.cursorh.css({
                        width: v.cursorwidth,
                        left: v.scroll.x
                    }), v.cursoractive = !0), v.zoom && v.zoom.stop().css({
                        opacity: v.opt.cursoropacitymax
                    }))
                }, this.hideCursor = function(t) {
                    v.cursortimeout || v.rail && v.autohidedom && (v.hasmousefocus && "leave" == v.opt.autohidemode || (v.cursortimeout = setTimeout(function() {
                        v.rail.active && v.showonmouseevent || (v.autohidedom.stop().animate({
                            opacity: v.opt.cursoropacitymin
                        }), v.zoom && v.zoom.stop().animate({
                            opacity: v.opt.cursoropacitymin
                        }), v.cursoractive = !1), v.cursortimeout = 0
                    }, t || v.opt.hidecursordelay)))
                }, this.noticeCursor = function(t, e, i) {
                    v.showCursor(e, i), v.rail.active || v.hideCursor(t)
                }, this.getContentSize = v.ispage ? function() {
                    return {
                        w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                        h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                    }
                } : v.haswrapper ? function() {
                    return {
                        w: v.doc.outerWidth() + parseInt(v.win.css("paddingLeft")) + parseInt(v.win.css("paddingRight")),
                        h: v.doc.outerHeight() + parseInt(v.win.css("paddingTop")) + parseInt(v.win.css("paddingBottom"))
                    }
                } : function() {
                    return {
                        w: v.docscroll[0].scrollWidth,
                        h: v.docscroll[0].scrollHeight
                    }
                }, this.onResize = function(t, e) {
                    if (!v || !v.win) return !1;
                    if (!v.haswrapper && !v.ispage) {
                        if ("none" == v.win.css("display")) return v.visibility && v.hideRail().hideRailHr(), !1;
                        v.hidden || v.visibility || v.showRail().showRailHr()
                    }
                    var i = v.page.maxh,
                        n = v.page.maxw,
                        r = {
                            h: v.view.h,
                            w: v.view.w
                        };
                    if (v.view = {
                        w: v.ispage ? v.win.width() : parseInt(v.win[0].clientWidth),
                        h: v.ispage ? v.win.height() : parseInt(v.win[0].clientHeight)
                    }, v.page = e ? e : v.getContentSize(), v.page.maxh = Math.max(0, v.page.h - v.view.h), v.page.maxw = Math.max(0, v.page.w - v.view.w), v.page.maxh == i && v.page.maxw == n && v.view.w == r.w) {
                        if (v.ispage) return v;
                        var o = v.win.offset();
                        if (v.lastposition) {
                            var s = v.lastposition;
                            if (s.top == o.top && s.left == o.left) return v
                        }
                        v.lastposition = o
                    }
                    if (0 == v.page.maxh ? (v.hideRail(), v.scrollvaluemax = 0, v.scroll.y = 0, v.scrollratio.y = 0, v.cursorheight = 0, v.setScrollTop(0), v.rail.scrollable = !1) : v.rail.scrollable = !0, 0 == v.page.maxw ? (v.hideRailHr(), v.scrollvaluemaxw = 0, v.scroll.x = 0, v.scrollratio.x = 0, v.cursorwidth = 0, v.setScrollLeft(0), v.railh.scrollable = !1) : v.railh.scrollable = !0, v.locked = 0 == v.page.maxh && 0 == v.page.maxw, v.locked) return v.ispage || v.updateScrollBar(v.view), !1;
                    v.hidden || v.visibility ? v.hidden || v.railh.visibility || v.showRailHr() : v.showRail().showRailHr(), v.istextarea && v.win.css("resize") && "none" != v.win.css("resize") && (v.view.h -= 20), v.cursorheight = Math.min(v.view.h, Math.round(v.view.h * (v.view.h / v.page.h))), v.cursorheight = v.opt.cursorfixedheight ? v.opt.cursorfixedheight : Math.max(v.opt.cursorminheight, v.cursorheight), v.cursorwidth = Math.min(v.view.w, Math.round(v.view.w * (v.view.w / v.page.w))), v.cursorwidth = v.opt.cursorfixedheight ? v.opt.cursorfixedheight : Math.max(v.opt.cursorminheight, v.cursorwidth), v.scrollvaluemax = v.view.h - v.cursorheight - v.cursor.hborder, v.railh && (v.railh.width = v.page.maxh > 0 ? v.view.w - v.rail.width : v.view.w, v.scrollvaluemaxw = v.railh.width - v.cursorwidth - v.cursorh.wborder), v.checkrtlmode && v.railh && (v.checkrtlmode = !1, v.opt.rtlmode && 0 == v.scroll.x && v.setScrollLeft(v.page.maxw)), v.ispage || v.updateScrollBar(v.view), v.scrollratio = {
                        x: v.page.maxw / v.scrollvaluemaxw,
                        y: v.page.maxh / v.scrollvaluemax
                    };
                    var a = v.getScrollTop();
                    return a > v.page.maxh ? v.doScrollTop(v.page.maxh) : (v.scroll.y = Math.round(v.getScrollTop() * (1 / v.scrollratio.y)), v.scroll.x = Math.round(v.getScrollLeft() * (1 / v.scrollratio.x)), v.cursoractive && v.noticeCursor()), v.scroll.y && 0 == v.getScrollTop() && v.doScrollTo(Math.floor(v.scroll.y * v.scrollratio.y)), v
                }, this.resize = v.onResize, this.lazyResize = function(t) {
                    return t = isNaN(t) ? 30 : t, v.delayed("resize", v.resize, t), v
                }, this._bind = function(t, e, i, n) {
                    v.events.push({
                        e: t,
                        n: e,
                        f: i,
                        b: n,
                        q: !1
                    }), t.addEventListener ? t.addEventListener(e, i, n || !1) : t.attachEvent ? t.attachEvent("on" + e, i) : t["on" + e] = i
                }, this.jqbind = function(t, e, i) {
                    v.events.push({
                        e: t,
                        n: e,
                        f: i,
                        q: !0
                    }), c(t).bind(e, i)
                }, this.bind = function(t, e, i, n) {
                    var r = "jquery" in t ? t[0] : t;
                    if ("mousewheel" == e)
                        if (v.opt.globalwindow && (r = window), "onwheel" in v.win) v._bind(r, "wheel", i, n || !1);
                        else {
                            var o = document.onmousewheel !== void 0 ? "mousewheel" : "DOMMouseScroll";
                            p(r, o, i, n || !1), "DOMMouseScroll" == o && p(r, "MozMousePixelScroll", i, n || !1)
                        } else if (r.addEventListener) {
                        if (x.cantouch && /mouseup|mousedown|mousemove/.test(e)) {
                            var s = "mousedown" == e ? "touchstart" : "mouseup" == e ? "touchend" : "touchmove";
                            v._bind(r, s, function(t) {
                                if (t.touches) {
                                    if (2 > t.touches.length) {
                                        var e = t.touches.length ? t.touches[0] : t;
                                        e.original = t, i.call(this, e)
                                    }
                                } else if (t.changedTouches) {
                                    var e = t.changedTouches[0];
                                    e.original = t, i.call(this, e)
                                }
                            }, n || !1)
                        }
                        v._bind(r, e, i, n || !1), x.cantouch && "mouseup" == e && v._bind(r, "touchcancel", i, n || !1)
                    } else v._bind(r, e, function(t) {
                        return t = t || window.event || !1, t && t.srcElement && (t.target = t.srcElement), "pageY" in t || (t.pageX = t.clientX + document.documentElement.scrollLeft, t.pageY = t.clientY + document.documentElement.scrollTop), i.call(r, t) === !1 || n === !1 ? v.cancelEvent(t) : !0
                    })
                }, this._unbind = function(t, e, i, n) {
                    t.removeEventListener ? t.removeEventListener(e, i, n) : t.detachEvent ? t.detachEvent("on" + e, i) : t["on" + e] = !1
                }, this.unbindAll = function() {
                    for (var t = 0; v.events.length > t; t++) {
                        var e = v.events[t];
                        e.q ? e.e.unbind(e.n, e.f) : v._unbind(e.e, e.n, e.f, e.b)
                    }
                }, this.cancelEvent = function(t) {
                    var t = t.original ? t.original : t ? t : window.event || !1;
                    return t ? (t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation(), t.preventManipulation && t.preventManipulation(), t.cancelBubble = !0, t.cancel = !0, t.returnValue = !1, !1) : !1
                }, this.stopPropagation = function(t) {
                    var t = t.original ? t.original : t ? t : window.event || !1;
                    return t ? t.stopPropagation ? t.stopPropagation() : (t.cancelBubble && (t.cancelBubble = !0), !1) : !1
                }, this.showRail = function() {
                    return 0 == v.page.maxh || !v.ispage && "none" == v.win.css("display") || (v.visibility = !0, v.rail.visibility = !0, v.rail.css("display", "block")), v
                }, this.showRailHr = function() {
                    return v.railh ? (0 == v.page.maxw || !v.ispage && "none" == v.win.css("display") || (v.railh.visibility = !0, v.railh.css("display", "block")), v) : v
                }, this.hideRail = function() {
                    return v.visibility = !1, v.rail.visibility = !1, v.rail.css("display", "none"), v
                }, this.hideRailHr = function() {
                    return v.railh ? (v.railh.visibility = !1, v.railh.css("display", "none"), v) : v
                }, this.show = function() {
                    return v.hidden = !1, v.locked = !1, v.showRail().showRailHr()
                }, this.hide = function() {
                    return v.hidden = !0, v.locked = !0, v.hideRail().hideRailHr()
                }, this.toggle = function() {
                    return v.hidden ? v.show() : v.hide()
                }, this.remove = function() {
                    v.stop(), v.cursortimeout && clearTimeout(v.cursortimeout), v.doZoomOut(), v.unbindAll(), x.isie9 && v.win[0].detachEvent("onpropertychange", v.onAttributeChange), v.observer !== !1 && v.observer.disconnect(), v.observerremover !== !1 && v.observerremover.disconnect(), v.events = null, v.cursor && v.cursor.remove(), v.cursorh && v.cursorh.remove(), v.rail && v.rail.remove(), v.railh && v.railh.remove(), v.zoom && v.zoom.remove();
                    for (var t = 0; v.saved.css.length > t; t++) {
                        var e = v.saved.css[t];
                        e[0].css(e[1], e[2] === void 0 ? "" : e[2])
                    }
                    v.saved = !1, v.me.data("__nicescroll", "");
                    var i = c.nicescroll;
                    i.each(function(t) {
                        if (this && this.id === v.id) {
                            delete i[t];
                            for (var e = ++t; i.length > e; e++, t++) i[t] = i[e];
                            i.length--, i.length && delete i[i.length]
                        }
                    });
                    for (var n in v) v[n] = null, delete v[n];
                    v = null
                }, this.scrollstart = function(t) {
                    return this.onscrollstart = t, v
                }, this.scrollend = function(t) {
                    return this.onscrollend = t, v
                }, this.scrolling = function(t) {
                    return this.onscrolling = t, v
                }, this.scrollcancel = function(t) {
                    return this.onscrollcancel = t, v
                }, this.keypress = function(t) {
                    return this.dokeypress = t, v
                }, this.zoomin = function(t) {
                    return this.onzoomin = t, v
                }, this.zoomout = function(t) {
                    return this.onzoomout = t, v
                }, this.isScrollable = function(t) {
                    var e = t.target ? t.target : t;
                    if ("OPTION" == e.nodeName) return !0;
                    for (; e && 1 == e.nodeType && !/BODY|HTML/.test(e.nodeName);) {
                        var i = c(e),
                            n = i.css("overflowY") || i.css("overflowX") || i.css("overflow") || "";
                        if (/scroll|auto/.test(n)) return e.clientHeight != e.scrollHeight;
                        e = e.parentNode ? e.parentNode : !1
                    }
                    return !1
                }, this.getViewport = function(t) {
                    for (var e = t && t.parentNode ? t.parentNode : !1; e && 1 == e.nodeType && !/BODY|HTML/.test(e.nodeName);) {
                        var i = c(e);
                        if (/fixed|absolute/.test(i.css("position"))) return i;
                        var n = i.css("overflowY") || i.css("overflowX") || i.css("overflow") || "";
                        if (/scroll|auto/.test(n) && e.clientHeight != e.scrollHeight) return i;
                        if (i.getNiceScroll().length > 0) return i;
                        e = e.parentNode ? e.parentNode : !1
                    }
                    return !1
                }, this.onmousewheel = function(t) {
                    if (v.locked) return v.debounced("checkunlock", v.resize, 250), !0;
                    if (v.rail.drag) return v.cancelEvent(t);
                    if ("auto" == v.opt.oneaxismousemode && 0 != t.deltaX && (v.opt.oneaxismousemode = !1), v.opt.oneaxismousemode && 0 == t.deltaX && !v.rail.scrollable) return v.railh && v.railh.scrollable ? v.onmousewheelhr(t) : !0;
                    var e = +new Date,
                        i = !1;
                    if (v.opt.preservenativescrolling && e > v.checkarea + 600 && (v.nativescrollingarea = v.isScrollable(t), i = !0), v.checkarea = e, v.nativescrollingarea) return !0;
                    var n = g(t, !1, i);
                    return n && (v.checkarea = 0), n
                }, this.onmousewheelhr = function(t) {
                    if (v.locked || !v.railh.scrollable) return !0;
                    if (v.rail.drag) return v.cancelEvent(t);
                    var e = +new Date,
                        i = !1;
                    return v.opt.preservenativescrolling && e > v.checkarea + 600 && (v.nativescrollingarea = v.isScrollable(t), i = !0), v.checkarea = e, v.nativescrollingarea ? !0 : v.locked ? v.cancelEvent(t) : g(t, !0, i)
                }, this.stop = function() {
                    return v.cancelScroll(), v.scrollmon && v.scrollmon.stop(), v.cursorfreezed = !1, v.scroll.y = Math.round(v.getScrollTop() * (1 / v.scrollratio.y)), v.noticeCursor(), v
                }, this.getTransitionSpeed = function(t) {
                    var e = Math.round(10 * v.opt.scrollspeed),
                        i = Math.min(e, Math.round(t / 20 * v.opt.scrollspeed));
                    return i > 20 ? i : 0
                }, v.opt.smoothscroll ? v.ishwscroll && x.hastransition && v.opt.usetransition ? (this.prepareTransition = function(t, e) {
                    var i = e ? t > 20 ? t : 0 : v.getTransitionSpeed(t),
                        n = i ? x.prefixstyle + "transform " + i + "ms ease-out" : "";
                    return v.lasttransitionstyle && v.lasttransitionstyle == n || (v.lasttransitionstyle = n, v.doc.css(x.transitionstyle, n)), i
                }, this.doScrollLeft = function(t, e) {
                    var i = v.scrollrunning ? v.newscrolly : v.getScrollTop();
                    v.doScrollPos(t, i, e)
                }, this.doScrollTop = function(t, e) {
                    var i = v.scrollrunning ? v.newscrollx : v.getScrollLeft();
                    v.doScrollPos(i, t, e)
                }, this.doScrollPos = function(t, e, i) {
                    var n = v.getScrollTop(),
                        r = v.getScrollLeft();
                    return (0 > (v.newscrolly - n) * (e - n) || 0 > (v.newscrollx - r) * (t - r)) && v.cancelScroll(), 0 == v.opt.bouncescroll && (0 > e ? e = 0 : e > v.page.maxh && (e = v.page.maxh), 0 > t ? t = 0 : t > v.page.maxw && (t = v.page.maxw)), v.scrollrunning && t == v.newscrollx && e == v.newscrolly ? !1 : (v.newscrolly = e, v.newscrollx = t, v.newscrollspeed = i || !1, v.timer ? !1 : (v.timer = setTimeout(function() {
                        var i = v.getScrollTop(),
                            n = v.getScrollLeft(),
                            r = {};
                        r.x = t - n, r.y = e - i, r.px = n, r.py = i;
                        var o = Math.round(Math.sqrt(Math.pow(r.x, 2) + Math.pow(r.y, 2))),
                            s = v.newscrollspeed && v.newscrollspeed > 1 ? v.newscrollspeed : v.getTransitionSpeed(o);
                        if (v.newscrollspeed && 1 >= v.newscrollspeed && (s *= v.newscrollspeed), v.prepareTransition(s, !0), v.timerscroll && v.timerscroll.tm && clearInterval(v.timerscroll.tm), s > 0) {
                            if (!v.scrollrunning && v.onscrollstart) {
                                var a = {
                                    type: "scrollstart",
                                    current: {
                                        x: n,
                                        y: i
                                    },
                                    request: {
                                        x: t,
                                        y: e
                                    },
                                    end: {
                                        x: v.newscrollx,
                                        y: v.newscrolly
                                    },
                                    speed: s
                                };
                                v.onscrollstart.call(v, a)
                            }
                            x.transitionend ? v.scrollendtrapped || (v.scrollendtrapped = !0, v.bind(v.doc, x.transitionend, v.onScrollEnd, !1)) : (v.scrollendtrapped && clearTimeout(v.scrollendtrapped), v.scrollendtrapped = setTimeout(v.onScrollEnd, s));
                            var l = i,
                                c = n;
                            v.timerscroll = {
                                bz: new BezierClass(l, v.newscrolly, s, 0, 0, .58, 1),
                                bh: new BezierClass(c, v.newscrollx, s, 0, 0, .58, 1)
                            }, v.cursorfreezed || (v.timerscroll.tm = setInterval(function() {
                                v.showCursor(v.getScrollTop(), v.getScrollLeft())
                            }, 60))
                        }
                        v.synched("doScroll-set", function() {
                            v.timer = 0, v.scrollendtrapped && (v.scrollrunning = !0), v.setScrollTop(v.newscrolly), v.setScrollLeft(v.newscrollx), v.scrollendtrapped || v.onScrollEnd()
                        })
                    }, 50), void 0))
                }, this.cancelScroll = function() {
                    if (!v.scrollendtrapped) return !0;
                    var t = v.getScrollTop(),
                        e = v.getScrollLeft();
                    return v.scrollrunning = !1, x.transitionend || clearTimeout(x.transitionend), v.scrollendtrapped = !1, v._unbind(v.doc, x.transitionend, v.onScrollEnd), v.prepareTransition(0), v.setScrollTop(t), v.railh && v.setScrollLeft(e), v.timerscroll && v.timerscroll.tm && clearInterval(v.timerscroll.tm), v.timerscroll = !1, v.cursorfreezed = !1, v.showCursor(t, e), v
                }, this.onScrollEnd = function() {
                    v.scrollendtrapped && v._unbind(v.doc, x.transitionend, v.onScrollEnd), v.scrollendtrapped = !1, v.prepareTransition(0), v.timerscroll && v.timerscroll.tm && clearInterval(v.timerscroll.tm), v.timerscroll = !1;
                    var t = v.getScrollTop(),
                        e = v.getScrollLeft();
                    if (v.setScrollTop(t), v.railh && v.setScrollLeft(e), v.noticeCursor(!1, t, e), v.cursorfreezed = !1, 0 > t ? t = 0 : t > v.page.maxh && (t = v.page.maxh), 0 > e ? e = 0 : e > v.page.maxw && (e = v.page.maxw), t != v.newscrolly || e != v.newscrollx) return v.doScrollPos(e, t, v.opt.snapbackspeed);
                    if (v.onscrollend && v.scrollrunning) {
                        var i = {
                            type: "scrollend",
                            current: {
                                x: e,
                                y: t
                            },
                            end: {
                                x: v.newscrollx,
                                y: v.newscrolly
                            }
                        };
                        v.onscrollend.call(v, i)
                    }
                    v.scrollrunning = !1
                }) : (this.doScrollLeft = function(t, e) {
                    var i = v.scrollrunning ? v.newscrolly : v.getScrollTop();
                    v.doScrollPos(t, i, e)
                }, this.doScrollTop = function(t, e) {
                    var i = v.scrollrunning ? v.newscrollx : v.getScrollLeft();
                    v.doScrollPos(i, t, e)
                }, this.doScrollPos = function(t, e, i) {
                    function n() {
                        if (v.cancelAnimationFrame) return !0;
                        if (v.scrollrunning = !0, u = 1 - u) return v.timer = d(n) || 1;
                        var t = 0,
                            e = sy = v.getScrollTop();
                        if (v.dst.ay) {
                            e = v.bzscroll ? v.dst.py + v.bzscroll.getNow() * v.dst.ay : v.newscrolly;
                            var i = e - sy;
                            (0 > i && v.newscrolly > e || i > 0 && e > v.newscrolly) && (e = v.newscrolly), v.setScrollTop(e), e == v.newscrolly && (t = 1)
                        } else t = 1;
                        var r = sx = v.getScrollLeft();
                        if (v.dst.ax) {
                            r = v.bzscroll ? v.dst.px + v.bzscroll.getNow() * v.dst.ax : v.newscrollx;
                            var i = r - sx;
                            (0 > i && v.newscrollx > r || i > 0 && r > v.newscrollx) && (r = v.newscrollx), v.setScrollLeft(r), r == v.newscrollx && (t += 1)
                        } else t += 1; if (2 == t) {
                            if (v.timer = 0, v.cursorfreezed = !1, v.bzscroll = !1, v.scrollrunning = !1, 0 > e ? e = 0 : e > v.page.maxh && (e = v.page.maxh), 0 > r ? r = 0 : r > v.page.maxw && (r = v.page.maxw), r != v.newscrollx || e != v.newscrolly) v.doScrollPos(r, e);
                            else if (v.onscrollend) {
                                var o = {
                                    type: "scrollend",
                                    current: {
                                        x: sx,
                                        y: sy
                                    },
                                    end: {
                                        x: v.newscrollx,
                                        y: v.newscrolly
                                    }
                                };
                                v.onscrollend.call(v, o)
                            }
                        } else v.timer = d(n) || 1
                    }
                    var e = e === void 0 || e === !1 ? v.getScrollTop(!0) : e;
                    if (v.timer && v.newscrolly == e && v.newscrollx == t) return !0;
                    v.timer && f(v.timer), v.timer = 0;
                    var r = v.getScrollTop(),
                        o = v.getScrollLeft();
                    (0 > (v.newscrolly - r) * (e - r) || 0 > (v.newscrollx - o) * (t - o)) && v.cancelScroll(), v.newscrolly = e, v.newscrollx = t, v.bouncescroll && v.rail.visibility || (0 > v.newscrolly ? v.newscrolly = 0 : v.newscrolly > v.page.maxh && (v.newscrolly = v.page.maxh)), v.bouncescroll && v.railh.visibility || (0 > v.newscrollx ? v.newscrollx = 0 : v.newscrollx > v.page.maxw && (v.newscrollx = v.page.maxw)), v.dst = {}, v.dst.x = t - o, v.dst.y = e - r, v.dst.px = o, v.dst.py = r;
                    var s = Math.round(Math.sqrt(Math.pow(v.dst.x, 2) + Math.pow(v.dst.y, 2)));
                    v.dst.ax = v.dst.x / s, v.dst.ay = v.dst.y / s;
                    var a = 0,
                        l = s;
                    0 == v.dst.x ? (a = r, l = e, v.dst.ay = 1, v.dst.py = 0) : 0 == v.dst.y && (a = o, l = t, v.dst.ax = 1, v.dst.px = 0);
                    var c = v.getTransitionSpeed(s);
                    if (i && 1 >= i && (c *= i), v.bzscroll = c > 0 ? v.bzscroll ? v.bzscroll.update(l, c) : new BezierClass(a, l, c, 0, 1, 0, 1) : !1, !v.timer) {
                        (r == v.page.maxh && e >= v.page.maxh || o == v.page.maxw && t >= v.page.maxw) && v.checkContentSize();
                        var u = 1;
                        if (v.cancelAnimationFrame = !1, v.timer = 1, v.onscrollstart && !v.scrollrunning) {
                            var h = {
                                type: "scrollstart",
                                current: {
                                    x: o,
                                    y: r
                                },
                                request: {
                                    x: t,
                                    y: e
                                },
                                end: {
                                    x: v.newscrollx,
                                    y: v.newscrolly
                                },
                                speed: c
                            };
                            v.onscrollstart.call(v, h)
                        }
                        n(), (r == v.page.maxh && e >= r || o == v.page.maxw && t >= o) && v.checkContentSize(), v.noticeCursor()
                    }
                }, this.cancelScroll = function() {
                    return v.timer && f(v.timer), v.timer = 0, v.bzscroll = !1, v.scrollrunning = !1, v
                }) : (this.doScrollLeft = function(t, e) {
                    var i = v.getScrollTop();
                    v.doScrollPos(t, i, e)
                }, this.doScrollTop = function(t, e) {
                    var i = v.getScrollLeft();
                    v.doScrollPos(i, t, e)
                }, this.doScrollPos = function(t, e) {
                    var i = t > v.page.maxw ? v.page.maxw : t;
                    0 > i && (i = 0);
                    var n = e > v.page.maxh ? v.page.maxh : e;
                    0 > n && (n = 0), v.synched("scroll", function() {
                        v.setScrollTop(n), v.setScrollLeft(i), v.cursorfreezed || v.showCursor(v.getScrollTop(), v.getScrollLeft()), v.scrollendtrapped && clearTimeout(v.scrollendtrapped), v.scrollendtrapped = setTimeout(v.onScrollEnd, 100)
                    })
                }, this.onScrollEnd = function() {
                    v.scrollendtrapped = !1;
                    var t = {
                        type: "scrollend",
                        end: {
                            x: v.getScrollLeft(),
                            y: v.getScrollTop()
                        }
                    };
                    v.onscrollend && v.onscrollend.call(v, t)
                }, this.cancelScroll = function() {}), this.doScrollBy = function(t, e) {
                    var i = 0;
                    if (e) i = Math.floor((v.scroll.y - t) * v.scrollratio.y);
                    else {
                        var n = v.timer ? v.newscrolly : v.getScrollTop(!0);
                        i = n - t
                    } if (v.bouncescroll) {
                        var r = Math.round(v.view.h / 2); - r > i ? i = -r : i > v.page.maxh + r && (i = v.page.maxh + r)
                    }
                    return v.cursorfreezed = !1, py = v.getScrollTop(!0), 0 > i && 0 >= py ? v.noticeCursor() : i > v.page.maxh && py >= v.page.maxh ? (v.checkContentSize(), v.noticeCursor()) : (v.doScrollTop(i), void 0)
                }, this.doScrollLeftBy = function(t, e) {
                    var i = 0;
                    if (e) i = Math.floor((v.scroll.x - t) * v.scrollratio.x);
                    else {
                        var n = v.timer ? v.newscrollx : v.getScrollLeft(!0);
                        i = n - t
                    } if (v.bouncescroll) {
                        var r = Math.round(v.view.w / 2); - r > i ? i = -r : i > v.page.maxw + r && (i = v.page.maxw + r)
                    }
                    return v.cursorfreezed = !1, px = v.getScrollLeft(!0), 0 > i && 0 >= px ? v.noticeCursor() : i > v.page.maxw && px >= v.page.maxw ? v.noticeCursor() : (v.doScrollLeft(i), void 0)
                }, this.doScrollTo = function(t, e) {
                    var i = e ? Math.round(t * v.scrollratio.y) : t;
                    0 > i ? i = 0 : i > v.page.maxh && (i = v.page.maxh), v.cursorfreezed = !1, v.doScrollTop(t)
                }, this.checkContentSize = function() {
                    var t = v.getContentSize();
                    (t.h != v.page.h || t.w != v.page.w) && v.resize(!1, t)
                }, v.onscroll = function() {
                    v.rail.drag || v.cursorfreezed || v.synched("scroll", function() {
                        v.scroll.y = Math.round(v.getScrollTop() * (1 / v.scrollratio.y)), v.railh && (v.scroll.x = Math.round(v.getScrollLeft() * (1 / v.scrollratio.x))), v.noticeCursor()
                    })
                }, v.bind(v.docscroll, "scroll", v.onscroll), this.doZoomIn = function(t) {
                    if (!v.zoomactive) {
                        v.zoomactive = !0, v.zoomrestore = {
                            style: {}
                        };
                        var e = ["position", "top", "left", "zIndex", "backgroundColor", "marginTop", "marginBottom", "marginLeft", "marginRight"],
                            i = v.win[0].style;
                        for (var n in e) {
                            var r = e[n];
                            v.zoomrestore.style[r] = i[r] !== void 0 ? i[r] : ""
                        }
                        v.zoomrestore.style.width = v.win.css("width"), v.zoomrestore.style.height = v.win.css("height"), v.zoomrestore.padding = {
                            w: v.win.outerWidth() - v.win.width(),
                            h: v.win.outerHeight() - v.win.height()
                        }, x.isios4 && (v.zoomrestore.scrollTop = c(window).scrollTop(), c(window).scrollTop(0)), v.win.css({
                            position: x.isios4 ? "absolute" : "fixed",
                            top: 0,
                            left: 0,
                            "z-index": l + 100,
                            margin: "0px"
                        });
                        var o = v.win.css("backgroundColor");
                        return ("" == o || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(o)) && v.win.css("backgroundColor", "#fff"), v.rail.css({
                            "z-index": l + 101
                        }), v.zoom.css({
                            "z-index": l + 102
                        }), v.zoom.css("backgroundPosition", "0px -18px"), v.resizeZoom(), v.onzoomin && v.onzoomin.call(v), v.cancelEvent(t)
                    }
                }, this.doZoomOut = function(t) {
                    return v.zoomactive ? (v.zoomactive = !1, v.win.css("margin", ""), v.win.css(v.zoomrestore.style), x.isios4 && c(window).scrollTop(v.zoomrestore.scrollTop), v.rail.css({
                        "z-index": v.zindex
                    }), v.zoom.css({
                        "z-index": v.zindex
                    }), v.zoomrestore = !1, v.zoom.css("backgroundPosition", "0px 0px"), v.onResize(), v.onzoomout && v.onzoomout.call(v), v.cancelEvent(t)) : void 0
                }, this.doZoom = function(t) {
                    return v.zoomactive ? v.doZoomOut(t) : v.doZoomIn(t)
                }, this.resizeZoom = function() {
                    if (v.zoomactive) {
                        var t = v.getScrollTop();
                        v.win.css({
                            width: c(window).width() - v.zoomrestore.padding.w + "px",
                            height: c(window).height() - v.zoomrestore.padding.h + "px"
                        }), v.onResize(), v.setScrollTop(Math.min(v.page.maxh, t))
                    }
                }, this.init(), c.nicescroll.push(this)
            },
            w = function(t) {
                var e = this;
                this.nc = t, this.lastx = 0, this.lasty = 0, this.speedx = 0, this.speedy = 0, this.lasttime = 0, this.steptime = 0, this.snapx = !1, this.snapy = !1, this.demulx = 0, this.demuly = 0, this.lastscrollx = -1, this.lastscrolly = -1, this.chkx = 0, this.chky = 0, this.timer = 0, this.time = function() {
                    return +new Date
                }, this.reset = function(t, i) {
                    e.stop();
                    var n = e.time();
                    e.steptime = 0, e.lasttime = n, e.speedx = 0, e.speedy = 0, e.lastx = t, e.lasty = i, e.lastscrollx = -1, e.lastscrolly = -1
                }, this.update = function(t, i) {
                    var n = e.time();
                    e.steptime = n - e.lasttime, e.lasttime = n;
                    var r = i - e.lasty,
                        o = t - e.lastx,
                        s = e.nc.getScrollTop(),
                        a = e.nc.getScrollLeft(),
                        l = s + r,
                        c = a + o;
                    e.snapx = 0 > c || c > e.nc.page.maxw, e.snapy = 0 > l || l > e.nc.page.maxh, e.speedx = o, e.speedy = r, e.lastx = t, e.lasty = i
                }, this.stop = function() {
                    e.nc.unsynched("domomentum2d"), e.timer && clearTimeout(e.timer), e.timer = 0, e.lastscrollx = -1, e.lastscrolly = -1
                }, this.doSnapy = function(t, i) {
                    var n = !1;
                    0 > i ? (i = 0, n = !0) : i > e.nc.page.maxh && (i = e.nc.page.maxh, n = !0), 0 > t ? (t = 0, n = !0) : t > e.nc.page.maxw && (t = e.nc.page.maxw, n = !0), n && e.nc.doScrollPos(t, i, e.nc.opt.snapbackspeed)
                }, this.doMomentum = function(t) {
                    var i = e.time(),
                        n = t ? i + t : e.lasttime,
                        r = e.nc.getScrollLeft(),
                        o = e.nc.getScrollTop(),
                        s = e.nc.page.maxh,
                        a = e.nc.page.maxw;
                    e.speedx = a > 0 ? Math.min(60, e.speedx) : 0, e.speedy = s > 0 ? Math.min(60, e.speedy) : 0;
                    var l = n && 60 >= i - n;
                    (0 > o || o > s || 0 > r || r > a) && (l = !1);
                    var c = e.speedy && l ? e.speedy : !1,
                        u = e.speedx && l ? e.speedx : !1;
                    if (c || u) {
                        var h = Math.max(16, e.steptime);
                        if (h > 50) {
                            var d = h / 50;
                            e.speedx *= d, e.speedy *= d, h = 50
                        }
                        e.demulxy = 0, e.lastscrollx = e.nc.getScrollLeft(), e.chkx = e.lastscrollx, e.lastscrolly = e.nc.getScrollTop(), e.chky = e.lastscrolly;
                        var f = e.lastscrollx,
                            p = e.lastscrolly,
                            g = function() {
                                var t = e.time() - i > 600 ? .04 : .02;
                                e.speedx && (f = Math.floor(e.lastscrollx - e.speedx * (1 - e.demulxy)), e.lastscrollx = f, (0 > f || f > a) && (t = .1)), e.speedy && (p = Math.floor(e.lastscrolly - e.speedy * (1 - e.demulxy)), e.lastscrolly = p, (0 > p || p > s) && (t = .1)), e.demulxy = Math.min(1, e.demulxy + t), e.nc.synched("domomentum2d", function() {
                                    if (e.speedx) {
                                        var t = e.nc.getScrollLeft();
                                        t != e.chkx && e.stop(), e.chkx = f, e.nc.setScrollLeft(f)
                                    }
                                    if (e.speedy) {
                                        var i = e.nc.getScrollTop();
                                        i != e.chky && e.stop(), e.chky = p, e.nc.setScrollTop(p)
                                    }
                                    e.timer || (e.nc.hideCursor(), e.doSnapy(f, p))
                                }), 1 > e.demulxy ? e.timer = setTimeout(g, h) : (e.stop(), e.nc.hideCursor(), e.doSnapy(f, p))
                            };
                        g()
                    } else e.doSnapy(e.nc.getScrollLeft(), e.nc.getScrollTop())
                }
            },
            x = t.fn.scrollTop;
        t.cssHooks.pageYOffset = {
            get: function(t) {
                var e = c.data(t, "__nicescroll") || !1;
                return e && e.ishwscroll ? e.getScrollTop() : x.call(t)
            },
            set: function(t, e) {
                var i = c.data(t, "__nicescroll") || !1;
                return i && i.ishwscroll ? i.setScrollTop(parseInt(e)) : x.call(t, e), this
            }
        }, t.fn.scrollTop = function(t) {
            if (t === void 0) {
                var e = this[0] ? c.data(this[0], "__nicescroll") || !1 : !1;
                return e && e.ishwscroll ? e.getScrollTop() : x.call(this)
            }
            return this.each(function() {
                var e = c.data(this, "__nicescroll") || !1;
                e && e.ishwscroll ? e.setScrollTop(parseInt(t)) : x.call(c(this), t)
            })
        };
        var k = t.fn.scrollLeft;
        c.cssHooks.pageXOffset = {
            get: function(t) {
                var e = c.data(t, "__nicescroll") || !1;
                return e && e.ishwscroll ? e.getScrollLeft() : k.call(t)
            },
            set: function(t, e) {
                var i = c.data(t, "__nicescroll") || !1;
                return i && i.ishwscroll ? i.setScrollLeft(parseInt(e)) : k.call(t, e), this
            }
        }, t.fn.scrollLeft = function(t) {
            if (t === void 0) {
                var e = this[0] ? c.data(this[0], "__nicescroll") || !1 : !1;
                return e && e.ishwscroll ? e.getScrollLeft() : k.call(this)
            }
            return this.each(function() {
                var e = c.data(this, "__nicescroll") || !1;
                e && e.ishwscroll ? e.setScrollLeft(parseInt(t)) : k.call(c(this), t)
            })
        };
        var T = function(t) {
            var e = this;
            if (this.length = 0, this.name = "nicescrollarray", this.each = function(t) {
                for (var i = 0, n = 0; e.length > i; i++) t.call(e[i], n++);
                return e
            }, this.push = function(t) {
                e[e.length] = t, e.length++
            }, this.eq = function(t) {
                return e[t]
            }, t)
                for (a = 0; t.length > a; a++) {
                    var i = c.data(t[a], "__nicescroll") || !1;
                    i && (this[this.length] = i, this.length++)
                }
            return this
        };
        i(T.prototype, ["show", "hide", "toggle", "onResize", "resize", "remove", "stop", "doScrollPos"], function(t, e) {
            t[e] = function() {
                var t = arguments;
                return this.each(function() {
                    this[e].apply(this, t)
                })
            }
        }), t.fn.getNiceScroll = function(t) {
            if (t === void 0) return new T(this);
            var e = this[t] && c.data(this[t], "__nicescroll") || !1;
            return e
        }, t.extend(t.expr[":"], {
            nicescroll: function(t) {
                return c.data(t, "__nicescroll") ? !0 : !1
            }
        }), c.fn.niceScroll = function(t, e) {
            e === void 0 && ("object" != typeof t || "jquery" in t || (e = t, t = !1));
            var i = new T;
            e === void 0 && (e = {}), t && (e.doc = c(t), e.win = c(this));
            var n = !("doc" in e);
            return n || "win" in e || (e.win = c(this)), this.each(function() {
                var t = c(this).data("__nicescroll") || !1;
                t || (e.doc = n ? c(this) : e.doc, t = new b(e, c(this)), c(this).data("__nicescroll", t)), i.push(t)
            }), 1 == i.length ? i[0] : i
        }, window.NiceScroll = {
            getjQuery: function() {
                return t
            }
        }, c.nicescroll || (c.nicescroll = new T, c.nicescroll.options = m)
    }(jQuery)
}), define("viperjs/gallery/zclip/1.1.1/jquery.zclip.js", [], function(t) {
    "use strict";
    t("jquery"),
    function(t) {
        t.fn.zclip = function(i) {
            if (console.log("zclip!"), "object" == typeof i && !i.length) {
                var n = t.extend({
                    path: "ZeroClipboard.swf",
                    copy: null,
                    beforeCopy: null,
                    afterCopy: null,
                    clickAfter: !0,
                    setHandCursor: !0,
                    setCSSEffects: !0
                }, i);
                return this.each(function() {
                    var i = t(this);
                    if (i.is(":visible") && ("string" == typeof n.copy || t.isFunction(n.copy))) {
                        e.setMoviePath(n.path);
                        var r = new e.Client;
                        t.isFunction(n.copy) && i.bind("zClip_copy", n.copy), t.isFunction(n.beforeCopy) && i.bind("zClip_beforeCopy", n.beforeCopy), t.isFunction(n.afterCopy) && i.bind("zClip_afterCopy", n.afterCopy), r.setHandCursor(n.setHandCursor), r.setCSSEffects(n.setCSSEffects), r.addEventListener("mouseOver", function() {
                            i.trigger("mouseenter")
                        }), r.addEventListener("mouseOut", function() {
                            i.trigger("mouseleave")
                        }), r.addEventListener("mouseDown", function() {
                            i.trigger("mousedown"), t.isFunction(n.copy) ? r.setText(i.triggerHandler("zClip_copy")) : r.setText(n.copy), t.isFunction(n.beforeCopy) && i.trigger("zClip_beforeCopy")
                        }), r.addEventListener("complete", function(e, r) {
                            t.isFunction(n.afterCopy) ? i.trigger("zClip_afterCopy") : (r.length > 500 && (r = r.substr(0, 500) + "...\n\n(" + (r.length - 500) + " characters not shown)"), i.removeClass("hover"), alert("Copied text to clipboard:\n\n " + r)), n.clickAfter && i.trigger("click")
                        }), r.glue(i[0], i.parent()[0]), t(window).bind("load resize", function() {
                            r.reposition()
                        })
                    }
                })
            }
            return "string" == typeof i ? this.each(function() {
                var e = t(this);
                i = i.toLowerCase();
                var n = e.data("zclipId"),
                    r = t("#" + n + ".zclip");
                "remove" == i ? (r.remove(), e.removeClass("active hover")) : "hide" == i ? (r.hide(), e.removeClass("active hover")) : "show" == i && r.show()
            }) : void 0
        }
    }(jQuery);
    var e = {
        version: "1.0.7",
        clients: {},
        moviePath: "ZeroClipboard.swf",
        nextId: 1,
        $: function(t) {
            return "string" == typeof t && (t = document.getElementById(t)), t.addClass || (t.hide = function() {
                this.style.display = "none"
            }, t.show = function() {
                this.style.display = ""
            }, t.addClass = function(t) {
                this.removeClass(t), this.className += " " + t
            }, t.removeClass = function(t) {
                for (var e = this.className.split(/\s+/), i = -1, n = 0; e.length > n; n++) e[n] == t && (i = n, n = e.length);
                return i > -1 && (e.splice(i, 1), this.className = e.join(" ")), this
            }, t.hasClass = function(t) {
                return !!this.className.match(RegExp("\\s*" + t + "\\s*"))
            }), t
        },
        setMoviePath: function(t) {
            this.moviePath = t
        },
        dispatch: function(t, e, i) {
            var n = this.clients[t];
            n && n.receiveEvent(e, i)
        },
        register: function(t, e) {
            this.clients[t] = e
        },
        getDOMObjectPosition: function(t, e) {
            var i = {
                left: 0,
                top: 0,
                width: t.width ? t.width : t.offsetWidth,
                height: t.height ? t.height : t.offsetHeight
            };
            return t && t != e && (i.left += t.offsetLeft, i.top += t.offsetTop), i
        },
        Client: function(t) {
            this.handlers = {}, this.id = e.nextId++, this.movieId = "ZeroClipboardMovie_" + this.id, e.register(this.id, this), t && this.glue(t)
        }
    };
    e.Client.prototype = {
        id: 0,
        ready: !1,
        movie: null,
        clipText: "",
        handCursorEnabled: !0,
        cssEffects: !0,
        handlers: null,
        glue: function(t, i, n) {
            this.domElement = e.$(t);
            var r = 99;
            this.domElement.style.zIndex && (r = parseInt(this.domElement.style.zIndex, 10) + 1), "string" == typeof i ? i = e.$(i) : i === void 0 && (i = document.getElementsByTagName("body")[0]);
            var o = e.getDOMObjectPosition(this.domElement, i);
            this.div = document.createElement("div"), this.div.className = "zclip", this.div.id = "zclip-" + this.movieId, $(this.domElement).data("zclipId", "zclip-" + this.movieId);
            var s = this.div.style;
            if (s.position = "absolute", s.left = "" + o.left + "px", s.top = "" + o.top + "px", s.width = "" + o.width + "px", s.height = "" + o.height + "px", s.zIndex = r, "object" == typeof n)
                for (addedStyle in n) s[addedStyle] = n[addedStyle];
            i.appendChild(this.div), this.div.innerHTML = this.getHTML(o.width, o.height)
        },
        getHTML: function(t, i) {
            var n = "",
                r = "id=" + this.id + "&width=" + t + "&height=" + i;
            if (navigator.userAgent.match(/MSIE/)) {
                var o = location.href.match(/^https/i) ? "https://" : "http://";
                n += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + o + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + t + '" height="' + i + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + e.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + r + '"/><param name="wmode" value="transparent"/></object>'
            } else n += '<embed id="' + this.movieId + '" src="' + e.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + t + '" height="' + i + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + r + '" wmode="transparent" />';
            return n
        },
        hide: function() {
            this.div && (this.div.style.left = "-2000px")
        },
        show: function() {
            this.reposition()
        },
        destroy: function() {
            if (this.domElement && this.div) {
                this.hide(), this.div.innerHTML = "";
                var t = document.getElementsByTagName("body")[0];
                try {
                    t.removeChild(this.div)
                } catch (e) {}
                this.domElement = null, this.div = null
            }
        },
        reposition: function(t) {
            if (t && (this.domElement = e.$(t), this.domElement || this.hide()), this.domElement && this.div) {
                var i = e.getDOMObjectPosition(this.domElement),
                    n = this.div.style;
                n.left = "" + i.left + "px", n.top = "" + i.top + "px"
            }
        },
        setText: function(t) {
            this.clipText = t, this.ready && this.movie.setText(t)
        },
        addEventListener: function(t, e) {
            t = ("" + t).toLowerCase().replace(/^on/, ""), this.handlers[t] || (this.handlers[t] = []), this.handlers[t].push(e)
        },
        setHandCursor: function(t) {
            this.handCursorEnabled = t, this.ready && this.movie.setHandCursor(t)
        },
        setCSSEffects: function(t) {
            this.cssEffects = !!t
        },
        receiveEvent: function(t, e) {
            switch (t = ("" + t).toLowerCase().replace(/^on/, "")) {
                case "load":
                    if (this.movie = document.getElementById(this.movieId), !this.movie) {
                        var i = this;
                        return setTimeout(function() {
                            i.receiveEvent("load", null)
                        }, 1), void 0
                    }
                    if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                        var i = this;
                        return setTimeout(function() {
                            i.receiveEvent("load", null)
                        }, 100), this.ready = !0, void 0
                    }
                    this.ready = !0;
                    try {
                        this.movie.setText(this.clipText)
                    } catch (n) {}
                    try {
                        this.movie.setHandCursor(this.handCursorEnabled)
                    } catch (n) {}
                    break;
                case "mouseover":
                    this.domElement && this.cssEffects && (this.domElement.addClass("hover"), this.recoverActive && this.domElement.addClass("active"));
                    break;
                case "mouseout":
                    this.domElement && this.cssEffects && (this.recoverActive = !1, this.domElement.hasClass("active") && (this.domElement.removeClass("active"), this.recoverActive = !0), this.domElement.removeClass("hover"));
                    break;
                case "mousedown":
                    this.domElement && this.cssEffects && this.domElement.addClass("active");
                    break;
                case "mouseup":
                    this.domElement && this.cssEffects && (this.domElement.removeClass("active"), this.recoverActive = !1)
            }
            if (this.handlers[t])
                for (var r = 0, o = this.handlers[t].length; o > r; r++) {
                    var s = this.handlers[t][r];
                    "function" == typeof s ? s(this, e) : "object" == typeof s && 2 == s.length ? s[0][s[1]](this, e) : "string" == typeof s && window[s](this, e)
                }
        }
    }, window.ZeroClipboard = e
}), define("viperjs/widget/jquery_plugin/jquery_mousewheel.js", [], function() {
    function t(t) {
        var i = t || window.event,
            n = [].slice.call(arguments, 1),
            r = 0,
            o = 0,
            s = 0;
        return t = e.event.fix(i), t.type = "mousewheel", i.wheelDelta && (r = i.wheelDelta / 120), i.detail && (r = -i.detail / 3), s = r, void 0 !== i.axis && i.axis === i.HORIZONTAL_AXIS && (s = 0, o = -1 * r), void 0 !== i.wheelDeltaY && (s = i.wheelDeltaY / 120), void 0 !== i.wheelDeltaX && (o = -1 * i.wheelDeltaX / 120), n.unshift(t, r, o, s), (e.event.dispatch || e.event.handle).apply(this, n)
    }
    var e = $,
        i = ["DOMMouseScroll", "mousewheel"];
    if (e.event.fixHooks)
        for (var n = i.length; n;) e.event.fixHooks[i[--n]] = e.event.mouseHooks;
    e.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var e = i.length; e;) this.addEventListener(i[--e], t, !1);
            else this.onmousewheel = t
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var e = i.length; e;) this.removeEventListener(i[--e], t, !1);
            else this.onmousewheel = null
        }
    }, e.fn.extend({
        mousewheel: function(t) {
            return t ? this.bind("mousewheel", t) : this.trigger("mousewheel")
        },
        unmousewheel: function(t) {
            return this.unbind("mousewheel", t)
        }
    })
}), define("viperjs/widget/slider/slider_y.js", [], function(t) {
    var e = t("widget/slider/slider"),
        i = e.create(),
        n = i.prototype;
    return n.init = function(t) {
        t.direction = 2, this.supInit(t)
    }, i
}), define("viperjs/widget/slider/slider.js", [], function(t) {
    var e = t("event"),
        i = t("widget/dragger/dragger"),
        n = e.create();
    return _proSlider = n.prototype, _proSlider.init = function(t) {
        this.supInit(t), this.__dopt = {
            onchange: this.__onChange.bind(this, !1),
            ondragend: this.__onChange.bind(this, !0)
        }, this.__dopt.direction = t.direction, this.__dopt.view = $(t.track).get(0), this.__dopt.body = $(t.slide).get(0), this.setRange(t.range), t.stp && $(this.__dopt.view).on("mousedown", this.__onSlideToPosition.bind(this)), this.__dragger = new i(this.__dopt)
    }, _proSlider.__destroy = function() {
        this.__supDestroy(), this.__dragger.recycle(), delete this.__dragger, delete this.__range, delete this.__dopt.view, delete this.__dopt.body, delete this.__dopt.mbar
    }, _proSlider.__onChange = function(t, e) {
        var i = e.left / this.__range.x[1],
            n = e.top / this.__range.y[1],
            r = this.__range.x,
            o = this.__range.y;
        this.trigger("onchange", {
            stopped: !!t,
            x: {
                rate: i,
                value: i * (r[1] - r[0])
            },
            y: {
                rate: n,
                value: n * (o[1] - o[0])
            }
        })
    }, _proSlider.__onSlideToPosition = function(t) {
        var e = $(this.__dopt.view).offset(),
            i = {
                x: t.pageX,
                y: t.pageY
            },
            n = {
                x: Math.floor(this.__dopt.body.offsetWidth / 2),
                y: Math.floor(this.__dopt.body.offsetHeight / 2)
            };
        this.__dragger.setPosition({
            top: i.y - e.top - n.y,
            left: i.x - e.left - n.x
        })
    }, _proSlider.setRange = function(t) {
        var e;
        if (this.__range) {
            var i = this.__dragger.getPosition();
            e = {
                x: i.left / this.__range.x[1],
                y: i.top / this.__range.y[1]
            }
        }
        t = t || {};
        var n = (t.x || [])[1] || this.__dopt.view.clientWidth - this.__dopt.body.offsetWidth,
            r = (t.y || [])[1] || this.__dopt.view.clientHeight - this.__dopt.body.offsetHeight;
        return this.__range = {
            x: t.x || [0, n],
            y: t.y || [0, r]
        }, e && this.setPosition(e), this
    }, _proSlider.setPosition = function(t) {
        t = t || _o, this.__dragger.setPosition({
            top: this.__range.y[1] * (t.y || 0),
            left: this.__range.x[1] * (t.x || 0)
        })
    }, n
}), define("app/action/action.js", [], function(t) {
    "use strict";

    function e(t, e) {
        return _.isFunction(t) ? t : (e = e || r, e.create(t))
    }
    var i = t("event"),
        n = t("common/action/action_center"),
        r = t("./base"),
        o = i.create(),
        s = o.prototype;
    return s.ACTIONS = {}, s.COMMANDS = [], s.init = function(t) {
        this.supInit.apply(this, arguments), t.view, t.reader, this.__center = new n({
            views: t.view.modules,
            view: t.view,
            control: t.reader,
            actions: this.ACTIONS
        }), this.__doAction()
    }, s.__doAction = function() {
        _.each(this.COMMANDS, function(t) {
            this.__center.excute(t)
        }, this)
    }, o.mixTo = function(t, i) {
        i && (s.COMMANDS = _.union(s.COMMANDS, i)), _.each(t, function(t, i) {
            s.ACTIONS[i] = s.ACTIONS[i] ? e(t, s.ACTIONS[i]) : e(t)
        }, this)
    }, o
}), define("app/action/app.js", [], function(t) {
    "use strict";
    var e = t("./base"),
        i = t("widget/layer/window"),
        n = t("tpl"),
        r = t("widget/mask/mask"),
        o = t("common"),
        s = t("common/noob/noob"),
        a = e.create(),
        l = a.prototype;
    return l._showWelcome = function() {
        var t = $(".j-md-help");
        this.__reader.welcome() || (t.fadeIn(), setTimeout(function() {
            t.fadeOut()
        }.bind(this), 3e3), this.__reader.welcome(1))
    }, l._askProgress = function() {
        this.__reader.getProgressOnline().done(function(t) {
            var e = this.__reader.getView().page;
            if (t != e) {
                var r = {
                        "click .j-confirm": function() {
                            return this.__reader.go(t, !0, !0), s.hide(), !1
                        }.bind(this),
                        "click .j-cancel": function() {
                            return this.__reader.syncLocalProgress(), s.hide(), !1
                        }.bind(this)
                    },
                    o = {
                        destroyable: !0,
                        template: n.getJst("jst-syn-warn", {
                            local: e,
                            remote: t
                        }),
                        events: r
                    },
                    s = new i(o);
                s.show()
            }
        }.bind(this))
    }, l._toggleControl = function() {
        var t = null;
        return function(e) {
            t = t || new r({
                parent: ".j-page-wrapper",
                className: "u-mask-ctrl",
                events: {
                    click: function() {
                        console.log("click"), this.__views.comment.hide(), this.__views.toc.hide()
                    }.bind(this)
                }
            }), e ? (t.show(), $("#reader_others").show()) : (t.hide(), $("#reader_others").hide())
        }
    }(), l._goPay = function() {
        var t = this.__reader.getBook().info;
        window.open(this.__reader.getBook().detail.pay_url + (t.coupon ? "#coupon" : ""))
    }, l._goBook = function() {
        window.open(this.__reader.getBook().detail.last_url)
    }, l._noobDetect = function() {
        !o.isLogin() && s.reset(), s.detect({
            login: function() {
                $("#noob_tips").show().attr("href", "/login").find(".txt").text("领取新手礼包")
            },
            success: function() {
                $("#noob_tips").show().attr("href", "/u/coupon")
            }
        })
    }, l._savePreference = function() {
        o.addBasicCookie("reader_preference", "horizontal", 365)
    }, l._switchDirection = t("./switch-direction"), l._renderPage = t("./render-page"), l._keyPress = t("./keypress"), l._freeLimit = t("./freelimit"), a
}), define("app/common/action/action_center.js", [], function(t) {
    "use strict";
    t("jquery");
    var e = t("event");
    "off" === $(document.body).attr("data-api");
    var i = e.create(),
        n = i.prototype;
    return n.init = function(t) {
        this.supInit.apply(this, arguments), this.actions = t.actions, this.views = t.views, this.control = t.control, this.options = t, _.each(this.views, function(t, e) {
            this.listenTo(t, "all", this.__listen.bind(this, e))
        }, this), $(document).on("click", "[data-action]", this.__onWindowAction.bind(this))
    }, n.__listen = function(t, e) {
        if (0 === e.indexOf("act:")) {
            var i = Array.prototype.slice.call(arguments, 2);
            this.__doCommand(t, e.substr(4), i)
        }
    }, n.__onWindowAction = function(t) {
        var e = $(t.currentTarget),
            i = e.data("action");
        this.excute(i)
    }, n.__doCommand = function(t, e, i) {
        var n = this.actions[t];
        if (n) {
            if (_.isFunction(n) && (n = new n(_.extend({
                name: t
            }, this.options)), this.actions[t] = n), n.find(e)) return n.run(e, i), !0;
            if ("app" == t) return
        }
        return this.__doCommand("app", e, i)
    }, n.excute = function(t) {
        var e = t.split(":"),
            i = e[1] ? e[0] : "app",
            n = e[e.length - 1],
            r = Array.prototype.slice(arguments, 1);
        this.__doCommand(i, n, r)
    }, i
}), define("app/action/base.js", [], function(t) {
    "use strict";
    var e = t("common/action/action"),
        i = e.create(),
        n = i.prototype;
    return n.init = function(t) {
        this.supInit.apply(this, arguments), this.__reader = t.control, this.__views = t.views, this.__name = t.name, this.__viewCenter = t.view
    }, i
}), define("app/common/action/action.js", [], function(t) {
    "use strict";
    var e = t("event"),
        i = e.create(),
        n = i.prototype;
    return n.init = function() {
        this.supInit.apply(this, arguments), this.__commands = {};
        var t = this.constructor.prototype;
        _.each(_.functions(t), function(e) {
            "_" == e.charAt(0) && "_" != e.charAt(1) && this.regist(e.substr(1), t[e].bind(this))
        }, this)
    }, n.regist = function(t, e) {
        arguments.length > 1 ? this.__commands[t] = e : _.extend(this.__commands, t)
    }, n.run = function(t, e) {
        var t = this.find(t);
        if (t) return t.apply(this, e)
    }, n.find = function(t) {
        return this.__commands[t]
    }, i
}), define("app/common/noob/noob.js", [], function(t) {
    "use strict";

    function e() {
        u.addBasicCookie("store_noob", "check", 0)
    }

    function i() {
        var t = u.getCookie("user_id"),
            e = h.get("noob_list") || [];
        r() || (e.push(t), h.set("noob_list", e))
    }

    function n() {
        return -1 == (u.getCookie("user_id") || "unknown").indexOf("@")
    }

    function r() {
        var t = h.get("noob_list") || [],
            e = u.getCookie("user_id") || "unknown";
        return -1 !== t.indexOf(e)
    }

    function o() {
        return !u.getCookie("store_noob")
    }

    function s() {
        if (o())
            if (n()) {
                if (r()) return e(), void 0;
                var t = {
                    type: "POST",
                    dataType: "json"
                };
                t.data = u.getInfo(), $.ajax("/store/v0/gift/noob/take", t).done(function(t) {
                    var n = t.result;
                    switch (n) {
                        case d:
                            m(), i();
                            break;
                        case f:
                            i()
                    }
                    e()
                })
            } else {
                var t = {
                    type: "GET",
                    dataType: "json"
                };
                t.data = {
                    t: +new Date
                }, $.ajax("/store/v0/gift/noob/info", t).done(function(t) {
                    var i = t.result;
                    0 == i && t.coupon_data.length && _(), e()
                })
            }
    }

    function a() {
        if (o()) {
            var t = {
                type: "GET",
                dataType: "json"
            };
            t.data = {
                t: +new Date
            }, $.ajax("/store/v0/gift/noob/info", t).done(function(t) {
                var i = t.result;
                0 == i && t.coupon_data.length && g(t), e()
            })
        }
    }

    function l() {
        u.delBasicCookie("store_noob")
    }

    function c(t) {
        g = t.login || p, _ = t.migrate || p, m = t.success || p, u.isLogin() ? s() : a()
    }
    var u = t("common"),
        h = t("gallery/store/1.3.5/store"),
        d = 0,
        f = 120001,
        p = function() {
            return -1
        },
        g = p,
        _ = p,
        m = p;
    return {
        detect: c,
        reset: l
    }
}), define("app/action/switch-direction.js", [], function() {
    "use strict";

    function t() {
        this.__views.book && this.__views.book.recycle(), delete this.__views.book, this.__views.horizontalBody && this.__views.horizontalBody.recycle(), delete this.__views.horizontalBody, this.__viewCenter.instance("verticalBook"), this.__viewCenter.instance("verticalBody"), this.__reader.setTraitdouble({
            trait: 1,
            "double": 1
        }), this.__reader.prefer("vertical")
    }

    function e() {
        this.__views.verticalBook && this.__views.verticalBook.recycle(), delete this.__views.verticalBook, this.__views.verticalBody && this.__views.verticalBody.recycle(), delete this.__views.verticalBody, this.__viewCenter.instance("book"), this.__viewCenter.instance("horizontalBody"), this.__reader.prefer("horizontal")
    }
    return function(i) {
        $(".j-page-wrapper").css("visibility", "hidden"), "vertical" == i || this.__views.book ? t.call(this) : e.call(this), setTimeout(function() {
            $(".j-page-wrapper").css("visibility", "")
        }, 0)
    }
}), define("app/action/render-page.js", [], function() {
    "use strict";

    function t(t, e) {
        t.call(this, this.__reader, e)
    }

    function e(t, e) {
        var i = t.getBook().info;
        i.coupon && e.addClass("buy-quan").html('<span class="icn-quan">券</span>免费兑换')
    }
    return function() {
        var i = t.bind(this);
        i(e, $("#buy-icon"))
    }
}), define("app/action/keypress.js", [], function() {
    "use strict";

    function t(t) {
        var r = t.target;
        if (r && /INPUT|TEXTAREA|SELECT|OPTION/.test(r.nodeName)) {
            var a = r.getAttribute("type") || r.type || !1;
            if (!a || !/submit|button|cancel/i.tp) return !0
        }
        var l = t.which;
        t.ctrlKey || !1, t.shiftKey || !1;
        var c = !1,
            u = "vertical" == this.__reader.prefer();
        switch (l) {
            case 38:
            case 63233:
                u ? e() : (s(), c = !0);
                break;
            case 40:
            case 63235:
                u ? i() : (o(), c = !0);
                break;
            case 33:
            case 63276:
            case 37:
            case 63232:
                s(), c = !0;
                break;
            case 34:
            case 63277:
            case 39:
            case 63234:
                o(), c = !0
        }
        return c ? n(t) : void 0
    }

    function e() {
        var t = $(".j-page-wrapper").scrollTop();
        $(".j-page-wrapper").scrollTop(t - 30)
    }

    function i() {
        var t = $(".j-page-wrapper").scrollTop();
        $(".j-page-wrapper").scrollTop(t + 30)
    }

    function n(t) {
        t.preventDefault(), t.stopPropagation()
    }
    var r = null,
        o = _.throttle(function() {
            r.pageDown()
        }, 250),
        s = _.throttle(function() {
            r.pageUp()
        }, 250);
    return function() {
        r = this.__reader;
        var e = {};
        e.isopera = "opera" in window, e.isopera12 = e.isopera && "getUserMedia" in navigator;
        var i = e.isopera && !e.isopera12 ? "keypress" : "keydown";
        $(document).on(i, t.bind(this))
    }
}), define("app/action/freelimit.js", [], function(t) {
    "use strict";
    var e = t("common"),
        i = t("widget/layer/window"),
        n = t("tpl");
    return function() {
        function t() {
            return l.getBook().typo.own_book
        }

        function r() {
            return 1e3 * l.getBook().detail.limited_time < Date.now()
        }

        function o(t) {
            return Math.max(Math.min(Math.floor(.15 * t), 60), 15)
        }

        function s() {
            var t = u,
                e = l.getView().page;
            e > t && (r() ? d.show() : h.show())
        }

        function a() {
            var t, e = i.create({
                    className: "u-layer",
                    events: {
                        "click .j-close-book": function() {
                            location.href = this.detail.last_url
                        }
                    },
                    initialize: function(t) {
                        this.detail = t.reader.getBook().detail, this.render()
                    },
                    render: function() {
                        var t = this.detail,
                            e = 1e3 * t.limited_time,
                            i = {
                                book: t,
                                tips: this.getLimitTips(e),
                                isOver: Date.now() > e
                            };
                        this.$el.html(n.getJst("jst-free-limit", i))
                    },
                    getLimitTips: function(t) {
                        var e = t - Date.now(),
                            i = "";
                        if (0 > e) return i = "限时免费已经结束，购买后可继续阅读";
                        var n = Math.floor(e / 3600 / 1e3 / 24);
                        if (i = "限时免费还剩", n) i += n + "天";
                        else {
                            var r = Math.floor(e / 3600 / 1e3);
                            if (r) i += r + "小时";
                            else {
                                var o = Math.floor(e / 60 / 1e3);
                                o >= 15 ? i += o + "分钟" : i = "限时免费即将结束"
                            }
                        }
                        return i
                    }
                }),
                r = !1;
            return {
                show: function() {
                    t || (t = new e({
                        reader: l
                    })), r || (r = !0, t.render(), t.show())
                },
                close: function() {
                    _dialog.hide()
                }
            }
        }
        var l = this.__reader;
        if (!t() && !r()) {
            r() || (e.forbidForFree = !0, vp.pushCSSText("#button-comment, #button-mark{color: #888; text-decoration: line-through;}"));
            var c = l.getBook().typo.number_of_pages,
                u = o(c),
                h = a(),
                d = a();
            s(), l.on("scrollend", s)
        }
    }
}), define("app/common/statistic/statistic.js", [], function() {
    var t = function() {
        if (-1 == location.href.indexOf("www.n")) {
            window._hmt = window._hmt || [];
            var t = document.createElement("script");
            t.src = "//hm.baidu.com/hm.js?1c932f22da573f2870e8ab565f4ff9cb";
            var e = document.getElementsByTagName("script")[0];
            e.parentNode.insertBefore(t, e)
        }
    };
    return t()
}), define("app/patched/shop.js", [], function(t) {
    "use strict";

    function e() {
        $(window).off("beforeunload"), $(".j-fullscreen").remove(), "itools" == a && (r._goPay = r._goPay.aop(function(t) {
            external && external.NewWindow("http://www.duokan.com/pay/" + s), t.stopped = !0
        }), $(".downapp").attr("target", ""), $("#noob_tips").attr("target", "")), "wdj" == a && (r._goPay = r._goPay.aop(function(t) {
            $("<a>").attr({
                href: "http://www.duokan.com/pay/" + s,
                target: "_default"
            })[0].click(), t.stopped = !0
        }))
    }
    t("core"), t("jquery");
    var i = t("util"),
        n = t("ext/util");
    t("../data/remote");
    var r = t("../action/app").prototype,
        o = location.href.match(/shop=(.*?)(?:&|$)/);
    if (!o) return _f;
    var s = i.parseUrl(location.href).query.id,
        a = o[1];
    return n.formatBook = n.formatBook.aop(null, function(t) {
        var e = t.value;
        e.last_url = (a ? "/shop/" + a : "") + e.url, e.pay_url = e.pay_url + (a ? "?shop=" + a : ""), e.shop = !0
    }), e
}), define("app/reader/reader.js", [], function(t) {
    "use strict";
    var e = t("event"),
        i = t("../data/data"),
        n = t("./history"),
        r = t("./book"),
        o = t("./page_control"),
        s = t("./notes"),
        a = t("./readstat"),
        l = Math.pow(2, 31),
        c = e.create(),
        u = c.prototype;
    u.init = function(t) {
        this.supInit.apply(this, arguments), this.__globalAjax(), this.options = t;
        var e = {
            id: t.uuid,
            revision: t.revision,
            traitDouble: this.options.global.traitDouble,
            traits: this.options.global.traits
        };
        this.modules = {
            book: new r(e),
            page: null,
            history: null,
            notes: null
        }, this.modules.notes = new s({
            book_id: t.uuid,
            reader: this
        }), this.modules.readstat = new a({
            reader: this
        }), $.when(this.modules.book.getDefferred()).done(function() {
            this.__doBuild()
        }.bind(this))
    }, u.__doBuild = function() {
        var t = this.modules.book.getBook();
        this.modules.history = new n({
            id: t.info.id,
            revision: t.info.revision,
            pos2chapter: function(t) {
                for (var e = this.modules.book.getBook(), i = e.typo.chapters, n = h(t, e), r = "", o = 0; i.length > o; o++) n >= i[o].page_range[0] && i[o].page_range[1] >= n && (r = i[o].cid);
                return r
            }.bind(this)
        });
        var e = this.modules.history.get(),
            i = h(e, t);
        this.modules.page = new o({
            page: i,
            size: t.info.size,
            "double": t.info.double
        }), this.listenTo(this.modules.book, "doublechange", this.__onDoubleChange.bind(this)), this.listenTo(this.modules.book, "traitchange", this.__onTraitChange.bind(this)), this.listenTo(this.modules.page, "scroll", this.__onScroll.bind(this)), this.listenTo(this.modules.page, "scrollend", this.__onScrollEnd.bind(this));
        var r = this.setup();
        this.__output(r), this.modules.page.go(i, !0), this.trigger("ready")
    }, u.__onDoubleChange = function() {
        var t = this.modules.book.getBook();
        this.modules.page.setDouble(t.info.double), this.trigger("doublechange")
    }, u.__onTraitChange = function() {
        this.trigger("traitchange");
        var t = this.modules.book.getBook(),
            e = this.modules.history.get(),
            i = h(e, t);
        this.modules.page.setSize(t.info.size), this.modules.page.go(i, !0)
    }, u.__onScroll = function() {
        var t = this.modules.book.getBook(),
            e = this.modules.page.getPage();
        this.modules.history.setLocal(d(e, t));
        var i = _.toArray(arguments);
        i.unshift("scroll"), this.trigger.apply(this, i)
    }, u.__onScrollEnd = function() {
        var t = this.modules.book.getBook(),
            e = this.modules.page.getPage(),
            i = d(e, t);
        this.modules.history.setLocal(i), this.trigger("scrollend")
    }, u.__globalAjax = function() {
        var t = 1001,
            e = 4;
        $.getBSONSetup({
            dataFilter: function(i) {
                if ("error" != i.status) return i;
                switch (i.result) {
                    case t:
                        $(window).off("beforeunload"), location.href = "/login";
                        break;
                    case e:
                        $(window).off("beforeunload"), location.href = "/book/" + this.modules.book.getBook().info.id
                }
            }
        })
    }, u.setup = function() {
        return {}
    }, u.__output = function(t) {
        $.isPlainObject(t) || (t = {}), t = _.extend({
            options: this.options,
            notes: this.modules.notes,
            readstat: this.modules.readstat,
            welcome: i.local.welcome,
            prefer: i.local.prefer,
            getProgressOnline: function() {
                var t = $.Deferred();
                return this.modules.history.getOnline().done(function(e) {
                    var i = this.modules.book.getBook(),
                        n = h(e, i);
                    t.resolve(n)
                }.bind(this)), t.promise()
            },
            syncLocalProgress: this.modules.history.setOnline.bind(this.modules.history),
            pages: {
                get: function(t) {
                    var e = this.modules.book.getBook(),
                        n = e.typo.pages;
                    return i.remote.getPage(n[t - 1].page_id, e.info.id)
                }.bind(this)
            },
            getView: this.__getViewport.bind(this),
            getBook: this.modules.book.getBook.bind(this.modules.book),
            checkViewport: this.modules.book.checkViewport.bind(this.modules.book),
            setTraitdouble: this.modules.book.setTraitdouble.bind(this.modules.book),
            getTocName: this.modules.book.getTocName.bind(this.modules.book),
            getNumByPos: function(t) {
                return h(t, this.modules.book.getBook())
            }.bind(this),
            pageUp: this.modules.page.pageUp.bind(this.modules.page),
            pageDown: this.modules.page.pageDown.bind(this.modules.page),
            go: this.modules.page.go.bind(this.modules.page),
            scrollTo: this.modules.page.scrollTo.bind(this.modules.page),
            simpleScrollByDelta: this.modules.page.simpleScrollByDelta.bind(this.modules.page),
            simpleScrollEnd: this.modules.page.simpleScrollEnd.bind(this.modules.page),
            block: this.modules.page.block.bind(this.modules.page)
        }, t), _.extend(this, t), this.notes.addBookmark = function(t) {
            var e = $.Deferred();
            return this.pages.get(t).done(function(i) {
                for (var n = "", r = 0, o = 0; i.items.length > r && 100 > o; r++) "word" == i.items[r].type && (n += i.items[r].char, o++);
                this.notes.addBookmarkAtPage(t, n).done(function() {
                    e.resolve()
                }).fail(function() {
                    e.reject()
                })
            }.bind(this)), e.promise()
        }.bind(this), this.notes.checkBookmark = function(t) {
            var e = this.getBook().info.double,
                i = this.notes.checkHasBookmark(t);
            if (1 == e) return i;
            var n, r = $.Deferred();
            return n = this.notes.checkHasBookmark(t + 1), $.when(i, n).done(function(t, e) {
                console.log("arg1, args2", t, e), r.resolve(t || e)
            }.bind(this)), r.promise()
        }.bind(this)
    }, u.__getViewport = function() {
        var t = function(t) {
            var e = [],
                i = Math.floor(t / 2);
            return _.each(_.range(t), function(t) {
                t -= i, e.push(t)
            }), e
        };
        return function() {
            var e = this.modules.book.getBook(),
                i = this.modules.page.getPage(),
                n = e.info.size,
                r = this.options.global.maxPages,
                o = [];
            return _.each(t(r), function(t) {
                var e = i + t;
                e > 0 && n >= e && o.push(e)
            }), {
                page: i,
                size: n,
                range: o
            }
        }
    }();
    var h = function() {
            var t = function(t, e) {
                return t[0] > e[0] || t[0] == e[0] && t[1] > e[1] || t[0] == e[0] && t[1] == e[1] && t[2] > e[2]
            };
            return function(e, i) {
                var n = 1;
                if (!e || !e.length) return n;
                var r, o = i.info.size - 1,
                    s = i.typo.pages;
                for (r = o - 1; r >= 0 && t(s[r].position, e); r--);
                return 0 > r && (r = 0), n = s[r].page_number, n == o && e[1] >= l && (n += 1), n
            }
        }(),
        d = function(t, e) {
            e.info.id;
            var i = e.info.size,
                n = e.info.size - 1,
                r = e.typo.pages;
            e.typo.chapters, t = Math.max(Math.min(i, t), 1);
            var o = {};
            if (t == i) return o = r[n - 1], o.position[1] = l, o.position;
            var s;
            for (s = 0; n > s; s++) r[s].page_number == t && (o = r[s]);
            return o.position
        };
    return c.mixTo = function(t) {
        _.extend(u, t)
    }, c
}), define("app/reader/history.js", [], function(t) {
    "use strict";
    t("ext/json2xml.js"), t("ext/xml2json.js");
    var e = t("event"),
        i = t("../data/data"),
        n = t("common"),
        r = e.create(),
        o = r.prototype;
    return o.init = function(t) {
        this.supInit.apply(this, arguments), this.__info = {
            id: t.id,
            revision: t.revision,
            position: []
        }, _.extend(this.__info, i.local.getProgress(this.__info.id, this.__info.revision)), this.__pos2chapter = t.pos2chapter, n.isLogin() && ($(window).on("beforeunload", function() {
            return this.setOnline(), "离开此页将关闭多看阅读器, 您的阅读进度将自动保存"
        }.bind(this)), this.__timer = window.setInterval(this.setOnline.bind(this), 3e5))
    }, o.setLocal = function(t) {
        this.__info.position = t, i.local.setProgress(this.__info)
    }, o.get = function() {
        return this.__info.position
    }, o.getOnline = function() {
        var t = $.Deferred();
        return i.remote.getProgress(this.__info.id).done(function(e) {
            t.resolve(e)
        }), t.promise()
    }, o.setOnline = function() {
        if (!_.isEqual(this.__info.position, this.__lastPos)) {
            this.__lastPos = this.__info.position;
            var t = this.__pos2chapter(this.__info.position);
            return i.remote.setProgroess(this.__info.id, this.__info.revision, this.__info.position, t)
        }
    }, r
}), define("app/reader/book.js", [], function(t) {
    "use strict";
    var e = t("event"),
        i = t("../data/data"),
        n = [],
        r = e.create(),
        o = r.prototype;
    return o.init = function(t) {
        this.supInit.apply(this, arguments), this.options = t;
        var e = {
                name: "unkown",
                width: 0,
                height: 0
            },
            i = 1;
        _.isArray(t.traits) && (n = t.traits), t.traitDouble ? (e = n[t.traitDouble.trait], i = t.traitDouble.double || 1) : (e = this.__getTraitDouble().trait, i = this.__getTraitDouble().double), this.__info = {
            info: {
                id: t.id,
                revision: t.revision,
                size: 0,
                trait: e,
                "double": i
            },
            detail: null,
            typo: null
        }, this.__df = $.Deferred(), this.__fetchBook().done(function() {
            this.__df.resolve(), this.trigger("ready")
        }.bind(this))
    }, o.getDefferred = function() {
        return this.__df
    }, o.__getTraitDouble = function() {
        for (var t = "small", e = n[0], i = n.length - 1; i >= 0; i--)
            if (n[i].height <= $(window).height()) {
                t = n[i].name, e = n[i];
                break
            }
        var r = e.width,
            o = $(window).width() > 2 * r + 186;
        return {
            trait: e,
            "double": o ? 2 : 1
        }
    }, o.__fetchBook = function() {
        var t = this.__info.info;
        return $.when(i.remote.getBookDetail(t.id), i.remote.getBookInfo(t.id, t.trait.name, t.revision), i.remote.couponType()).done(function(t, e, i) {
            this.__info.info.revision = e.revision, this.__info.info.size = e.pages.length + 1, this.__info.typo = e, this.__info.detail = t, this.__info.info.coupon = _.some(i, function(e) {
                return e >= t.avail_price
            });
            var n = this.__info.info.trait;
            n.width = this.__info.typo.page_size[0], n.height = this.__info.typo.page_size[1]
        }.bind(this))
    }, o.checkViewport = function(t) {
        t && t.trait || (t = this.__getTraitDouble()), _.isEqual(this.__info.info.trait, t.trait) || (this.__info.info.trait = t.trait, this.__fetchBook().done(function() {
            this.trigger("traitchange")
        }.bind(this))), this.__info.info.double != t.double && (this.__info.info.double = t.double, this.trigger("doublechange"))
    }, o.getTocName = function() {
        function t(e) {
            var i = [];
            return e.name && i.push([e.page_range[0], e.name]), e.children && $(e.children).each(function(e, n) {
                var r = t(n);
                i = i.concat(r)
            }), i
        }

        function e(e, i) {
            var n, r = t(e);
            for (n = r.length - 1; n >= 0 && r[n][0] > i; n--);
            return 0 > n && (n = 0), r[n][1]
        }
        return function(t) {
            return e(this.__info.typo.toc, t)
        }
    }(), o.getBook = function() {
        return this.__info
    }, o.setTraitdouble = function(t) {
        var e = {
            trait: {},
            "double": 1
        };
        e.trait = n[t.trait], e.double = t.double, this.checkViewport(e)
    }, r
}), define("app/reader/page_control.js", [], function(t) {
    "use strict";
    var e = t("event"),
        i = e.create(),
        n = i.prototype;
    return n.init = function(t) {
        this.supInit.apply(this, arguments), this.__page = t.page || 1, this.setSize(t.size), this.setDouble(t.double)
    }, n.__checkRange = function(t) {
        return t >= this.__range[0] && this.__range[1] >= t
    }, n.__get = function(t) {
        return Math.max(Math.min(this.__range[1], t), this.__range[0])
    }, n.doScrollBy = function(t) {
        var e = this.__page + t;
        (this.__checkRange(e) || this.__checkRange(this.__page)) && this.go(e)
    }, n.go = function(t, e, i, n) {
        if (!this.__block || i) {
            var r = this.__page,
                o = this.__get(t);
            if (r != o || e) {
                this.__page = o;
                var s = {
                    page: o,
                    last: r,
                    rate: o / this.__range[1]
                };
                _.extend(s, n), this.trigger("scroll", s), e ? this.onScrollEnd(this) : this.__block ? this.__tmpEnd = this.onScrollEnd.bind(this) : (this.scrollendtrapped && clearTimeout(this.scrollendtrapped), this.scrollendtrapped = setTimeout(this.onScrollEnd.bind(this), 300))
            }
        }
    }, n.scrollTo = function(t, e) {
        var i = e.now,
            n = e.force;
        delete e.now, delete e.force, this.go(this.__page + t, i, n, e)
    }, n.simpleScrollByDelta = function(t) {
        this.block(!0), this.go(this.__page + t, !1, !0, {})
    }, n.simpleScrollEnd = function() {
        this.block(!1)
    }, n.onScrollEnd = function() {
        this.scrollendtrapped = !1, this.trigger("scrollend", {
            page: this.__page,
            rate: this.__page / this.__range[1]
        })
    }, n.pageUp = function() {
        this.doScrollBy(-1 * this.__stp)
    }, n.pageDown = function() {
        this.doScrollBy(this.__stp)
    }, n.setDouble = function(t) {
        this.__stp = t
    }, n.setSize = function(t) {
        this.__range = [1, t || 1]
    }, n.getPage = function() {
        return this.__page
    }, n.block = function(t) {
        this.__block = t, this.__block || (this.__tmpEnd && this.__tmpEnd(), this.__tmpEnd = null)
    }, i
}), define("app/reader/notes.js", [], function(t) {
    "use strict";
    var e = t("event"),
        i = t("../data/data"),
        n = i.remote,
        r = e.create(),
        o = r.prototype;
    return o.init = function(t) {
        this.__df = n.getChaptersWithNotes(t.book_id), this.__reader = t.reader
    }, o.getDefferred = function() {
        return this.__df
    }, o.getNotes = function(t) {
        return n.getNotes(t, "comment")
    }, o.uploadNotes = function(t) {
        return n.uploadNotes(t)
    }, o.checkHasBookmark = function(t) {
        var e = $.Deferred();
        return t > this.__reader.getBook().typo.pages.length ? e.resolve(!1) : n.getNotes(t, "bookmark").done(function(t) {
            e.resolve(t && t.length > 0)
        }), e.promise()
    }, o.addBookmarkAtPage = function(t, e) {
        return n.uploadBookmarkAtPage(t, e)
    }, o.deleteBookmarkAtPage = function(t) {
        return n.getNotes(t, "bookmark").done(function(t) {
            if (t) {
                var e = [];
                $.each(t, function(t, i) {
                    e.push({
                        id: i.DataID
                    })
                }), n.uploadNotes({
                    "delete": e
                })
            }
        })
    }, o.getAllNotes = function(t, e, i) {
        return n.getAllNotes(t, e, i)
    }, r
}), define("app/reader/readstat.js", [], function(t) {
    "use strict";

    function e() {
        return Number(new Date)
    }
    var i = t("event"),
        n = i.create(),
        r = n.prototype,
        o = {
            start_time: e(),
            end_time: e(),
            start_page: 0,
            end_page: 0,
            turn_count: 0,
            distribution: {}
        },
        s = t("common");
    return r.init = function(t) {
        this.supInit.apply(this, arguments), this.reader = t.reader, this.listenTo(this.reader, "scroll", function() {
            this.record(this.reader.getBook().detail.book_id, this.reader.getBook().detail.title, this.reader.getView().page)
        }.bind(this)), $(window).on("beforeunload", function() {
            this.sync()
        }.bind(this))
    }, r.record = function(t, i, n) {
        if (s.isLogin()) {
            console.log("record ", t, i, n), o.turn_count++, (!n || 0 >= n) && (n = 1), o.uuid = t, o.title = i, 0 === o.start_page && (o.start_time = e(), o.start_page = n), o.end_time = e(), o.end_page = Math.max(o.end_page, n);
            for (var r = new Date(o.start_time).getUTCHours(), a = new Date(o.end_time).getUTCHours(), l = r; a >= l; l++) {
                var c = o.distribution[l + ""];
                if (l == r) c = Math.ceil((o.end_time - o.start_time) / 1e3);
                else if (l == a) {
                    var u = new Date(o.end_time);
                    c = 60 * u.getUTCMinutes() + u.getUTCSeconds()
                } else c = 3600;
                o.distribution[l + ""] = c
            }
        }
    }, r.complete = function() {
        o.completed = !0
    }, r.sync = function() {
        if (s.isLogin()) {
            var t = {
                    userid: $.cookie("user_id"),
                    token: $.cookie("token"),
                    deviceid: $.cookie("device_id"),
                    appid: $.cookie("app_id"),
                    devicename: "web"
                },
                i = {
                    utc_timestamp: e() + "",
                    new_read_pages: o.end_page - o.start_page + 1 + ""
                },
                n = Math.ceil((o.end_time - o.start_time) / 1e3),
                r = 60 * 2 * o.turn_count;
            if (0 !== n && 0 !== r) {
                i.new_read_seconds = Math.min(n, r) + "";
                var a = {};
                a[o.uuid] = {
                    title: o.title,
                    type: "epub"
                }, o.completed ? i.new_completed_books = a : i.new_books = a;
                var l = {};
                $.each(o.distribution, function(t, e) {
                    l[t] = JSON.stringify(e)
                }), i.distribution = l, t.newdata = JSON.stringify(i), console.log("read stats: ", t), $.post("/sync/readstat", t, function(t) {
                    console.log("read stat sync response: ", t)
                })
            }
        }
    }, n
});
