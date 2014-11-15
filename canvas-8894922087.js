define("../reader/views/reading/modules/build_line_info", ["jquery", "underscore"], function($, _) {
    function buildLineInfo(para, rawPara) {
        function makeNewLine(el, startInfo, lineBreak) {
            start = startInfo, info.lines[++lineIndex] = [], info.index.top[lineIndex] = start.top, info.index.bottom[lineIndex] = start.bottom, info.index.offset[lineIndex] = +el.getAttribute("data-offset"), lineBreak && (info.index.lineBreak[lineIndex] = !0)
        }

        function crossLine(el, rawWord, rects) {
            _.each(rects, function(rect, idx) {
                var spanInfo = {
                    top: rect.top - paraBCR.top,
                    left: rect.left - paraBCR.left,
                    width: rect.width,
                    height: rect.height,
                    span: rawWord,
                    lineBreak: !0
                };
                if (!start || start.bottom < spanInfo.top) {
                    var startInfo = {
                        top: spanInfo.top,
                        bottom: spanInfo.top + spanInfo.height
                    };
                    makeNewLine(el, startInfo, idx > 0)
                }
                var lineContainer = info.lines[lineIndex];
                lineContainer.push(spanInfo)
            })
        }
        rawPara = rawPara ? rawPara : para;
        var info, paraDom = para[0],
            paraTop = paraDom.offsetTop,
            paraLeft = paraDom.offsetLeft,
            paraWidth = paraDom.offsetWidth,
            paraHeight = paraDom.offsetHeight,
            words = para.find(".word"),
            rawWords = rawPara ? rawPara.find(".word") : words,
            paraBCR = para[0].getBoundingClientRect();
        info = {
            lines: [],
            index: {
                top: [],
                bottom: [],
                offset: [],
                lineBreak: {}
            },
            height: paraHeight,
            width: paraWidth
        };
        var start, lineIndex = -1;
        return words.each(function(index) {
            var el = this,
                top = el.offsetTop - paraTop,
                left = el.offsetLeft - paraLeft,
                bottom = top + el.offsetHeight,
                width = el.offsetWidth,
                height = el.offsetHeight,
                rects = el.getClientRects();
            if (rects.length > 1) return crossLine(el, rawWords[index], rects);
            if (!start || start.bottom < top) {
                var startInfo = {
                    top: top,
                    bottom: top + height
                };
                makeNewLine(el, startInfo)
            }
            start.top > top ? start.top = top : start.bottom < bottom && (start.bottom = bottom);
            var lineContainer = info.lines[lineIndex],
                spanInfo = {
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    span: rawWords[index]
                };
            lineContainer.push(spanInfo)
        }), info
    }
    return function(para, containerAttrs) {
        containerAttrs = _.defaults(containerAttrs || {}, {
            "class": "fake-article"
        });
        var info = para.data("info");
        if (info) return info;
        var fakePara = para.clone(),
            container = $("<div>", containerAttrs).addClass("build-line-info-container"),
            paraContainer = $("<div>", {
                "class": "content"
            });
        return container.append(paraContainer).appendTo("body"), paraContainer.html(fakePara), info = buildLineInfo(fakePara, para), container.remove(), para.data("info", info), info
    }
}), define("../reader/views/reading/modules/get_page_stamp", ["underscore", "jquery", "reader/app", "reader/modules/stamp", "reader/views/reading/modules/build_line_info"], function(_, $, app, Stamp, buildLineInfo) {
    function getPageStamp(currPage) {
        var contentModel = app.getModel("content"),
            page = $("[data-pagination=" + currPage + "]"),
            info = contentModel.body[currPage - 1],
            stamp = new Stamp({
                pid: null,
                offset: 0
            });
        if (info.stamp) return info.stamp;
        var paragraphs = info.paragraphs;
        if (!(paragraphs && paragraphs.length && paragraphs[0] && paragraphs[0].pid)) throw new Error("NoParagraph");
        var p = paragraphs[0];
        if (stamp.pid = p.pid, contentModel.isPara(p)) {
            var line = contentModel.findStampOffset(stamp.pid, currPage);
            if (!line) return stamp;
            var para = page.find("p[data-pid=" + stamp.pid + "]"),
                paraInfo = buildLineInfo(para),
                offset = paraInfo.index.offset[line];
            stamp.offset = offset
        }
        return info.stamp = stamp, stamp
    }
    return getPageStamp
}), define("mod/lang", [], function() {
    var lang = {},
        ArrayProto = Array.prototype,
        nativeForEach = ArrayProto.forEach,
        slice = ArrayProto.slice,
        each = lang.each = function(obj, iterator, context) {
            if (obj)
                if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context);
                else if (obj.length === +obj.length)
                for (var i = 0, l = obj.length; l > i; i++) iterator.call(context, obj[i], i, obj);
            else
                for (var key in obj) obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj)
        };
    return lang.isArray = Array.isArray || function(obj) {
        return "[object Array]" === {}.toString.call(obj)
    }, lang.filter = function(obj, iterator, context) {
        var results = [];
        return ArrayProto.filter ? obj.filter(iterator, context) : (each(obj, function(item, idx) {
            iterator.call(context, item, idx, obj) && results.push(item)
        }), results)
    }, lang.extend = function(obj) {
        return each(slice.call(arguments, 1), function(source) {
            for (var prop in source) obj[prop] = source[prop]
        }), obj
    }, lang.escape = function(str) {
        str = "" + str || "";
        var xmlchar = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        };
        return str.replace(/[<>&'"]/g, function($1) {
            return xmlchar[$1]
        })
    }, lang.unescape = function(str) {
        str = "" + str || "";
        var xmlchar = {
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&#39;": "'",
                "&quot;": '"'
            },
            regex = /(&amp;|&lt;|&gt;|&#39;|&quot;)/g;
        return str.replace(regex, function($1) {
            return xmlchar[$1]
        })
    }, lang.now = Date.now || function() {
        return (new Date).getTime()
    }, lang.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result, later = function() {
            var last = lang.now() - timestamp;
            wait > last ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), context = args = null))
        };
        return function() {
            context = this, args = arguments, timestamp = lang.now();
            var callNow = immediate && !timeout;
            return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), context = args = null), result
        }
    }, lang.throttle = function(func, wait, options) {
        var context, args, result, timeout = null,
            previous = 0;
        options = options || {};
        var later = function() {
            previous = options.leading === !1 ? 0 : lang.now(), timeout = null, result = func.apply(context, args), context = args = null
        };
        return function() {
            var now = lang.now();
            previous || options.leading !== !1 || (previous = now);
            var remaining = wait - (now - previous);
            return context = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), timeout = null, previous = now, result = func.apply(context, args), context = args = null) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), result
        }
    }, lang
}), define("mod/emitter", ["mod/lang"], function(_) {
    function Emitter(obj) {
        return obj ? _.extend(obj, Emitter.prototype) : void 0
    }
    return Emitter.prototype.on = Emitter.prototype.bind = function(e, fn) {
        return 1 === arguments.length ? (_.each(e, function(fn, event) {
            this.on(event, fn)
        }, this), this) : (this._callbacks = this._callbacks || {}, (this._callbacks[e] = this._callbacks[e] || []).push(fn), this)
    }, Emitter.prototype.emit = Emitter.prototype.trigger = function(e) {
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this._callbacks[e];
        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; len > i; ++i) callbacks[i].apply(this, args)
        }
        return this
    }, Emitter
}), define("ui/overlay", ["jquery", "mod/emitter"], function($, Emitter) {
    function Overlay(opts) {
        if (Emitter.call(this), this.opts = opts, this.el = $(tmpl).appendTo("body"), this.body = this.el.find(".k-slave"), this.closable = void 0 !== opts.closable ? !!opts.closable : !0, this.setBody(), this.el.addClass(opts.klass), this.closable) {
            var overlay = this;
            doc.on("click.close", "#ark-overlay", function(e) {
                e.target === e.currentTarget && overlay.close()
            }).on("keyup.close", function(e) {
                var tagName = e.target.tagName,
                    isEscKey = 27 === e.keyCode,
                    isInputField = /input|textarea/i.test(tagName);
                !isInputField && isEscKey && overlay.close()
            })
        }
    }

    function exports(opts) {
        return opts = opts || {}, new exports.Overlay(opts)
    }
    var tmpl = '<div id="ark-overlay" class="hide"><div class="k-stick"></div><div class="k-content"><div class="k-slave"></div></div></div>',
        doc = $(document),
        docElement = $("html");
    return $.extend(Overlay.prototype, {
        close: function(silent) {
            return this.el.remove(), docElement.removeClass("ark-overlay"), doc.off(".close"), silent || this.emit("close"), this
        },
        getContentElement: function() {
            return this.el.find(".k-content")
        },
        open: function() {
            return this.scrollTop = doc.scrollTop(), docElement.addClass("ark-overlay"), this.el.removeClass("hide"), this.emit("open"), this
        },
        setBody: function(body) {
            return body = body || this.opts.body, this.body.html(body), this
        }
    }), Emitter(Overlay.prototype), exports.Overlay = Overlay, exports
}), define("../reader/views/modules/alert", ["jquery", "underscore", "backbone", "ui/overlay"], function($, _, Backbone, overlay) {
    function Alert(opts) {
        _.bindAll(this, "close"), opts = _.defaults(opts || {}, defaults), _.extend(this, opts), this.overlay = overlay({
            klass: "alert-overlay"
        }), this.render(opts.html).open()
    }
    var defaults = {
        html: "",
        closeSelector: ".close, .confirm",
        contentSelector: ".content"
    };
    return _.extend(Alert.prototype, Backbone.Events, {
        render: function(html) {
            return this.el = $(html || this.html), this.overlay.setBody(this.el), this.deletgateEvent(), this
        },
        deletgateEvent: function() {
            return this.el.on("click.alert", this.closeSelector, this.close), this
        },
        undelegateEvent: function() {
            return this.el.off(".alert"), this
        },
        open: function() {
            return this.overlay.open(), this.trigger("opened"), this
        },
        close: function(e) {
            e.preventDefault();
            var target = $(e.currentTarget),
                buttonName = target.data("name");
            return this.overlay.close(), this.trigger("closed", buttonName), this
        }
    }), Alert
}), define("../reader/views/reading/modules/jumpback", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/stamp", "reader/views/modules/alert", "reader/views/reading/modules/get_page_stamp"], function($, Backbone, _, app, Stamp, Alert, getPageStamp) {
    function annotationLostAlert(annotation) {
        var alert, tmpl = $("#tmpl-alert").html(),
            data = {
                title: "无法查看批注",
                confirm: "知道了"
            };
        annotation.is_deleted ? data.text = "很遗憾，这条批注已经被批注者删掉了，所以无法查看。不如随手翻翻这本书吧。" : annotation.visible_private && (data.text = "很遗憾，这条批注已经被批注者修改成“仅自己可见”，所以无法查看。不如随手翻翻这本书吧。"), alert = new Alert({
            html: _.template(tmpl, data)
        })
    }

    function tocOutRangeAlert() {
        var alert, tmpl = $("#tmpl-alert").html(),
            data = {
                title: "无法查看此章节",
                confirm: "知道了"
            };
        data.text = "很抱歉，因为此章节内容不在免费试读的范围内，所以无法查看。不如随手翻翻这本书吧。", alert = new Alert({
            html: _.template(tmpl, data)
        })
    }

    function Recommendation(articleId, rId) {
        _.bindAll(this, "afterPagingDone", "_onShareFetched"), this.getSharePromise = $.get("/j/share/" + rId, {
            works_id: articleId
        })
    }

    function Underline(underlineData) {
        _.bindAll(this, "afterPagingDone"), this.stamp = new Stamp({
            isRecommendation: !0
        }).setAnnotation(underlineData)
    }

    function Annotation(articleId, annotationId) {
        _.bindAll(this, "afterPagingDone", "afterJumpingProgress", "_onAnnotationFetched"), this.getAnnotationPromise = $.get("/j/article_v2/" + articleId + "/annotation", {
            id: annotationId
        })
    }

    function ParaAnnotations(paraId) {
        _.bindAll(this, "afterPagingDone", "afterJumpingProgress"), this.paraId = paraId, this.stamp = new Stamp({
            pid: paraId,
            type: "para"
        })
    }

    function TocChapter(index) {
        _.bindAll(this, "afterPagingDone"), this.index = index
    }
    _.extend(Recommendation.prototype, {
        afterPagingDone: function(contentModel) {
            return this.contentModel = contentModel, this.getSharePromise.done(this._onShareFetched)
        },
        _onShareFetched: function(ajaxData) {
            if (ajaxData && !ajaxData.r) {
                var annotation = ajaxData.props,
                    stamp = new Stamp({
                        isRecommendation: !0
                    }).setAnnotation(annotation);
                return stamp.annotationReadable() ? (this.contentModel.stamp = stamp, void 0) : (annotationLostAlert(stamp.getAnnotationJson()), void 0)
            }
        }
    }), _.extend(Underline.prototype, {
        afterPagingDone: function(contentModel) {
            contentModel.stamp = this.stamp
        }
    }), _.extend(Annotation.prototype, {
        afterPagingDone: function(contentModel) {
            return this.contentModel = contentModel, this.getAnnotationPromise.done(this._onAnnotationFetched)
        },
        _onAnnotationFetched: function(ajaxData) {
            if (ajaxData && !ajaxData.r) {
                var annotation = ajaxData,
                    stamp = new Stamp({
                        type: "annotation",
                        isFromUrl: !0
                    }).setAnnotation(annotation);
                return stamp.annotationReadable() ? (this.contentModel.stamp = stamp, void 0) : (annotationLostAlert(stamp.getAnnotationJson()), void 0)
            }
        },
        afterJumpingProgress: function() {
            var stamp = this.contentModel.stamp;
            stamp && stamp.annotationReadable() && this._openSingleAnnotationOverlay(stamp.getAnnotationJson())
        },
        _openSingleAnnotationOverlay: function(annotationJson) {
            if (annotationJson) {
                var markings = app.getModel("article").markings,
                    marking = markings.get(annotationJson.id);
                app.vent.trigger("open:singleAnnotationOverlay", marking)
            }
        }
    }), _.extend(ParaAnnotations.prototype, {
        afterPagingDone: function(contentModel) {
            contentModel.stamp = this.stamp
        },
        afterJumpingProgress: function() {
            var markings = app.getModel("article").markings,
                paraId = this.paraId;
            markings.fetchByPids([paraId]).done(function() {
                app.vent.trigger("open:paraAnnotationsOverlay", paraId)
            })
        }
    }), _.extend(TocChapter.prototype, {
        afterPagingDone: function(contentModel) {
            var tocItem = contentModel.contents[this.index];
            if (!tocItem) return tocOutRangeAlert();
            var stamp = new Stamp(getPageStamp(tocItem.pageNum));
            contentModel.stamp = stamp
        }
    });
    var hookGenerators = {
        Recommendation: Recommendation,
        Underline: Underline,
        Annotation: Annotation,
        ParaAnnotations: ParaAnnotations,
        TocChapter: TocChapter
    };
    return hookGenerators
}), define("../widget/freq-limit", ["underscore", "mod/simplestorage"], function(_, SimpleStorage) {
    function OncePerBrowser(key) {
        this.key = key
    }

    function OncePerDayAndBrowser(key) {
        this.key = key
    }
    var storage = new SimpleStorage(!0, "local"),
        DAY = 864e5;
    return _.extend(OncePerBrowser.prototype, {
        isFree: function() {
            return !storage.get(this.key)
        },
        checkIn: function() {
            storage.set(this.key, 1)
        }
    }), _.extend(OncePerDayAndBrowser.prototype, {
        isFree: function() {
            var lastDate = +storage.get(this.key) || 0;
            return _.now() - lastDate > DAY
        },
        checkIn: function() {
            var todayZero = (new Date).setHours(0);
            storage.set(this.key, todayZero.valueOf())
        }
    }), {
        OncePerDayAndBrowser: OncePerDayAndBrowser,
        OncePerBrowser: OncePerBrowser
    }
}), define("../reader/views/modules/desktop-app-ad", ["jquery", "backbone", "underscore", "arkenv", "widget/freq-limit"], function($, Backbone, _, arkenv, FreqLimit) {
    var DesktopAppAd = Backbone.View.extend({
        tmpl: $("#tmpl-desktop-app-ad").html(),
        id: "desktop-app-ad",
        initialize: function() {
            this.freqLimit = new FreqLimit.OncePerDayAndBrowser("shownDesktopAppAd")
        },
        events: {
            "click .close": "close"
        },
        render: function() {
            return this.$el.html(this.tmpl), this
        },
        appendTo: function(container) {
            return arkenv.me.isAnonymous ? this.freqLimit.isFree() ? (container = container || $("body"), container.find("#" + this.id).remove(), container.append(this.render().el), this) : this : this
        },
        close: function(e) {
            e.preventDefault(), this.freqLimit.checkIn(), this.remove()
        }
    });
    return DesktopAppAd
}), define("../reader/views/modules/time_tracker/timer", ["underscore", "reader/modules/ga"], function(_, ga) {
    function Timer(name, label) {
        this.set({
            name: name,
            label: label
        }), this.sampleRate = 100, this._start()
    }
    var timeSpentLimit = 36e5;
    return _.extend(Timer.prototype, {
        nowTime: function() {
            return +new Date
        },
        set: function(opts) {
            _.extend(this, _.pick(opts, "name", "label"))
        },
        validateSpent: function(timeSpent) {
            return timeSpentLimit > timeSpent && timeSpent > 0
        },
        _start: function() {
            this.startTime = this.nowTime()
        },
        _end: function() {
            this.endTime = this.nowTime()
        },
        send: function() {
            var timeSpent = this.endTime - this.startTime;
            this.validateSpent(timeSpent) && !this.sent && (ga._trackTiming(this.name, timeSpent, this.label, this.sampleRate), this.sent = !0)
        },
        end: function() {
            this._end(), this.send()
        }
    }), Timer
}), define("../reader/views/modules/time_tracker/time_tracker", ["reader/app", "../reader/views/modules/time_tracker/timer"], function(app, Timer) {
    function getLabel(articleData) {
        var title = articleData.title,
            labelStr = "";
        return articleData.isSample && (labelStr += "[试读]"), articleData.hasFormula && (labelStr += "[公式]"), title + labelStr
    }

    function trackEvent(name, label, events) {
        var timer, startPublisher = events.startPublisher,
            startEvent = events.startEvent,
            endPublisher = events.endPublisher || startPublisher,
            endEvent = events.endEvent;
        startPublisher.once(startEvent, function() {
            timer = new Timer(name, label)
        }), endPublisher.once(endEvent, function() {
            timer && timer.end()
        })
    }
    var TimeTracker = {
        trackEvent: trackEvent,
        bindAll: function(canvasView) {
            app.vent.on("model:article:set", function() {
                TimeTracker.trackPaging(app)
            }), canvasView.article.on("article:init", function() {
                TimeTracker.trackArticleFetching(app)
            })
        },
        trackPaging: function(app) {
            var articleModel = app.getModel("article");
            trackEvent("Paging", getLabel(articleModel.toJSON()), {
                startPublisher: app.vent,
                startEvent: "paging:start",
                endEvent: "paging:finish"
            })
        },
        trackArticleFetching: function(app) {
            var timer;
            app.vent.once("article:fetching:start", function() {
                timer = new Timer("Article.fetch")
            }), app.vent.once("article:fetching:finish", function() {
                timer && timer._end()
            }), app.vent.once("model:article:set", function(articleModel) {
                timer && (timer.set({
                    label: getLabel(articleModel.toJSON())
                }), timer.send())
            })
        }
    };
    return TimeTracker
}), define("../reader/views/mixins/toggle_helper", ["backbone", "underscore", "jquery", "reader/app", "reader/modules/detector"], function(Backbone, _, $, app, detector) {
    return {
        closeShortcutTips: function() {
            this.toggleShortcutTips(!1)
        },
        openShortcutTips: function() {
            this.toggleShortcutTips(!0)
        },
        toggleShortcutTips: function(showOrHide) {
            if (!detector.hasTouch()) {
                if (_.isUndefined(showOrHide)) {
                    var tipIsVisible = this.shortcutTips.is(":visible");
                    showOrHide = !tipIsVisible
                }
                if (this.shortcutTips.toggle(showOrHide), !app.getModel("config").get("isGallery")) {
                    var readView = app.readView.$el;
                    readView[showOrHide ? "addClass" : "removeClass"]("overlay-article")
                }
            }
        }
    }
}), define("../reader/views/mixins/controls_panel", ["underscore", "reader/modules/browser"], function(_, browser) {
    return {
        resizePanel: function() {
            this.resetHeight(this.panelsContainer)
        },
        resetPanelAsResize: function() {
            this.win.resize(_.debounce(this.resizePanel, 80))
        },
        resetHeight: function(el) {
            if (!browser.fitForMobile) {
                var headerHeight = $(".lite-header").outerHeight() || 0;
                el.height((this.win.height() - headerHeight) / 16 + "em")
            }
        },
        dealingWithScrollbar: function(action) {
            var opened = "expand" === action;
            this.body.css("overflow", opened ? "hidden" : "")
        }
    }
}), define("../mod/timeformat", function() {
    var sec2date = function(sec, options) {
            options = options || {}, options.dateFromNow = options.dateFromNow || !0, options.withoutYear = options.withoutYear || !1;
            var time = new Date(1e3 * sec),
                date = "";
            if (options.dateFromNow) {
                var dateFromNow = getDateFromNow(time);
                if (dateFromNow) return dateFromNow
            }
            return options.withoutYear || (date = time.getFullYear() + "-"), date += time.getMonth() + 1 + "-" + time.getDate()
        },
        getDateFromNow = function(time) {
            var now = +new Date,
                diff = now - time,
                days = Math.floor(diff / 864e5);
            if (!(days > 2)) {
                var second = Math.floor(diff / 1e3);
                if (180 > second) return "刚刚";
                var minutes = Math.floor(second / 60);
                if (60 > minutes) return minutes + "分钟前";
                var hours = Math.floor(minutes / 60);
                return 24 > hours ? hours + "小时前" : days + "天前"
            }
        };
    return {
        sec2date: sec2date
    }
}), define("mod/truncate", function() {
    return function(string, maxLength, etc) {
        return etc || (etc = "…"), string ? string.length <= maxLength ? string : string.substr(0, maxLength) + etc : ""
    }
}), define("../reader/views/mixins/purchase_button", ["backbone", "underscore", "jquery", "mod/cookie", "reader/app"], function(Backbone, _, $, cookie, app) {
    var PurchaseButton = Backbone.View.extend({
        template: $("#tmpl-purchase-button").html(),
        render: function(options) {
            var data = options.data,
                kindNameMap = {
                    ebook: "图书",
                    gallery: "画册",
                    chapter: "篇目"
                };
            if (_.defaults(data, {
                    kind_name: kindNameMap[data.type],
                    widget: data.is_gift ? "purchase-as-gift" : "faster-purchase",
                    readable_price: (data.price / 100).toFixed(2),
                    username: app.me.get("name"),
                    is_mobile_direct_purchase: !1
                }), data.is_mobile_direct_purchase) {
                data.mobile_direct_purchase_url = _.template("/purchase/?about_to_buy={{- id}}", data);
                var pageStyle = cookie("page_style");
                pageStyle && "web" === pageStyle && data.columnId && (data.mobile_direct_purchase_url = _.template("/column/{{- columnId }}/chapter/{{- id}}/#purchase", data))
            }
            return this.setElement(_.template(this.template, data)), this
        }
    });
    return PurchaseButton
}), define("../reader/views/mixins/panel", ["jquery", "underscore", "backbone"], function() {
    var mixinedMethods = {
        closePanel: function() {
            this.$el.trigger("close")
        }
    };
    return mixinedMethods
}), define("../reader/views/reading/toc/toc_chapters", ["jquery", "backbone", "underscore", "reader/app", "reader/views/mixins/panel", "reader/views/mixins/purchase_button", "reader/modules/browser", "mod/truncate", "mod/timeformat"], function($, Backbone, _, app, Panel, PurchaseButton, browser, truncate, timeformat) {
    function onChaptersChange(app, callback) {
        var chapters = app.getModel("chapters");
        callback(chapters), chapters.on("reset", callback), app.vent.on("model:chapters:set", function(newChapters) {
            chapters.off("reset", callback), newChapters.on("reset", callback)
        })
    }
    var ChaptersToc = Backbone.View.extend({
        tmpl: $("#tmpl-chapters-toc").html(),
        events: {
            "click .chapter-toc-item": "tocJump",
            "collapse:expanded": "onExpand"
        },
        initialize: function(options) {
            this.app = options.app, this.controls = options.controls, onChaptersChange(this.app, _.bind(function(chapters) {
                this.chaptersCollection = chapters
            }, this))
        },
        render: function() {
            var self = this,
                chapters = this.chaptersCollection,
                purchaseButton = new PurchaseButton,
                currChapterId = chapters.currChapter.get("chapterId"),
                chaptersArray = chapters.toJSON();
            return this.$el.html(_.template(this.tmpl, {
                list: chaptersArray,
                lastItemIndex: chaptersArray.length - 1,
                columnId: chapters.columnId,
                currChapterId: currChapterId,
                truncate: truncate,
                sec2date: timeformat.sec2date,
                purchaseButton: purchaseButton,
                purchaseButtonData: function(columnId, chapter) {
                    var worksUrl = ["/reader/column", columnId, "chapter", chapter.id].join("/");
                    return _.extend(chapter, {
                        id: chapter.id,
                        url: worksUrl,
                        is_large_btn: !1,
                        is_hollow_btn: !0,
                        redirect_url: worksUrl + "/list",
                        is_mobile_direct_purchase: browser.fitForMobile,
                        columnId: columnId
                    })
                }
            })), this.chaptersList = this.$el.find("#chapters-contents-list"), _.delay(function() {
                self.app.utils.applyPurchaseWithIn("[data-widget=faster-purchase]", "#chapters-contents-list")
            }, 0), this.chaptersList.on("purchase:finish", function(e, url) {
                location.href = url
            }), this
        },
        tocJump: function() {
            this.controls.closePopups()
        },
        scrollToMarginTop: 96,
        scrollTo: function(tocItem) {
            this.scrollBody = this.scrollBody || this.$el.closest(".panels-container");
            var scrollToTop = tocItem.offset().top - this.scrollBody.offset().top - this.scrollToMarginTop;
            this.scrollBody.scrollTop(scrollToTop)
        },
        scrollToCurrItem: function() {
            this.$el.data("tocScroller");
            var currItem = this.$(".is-current");
            this.scrollTo(currItem)
        },
        onExpand: function() {
            browser.fitForMobile || this.scrollToCurrItem()
        }
    });
    return _.extend(ChaptersToc.prototype, Panel), ChaptersToc
}), define("../reader/views/reading/toc/toc", ["jquery", "backbone", "underscore", "reader/views/mixins/panel", "reader/modules/ga"], function($, Backbone, _, Panel, ga) {
    var Toc = Backbone.View.extend({
        tmpl: $("#tmpl-toc").html(),
        events: {
            "click ul": "tocJump"
        },
        closePanel: function() {
            this.$el.trigger("close")
        },
        initialize: function(options) {
            _.bindAll(this, "gotoTocPage"), this.app = options.app, this.vent = this.app.vent, this.controls = options.controls, this.turningModel = options.turningModel, this.vent.on("goto:tocPage", this.gotoTocPage)
        },
        render: function(list) {
            var hasToc = !!list.length,
                turningModel = this.turningModel;
            return hasToc ? (list = _.map(list, function(item) {
                return item = _.clone(item), item.readPageNum = turningModel.real2read(item.pageNum), item
            }), this.$el.html(_.template(this.tmpl, {
                list: list
            })), this.$el) : this.$el.empty()
        },
        gotoTocPage: function(sequence) {
            sequence = sequence || 0, this.$el.find(".toc-item").eq(sequence).trigger("click")
        },
        tocJump: function(e) {
            var el = e.target;
            if ("A" === el.tagName) {
                var pageNum = parseInt(el.id.split("-")[1], 10);
                this.turningModel.setCurrPage(pageNum), this.controls.closePopups(), ga._trackEvent("clickContentsItem")
            }
        }
    });
    return _.extend(Toc.prototype, Panel), Toc
}), define("../reader/modules/elems_list_paging", ["jquery", "underscore", "backbone"], function($, _, Backbone) {
    function PagingCore(options) {
        options = _.defaults(options || {}, coreDefaults), this.limit = options.limit, this.setItems(options.items)
    }

    function ListPaging(options) {
        options = _.defaults(options || {}, defaults), _.extend(this, options), this.paging = new PagingCore(_.pick(options, _.keys(coreDefaults))), this.setItems(options.items), this.bindEvents()
    }
    var coreDefaults = {
        limit: 10,
        items: []
    };
    _.extend(PagingCore.prototype, {
        setItems: function(items) {
            this.items = items, this.pages = [], this.curPageIndex = 0, this.paging()
        },
        paging: function() {
            var i, startItemIndex, endItemIndex, pagesLength = Math.ceil(this.items.length / this.limit);
            for (i = 0; pagesLength > i; i++) startItemIndex = i * this.limit, endItemIndex = (i + 1) * this.limit, this.pages.push(this.items.slice(startItemIndex, endItemIndex))
        },
        getPage: function(pageIndex) {
            return _.isUndefined(pageIndex) && (pageIndex = this.curPageIndex), this.pages[pageIndex]
        },
        turnPage: function(pageIndex) {
            return this.hasPage(pageIndex) ? (this.curPageIndex = pageIndex, this.getPage(pageIndex)) : this.getPage()
        },
        hasPage: function(pageIndex) {
            return pageIndex >= 0 && pageIndex < this.getPageCount() ? !0 : !1
        },
        getPageCount: function() {
            return this.pages.length
        }
    });
    var defaults = {
        limit: 10,
        items: [],
        navLimit: 5,
        endPointLength: 2,
        container: $(),
        navContainer: $(),
        prevSelector: ".prev",
        nextSelecotr: ".next",
        pageNumSelector: ".page-num",
        prevTmpl: '<a class="prev" href="#">&lt; 前页</a>',
        nextTmpl: '<a class="next" href="#">后页 &gt;</a>',
        pageNumTmpl: '<a class="page-num" href="#"></a>'
    };
    return _.extend(ListPaging.prototype, {
        setItems: function(items) {
            return this.items = items, this.pages = [], this.paging.setItems(items), this
        },
        getCurPageIndex: function() {
            return this.paging.curPageIndex
        },
        bindEvents: function() {
            _.bindAll(this, "clickTurnPage", "clickPageNum"), this.navContainer.on("click", this.prevSelector, this.clickTurnPage).on("click", this.nextSelecotr, this.clickTurnPage).on("click", this.pageNumSelector, this.clickPageNum)
        },
        render: function() {
            this.turnPage(this.getCurPageIndex())
        },
        renderNav: function() {
            this.navContainer.empty(), 1 !== this.paging.getPageCount() && (this.pageNums = $("<span>").addClass("page-nums"), this.prevBtn = $(this.prevTmpl), this.nextBtn = $(this.nextTmpl), this.navContainer.append(this.prevBtn).append(this.pageNums).append(this.nextBtn), this.renderPageNums(), this.changeBtnState())
        },
        renderPageNums: function() {
            var pageNum, navRange, prevIndex, curPageIndex = this.getCurPageIndex(),
                pageLength = this.paging.getPageCount(),
                pagesRange = _.range(0, pageLength, 1);
            navRange = this.getLimitedRange(pagesRange, curPageIndex, this.navLimit), navRange = _.first(pagesRange, this.endPointLength).concat(navRange).concat(_.last(pagesRange, this.endPointLength)), navRange = _.uniq(navRange), _.each(navRange, function(pageIndex, i, list) {
                prevIndex = list[i - 1], prevIndex && pageIndex !== prevIndex + 1 && this.pageNums.append(this.getEllipsis()), pageNum = this.getPageNumElem(pageIndex), pageIndex === curPageIndex && pageNum.addClass("active disabled"), this.pageNums.append(pageNum)
            }, this)
        },
        getLimitedRange: function(originRange, center, limit) {
            var front = center - Math.floor(limit / 2),
                rear = front + limit,
                len = originRange.length,
                frontOverflow = 0 > front ? -front : 0,
                rearOverflow = rear > len ? rear - len : 0;
            return rear += frontOverflow - rearOverflow, front += frontOverflow - rearOverflow, front = 0 > front ? 0 : front, rear = rear > len ? len : rear, originRange.slice(front, rear)
        },
        getPageNumElem: function(pageIndex) {
            return $(this.pageNumTmpl).data("index", pageIndex).text(pageIndex + 1)
        },
        getEllipsis: function() {
            return $("<a>").addClass("ellipsis").text("…")
        },
        changeBtnState: function() {
            var curPageIndex = this.getCurPageIndex();
            0 === curPageIndex && this.prevBtn.addClass("disabled"), curPageIndex >= this.paging.getPageCount() - 1 && this.nextBtn.addClass("disabled")
        },
        toggleItems: function(items, willShow) {
            _.each(items, function(item) {
                $(item).toggle(willShow)
            })
        },
        clickTurnPage: function(e) {
            e.preventDefault();
            var step, target = $(e.target);
            target.hasClass("disabled") || (step = target.hasClass("prev") ? -1 : 1, this.turnPage(this.getCurPageIndex() + step))
        },
        clickPageNum: function(e) {
            e.preventDefault();
            var target = $(e.target);
            target.hasClass("disabled") || this.turnPage(target.data("index"))
        },
        turnPage: function(pageIndex) {
            this.trigger("turnPage", this.paging.turnPage(pageIndex)), this.renderNav()
        },
        remove: function() {
            this.pages = [], this.container.empty(), this.navContainer.empty()
        }
    }), _.extend(ListPaging.prototype, Backbone.Events), ListPaging
}), define("../reader/modules/click_outside", ["jquery"], function($) {
    function onClickOutside(el, callback, permanent) {
        function clickHandler(e) {
            var target = $(e.target),
                clicked = target.parents().andSelf();
            clicked.is(el) || (callback.call(this, e), permanent || doc.off("click", clickHandler))
        }
        el = $(el), doc.on("click", clickHandler)
    }
    var doc = $(document);
    return onClickOutside
}), define("../reader/modules/arrow_box", ["jquery", "underscore", "backbone"], function($, _) {
    var arrowBoxOptions = {
            backgroundColor: "",
            borderColor: "",
            arrowHeight: "",
            borderSize: "",
            offset: "",
            orention: "",
            arrowWidth: ""
        },
        offsetsOrentionMap = {
            top: "left",
            bottom: "left",
            right: "top",
            left: "top"
        },
        negativeOrentionMap = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left"
        };
    return function($el, options) {
        $el.find("._arrow-box").remove(), options = _.defaults(options, arrowBoxOptions), options.arrowHeight || (options.arrowHeight = options.arrowWidth);
        var outer = $("<div>"),
            inner = $("<div>"),
            negativeOrention = negativeOrentionMap[options.orention],
            offsetOrention = offsetsOrentionMap[options.orention],
            commonStyle = {
                "border-style": "solid",
                "border-color": "transparent",
                hegiht: 0,
                position: "absolute"
            };
        commonStyle[negativeOrention] = "100%";
        var innerStyle = {
            "border-width": options.arrowHeight + "px" + " " + options.arrowWidth + "px"
        };
        innerStyle["border-" + negativeOrention + "-color"] = options.backgroundColor, innerStyle[offsetOrention] = options.offset, innerStyle["margin-" + offsetOrention] = -options.arrowHeight + "px";
        var outerArrowHeight = options.arrowHeight + options.borderSize,
            outerArrowWidth = options.arrowWidth + options.borderSize,
            outerStyle = {
                "border-width": outerArrowHeight + "px" + " " + outerArrowWidth + "px"
            };
        outerStyle["border-" + negativeOrention + "-color"] = options.borderColor, outerStyle[offsetOrention] = options.offset, outerStyle["margin-" + offsetOrention] = -outerArrowHeight + "px", $().add(inner).add(outer).css(commonStyle).css({
            "border-color": "transparent"
        }).addClass("_arrow-box"), inner.css(innerStyle).addClass("arrow-inner"), outer.css(outerStyle).addClass("arrow-outer"), $el.append(outer).append(inner)
    }
}), define("reader/modules/bubble", ["jquery", "underscore", "backbone", "reader/modules/click_outside"], function($, _, Backbone, onClickOutside) {
    function Bubble(opt) {
        opt = $.extend({}, defaults, opt), this.opt = opt, this.body = $(this.opt.renderTo), this.body[0] === document.body && (this.renderToIsBody = !0);
        var bubble = this;
        this._config = {}, this._opened = !1, this._node = $(opt.html), this._content = this._node.find(opt.contentClass), this._close = this._node.find(opt.closeClass), this.set(opt), this._node.hide(), this._node.appendTo(this.body), this._node.on("click", opt.closeClass, function() {
            bubble.hide()
        }), _.isUndefined(opt.onClickOutside) || (this.onClickOutside = opt.onClickOutside)
    }
    var doc = document,
        TMPL_BUBBLE = '<div class="reader-bubble"><b class="bubble-close">&times;</b><div class="bubble-content"></div></div>',
        defaults = {
            html: TMPL_BUBBLE,
            contentClass: ".bubble-content",
            closeClass: ".bubble-close",
            arrowOffset: .5,
            renderTo: doc.body
        };
    return Bubble.extend = Backbone.inhert, Bubble.prototype = {
        constructor: Bubble,
        find: function(selector) {
            return this._node.find(selector)
        },
        set: function(opt) {
            return this.opt = _.extend(this.opt, opt), opt.target && (this._config.target = opt.target), opt.width && this.setWidth(opt.width), opt.content && this.setContent(opt.content), this
        },
        setWidth: function(width) {
            return this._node.css("width", width), this
        },
        setContent: function(content) {
            return this._content.html(content), this
        },
        setPosition: function(target) {
            var tar = $(target),
                bubbleHeight = this._node.outerHeight(),
                middleTop = this.getOffsetWithin(tar).top + tar.height() / 2,
                top = middleTop - bubbleHeight * this.opt.arrowOffset;
            return this._node.css({
                top: top,
                left: this.getOffsetWithin(tar).left + 35
            }), this
        },
        update: function() {
            return this.setPosition(this._config.target), this
        },
        isVisible: function() {
            return this._opened
        },
        show: function() {
            var target = this._config.target;
            return this._opened ? (this.setPosition(target), void 0) : (this._opened = !0, this._node.show(), this.onClickOutside && onClickOutside(this._node.add(target), $.proxy(this.onClickOutside, this)), this.setPosition(target), this.trigger("shown", this), this)
        },
        hide: function(clear) {
            return this._opened ? (this._opened = !1, this._node.hide(), clear && this._content.empty(), this.trigger("hidden", this), this) : void 0
        },
        toggle: function(clear) {
            var target = this._config.target,
                prevTarget = this._config.prevTarget;
            return target !== prevTarget ? (this._config.prevTarget = target, this.show(), this) : (this._opened ? this.hide(clear) : this.show(), this)
        },
        getOffsetWithin: function(tar) {
            if (this.renderToIsBody) return tar.offset();
            var box = {
                    top: 0,
                    left: 0
                },
                within = this.body[0],
                el = tar[0];
            return _.isUndefined(el.getBoundingClientRect) || (box = el.getBoundingClientRect()), {
                top: box.top + within.scrollTop - (within.clientTop || 0),
                left: box.left + within.scrollLeft - (within.clientLeft || 0)
            }
        },
        destroy: function() {
            return this._opened ? (this._opened = !1, this._node.remove(), this.trigger("destroyed", this), this) : void 0
        }
    }, _.extend(Bubble.prototype, Backbone.Events), Bubble
}), define("../reader/modules/tooltip", ["jquery", "underscore", "backbone", "reader/modules/bubble", "reader/modules/arrow_box"], function($, _, Backbone, Bubble, arrowBox) {
    var win = $(window),
        TMPL_TOOLTIP = $.trim($("#tmpl-tooltip").html()),
        CLASS_TIPS = "tooltip",
        BOUNDARY_LINE_WIDTH = 15,
        defaults = {
            html: TMPL_TOOLTIP,
            id: ""
        },
        Tooltip = Bubble.extend({
            _super: Bubble.prototype,
            constructor: function(opt) {
                opt = $.extend({}, defaults, opt), this._super.constructor.call(this, opt), this.setUpEvents()
            },
            set: function(opt) {
                return _.extend(this, {
                    preferedDirection: "up"
                }, _.pick(opt, "target", "preferedDirection")), this.setClass(opt.className), this._super.set.call(this, opt)
            },
            hide: function() {
                return this._super.hide.call(this)
            },
            setPosition: function(target, arrowHeight) {
                arrowHeight = arrowHeight || this.opt.arrowHeight || 0;
                var offset, arrowIsBottom, rightDistance, leftDistance, rect, arrowMargin = 3,
                    targetIsElement = target instanceof $,
                    height = this._node.outerHeight() + arrowMargin + arrowHeight,
                    width = this._node.outerWidth(),
                    halfWidth = width / 2,
                    viewportWidth = win.width(),
                    viewportHeight = win.height(),
                    horizontalOffset = 0;
                if (targetIsElement) {
                    var tarOffset = this.getOffsetWithin(target),
                        tarBcr = target[0].getBoundingClientRect();
                    rect = {
                        top: tarOffset.top,
                        left: tarOffset.left,
                        bcrLeft: tarBcr.left,
                        bcrRight: tarBcr.right,
                        bcrTop: tarBcr.top,
                        bcrBottom: tarBcr.bottom,
                        height: target.outerHeight(),
                        width: target.outerWidth()
                    }
                } else rect = _.clone(target), _.extend(rect, {
                    bcrLeft: rect.left,
                    bcrRight: rect.left + rect.width,
                    bcrTop: rect.top - this.body.scrollTop()
                }), rect.bcrBottom = rect.bcrTop + (rect.height || 0);
                return offset = {}, arrowIsBottom = !0, "down" === this.preferedDirection && rect.bcrBottom + height < viewportHeight && (arrowIsBottom = !1), rect.bcrTop < height && (arrowIsBottom = !1), offset.top = arrowIsBottom ? rect.top - height : rect.top + rect.height + arrowHeight + arrowMargin, offset.left = rect.left - (width - rect.width) / 2, rightDistance = viewportWidth - rect.bcrRight - halfWidth + rect.width / 2 - BOUNDARY_LINE_WIDTH, leftDistance = rect.bcrLeft - halfWidth + rect.width / 2 - BOUNDARY_LINE_WIDTH, 0 > rightDistance ? horizontalOffset = rightDistance : 0 > leftDistance && (horizontalOffset = -leftDistance), offset.left = offset.left + horizontalOffset, arrowBox(this._node, {
                    backgroundColor: this._node.css("background-color") || "transparent",
                    borderColor: this._node.css("border-left-color") || "transparent",
                    arrowWidth: arrowHeight,
                    borderSize: 1,
                    orention: arrowIsBottom ? "bottom" : "top",
                    offset: width / 2 - horizontalOffset
                }), this._node.css(offset), this
            },
            update: function(arrowHeight) {
                this.setPosition(this.target, arrowHeight)
            },
            setClass: function(klass) {
                return this._node[0].className = CLASS_TIPS + (klass ? " " + klass : ""), this
            },
            setUpEvents: function() {
                var self = this;
                this.body.on("mousedown", function(e) {
                    var target = $(e.target),
                        clicked = target.parents().andSelf();
                    clicked.is(self._node) || self.hide()
                }), this._node.on("click mouseup", function(e) {
                    e.stopPropagation()
                })
            }
        });
    return Tooltip
}), define("../widget/parent_view", ["underscore", "backbone"], function(_, Backbone) {
    return {
        remove: function() {
            this.removeAllSubView(), Backbone.View.prototype.remove.apply(this, arguments)
        },
        removeAllSubView: function() {
            var subViews = this.subViews();
            subViews.length && (_.each(subViews, function(view) {
                view.remove()
            }, this), this._subViews = null)
        },
        removeSubView: function(view) {
            _.without(this.subViews(), view)
        },
        addSubView: function(view) {
            var oldRemove = view.remove,
                parent = this;
            return view.hasParentView = !0, view.remove = function() {
                parent.removeSubView(view), oldRemove.apply(this, arguments)
            }, this.subViews().push(view), view
        },
        hasSubView: function(view) {
            return _.contains(this.subViews(), view)
        },
        subViews: function() {
            return this._subViews || (this._subViews = []), this._subViews
        }
    }
}), define("../reader/modules/iso_time/print", ["../reader/modules/iso_time/parse"], function(parseIsoTime) {
    function pad(number) {
        var r = String(number);
        return 1 === r.length && (r = "0" + r), r
    }
    return function(ISOTime, withoutHour) {
        var date = parseIsoTime(ISOTime);
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + (withoutHour ? "" : " " + pad(date.getHours()) + ":" + pad(date.getMinutes()))
    }
}), define("mod/key", ["jquery"], function($) {
    function getKeys(event) {
        var special = "keypress" !== event.type && specialKeys[event.which],
            character = String.fromCharCode(event.which).toLowerCase(),
            modif = "",
            possible = {};
        if (event.altKey && "alt" !== special && (modif += "alt+"), event.ctrlKey && "ctrl" !== special && (modif += "ctrl+"), event.metaKey && !event.ctrlKey && "meta" !== special && (modif += "meta+"), event.shiftKey && "shift" !== special && (modif += "shift+"), special) possible[modif + special] = !0;
        else {
            var k = modif + character;
            k && (possible[k] = !0), k = shiftNums[character], k && (possible[modif + k] = !0, "shift+" === modif && (k = shiftNums[character], k && (possible[k] = !0)))
        }
        return possible
    }

    function Keys(opt) {
        opt = opt || {};
        var self = this;
        this.target = opt.target || document, this.event = opt.event || "keydown", this.keyHandlers = {}, this.rules = [], this.sequence = {}, this.sequenceNums = [], this.history = [], this._handler = function(ev) {
            if (this !== ev.target && (/textarea|select/i.test(ev.target.nodeName) || "text" === ev.target.type)) return !0;
            var handlers = self.keyHandlers[self.event];
            if (!handlers) return !0;
            var handler, queue_handler, possible = getKeys(ev),
                is_disabled = self.lock || !self.check(this, ev);
            if (!is_disabled) {
                for (var i in possible)
                    if (handler = handlers[i]) break;
                if (self.sequenceNums.length) {
                    var history = self.history;
                    if (history.push(i), history.length > 10 && history.shift(), history.length > 1)
                        for (var j = self.sequenceNums.length - 1; j >= 0; j--)
                            if (queue_handler = handlers[history.slice(0 - self.sequenceNums[j]).join("->")]) return queue_handler.apply(this, arguments), history.length = 0, !1
                }
                handler && handler.apply(this, arguments)
            }
        }, $(this.target).bind(this.event, this._handler)
    }
    var specialKeys = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },
        shiftNums = {
            "`": "~",
            1: "!",
            2: "@",
            3: "#",
            4: "$",
            5: "%",
            6: "^",
            7: "&",
            8: "*",
            9: "(",
            0: ")",
            "-": "_",
            "=": "+",
            ";": ":",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        };
    return Keys.prototype = {
            addHandler: function(event, keyname, fn) {
                function add(kname) {
                    var order = kname.split("->");
                    if (order.length > 1) {
                        self.sequence[order.length] = 1;
                        var seq = [];
                        for (var i in self.sequence) seq.push(parseInt(i, 10));
                        self.sequenceNums = seq.sort(function(a, b) {
                            return a - b
                        })
                    }
                    handlers[kname.toLowerCase()] = fn
                }
                var self = this,
                    handlers = this.keyHandlers[event];
                return handlers || (handlers = this.keyHandlers[event] = {}), $.isArray(keyname) ? $.each(keyname, function(index, n) {
                    add(n)
                }) : add(keyname), this
            },
            reset: function() {
                $(this.target).unbind(this.event, this._handler), this.keyHandlers = {}, this.rules = [], this.history = [], delete this._handler, this.lock = !1
            },
            addRule: function(fn) {
                return this.rules.push(fn), this
            },
            enable: function() {
                this.lock = !1
            },
            disable: function() {
                this.lock = !0
            },
            check: function(target, ev) {
                for (var re = !0, r = this.rules, i = 0, l = r.length; l > i; i++)
                    if (!r[i].call(target, ev)) {
                        re = !1;
                        break
                    }
                return re
            }
        }, $.each(["down", "up", "press"], function(index, name) {
            Keys.prototype[name] = function(keyname, fn) {
                return this.addHandler("key" + name, keyname, fn), this
            }
        }),
        function(opt) {
            return new Keys(opt)
        }
}), define("mod/form", ["jquery", "mod/key"], function($, Key) {
    function getTextareaScrollHeight(textarea) {
        return textarea.height(0).scrollTop(0).scrollTop(1e4).scrollTop()
    }
    var formUtil = {},
        VISIBLE_INPUT = "input, button, textarea",
        TEXTAREA = "textarea";
    return formUtil.toDict = function(form) {
        for (var item, dict = {}, array = form.serializeArray(), i = 0; i < array.length; i++) item = array[i], dict[item.name] = item.value;
        return dict
    }, formUtil.send = function(form, options) {
        var data = formUtil.toDict(form),
            method = form.attr("method"),
            action = form.attr("action");
        return $.ajax($.extend({
            type: method,
            url: action,
            data: data
        }, options))
    }, formUtil.readonlyForm = function(form) {
        form.find(VISIBLE_INPUT).prop("disabled", !0)
    }, formUtil.resumeForm = function(form) {
        form.find(VISIBLE_INPUT).prop("disabled", !1)
    }, formUtil.ctrlEnterForm = function(form) {
        if (form = form.eq(0), !form.data("ctrl-enter-binded")) {
            form.data("ctrl-enter-binded", !0);
            var textarea = form.find(TEXTAREA),
                keyRouter = textarea.data("key-router") || Key({
                    target: textarea
                });
            keyRouter.down(["ctrl+enter", "meta+enter"], function() {
                $(this.form).submit()
            }), textarea.data("key-router", keyRouter)
        }
    }, formUtil.autoResize = function(textarea) {
        var fakeTextarea = textarea.data("fake-textarea");
        if (fakeTextarea && !textarea.data("has-expanded-max-height")) {
            var value = textarea.val();
            fakeTextarea.val(value);
            var height = getTextareaScrollHeight(fakeTextarea),
                maxHeight = textarea.data("max-height") || 100,
                minHeight = textarea.data("min-height") || textarea.height();
            height > maxHeight && (height = maxHeight, textarea.css({
                overflow: "auto"
            }).data("has-expanded-max-height", !0)), textarea.height(minHeight > height ? minHeight : height)
        }
    }, formUtil.enableAutoResize = function(textarea, fakeTextareaParent) {
        var fakeTextarea = textarea.clone();
        fakeTextarea.removeAttr("name"), fakeTextareaParent = fakeTextareaParent || textarea.parent(), textarea.data("fake-textarea", fakeTextarea), textarea.on("input propertychange", $.proxy(function(e) {
            if (e && e.originalEvent) {
                var prop = e.originalEvent.propertyName;
                if (prop && "value" !== prop) return
            }
            formUtil.autoResize(textarea)
        }, this)), fakeTextarea.css({
            position: "absolute",
            top: "-999px",
            left: 0
        }), fakeTextareaParent.append(fakeTextarea)
    }, formUtil
}), define("mod/cursor", [], function() {
    var cursor = {},
        doc = document,
        getCursorPosition = function(textarea) {
            if (doc.selection) {
                textarea.focus();
                var ds = doc.selection,
                    range = ds.createRange(),
                    storedRange = range.duplicate();
                return storedRange.moveToElementText(textarea), storedRange.setEndPoint("EndToEnd", range), textarea.selectionStart = storedRange.text.length - range.text.length, textarea.selectionStart
            }
            return textarea.selectionStart
        },
        _selectTxt = function(textarea, start, end) {
            if (doc.selection) {
                var range = textarea.createTextRange();
                range.moveEnd("character", -textarea.value.length), range.moveEnd("character", end), range.moveStart("character", start), range.select()
            } else textarea.setSelectionRange(start, end), textarea.focus()
        },
        setCursorPosition = function(textarea, position) {
            _selectTxt(textarea, position, position)
        },
        insertAfterCursor = function(textarea, text) {
            if (textarea.value, doc.selection) textarea.focus(), doc.selection.createRange().text = text;
            else {
                var cp = textarea.selectionStart,
                    ubbLength = textarea.value.length;
                textarea.value = textarea.value.slice(0, cp) + text + textarea.value.slice(cp, ubbLength), setCursorPosition(textarea, cp + text.length)
            }
        },
        removeRangeText = function(textarea, number) {
            var pos = getCursorPosition(textarea),
                val = textarea.value;
            textarea.value = number > 0 ? val.slice(0, pos - number) + val.slice(pos) : val.slice(0, pos) + val.slice(pos - number), setCursorPosition(textarea, pos - (0 > number ? 0 : number))
        },
        collapseToEnd = function(textarea) {
            if (doc.selection) {
                var range = textarea.createTextRange();
                range.moveToElementText(textarea), range.collapse("false"), range.select()
            } else {
                var len = textarea.value.length;
                textarea.setSelectionRange(len, len), textarea.focus()
            }
        };
    return cursor = {
        get: getCursorPosition,
        set: setCursorPosition,
        insert: insertAfterCursor,
        remove: removeRangeText,
        collapseToEnd: collapseToEnd
    }
}), define("../reader/views/common/form/note_inline_form", ["jquery", "backbone", "underscore", "mod/cursor", "mod/form"], function($, Backbone, _, cursor, FormUtil) {
    var NoteInlineForm = Backbone.View.extend({
        tagName: "form",
        className: "inline-form",
        tmpl: $("#tmpl-note-inline-form").html(),
        events: {
            "click .cancel": "cancel",
            submit: "editDone"
        },
        initialize: function(options) {
            var NoteFormModel = Backbone.Model.extend({
                defaults: {
                    text: ""
                }
            });
            this.model = new NoteFormModel(_.pick(options, "text", "visible_private")), this.dfd = new $.Deferred, this.promise = this.dfd.promise(), this.promise.always(_.bind(function() {
                this.remove()
            }, this))
        },
        render: function() {
            return this.$el.html(_.template(this.tmpl, this.model.pick("text", "visible_private"))), this.textarea = this.$(".text"), FormUtil.ctrlEnterForm(this.$el), FormUtil.enableAutoResize(this.textarea, this.$el), this
        },
        autoResize: function() {
            return FormUtil.autoResize(this.textarea), this
        },
        focus: function() {
            return this.textarea.focus(), cursor.collapseToEnd(this.textarea[0]), this
        },
        parseText: function(text) {
            return $.trim(text).replace(/\n/g, " ")
        },
        editDone: function(e) {
            e.preventDefault();
            var text = this.parseText(this.textarea.val());
            return text.length ? (this.model.set({
                text: text,
                visible_private: this.$("input[name=visible_private]").is(":checked") ? "on" : ""
            }), this.dfd.resolve(this.model), void 0) : alert("批注不能为空")
        },
        cancel: function(e) {
            e.preventDefault(), this.dfd.reject()
        }
    });
    return NoteInlineForm
}), define("../reader/views/mixins/annotation_item", ["underscore", "reader/views/common/form/note_inline_form"], function(_, NoteInlineForm) {
    return {
        htmlNoteArea: function(html) {
            this.$(".note").html(_.escape(html))
        },
        deleteAnnotation: function(e) {
            e.preventDefault();
            var type = this.model.isUnderline() ? "划线" : "批注",
                result = confirm("确定删除这条{{type}}吗？".replace("{{type}}", type));
            result && this.model.destroy()
        },
        editNote: function(e) {
            e.preventDefault();
            var model = this.model,
                note = model.get("note"),
                noteInlineForm = new NoteInlineForm({
                    text: note,
                    visible_private: this.model.isPrivate()
                }),
                noteArea = this.$(".note"),
                self = this;
            noteArea.html(noteInlineForm.render().el), noteInlineForm.autoResize().focus(), this.$el.addClass("note-editing"), noteInlineForm.promise.done(function(textModel) {
                model.set({
                    note: textModel.get("text"),
                    visible_private: textModel.get("visible_private")
                })
            }).always(function() {
                self.htmlNoteArea(model.get("note")), self.$el.removeClass("note-editing")
            })
        }
    }
}), define("../reader/views/mixins/sharing", ["jquery", "underscore", "backbone", "reader/app", "mod/ajax", "mod/detector", "reader/modules/ga"], function($, _, Backbone, app, ajax) {
    return {
        tmplSharingActions: $("#tmpl-sharing-actions").html(),
        tmplShareWeibo: $("#tmpl-share-weibo").html(),
        disabledLabel: "请选择分享到哪里",
        initializeSharing: function(formModel, options) {
            options = _.extend({
                disableWithoutSharing: !0
            }, options), _.bindAll(this, "disableFormWithoutChecked", "renderWeiboAction", "updateVisible", "updateModel"), this.formModel = formModel, formModel.fetchIsWeiboBinded({
                success: this.renderWeiboAction
            }), options.disableWithoutSharing && (formModel.listenAttrsChange("sharing", this.disableFormWithoutChecked), this.disableFormWithoutChecked(formModel))
        },
        bindSharingActions: function() {
            this.settingBtn = this.$(".share-setting"), this.visibleChecker = this.$(".note-visible-wrapper input"), this.shareText = this.$(".textarea-text"), this.$("input[type=checkbox]").on("change", this.updateModel), this.visibleChecker.on("change", this.updateVisible), this.updateVisible()
        },
        defaultRenderOptions: {
            hasLabel: !0,
            hasVisibleSetting: !1,
            allowShare: !0
        },
        renderSharingHtml: function(renderOptions) {
            return _.template(this.tmplSharingActions, _.extend(_.defaults(renderOptions, this.defaultRenderOptions), this.formModel.pickAttrs("sharing")))
        },
        renderWeiboAction: function(weiboBinded) {
            var itemWeibo = this.$el.find(".item-weibo-wrapper"),
                weiboSetting = this.$el.find(".weibo-setting");
            itemWeibo.html(_.template(this.tmplShareWeibo, {
                weiboBinded: weiboBinded,
                share_weibo: this.formModel.get("share_weibo")
            })), weiboBinded ? (this.formModel.weiboBinded = !0, this.$("#share-weibo").on("change", this.updateModel)) : this.formModel.set("share_weibo", ""), itemWeibo.toggle(weiboBinded), weiboSetting.toggle(!weiboBinded), this.settingBtn.toggle(weiboBinded), this.updateVisible(), this.trigger("updated")
        },
        updateSharingText: function() {
            var self = this,
                articleModel = app.getModel("article"),
                aid = (this.$el.find(".item-weibo"), articleModel ? articleModel.get("id") : location.pathname.split("/")[3]),
                defaultSharingText = "";
            articleModel && (defaultSharingText = articleModel.get("defaultSharingText"), this.shareText.val(defaultSharingText ? defaultSharingText + " " : "")), aid && !app.getModel("config").get("isChapter") && ajax.get("/ebook/" + aid + "/events", function(events) {
                if (events.hashtag) {
                    var text = $.trim(self.shareText.text()),
                        hashtag = (text.length ? " " : "") + "#" + events.hashtag + "# ";
                    self.shareText.val(text + hashtag)
                }
            })
        },
        isPrivate: function() {
            return this.visibleChecker.is(":checked")
        },
        updateVisible: function() {
            var shareOptions = this.$(".share-options"),
                shareTexts = shareOptions.find("label, .label"),
                shareCheckers = shareOptions.find("input[type=checkbox]"),
                isPrivate = this.isPrivate();
            shareTexts.toggleClass("disabled", isPrivate), shareCheckers.prop("disabled", isPrivate), this.updateShareOptions(isPrivate)
        },
        updateShareOptions: function(disabled) {
            var shareChecker, shareOptions = this.formModel.pickAttrs("sharing"),
                shareCheckers = this.$(".share-options input[type=checkbox]");
            _.each(shareOptions, function(value, key) {
                value = disabled ? !1 : value, shareChecker = shareCheckers.filter("[name=" + key + "]")[0], shareChecker && (shareChecker.checked = value)
            }, this)
        },
        disableFormWithoutChecked: function(model) {
            var isDisabled = !model.hasSharing(),
                button = this.$(".btn-post");
            isDisabled !== button.prop("disabled") && button.prop("disabled", isDisabled).toggleClass("btn-disabled", isDisabled).text(isDisabled ? this.disabledLabel : "确定")
        },
        updateModel: function(e) {
            var el = $(e.currentTarget),
                name = el.attr("name"),
                checked = el.prop("checked");
            this.formModel.set(name, checked ? "on" : "")
        },
        getText: function() {
            return this.parseText(this.$("textarea[name=text]").val())
        },
        parseText: function(text) {
            return $.trim(text).replace(/\n/g, " ")
        }
    }
}), define("../reader/models/sharing_form", ["backbone", "underscore", "jquery", "arkenv", "mod/ajax", "reader/modules/storage"], function(Backbone, _, $, arkenv, ajax, storage) {
    var sharingAttrKeys = ["broadcast_to_site", "share_dou", "share_weibo"];
    return Backbone.Model.extend({
        defaults: function() {
            return _.extend({
                share_dou: "on",
                share_weibo: "on",
                broadcast_to_site: "",
                text: ""
            }, this.getConfigFromStorage() || {})
        },
        initialize: function(attr, options) {
            options && options.url && (this.url = options.url), arkenv.me.hasAgentSite || this.unset("broadcast_to_site")
        },
        attrsGroup: {
            config: sharingAttrKeys,
            checkbox: sharingAttrKeys,
            sharing: sharingAttrKeys
        },
        getGroupKeys: function(groupName) {
            var keys = this.attrsGroup[groupName];
            if (!keys) throw "`attrsGroup[groupName:" + groupName + "]` is not found";
            return keys
        },
        pickAttrs: function(groupName) {
            var keys = this.getGroupKeys(groupName);
            return this.pick(keys)
        },
        listenAttrsChange: function(groupName, func, context) {
            var keys = this.getGroupKeys(groupName),
                event = _.map(keys, function(key) {
                    return "change:" + key
                }).join(" ");
            this.on(event, func, context)
        },
        configStroageKey: "sharingFormDefaults",
        getConfigFromStorage: function() {
            var stringifyDefaults = storage.get(this.configStroageKey);
            return stringifyDefaults ? JSON.parse(stringifyDefaults) : void 0
        },
        saveConfigToStroage: function(groupName) {
            groupName = groupName || "config";
            var oldConfigData, attrs = this.pickAttrs(groupName);
            oldConfigData = this.getConfigFromStorage(), attrs = _.defaults(attrs, oldConfigData), storage.set(this.configStroageKey, JSON.stringify(attrs))
        },
        fetchIsWeiboBinded: function(options) {
            options = options || {};
            var self = this,
                shareWeiboFormConfig = this.get("share_weibo");
            this.set("share_weibo", ""), ajax.get("/j/share/check_sina", function(data) {
                var weiboBinded = data.bind;
                self.set("share_weibo", shareWeiboFormConfig), weiboBinded || self.unset("share_weibo"), options.success && options.success(weiboBinded)
            })
        },
        hasSharing: function() {
            var attrs = this.pickAttrs("sharing");
            return _.chain(attrs).values().some().value()
        }
    })
}), define("../reader/views/common/tips/sharing_form", ["jquery", "backbone", "underscore", "mod/ajax", "reader/modules/ga", "mod/form", "reader/modules/toast", "reader/models/sharing_form", "reader/views/mixins/sharing"], function($, Backbone, _, ajax, ga, FormUtil, Toast, SharingFormModel, sharingMixin) {
    var SharingForm = Backbone.View.extend({
        tagName: "form",
        className: "share-form",
        tmpl: $("#tmpl-sharing-form").html(),
        initialize: function(options) {
            this.dfd = $.Deferred(), this.promise = this.dfd.promise(), this.options = options, this.isNote = options.isNote, this.shareTypeLabel = options.shareTypeLabel || this.isNote ? "推荐" : "分享"
        },
        render: function() {
            var formModel = new SharingFormModel(this.options.extraParam, {
                url: this.options.url
            });
            return this.initializeSharing(formModel), this.$el.html(_.template(this.tmpl, {
                isNote: this.isNote,
                sharingActionsHtml: this.renderSharingHtml({
                    sharingLabel: this.shareTypeLabel
                })
            })), this.bindSharingActions(), this.updateSharingText(), FormUtil.ctrlEnterForm(this.$el), this
        },
        events: {
            submit: "submitForm",
            "click .ln-cancel": "cancelForm"
        },
        cancelForm: function(e) {
            e.preventDefault(), this.dfd.reject(), this.trigger("cancel")
        },
        submitForm: function(e) {
            e.preventDefault();
            var model = this.formModel,
                text = this.getText(),
                isNote = this.isNote,
                addCommentAttr = this.getCommentAttr();
            model.hasSharing() && (FormUtil.readonlyForm(this.$el), model.set("text", text), isNote && model.set("add_comment", addCommentAttr), model.save({}).done(_.bind(function() {
                this.shareText.val(""), FormUtil.resumeForm(this.$el), model.saveConfigToStroage(), addCommentAttr && this.onAddCommentAttr(), Toast.toast(this.shareTypeLabel + "成功"), ga._trackEvent("readShare")
            }, this)).fail(_.bind(function(xhr, type, message) {
                Toast.toast(this.shareTypeLabel + "失败: " + message)
            }, this)), this.dfd.resolve(model), this.trigger("submitted", model))
        },
        getCommentAttr: function() {
            return this.$("#add-comment").is(":checked") ? "on" : ""
        },
        onAddCommentAttr: $.noop
    });
    return _.extend(SharingForm.prototype, sharingMixin), SharingForm
}), define("../reader/views/reading/tips/sharing_form", ["jquery", "backbone", "underscore", "reader/views/common/tips/sharing_form"], function($, Backbone, _, CommonSharingForm) {
    return CommonSharingForm.extend({
        onAddCommentAttr: function() {
            this.model.addCommentNum(1)
        }
    })
}), define("../reader/views/modules/create_form_in_tip", ["jquery", "backbone", "underscore", "mod/cursor"], function($, Backbone, _, cursor) {
    var utils = {
        useFormStyle: function(tip) {
            tip.setClass("bubble-form"), utils.updateTipPosition(tip)
        },
        updateTipPosition: function(tip) {
            var ARROW_HEIGHT = 10;
            tip.update(ARROW_HEIGHT)
        }
    };
    return function(tip, View, viewOptions, options) {
        options || (options = {});
        var view = new View(viewOptions);
        tip.setContent(view.render().el), tip.set({
            preferedDirection: tip.preferedDirection,
            arrowHeight: 10
        }), tip.show(), utils.useFormStyle(tip), options.autoClose && view.promise && view.promise.always(function() {
            tip.hide()
        }), view.on("updated", function() {
            utils.updateTipPosition(tip)
        }), view.$el.on("removing", function() {
            view.stopListening()
        });
        var textarea = tip.find("textarea").focus();
        return cursor.collapseToEnd(textarea[0]), view
    }
}), define("../reader/views/reading/annotations_panel/annotations_item", ["jquery", "backbone", "underscore", "reader/app", "mod/auto_link", "reader/views/modules/create_form_in_tip", "reader/views/reading/annotation_comments/view", "reader/views/reading/tips/sharing_form", "reader/views/mixins/annotation_item", "reader/modules/iso_time/print"], function($, Backbone, _, app, autoLink, createFormInTip, AnnotationCommentsView, SharingForm, AnnotationItemMixin, printTime) {
    var AnnotationsItem = Backbone.View.extend({
        tagName: "li",
        className: "annotations-item",
        tmpl: $("#tmpl-annotations-panel-item").html(),
        commentTextTmpl: $("#tmpl-annotation-comment-text").html(),
        favoriteTextTmpl: $("#tmpl-annotation-favorite-text").html(),
        initialize: function(options) {
            this.info = options.info, this.config = options.config, this.shareTip = options.shareTip, this.annotations = options.annotations, this.listenTo(this.model, "destroy", this.destroy), this.listenTo(this.model, "change:n_favorites", this.updateFavorite), this.listenTo(this.model, "change:n_comments", this.updateComment), this.listenTo(this.model, "change:visible_private", this.updatePrivate), this.commentOpened = !1
        },
        events: {
            "click .delete-annotation": "deleteAnnotation",
            "click .modify-annotation": "editNote",
            "click .jump-annotation": "jumpAnnotation",
            "click .favorite-annotation": "favoriteAnnotation",
            "click .share-annotation": "shareAnnotation",
            "click .comment-annotation": "toggleCommentAnnotation"
        },
        render: function() {
            var data = this.model.toJSON(),
                ownerId = data.owner.user_id;
            return this.$el.html(_.template(this.tmpl, _.extend(data, {
                printTime: printTime,
                isNote: this.model.isNote(),
                isMine: this.model.isMine(),
                isFavorited: this.model.isFavorited(),
                isPrivate: this.model.isPrivate(),
                actions: this.model.getActionsList(),
                extra: this.info.get("extra"),
                isArticleAuthor: ownerId === app.getModel("article").get("authorId"),
                autoLink: autoLink
            }))), this.updateTagClass(), this.favoriteText = this.$(".favorite-annotation"), this.commentText = this.$(".comment-annotation"), this.privateTextWrapper = this.$(".private-info-wrapper"), this.shareWrapper = this.$(".share-wrapper"), this.updateFavorite(this.model), this.updateComment(this.model), this.updatePrivate(this.model), this
        },
        updateFavorite: function(model) {
            if (this.favoriteText.length) {
                var data = model.toJSON();
                data.isFavorited = model.isFavorited(), this.favoriteText.html(_.template(this.favoriteTextTmpl, data))
            }
        },
        updatePrivate: function(model) {
            if (this.privateTextWrapper.length) {
                var isPrivate = model.isPrivate();
                this.privateTextWrapper[isPrivate ? "show" : "hide"](), this.shareWrapper[isPrivate ? "hide" : "show"]()
            }
        },
        updateComment: function(model) {
            this.commentText.length && this.commentText.html(_.template(this.commentTextTmpl, model.toJSON()))
        },
        jumpAnnotation: function(e) {
            e.preventDefault();
            var stamp = this.model.getStamp();
            this.config.trigger("goto:stamp", stamp)
        },
        favoriteAnnotation: function(e) {
            e.preventDefault();
            var model = this.model,
                isFavorited = model.isFavorited();
            model.isFavoriting || model.editFavorite(!isFavorited)
        },
        shareAnnotation: function(e) {
            e.preventDefault();
            var el = $(e.currentTarget),
                model = this.model;
            _.bind(function() {
                this.shareTip.hide()
            }, this), this.shareTip.set({
                target: el
            }).show();
            var url, extraParam = {
                works_id: model.articleId
            };
            model.isNote() ? (url = "/j/share/rec_annotation", _.extend(extraParam, {
                annotation_id: model.get("id")
            })) : (url = "/j/share/rec_works_piece", _.extend(extraParam, {
                annotation: JSON.stringify(model.toJSON())
            })), createFormInTip(this.shareTip, SharingForm, {
                model: model,
                url: url,
                isNote: model.isNote(),
                extraParam: extraParam,
                shareTypeLabel: "推荐"
            }, {
                autoClose: !0
            })
        },
        toggleCommentAnnotation: function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.commentsView || (this.commentsView = new AnnotationCommentsView({
                markingModel: this.model,
                commentTargetInfo: {
                    article: {
                        authorId: app.getModel("article").get("authorId")
                    }
                }
            }), this.$(".bd").append(this.commentsView.render().$el.hide())), this.commentOpened = !this.commentOpened, this.commentsView.$el.toggle(this.commentOpened), target.toggleClass("opened", this.commentOpened)
        },
        destroy: function() {
            this.commentsView && this.commentsView.remove(), this.annotations.remove(this.info), this.remove()
        },
        updateTagClass: function() {
            this.$el.removeClass(this.tagClass), this.tagClass = this.getTagClass(), this.$el.addClass(this.tagClass)
        },
        getTagClass: function() {
            return this.model.getShowTag() + "-annotation"
        }
    });
    return _.extend(AnnotationsItem.prototype, AnnotationItemMixin), AnnotationsItem
}), define("../reader/models/annotation_info", ["backbone", "underscore"], function(Backbone) {
    var AnnotationInfo = Backbone.Model.extend({
        parse: function(data) {
            return data.extra.percent = parseInt(data.extra.percent, 10), data
        }
    });
    return AnnotationInfo
}), define("../reader/collections/annotation_infos", ["backbone", "underscore", "reader/models/annotation_info"], function(Backbone, _, AnnotationInfo) {
    var AnnotationInfos = Backbone.Collection.extend({
        url: function() {
            return "/j/article_v2/" + this.articleId + "/my_annotations"
        },
        model: AnnotationInfo,
        initialize: function(attrs, options) {
            this.articleId = options.articleId
        }
    });
    return AnnotationInfos
}), define("../reader/views/reading/annotations_panel/view", ["jquery", "backbone", "underscore", "reader/collections/annotation_infos", "reader/models/marking", "reader/views/reading/annotations_panel/annotations_item", "widget/parent_view", "reader/views/mixins/panel", "reader/modules/tooltip", "reader/modules/iso_time/parse", "reader/modules/click_outside", "reader/modules/elems_list_paging"], function($, Backbone, _, AnnotationInfos, MarkingModel, AnnotationsItem, ParentView, Panel, Tooltip, parseIsoTime, onClickOutside, ListPaging) {
    var LABEL_EMPTY = {
            all: "暂时没有划线和批注<br>可以在阅读时选中文字后添加",
            mine: "暂时没有你自己的划线和批注<br>可以在阅读时选中文字后添加",
            favorite: "暂时没有被你收藏的他人批注<br>可以对你认为有趣的他人批注点击“收藏”，它们就会出现在这里"
        },
        LABEL_LOADING = "加载中…",
        LABEL_ERROR = "出错了",
        SHOW = !0,
        HIDE = !1,
        SORT_TYPES_TEXT = {
            percent: "按原文顺序",
            time: "按添加时间"
        },
        AnnotationsPanel = Backbone.View.extend({
            tmpl: $("#tmpl-annotations-panel").html(),
            initialize: function(options) {
                _.bindAll(this, "renderPage"), this.app = options.app, this.config = options.config, this.sortType = "time", this.filterType = "all", this.list = $("<ul>", {
                    "class": "annotations-list"
                }), this.pagingNav = $("<div>", {
                    "class": "paging-nav"
                }), this.textBox = $("<div>", {
                    "class": "text-box"
                }), this.shareTip = new Tooltip, this.$el.on("scroll", _.throttle(_.bind(this.scroll, this), 300))
            },
            events: {
                "action:expand": "render",
                "click .filter-tabs a": "filterItems",
                "click .sort-tabs a": "sortItems",
                "click .sort-switch .hd": "toggleSortTabs"
            },
            render: function() {
                var articleModel = this.app.getModel("article");
                this.$el.empty(), this.$el.html(_.template(this.tmpl)), this.tabs = this.$(".annotation-tabs").hide(), this.panelBody = this.$(".panel-body"), this.panelBody.append(this.textBox).append(this.list).append(this.pagingNav), this.toggleList(HIDE), this.sortTypeText = this.$(".sort-type"), this.sortTabs = this.$(".sort-tabs"), this.renderTabs(), articleModel.markings, this.renderTextBox(LABEL_LOADING), this.listPaging = new ListPaging({
                    limit: 10,
                    navLimit: 5,
                    items: this.list.children("li"),
                    container: this.list,
                    navContainer: this.pagingNav
                }), this.listPaging.on("turnPage", this.renderPage);
                var annotations = this.annotations = new AnnotationInfos(null, {
                    articleId: articleModel.id
                });
                return annotations.on("remove", this.detectAnnotations, this), annotations.on("add", function(annotationModel) {
                    annotationModel.markingModel = this.getMarkingByInfo(annotationModel)
                }, this), annotations.fetch({
                    success: $.proxy(function() {
                        this.renderListBy(this.sortType, this.filterType)
                    }, this),
                    error: $.proxy(function() {
                        this.renderTextBox(LABEL_ERROR)
                    }, this)
                }), this
            },
            scroll: function() {
                var tip = this.shareTip;
                tip.isVisible() && tip.hide()
            },
            scrollToTop: function() {
                $(".panels-container").scrollTop(0)
            },
            detectAnnotations: function() {
                return this.annotations.length ? this.hasFilterResult(this.filterType) ? (this.tabs.toggle(SHOW), this.toggleList(SHOW), !0) : (this.tabs.toggle(SHOW), this.toggleList(HIDE), !1) : (this.tabs.toggle(HIDE), this.toggleList(HIDE, "all"), !1)
            },
            hasFilterResult: function(filterType) {
                return "all" === filterType ? !!this.annotations.length : this.annotations.some(function(info) {
                    return info.markingModel.hasTag(filterType)
                })
            },
            toggleList: function(showList, textType) {
                var showTextBox = !showList;
                textType = textType || this.filterType, showTextBox && this.renderTextBox(LABEL_EMPTY[textType]), this.$el.toggleClass("show-text-box", showTextBox)
            },
            renderTextBox: function(text) {
                this.textBox.html(text)
            },
            toggleSortTabs: function(e) {
                var sortTabs = this.sortTabs,
                    target = $(e.currentTarget);
                sortTabs.toggleClass("opened"), onClickOutside(target, function() {
                    sortTabs.removeClass("opened")
                })
            },
            sortItems: function(e) {
                this.switchTag("sort", $(e.currentTarget))
            },
            filterItems: function(e) {
                this.switchTag("filter", $(e.currentTarget))
            },
            switchTag: function(tabType, clickElem) {
                var attrName = tabType + "Type",
                    tabValue = clickElem.data(tabType + "-type");
                this[attrName] === tabValue || this.tabs.hasClass("disabled") || (this[attrName] = tabValue, this.renderTabs(), this.renderListBy(this.sortType, this.filterType))
            },
            renderTabs: function() {
                var tabs = this.tabs,
                    handlers = tabs.find("a"),
                    sortHandler = handlers.filter("a[data-sort-type=" + this.sortType + "]"),
                    filterHandler = handlers.filter("a[data-filter-type=" + this.filterType + "]");
                this.sortTypeText.html(SORT_TYPES_TEXT[this.sortType]), handlers.toggleClass("actived", !1), sortHandler.addClass("actived"), filterHandler.addClass("actived")
            },
            renderListBy: function(sortType, filterType) {
                var infos = this.getAnnotationInfosBy(sortType, filterType);
                this.listPaging.setItems(infos).render(), this.detectAnnotations()
            },
            renderPage: function(pageInfos) {
                var view;
                this.removeAllSubView(), _.each(pageInfos, function(info) {
                    view = this.getAnnotationView(info), this.addSubView(view), this.list.append(view.render().el)
                }, this), this.scrollToTop()
            },
            sortIterator: {
                time: function(annotation) {
                    return -parseIsoTime(annotation.get("create_time"))
                },
                percent: function(annotation) {
                    return annotation.get("extra").percent
                }
            },
            filterIterator: {
                all: function() {
                    return !0
                },
                mine: function(annotation) {
                    return annotation.markingModel.isMine()
                },
                favorite: function(annotation) {
                    return annotation.markingModel.isFavorited()
                }
            },
            getAnnotationView: function(info) {
                return new AnnotationsItem({
                    model: info.markingModel,
                    info: info,
                    config: this.config,
                    annotations: this.annotations,
                    shareTip: this.shareTip
                })
            },
            getAnnotationInfosBy: function(sortType, filterType) {
                var annotations = this.annotations;
                return _.clone(annotations.chain().filter(this.filterIterator[filterType]).sortBy(this.sortIterator[sortType]).value())
            },
            getMarkingByInfo: function(info) {
                var newMarking, articleModel = this.app.getModel("article"),
                    contentModel = this.app.getModel("content"),
                    markings = articleModel.markings,
                    model = markings.get(info.id);
                return model || (newMarking = info.omit("extra"), model = new MarkingModel(newMarking, {
                    articleId: articleModel.id,
                    paragraphsIndex: contentModel.getParasIndexs()
                }), model.on("effectiveChange", function(model) {
                    model.save()
                })), model
            }
        });
    return _.extend(AnnotationsPanel.prototype, Panel, ParentView), AnnotationsPanel
}), define("../reader/views/reading/bookmarks/item", ["backbone", "underscore", "jquery", "reader/app"], function(Backbone, _, $, app) {
    var BookmarksItem = Backbone.View.extend({
        tagName: "li",
        className: "bookmark-item",
        template: $("#tmpl-bookmarks-item").html(),
        initialize: function(options) {
            return _.bindAll(this, "gotoBookmarkPage"), this.vent = app.vent, this.config = options.config, this
        },
        render: function() {
            var bookmarkData = this.model.toJSON();
            return this.$el.html(_.template(this.template, bookmarkData)), this
        },
        events: {
            click: "gotoBookmarkPage"
        },
        gotoBookmarkPage: function() {
            var stamp = this.model.getStamp(),
                sequence = stamp.sequence;
            return !stamp.pid && sequence ? (this.vent.trigger("goto:tocPage", sequence), void 0) : (this.config.trigger("goto:stamp", stamp), void 0)
        }
    });
    return BookmarksItem
}), define("../reader/models/bookmark", ["backbone", "underscore", "jquery"], function(Backbone, _) {
    var Bookmark = Backbone.Model.extend({
        url: "/j/bookmark/",
        _mixInData: function(options, data) {
            return options = options ? _.clone(options) : {}, options.data = _.extend({}, options.data, data), options
        },
        destroy: function(options) {
            return options = this._mixInData(options, {
                bookmark_id: this.id
            }), Backbone.Model.prototype.destroy.call(this, options)
        },
        sync: function(method, model, options) {
            return /create|delete/.test(method) ? (options.url = this.url + method, Backbone.sync(method, model, options)) : void 0
        },
        parse: function(bookmark) {
            var percent = Math.round(bookmark.percent);
            return bookmark.percent = percent ? percent : "< 1", bookmark
        },
        getStamp: function() {
            return {
                pid: this.get("paragraph_id"),
                offset: this.get("paragraph_offset"),
                sequence: this.get("part_sequence")
            }
        }
    });
    return Bookmark
}), define("../reader/collections/bookmarks", ["backbone", "underscore", "jquery", "reader/models/bookmark"], function(Backbone, _, $, Bookmark) {
    var Bookmarks = Backbone.Collection.extend({
        model: Bookmark,
        url: function() {
            return "/j/bookmark/gets_by_works?works_id=" + this.articleId
        },
        initialize: function(attrs, options) {
            this.articleId = options.articleId
        },
        getPids: function() {
            return this.pluck("paragraph_id")
        },
        comparator: function(bookmark) {
            return bookmark.get("percent")
        }
    });
    return Bookmarks
}), define("../reader/views/reading/bookmarks/panel", ["backbone", "underscore", "jquery", "reader/collections/bookmarks", "reader/views/reading/bookmarks/item"], function(Backbone, _, $, Bookmarks, BookmarkItem) {
    var BookmarksPanel = Backbone.View.extend({
        template: $("#tmpl-bookmarks-panel").html(),
        initialize: function(options) {
            _.bindAll(this, "renderList", "_createHeadlineSet"), this.app = options.app, this.config = options.config, this.$el.html(_.template(this.template)), this.panelBody = this.$el.find(".panel-bd"), this.tmplChapter = _.template('<li class="chapter">{{= headline }}</li>'), this.renderTip("empty")
        },
        events: {
            "action:expand": "render",
            "action:collapse": "renderTip"
        },
        render: function() {
            var app = this.app,
                articleModel = app.getModel("article");
            this.renderTip("loading"), this.toc = app.getModel("content").contents, this.list = $("<ul>", {
                "class": "bookmark-list"
            }), navigator.onLine ? (this.collection = new Bookmarks([], {
                articleId: articleModel.id
            }), this.collection.fetch({
                success: this.renderList
            })) : (this.bookmarks = articleModel.bookmarks, this.renderList(this.bookmarks))
        },
        _createHeadlineSet: function() {
            var headlineSet = {};
            return _.each(this.toc, function(t) {
                headlineSet[t.sequence] = t.text
            }), headlineSet
        },
        _createSequenceRanges: function() {
            var sequenceRanges = [],
                tocSequences = _.pluck(this.toc, "sequence");
            return tocSequences.push(1 / 0), _.reduce(tocSequences, function(a, b) {
                return sequenceRanges.push([a, b]), b
            }), sequenceRanges
        },
        renderTip: function(type) {
            var tipsMapping = {
                empty: "你还没有添加书签哦!",
                loading: "加载中, 请稍候..."
            };
            return this.panelBody.html($("<p>", {
                "class": "panel-tip",
                text: tipsMapping[type]
            })), this
        },
        renderList: function(collection) {
            if (!collection.length) return this.renderTip("empty");
            var bookmarks = collection || this.bookmarks,
                isAnthology = this.app.getModel("content").posts.length > 1;
            if (!isAnthology) var sequenceRanges = this._createSequenceRanges(),
                headlineSet = this._createHeadlineSet();
            _.each(bookmarks.models, function(model) {
                var partSequence = model.get("part_sequence"),
                    headline = this.toc.length && this.toc[partSequence].text;
                if (isAnthology)(void 0 === this.lastPartSequence || partSequence !== this.lastPartSequence) && this.list.append(this.tmplChapter({
                    headline: headline
                })), this.lastPartSequence = partSequence;
                else {
                    var partParaSequence = model.get("part_paragraph_sequence");
                    _.each(sequenceRanges, _.bind(function(range) {
                        partParaSequence >= range[0] && partParaSequence < range[1] && range[0] !== this.lastHeadlineSequence && (this.list.append(this.tmplChapter({
                            headline: headlineSet[range[0]]
                        })), this.lastHeadlineSequence = range[0])
                    }, this))
                }
                this.list.append(new BookmarkItem({
                    model: model,
                    config: this.config
                }).render().el)
            }, this), this.panelBody.html(this.list), this.lastPartSequence = void 0, this.lastHeadlineSequence = void 0
        }
    });
    return BookmarksPanel
}), define("../reader/views/reading/panels_container", ["backbone", "underscore"], function(Backbone, _) {
    var PanelsContainer = Backbone.View.extend({
        el: ".panels-container",
        template: $("#tmpl-panels-container").html(),
        initialize: function(options) {
            this.controls = options.controls, this.$el.html(_.template(this.template))
        },
        render: function() {
            return this
        },
        events: {
            "click .close": "close"
        },
        close: function() {
            this.controls.closePopups()
        }
    });
    return PanelsContainer
}), define("ui/collapse", ["jquery"], function($) {
    var SHOW = !0,
        HIDE = !1,
        defaultOptions = {
            according: !0,
            allowDisabled: !1,
            activeClass: "active",
            show: function(content) {
                return content.show()
            },
            hide: function(content) {
                return content.hide()
            },
            useCustomShowAndHide: !1,
            toggle: function(content) {
                var options = this.options;
                return content[options.toggleType](options.toggleDuration)
            },
            toggleType: "toggle",
            toggleDuration: null
        },
        autoSplit = function(obj) {
            return obj instanceof jQuery ? obj.map(function() {
                return $(this)
            }) : void 0
        },
        Collapse = function(handlers, contents, options) {
            this.options = $.extend({}, defaultOptions, options), this.activeClass = this.options.activeClass, this.allowDisabled = this.options.allowDisabled, this.handlers = handlers, this.contents = contents, this.transitioning = {}, this.listen()
        };
    return Collapse.fromAutoSplit = function(handlers, contents, options) {
        return new Collapse(autoSplit(handlers), autoSplit(contents), options)
    }, $.extend(Collapse.prototype, {
        listen: function() {
            var self = this;
            $.each(this.handlers, function(handlerIndex, elem) {
                var handler = $(elem);
                handler.on("click", function() {
                    if (!self.allowDisabled || !handler.hasClass("disabled")) {
                        var isOpened = handler.hasClass(self.activeClass);
                        if (!self.transitioning[handlerIndex]) return isOpened ? self.close(handlerIndex) : (self.open(handlerIndex), void 0)
                    }
                });
                var content = self.contents[handlerIndex];
                content.on("close.self", $.proxy(self.hideAll, self))
            })
        },
        findActived: function(callBack) {
            var self = this;
            $.each(this.handlers, function(index, handler) {
                var transitioning = self.transitioning[index],
                    isActived = handler.hasClass(self.activeClass);
                transitioning && isActived || (isActived || transitioning) && callBack.call(self, index)
            })
        },
        close: function(handlerIndex) {
            this.action(handlerIndex, HIDE)
        },
        open: function(handlerIndex) {
            this.options.according && this.hideAll(), this.action(handlerIndex, SHOW)
        },
        getActionFn: function(showOrHide) {
            return this.options.useCustomShowAndHide ? this.options[showOrHide ? "show" : "hide"] : this.options.toggle
        },
        action: function(handlerIndex, showOrHide) {
            var content = this.contents[handlerIndex],
                handler = this.handlers[handlerIndex],
                transitioning = this.transitioning[handlerIndex],
                actionType = showOrHide ? "expand" : "collapse",
                action = this.getActionFn(showOrHide),
                self = this;
            transitioning && content.stop(), this.transitioning[handlerIndex] = !0, action.call(this, content).promise().done(function() {
                handler[showOrHide ? "addClass" : "removeClass"](self.activeClass), content.trigger("action:" + actionType, content).trigger("action:toggle", [content, actionType]), self.transitioning[handlerIndex] = !1
            })
        },
        hideAll: function() {
            this.findActived(this.close)
        },
        disableHandlers: function() {
            $.each(this.handlers, function(index, handler) {
                handler.addClass("disabled")
            })
        }
    }), Collapse
}), define("../reader/views/reading/controls_panel", ["backbone", "underscore", "jquery", "arkenv", "mod/url", "ui/collapse", "reader/modules/browser", "reader/app", "reader/modules/ga", "reader/modules/detector", "reader/views/reading/panels_container", "reader/views/reading/bookmarks/panel", "reader/views/reading/annotations_panel/view", "reader/views/reading/toc/toc", "reader/views/reading/toc/toc_chapters", "reader/views/mixins/controls_panel", "reader/views/mixins/toggle_helper"], function(Backbone, _, $, arkenv, Url, Collapse, browser, app, ga, detector, PanelsContainer, BookmarksView, AnnotationsView, Toc, TocChapters, ControlsPanelMixins, ToggleHelperMixins) {
    var fitForMobile = detector.fitForMobile(),
        ControlsPanel = Backbone.View.extend({
            el: ".controls-panel",
            template: $(fitForMobile ? "#tmpl-mobile-controls-panel" : "#tmpl-controls-panel").html(),
            initialize: function(config) {
                _.bindAll(this, "closeTips", "closePopups", "resetHeight", "resizePanel", "togglePanel", "initControls", "panelShown", "panelHidden", "closeShortcutTips", "openShortcutTips"), this.app = app, this.config = config, this.vent = this.app.vent, this.win = $(window), this.body = $("body"), this.vent.on({
                    "close:popups": this.closePopups,
                    "close:helperGuide": this.closeShortcutTips,
                    "open:helperGuide": this.openShortcutTips,
                    "paging:finish": this.initControls
                }), this.$el.html(_.template(this.template, {
                    isGallery: this.config.get("isGallery")
                })).append($("#tmpl-shortcut-tips").html()), this.panelsContainerView = new PanelsContainer({
                    controls: this
                }), this.panelsContainer = this.panelsContainerView.$el, this.controlsContent = this.panelsContainer.find(".controls-content"), this.controlsContent.on("action:toggle", this.togglePanel), this.controlsContent.on("action:expand", this.panelShown), this.controlsContent.on("action:collapse", this.panelHidden), this.shortcutTips = this.$(".shortcut-tips"), this.config.on("goto:stamp", function() {
                    this.closePopups()
                }, this)
            },
            render: function() {
                return this.renderSwichers(), this.resetPanelAsResize(), this.switcher.disableHandlers(), this
            },
            events: {
                "click .controls-list li": "deselectAll",
                "click .close-tips": "closeTips"
            },
            renderSwichers: function() {
                if (!this.switcher) {
                    var tocToggler = this.$(".toggle-toc"),
                        handlers = [],
                        contents = [];
                    if (this.tocView = new Toc({
                            el: this.$(".toc"),
                            app: this.app,
                            turningModel: app.getModel("turning"),
                            controls: this
                        }), this.tocSwitcher = tocToggler, this.toc = this.tocView.$el, this.toc.on("action:expand", function() {
                            ga._trackEvent("openToc")
                        }), handlers.push(this.tocSwitcher), contents.push(this.toc), this.config.get("isChapter")) {
                        var chaptersTocToggler = this.$(".toggle-chapters-toc");
                        this.chaptersTocView = new TocChapters({
                            el: this.$(".chapters-toc"),
                            app: this.app,
                            controls: this
                        }), this.chaptersTocSwitcher = chaptersTocToggler, this.chaptersToc = this.chaptersTocView.$el, this.chaptersToc.on("action:expand", function() {
                            ga._trackEvent("openChaptersToc")
                        }), handlers.push(this.chaptersTocSwitcher), contents.push(this.chaptersToc)
                    }
                    this.bookmarksView = new BookmarksView({
                        el: this.$(".bookmarks"),
                        app: this.app,
                        config: this.config
                    }), this.bookmarks = this.bookmarksView.$el, this.bookmarksSwitcher = this.$(".toggle-bookmarks"), handlers.push(this.bookmarksSwitcher), contents.push(this.bookmarks), this.annotationsView = new AnnotationsView({
                        el: this.$(".annotations"),
                        app: this.app,
                        config: this.config
                    }), this.annotations = this.annotationsView.$el, this.annotationsSwitcher = this.$(".toggle-annotations"), handlers.push(this.annotationsSwitcher), contents.push(this.annotations), this.switcher = new Collapse(handlers, contents, {
                        allowDisabled: !0
                    })
                }
            },
            openChapterList: function() {
                this.chaptersTocSwitcher && this.chaptersTocSwitcher.click()
            },
            deselectAll: function(e) {
                this.closeTips();
                var el = $(e.currentTarget);
                el.is(".controls-item") || this.switcher.hideAll(), this.$el.find(".on").not(el).removeClass("on"), el.hasClass("disabled")
            },
            closeTips: function() {
                app.vent.trigger("close:helperGuide")
            },
            closePopups: function() {
                this.switcher.hideAll(), this.panelsContainer.hide(), this.closeTips(), this.$el.find(".on").removeClass("on")
            },
            togglePanel: function(e, content, action) {
                this.resizePanel(), this.dealingWithScrollbar(action), this.panelsContainer.toggle(), content.trigger("collapse:" + action + "ed")
            },
            panelShown: function() {
                app.vent.trigger("freeze:control")
            },
            panelHidden: function() {
                app.vent.trigger("unfreeze:control")
            },
            initToc: function(list) {
                var hasToc = !!list.length;
                this.tocSwitcher[hasToc ? "removeClass" : "addClass"]("disabled"), hasToc && this.tocView.render(list), this.initChaptersToc(), this.trigger("list:render")
            },
            initChaptersToc: function() {
                this.chaptersTocView && (this.chaptersTocView.render(), this.chaptersTocSwitcher.removeClass("disabled"))
            },
            initBookmarks: function() {
                this.bookmarksSwitcher.removeClass("disabled")
            },
            initAnnotations: function() {
                this.annotationsSwitcher.removeClass("disabled")
            },
            initControls: function(list) {
                this.initToc(list), this.initBookmarks(), this.initAnnotations()
            }
        }),
        AnonymousMixin = arkenv.me.isAnonymous ? {
            initBookmarks: $.noop,
            initAnnotations: $.noop
        } : {};
    return _.extend(ControlsPanel.prototype, ControlsPanelMixins, ToggleHelperMixins, AnonymousMixin), ControlsPanel
}), define("../reader/views/common/page_portal", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/browser", "reader/modules/ga"], function($, Backbone, _, app, browser, ga) {
    var PagePortal = Backbone.View.extend({
        className: "page-portal",
        template: $("#tmpl-page-portal").html(),
        initialize: function() {
            this.win = $(window), this.body = $("body"), this.$el = $(_.template(this.template, {})), this.jumpSection = this.$(".page-jump"), this.form = this.$(".page-form"), this.formInput = this.$(".page-input"), this.currPage = this.$(".curr-num"), this.formInput.focus(this.focusPageInput), this.on("view:openPageForm", this.openPageForm), this.win.resize(_.debounce(_.bind(this.toggle, this), 60)), this.listenTo(this.model, "change:currPage", this.updatePageNumber)
        },
        events: {
            "click .page-info": "openPageFormOnClick",
            "submit .page-form": "submitPageForm",
            "click .page-jump": "stopPropagation"
        },
        render: function() {
            return this
        },
        update: function() {
            this.setTotalPageNum(), this.updatePageNumber(), this.toggle()
        },
        toggle: function() {
            browser.fitForMobile || this.$el.toggle(this.win.width() >= 1024)
        },
        setTotalPageNum: function() {
            var totalPage = this.model.getReadTotalPage();
            this.$el.find(".total-num").text(totalPage)
        },
        stopPropagation: function(e) {
            $(e.target).is("[type=submit]") || e.stopPropagation()
        },
        openPageFormOnClick: function(e) {
            e.preventDefault(), this.$el.hasClass("on") || (e.stopPropagation(), this.openPageForm())
        },
        openPageForm: function() {
            this.$el.addClass("on"), this.jumpSection.show(), this.customPage(), this.formInput.focus(), this.body.on("click.pageNumber", $.proxy(this.closePageFormOnClick, this))
        },
        closePageFormOnClick: function(e) {
            $(e.target).is("[type=submit]") || (e.preventDefault(), this.closePageForm())
        },
        closePageForm: function() {
            this.$el.removeClass("on"), this.jumpSection.hide(), this.formInput.blur(), this.body.off(".pageNumber")
        },
        customPage: function() {
            var model = this.model;
            this.formInput.val(model.getReadCurrPage())
        },
        focusPageInput: function() {
            var formInput = $(this);
            _.defer(function() {
                formInput.select()
            })
        },
        updatePageNumber: function() {
            var readCurrPage = this.model.getReadCurrPage(),
                progress = this.model.get("progress");
            progress && (progress = Math.floor(progress), this.$el.find(".progress-num").text(progress + "%")), this.currPage.text(readCurrPage), this.jumpSection.is(":hidden") || this.customPage()
        },
        submitPageForm: function(e) {
            e.preventDefault();
            var model = this.model,
                targetPage = +this.formInput.val();
            this.closePageForm(), model.getReadCurrPage() !== targetPage && (model.setReadCurrPage(targetPage, {
                isFormJump: !0,
                hasInputPage: !0
            }), ga._trackEvent("gotoPage"))
        },
        hide: function() {
            return this.$el.hide(), this
        }
    });
    return PagePortal
}), define("../reader/views/common/progress_bar", ["backbone", "underscore", "jquery", "reader/app"], function(Backbone, _, $, app) {
    var Progress = Backbone.View.extend({
        initialize: function(options) {
            this.win = $(window), this.body = $("body"), this.fixedLayout = options.fixedLayout
        },
        render: function() {
            var pid = "reading-progress",
                max = 100;
            return this.$el.remove(), this.$el = $("<progress>", {
                role: "progressbar",
                "aria-valuemin": 0,
                "aria-valuemax": max,
                id: pid,
                max: max
            }), this.body.append(this.$el), this.win.resize(_.debounce(_.bind(this._update, this), 80)), this.update(), this
        },
        update: function() {
            var progress = this.model.get("progress"),
                layout = this.fixedLayout || app.getModel("config").get("layout"),
                position = this.convertToPosition(layout);
            return this.setPosition(position), this.setValue(progress), this
        },
        setValue: function(progress) {
            progress = parseFloat(progress) || 0, this._valuenow = progress;
            var trackLength = this.win.height(),
                needPercent = !!/(top|bottom)/.test(this._position),
                remain = 100 - progress;
            return this.$el.val(progress).attr("aria-valuenow", progress), this._attrsAsProps() ? (this.$el.css({
                width: needPercent ? progress + "%" : progress / 100 * trackLength + "px",
                "padding-right": needPercent ? remain + "%" : remain / 100 * trackLength + "px"
            }), this) : this
        },
        _attrsAsProps: function() {
            return !!/msie (8|9)/i.test(navigator.userAgent)
        },
        _update: function() {
            this.update(this._position, this._valuenow)
        },
        setPosition: function(position) {
            var offset = 3,
                w = this.win.height(),
                t = w / 2 - offset,
                pos = "pos-" + position,
                errorMsg = "Invalid param! You can only use one of the positions:top | right | bottom | left.";
            switch (this._position = position, position) {
                case "top":
                case "right":
                    this.$el.css({
                        width: w,
                        top: t
                    });
                    break;
                case "bottom":
                case "left":
                    this.$el.removeAttr("style");
                    break;
                default:
                    throw new Error(errorMsg)
            }
            return this.$el.attr("class", pos), this
        },
        positionMap: {
            vertical: "right",
            horizontal: "bottom"
        },
        convertToPosition: function(layout) {
            return this.positionMap[layout]
        },
        show: function() {
            return this.$el.show(), this
        },
        hide: function() {
            return this.$el.hide(), this
        }
    });
    return Progress
}), define("../reader/views/reading/pagination", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/browser", "reader/modules/toast", "reader/views/common/progress_bar", "reader/views/common/page_portal"], function($, Backbone, _, app, browser, Toast, ProgressBar, PagePortal) {
    var Pagination = Backbone.View.extend({
        el: ".pagination",
        template: $("#tmpl-pagination").html(),
        initialize: function(config) {
            _.bindAll(this, "initPagination", "updateProgressBar");
            var turningModel = app.getModel("turning");
            this.app = app, this.config = config, this.vent = this.app.vent, this.vent.on({
                "paging:finish": this.initPagination
            }), this.$el.html(_.template(this.template)), this.pageForm = this.$(".page-form"), this.pagePrev = this.$(".page-prev"), this.pageNext = this.$(".page-next"), this.emUnitBenchmark = 16, this.isShown = !!this.$el.is(":visible"), this.progressBar = new ProgressBar({
                model: turningModel
            }), this.pagePortal = new PagePortal({
                model: turningModel
            }), this.$el.append(this.pagePortal.render().$el), config.get("isChapter") || (this.vent.on("turningNext:lastPage", function() {
                Toast.toast("没有下一页了")
            }), this.vent.on("turningPrev:firstPage", function() {
                Toast.toast("没有上一页了")
            }))
        },
        render: function() {
            browser.fitForMobile || this.progressBar.render(), this.trigger("view:render")
        },
        events: {
            "click .page-prev, .page-next": "pageTurningFromClick",
            "humanClick .page-prev, .page-next": "humanClickTurning"
        },
        togglePagingBtns: function(layout) {
            this.$el.find(".page-prev, .page-next").toggle("horizontal" === layout)
        },
        initPagination: function() {
            this.pagePortal.update()
        },
        updateProgressBar: function() {
            this.progressBar.update()
        },
        removeProgressBar: function() {
            this.progressBar.remove()
        },
        pageTurningFromClick: function(e) {
            var turningBtn = $(e.target),
                isPrev = turningBtn.hasClass("page-prev") ? 1 : 0;
            this.pageTurning(isPrev)
        },
        pageTurning: _.debounce(function(isPrev, options) {
            this.vent.trigger("goto:stamp");
            var turningModel = app.getModel("turning"),
                currPage = turningModel.get("currPage"),
                totalPage = turningModel.get("totalPage"),
                isLastPage = currPage === totalPage ? 1 : 0,
                isFirstPage = 1 === currPage ? 1 : 0,
                layout = this.config.get("layout");
            if (isPrev && isFirstPage) return this.vent.trigger("turningPrev:firstPage"), void 0;
            if (!isPrev && isLastPage) return this.vent.trigger("turningNext:lastPage"), void 0;
            "horizontal" === layout && turningModel.setCurrPage((isPrev ? -1 : 1) + currPage, options);
            var turningBtn = this.$(".page-" + (isPrev ? "prev" : "next"));
            turningBtn.addClass("on"), this.vent.once("unfreeze:canvas", _.bind(function() {
                turningBtn.removeClass("on")
            }, this))
        }, 150),
        humanClickTurning: function(e) {
            var target = $(e.target);
            target.trigger("mousedown").trigger("click").trigger("mouseup")
        },
        hide: function() {
            return this.isShown ? (this.isShown = !1, this.$el.hide(), void 0) : this
        },
        toggle: function() {
            return this.$el[this.isShown ? "hide" : "show"](), this.isShown = this.isShown ? !1 : !0, this
        }
    });
    return Pagination
}), define("../reader/views/modules/render_purchase_button", ["underscore", "reader/modules/browser", "reader/views/mixins/purchase_button"], function(_, browser, PurchaseButton) {
    function renderPurchaseButton(articleModel) {
        var purchaseButton = new PurchaseButton,
            articleData = articleModel.toJSON(),
            price_in_cent = 100 * articleModel.get("price"),
            article_store_url = "/ebook/" + articleModel.get("id") + "/",
            article_read_url = "/reader" + article_store_url,
            articleDataForButton = _.extend(articleData, {
                url: article_store_url,
                redirect_url: article_read_url,
                price: price_in_cent,
                is_large_btn: !0,
                is_hollow_btn: !1,
                is_subscribed: !0,
                is_mobile_direct_purchase: browser.fitForMobile,
                type: "ebook"
            });
        return purchaseButton.render({
            data: articleDataForButton
        })
    }
    return renderPurchaseButton
}), define("../reader/modules/template", ["underscore"], function(_) {
    function Presenter(data, methods) {
        this.data = data, _.extend(this, methods)
    }
    return function(templateString, data, presenter) {
        data = _.isArray(data) ? data : [data];
        var rendered = _.map(data, function(d) {
            return d.$item = new Presenter(d, presenter || {}), _.template(templateString, d)
        });
        return rendered.join("")
    }
}), define("../reader/views/mixins/rating_star", [], function() {
    return {
        rate: function(e) {
            e.preventDefault(), this.stars = this.parseStar(e.target), this.starsContext.setAttribute("data-stars", this.stars)
        },
        parseStar: function(elem) {
            return elem.getAttribute("data-star")
        },
        hoveringStar: function(e) {
            var stars = this.parseStar(e.target);
            this.displayStar(stars)
        },
        resumeStar: function() {
            this.displayStar(this.stars)
        },
        displayStar: function(stars) {
            var className = this.starsContext.className;
            this.starsContext.className = className.replace(/stars-\d+/g, "stars-" + stars)
        }
    }
}), define("../reader/views/common/panel/rating", ["backbone", "jquery", "reader/views/mixins/rating_star", "reader/modules/template"], function(Backbone, $, StarsMixin, tmpl) {
    var Rating = Backbone.View.extend({
        initialize: function() {
            this.model.on("change:rating", this.resumeStar, this)
        },
        template: $("#tmpl-rating").html(),
        events: {
            "mouseover .star-region": "hoveringStar",
            "mouseout .stars-context": "resumeStar",
            "click .star-region": "rate"
        },
        render: function() {
            return this.$el.html(tmpl(this.template, this.model.toJSON())), this.starsContext = this.$el.find(".stars-context").get(0), this.stars = this.starsContext.getAttribute("data-stars"), this
        }
    });
    return $.extend(Rating.prototype, StarsMixin), Rating
}), define("../reader/models/rating", ["backbone", "underscore"], function(Backbone) {
    var LIMIT_LENGTH = !1,
        Rating = Backbone.Model.extend({
            defaults: {
                rating: 0,
                articleId: 0,
                rated: !1,
                comment: ""
            },
            url: function() {
                var aid = this.get("articleId");
                return "/j/article_v2/" + aid + "/rating"
            },
            validate: function(attrs) {
                var max = 350,
                    rating = 0 | attrs.rating,
                    comment = $.trim(attrs.comment);
                return rating ? LIMIT_LENGTH && comment.length > max ? "评语最多能写 " + max + " 个字" : void 0 : "请先为作品打分"
            }
        });
    return Rating
}), define("../reader/views/common/panel/rating_form", ["backbone", "underscore", "jquery", "reader/app", "reader/models/rating", "../reader/views/common/panel/rating", "mod/form"], function(Backbone, _, $, app, RatingModel, RatingView, FormUtil) {
    var tmplComment = $("#tmpl-rating-comment").html(),
        tmplFormButtons = $("#tmpl-form-buttons").html(),
        RatingFormView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this, "cancelEditing"), this.app = app, this.editingMode = !1
            },
            template: $("#tmpl-rating-form").html(),
            render: function(articleId) {
                var rating = new RatingModel({
                    articleId: articleId
                });
                return rating.on("sync", function(model) {
                    this.editingMode = !1, this.renderForm(model), this.trigger("updated"), this.app.trigger("change:rating", model)
                }, this), rating.fetch({
                    success: _.bind(function(model) {
                        this.renderForm(model)
                    }, this)
                }), this.$el = $(_.template(this.template, {})), this
            },
            renderForm: function(rating) {
                this.renderRating(rating), this.renderComment(rating), this.renderFormButtons(rating), this.bindFormActions(rating), FormUtil.ctrlEnterForm(this.$el)
            },
            renderRating: function(rating) {
                var ratingView = new RatingView({
                    model: rating
                });
                rating.get("rated") && !this.editingMode && ratingView.undelegateEvents(), this.$el.find(".rating").html(ratingView.render().el)
            },
            renderComment: function(rating) {
                this.$el.find("#field-edit").html(_.template(tmplComment, {
                    rated: rating.get("rated"),
                    comment: rating.get("comment"),
                    editingMode: this.editingMode
                }))
            },
            renderFormButtons: function(rating) {
                this.$el.find(".form-actions").html(_.template(tmplFormButtons, {
                    rated: rating.get("rated"),
                    editingMode: this.editingMode
                }))
            },
            cancelEditing: function() {
                this.editingMode = !1, this.trigger("cancel")
            },
            bindFormActions: function(rating) {
                var self = this,
                    form = this.$el,
                    errorMessage = form.find(".validation-error"),
                    btnCancel = form.find(".btn-cancel"),
                    linkEdit = form.find(".link-edit");
                form.off("submit"), rating.on("invalid", function(model, msg) {
                    errorMessage.text(msg)
                }), btnCancel.on("click", function(e) {
                    e.preventDefault(), self.cancelEditing(rating)
                }), linkEdit.on("click", function(e) {
                    e.preventDefault(), self.editingMode = !0, self.renderForm(rating), self.trigger("updated")
                }), form.on("submit", function(e) {
                    e.preventDefault(), e.stopPropagation();
                    var comment = form.find("[name=comment]").val(),
                        stars = form.find("[data-stars]")[0].getAttribute("data-stars");
                    rating.set({
                        rated: !0,
                        rating: stars,
                        comment: comment
                    }, {
                        silent: !0
                    }), rating.save()
                })
            }
        });
    return RatingFormView
}), define("../reader/views/common/purchase_guide", ["backbone", "underscore", "jquery", "arkenv"], function(Backbone, _, $, arkenv) {
    var purchaseGuide = Backbone.View.extend({
        className: "purchase-guide",
        template: $("#tmpl-purchase-guide").html(),
        render: function(options) {
            var data = _.pick(options.model.toJSON(), "id", "price");
            return data.device = arkenv.ua.device, this.$el.html(_.template(this.template, data)), this
        }
    });
    return purchaseGuide
}), define("../reader/models/favor", ["backbone", "underscore", "mod/ajax"], function(Backbone, _, ajax) {
    var Favor = Backbone.Model.extend({
        defaults: {
            articleId: 0,
            liked: !1
        },
        url: function() {
            var aid = this.get("articleId");
            return "/j/article/" + aid + "/like"
        },
        toggleFavor: function() {
            var toLike = !this.get("liked"),
                method = toLike ? "post" : "delete";
            return this.set("liked", toLike), ajax({
                url: _.result(this, "url"),
                type: method
            }), this
        }
    });
    return Favor
});
var QRCode;
! function() {
    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE, this.data = data, this.parsedData = [];
        for (var i = 0, l = this.data.length; l > i; i++) {
            var byteArray = [],
                code = this.data.charCodeAt(i);
            code > 65536 ? (byteArray[0] = 240 | (1835008 & code) >>> 18, byteArray[1] = 128 | (258048 & code) >>> 12, byteArray[2] = 128 | (4032 & code) >>> 6, byteArray[3] = 128 | 63 & code) : code > 2048 ? (byteArray[0] = 224 | (61440 & code) >>> 12, byteArray[1] = 128 | (4032 & code) >>> 6, byteArray[2] = 128 | 63 & code) : code > 128 ? (byteArray[0] = 192 | (1984 & code) >>> 6, byteArray[1] = 128 | 63 & code) : byteArray[0] = code, this.parsedData.push(byteArray)
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData), this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
    }

    function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber, this.errorCorrectLevel = errorCorrectLevel, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
    }

    function QRPolynomial(num, shift) {
        if (void 0 == num.length) throw new Error(num.length + "/" + shift);
        for (var offset = 0; offset < num.length && 0 == num[offset];) offset++;
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
    }

    function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount, this.dataCount = dataCount
    }

    function QRBitBuffer() {
        this.buffer = [], this.length = 0
    }

    function _isSupportCanvas() {
        return "undefined" != typeof CanvasRenderingContext2D
    }

    function _getAndroid() {
        var android = !1,
            sAgent = navigator.userAgent;
        return /android/i.test(sAgent) && (android = !0, aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (android = parseFloat(aMat[1]))), android
    }

    function _getTypeNumber(sText, nCorrectLevel) {
        for (var nType = 1, length = _getUTF8Length(sText), i = 0, len = QRCodeLimitLength.length; len >= i; i++) {
            var nLimit = 0;
            switch (nCorrectLevel) {
                case QRErrorCorrectLevel.L:
                    nLimit = QRCodeLimitLength[i][0];
                    break;
                case QRErrorCorrectLevel.M:
                    nLimit = QRCodeLimitLength[i][1];
                    break;
                case QRErrorCorrectLevel.Q:
                    nLimit = QRCodeLimitLength[i][2];
                    break;
                case QRErrorCorrectLevel.H:
                    nLimit = QRCodeLimitLength[i][3]
            }
            if (nLimit >= length) break;
            nType++
        }
        if (nType > QRCodeLimitLength.length) throw new Error("Too long data");
        return nType
    }

    function _getUTF8Length(sText) {
        var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return replacedText.length + (replacedText.length != sText ? 3 : 0)
    }
    QR8bitByte.prototype = {
        getLength: function() {
            return this.parsedData.length
        },
        write: function(buffer) {
            for (var i = 0, l = this.parsedData.length; l > i; i++) buffer.put(this.parsedData[i], 8)
        }
    }, QRCodeModel.prototype = {
        addData: function(data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData), this.dataCache = null
        },
        isDark: function(row, col) {
            if (0 > row || this.moduleCount <= row || 0 > col || this.moduleCount <= col) throw new Error(row + "," + col);
            return this.modules[row][col]
        },
        getModuleCount: function() {
            return this.moduleCount
        },
        make: function() {
            this.makeImpl(!1, this.getBestMaskPattern())
        },
        makeImpl: function(test, maskPattern) {
            this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null
            }
            this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(test, maskPattern), this.typeNumber >= 7 && this.setupTypeNumber(test), null == this.dataCache && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, maskPattern)
        },
        setupPositionProbePattern: function(row, col) {
            for (var r = -1; 7 >= r; r++)
                if (!(-1 >= row + r || this.moduleCount <= row + r))
                    for (var c = -1; 7 >= c; c++) - 1 >= col + c || this.moduleCount <= col + c || (this.modules[row + r][col + c] = r >= 0 && 6 >= r && (0 == c || 6 == c) || c >= 0 && 6 >= c && (0 == r || 6 == r) || r >= 2 && 4 >= r && c >= 2 && 4 >= c ? !0 : !1)
        },
        getBestMaskPattern: function() {
            for (var minLostPoint = 0, pattern = 0, i = 0; 8 > i; i++) {
                this.makeImpl(!0, i);
                var lostPoint = QRUtil.getLostPoint(this);
                (0 == i || minLostPoint > lostPoint) && (minLostPoint = lostPoint, pattern = i)
            }
            return pattern
        },
        createMovieClip: function(target_mc, instance_name, depth) {
            var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth),
                cs = 1;
            this.make();
            for (var row = 0; row < this.modules.length; row++)
                for (var y = row * cs, col = 0; col < this.modules[row].length; col++) {
                    var x = col * cs,
                        dark = this.modules[row][col];
                    dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill())
                }
            return qr_mc
        },
        setupTimingPattern: function() {
            for (var r = 8; r < this.moduleCount - 8; r++) null == this.modules[r][6] && (this.modules[r][6] = 0 == r % 2);
            for (var c = 8; c < this.moduleCount - 8; c++) null == this.modules[6][c] && (this.modules[6][c] = 0 == c % 2)
        },
        setupPositionAdjustPattern: function() {
            for (var pos = QRUtil.getPatternPosition(this.typeNumber), i = 0; i < pos.length; i++)
                for (var j = 0; j < pos.length; j++) {
                    var row = pos[i],
                        col = pos[j];
                    if (null == this.modules[row][col])
                        for (var r = -2; 2 >= r; r++)
                            for (var c = -2; 2 >= c; c++) this.modules[row + r][col + c] = -2 == r || 2 == r || -2 == c || 2 == c || 0 == r && 0 == c ? !0 : !1
                }
        },
        setupTypeNumber: function(test) {
            for (var bits = QRUtil.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                var mod = !test && 1 == (1 & bits >> i);
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod
            }
            for (var i = 0; 18 > i; i++) {
                var mod = !test && 1 == (1 & bits >> i);
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
            }
        },
        setupTypeInfo: function(test, maskPattern) {
            for (var data = this.errorCorrectLevel << 3 | maskPattern, bits = QRUtil.getBCHTypeInfo(data), i = 0; 15 > i; i++) {
                var mod = !test && 1 == (1 & bits >> i);
                6 > i ? this.modules[i][8] = mod : 8 > i ? this.modules[i + 1][8] = mod : this.modules[this.moduleCount - 15 + i][8] = mod
            }
            for (var i = 0; 15 > i; i++) {
                var mod = !test && 1 == (1 & bits >> i);
                8 > i ? this.modules[8][this.moduleCount - i - 1] = mod : 9 > i ? this.modules[8][15 - i - 1 + 1] = mod : this.modules[8][15 - i - 1] = mod
            }
            this.modules[this.moduleCount - 8][8] = !test
        },
        mapData: function(data, maskPattern) {
            for (var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0, col = this.moduleCount - 1; col > 0; col -= 2)
                for (6 == col && col--;;) {
                    for (var c = 0; 2 > c; c++)
                        if (null == this.modules[row][col - c]) {
                            var dark = !1;
                            byteIndex < data.length && (dark = 1 == (1 & data[byteIndex] >>> bitIndex));
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            mask && (dark = !dark), this.modules[row][col - c] = dark, bitIndex--, -1 == bitIndex && (byteIndex++, bitIndex = 7)
                        }
                    if (row += inc, 0 > row || this.moduleCount <= row) {
                        row -= inc, inc = -inc;
                        break
                    }
                }
        }
    }, QRCodeModel.PAD0 = 236, QRCodeModel.PAD1 = 17, QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
        for (var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer, i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4), buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)), data.write(buffer)
        }
        for (var totalDataCount = 0, i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > 8 * totalDataCount) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + 8 * totalDataCount + ")");
        for (buffer.getLengthInBits() + 4 <= 8 * totalDataCount && buffer.put(0, 4); 0 != buffer.getLengthInBits() % 8;) buffer.putBit(!1);
        for (;;) {
            if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
            if (buffer.put(QRCodeModel.PAD0, 8), buffer.getLengthInBits() >= 8 * totalDataCount) break;
            buffer.put(QRCodeModel.PAD1, 8)
        }
        return QRCodeModel.createBytes(buffer, rsBlocks)
    }, QRCodeModel.createBytes = function(buffer, rsBlocks) {
        for (var offset = 0, maxDcCount = 0, maxEcCount = 0, dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length), r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount,
                ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount), maxEcCount = Math.max(maxEcCount, ecCount), dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount),
                rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1),
                modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
            }
        }
        for (var totalCodeCount = 0, i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
        for (var data = new Array(totalCodeCount), index = 0, i = 0; maxDcCount > i; i++)
            for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
        for (var i = 0; maxEcCount > i; i++)
            for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
        return data
    };
    for (var QRMode = {
            MODE_NUMBER: 1,
            MODE_ALPHA_NUM: 2,
            MODE_8BIT_BYTE: 4,
            MODE_KANJI: 8
        }, QRErrorCorrectLevel = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        }, QRMaskPattern = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7
        }, QRUtil = {
            PATTERN_POSITION_TABLE: [
                [],
                [6, 18],
                [6, 22],
                [6, 26],
                [6, 30],
                [6, 34],
                [6, 22, 38],
                [6, 24, 42],
                [6, 26, 46],
                [6, 28, 50],
                [6, 30, 54],
                [6, 32, 58],
                [6, 34, 62],
                [6, 26, 46, 66],
                [6, 26, 48, 70],
                [6, 26, 50, 74],
                [6, 30, 54, 78],
                [6, 30, 56, 82],
                [6, 30, 58, 86],
                [6, 34, 62, 90],
                [6, 28, 50, 72, 94],
                [6, 26, 50, 74, 98],
                [6, 30, 54, 78, 102],
                [6, 28, 54, 80, 106],
                [6, 32, 58, 84, 110],
                [6, 30, 58, 86, 114],
                [6, 34, 62, 90, 118],
                [6, 26, 50, 74, 98, 122],
                [6, 30, 54, 78, 102, 126],
                [6, 26, 52, 78, 104, 130],
                [6, 30, 56, 82, 108, 134],
                [6, 34, 60, 86, 112, 138],
                [6, 30, 58, 86, 114, 142],
                [6, 34, 62, 90, 118, 146],
                [6, 30, 54, 78, 102, 126, 150],
                [6, 24, 50, 76, 102, 128, 154],
                [6, 28, 54, 80, 106, 132, 158],
                [6, 32, 58, 84, 110, 136, 162],
                [6, 26, 54, 82, 110, 138, 166],
                [6, 30, 58, 86, 114, 142, 170]
            ],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(data) {
                for (var d = data << 10; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0;) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
                return (data << 10 | d) ^ QRUtil.G15_MASK
            },
            getBCHTypeNumber: function(data) {
                for (var d = data << 12; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0;) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
                return data << 12 | d
            },
            getBCHDigit: function(data) {
                for (var digit = 0; 0 != data;) digit++, data >>>= 1;
                return digit
            },
            getPatternPosition: function(typeNumber) {
                return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
            },
            getMask: function(maskPattern, i, j) {
                switch (maskPattern) {
                    case QRMaskPattern.PATTERN000:
                        return 0 == (i + j) % 2;
                    case QRMaskPattern.PATTERN001:
                        return 0 == i % 2;
                    case QRMaskPattern.PATTERN010:
                        return 0 == j % 3;
                    case QRMaskPattern.PATTERN011:
                        return 0 == (i + j) % 3;
                    case QRMaskPattern.PATTERN100:
                        return 0 == (Math.floor(i / 2) + Math.floor(j / 3)) % 2;
                    case QRMaskPattern.PATTERN101:
                        return 0 == i * j % 2 + i * j % 3;
                    case QRMaskPattern.PATTERN110:
                        return 0 == (i * j % 2 + i * j % 3) % 2;
                    case QRMaskPattern.PATTERN111:
                        return 0 == (i * j % 3 + (i + j) % 2) % 2;
                    default:
                        throw new Error("bad maskPattern:" + maskPattern)
                }
            },
            getErrorCorrectPolynomial: function(errorCorrectLength) {
                for (var a = new QRPolynomial([1], 0), i = 0; errorCorrectLength > i; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
                return a
            },
            getLengthInBits: function(mode, type) {
                if (type >= 1 && 10 > type) switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 10;
                    case QRMode.MODE_ALPHA_NUM:
                        return 9;
                    case QRMode.MODE_8BIT_BYTE:
                        return 8;
                    case QRMode.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + mode)
                } else if (27 > type) switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 12;
                    case QRMode.MODE_ALPHA_NUM:
                        return 11;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + mode)
                } else {
                    if (!(41 > type)) throw new Error("type:" + type);
                    switch (mode) {
                        case QRMode.MODE_NUMBER:
                            return 14;
                        case QRMode.MODE_ALPHA_NUM:
                            return 13;
                        case QRMode.MODE_8BIT_BYTE:
                            return 16;
                        case QRMode.MODE_KANJI:
                            return 12;
                        default:
                            throw new Error("mode:" + mode)
                    }
                }
            },
            getLostPoint: function(qrCode) {
                for (var moduleCount = qrCode.getModuleCount(), lostPoint = 0, row = 0; moduleCount > row; row++)
                    for (var col = 0; moduleCount > col; col++) {
                        for (var sameCount = 0, dark = qrCode.isDark(row, col), r = -1; 1 >= r; r++)
                            if (!(0 > row + r || row + r >= moduleCount))
                                for (var c = -1; 1 >= c; c++) 0 > col + c || col + c >= moduleCount || (0 != r || 0 != c) && dark == qrCode.isDark(row + r, col + c) && sameCount++;
                        sameCount > 5 && (lostPoint += 3 + sameCount - 5)
                    }
                for (var row = 0; moduleCount - 1 > row; row++)
                    for (var col = 0; moduleCount - 1 > col; col++) {
                        var count = 0;
                        qrCode.isDark(row, col) && count++, qrCode.isDark(row + 1, col) && count++, qrCode.isDark(row, col + 1) && count++, qrCode.isDark(row + 1, col + 1) && count++, (0 == count || 4 == count) && (lostPoint += 3)
                    }
                for (var row = 0; moduleCount > row; row++)
                    for (var col = 0; moduleCount - 6 > col; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
                for (var col = 0; moduleCount > col; col++)
                    for (var row = 0; moduleCount - 6 > row; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
                for (var darkCount = 0, col = 0; moduleCount > col; col++)
                    for (var row = 0; moduleCount > row; row++) qrCode.isDark(row, col) && darkCount++;
                var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                return lostPoint += 10 * ratio
            }
        }, QRMath = {
            glog: function(n) {
                if (1 > n) throw new Error("glog(" + n + ")");
                return QRMath.LOG_TABLE[n]
            },
            gexp: function(n) {
                for (; 0 > n;) n += 255;
                for (; n >= 256;) n -= 255;
                return QRMath.EXP_TABLE[n]
            },
            EXP_TABLE: new Array(256),
            LOG_TABLE: new Array(256)
        }, i = 0; 8 > i; i++) QRMath.EXP_TABLE[i] = 1 << i;
    for (var i = 8; 256 > i; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    for (var i = 0; 255 > i; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    QRPolynomial.prototype = {
        get: function(index) {
            return this.num[index]
        },
        getLength: function() {
            return this.num.length
        },
        multiply: function(e) {
            for (var num = new Array(this.getLength() + e.getLength() - 1), i = 0; i < this.getLength(); i++)
                for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
            return new QRPolynomial(num, 0)
        },
        mod: function(e) {
            if (this.getLength() - e.getLength() < 0) return this;
            for (var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)), num = new Array(this.getLength()), i = 0; i < this.getLength(); i++) num[i] = this.get(i);
            for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            return new QRPolynomial(num, 0).mod(e)
        }
    }, QRRSBlock.RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ], QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (void 0 == rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
        for (var length = rsBlock.length / 3, list = [], i = 0; length > i; i++)
            for (var count = rsBlock[3 * i + 0], totalCount = rsBlock[3 * i + 1], dataCount = rsBlock[3 * i + 2], j = 0; count > j; j++) list.push(new QRRSBlock(totalCount, dataCount));
        return list
    }, QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
        switch (errorCorrectLevel) {
            case QRErrorCorrectLevel.L:
                return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 0];
            case QRErrorCorrectLevel.M:
                return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 1];
            case QRErrorCorrectLevel.Q:
                return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 2];
            case QRErrorCorrectLevel.H:
                return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 3];
            default:
                return void 0
        }
    }, QRBitBuffer.prototype = {
        get: function(index) {
            var bufIndex = Math.floor(index / 8);
            return 1 == (1 & this.buffer[bufIndex] >>> 7 - index % 8)
        },
        put: function(num, length) {
            for (var i = 0; length > i; i++) this.putBit(1 == (1 & num >>> length - i - 1))
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(bit) {
            var bufIndex = Math.floor(this.length / 8);
            this.buffer.length <= bufIndex && this.buffer.push(0), bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8), this.length++
        }
    };
    var QRCodeLimitLength = [
            [17, 14, 11, 7],
            [32, 26, 20, 14],
            [53, 42, 32, 24],
            [78, 62, 46, 34],
            [106, 84, 60, 44],
            [134, 106, 74, 58],
            [154, 122, 86, 64],
            [192, 152, 108, 84],
            [230, 180, 130, 98],
            [271, 213, 151, 119],
            [321, 251, 177, 137],
            [367, 287, 203, 155],
            [425, 331, 241, 177],
            [458, 362, 258, 194],
            [520, 412, 292, 220],
            [586, 450, 322, 250],
            [644, 504, 364, 280],
            [718, 560, 394, 310],
            [792, 624, 442, 338],
            [858, 666, 482, 382],
            [929, 711, 509, 403],
            [1003, 779, 565, 439],
            [1091, 857, 611, 461],
            [1171, 911, 661, 511],
            [1273, 997, 715, 535],
            [1367, 1059, 751, 593],
            [1465, 1125, 805, 625],
            [1528, 1190, 868, 658],
            [1628, 1264, 908, 698],
            [1732, 1370, 982, 742],
            [1840, 1452, 1030, 790],
            [1952, 1538, 1112, 842],
            [2068, 1628, 1168, 898],
            [2188, 1722, 1228, 958],
            [2303, 1809, 1283, 983],
            [2431, 1911, 1351, 1051],
            [2563, 1989, 1423, 1093],
            [2699, 2099, 1499, 1139],
            [2809, 2213, 1579, 1219],
            [2953, 2331, 1663, 1273]
        ],
        svgDrawer = function() {
            var Drawing = function(el, htOption) {
                this._el = el, this._htOption = htOption
            };
            return Drawing.prototype.draw = function(oQRCode) {
                function makeSVG(tag, attrs) {
                    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                    for (var k in attrs) attrs.hasOwnProperty(k) && el.setAttribute(k, attrs[k]);
                    return el
                }
                var _htOption = this._htOption,
                    _el = this._el,
                    nCount = oQRCode.getModuleCount();
                Math.floor(_htOption.width / nCount), Math.floor(_htOption.height / nCount), this.clear();
                var svg = makeSVG("svg", {
                    viewBox: "0 0 " + String(nCount) + " " + String(nCount),
                    width: "100%",
                    height: "100%",
                    fill: _htOption.colorLight
                });
                svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), _el.appendChild(svg), svg.appendChild(makeSVG("rect", {
                    fill: _htOption.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
                for (var row = 0; nCount > row; row++)
                    for (var col = 0; nCount > col; col++)
                        if (oQRCode.isDark(row, col)) {
                            var child = makeSVG("use", {
                                x: String(row),
                                y: String(col)
                            });
                            child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), svg.appendChild(child)
                        }
            }, Drawing.prototype.clear = function() {
                for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
            }, Drawing
        }(),
        useSVG = "svg" === document.documentElement.tagName.toLowerCase(),
        Drawing = useSVG ? svgDrawer : _isSupportCanvas() ? function() {
            function _onMakeImage() {
                this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", this._elCanvas.style.display = "none"
            }

            function _safeSetDataURI(fSuccess, fFail) {
                var self = this;
                if (self._fFail = fFail, self._fSuccess = fSuccess, null === self._bSupportDataURI) {
                    var el = document.createElement("img"),
                        fOnError = function() {
                            self._bSupportDataURI = !1, self._fFail && _fFail.call(self)
                        },
                        fOnSuccess = function() {
                            self._bSupportDataURI = !0, self._fSuccess && self._fSuccess.call(self)
                        };
                    return el.onabort = fOnError, el.onerror = fOnError, el.onload = fOnSuccess, el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", void 0
                }
                self._bSupportDataURI === !0 && self._fSuccess ? self._fSuccess.call(self) : self._bSupportDataURI === !1 && self._fFail && self._fFail.call(self)
            }
            if (this._android && this._android <= 2.1) {
                var factor = 1 / window.devicePixelRatio,
                    drawImage = CanvasRenderingContext2D.prototype.drawImage;
                CanvasRenderingContext2D.prototype.drawImage = function(image, sx, sy, sw, sh, dx, dy, dw) {
                    if ("nodeName" in image && /img/i.test(image.nodeName))
                        for (var i = arguments.length - 1; i >= 1; i--) arguments[i] = arguments[i] * factor;
                    else "undefined" == typeof dw && (arguments[1] *= factor, arguments[2] *= factor, arguments[3] *= factor, arguments[4] *= factor);
                    drawImage.apply(this, arguments)
                }
            }
            var Drawing = function(el, htOption) {
                this._bIsPainted = !1, this._android = _getAndroid(), this._htOption = htOption, this._elCanvas = document.createElement("canvas"), this._elCanvas.width = htOption.width, this._elCanvas.height = htOption.height, el.appendChild(this._elCanvas), this._el = el, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, this._elImage = document.createElement("img"), this._elImage.style.display = "none", this._el.appendChild(this._elImage), this._bSupportDataURI = null
            };
            return Drawing.prototype.draw = function(oQRCode) {
                var _elImage = this._elImage,
                    _oContext = this._oContext,
                    _htOption = this._htOption,
                    nCount = oQRCode.getModuleCount(),
                    nWidth = _htOption.width / nCount,
                    nHeight = _htOption.height / nCount,
                    nRoundedWidth = Math.round(nWidth),
                    nRoundedHeight = Math.round(nHeight);
                _elImage.style.display = "none", this.clear();
                for (var row = 0; nCount > row; row++)
                    for (var col = 0; nCount > col; col++) {
                        var bIsDark = oQRCode.isDark(row, col),
                            nLeft = col * nWidth,
                            nTop = row * nHeight;
                        _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight, _oContext.lineWidth = 1, _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight, _oContext.fillRect(nLeft, nTop, nWidth, nHeight), _oContext.strokeRect(Math.floor(nLeft) + .5, Math.floor(nTop) + .5, nRoundedWidth, nRoundedHeight), _oContext.strokeRect(Math.ceil(nLeft) - .5, Math.ceil(nTop) - .5, nRoundedWidth, nRoundedHeight)
                    }
                this._bIsPainted = !0
            }, Drawing.prototype.makeImage = function() {
                this._bIsPainted && _safeSetDataURI.call(this, _onMakeImage)
            }, Drawing.prototype.isPainted = function() {
                return this._bIsPainted
            }, Drawing.prototype.clear = function() {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1
            }, Drawing.prototype.round = function(nNumber) {
                return nNumber ? Math.floor(1e3 * nNumber) / 1e3 : nNumber
            }, Drawing
        }() : function() {
            var Drawing = function(el, htOption) {
                this._el = el, this._htOption = htOption
            };
            return Drawing.prototype.draw = function(oQRCode) {
                for (var _htOption = this._htOption, _el = this._el, nCount = oQRCode.getModuleCount(), nWidth = Math.floor(_htOption.width / nCount), nHeight = Math.floor(_htOption.height / nCount), aHTML = ['<table style="border:0;border-collapse:collapse;">'], row = 0; nCount > row; row++) {
                    aHTML.push("<tr>");
                    for (var col = 0; nCount > col; col++) aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + "px;height:" + nHeight + "px;background-color:" + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
                    aHTML.push("</tr>")
                }
                aHTML.push("</table>"), _el.innerHTML = aHTML.join("");
                var elTable = _el.childNodes[0],
                    nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2,
                    nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
                nLeftMarginTable > 0 && nTopMarginTable > 0 && (elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px")
            }, Drawing.prototype.clear = function() {
                this._el.innerHTML = ""
            }, Drawing
        }();
    QRCode = function(el, vOption) {
        if (this._htOption = {
                width: 256,
                height: 256,
                typeNumber: 4,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRErrorCorrectLevel.H
            }, "string" == typeof vOption && (vOption = {
                text: vOption
            }), vOption)
            for (var i in vOption) this._htOption[i] = vOption[i];
        "string" == typeof el && (el = document.getElementById(el)), this._android = _getAndroid(), this._el = el, this._oQRCode = null, this._oDrawing = new Drawing(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text)
    }, QRCode.prototype.makeCode = function(sText) {
        this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(sText), this._oQRCode.make(), this._el.title = sText, this._oDrawing.draw(this._oQRCode), this.makeImage()
    }, QRCode.prototype.makeImage = function() {
        "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
    }, QRCode.prototype.clear = function() {
        this._oDrawing.clear()
    }, QRCode.CorrectLevel = QRErrorCorrectLevel
}(), define("qrcode", [], function() {}), define("mod/template", ["mod/lang"], function(_) {
        _ = _ || Ark._;
        var escapes = {
            "\\": "\\",
            "'": "'",
            r: "\r",
            n: "\n",
            t: "  ",
            u2028: "\u2028",
            u2029: "\u2029"
        };
        for (var p in escapes) escapes[escapes[p]] = p;
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
            unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g,
            unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape]
                })
            },
            template = function(text, data, settings) {
                settings = _.extend(settings || {}, {
                    evaluate: /\{\{([\s\S]+?)\}\}/g,
                    interpolate: /\{\{=([\s\S]+?)\}\}/g,
                    escape: /\{\{-([\s\S]+?)\}\}/g
                });
                var source = "__p+='" + text.replace(escaper, function(match) {
                    return "\\" + escapes[match]
                }).replace(settings.escape, function(match, code) {
                    return "'+\n_.escape(" + unescape(code) + ")+\n'"
                }).replace(settings.interpolate, function(match, code) {
                    return "'+\n(" + unescape(code) + ")+\n'"
                }).replace(settings.evaluate, function(match, code) {
                    return "';\n" + unescape(code) + "\n;__p+='"
                }) + "';\n";
                settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";
                var render = new Function(settings.variable || "obj", "_", source);
                if (data) return render(data, _);
                var tmpl = function(data) {
                    return render.call(this, data, _)
                };
                return tmpl.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", tmpl
            };
        return template
    }), define("widget/sharebuttons/base", ["mod/url", "mod/template"], function(urlUtil, template) {
        function gaUrlWrapper(url, snsOption, shareOptions) {
            if (shareOptions.ga) {
                var params = $.extend({}, shareOptions.ga);
                params.dcm = snsOption.id, url = urlUtil.addParam(url, params)
            }
            return url
        }

        function ShareButtons(options, snsOptions) {
            this.options = $.extend({}, defaults, options), this.snsOptions = $.extend(!0, {}, snsDefaults, snsOptions), this.init()
        }
        var snsDefaults = {
                douban: {
                    id: "douban",
                    label: "豆瓣",
                    popup: {
                        width: 660,
                        height: 400
                    },
                    className: "rec-douban",
                    urlTmpl: "http://www.douban.com/share/service?bm=1&sel=222&image={{= encodeURIComponent(imageUrl)}}&href={{= encodeURIComponent(url)}}&name={{= encodeURIComponent(title)}}&text={{= encodeURIComponent(desc)}}"
                },
                doubanDialog: {
                    id: "douban-dialog",
                    label: "豆瓣",
                    className: "rec-douban-dialog"
                },
                qqim: {
                    id: "qqim",
                    label: "QQ好友",
                    popup: {
                        width: 1e3,
                        height: 760
                    },
                    className: "rec-qqim",
                    urlTmpl: 'http://connect.qq.com/widget/shareqq/index.html?site={{= encodeURIComponent("豆瓣")}}&url={{= encodeURIComponent(url)}}&desc={{= encodeURIComponent(title)}}&pics={{= encodeURIComponent(imageUrl)}}'
                },
                qzone: {
                    id: "qzone",
                    label: "QQ空间",
                    className: "rec-qzone",
                    urlTmpl: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{= encodeURIComponent(url)}}"
                },
                weibo: {
                    id: "weibo",
                    label: "新浪微博",
                    className: "rec-weibo",
                    apiKey: "3015934887",
                    popup: {
                        width: 650,
                        height: 400
                    },
                    urlTmpl: "http://v.t.sina.com.cn/share/share.php?appkey={{= encodeURIComponent(self.apiKey)}}&url={{= encodeURIComponent(url)}}&title={{= encodeURIComponent(title)}}&pic={{= encodeURIComponent(imageUrl)}}&sourceUrl=&content=utf-8"
                },
                tencent: {
                    id: "tencent",
                    label: "腾讯微博",
                    className: "rec-tencent",
                    apiKey: "1459b2ac3d2345d2a17396eec5ad3bd7",
                    popup: {
                        width: 658,
                        height: 352
                    },
                    urlTmpl: "http://v.t.qq.com/share/share.php?appkey={{= encodeURIComponent(self.apiKey)}}&url={{= encodeURIComponent(url)}}&title={{= encodeURIComponent(title)}}&pic={{= encodeURIComponent(imageUrl)}}"
                },
                renren: {
                    id: "renren",
                    label: "人人网",
                    className: "rec-renren",
                    popup: {
                        width: 1e3,
                        height: 760
                    },
                    urlTmpl: "http://widget.renren.com/dialog/share?title={{= encodeURIComponent(title)}}&srcUrl={{= encodeURIComponent(url)}}&resourceUrl={{= encodeURIComponent(url)}}&pic={{= encodeURIComponent(imageUrl)}}&description={{= encodeURIComponent(desc)}}"
                }
            },
            defaults = {
                wrapperSel: ".share-buttons",
                wrapper: void 0,
                title: "#豆瓣阅读#",
                desc: "",
                url: location.href,
                imageUrl: "http://s.doubanio.com/ark/pics/weixin_cover.jpg",
                ga: {
                    dcs: "not-set"
                },
                urlWrapper: gaUrlWrapper
            };
        return $.extend(ShareButtons.prototype, {
            snsDefaults: snsDefaults,
            init: function() {
                this.wrapper = this.options.wrapper || $(this.options.wrapperSel);
                for (var key in this.snsOptions) {
                    var snsOption = this.snsOptions[key];
                    if (snsOption) {
                        var btn = this.wrapper.find("." + snsOption.className);
                        btn.length && (this.renderButton(btn, snsOption), this.bindButton(btn, snsOption))
                    }
                }
            },
            renderButton: function(btn, snsOption) {
                var shareData = $.extend({
                    self: snsOption
                }, this.options);
                this.options.urlWrapper && (shareData.url = this.options.urlWrapper(shareData.url, snsOption, this.options)), snsOption.urlTmpl && (snsOption.url = template(snsOption.urlTmpl, shareData)), snsOption.onClickify && (snsOption.onClick = snsOption.onClickify(shareData, snsOption)), btn.data("options", snsOption)
            },
            bindButton: function(btn, snsOption) {
                var self = this;
                btn.on("click", function(e) {
                    return self.options.ga && ga("send", "event", snsOption.id + "-share", "click", decodeURIComponent(urlUtil.addParam("", self.options.ga))), snsOption.url ? self.openWindow(btn, snsOption) : snsOption.onClick ? snsOption.onClick.call(this, e, snsOption) : void 0
                })
            },
            openWindow: function(btn, snsOption) {
                function open() {
                    window.open(snsOption.url, "sns_share" + +new Date, windowFeatures)
                }
                var popup = snsOption.popup || {},
                    width = popup.width || 440,
                    height = popup.height || 430,
                    top = (screen.height - height) / 2,
                    left = (screen.width - width) / 2,
                    windowFeatures = ["toolbar=0", "status=0", "resizable=1", "width=" + width, "height=" + height, "left=" + left, "top=" + top].join(",");
                /firefox/.test(navigator.userAgent) ? setTimeout(open, 0) : open()
            }
        }), ShareButtons.addSnsOption = function(snsOption) {
            $.extend(!0, snsDefaults, snsOption)
        }, ShareButtons
    }), define("ui/dialog_new", ["jquery", "ui/overlay", "mod/emitter"], function($, overlay, Emitter) {
        function Dialog(opts) {
            Emitter.call(this);
            var self = this;
            this.opts = opts, this.el = $(tmpl), this.text = this.el.find(".k-text"), this.head = this.el.find(".dialog-hd"), this.buttons = this.el.find(".k-buttons"), this.btnClose = this.el.find(".k-close"), this.closable = void 0 !== opts.closable ? !!opts.closable : !0, this.overlay = overlay({
                closable: this.closable
            }), this.render(), doc.on("click.close", ".k-close", function() {
                self.close()
            }), this.el.on("click.confirm", "[data-confirm]", function(e) {
                var action = !!$(e.currentTarget).data("confirm");
                self.emit(action ? "confirm" : "cancel"), action || self.close()
            }), this.overlay.on("close", function() {
                self.emit("close")
            })
        }

        function exports(opts) {
            return opts = opts || {}, new exports.Dialog(opts)
        }
        var tmpl = '<div id="ark-dialog"><div class="dialog-hd"><a href="#" class="k-close">&times;</a></div><div class="dialog-bd"><div class="k-text"></div><div class="k-buttons"></div></div></div>',
            tmplBtns = '<button class="btn btn-large" data-confirm="1">确定</button><button class="btn btn-minor btn-large" data-confirm="0">取消</button>',
            doc = $(document);
        return $.extend(Dialog.prototype, {
            render: function() {
                var title = this.opts.title,
                    foot = this.opts.foot;
                this.text.html(this.opts.content), this.closable || this.btnClose.remove(), title && this.setTitle(title), foot && this.setFoot(foot), this.setButtons(), this.overlay.setBody(this.el)
            },
            setTitle: function(title) {
                return this.head.prepend($("<span>", {
                    "class": "k-title",
                    text: title
                })), this
            },
            setFoot: function(content) {
                return this.el.append($("<div>", {
                    "class": "dialog-ft",
                    html: content
                })), this
            },
            setButtons: function(config) {
                config = config || [];
                var type = this.opts.type,
                    btnText = ["确定", "取消"],
                    btnNum = config.length;
                if (/confirm|tips/i.test(type)) {
                    this.buttons[0].innerHTML = tmplBtns;
                    for (var buttons = this.buttons.find("button"), i = 0; btnNum > i; i++) buttons.eq(i).text(config[i].text || btnText[i]).addClass(config[i]["class"] || "");
                    "tips" === type && $(buttons[1]).remove()
                }
                return "custom" === type && (this.buttons[0].innerHTML = config), this
            },
            getBody: function() {
                return this.overlay.getContentElement()
            },
            addClass: function(name) {
                return this.el.addClass(name), this
            },
            open: function() {
                return this.overlay.open(), this.emit("open"), this
            },
            close: function(silent) {
                return this.el.off(".confirm"), this.overlay.close(silent), this
            }
        }), Emitter(Dialog.prototype), exports.Dialog = Dialog, exports
    }), define("widget/sharebuttons/index", ["ui/dialog_new", "widget/sharebuttons/base", "qrcode"], function(dialog, ShareButtons) {
        function wechatQrDialogOnClickify(shareData, snsOption) {
            var wechatDialogEl = $(wechatDialogTmpl),
                qrContainer = wechatDialogEl.find(".qr-container");
            return new window.QRCode(qrContainer[0], {
                    text: shareData.url,
                    width: 200,
                    height: 200
                }), qrContainer.find("table").css("margin", "auto"),
                function() {
                    return dialog({
                        title: snsOption.label,
                        content: wechatDialogEl
                    }).addClass("wechat-qrcode-dialog").open()
                }
        }
        var wechatDialogTmpl = $("#tmpl-wechat-share").html();
        return ShareButtons.addSnsOption({
            wechat: {
                id: "wechat",
                label: "分享到微信",
                className: "rec-wechat",
                onClickify: wechatQrDialogOnClickify
            }
        }), ShareButtons
    }), define("../reader/views/reading/modules/custom_section", ["jquery", "underscore", "arkenv", "reader/app", "reader/modules/browser", "widget/sharebuttons/index", "reader/models/favor", "reader/views/common/purchase_guide", "reader/views/common/panel/rating_form", "reader/views/modules/render_purchase_button"], function($, _, arkenv, app, browser, ShareButtons, Favor, PurchaseGuide, RatingFormView, renderPurchaseButton) {
        var purchaseGuide = new PurchaseGuide;
        return {
            appendSharingButtons: function(customSection, articleModel) {
                if (customSection.length && !customSection.find(".share-buttons").length) {
                    var tmplSharingButtons = $("#tmpl-sharing-buttons").html(),
                        isColumnForDesktop = "c" === arkenv.works.type && !browser.fitForMobile;
                    if (isColumnForDesktop && !arkenv.me.isAnonymous) {
                        customSection.append($("<a></a>", {
                            id: "like-it",
                            text: "喜欢",
                            href: "#"
                        }));
                        var favorModel = new Favor({
                                articleId: articleModel.get("id")
                            }),
                            favorBtn = customSection.find("#like-it");
                        favorModel.on("change:liked", function(model, liked) {
                            favorBtn.toggleClass("liked", !!liked)
                        }).fetch(), favorBtn.click(function() {
                            favorModel.toggleFavor()
                        })
                    }
                    customSection.append(_.template(tmplSharingButtons, {
                        size: "large"
                    }));
                    var urlPath = (app.getModel("config").get("isChapter") ? "reader/" : "") + app.router.getBookUrl({
                        ignoreSearch: !0
                    });
                    new ShareButtons({
                        title: articleModel.get("title"),
                        imageUrl: articleModel.get("cover_url"),
                        desc: articleModel.get("abstract"),
                        url: location.protocol + "//" + location.host + "/" + urlPath,
                        ga: {
                            dcs: "read-reader"
                        }
                    })
                }
            },
            appendRatingSection: function(customSection, articleModel) {
                if (customSection.length && !customSection.find(".rating-form").length) {
                    var ratingForm = new RatingFormView,
                        elRatingForm = ratingForm.render(articleModel.get("id")).$el;
                    customSection.append(elRatingForm)
                }
            },
            appendReviewsLink: function(customSection, articleModel, reviewsModel) {
                function update(value) {
                    reviewsLink.find("a").toggle(!!value).text(value)
                }
                var reviewsLink = customSection.find(".reviews-link");
                customSection.length && !reviewsLink.length && (reviewsLink = $("<div>", {
                    "class": "reviews-link"
                }), reviewsLink.html($("<a>", {
                    href: app.router.getReviewsUrl()
                })), customSection.append(reviewsLink), update(reviewsModel.get("n_reviews")), reviewsModel.on("change:n_reviews", update))
            },
            appendPurchaseGuide: function(customSection, articleModel) {
                var sampleSection = customSection.find(".sample-text");
                customSection.length && !sampleSection.length && (sampleSection = $("<div>", {
                    "class": "sample-text"
                }), customSection.append(sampleSection), sampleSection.html(purchaseGuide.render({
                    model: articleModel
                }).el), _.delay(function() {
                    app.utils.applyPurchaseWithIn("[data-widget=faster-purchase]", ".purchase-guide")
                }, 0), sampleSection.find(".purchase-section").html(renderPurchaseButton(articleModel).$el))
            }
        }
    }), define("../widget/typeset/view", ["underscore"], function(_) {
        function Typeset(options) {
            this.partConvert = new PartConvert(_.extend({
                typeset: this
            }, options))
        }

        function PartConvert(options) {
            this.typeset = options.typeset, options.autoSpacing && (this.plaintext = function(text) {
                return rHasEn.test(text) && (text = text.replace(rEnAfterCjk, "$1 $2").replace(rCjkAfterEn, "$1 $2")), _.escape(text)
            })
        }
        var eachTuple = function(tuples, func, context) {
            _.each(tuples, function(tuple) {
                func.apply(this, tuple)
            }, context || this)
        };
        Typeset.MakeInlineStyle = {};
        var cjkGroup = "([぀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿])",
            enGroup = "([a-z0-9])",
            rCjkAfterEn = new RegExp(enGroup + cjkGroup, "ig"),
            rEnAfterCjk = new RegExp(cjkGroup + enGroup, "ig"),
            rHasEn = /[a-z0-9]/i;
        return _.extend(PartConvert.prototype, {
            plaintext: function(text) {
                return _.escape(text)
            },
            code: function(text) {
                return (/webkit/i.test(navigator.userAgent) ? "<wbr>" : "") + '<code class="code-inline">' + _.escape(text) + "</code>"
            },
            footnote: function(content, transableKinds) {
                return transableKinds && (transableKinds = _.intersection(transableKinds, ["emphasize"])), transableKinds && transableKinds.length || (transableKinds = ["emphasize"]), '<sup><span class="sup-content">' + this.typeset.convertParts(content, transableKinds) + "</span></sup>"
            },
            latex: function(content) {
                return '<span class="mathjax-container">\\(' + _.escape(content) + "\\)</span>"
            }
        }), eachTuple([
            ["regular_script", "i", "regularscript"],
            ["strikethrough", "del"],
            ["emphasize", "em"]
        ], function(methodName, tagName, tagClassName) {
            tagClassName || (tagClassName = methodName);
            var tagOpenHtml = _.template('<{{- tagName}} class="{{- tagClassName}}">', {
                    tagName: tagName,
                    tagClassName: tagClassName
                }),
                tagCloseHtml = _.template("</{{- tagName}}>", {
                    tagName: tagName
                });
            PartConvert.prototype[methodName] = function(content, transableKinds) {
                return tagOpenHtml + this.typeset.convertParts(content, transableKinds) + tagCloseHtml
            }, Typeset.MakeInlineStyle[tagName] = function(html) {
                return tagOpenHtml + html + tagCloseHtml
            }
        }), _.extend(Typeset.prototype, {
            convertParts: function(parts, transableKinds) {
                return this.convertIterator(parts, function(part) {
                    return transableKinds && !_.contains(transableKinds, part.kind) ? this.convertOnlyText(part) : this.partConvert[part.kind](part.content, transableKinds)
                }, this)
            },
            convertOnlyText: function(parts) {
                return this.convertIterator(parts, function(part) {
                    return _.isString(part.content) ? this.partConvert.plaintext(part.content) : this.convertOnlyText(part.content)
                }, this)
            },
            convertIterator: function(parts, func, context) {
                return context = context || this, _.isString(parts) ? context.partConvert.plaintext(parts) : (_.isUndefined(parts.kind) || (parts = [parts]), _(parts).map(function(part) {
                    return func.call(context, part)
                }).join(""))
            },
            transformLegend: function(illus) {
                var illusData = illus.data;
                _.each(["legend", "full_legend"], function(attr) {
                    _.isUndefined(illusData[attr]) || (_.isString(illusData[attr]) ? illusData[attr] = this.partConvert.plaintext(illusData[attr]) : _.isArray(illusData[attr]) && (illusData[attr] = this.convertParts(illusData[attr][0].data.text)))
                }, this)
            },
            transformParas: function(paras) {
                return _.isArray(paras) || (paras = [paras]), _.each(paras, function(para) {
                    var paraData = para.data;
                    para.data && ("illus" === para.type ? this.transformLegend(para) : _.isUndefined(paraData.text) || (paraData.text = this.convertParts(para.data.text)))
                }, this), paras
            }
        }), Typeset
    }), define("../reader/modules/split_to_span", ["jquery", "underscore", "widget/typeset/view", "mod/detector"], function($, _, Typeset, detector) {
        function splitToSpan(text) {
            var fragment = $("<div>").html(text),
                offset = 0;
            return getChildSplitText(fragment[0], offset).html
        }

        function getChildSplitText(root, offset) {
            for (var node, textLength, text, textNode, ret = "", result = {}, nodes = root.childNodes, length = nodes.length, index = 0; length > index;) node = nodes[index], $.nodeName(node, "span") && rMath.test(node.className) ? (textNode = node.getElementsByTagName("script")[0], text = textNode.textContent || $.trim(textNode.innerHTML), textLength = text.length, ret += utils.makeWord(node.innerHTML, offset, textLength), index += 1, offset += textLength) : (result = splitNode(node, offset), ret += result.html, offset = result.offset, index++);
            return {
                html: ret,
                offset: offset
            }
        }

        function splitNode(n, offset) {
            var result, nodeName = n.nodeName.toLowerCase();
            if (3 === n.nodeType) return result = getSplitText(n, offset), {
                html: result.html,
                offset: result.offset
            };
            if (1 !== n.nodeType) throw "nodetype error";
            if (-1 !== _.indexOf(IGNORE_SPLIT_TAGS, nodeName)) return {
                html: n.outerHTML,
                offset: offset
            };
            if ("code" === nodeName) {
                var text = n.textContent || $.trim(n.innerHTML),
                    length = text.length;
                return {
                    html: utils.makeWord(n.outerHTML, offset, length),
                    offset: offset + length
                }
            }
            return -1 !== _.indexOf(SPLIT_TAGS, nodeName) ? (result = getChildSplitText(n, offset), {
                html: Typeset.MakeInlineStyle[nodeName](result.html),
                offset: result.offset
            }) : void 0
        }

        function getSplitText(node, offset) {
            var processor = new SplitProcessor(node, offset);
            return processor.getResult()
        }
        var utils = {
                makeWord: function(html, offset, length) {
                    return '<span class="word" data-length="' + length + '" data-offset="' + offset + '">' + html + "</span>"
                },
                rTwoSpanEnd: /<\/span><\/span>$/
            },
            IGNORE_SPLIT_TAGS = ["sup", "wbr"],
            SPLIT_TAGS = ["em", "i", "del"],
            rMath = /mathjax-container/,
            SplitProcessor = function(node, offset) {
                this.contents = [], this.types = [], this.step = -1, this.offset = offset, this.iterator = new WordIterator(node)
            };
        SplitProcessor.prototype.doIterator = function() {
            var func = function() {
                this.generatorSpan()
            };
            return detector.hasBadChineseLineBreak() && (func = function() {
                this.detectChinesePunctuation(), this.generatorSpan()
            }), func
        }(), SplitProcessor.prototype.detectChinesePunctuation = function() {
            var token = this.token,
                type = token.type;
            this.step < 0 && "en" !== type || (this.advanceIsWord() && this.currentIsType(["punc-not-allowed-at-end", "punc-not-allowed-start-and-end"]) && (type = "word"), this.step < 1 && this.advanceIsType("punc-not-allowed-start-and-end") || type in this.typeHandler && this.typeHandler[type].call(this))
        }, SplitProcessor.prototype.typeHandler = {
            "punc-not-allowed-at-start": function() {
                this.currentIsWord() ? this.autoWbr() : this.step >= 1 && this.currentIsType(["punc-not-allowed-at-start", "punc-not-allowed-start-and-end"]) && this.currentIsWbred() && this.insertToPrevWbr()
            },
            "punc-not-allowed-start-and-end": function() {
                this.autoWbr()
            },
            en: function() {
                var token = this.token;
                token.word.length <= 1 || (token.html = (this.currentIsType("space") ? "" : "<wbr>") + token.html.replace('class="word"', 'class="en word"'))
            },
            word: function() {
                this.autoWbr()
            },
            "punc-not-allowed-break": function() {
                this.currentIsType("punc-not-allowed-break") && this.autoWbr()
            }
        }, SplitProcessor.prototype.currentIsWord = function() {
            return this.isWord(this.types[this.step])
        }, SplitProcessor.prototype.currentIsType = function(types) {
            return this.isType(this.types[this.step], types)
        }, SplitProcessor.prototype.currentIsWbred = function() {
            return utils.rTwoSpanEnd.test(this.contents[this.step])
        }, SplitProcessor.prototype.advanceIsWord = function() {
            return this.isWord(this.token.type)
        }, SplitProcessor.prototype.advanceIsType = function(types) {
            return this.isType(this.token.type, types)
        }, SplitProcessor.prototype.isType = function(currentType, types) {
            return _.isArray(types) ? _.contains(types, currentType) : types === currentType
        }, SplitProcessor.prototype.isWord = function(type) {
            return "cjk" === type || "en" === type
        }, SplitProcessor.prototype.generatorSpan = function() {
            var token = this.token;
            this.types.push(token.type), this.contents.push(token.html), this.step++
        }, SplitProcessor.prototype.autoWbr = function() {
            "space" !== this.types[this.step] && this[this.currentIsWbred() ? "insertToPrevWbr" : "wrapWbr"]()
        }, SplitProcessor.prototype.wrapWbr = function() {
            this.contents[this.step] = '<span class="wbr">' + this.contents[this.step], this.token.html = this.token.html + "</span>"
        }, SplitProcessor.prototype.insertToPrevWbr = function() {
            this.contents[this.step] = this.contents[this.step].slice(0, -7), this.token.html += "</span>"
        }, SplitProcessor.prototype.getResult = function() {
            for (; this.iterator.hasNext();) {
                this.token = this.iterator.next();
                var word = this.token.word,
                    wordLength = word.length;
                this.token.html = utils.makeWord(_.escape(word), this.offset, wordLength), this.doIterator(), this.offset += wordLength
            }
            return {
                html: this.contents.join(""),
                offset: this.offset
            }
        };
        var WordIterator = function(node) {
            this.node = node, this.current = null, this.value = node.nodeValue, this.length = node.length, this.index = 0
        };
        return _.extend(WordIterator.prototype, {
            rPuncNotAllowedAtStart: /[\!%\),\.:;\?\]\}¢°’”‟›℃∶、。》〕〗〞﹚﹜！％），．：；？］｝]/,
            rPuncNotAllowedAtEnd: /[$(£¥﹙﹛《〈「『〔〖〝＄（．［｛￡￥]/,
            rPuncNotAllowedBreak: /[—…‥]/,
            rPuncNotAllowedStartAndEnd: /[“”‘’'"]/,
            rEnPunc: /[\x21-\x23\x25-\x2A\x2C-\x2F\x3A\x3B\x3F\x40\x5B-\x5D\x5F\x7B\x7D\xA1\xAB\xAD\xB7\xBB\xBF\u0374\u0375\u037E\u0387\u055A-\u055F\u0589\u05BE\u05C0\u05C3\u05F3\u05F4\u060C\u061B\u061F\u066A-\u066D\u06D4\u0964\u0965\u0970\u0E2F\u0E5A\u0E5B\u0EAF\u0F04-\u0F12\u0F3A-\u0F3D\u0F85\u10FB\u2010-\u2027\u2030-\u2043\u2045\u2046\u207D\u207E\u208D\u208E\u2329\u232A\u3001-\u3003\u3006\u3008-\u3011\u3014-\u301F\u3030\u30FB\uFD3E\uFD3F\uFE30-\uFE44\uFE49-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF61-\uFF65]/,
            rIgnorePunc: /[「\《\[\（\(\)\）\]\》」]/,
            hasNext: function() {
                return this.index < this.length
            },
            next: function() {
                var result = this.getWholeWord(),
                    word = result[0],
                    type = result[1];
                return this.index += word.length, this.current = {
                    word: word,
                    type: type
                }, this.current
            }
        }), WordIterator.prototype.isEnWord = function(code, character) {
            var isWord = (code >= 33 && 591 >= code || this.rEnPunc.test(character)) && !this.rIgnorePunc.test(character);
            return isWord
        }, WordIterator.prototype.getWholeWord = function() {
            var str = this.value,
                i = this.index,
                code = str.charCodeAt(i),
                character = str.charAt(i),
                ret = "";
            if (isNaN(code)) return [];
            if (32 === code) {
                do ret += str.charAt(i++); while (32 === str.charCodeAt(i));
                return [ret, "space"]
            }
            if (this.rPuncNotAllowedStartAndEnd.test(character)) return [character, "punc-not-allowed-start-and-end"];
            if (this.rPuncNotAllowedAtStart.test(character)) return [character, "punc-not-allowed-at-start"];
            if (this.rPuncNotAllowedAtEnd.test(character)) return [character, "punc-not-allowed-at-end"];
            if (this.rPuncNotAllowedBreak.test(character)) return [character, "punc-not-allowed-break"];
            if (this.isEnWord(code, character)) {
                var currCharCode = code,
                    currChar = character;
                do ret += currChar, currChar = str.charAt(++i), currCharCode = str.charCodeAt(i); while (this.isEnWord(currCharCode, currChar));
                return [ret, "en"]
            }
            if (55296 > code || code > 57343) return [character, "cjk"];
            if (code >= 55296 && 56319 >= code) {
                if (str.length <= i + 1) throw "High surrogate without following low surrogate";
                var next = str.charCodeAt(i + 1);
                if (56320 > next || next > 57343) throw "High surrogate without following low surrogate";
                return [character + str.charAt(i + 1), "cjk"]
            }
            if (0 === i) throw "Low surrogate without preceding high surrogate";
            var prev = str.charCodeAt(i - 1);
            if (55296 > prev || prev > 56319) throw "Low surrogate without preceding high surrogate";
            return []
        }, splitToSpan
    }), define("../reader/modules/get_para_html", ["jquery", "underscore", "reader/app", "reader/modules/browser", "reader/modules/split_to_span"], function($, _, app, browser, splitToSpan) {
        var tmplParagraph = $("#tmpl-paragraph").html(),
            getSplitedSpans = function() {
                var func = function(text) {
                    return splitToSpan(text)
                };
                return browser.fitForDesktop || (func = function(text) {
                    return text
                }), func
            }(),
            getParaContent = function(p) {
                return "illus" !== p.type && "code" !== p.type && -1 === p.klass.indexOf("headline") ? getSplitedSpans(p.text) : p.text
            };
        return function(data) {
            return _.template(tmplParagraph, {
                p: data,
                getParaContent: getParaContent
            })
        }
    }), define("../reader/views/reading/modules/simple_page", ["underscore", "jquery", "reader/app", "reader/modules/get_para_html", "reader/views/reading/modules/build_line_info"], function(_, $, app, getParaHtml, buildLineInfo) {
        function makeFakeParagraph(pid) {
            var paragraph = $("<div>"),
                data = app.getModel("content").getParagraph(pid);
            return paragraph.html(getParaHtml(data)), paragraph.find("p")
        }

        function getByStamp(stamp) {
            var page = {
                    pagination: 0
                },
                contentModel = app.getModel("content"),
                paginations = contentModel.findPaginations(stamp.pid);
            if (!paginations) return page.error = !0, page;
            if (1 === paginations.length) page.pagination = paginations[0];
            else if (paginations.length > 1) {
                var row, fakeParagraph = makeFakeParagraph(stamp.pid),
                    info = buildLineInfo(fakeParagraph),
                    currPagination = paginations[0],
                    rows = contentModel.findPageOffsetInfo(stamp.pid);
                $.each(paginations, function(index, pagination) {
                    return row = rows[index], stamp.offset < info.index.offset[row] ? !1 : (currPagination = pagination, void 0)
                }), page.pagination = currPagination
            }
            return page
        }
        return {
            getByStamp: getByStamp
        }
    }), define("../reader/views/reading/modules/get_curr_page_info", ["underscore", "jquery", "reader/app", "reader/views/reading/modules/get_page_stamp"], function(_, $, app, getPageStamp) {
        function getCurrPage() {
            return app.getModel("turning").get("currPage")
        }

        function getPartSequence(pid) {
            var contentModel = app.getModel("content"),
                sequence = {
                    partIndex: 0,
                    parasIndex: 0
                },
                partPidsArray = contentModel.getPartPidsArray();
            return _.each(partPidsArray, function(pids, idx) {
                var parasIndex = _.indexOf(pids, pid); - 1 !== parasIndex && (sequence = {
                    partIndex: idx,
                    parasIndex: parasIndex
                })
            }), sequence
        }

        function getCurrPageInfo(pageNumber) {
            pageNumber = pageNumber || getCurrPage();
            var contentModel = app.getModel("content"),
                stamp = getPageStamp(pageNumber),
                pid = stamp.pid || 0,
                paragraph_offset = stamp.offset || 0,
                sequences = getPartSequence(pid),
                partSequence = sequences.partIndex;
            return pid || (partSequence = _.indexOf(contentModel.getTocPageNumbers(), pageNumber)), {
                paragraph_id: pid,
                paragraph_offset: paragraph_offset,
                part_sequence: partSequence,
                part_paragraph_sequence: sequences.parasIndex
            }
        }
        return getCurrPageInfo
    }), define("../reader/views/reading/progress_manager", ["jquery", "backbone", "underscore", "arkenv", "reader/app", "mod/ajax", "reader/modules/stamp", "reader/views/reading/modules/login_with_actions", "reader/views/reading/modules/get_curr_page_info", "reader/views/reading/modules/simple_page"], function($, Backbone, _, arkenv, app, ajax, Stamp, LoginWithActions, getCurrPageInfo, SimplePage) {
        var ProgressManager = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this, "loadProgressThenJump", "saveReadingProgress", "saveProgressLocally"), this.config = app.getModel("config"), app.vent.on("change:layout", this.saveProgressLocally)
            },
            tryToGetStamp: function(content) {
                var loginStamp = LoginWithActions.getActionOnce("stamp"),
                    stamp = content.stamp;
                return !stamp && loginStamp && (stamp = new Stamp(loginStamp)), stamp
            },
            gotoStamp: function(stamp) {
                if (!stamp) return this.gotoProgressPage(1);
                this.config.set("ignoreSaveProgress", stamp.ignoreSaveProgress());
                var pagination = SimplePage.getByStamp(stamp).pagination || 1,
                    markings = app.getModel("article").markings,
                    annotationJson = stamp.getAnnotationJson();
                this.gotoProgressPage(pagination), stamp.hasAnnotation() && markings && markings.add(annotationJson, {
                    fakeSync: !_.contains(annotationJson.tags, "mine")
                })
            },
            getProgress: function(aid) {
                return ajax({
                    url: "/j/progress/",
                    data: {
                        works_id: aid
                    }
                })
            },
            gotoProgressPage: function(pageNumber) {
                _.isNumber(pageNumber) ? app.getModel("turning").setCurrPage(pageNumber) : this.gotoPageByName(pageNumber), this.trigger("progress:confirmed")
            },
            gotoPageByProgress: function(progress) {
                var stamp = new Stamp({
                    pid: progress.paragraph_id,
                    offset: progress.paragraph_offset
                });
                this.gotoStamp(stamp)
            },
            gotoPageByName: function(pageName) {
                var turningModel = app.getModel("turning");
                switch (pageName) {
                    case "first":
                        turningModel.turnFirstPage();
                        break;
                    case "last":
                        turningModel.turnLastPage();
                        break;
                    default:
                        turningModel.turnFirstPage()
                }
            },
            loadProgressThenJump: function() {
                var articleModel = app.getModel("article"),
                    contentModel = (app.getModel("turning"), app.getModel("content")),
                    aid = articleModel.get("id"),
                    stamp = this.tryToGetStamp(contentModel);
                if (stamp) this.gotoStamp(stamp);
                else if (this.config.get("jumpFirstPage")) this.config.unset("jumpFirstPage"), app.vent.trigger("chapterTurn:adjacent", {
                    direction: "next"
                }), this.gotoProgressPage(1);
                else if (this.config.get("jumpLastPage")) this.config.unset("jumpLastPage"), app.vent.trigger("chapterTurn:adjacent", {
                    direction: "prev"
                }), this.gotoProgressPage("last");
                else if (this.config.get("tmpProgress")) {
                    var tmpProgress = this.config.get("tmpProgress");
                    if (this.config.unset("tmpProgress"), tmpProgress.works_id !== aid) return;
                    this.gotoPageByProgress(tmpProgress)
                } else arkenv.me.isAnonymous ? this.gotoProgressPage(1) : this.getProgress(aid).done(_.bind(function(res) {
                    if (res.r) return this.gotoProgressPage(1);
                    var progress = res.progress;
                    return progress ? (this.gotoPageByProgress(progress), void 0) : this.gotoProgressPage(1)
                }, this)).error(_.bind(function() {
                    this.gotoProgressPage(1)
                }, this))
            },
            saveReadingProgress: _.debounce(function() {
                var currPage = app.getModel("turning").get("currPage"),
                    articleModel = app.getModel("article"),
                    configModel = app.getModel("config"),
                    isSampleChapter = configModel.get("isChapter") && app.getModel("chapters").currChapterNeedBuy();
                if (!(arkenv.me.isAnonymous || !currPage || app.getModel("turning").currIsGiftPage() || isSampleChapter || configModel.get("ignoreSaveProgress"))) {
                    var progressData, worksId = articleModel.id;
                    try {
                        progressData = getCurrPageInfo(currPage)
                    } catch (e) {
                        if ("NoParagraph" === e.message) return;
                        throw e
                    }
                    progressData.works_id = worksId, ajax.post("/j/progress/", progressData)
                }
            }, 800),
            saveProgressLocally: function() {
                var progressData, currPage = app.getModel("turning").get("currPage"),
                    worksId = app.getModel("article").get("id");
                try {
                    progressData = getCurrPageInfo(currPage)
                } catch (e) {
                    if ("NoParagraph" === e.message) return;
                    throw e
                }
                progressData.works_id = worksId, app.getModel("config").set("tmpProgress", progressData)
            }
        });
        return ProgressManager
    }), define("../reader/consts", function() {
        var reading = {
            VERTICAL_SCROLLING_DEBOUNCE_LATER: 150,
            READER_INNER_PADDING_EM: 5
        };
        return {
            reading: reading
        }
    }), define("../reader/views/reading/page_jump_manager", ["jquery", "backbone", "underscore", "reader/app", "mod/detector", "reader/consts", "reader/modules/browser"], function($, Backbone, _, app, detector, consts, browser) {
        function onSlowScrolling(el, callback) {
            function speed() {
                return Math.abs(lastTop - curTop) / (curTime - lastTime)
            }
            var lastTime, curTime, lastTop, curTop, throttleCallback = _.throttle(callback, throttleIntervalWhenSlow, {
                    leading: !0
                }),
                debounceCallback = _.debounce(callback, consts.reading.VERTICAL_SCROLLING_DEBOUNCE_LATER);
            el.on("scroll.slowScroll", _.throttle(function() {
                curTop = el.scrollTop(), curTime = +new Date, !lastTime || !lastTop || speed() < speedThreshold ? throttleCallback() : debounceCallback(), lastTop = curTop, lastTime = curTime
            }, speedDetectInterval))
        }

        function offSlowScrolling(el) {
            el.off("scroll.slowScroll")
        }
        var speedDetectInterval = 100,
            speedThreshold = .6,
            throttleIntervalWhenSlow = 800,
            PageJumpManager = Backbone.View.extend({
                initialize: function() {
                    _.bindAll(this, "pageJump", "verticalScroll", "changeLayout", "processScrollingEvent"), this.app = app, this.canvas = $(window), this.scrollBody = $("html, body"), this.config = app.getModel("config"), this.vent = this.app.vent, this.vent.on("change:layout", this.changeLayout)
                },
                render: function(articleElement) {
                    this.articleElement = articleElement, this.pageHeight = this.config.get("pageHeight"), this.pageOffset = this.config.get("pageOffset"), this.changeLayout(this.config.get("layout"))
                },
                changeLayout: function(layout) {
                    this.clearScrollPage(), this.processScrollingEvent(layout)
                },
                processScrollingEvent: function(layout) {
                    "vertical" === layout ? onSlowScrolling(this.canvas, this.verticalScroll) : offSlowScrolling(this.canvas)
                },
                getArticleInnerSink: function() {
                    var articleInnerPadding = this.app.articleInner.css("paddingTop");
                    return parseInt(articleInnerPadding, 10) - (this.config.get("hasFixedPageHeader") ? 50 : 6)
                },
                verticalScroll: function() {
                    var turningModel = this.app.getModel("turning");
                    if (!turningModel.isDisabled()) {
                        var articleInnerSink = this.getArticleInnerSink(),
                            top = this.canvas.scrollTop(),
                            currPage = Math.ceil((top - articleInnerSink + 1) / this.pageHeight);
                        currPage = 0 === currPage ? 1 : currPage, turningModel.setCurrPage(currPage, {
                            preventPageJump: !0
                        }), this.isScrollPageChanged(currPage) && this.vent.trigger("render:pages", "vertical").trigger("render:bookmark")
                    }
                },
                isScrollPageChanged: function(currPage) {
                    return this.scrollPage && this.scrollPage === currPage ? !1 : (this.scrollPage = currPage, !0)
                },
                clearScrollPage: function() {
                    delete this.scrollPage
                },
                pageJump: function(config, currPage, options) {
                    if (!(!currPage || options && options.preventPageJump)) {
                        var layout = this.config.get("layout");
                        browser.fitForMobile && this.vent.trigger("freeze:canvas"), "horizontal" === layout ? this.horizontalJump(currPage, options) : this.verticalJump(currPage)
                    }
                },
                verticalJump: function(currPage) {
                    var currScrollTop = this.canvas.scrollTop(),
                        prevPage = app.getModel("turning").previous("currPage") || 0,
                        pageStep = Math.abs(currPage - prevPage),
                        articleInnerSink = this.getArticleInnerSink(),
                        scrollTopTo = (currPage - 1) * this.pageHeight + (1 === currPage ? 0 : articleInnerSink);
                    currScrollTop === scrollTopTo ? (this.verticalScroll(), this.vent.trigger("unfreeze:canvas")) : this.scrollBody.animate({
                        scrollTop: scrollTopTo + "px"
                    }, 1 === pageStep ? 400 : 0, $.proxy(function() {
                        this.vent.trigger("unfreeze:canvas")
                    }, this))
                },
                horizontalJump: function(currPage, options) {
                    var prevPage = app.getModel("turning").previous("currPage") || 0,
                        isForward = currPage > prevPage ? 1 : 0,
                        pageWidth = this.config.get("pageWidth"),
                        pageStep = Math.abs(currPage - prevPage),
                        resetPosition = isForward ? {
                            right: "auto",
                            left: 0
                        } : {
                            right: (currPage > 1 ? 0 : -pageWidth) - this.pageOffset + "em",
                            left: "auto"
                        },
                        slideStep = "-=" + pageWidth + "em",
                        slideProps = {},
                        duration = detector.hasTouch() && !options.fromMobileTap ? 300 : 1;
                    return this.articleElement.css(resetPosition), this.vent.trigger("render:pages", "horizontal"), pageStep > 1 || 0 === pageStep || !prevPage ? (this.articleElement.css({
                        left: 1 === currPage ? 0 : -pageWidth + "em",
                        right: "auto"
                    }), this.vent.trigger("unfreeze:canvas render:bookmark").trigger("scroll:page", 1), void 0) : (slideProps[isForward ? "left" : "right"] = slideStep, this.articleElement.animate(slideProps, duration, _.bind(function() {
                        this.vent.trigger("scroll:page", 1), this.vent.trigger("unfreeze:canvas render:bookmark")
                    }, this)), void 0)
                }
            });
        return PageJumpManager
    }), define("../reader/views/common/chapter_extra_controls", ["backbone", "underscore", "jquery", "arkenv", "reader/app"], function(Backbone, _, $, arkenv, app) {
        var ChapterExtraControls = Backbone.View.extend({
            template: $("#tmpl-chapter-extra-controls").html(),
            events: {
                "click .lnk-subscribe": "subscribeColumn"
            },
            initialize: function() {
                var columnModel = app.getModel("column");
                columnModel.on("change:is_subscribed", this.updateSubscription, this)
            },
            render: function() {
                var columnData = app.getModel("column").toJSON();
                return this.renderHeader(columnData), this.configFixedHeader(columnData), this
            },
            renderHeader: function(data) {
                this.$el.html(_.template(this.template, {
                    isSubscribed: data.is_subscribed,
                    kind: data.kind,
                    isAnonymous: arkenv.me.isAnonymous
                }))
            },
            configFixedHeader: function(data) {
                var hasFixedPageHeader = !data.is_subscribed || arkenv.me.isAnonymous;
                app.getModel("config").set("hasFixedPageHeader", hasFixedPageHeader)
            },
            updateSubscription: function(columnModel) {
                function subscribedAnimation(callback) {
                    subscribeBtn.text("订阅成功！"), _.delay(function() {
                        subscribeBtn.fadeOut(300, function() {
                            subscribeBtn.remove(), callback()
                        })
                    }, 300)
                }
                var columnData = columnModel.toJSON(),
                    subscribeBtn = this.$(".lnk-subscribe"),
                    self = this;
                columnData.is_subscribed ? subscribedAnimation(function() {
                    self.configFixedHeader(columnData)
                }) : (this.renderHeader(columnData), this.configFixedHeader(columnData))
            },
            subscribeColumn: function(e) {
                var btn = $(e.target),
                    originText = btn.text(),
                    columnModel = app.getModel("column");
                btn.text("正在订阅..."), columnModel.subscribe().fail(function() {
                    btn.text("发生了奇怪的错误"), _.delay(function() {
                        btn.text(originText)
                    }, 600)
                })
            }
        });
        return ChapterExtraControls
    }), define("mod/ga", [], function() {
        var exports = {},
            slice = Array.prototype.slice;
        return exports.trackPageview = function(url) {
            ga("send", "pageview", url.replace(/^(\/*)/g, "/"))
        }, exports.trackEvent = function(category, action) {
            var args = slice.call(arguments, 2),
                opt = ["send", "event", category, action];
            if (args.length > 0) {
                var LABEL = 0,
                    VALUE = 1;
                "number" == typeof args[LABEL] && (args[LABEL] = args[LABEL].toString()), "string" == typeof args[VALUE] && (args[VALUE] = +args[VALUE]), opt = opt.concat(args)
            }
            ga.apply(this, opt)
        }, exports.trackEcommerce = function(trans, item) {
            ga("ecommerce:addTransaction", trans), ga("ecommerce:addItem", item), ga("ecommerce:send")
        }, exports.delayRun = function(func) {
            var delayFunc = function() {
                setTimeout(func, 400)
            };
            delayFunc()
        }, exports
    }), define("widget/purchase/ga", ["mod/ga"], function(ga) {
        var PurchaseMixinGa = {
            trackPurchaseEvent: function(action) {
                var eventName = this.isChapter() ? "column-purchase" : "purchase";
                ga.trackEvent(eventName, action, this.getTitle(), this.getPriceInCents())
            },
            trackEcommerce: function(orderId, affiliation, fictionType) {
                var price = this.getPrice();
                ga.trackEcommerce({
                    id: orderId,
                    affiliation: affiliation,
                    revenue: price
                }, {
                    id: orderId,
                    sku: this.getArticleId(),
                    name: this.getTitle(),
                    category: fictionType || "",
                    price: price,
                    quantity: 1
                })
            }
        };
        return PurchaseMixinGa
    }), define("widget/payment", ["jquery", "mod/ajax", "mod/template"], function($, ajax, tmpl) {
        var paymentView = {
            init: function(options) {
                return this.el = options.el, this.render(), this
            },
            template: $("#tmpl-payment-channels").html(),
            tmplBankList: $("#tmpl-banks-list").html(),
            render: function() {
                return this.el.find(".content").html(tmpl(this.template)), this.form = this.el.find(".payment-form"), this.bankList = this.el.find(".bank-list"), this.bindEvents(), this
            },
            bindEvents: function() {
                var self = this;
                this.el.on("click", ".more-bank", function() {
                    self.bankList.replaceWith(tmpl(self.tmplBankList)), self.el.find(".bank-list")[0].scrollIntoView()
                })
            }
        };
        return paymentView
    }),
    function(window) {
        var StateMachine = {
            VERSION: "2.1.0",
            Result: {
                SUCCEEDED: 1,
                NOTRANSITION: 2,
                CANCELLED: 3,
                ASYNC: 4
            },
            Error: {
                INVALID_TRANSITION: 100,
                PENDING_TRANSITION: 200,
                INVALID_CALLBACK: 300
            },
            WILDCARD: "*",
            ASYNC: "async",
            create: function(cfg, target) {
                var initial = "string" == typeof cfg.initial ? {
                        state: cfg.initial
                    } : cfg.initial,
                    fsm = target || cfg.target || {},
                    events = cfg.events || [],
                    callbacks = cfg.callbacks || {},
                    map = {},
                    add = function(e) {
                        var from = e.from instanceof Array ? e.from : e.from ? [e.from] : [StateMachine.WILDCARD];
                        map[e.name] = map[e.name] || {};
                        for (var n = 0; n < from.length; n++) map[e.name][from[n]] = e.to || from[n]
                    };
                initial && (initial.event = initial.event || "startup", add({
                    name: initial.event,
                    from: "none",
                    to: initial.state
                }));
                for (var n = 0; n < events.length; n++) add(events[n]);
                for (var name in map) map.hasOwnProperty(name) && (fsm[name] = StateMachine.buildEvent(name, map[name]));
                for (var name in callbacks) callbacks.hasOwnProperty(name) && (fsm[name] = callbacks[name]);
                return fsm.current = "none", fsm.is = function(state) {
                    return this.current == state
                }, fsm.can = function(event) {
                    return !this.transition && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD))
                }, fsm.cannot = function(event) {
                    return !this.can(event)
                }, fsm.error = cfg.error || function(name, from, to, args, error, msg, e) {
                    throw e || msg
                }, initial && !initial.defer && fsm[initial.event](), fsm
            },
            doCallback: function(fsm, func, name, from, to, args) {
                if (func) try {
                    return func.apply(fsm, [name, from, to].concat(args))
                } catch (e) {
                    return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e)
                }
            },
            beforeEvent: function(fsm, name, from, to, args) {
                return StateMachine.doCallback(fsm, fsm["onbefore" + name], name, from, to, args)
            },
            afterEvent: function(fsm, name, from, to, args) {
                return StateMachine.doCallback(fsm, fsm["onafter" + name] || fsm["on" + name], name, from, to, args)
            },
            leaveState: function(fsm, name, from, to, args) {
                return StateMachine.doCallback(fsm, fsm["onleave" + from], name, from, to, args)
            },
            enterState: function(fsm, name, from, to, args) {
                return StateMachine.doCallback(fsm, fsm["onenter" + to] || fsm["on" + to], name, from, to, args)
            },
            changeState: function(fsm, name, from, to, args) {
                return StateMachine.doCallback(fsm, fsm.onchangestate, name, from, to, args)
            },
            buildEvent: function(name, map) {
                return function() {
                    var from = this.current,
                        to = map[from] || map[StateMachine.WILDCARD] || from,
                        args = Array.prototype.slice.call(arguments);
                    if (this.transition) return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");
                    if (this.cannot(name)) return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);
                    if (!1 === StateMachine.beforeEvent(this, name, from, to, args)) return StateMachine.CANCELLED;
                    if (from === to) return StateMachine.afterEvent(this, name, from, to, args), StateMachine.NOTRANSITION;
                    var fsm = this;
                    this.transition = function() {
                        fsm.transition = null, fsm.current = to, StateMachine.enterState(fsm, name, from, to, args), StateMachine.changeState(fsm, name, from, to, args), StateMachine.afterEvent(fsm, name, from, to, args)
                    };
                    var leave = StateMachine.leaveState(this, name, from, to, args);
                    return !1 === leave ? (this.transition = null, StateMachine.CANCELLED) : "async" === leave ? StateMachine.ASYNC : (this.transition && this.transition(), StateMachine.SUCCEEDED)
                }
            }
        };
        "function" == typeof define ? define("lib/fsm", [], function() {
            return StateMachine
        }) : window.StateMachine = StateMachine
    }(this), define("widget/purchase/index", ["jquery", "lib/fsm", "mod/ajax", "mod/cookie", "mod/template", "ui/dialog_new", "widget/payment", "widget/purchase/ga"], function($, StateMachine, ajax, cookie, tmpl, dialog, paymentView, PurchaseMixinGa) {
        var PurchaseWidget = function(section) {
            this._el = section, this.tmplPurchaseDialog = $("#tmpl-purchase-dialog").html(), this.tmplPurchaseSuccess = $("#tmpl-purchase-success").html()
        };
        return $.extend(PurchaseWidget.prototype, PurchaseMixinGa, {
            doPurchase: function() {
                this.checkBalance()
            },
            onReadyToBuy: function(event, from, to, balanceInCents) {
                if (this.isFree()) return this.buyAsFree(), void 0;
                var self = this,
                    price = this.getPrice(),
                    username = this.getUsername(),
                    title = "购买" + this.getKindName(),
                    balance = this._readablePrice(balanceInCents),
                    isPrivate = this.isPrivate(),
                    amount = this._readableAmount(balanceInCents - this.getPriceInCents()),
                    purchaseDialog = dialog({
                        type: "confirm",
                        title: title,
                        content: tmpl(this.tmplPurchaseDialog, {
                            title: this.getTitle(),
                            extra_title: this.getExtraTitle(),
                            price: price,
                            balance: balance,
                            amount: amount,
                            username: username,
                            secretly: isPrivate,
                            subscribed: this.isSubscribed()
                        })
                    }).on("confirm", function() {
                        var dialogBody = this.getBody(),
                            privateCheckBox = dialogBody.find("[name=secretly]");
                        self.addSubscription = dialogBody.find("[name=add_subscription]").is(":checked") ? "on" : "", privateCheckBox.prop("checked") ? (self.secretly = privateCheckBox.val(), cookie("pp", 1, {
                            "max-age": 31536e4
                        })) : (self.secretly = "", cookie.remove("pp")), self.getBought(balanceInCents), this.close(!0)
                    }).addClass("purchase-dialog").on("close", function() {
                        self._el.trigger("purchase:failed"), self.cancel()
                    }).open();
                paymentView.init({
                    el: purchaseDialog.el.find(".payment-channels")
                }), this.paymentForm = paymentView.form
            },
            onBought: function() {
                this.isFree() ? location.reload() : this.showSuccessDialog()
            },
            onCheckingBalance: function() {
                return this.isFree() ? (this.passedCheck(), void 0) : (this.trackPurchaseEvent("tryToBuy"), this._checkBalance(), void 0)
            },
            ongetBought: function(event, from, to, balanceInCents) {
                var amount = this._readableAmount(balanceInCents - this.getPriceInCents());
                amount ? this._confirmThirdPartyToBuy(amount) : this._confirmToBuy()
            },
            onbuyAsFree: function() {
                this._confirmToBuy()
            },
            showSuccessDialog: function() {
                var self = this,
                    template = this.tmplPurchaseSuccess,
                    remainingSeconds = 3,
                    content = tmpl(template, {
                        sec: remainingSeconds
                    }),
                    successDialog = dialog({
                        type: "confirm",
                        title: "购买成功",
                        content: content
                    }).addClass("purchase-success-dialog").on("close", function() {
                        clearInterval(countDown), self._el.trigger("purchase:finish", self.getRedirectUrl())
                    }).setButtons([{
                        text: "去阅读"
                    }, {
                        text: "知道了"
                    }]).on("confirm", function() {
                        location.href = self.getReaderUrl()
                    }).on("cancel", function() {
                        this.close()
                    }),
                    countDownNum = successDialog.el.find(".count-down-num")[0];
                successDialog.open(), countDownNum.innerHTML = remainingSeconds;
                var countDown = setInterval(function() {
                    remainingSeconds--, countDownNum.innerHTML = remainingSeconds, remainingSeconds || (clearInterval(countDown), successDialog.close())
                }, 1e3)
            },
            onsucceededToBuy: function(event, from, to, data) {
                this.isFree() ? this.trackPurchaseEvent("got") : (this.trackPurchaseEvent("bought"), this.trackEcommerce(data.order, this.getOrigin(), "购买")), this._el.trigger("purchase:success")
            },
            onfailedToBuy: function() {
                this.trackPurchaseEvent("failed"), this._el.trigger("purchase:failed")
            },
            _readablePrice: function(cents) {
                return cents / 100
            },
            _readableAmount: function(amount) {
                return 0 > amount ? Math.abs(amount) / 100 : 0
            },
            _checkBalance: function() {
                var self = this;
                this._el.trigger("checkBalance:start"), ajax.get("/j/balance").done(function(balanceInCents) {
                    self.passedCheck(balanceInCents)
                }).fail(function() {
                    self._el.trigger("checkBalance:failed"), self.trackPurchaseEvent("checkBalanceFailed"), dialog({
                        type: "confirm",
                        title: "出错了",
                        content: "无法获取账户余额，也许是网络连接出现了问题。"
                    }).setButtons([{
                        text: "重试"
                    }]).on("confirm", function() {
                        this.close(!0), self._checkBalance()
                    }).on("cancel", function() {
                        self.failedCheck()
                    }).open()
                })
            },
            _confirmThirdPartyToBuy: function(amount) {
                var self = this,
                    confirmStateDialog = dialog({
                        type: "confirm",
                        title: "等待支付",
                        content: "请在新打开的页面中完成支付。",
                        closable: !1
                    }).addClass("general-tips").setButtons([{
                        text: "支付成功"
                    }, {
                        text: "遇到问题"
                    }]).on("confirm", function() {
                        location.reload()
                    }).on("cancel", function() {
                        self._el.trigger("bought:failed"), self.failedToBuy()
                    });
                confirmStateDialog.open(), this._requestThirdPartyToBuy(amount)
            },
            _requestThirdPartyToBuy: function(amount) {
                for (var extraAttrs = [{
                        name: "amount",
                        value: amount
                    }, {
                        name: "secretly",
                        value: this.secretly
                    }, {
                        name: "works_id",
                        value: this.getArticleId()
                    }, {
                        name: "add_subscription",
                        value: this.addSubscription
                    }], attrsLength = extraAttrs.length; attrsLength;) this.paymentForm.append($("<input>", {
                    type: "hidden"
                }).attr(extraAttrs[--attrsLength]));
                this.paymentForm.submit()
            },
            _requestToBuy: function() {
                var action = (document.referrer, this.isFree() ? "获取作品" : "确认购买"),
                    content = "正在{{EVENT}}，请稍候...".replace("{{EVENT}}", action),
                    confirmToBuyTip = dialog({
                        type: "tips",
                        title: action,
                        content: content
                    }).addClass("general-tips").open();
                return ajax({
                    type: "POST",
                    url: this.getPaidUrl(),
                    dataType: "json",
                    arkWithDocReferer: !0,
                    data: {
                        secretly: this.secretly || ""
                    }
                }).always(function() {
                    confirmToBuyTip.close()
                })
            },
            _confirmToBuy: function() {
                var self = this;
                self._requestToBuy().done(function(res) {
                    return !res || res.r ? self.failedToBuy(res ? res.err : "出现了奇怪的错误:(") : self.succeededToBuy(res)
                }).fail(function() {
                    self.trackPurchaseEvent("finalPurchaseFailed");
                    var confirmToRetry = dialog({
                        type: "confirm",
                        title: "出错了",
                        content: "无法完成购买操作，也许是网络连接出现了问题。"
                    }).setButtons([{
                        text: "重试"
                    }]).addClass("general-tips").open();
                    confirmToRetry.on("confirm", function() {
                        this.close(!0), self._confirmToBuy()
                    }).on("close", function() {
                        self.failedToBuy()
                    })
                })
            },
            isFree: function() {
                return !this.getPriceInCents()
            },
            isPrivate: function() {
                return !!cookie("pp")
            },
            isChapter: function() {
                return /column/i.test(this.getArticleUrl())
            },
            isSubscribed: function() {
                return !!this._el.data("subscribed")
            },
            getPrice: function() {
                return this._el.data("readable-price")
            },
            getPriceInCents: function() {
                return this._el.data("price")
            },
            getTitle: function() {
                return this._el.data("title")
            },
            getExtraTitle: function() {
                return this._el.data("extra-title")
            },
            getKindName: function() {
                return this._el.data("kind-name")
            },
            getPaidUrl: function() {
                return this._el.data("paid-url")
            },
            getArticleId: function() {
                return this._el.data("article-id")
            },
            getArticleUrl: function() {
                return this._el.data("url")
            },
            getReaderUrl: function() {
                return "/reader" + this.getArticleUrl()
            },
            getRedirectUrl: function() {
                return this._el.data("redirect-url")
            },
            getUsername: function() {
                return this._el.data("username")
            },
            getOrigin: function() {
                var name = /^\/(reader|\w*)/gi.exec(location.pathname)[1],
                    origin = "reader" === name ? name : "new-store";
                return origin
            },
            isLargeBtn: function() {
                this.isLargeBtn = this._el.data("is-large-btn")
            }
        }), StateMachine.create({
            target: PurchaseWidget.prototype,
            events: [{
                name: "checkBalance",
                from: "none",
                to: "CheckingBalance"
            }, {
                name: "passedCheck",
                from: "CheckingBalance",
                to: "ReadyToBuy"
            }, {
                name: "failedCheck",
                from: "CheckingBalance",
                to: "none"
            }, {
                name: "getBought",
                from: "ReadyToBuy",
                to: "Buying"
            }, {
                name: "succeededToBuy",
                from: "Buying",
                to: "Bought"
            }, {
                name: "cancel",
                from: "ReadyToBuy",
                to: "none"
            }, {
                name: "failedToBuy",
                from: "Buying",
                to: "none"
            }, {
                name: "buyAsFree",
                from: "ReadyToBuy",
                to: "Buying"
            }]
        }), PurchaseWidget.applyWithIn = function(selector, context) {
            $(context).find(selector).each(function(i, el) {
                new PurchaseWidget($(el))
            })
        }, PurchaseWidget
    }), define("../reader/views/common/extra_controls", ["backbone", "underscore", "jquery", "arkenv", "reader/app", "mod/ajax", "widget/purchase/index", "reader/views/modules/render_purchase_button"], function(Backbone, _, $, arkenv, app, ajax, PurchaseWidget, renderPurchaseButton) {
        var ExtraControls = Backbone.View.extend({
            template: $("#tmpl-extra-controls").html(),
            events: {
                "click .lnk-collect": "addToBookshelf",
                "click .btn-purchase": "buy"
            },
            render: function() {
                var articleModel = app.getModel("article");
                return this.articleId = articleModel.get("id"), this.$el.html(_.template(this.template, {
                    id: this.articleId,
                    price: articleModel.get("price"),
                    hasAdded: articleModel.get("hasAdded"),
                    isSample: articleModel.get("isSample"),
                    isAnonymous: arkenv.me.isAnonymous
                })), this.appendPurchaseButton(articleModel), this
            },
            appendPurchaseButton: function(articleModel) {
                var purchaseBtn = renderPurchaseButton(articleModel);
                purchaseBtn.$(".btn").addBack(".btn").addClass("btn-purchase").removeClass("btn btn-large login"), this.$el.find(".btn-purchase-wrapper").html(purchaseBtn.el), this.purchaseWidget = new PurchaseWidget(purchaseBtn.$el)
            },
            buy: function(e) {
                e.preventDefault(), arkenv.me.isAnonymous || this.purchaseWidget.doPurchase()
            },
            addToBookshelf: function(e) {
                var btn = $(e.target),
                    originText = btn.text(),
                    url = "/j/ebook/" + this.articleId + "/add_to_bookshelf";
                btn.text("正在添加..."), ajax.post(url).done(_.bind(function(o) {
                    var err = o.err;
                    err ? (btn.text(err), _.delay(function() {
                        btn.text(originText)
                    }, 600)) : (btn.text("添加成功！"), _.delay(function() {
                        btn.fadeOut(300, function() {
                            app.getModel("article").set("hasAdded", 1), app.vent.trigger("article:hasAdded"), $(this).remove()
                        })
                    }, 300))
                }, this)).fail(function() {
                    btn.text(originText)
                })
            }
        });
        return ExtraControls
    }), define("../reader/modules/text_util", ["jquery"], function() {
        function multiEllipsis(container) {
            var height = container.find(".ellipsis-main").height(),
                maxHeight = parseInt(container.css("max-height"), 10);
            height >= maxHeight ? container.find(".ellipsis-prop").height(maxHeight) : container.find(".ellipsis-end").hide()
        }
        return {
            multiEllipsis: multiEllipsis
        }
    }), define("../reader/views/reading/modules/illus_actions", ["underscore", "jquery", "ui/overlay", "reader/modules/browser", "reader/modules/text_util"], function(_, $, overlay, browser, textUtil) {
        function loadFigures(container, innerWidth) {
            var figures = container.find(".illus img");
            _.each(figures, function(figure) {
                var currFigure = $(figure),
                    currSrc = currFigure.data("src"),
                    figureContainer = currFigure.closest(".illus"),
                    figureTypes = figureContainer[0].className,
                    figureLegend = figureContainer.find(".legend");
                if (/M_L|M_R/g.test(figureTypes) && !browser.fitForMobile) {
                    var legendMaxHeight = 18 * Math.floor(currFigure.height() / 18 - 1);
                    figureLegend.css({
                        width: innerWidth - currFigure.parent().outerWidth() - 15,
                        "max-height": legendMaxHeight
                    })
                }
                textUtil.multiEllipsis(figureLegend), currFigure.attr("src", currSrc).removeClass("loading")
            })
        }

        function expandIllus(figureTarget) {
            var illus = figureTarget.find("img"),
                legend = figureTarget.find(".legend"),
                origWidth = illus.data("orig-width"),
                origHeight = illus.data("orig-height"),
                fullLegend = legend.data("full-legend") || legend.html(),
                fullLegendWithFormat = fullLegend ? "<p>" + fullLegend + "</p>" : "",
                illusOverlayData = {
                    src: illus.data("orig-src"),
                    legend: fullLegendWithFormat,
                    origWidth: origWidth,
                    origHeight: origHeight
                },
                illusData = _.template(tmplIllus, illusOverlayData);
            overlay({
                body: illusData,
                closable: !0
            }).open(), $(".full-legend").css({
                width: origWidth + "px"
            })
        }
        var tmplIllus = $("#tmpl-illus").html();
        return {
            loadFigures: loadFigures,
            expandIllus: expandIllus
        }
    }), define("../reader/modules/figure_util", ["jquery", "underscore"], function($, _) {
        function fitBox(containerWidth, containerHeight, targetWidth, targetHeight) {
            return targetWidth / targetHeight > containerWidth / containerHeight ? fitByWidth.apply(this, arguments) : fitByHeight.apply(this, arguments)
        }

        function fitByWidth(containerWidth, containerHeight, targetWidth, targetHeight) {
            return {
                height: targetHeight * containerWidth / targetWidth,
                width: containerWidth
            }
        }

        function fitByHeight(containerWidth, containerHeight, targetWidth, targetHeight) {
            return {
                height: containerHeight,
                width: targetWidth * containerHeight / targetHeight
            }
        }

        function resizeIllus(illusPara, opts) {
            var data = illusPara.data,
                size = data.size,
                dimension = data.dimension,
                sizeInfo = size[sizeDict[dimension]],
                w = sizeInfo.width,
                h = sizeInfo.height,
                maxWidth = opts.maxWidth || w,
                maxHeight = opts.maxHeight || h;
            maxHeight >= h && maxWidth >= w || _.extend(sizeInfo, fitBox(maxWidth, maxHeight, w, h))
        }

        function resizeIllusElem(illusElem, opts) {
            var imgMaxWidth, imgMaxHeight, img = illusElem.find(".illus-outer img"),
                imgWidth = img.width(),
                imgHeight = img.height(),
                illusWidth = illusElem.outerWidth(!0),
                illusHeight = illusElem.outerHeight(!0),
                maxWidth = opts.maxWidth || illusWidth,
                maxHeight = opts.maxHeight || illusHeight;
            imgMaxWidth = maxWidth - (illusWidth - imgWidth), imgMaxHeight = maxHeight - (illusHeight - imgHeight);
            var newSize = fitBox(imgMaxWidth, imgMaxHeight, imgWidth, imgHeight);
            img.height(newSize.height).width(newSize.width)
        }
        var sizeDict = {
            H: "large",
            M: "small",
            S: "tiny"
        };
        return {
            fitBox: fitBox,
            resizeIllus: resizeIllus,
            resizeIllusElem: resizeIllusElem
        }
    }), define("../reader/modules/prettify", function() {
        function Hex64(key) {
            this._key = [], this._tbl = {};
            for (var _i = 0; 64 > _i; ++_i) this._key[_i] = _hexCHS.charAt(key[_i]), this._tbl[this._key[_i]] = _i;
            this._pad = _hexCHS.charAt(64)
        }
        var _hexCHS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_~";
        Hex64.prototype.dec = function(s) {
            var _n1, _n2, _n3, _n4, _sa = [],
                _i = 0,
                _c = 0;
            for (s = s.replace(/[^0-9A-Za-z$_~]/g, ""); _i < s.length;) _n1 = this._tbl[s.charAt(_i++)], _n2 = this._tbl[s.charAt(_i++)], _n3 = this._tbl[s.charAt(_i++)], _n4 = this._tbl[s.charAt(_i++)], _sa[_c++] = _n1 << 2 | _n2 >> 4, _sa[_c++] = (15 & _n2) << 4 | _n3 >> 2, _sa[_c++] = (3 & _n3) << 6 | _n4;
            var _e2 = s.slice(-2);
            return _e2.charAt(0) === this._pad ? _sa.length = _sa.length - 2 : _e2.charAt(1) === this._pad && (_sa.length = _sa.length - 1), Hex64._1to2(_sa)
        }, Hex64._1to2 = function(a) {
            for (var _rs = "", _i = 0; _i < a.length; ++_i) {
                var _c = a[_i];
                _rs += String.fromCharCode(256 * _c + a[++_i])
            }
            return _rs
        };
        var _key = [37, 7, 20, 41, 59, 53, 8, 24, 5, 62, 31, 4, 32, 6, 50, 36, 63, 35, 51, 0, 13, 43, 46, 40, 15, 27, 17, 57, 28, 54, 1, 60, 21, 22, 47, 42, 30, 39, 12, 3, 9, 45, 29, 23, 56, 2, 16, 61, 52, 44, 25, 14, 49, 34, 33, 10, 58, 55, 19, 26, 11, 18, 48, 38],
            decrypt = new Hex64(_key);
        return decrypt
    }), define("../reader/modules/split_code_line", ["jquery", "underscore"], function() {
        var isIE8 = /msie 8/i.test(navigator.userAgent),
            splitCodeLine = function(text) {
                return text
            };
        return isIE8 && (splitCodeLine = function(text) {
            var lines = text.split("\n");
            return '<span class="line">' + lines.join('</span><span class="line">') + "</span>"
        }, splitCodeLine.doSplit = !0), splitCodeLine
    }), define("../reader/modules/is_mathplayer_installed", function() {
        return function() {
            try {
                return new ActiveXObject("MathPlayer.Factory.1"), !0
            } catch (err) {
                return !1
            }
        }
    }), define("../reader/models/content", ["underscore"], function(_) {
        var contentOptions = ["body", "posts", "gift", "contents", "pidAndPageMap", "pageAndOffsetRowMap"],
            Content = function(options) {
                _.extend(this, _.pick(options, contentOptions)), this.makeParasIndexs()
            };
        return _.extend(Content.prototype, {
            isEmpty: function() {
                return !this.body
            },
            isPara: function(obj) {
                return "paragraph" === obj.type
            },
            getParagraph: function(pid) {
                var paragraph, paginations = this.findPaginations(pid),
                    page = this.getPage(paginations[0]),
                    paragraphs = page.paragraphs;
                return paragraph = _.find(paragraphs, function(obj) {
                    return +obj.pid === +pid
                })
            },
            getPage: function(pagination) {
                return this.body[pagination - 1]
            },
            getPages: function() {
                return Array.prototype.slice.apply(this.body, arguments)
            },
            findPaginations: function(pid) {
                return this.pidAndPageMap[pid]
            },
            findPageOffsetInfo: function(pid) {
                return this.pageAndOffsetRowMap[pid]
            },
            findStampOffset: function(pid, pagination) {
                var paginations = this.findPaginations(pid);
                if (paginations.length < 2) return 0;
                var offsetRows = this.findPageOffsetInfo(pid),
                    pageIndex = _.indexOf(paginations, pagination);
                return offsetRows[pageIndex]
            },
            isPidExist: function(pid) {
                return pid in this.pidAndParaSourceMap
            },
            canPidRender: function(pid) {
                var paraSource = this.getParaSourceByPid(pid);
                return "pagebreak" !== paraSource.type
            },
            getParasIndexs: function() {
                return this.parasIndexs
            },
            getParaSourceByPid: function(pid) {
                return this.pidAndParaSourceMap[pid]
            },
            makeParasIndexs: function() {
                var pidAndParaSourceMap = this.pidAndParaSourceMap = {};
                return this.parasIndexs = _.chain(this.posts).map(function(post) {
                    return post.contents
                }).flatten(!0).map(function(paragraph) {
                    var pid = paragraph.id;
                    return pidAndParaSourceMap[pid] = paragraph, pid
                }).value(), this.parasIndexs
            },
            getPartPidsArray: _.memoize(function() {
                var posts = this.posts,
                    partPids = [],
                    pids = [];
                return _.each(posts, function(post) {
                    pids = _.chain(post.contents).flatten(!0).map(function(p) {
                        return p.id
                    }).value(), partPids.push(pids)
                }), partPids
            }),
            getTocPageNumbers: _.memoize(function() {
                return _.map(this.contents, function(item) {
                    return item.pageNum
                })
            })
        }), Content
    }), define("../reader/modules/paging", ["jquery", "underscore", "arkenv", "reader/app", "reader/models/content", "reader/modules/browser", "reader/modules/is_mathplayer_installed", "reader/modules/split_code_line", "reader/modules/figure_util"], function($, _, arkenv, app, Content, browser, isMPInstalled, splitCodeLine, figureUtil) {
        function pxToEm(pixels, benchmark) {
            return +pixels / (benchmark || 16)
        }

        function fillHeight(height, lineHeight) {
            var remainder = height % lineHeight;
            return height + (lineHeight - remainder)
        }

        function needZoom(pHeight, typePageHeight, pageFreeHeight) {
            return pageFreeHeight > .8 * Math.min(typePageHeight, pHeight)
        }

        function paging(opts) {
            function getCurrPagination() {
                return book.length + 1
            }

            function addPidAndPageMap(pid, pagination) {
                pid && (pidAndPageMap[pid] ? pidAndPageMap[pid].push(pagination) : pidAndPageMap[pid] = [pagination])
            }

            function pagingAction() {
                var header, headerRows, paragraphs, stories = content.find(".story"),
                    storyTotal = stories.length;
                _.each(stories, function(story) {
                    story = $(story), header = story.find(".info"), paragraphs = story.find("p"), headerRows = fillHeight(header.height(), lineHeight) / lineHeight + headerBottomRows, title = header.find(TITLE).text(), page = {
                        paragraphs: [],
                        pagination: getCurrPagination()
                    }, rows = rowsPerPage - headerRows, page.info = {
                        title: title,
                        subtitle: header.find(SUBTITLE).text(),
                        orig_author: header.find(AUTHOR).text(),
                        translator: header.find(TRANSLATOR).text(),
                        height: pxToEm(headerRows * lineHeight)
                    }, page.content = {
                        height: pxToEm(pageHeight - headerRows * lineHeight)
                    }, parseText(paragraphs)
                }), content.css("visibility", "visible"), dfd.resolve(new Content({
                    body: book,
                    posts: posts,
                    gift: gift,
                    contents: processContents(book, storyTotal),
                    pidAndPageMap: pidAndPageMap,
                    pageAndOffsetRowMap: pageAndOffsetRowMap
                }))
            }

            function parseText(paragraphs) {
                function createNewPage() {
                    rows !== rowsPerPage && book.push(page), page = {
                        paragraphs: [],
                        pagination: getCurrPagination()
                    }, rows = rowsPerPage
                }

                function getCanBreak(pTypes) {
                    return /code|paragraph/.test(pTypes) || "throughPage" === opts.illusMode && /illus/.test(pTypes)
                }
                var p, pid, pRows, pOuterHeight, pExtraHeight, pTypes, pType, pContent, pTotal, canBreak, canZoom, notIntHeight, isConfinedToPageHeight, offsetRows, offsetHeight, illusOffset, matchedType, extraData = {};
                _.each(paragraphs, function(v, i) {
                    function createBasicData() {
                        return {
                            text: pContent,
                            klass: pTypes,
                            pid: pid,
                            type: pType
                        }
                    }
                    if (p = $(v), p.hasClass("pagebreak") && !isColumnForDesktop && rows >= 0) return page.breaked = !0, createNewPage();
                    if (0 === rows && createNewPage(), pOuterHeight = p.outerHeight(!0), pExtraHeight = pOuterHeight - p.height(), pOuterHeight % lineHeight && (pOuterHeight = fillHeight(pOuterHeight, lineHeight), p.addClass("baffling")), pTypes = p.attr("class"), canBreak = getCanBreak(pTypes), canZoom = !canBreak, notIntHeight = /illus|baffling/.test(pTypes), pRows = pOuterHeight / lineHeight, pTotal = paragraphs.length, pid = p.data("pid"), pContent = $.trim(p.html()), matchedType = /illus|code/.exec(pTypes), pType = matchedType && matchedType[0] || "paragraph", isConfinedToPageHeight = pOuterHeight > pageHeight && !canBreak, extraData = {}, rows -= pRows, (rows >= 0 || 0 > rows && pRows > 1 && canBreak) && (notIntHeight && (extraData = {
                            height: pxToEm(pOuterHeight - pExtraHeight)
                        }), page.paragraphs.push(_.extend(createBasicData(), extraData)), addPidAndPageMap(pid, page.pagination)), 0 > rows && canZoom) {
                        var freeHeight = (pRows + rows) * lineHeight;
                        needZoom(pOuterHeight, pageHeight, freeHeight) && (figureUtil.resizeIllusElem(p, {
                            maxHeight: freeHeight
                        }), pContent = $.trim(p.html()), page.paragraphs.push(_.extend(createBasicData(), extraData)), addPidAndPageMap(pid, page.pagination), rows = 0)
                    }
                    0 > rows && function crossPage() {
                        extraData = {}, book.push(page), isConfinedToPageHeight && (pRows = rowsPerPage), offsetRows = rows + pRows, offsetHeight = offsetRows * lineHeight, notIntHeight && (extraData = {
                            height: pxToEm((isConfinedToPageHeight ? pageHeight : pOuterHeight) - pExtraHeight)
                        }), canBreak && _.extend(extraData, {
                            offset: pxToEm(offsetHeight)
                        }), page = {
                            paragraphs: [_.extend(createBasicData(), extraData)],
                            pagination: getCurrPagination()
                        }, addPidAndPageMap(pid, page.pagination), canBreak && (pageAndOffsetRowMap[pid] ? pageAndOffsetRowMap[pid].push(offsetRows) : pageAndOffsetRowMap[pid] = [0, offsetRows]), illusOffset = canBreak ? 0 : offsetRows, rows = rows + rowsPerPage - illusOffset, 0 > rows && crossPage()
                    }(), i + 1 === pTotal && book.push(page)
                })
            }

            function processContents(book, storyTotal) {
                var contents = [],
                    sequence = 0;
                return _.each(book, function(page, pageIdx) {
                    if (pageIdx++, !page.note) {
                        if (storyTotal > 1) page.info && (title = $.trim(page.info.title), contents.push({
                            pageNum: pageIdx,
                            text: title
                        }));
                        else {
                            sequence += page.paragraphs.length, sequence += 0 | page.breaked;
                            var headlinesInPage = 0,
                                container = $("<div>");
                            _.each(page.paragraphs, function(p, pIdx) {
                                p.offset && --sequence, p.klass && _.contains(p.klass.split(/\s+/), "headline") && (headlinesInPage++, contents.push({
                                    pageNum: pageIdx,
                                    sequence: sequence - page.paragraphs.length + pIdx,
                                    text: container.html(p.text).find("sup").remove().end().text()
                                }))
                            }), contents.length && (title = getNovellaPageTitle(contents, headlinesInPage))
                        }
                        page.title = title
                    }
                }), contents
            }

            function getNovellaPageTitle(contents, headlinesInPage) {
                var pageContentLastIndex = headlinesInPage ? headlinesInPage : 1;
                return contents[contents.length - pageContentLastIndex].text
            }
            opts = _.defaults(opts, {
                lineHeight: 32,
                pageHeight: 768,
                layout: "horizontal"
            }), opts.illusMode || (opts.illusMode = "horizontal" === opts.layout ? "zoom" : "throughPage");
            var dfd = $.Deferred(),
                lineHeight = opts.lineHeight,
                pageHeight = opts.pageHeight,
                hasFormula = opts.metadata.hasFormula,
                loadingHint = $(".loading-hint"),
                content = opts.typePage.find(".content"),
                rowsPerPage = pageHeight / lineHeight,
                headerBottomRows = 2,
                book = [],
                page = {},
                pidAndPageMap = {},
                pageAndOffsetRowMap = {},
                title = "",
                rows = 0,
                posts = opts.data.posts,
                gift = opts.data.gift;
            return app.pageInfo = {
                pageHeight: pageHeight
            }, isIE && hasFormula && !isMPInstalled() ? (loadingHint.remove(), content.html($("#tmpl-mathplayer-hint").html()), dfd.reject(), dfd.promise()) : (gift && book.unshift({
                note: {
                    recipient: arkenv.me.name,
                    words: gift.words,
                    sender: gift.sender,
                    date: gift.date
                },
                pagination: getCurrPagination()
            }), opts.data.splitCode = splitCodeLine, content.css("visibility", "hidden").html(_.template(opts.template.article, opts.data)), content.find(".illus").each(function(i, illusElem) {
                illusElem = $(illusElem), illusElem.outerHeight(!0) <= pageHeight || figureUtil.resizeIllusElem(illusElem, {
                    maxHeight: pageHeight
                })
            }), hasFormula ? require(["backbone", "mathjax"], function(Backbone) {
                loadingHint.remove();
                var Hub = window.MathJax.Hub;
                Backbone.history.bind("all", function(route, router, name) {
                    $("#MathJax_Message").is(":visible") && "home" === name && (location.href = "/reader/")
                }), Hub.Queue(["Typeset", Hub, content[0]], [pagingAction])
            }) : /msie 10.0/i.test(navigator.userAgent) ? _.delay(pagingAction, 180) : pagingAction(), dfd.promise())
        }
        var TITLE = "h1",
            SUBTITLE = "h2",
            AUTHOR = ".orig-author",
            TRANSLATOR = ".translator",
            isIE = /msie/i.test(navigator.userAgent),
            isColumnForDesktop = "c" === arkenv.works.type && browser.fitForDesktop;
        return paging
    }), define("../reader/modules/tinytips", ["jquery", "underscore", "backbone", "reader/modules/bubble", "reader/modules/detector"], function($, _, Backbone, Bubble, detector) {
        var win = $(window),
            CSS_TIPS = ".tips-outer",
            TMPL_TIPS = (detector.hasTouch() ? "tap.tips" : "click.tips", $.trim($("#tmpl-tips").html())),
            boundaryConf = {
                horizontal: {
                    percent: [.3, .7],
                    direct: ["left", "center", "right"]
                }
            },
            ARROW_POS = {
                left: .1,
                center: .5,
                right: .9
            },
            ARROW_HEIGHT = 10,
            defaultPosition = {
                top: "initial",
                bottom: "initial",
                right: "initial",
                left: "initial"
            },
            defaults = {
                html: TMPL_TIPS,
                contentClass: ".footnote"
            },
            TinyTips = Bubble.extend({
                _super: Bubble.prototype,
                constructor: function(opt) {
                    opt = $.extend({}, defaults, opt), this.removeAll(), this._super.constructor.call(this, opt)
                },
                _getDirection: function(target) {
                    var offset = this.getOffsetWithin(target),
                        leftPercent = offset.left / win.width(),
                        horizontalConf = (offset.top / win.height(), boundaryConf.horizontal);
                    return boundaryConf.vertical, {
                        horizontal: horizontalConf.direct[_.sortedIndex(horizontalConf.percent, leftPercent)],
                        vertical: offset.top - this._node.outerHeight() - 12 < 0 ? "top" : "bottom"
                    }
                },
                setPosition: function(target) {
                    var tar = $(target),
                        tarOffset = this.getOffsetWithin(tar),
                        bubbleWidth = this._node.outerWidth(),
                        district = this._getDirection.call(this, tar),
                        position = _.clone(defaultPosition);
                    return position.left = tarOffset.left + tar.width() / 2 - bubbleWidth * ARROW_POS[district.horizontal], "top" === district.vertical ? position.top = tarOffset.top + ARROW_HEIGHT + tar.height() : position.bottom = win.height() - tarOffset.top + ARROW_HEIGHT, this._node[0].className = this._node[0].className.replace(/\s*arrow-\w+\s*/g, " "), this._node.addClass("arrow-" + district.vertical).addClass("arrow-" + district.horizontal).css(position), this.opt.width && this._node.width(this.opt.width), this
                },
                update: function() {
                    return this._super.update.apply(this, arguments), this
                },
                removeAll: function() {
                    var tips = $(CSS_TIPS);
                    tips.length && tips.remove()
                },
                destroy: function() {
                    var self = this;
                    this._node.fadeOut(200, function() {
                        self._super.destroy.apply(self, arguments)
                    })
                },
                onClickOutside: function() {
                    this.destroy()
                }
            });
        return TinyTips
    }), define("../reader/models/reviews", ["underscore", "backbone"], function(_, Backbone) {
        var Reviews = Backbone.Model.extend({
            defaults: {
                n_reviews: 0
            },
            url: function() {
                return "/j/ebook/" + this.articleId + "/n_reviews"
            },
            parse: function(res) {
                return {
                    n_reviews: res
                }
            },
            initialize: function(attr, options) {
                this.articleId = options.articleId
            }
        });
        return Reviews
    }), define("../reader/models/article", ["backbone", "reader/app", "reader/models/rating", "mod/ajax"], function(Backbone, app, Rating, Ajax) {
        var Article = Backbone.Model.extend({
            defaults: {
                id: "",
                title: "",
                price: 0,
                progress: 0,
                totalPages: 0,
                purchaseTime: 0,
                hasAdded: 0,
                defaultSharingText: "",
                isGift: !1,
                isSample: !1,
                hasFormula: !1,
                "abstract": "",
                dataFromLocal: !1,
                cover_url: "",
                onsaleTime: ""
            },
            url: function() {
                return "/j/article_v2/" + this.id + "/"
            },
            initialize: function() {
                app.on("change:rating", function(rating) {
                    this._rating && this.id === rating.get("articleId") && this._rating.set(rating.toJSON())
                }, this)
            },
            isLoaded: function() {
                return !!this.get("title")
            },
            getRating: function() {
                return this._rating ? this._rating : (this._rating = new Rating(this.get("myRating")), this._bindRatingChange(), this._rating)
            },
            _bindRatingChange: function() {
                this._rating.bind("change:rating", function() {
                    this.trigger("change:rating")
                }, this)
            },
            archive: function() {
                var url = this.url() + "archive",
                    self = this;
                return Ajax.request("POST", url).done(function() {
                    self.set({
                        isArchived: !0
                    })
                })
            },
            getBookUrl: function(opts) {
                opts = opts || {};
                var s = opts.ignoreSearch ? "" : location.search,
                    url = ["ebook", this.id, s ? s : ""].join("/");
                return url
            },
            urlInMobileStore: function() {
                return "/ebook/" + this.get("id")
            },
            isFree: function() {
                return 0 === +this.get("price")
            }
        });
        return window.Article = Article, Article
    }), define("../reader/views/mixins/bookmark_manager.js", ["underscore", "reader/models/bookmark"], function(_, BookmarkModel) {
        return {
            addBookmark: function() {
                this.model = new BookmarkModel({
                    works_id: this.worksId
                });
                var bookmarkAttr;
                try {
                    bookmarkAttr = this.newBookmarkAttrs()
                } catch (e) {
                    if ("NoParagraph" === e.message) return;
                    throw e
                }
                this.model.save(bookmarkAttr).done(_.bind(function() {
                    this.collection.add(this.model)
                }, this)), this.active()
            },
            removeBookmark: function() {
                this.model.destroy({
                    success: _.bind(function(model) {
                        this.collection.remove(model), this.model.clear()
                    }, this)
                }), this.deactive()
            },
            toggleBookmark: function() {
                return !this.model || this.model.isNew() ? this.addBookmark() : this.removeBookmark(), this
            },
            active: function() {
                return this.bookmark.addClass("active").show(), this
            },
            deactive: function() {
                return this.bookmark.removeClass("active"), this
            }
        }
    }), define("../reader/views/reading/bookmark_manager", ["backbone", "underscore", "jquery", "reader/app", "reader/models/bookmark", "reader/collections/bookmarks", "reader/views/mixins/bookmark_manager.js", "reader/views/reading/modules/get_curr_page_info", "reader/views/reading/modules/simple_page", "reader/modules/stamp"], function(Backbone, _, $, app, BookmarkModel, Bookmarks, BookmarkManagerMixins, getCurrPageInfo, SimplePage, Stamp) {
        var BookmarkManager = Backbone.View.extend({
            el: ".bookmarks-layout",
            initialize: function(options) {
                return _.bindAll(this, "showOrHideBookmark", "toggleBookmark", "renderBookmark"), this.app = app, this.vent = app.vent, this.config = options.config, this.vent.on({
                    "render:bookmark": this.renderBookmark,
                    "hover:page": this.showOrHideBookmark
                }), this
            },
            render: function(options) {
                return this.articleModel = options.article, this.worksId = this.articleModel.id, this.contentModel = options.contentModel, this.toc = this.contentModel.contents, this.hasToc = !!this.toc.length, this.isGift = this.articleModel.get("isGift"), this.collection = new Bookmarks([], {
                    articleId: this.worksId
                }), this.bookmark = this.$el.find(".bookmark"), this.collection.fetch(), this.tocPageNumbers = this.contentModel.getTocPageNumbers(), this.listenTo(this.collection, "reset add remove", _.bind(function() {
                    this.articleModel.bookmarks = this.collection
                }, this)), this
            },
            events: {
                "click .bookmark": "toggleBookmark"
            },
            getPagePids: function(pageNum) {
                var page = $("[data-pagination=" + pageNum + "]"),
                    paragraphs = page.find("p[data-pid]"),
                    pagePids = [];
                return _.each(paragraphs, function(p) {
                    pagePids.push($(p).data("pid"))
                }), pagePids
            },
            getCurrPage: function() {
                return app.getModel("turning").get("currPage")
            },
            newBookmarkAttrs: getCurrPageInfo,
            renderBookmark: function() {
                var currPage = this.getCurrPage();
                if (this.isBookmarkKeepHiding()) return this.bookmark.hide(), this;
                if (!this.collection.length) return this.deactive();
                var pagePids = this.getPagePids(currPage),
                    collectionPids = this.collection.getPids(),
                    bookmarkPids = _.intersection(collectionPids, pagePids);
                if (this.contentModel.findPaginations(bookmarkPids), _.contains(collectionPids, 0)) {
                    var partSequenceArray = this.collection.where({
                            paragraph_id: 0
                        }),
                        partSequences = _.map(partSequenceArray, function(sequence) {
                            return sequence.get("part_sequence")
                        }),
                        tocPageSequence = _.indexOf(this.tocPageNumbers, currPage),
                        hasSequence = _.contains(partSequences, tocPageSequence);
                    if (!this.hasToc && 1 === currPage || this.hasToc && hasSequence) {
                        var partSequence = partSequences[_.indexOf(partSequences, tocPageSequence)];
                        return this.model = this.collection.findWhere({
                            part_sequence: partSequence
                        }), this.active()
                    }
                }
                if (this.model = this.collection.findWhere({
                        paragraph_id: bookmarkPids[0]
                    }), !this.model) return this.deactive();
                var paraOffset = this.model.get("paragraph_offset"),
                    stamp = new Stamp({
                        pid: bookmarkPids[0],
                        offset: paraOffset
                    }),
                    bookmarkPage = SimplePage.getByStamp(stamp);
                return bookmarkPage.pagination !== currPage ? this.deactive() : this.active()
            },
            isBookmarkKeepHiding: function() {
                if (!app.hasModel("turning") || !app.getModel("turning").isPageTurned()) return !0;
                var isGiftPage = (this.getCurrPage(), app.getModel("turning").currIsGiftPage()),
                    isChapterSamplePage = app.getModel("config").get("isChapter") && app.getModel("chapters").currChapterNeedBuy();
                return isGiftPage || isChapterSamplePage
            },
            showOrHideBookmark: function(e) {
                this.isBookmarkKeepHiding() || !this.bookmark || this.bookmark.hasClass("active") || e.relatedTarget && /bookmark|inner/.test(e.relatedTarget.className) || ("mouseenter" === e.type ? this.bookmark.stop(!0, !0).show() : this.bookmark.fadeOut())
            }
        });
        return _.extend(BookmarkManager.prototype, BookmarkManagerMixins), BookmarkManager
    }), define("../reader/models/note_form", ["backbone", "underscore", "jquery", "reader/models/sharing_form"], function(Backbone, _, $, SharingForm) {
        var sharingAttrs = ["broadcast_to_site", "share_dou", "share_weibo"],
            checkboxAttrs = sharingAttrs.concat(["visible_private"]),
            privateSetting = {
                share_dou: "",
                share_weibo: "",
                broadcast_to_site: ""
            };
        return SharingForm.extend({
            defaults: function() {
                return _.extend({
                    share_dou: "on",
                    share_weibo: "on",
                    broadcast_to_site: "on",
                    visible_private: "",
                    text: ""
                }, this.getConfigFromStorage() || {})
            },
            attrsGroup: _.defaults({
                config: checkboxAttrs,
                checkbox: checkboxAttrs,
                sharing: sharingAttrs,
                edit: sharingAttrs
            }, SharingForm.prototype.attrsGroup),
            configStroageKey: "noteFormDefaults",
            pickAttrs: function(groupName, checkVisible) {
                var attrs = SharingForm.prototype.pickAttrs.apply(this, arguments),
                    isPrivate = !!this.get("visible_private"),
                    keys = this.getGroupKeys(groupName);
                return checkVisible && isPrivate && (attrs = _.extend(attrs, _.pick(privateSetting, keys))), attrs
            }
        })
    }), define("../reader/views/common/tips/note_form", ["jquery", "backbone", "underscore", "mod/form", "reader/models/note_form", "reader/views/mixins/sharing"], function($, Backbone, _, FormUtil, NoteFormModel, sharingMixin) {
        var NoteForm = Backbone.View.extend({
            tmpl: $("#tmpl-note-form").html(),
            tagName: "form",
            className: "note-form",
            initialize: function(options) {
                this.model = options.model, this.content = options.content || "", this.dfd = $.Deferred(), this.promise = this.dfd.promise(), this.isCreating = "create" === options.type, this.formAttrGroup = this.isCreating ? "config" : "edit"
            },
            events: {
                submit: "submitForm",
                "click .ln-cancel": "cancelForm"
            },
            render: function() {
                var formModel = new NoteFormModel,
                    visibleSetting = this.isCreating ? formModel.get("visible_private") : this.model.get("visible_private");
                return this.initializeSharing(formModel, {
                    disableWithoutSharing: !1
                }), this.$el.html(_.template(this.tmpl, {
                    content: this.content,
                    sharingActionsHtml: this.renderSharingHtml({
                        sharingLabel: "分享",
                        hasVisibleSetting: !0,
                        allowShare: this.isCreating,
                        visible_private: visibleSetting
                    })
                })), this.bindSharingActions(), FormUtil.ctrlEnterForm(this.$el), this
            },
            cancelForm: function(e) {
                e.preventDefault(), this.dfd.reject(), this.trigger("form:cancelled")
            },
            readonlyForm: function() {
                FormUtil.readonlyForm(this.$el)
            },
            resumeForm: function() {
                FormUtil.resumeForm(this.$el)
            },
            submitForm: function(e) {
                e.preventDefault();
                var model = this.formModel,
                    note = this.getText();
                return note ? (model.saveConfigToStroage(this.formAttrGroup), model.set("text", note), model.set("visible_private", this.visibleChecker.is(":checked") ? "on" : ""), this.dfd.resolve(model), this.trigger("form:submitted", model), void 0) : (alert("请填写批注内容"), void 0)
            }
        });
        return _.extend(NoteForm.prototype, sharingMixin), NoteForm
    }), define("../reader/views/reading/tips/note_form", ["jquery", "backbone", "underscore", "reader/views/common/tips/note_form"], function($, Backbone, _, CommonNoteForm) {
        return CommonNoteForm
    }), define("../reader/views/reading/mixins/note_actions", ["jquery", "backbone", "underscore", "arkenv", "reader/views/modules/create_form_in_tip", "reader/views/reading/modules/login_with_actions", "reader/views/reading/tips/note_form", "reader/views/reading/tips/sharing_form"], function($, Backbone, _, arkenv, createFormInTip, LoginWithActions, NoteForm, SharingForm) {
        var NoteActions = {
                _getNoteModel: $.noop,
                _setTarget: !1,
                favoriteNote: function(e) {
                    e.preventDefault();
                    var noteModel = this._getNoteModel(),
                        isFavorited = noteModel.isFavorited();
                    noteModel.isFavoriting || noteModel.editFavorite(!isFavorited)
                },
                shareNote: function(e) {
                    e.preventDefault();
                    var model = this._getNoteModel();
                    this._setTarget && this.noteTip.set({
                        target: $(e.currentTarget)
                    }), createFormInTip(this.noteTip, SharingForm, {
                        model: model,
                        isNote: model.isNote(),
                        url: "/j/share/rec_annotation",
                        extraParam: {
                            annotation_id: model.get("id"),
                            works_id: model.articleId
                        }
                    }, {
                        autoClose: !0
                    })
                },
                editNote: function(e) {
                    e.preventDefault();
                    var model = this._getNoteModel();
                    this._setTarget && this.noteTip.set({
                        target: $(e.currentTarget)
                    }), createFormInTip(this.noteTip, NoteForm, {
                        model: model,
                        type: "edit",
                        content: model.get("note")
                    }, {
                        autoClose: !0
                    }).promise.done(function(formModel) {
                        model.set({
                            note: formModel.get("text"),
                            visible_private: formModel.get("visible_private")
                        })
                    })
                },
                deleteNote: function(e) {
                    e.preventDefault();
                    var cfm = confirm("真的要删除这条批注吗？");
                    return cfm ? (this.noteTip.hide(), this._getNoteModel().destroy(), !0) : !1
                }
            },
            promptRequireLogin = function(e) {
                e.preventDefault();
                var loginActionOptions = {
                    page: {
                        actions: {
                            stamp: this._getNoteModel().getStamp()
                        }
                    }
                };
                LoginWithActions.openLoginAndSignup(loginActionOptions[this.loginRedirectType])
            },
            AnonymousMixin = {};
        return arkenv.me.isAnonymous && _.each(["favoriteNote", "shareNote", "replyNote"], function(methodName) {
            AnonymousMixin[methodName] = promptRequireLogin
        }), _.extend(NoteActions, AnonymousMixin), NoteActions
    }), define("../reader/views/reading/single_annotation_overlay/note_section", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/mixins/note_actions", "reader/modules/tooltip", "reader/modules/iso_time/print", "mod/auto_link"], function($, Backbone, _, app, NoteActionsMixin, Tooltip, printTime, autoLink) {
        var NoteSection = Backbone.View.extend({
            className: "note-section",
            tmpl: $("#tmpl-single-note").html(),
            tmplNoteActions: $("#tmpl-single-note-actions").html(),
            tmplFavoriteText: $("#tmpl-annotation-favorite-text").html(),
            initialize: function(options) {
                this.overlayModel = options.overlayModel, this.on("create:noteTip", function(options) {
                    this.createNoteTip(options)
                }, this), this.listenTo(this.model, "change:note", function(model, value) {
                    this.$(".note").text(value)
                }, this).listenTo(this.model, "change:n_comments", function(model, value) {
                    this.$(".comments-num").text(value)
                }).listenTo(this.model, "change:n_favorites", this.updateFavorite, this).listenTo(this.model, "change:visible_private", this.updatePrivate, this), this.$el.on("removing", _.bind(function() {
                    this.stopListening()
                }, this))
            },
            events: {
                "click .share": "shareNote",
                "click .edit": "editNote",
                "click .delete": "deleteNote",
                "click .favorite": "favoriteNote",
                "click .lnk-para-annotations": "lnkParaAnnotations"
            },
            render: function() {
                return this.$el.html(this.getSingleNoteHtml()), this.favoriteText = this.$(".favorite"), this.privateTextWrapper = this.$(".private-info-wrapper"), this.shareWrapper = this.$(".share-wrapper"), this.updateFavorite(this.model), this.updatePrivate(this.model), this
            },
            updateFavorite: function(model) {
                if (this.favoriteText.length) {
                    var data = model.toJSON();
                    data.isFavorited = model.isFavorited(), this.favoriteText.html(_.template(this.tmplFavoriteText, data))
                }
            },
            updatePrivate: function(model) {
                if (this.privateTextWrapper.length) {
                    var isPrivate = model.isPrivate();
                    this.privateTextWrapper[isPrivate ? "show" : "hide"](), this.shareWrapper[isPrivate ? "hide" : "show"]()
                }
            },
            lnkParaAnnotations: function(e) {
                e.preventDefault(), this.openParaAnnotations()
            },
            openParaAnnotations: function() {
                var currentPid = this.overlayModel.get("pid") || this.model.get("endContainerId");
                this.overlayModel.trigger("remove:view"), app.vent.trigger("open:paraAnnotationsOverlay", currentPid)
            },
            createNoteTip: function(options) {
                this.noteTip = new Tooltip(options)
            },
            getSingleNoteHtml: function() {
                var data = this.model.toJSON(),
                    ownerId = data.owner.user_id;
                return _.template(this.tmpl, _.extend(data, {
                    noteActionsHtml: this.getNoteActionsHtml(),
                    printTime: printTime,
                    isPrivate: this.model.isPrivate(),
                    isArticleAuthor: ownerId === app.getModel("article").get("authorId"),
                    autoLink: autoLink
                }))
            },
            getNoteActionsHtml: function() {
                return _.template(this.tmplNoteActions, _.extend(this.model.toJSON(), {
                    actions: this.model.getActionsList(),
                    isPrivate: this.model.isPrivate(),
                    isMine: this.model.isMine()
                }))
            }
        });
        return _.extend(NoteSection.prototype, NoteActionsMixin, {
            loginRedirectType: "overlay",
            _getNoteModel: function() {
                return this.model
            },
            deleteNote: function(e) {
                var isDeleted = NoteActionsMixin.deleteNote.call(this, e);
                isDeleted && this.openParaAnnotations()
            },
            _setTarget: !0
        }), NoteSection
    }), define("../reader/views/reading/modules/find_span_info", ["jquery"], function($) {
        function findSpanInfo(line, targetOffset, isPreOffset) {
            for (var info, trailingIdx, offset, span, i = 0, len = line.length; len > i; ++i) {
                if (span = $(line[i].span), offset = span.data("offset"), isPreOffset || (offset += span.data("length") - 1), offset > targetOffset) {
                    if (0 === i) break;
                    trailingIdx = i
                }
                if (offset === targetOffset) {
                    info = line[i];
                    break
                }
            }
            return info ? info : trailingIdx ? line[trailingIdx - 1] : !1
        }
        return findSpanInfo
    }), define("../reader/views/reading/mixins/plot_marking", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/modules/build_line_info", "reader/views/reading/modules/find_span_info"], function($, Backbone, _, app, buildLineInfoFromPara, findSpanInfo) {
        var hightlightPara = {
            plotOptions: {
                containerAttrs: {
                    "class": "fake-article"
                },
                isDrawInArticle: !0
            },
            plotRange: function(ranges, paragraphs, klass) {
                var doms = $();
                return _.each(ranges, function(range, pid) {
                    if (pid in paragraphs) {
                        var para = this.paragraphs[pid],
                            text = $.trim(para.text());
                        if (!text.length || !para.is(".paragraph") || para.is(".headline")) return;
                        var dom = this.plotPara(para, range.start, range.end, klass);
                        doms = doms.add(dom)
                    }
                }, this), doms
            },
            plotPara: function(para, start, end, klass) {
                start = start || 0;
                for (var lines, paraInfo = buildLineInfoFromPara(para, this.plotOptions.containerAttrs), lineIds = [], offsets = paraInfo.index.offset, i = 0, offset = offsets[i], nextOffset = offsets[i + 1]; !_.isUndefined(nextOffset) && start >= nextOffset;) {
                    if (i += 1, start === nextOffset) {
                        paraInfo.index.lineBreak[i] && lineIds.push(i - 1);
                        break
                    }
                    offset = nextOffset, nextOffset = offsets[i + 1]
                }
                do lineIds.push(i), offset = nextOffset, nextOffset = offsets[++i]; while (!_.isUndefined(nextOffset) && (end >= nextOffset || !isFinite(end)));
                var linesInfo = {};
                linesInfo[lineIds[0]] = {
                    start: start
                };
                var lastLine = lineIds[lineIds.length - 1];
                return linesInfo[lastLine] = _.extend(linesInfo[lastLine] || {}, {
                    end: end
                }), _.each(lineIds, function(lineId) {
                    var startSpanInfo, endSpanInfo, line = paraInfo.lines[lineId],
                        info = linesInfo[lineId];
                    info && (_.isUndefined(info.start) || (startSpanInfo = findSpanInfo(line, start, !0)), _.isUndefined(info.end) || (endSpanInfo = findSpanInfo(line, end)));
                    var lineBox = this.plotLine(para, line, klass, startSpanInfo, endSpanInfo);
                    lines = lines ? lines.add(lineBox) : lineBox
                }, this), lines
            },
            plotLine: function(para, line, klass, startInfo, endInfo) {
                startInfo || (startInfo = _.first(line)), endInfo || (endInfo = _.last(line));
                var top = startInfo.top + para[0].offsetTop,
                    height = startInfo.height,
                    left = startInfo.left,
                    width = endInfo.left + endInfo.width - left;
                return this.drawBox(top, left, height, width).addClass(klass)
            },
            drawBox: function(top, left, height, width) {
                return this.plotOptions.isDrawInArticle && (0 > top || top + height > app.pageInfo.pageHeight) ? $() : $("<div></div>", {
                    "class": "marking",
                    css: {
                        top: top,
                        left: left + 1,
                        height: height,
                        width: width - 1
                    }
                })
            }
        };
        return hightlightPara
    }), define("../reader/views/reading/marking/bare_underline", ["jquery", "backbone", "underscore", "reader/views/reading/mixins/plot_marking"], function($, Backbone, _, plotMarking) {
        var BareUnderline = Backbone.View.extend({
            className: "underline",
            underlineClass: "underline",
            tagClass: "",
            typeClass: "",
            initialize: function(opt) {
                this.paragraphs = opt.paragraphs, this.plotOptions = _.extend({}, this.plotOptions, opt.plotOptions), this.listenTo(this.model, "change:tags", this.updateUnderlineClass)
            },
            render: function() {
                return this.lines = this.plotRange(this.model.getRanges(), this.paragraphs, this.underlineClass), this.updateUnderlineClass(), this.$el.html(this.lines), this
            },
            updateUnderlineClass: function() {
                this.updateTagClass(), this.updateTypeClass()
            },
            updateTagClass: function() {
                this.lines.removeClass(this.tagClass), this.tagClass = this.getTagClass(), this.lines.addClass(this.tagClass)
            },
            updateTypeClass: function() {
                this.lines.removeClass(this.typeClass), this.typeClass = this.getTypeClass(), this.lines.addClass(this.typeClass)
            },
            getTagClass: function() {
                return this.model.getShowTag() + "-underline"
            },
            getTypeClass: function() {
                return this.model.get("type") + "-underline"
            }
        });
        return _.extend(BareUnderline.prototype, plotMarking), BareUnderline
    }), define("../reader/views/reading/modules/content_container/marking_manager", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/get_para_html", "widget/parent_view", "reader/views/reading/marking/bare_underline"], function($, Backbone, _, app, getParaHtml, ParentView, UnderlineView) {
        var MarkingManager = Backbone.View.extend({
            className: "markings-layer",
            initialize: function(options) {
                this.contentContainer = options.contentContainer
            },
            render: function() {
                var markingLayerOffsetTop = this.contentContainer.content.height() + 20;
                return this.$el.css({
                    top: -markingLayerOffsetTop
                }), this
            },
            empty: function() {
                return this.$el.empty(), this
            },
            renderUnderline: function(model) {
                var markingContainer = $("<div>", {
                    "class": "page-marking-container"
                });
                markingContainer.html(this._getUnderlineView(model)), this.$el.html(markingContainer)
            },
            getCurrentMarkingPosition: function() {
                return this.$(".marking").position()
            },
            _getUnderlineView: function(model) {
                return model.isMine(), this.addSubView(new UnderlineView({
                    model: model,
                    paragraphs: this.contentContainer.jqParas,
                    plotOptions: {
                        containerAttrs: {
                            "class": "fake-content-container",
                            css: this.contentContainer.hasScroll ? {
                                overflowY: "scroll"
                            } : {}
                        },
                        isDrawInArticle: !1
                    }
                })).render().el
            }
        });
        return _.extend(MarkingManager.prototype, ParentView), MarkingManager
    }), define("../reader/views/reading/modules/content_container/view", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/get_para_html", "../reader/views/reading/modules/content_container/marking_manager"], function($, Backbone, _, app, getParaHtml, MarkingManager) {
        return Backbone.View.extend({
            className: "content-container",
            tmplHtml: $("#tmpl-content-container").html(),
            initialize: function(options) {
                this.height = options.height, this.$el.css({
                    height: this.height,
                    overflowX: "hidden"
                }), this.markingManager = new MarkingManager({
                    contentContainer: this
                })
            },
            render: function() {
                return this.$el.html(this.tmplHtml), this.content = this.$(".content"), this
            },
            renderMarkingManager: function() {
                return this.hasScroll = this.content.height() > this.height, this.$el.css("overflowY", this.hasScroll ? "auto" : "hidden"), this.$el.append(this.markingManager.render().el), this
            },
            emptyMarkingManager: function() {
                return this.markingManager.empty(), this
            },
            renderUnderline: function(model) {
                var markingManager = this.markingManager;
                return markingManager.renderUnderline(model), this
            },
            scrollToCurrentMarking: function() {
                var markingManager = this.markingManager,
                    position = markingManager.getCurrentMarkingPosition(),
                    SCROLLED_MAKRING_TOP = 60;
                this.$el.stop().animate({
                    scrollTop: position.top - SCROLLED_MAKRING_TOP
                }, "slow")
            },
            renderContent: function(paras) {
                var contentView = this.content;
                return contentView.empty(), this.jqParas = {}, _.each(paras, function(paraData) {
                    contentView.append(getParaHtml(paraData));
                    var pid = paraData.pid;
                    this.jqParas[paraData.pid] = contentView.find("p[data-pid=" + pid + "]")
                }, this), this
            },
            loadFigures: function() {
                var figureSections = this.content.find(".illus"),
                    containerWidth = this.content.width();
                return figureSections.length ? (_.each(figureSections, function(figureSection) {
                    figureSection = $(figureSection).css("height", "auto");
                    var currFigure = figureSection.find("img"),
                        currSrc = currFigure.data("src"),
                        width = currFigure.data("orig-width"),
                        height = currFigure.data("orig-height");
                    if (width > containerWidth) {
                        var ratio = width / height;
                        width = containerWidth, height = containerWidth / ratio
                    }
                    currFigure.attr("src", currSrc).css({
                        width: width,
                        height: height
                    }).removeClass("loading")
                }), this) : this
            }
        })
    }), define("../reader/views/reading/mixins/annotations_overlay", ["jquery", "backbone", "underscore", "reader/views/reading/modules/content_container/view"], function($, Backbone, _, ContentContainer) {
        return {
            createContentContainer: function(contents) {
                var contentContainer = this.contentContainer = new ContentContainer({
                    height: $(window).height() - 40
                });
                this.sideSection.append(contentContainer.render().el), contentContainer.renderContent(contents)
            }
        }
    }), define("../reader/views/reading/single_annotation_overlay/view", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/mixins/annotations_overlay", "reader/views/reading/annotation_comments/view", "../reader/views/reading/single_annotation_overlay/note_section"], function($, Backbone, _, app, annotationsOverlayMixin, AnnotationComments, NoteSection) {
        return Backbone.View.extend(_.extend({
            tmplHtml: $("#tmpl-single-annotation-overlay").html(),
            className: "annotations-overlay-wrapper",
            initialize: function(options) {
                this.overlayModel = new Backbone.Model({}), options.pid && this.overlayModel.set("pid", options.pid), this.overlayModel.on("remove:view", function() {
                    this.remove().trigger("removed")
                }, this), this.on("appended", function(overlay) {
                    this.contentContainer.loadFigures().renderMarkingManager().renderUnderline(this.model).scrollToCurrentMarking(), this.noteSection.trigger("create:noteTip", {
                        renderTo: overlay.el
                    })
                }, this)
            },
            render: function() {
                this.$el.html(this.tmplHtml), this.overlayContainer = this.$(".annotations-overlay"), this.sideSection = this.$(".side");
                var noteSection = new NoteSection({
                    model: this.model,
                    overlayModel: this.overlayModel
                });
                return this.noteSection = noteSection, this.annotationComments = new AnnotationComments({
                    markingModel: this.model,
                    className: "single-annotation-overlay-comments",
                    commentFormIsTop: !0,
                    commentTargetInfo: {
                        article: {
                            authorId: app.getModel("article").get("authorId")
                        }
                    }
                }), this.$(".main").append(noteSection.render().$el).append(this.annotationComments.render().$el), this.createContentContainer(this.getContents()), this
            },
            getContents: function() {
                var content = app.getModel("content");
                return _.chain(this.model.getContainerIds()).filter(function(pid) {
                    return content.canPidRender(pid)
                }).map(function(pid) {
                    return content.getParagraph(pid)
                }).value()
            }
        }, annotationsOverlayMixin))
    }), define("../reader/views/reading/para_annotations_overlay/annotation_item", ["jquery", "backbone", "underscore", "reader/app", "ui/overlay", "mod/auto_link", "reader/modules/iso_time/print"], function($, Backbone, _, app, overlay, autoLink, printTime) {
        var AnnotationsItem = Backbone.View.extend({
            tmpl: $("#tmpl-para-annotations-overlay-annotation-item").html(),
            tagName: "li",
            className: "annotation-item",
            events: {
                click: "openSingleAnnotation"
            },
            initialize: function(options) {
                this.$el.data("view", this), this.overlayModel = options.overlayModel
            },
            openSingleAnnotation: function() {
                this.overlayModel.trigger("remove:view"), app.vent.trigger("open:singleAnnotationOverlay", this.model, this.overlayModel.get("pid"))
            },
            render: function() {
                var data = this.model.toJSON(),
                    ownerId = data.owner.user_id;
                return this.$el.html(_.template(this.tmpl, _.extend(data, {
                    printTime: printTime,
                    isPrivate: this.model.isPrivate(),
                    isArticleAuthor: ownerId === app.getModel("article").get("authorId"),
                    autoLink: autoLink
                }))), this
            }
        });
        return AnnotationsItem
    }), define("../reader/views/reading/para_annotations_overlay/annotations_list", ["jquery", "backbone", "underscore", "../reader/views/reading/para_annotations_overlay/annotation_item"], function($, Backbone, _, AnnotationItem) {
        var TMPL_NOT_FAVORITE_ANNOTATIONS = "<p>暂时没有被你收藏的他人批注</p><p>可以对你认为有趣的他人批注点击“收藏”，它们就会出现在这里</p>",
            TMPL_NOT_ANNOTATIONS = "<p>暂时没有划线和批注</p><p>可以在阅读时选中文字后添加</p>";
        return Backbone.View.extend({
            events: {
                "mouseenter li": "hoverAnnotation"
            },
            initialize: function(options) {
                this.overlayModel = options.overlayModel
            },
            hoverAnnotation: function(e) {
                var el = $(e.currentTarget),
                    oldHover = this.$(".hover");
                oldHover[0] !== el[0] && (oldHover.removeClass("hover"), this.addHoverClass(el))
            },
            addHoverClass: function(el) {
                el.addClass("hover"), this.trigger("hoverClass:added", el)
            },
            hoverFirstAnnotation: function() {
                var firstItem = this.$(".annotation-item").first();
                firstItem.length && this.addHoverClass(firstItem)
            },
            renderNoAnnotations: function(tmpl) {
                var noAnnotationsLabel = $("<div>", {
                    "class": "no-annotations-label"
                });
                this.$el.html(noAnnotationsLabel.html(tmpl))
            },
            render: function() {
                this.$el.empty();
                var annotationModels = this.overlayModel.getAnnotations();
                if (this.overlayModel.annotaitonsIsEmpty()) return this.renderNoAnnotations(TMPL_NOT_ANNOTATIONS), void 0;
                if (!annotationModels.length) {
                    var navTypeIsFavorite = "favorite" === this.overlayModel.get("navType");
                    return navTypeIsFavorite && this.renderNoAnnotations(TMPL_NOT_FAVORITE_ANNOTATIONS), void 0
                }
                return _.each(annotationModels, function(model) {
                    if (model.isNote()) {
                        var view = new AnnotationItem({
                            model: model,
                            overlayModel: this.overlayModel
                        });
                        this.$el.append(view.render().el)
                    }
                }, this), this
            }
        })
    }), define("../reader/views/reading/para_annotations_overlay/view", ["jquery", "backbone", "underscore", "reader/app", "reader/modules/iso_time/parse", "../reader/views/reading/para_annotations_overlay/annotations_list", "reader/views/reading/mixins/annotations_overlay"], function($, Backbone, _, app, parseIsoTime, AnnotationsList, annotationsOverlayMixin) {
        var OverlayModel = Backbone.Model.extend({
            filterFunc: {
                hot: function() {
                    return _.sortBy(this.annotationModels, function(annotation) {
                        return -annotation.get("n_favorites")
                    })
                },
                newest: function() {
                    return _.sortBy(this.annotationModels, function(annotation) {
                        return -parseIsoTime(annotation.get("create_time"))
                    })
                },
                favorite: function() {
                    return _.filter(this.annotationModels, function(annotation) {
                        return annotation.isFavorited()
                    })
                }
            },
            initialize: function(attrs, options) {
                this.annotationModels = options.annotationModels
            },
            annotaitonsIsEmpty: function() {
                return !this.annotationModels.length
            },
            getAnnotations: function() {
                var currentType = this.get("navType"),
                    filter = this.filterFunc[currentType];
                return filter.call(this)
            }
        });
        return Backbone.View.extend(_.extend({
            tmpl: $("#tmpl-para-annotations-overlay").html(),
            className: "annotations-overlay-wrapper",
            optionProps: ["annotationModels", "pid"],
            events: {
                "click .filter-tabs a": "filterItems"
            },
            initialize: function(options) {
                _.extend(this, _.pick(options, this.optionProps)), this.overlayModel = new OverlayModel({
                    pid: this.pid
                }, {
                    annotationModels: this.annotationModels
                }), this.overlayModel.on("remove:view", function() {
                    this.remove().trigger("removed")
                }, this), this.overlayModel.on("change:navType", function() {
                    this.updateTabs(), this.renderAnnotationsList(), this.contentContainer.emptyMarkingManager(), this.annotationsList.hoverFirstAnnotation()
                }, this), this.on("appended", function() {
                    this.contentContainer.renderMarkingManager(), this.overlayModel.set("navType", "hot"), this.annotationsList.hoverFirstAnnotation()
                }, this)
            },
            filterItems: function(e) {
                var el = $(e.currentTarget),
                    navType = el.data("nav-type");
                this.overlayModel.set("navType", navType)
            },
            updateTabs: function() {
                var tabs = this.$(".filter-tabs"),
                    type = this.overlayModel.get("navType"),
                    actived = tabs.find(".actived"),
                    willBeActived = tabs.find("a[data-nav-type=" + type + "]");
                actived && willBeActived[0] === actived[0] || (actived && actived.removeClass("actived"), willBeActived.addClass("actived"))
            },
            render: function() {
                return this.$el.html(_.template(this.tmpl, {
                    totalAnnotations: this.annotationModels.length
                })), this.overlayContainer = this.$(".annotations-overlay"), this.sideSection = this.$(".side"), this.createContentContainer(this.getContents()), this.annotationsList = this.createAnnotationsList(), this
            },
            getContents: function() {
                var content = app.getModel("content"),
                    paragraph = content.getParagraph(this.pid);
                return [paragraph]
            },
            renderAnnotationsList: function() {
                this.annotationsList.render()
            },
            createAnnotationsList: function() {
                var view = new AnnotationsList({
                    overlayModel: this.overlayModel,
                    el: this.$(".annotations-list")
                });
                return view.on("hoverClass:added", function(el) {
                    var view = el.data("view"),
                        model = view.model,
                        contentContainer = this.contentContainer;
                    contentContainer.renderUnderline(model).scrollToCurrentMarking()
                }, this), view
            }
        }, annotationsOverlayMixin))
    }), define("../reader/views/reading/mixins/create_annotations_overlay", ["jquery", "backbone", "underscore", "reader/app", "ui/overlay"], function($, Backbone, _, app, createOverlay) {
        return {
            createAnnotationsOverlay: function(backboneView, urlSegment) {
                var rootUrl = (app.getModel("article"), app.router.getBookUrl({
                        ignoreSearch: !0
                    })),
                    overlay = createOverlay({
                        body: backboneView.render().$el,
                        klass: "full-height-overlay",
                        closable: !0
                    }).open(),
                    oldRemove = backboneView.remove;
                return backboneView.remove = function() {
                    return this.removing = !0, oldRemove.call(this)
                }, urlSegment && app.navigate(rootUrl + urlSegment), backboneView.on("removed", function() {
                    overlay.close(), app.vent.trigger("unfreeze:control")
                }), backboneView.listenTo(app.router, "route", function() {
                    this.overlayModel.trigger("remove:view")
                }), backboneView.$el.on("removing", function() {
                    backboneView.removing || (backboneView.stopListening(), app.vent.trigger("unfreeze:control"), app.navigate(rootUrl))
                }), backboneView.$el.find(".lnk-close").on("click", function(e) {
                    e.preventDefault(), overlay.close()
                }), app.vent.trigger("freeze:control"), backboneView.trigger("appended", overlay), overlay
            }
        }
    }),
    /*!
     * zeroclipboard
     * The Zero Clipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie, and a JavaScript interface.
     * Copyright 2012 Jon Rohan, James M. Greene, .
     * Released under the MIT license
     * http://jonrohan.github.com/ZeroClipboard/
     * v1.1.7
     */
    function() {
        "use strict";
        var currentElement, _getStyle = function(el, prop) {
                var y = el.style[prop];
                if (el.currentStyle ? y = el.currentStyle[prop] : window.getComputedStyle && (y = document.defaultView.getComputedStyle(el, null).getPropertyValue(prop)), "auto" == y && "cursor" == prop)
                    for (var possiblePointers = ["a"], i = 0; i < possiblePointers.length; i++)
                        if (el.tagName.toLowerCase() == possiblePointers[i]) return "pointer";
                return y
            },
            _elementMouseOver = function(event) {
                if (ZeroClipboard.prototype._singleton) {
                    event || (event = window.event);
                    var target;
                    this !== window ? target = this : event.target ? target = event.target : event.srcElement && (target = event.srcElement), ZeroClipboard.prototype._singleton.setCurrent(target)
                }
            },
            _addEventHandler = function(element, method, func) {
                element.addEventListener ? element.addEventListener(method, func, !1) : element.attachEvent && element.attachEvent("on" + method, func)
            },
            _removeEventHandler = function(element, method, func) {
                element.removeEventListener ? element.removeEventListener(method, func, !1) : element.detachEvent && element.detachEvent("on" + method, func)
            },
            _addClass = function(element, value) {
                if (element.addClass) return element.addClass(value), element;
                if (value && "string" == typeof value) {
                    var classNames = (value || "").split(/\s+/);
                    if (1 === element.nodeType)
                        if (element.className) {
                            for (var className = " " + element.className + " ", setClass = element.className, c = 0, cl = classNames.length; cl > c; c++) className.indexOf(" " + classNames[c] + " ") < 0 && (setClass += " " + classNames[c]);
                            element.className = setClass.replace(/^\s+|\s+$/g, "")
                        } else element.className = value
                }
                return element
            },
            _removeClass = function(element, value) {
                if (element.removeClass) return element.removeClass(value), element;
                if (value && "string" == typeof value || void 0 === value) {
                    var classNames = (value || "").split(/\s+/);
                    if (1 === element.nodeType && element.className)
                        if (value) {
                            for (var className = (" " + element.className + " ").replace(/[\n\t]/g, " "), c = 0, cl = classNames.length; cl > c; c++) className = className.replace(" " + classNames[c] + " ", " ");
                            element.className = className.replace(/^\s+|\s+$/g, "")
                        } else element.className = ""
                }
                return element
            },
            _getDOMObjectPosition = function(obj) {
                var info = {
                        left: 0,
                        top: 0,
                        width: obj.width || obj.offsetWidth || 0,
                        height: obj.height || obj.offsetHeight || 0,
                        zIndex: 9999
                    },
                    zi = _getStyle(obj, "zIndex");
                for (zi && "auto" != zi && (info.zIndex = parseInt(zi, 10)); obj;) {
                    var borderLeftWidth = parseInt(_getStyle(obj, "borderLeftWidth"), 10),
                        borderTopWidth = parseInt(_getStyle(obj, "borderTopWidth"), 10);
                    info.left += isNaN(obj.offsetLeft) ? 0 : obj.offsetLeft, info.left += isNaN(borderLeftWidth) ? 0 : borderLeftWidth, info.top += isNaN(obj.offsetTop) ? 0 : obj.offsetTop, info.top += isNaN(borderTopWidth) ? 0 : borderTopWidth, obj = obj.offsetParent
                }
                return info
            },
            _noCache = function(path) {
                var client = ZeroClipboard.prototype._singleton;
                return client.options.useNoCache ? (path.indexOf("?") >= 0 ? "&nocache=" : "?nocache=") + (new Date).getTime() : ""
            },
            _vars = function(options) {
                var str = [];
                return options.trustedDomains && ("string" == typeof options.trustedDomains ? str.push("trustedDomain=" + options.trustedDomains) : str.push("trustedDomain=" + options.trustedDomains.join(","))), str.join("&")
            },
            _inArray = function(elem, array) {
                if (array.indexOf) return array.indexOf(elem);
                for (var i = 0, length = array.length; length > i; i++)
                    if (array[i] === elem) return i;
                return -1
            },
            _prepGlue = function(elements) {
                if ("string" == typeof elements) throw new TypeError("ZeroClipboard doesn't accept query strings.");
                return elements.length ? elements : [elements]
            },
            ZeroClipboard = function(elements, options) {
                if (elements && (ZeroClipboard.prototype._singleton || this).glue(elements), ZeroClipboard.prototype._singleton) return ZeroClipboard.prototype._singleton;
                ZeroClipboard.prototype._singleton = this, this.options = {};
                for (var kd in _defaults) this.options[kd] = _defaults[kd];
                for (var ko in options) this.options[ko] = options[ko];
                this.handlers = {}, ZeroClipboard.detectFlashSupport() && _bridge()
            },
            gluedElements = [];
        ZeroClipboard.prototype.setCurrent = function(element) {
            currentElement = element, this.reposition(), element.getAttribute("title") && this.setTitle(element.getAttribute("title")), this.setHandCursor("pointer" == _getStyle(element, "cursor"))
        }, ZeroClipboard.prototype.setText = function(newText) {
            newText && "" !== newText && (this.options.text = newText, this.ready() && this.flashBridge.setText(newText))
        }, ZeroClipboard.prototype.setTitle = function(newTitle) {
            newTitle && "" !== newTitle && this.htmlBridge.setAttribute("title", newTitle)
        }, ZeroClipboard.prototype.setSize = function(width, height) {
            this.ready() && this.flashBridge.setSize(width, height)
        }, ZeroClipboard.prototype.setHandCursor = function(enabled) {
            this.ready() && this.flashBridge.setHandCursor(enabled)
        }, ZeroClipboard.version = "1.1.7";
        var _defaults = {
            moviePath: "ZeroClipboard.swf",
            trustedDomains: null,
            text: null,
            hoverClass: "zeroclipboard-is-hover",
            activeClass: "zeroclipboard-is-active",
            allowScriptAccess: "sameDomain",
            useNoCache: !0
        };
        ZeroClipboard.setDefaults = function(options) {
            for (var ko in options) _defaults[ko] = options[ko]
        }, ZeroClipboard.destroy = function() {
            ZeroClipboard.prototype._singleton.unglue(gluedElements);
            var bridge = ZeroClipboard.prototype._singleton.htmlBridge;
            bridge.parentNode.removeChild(bridge), delete ZeroClipboard.prototype._singleton
        }, ZeroClipboard.detectFlashSupport = function() {
            var hasFlash = !1;
            if ("function" == typeof ActiveXObject) try {
                new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && (hasFlash = !0)
            } catch (error) {}
            return !hasFlash && navigator.mimeTypes["application/x-shockwave-flash"] && (hasFlash = !0), hasFlash
        };
        var _bridge = function() {
            var client = ZeroClipboard.prototype._singleton,
                container = document.getElementById("global-zeroclipboard-html-bridge");
            if (!container) {
                var html = '      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">         <param name="movie" value="' + client.options.moviePath + _noCache(client.options.moviePath) + '"/>         <param name="allowScriptAccess" value="' + client.options.allowScriptAccess + '"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="' + _vars(client.options) + '"/>         <embed src="' + client.options.moviePath + _noCache(client.options.moviePath) + '"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-zeroclipboard-flash-bridge"           allowScriptAccess="always"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="' + _vars(client.options) + '"           scale="exactfit">         </embed>       </object>';
                container = document.createElement("div"), container.id = "global-zeroclipboard-html-bridge", container.setAttribute("class", "global-zeroclipboard-container"), container.setAttribute("data-clipboard-ready", !1), container.style.position = "absolute", container.style.left = "-9999px", container.style.top = "-9999px", container.style.width = "15px", container.style.height = "15px", container.style.zIndex = "9999", container.innerHTML = html, document.body.appendChild(container)
            }
            client.htmlBridge = container, client.flashBridge = document["global-zeroclipboard-flash-bridge"] || container.children[0].lastElementChild
        };
        ZeroClipboard.prototype.resetBridge = function() {
            this.htmlBridge.style.left = "-9999px", this.htmlBridge.style.top = "-9999px", this.htmlBridge.removeAttribute("title"), this.htmlBridge.removeAttribute("data-clipboard-text"), _removeClass(currentElement, this.options.activeClass), currentElement = null, this.options.text = null
        }, ZeroClipboard.prototype.ready = function() {
            var ready = this.htmlBridge.getAttribute("data-clipboard-ready");
            return "true" === ready || ready === !0
        }, ZeroClipboard.prototype.reposition = function() {
            if (!currentElement) return !1;
            var pos = _getDOMObjectPosition(currentElement);
            this.htmlBridge.style.top = pos.top + "px", this.htmlBridge.style.left = pos.left + "px", this.htmlBridge.style.width = pos.width + "px", this.htmlBridge.style.height = pos.height + "px", this.htmlBridge.style.zIndex = pos.zIndex + 1, this.setSize(pos.width, pos.height)
        }, ZeroClipboard.dispatch = function(eventName, args) {
            ZeroClipboard.prototype._singleton.receiveEvent(eventName, args)
        }, ZeroClipboard.prototype.on = function(eventName, func) {
            for (var events = eventName.toString().split(/\s/g), i = 0; i < events.length; i++) eventName = events[i].toLowerCase().replace(/^on/, ""), this.handlers[eventName] || (this.handlers[eventName] = func);
            this.handlers.noflash && !ZeroClipboard.detectFlashSupport() && this.receiveEvent("onNoFlash", null)
        }, ZeroClipboard.prototype.addEventListener = ZeroClipboard.prototype.on, ZeroClipboard.prototype.off = function(eventName, func) {
            for (var events = eventName.toString().split(/\s/g), i = 0; i < events.length; i++) {
                eventName = events[i].toLowerCase().replace(/^on/, "");
                for (var event in this.handlers) event === eventName && this.handlers[event] === func && delete this.handlers[event]
            }
        }, ZeroClipboard.prototype.removeEventListener = ZeroClipboard.prototype.off, ZeroClipboard.prototype.receiveEvent = function(eventName, args) {
            eventName = eventName.toString().toLowerCase().replace(/^on/, "");
            var element = currentElement;
            switch (eventName) {
                case "load":
                    if (args && parseFloat(args.flashVersion.replace(",", ".").replace(/[^0-9\.]/gi, "")) < 10) return this.receiveEvent("onWrongFlash", {
                        flashVersion: args.flashVersion
                    }), void 0;
                    this.htmlBridge.setAttribute("data-clipboard-ready", !0);
                    break;
                case "mouseover":
                    _addClass(element, this.options.hoverClass);
                    break;
                case "mouseout":
                    _removeClass(element, this.options.hoverClass), this.resetBridge();
                    break;
                case "mousedown":
                    _addClass(element, this.options.activeClass);
                    break;
                case "mouseup":
                    _removeClass(element, this.options.activeClass);
                    break;
                case "datarequested":
                    var targetId = element.getAttribute("data-clipboard-target"),
                        targetEl = targetId ? document.getElementById(targetId) : null;
                    if (targetEl) {
                        var textContent = targetEl.value || targetEl.textContent || targetEl.innerText;
                        textContent && this.setText(textContent)
                    } else {
                        var defaultText = element.getAttribute("data-clipboard-text");
                        defaultText && this.setText(defaultText)
                    }
                    break;
                case "complete":
                    this.options.text = null
            }
            if (this.handlers[eventName]) {
                var func = this.handlers[eventName];
                "function" == typeof func ? func.call(element, this, args) : "string" == typeof func && window[func].call(element, this, args)
            }
        }, ZeroClipboard.prototype.glue = function(elements) {
            elements = _prepGlue(elements);
            for (var i = 0; i < elements.length; i++) - 1 == _inArray(elements[i], gluedElements) && (gluedElements.push(elements[i]), _addEventHandler(elements[i], "mouseover", _elementMouseOver))
        }, ZeroClipboard.prototype.unglue = function(elements) {
            elements = _prepGlue(elements);
            for (var i = 0; i < elements.length; i++) {
                _removeEventHandler(elements[i], "mouseover", _elementMouseOver);
                var arrayIndex = _inArray(elements[i], gluedElements); - 1 != arrayIndex && gluedElements.splice(arrayIndex, 1)
            }
        }, "undefined" != typeof module ? module.exports = ZeroClipboard : "function" == typeof define && define.amd ? define("ZeroClipboard/ZeroClipboard", function() {
            return ZeroClipboard
        }) : window.ZeroClipboard = ZeroClipboard
    }(), define("mod/preload", function() {
        var preload = function(srcArrayOrSrc) {
            if (srcArrayOrSrc)
                for (var srcArray = [].concat.call([], srcArrayOrSrc), len = srcArray.length, i = 0; len > i;)(new Image).src = srcArray[i++]
        };
        return preload
    }), define("../reader/modules/create_zclipboard", ["jquery", "backbone", "underscore", "arkenv", "mod/preload", "ZeroClipboard/ZeroClipboard"], function($, Backbone, _, arkenv, preload, ZeroClipboard) {
        window.ZeroClipboard = ZeroClipboard;
        var createZClipboard = function(el) {
            var zClipSingleton = ZeroClipboard.prototype._singleton;
            zClipSingleton && zClipSingleton.htmlBridge && ZeroClipboard.destroy(), ZeroClipboard.prototype._singleton = null;
            var clip = new ZeroClipboard(el, {
                moviePath: arkenv.ZeroClipboardPath,
                useNoCache: !1,
                hoverClass: "is-hover",
                activeClass: "is-active",
                allowScriptAccess: "always",
                trustedDomains: ["*"]
            });
            return clip.on("mousedown", function() {
                el.trigger("zeroclipboard-mousedown")
            }), clip.on("noflash wrongflash", function() {
                el.addClass("noflash disabled"), clip.unglue(el)
            }), clip.on("complete", function() {
                el.trigger("zeroclipboard-complete"), ZeroClipboard.destroy()
            }), clip
        };
        return window.clipboardData || preload(arkenv.ZeroClipboardPath), createZClipboard
    }), define("../reader/views/reading/tips/mixins/copy_btn", ["jquery", "backbone", "underscore", "reader/modules/create_zclipboard", "reader/modules/toast"], function($, Backbone, _, createZClipboard, Toast) {
        var CopyBtnMixin = {
            createCopyBtn: function() {
                var copyBtn = this.$el.find(".copy"),
                    self = this;
                return window.clipboardData ? (copyBtn.on("click", function() {
                    var text = self.model.getTextFromRanges(),
                        success = window.clipboardData.setData("TEXT", text);
                    Toast.toast(success ? "内容已成功复制到剪贴板" : "复制失败，浏览器禁止了复制"), self.clear()
                }), void 0) : (copyBtn.on("zeroclipboard-mousedown", _.bind(this.copyFromSelection, this)).on("zeroclipboard-complete", function() {
                    Toast.toast("内容已成功复制到剪贴板"), self.clear()
                }).on("click", function() {
                    copyBtn.hasClass("noflash") && Toast.toast("复制失败，需要安装 Flash 插件")
                }), this.clip = createZClipboard(copyBtn), void 0)
            },
            copyFromSelection: function() {
                var text = this.model.getTextFromRanges();
                this.clip.setText(text)
            }
        };
        return CopyBtnMixin
    }), define("../reader/views/reading/tips/debug_form", ["jquery", "backbone", "underscore", "reader/modules/toast", "reader/modules/ga", "mod/form"], function($, Backbone, _, Toast, ga, FormUtil) {
        var DebugModel = Backbone.Model.extend({
                defaults: {
                    annotation: ""
                },
                initialize: function(attrs, options) {
                    this.articleId = options.articleId
                },
                url: function() {
                    return "/j/article_v2/" + this.articleId + "/erratum"
                }
            }),
            DebugTip = Backbone.View.extend({
                tmplHtml: $("#tmpl-debug-form").html(),
                tagName: "form",
                className: "debug-form",
                initialize: function() {
                    this.dfd = $.Deferred(), this.promise = this.dfd.promise()
                },
                events: {
                    submit: "submitDebugForm",
                    "click .ln-cancel": "cancelForm"
                },
                cancelForm: function(e) {
                    e.preventDefault(), this.dfd.reject()
                },
                submitDebugForm: function(e) {
                    e.preventDefault();
                    var form = $(e.target),
                        note = form.find("textarea[name=text]").val(),
                        debugAnnotation = this.model.toJSON();
                    debugAnnotation.note = note;
                    var formModel = new DebugModel({
                        annotation: JSON.stringify(debugAnnotation)
                    }, {
                        articleId: this.model.articleId
                    });
                    formModel.save({}, {
                        success: function() {
                            Toast.toast("非常感谢！纠错意见已成功发送"), ga._trackEvent("errorCorr")
                        },
                        error: function() {
                            Toast.toast("纠错失败")
                        }
                    }), this.dfd.resolve(formModel)
                },
                render: function() {
                    return this.$el.html(this.tmplHtml), FormUtil.ctrlEnterForm(this.$el), this
                }
            });
        return DebugTip
    }), define("../reader/views/reading/tips/btns", ["jquery", "backbone", "underscore", "reader/views/modules/create_form_in_tip", "reader/views/reading/tips/debug_form", "reader/views/reading/tips/sharing_form", "reader/views/reading/tips/mixins/copy_btn"], function($, Backbone, _, createFormInTip, DebugForm, SharingForm, CopyBtnMixin) {
        var BtnsTip = Backbone.View.extend({
            className: "action-list",
            tagName: "ul",
            tmplButton: _.template('<li><button class="{{=klass}}">{{=name}}</button>'),
            btns: {
                underline: "划线",
                del: "取消划线",
                note: "批注",
                sharing: "分享",
                debug: "纠错",
                copy: "复制",
                open: "打开"
            },
            events: {
                "click .underline": "underline",
                "click .note": "note",
                "click .debug": "debug",
                "click .sharing": "sharing",
                "click .del": "del",
                "click .open": "open"
            },
            initialize: function(options) {
                this.btnList = options.btnList, this.container = options.container
            },
            render: function() {
                var tmpl = this.tmplButton,
                    btns = this.btns,
                    self = this;
                return _.each(this.btnList, function(name) {
                    self.$el.append(tmpl({
                        klass: name,
                        name: btns[name]
                    }))
                }), this.createCopyBtn(), this
            },
            underline: $.noop,
            del: $.noop,
            sharing: function() {
                this.createFormInTip(SharingForm, {
                    model: this.model,
                    isNote: this.model.isNote(),
                    url: "/j/share/rec_works_piece",
                    extraParam: {
                        annotation: JSON.stringify(this.model.toJSON()),
                        works_id: this.model.articleId
                    }
                })
            },
            debug: function() {
                this.createFormInTip(DebugForm, {
                    model: this.model
                })
            },
            open: function() {
                var text = $.trim(this.model.getTextFromRanges());
                window.open(text)
            },
            note: $.noop,
            createFormInTip: function(View, viewOptions, options) {
                options || (options = {});
                var form = createFormInTip(this.container, View, viewOptions, {
                        autoClose: !0
                    }),
                    promise = form.promise;
                return options.done && promise.done(options.done), promise.always(_.bind(this.clear, this)), this.remove(), form
            },
            clear: function() {
                this.container.hide()
            }
        });
        return _.extend(BtnsTip.prototype, CopyBtnMixin), BtnsTip
    }), define("../reader/views/reading/tips/underline_btns", ["jquery", "backbone", "underscore", "arkenv", "reader/app", "reader/views/reading/tips/btns", "reader/views/reading/tips/note_form", "reader/modules/open_login_and_signup"], function($, Backbone, _, arkenv, app, BtnsTip, NoteForm, openLoginAndSignup) {
        var anonymousOpenLoginDialog = function() {
                openLoginAndSignup(), this.clear()
            },
            AnonymousMixin = arkenv.me.isAnonymous ? {
                debug: anonymousOpenLoginDialog,
                sharing: anonymousOpenLoginDialog
            } : {},
            UnderlineBtns = BtnsTip.extend({
                del: function() {
                    this.model.destroy(), this.clear()
                },
                note: function() {
                    var self = this;
                    this.createFormInTip(NoteForm, {
                        model: this.model,
                        type: "create"
                    }, {
                        done: function(formModel) {
                            var CHECK_VISIBLE = !0,
                                noteModelJSON = self.model.omit("id"),
                                collection = app.getModel("article").markings,
                                note = formModel.get("text"),
                                sharing = formModel.pickAttrs("sharing", CHECK_VISIBLE);
                            _.extend(noteModelJSON, {
                                note: note,
                                type: "note",
                                visible_private: formModel.get("visible_private")
                            }), collection.add(noteModelJSON, {
                                sharing: sharing
                            })
                        }
                    })
                }
            });
        return _.extend(UnderlineBtns.prototype, AnonymousMixin), UnderlineBtns
    }), define("../reader/views/reading/marking/underline", ["jquery", "backbone", "underscore", "arkenv", "../reader/views/reading/marking/bare_underline", "reader/views/reading/tips/underline_btns", "reader/modules/open_login_and_signup"], function($, Backbone, _, arkenv, BareUnderline, UnderlineBtns, openLoginAndSignup) {
        var AnonymousMixin = arkenv.me.isAnonymous ? {
                setMarkingTips: function() {
                    openLoginAndSignup()
                }
            } : {},
            Underline = BareUnderline.extend({
                events: {
                    click: "clickOnLine",
                    mousedown: "fireMouseDownUnderMark"
                },
                initialize: function(opt) {
                    this.paragraphs = opt.paragraphs, this.markingTips = opt.markingTips, this.listenTo(this.model, "change", this.render)
                },
                fireMouseDownUnderMark: function(e) {
                    this.$el.hide(), this.fireMouseEvent(document.elementFromPoint(e.clientX, e.clientY), e), this.$el.show()
                },
                fireMouseEvent: function(obj, evt) {
                    var evtObj, fireOnThis = obj;
                    document.createEvent ? (evtObj = document.createEvent("MouseEvents"), evtObj.initMouseEvent(evt.type, !0, !0, window, evt.detail, evt.screenX, evt.screenY, evt.clientX, evt.clientY, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, evt.button, null), fireOnThis.dispatchEvent(evtObj)) : document.createEventObject && (evtObj = document.createEventObject(), fireOnThis.fireEvent("on" + evt.type, evtObj))
                },
                clickOnLine: function(e) {
                    e.stopPropagation();
                    var marking = $(e.target),
                        tip = this.markingTips;
                    this.setMarkingTips({
                        left: e.pageX,
                        top: tip.getOffsetWithin(marking).top,
                        width: 0,
                        height: 18
                    }, ["del", "note", "sharing", "copy", "debug"])
                },
                setMarkingTips: function(pointCoord, actions) {
                    var btns = new UnderlineBtns({
                        model: this.model,
                        btnList: actions,
                        container: this.markingTips
                    });
                    this.markingTips.set({
                        target: pointCoord,
                        className: "btns-tip",
                        content: btns.render().el,
                        arrowHeight: 5
                    }).show()
                }
            });
        return _.extend(Underline.prototype, AnonymousMixin), Underline
    }), define("../reader/views/reading/marking/rec_underline", ["underscore", "reader/views/reading/marking/underline"], function(_, UnderlineView) {
        return UnderlineView.extend({
            underlineClass: "underline others-underline",
            render: function() {
                this.$el.empty(), this.$el.append(this.plotRange(this.model.getRanges(), this.paragraphs, this.underlineClass));
                var lines = this.$(".others-underline"),
                    model = this.model;
                return _.delay(function() {
                    lines.css("opacity", "0")
                }, 3e3), _.delay(function() {
                    model.destroy()
                }, 5e3), this
            },
            clickOnLine: function(e) {
                e.stopPropagation()
            }
        })
    }), define("../reader/views/reading/tips/note_display", ["jquery", "backbone", "underscore", "reader/app", "mod/auto_link", "reader/views/reading/mixins/note_actions"], function($, Backbone, _, app, autoLink, noteActionsMixin) {
        var NoteDisplay = Backbone.View.extend({
            tmpl: $("#tmpl-note-display").html(),
            commentTextTmpl: $("#tmpl-annotation-comment-text").html(),
            favoriteTextTmpl: $("#tmpl-annotation-favorite-text").html(),
            className: "note-display",
            initialize: function(options) {
                this.noteTip = this.markingTips = options.markingTips, this.notes = options.notes, this.currentNote = this.notes[0], options.specificNote && (this.currentNote = options.specificNote)
            },
            events: {
                "click .share": "shareNote",
                "click .edit": "editNote",
                "click .delete": "deleteNote",
                "click .favorite": "favoriteNote",
                "click .tip-pagination a": "turnPage",
                "click .comment": "jumpComments"
            },
            render: function() {
                return this.changeToNote(this.currentNote), this
            },
            renderNote: function(note) {
                var idx = this.getNoteIndex(note),
                    model = note.model,
                    len = this.notes.length,
                    modelData = model.toJSON(),
                    ownerId = modelData.owner.user_id;
                this.$el.html(_.template(this.tmpl, {
                    note: modelData,
                    isPrivate: model.isPrivate(),
                    actions: model.getActionsList(),
                    favorited: model.isFavorited(),
                    current: idx + 1,
                    autoLink: autoLink,
                    total: len,
                    isArticleAuthor: ownerId === app.getModel("article").get("authorId")
                })), this.favoriteText = this.$(".favorite"), this.commentText = this.$(".comment"), this.privateText = this.$(".private-info"), this.shareWrapper = this.$(".share-wrapper"), 0 === idx && this.$(".prev").addClass("disabled"), idx === len - 1 && this.$(".next").addClass("disabled"), model.trigger("render:line"), this.markingTips.once("hidden", function() {
                    model.trigger("remove:line"), this.trigger("hide")
                }, this), this.updateFavorite(model), this.updateComment(model), this.updatePrivate(model)
            },
            changeToNote: function(note) {
                var model = note.model;
                this.renderNote(note), this.stopListening(this.currentNote.model), this.listenTo(model, "change:n_favorites", this.updateFavorite).listenTo(model, "change:n_comments", this.updateComment).listenTo(model, "change:visible_private", this.updatePrivate), this.currentNote = note, this.trigger("render:done", note)
            },
            jumpComments: function(e) {
                e.preventDefault();
                var currentModel = this.currentNote.model;
                app.vent.trigger("open:singleAnnotationOverlay", currentModel)
            },
            updatePrivate: function(model) {
                if (this.privateText.length) {
                    var isPrivate = model.isPrivate();
                    this.privateText[isPrivate ? "show" : "hide"](), this.shareWrapper[isPrivate ? "hide" : "show"]()
                }
            },
            updateFavorite: function(model) {
                if (this.favoriteText.length) {
                    var data = model.toJSON();
                    data.isFavorited = model.isFavorited(), this.favoriteText.html(_.template(this.favoriteTextTmpl, data))
                }
            },
            updateComment: function(model) {
                this.commentText.length && this.commentText.html(_.template(this.commentTextTmpl, model.toJSON()))
            },
            turnPage: function(e) {
                e.preventDefault();
                var tar = $(e.currentTarget),
                    isPrev = tar.hasClass("prev"),
                    currentIdx = this.getCurrentIndex();
                tar.hasClass("disabled") || (this.currentNote.removeLine(), this.changeToNote(isPrev ? this.notes[currentIdx - 1] : this.notes[currentIdx + 1]))
            },
            getCurrentIndex: function() {
                return this.getNoteIndex(this.currentNote)
            },
            getNoteIndex: function(note) {
                var index = _.indexOf(this.notes, note);
                return 0 > index ? (this.notes.push(note), this.notes.length - 1) : index
            },
            updateTipPosition: function() {
                var ARROW_HEIGHT = 10;
                this.markingTips.update(ARROW_HEIGHT)
            }
        });
        return _.extend(NoteDisplay.prototype, noteActionsMixin, {
            loginRedirectType: "page",
            _getNoteModel: function() {
                return this.currentNote.model
            }
        }), NoteDisplay
    }), define("../reader/views/reading/marking/note_dot", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/tips/note_display"], function($, Backbone, _, app, NoteDisplay) {
        var notesPriority = ["mine", "favorite", "following", "hot", "others"],
            NoteDot = Backbone.View.extend({
                className: "note-dot",
                events: {
                    click: "displayTip"
                },
                initialize: function(options) {
                    this.para = options.para, this.spanInfo = options.spanInfo, this.topOffsetFix = options.topOffsetFix || 0, this.markingTips = options.markingTips, this.assignedNotes = []
                },
                render: function() {
                    var topOffset = this.spanInfo.top + this.para[0].offsetTop;
                    topOffset += this.topOffsetFix;
                    var dotStyle = {
                            height: 10,
                            width: 10
                        },
                        dotCss = {
                            top: topOffset - dotStyle.height,
                            left: this.spanInfo.left + (this.spanInfo.width - dotStyle.width) / 2
                        };
                    return this.$el.css(dotCss), this
                },
                displayTip: function() {
                    this.displayNote()
                },
                displayNote: function(noteView) {
                    var tip = new NoteDisplay({
                            markingTips: this.markingTips,
                            notes: this.assignedNotes,
                            specificNote: noteView
                        }),
                        self = this;
                    this.tip = tip, this.markingTips.set({
                        target: this.$el,
                        className: "btns-tip",
                        content: tip.render().el
                    }).setClass("note-display-tip").show(), tip.on("render:done", function(note) {
                        tip.updateTipPosition(), self.setShowModel(note.model)
                    }), tip.on("hide", function() {
                        tip.remove(), self.tip = null, self.setShowModel(self.masterNote.model)
                    }), tip.updateTipPosition()
                },
                assignNote: function(note) {
                    this.assignedNotes.push(note), this.updateNotes()
                },
                unassignNote: function(note) {
                    var index = _.indexOf(this.assignedNotes, note);
                    this.assignedNotes.splice(index, 1), this.updateNotes()
                },
                updateNotes: function() {
                    return this.assignedNotes.length ? (this.assignedNotes = this.getSortedNotes(this.assignedNotes), this.setMasterNote(this.assignedNotes[0]), this.tip ? (this.tip.notes = this.assignedNotes, this.tip.render()) : this.setShowModel(this.masterNote.model), void 0) : (this.remove(), void 0)
                },
                setMasterNote: function(note) {
                    var model = note.model;
                    model.getShowTag(), this.masterNote = note, note.appendDot(this.$el), this.delegateEvents()
                },
                setShowModel: function(model) {
                    this.showNoteModel && this.stopListening(this.showNoteModel), this.showNoteModel = model, this.updateDotClass(), this.listenTo(model, "change:tags", this.updateDotClass)
                },
                updateDotClass: function() {
                    this.$el.removeClass(this.dotClass), this.dotClass = this.getDotClass(this.showNoteModel.getShowTag()), this.$el.addClass(this.dotClass)
                },
                getDotClass: function(type) {
                    return type + "-note"
                },
                getSortedNotes: function(notes) {
                    return _.sortBy(notes, function(note) {
                        return _.indexOf(notesPriority, note.model.getShowTag())
                    })
                }
            });
        return NoteDot
    }), define("../reader/views/reading/marking/note", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/marking/note_dot", "reader/views/reading/marking/bare_underline", "reader/views/reading/modules/build_line_info", "reader/views/reading/modules/find_span_info"], function($, Backbone, _, app, NoteDot, UnderlineView, buildLineInfoFromPara, findSpanInfo) {
        var Note = Backbone.View.extend({
            className: "note",
            initialize: function(opt) {
                this.paragraphs = opt.paragraphs, this.markingTips = opt.markingTips, this.markingManager = opt.markingManager, this.config = app.getModel("config").get("annotationsConfig"), this.listenTo(this.config, "change", this.render), this.listenTo(this.model, "render:line", this.renderLine), this.listenTo(this.model, "remove:line", this.removeLine)
            },
            render: function() {
                return this.willHide(this.model) ? this.hide() : this.show(), this.model.get("open_on_render") && this.displayInTip(), this
            },
            show: function() {
                if (!this.isShown) {
                    this.isShown = !0;
                    var pid = this.model.get("endContainerId"),
                        endOffset = this.model.get("endOffset");
                    if (pid in this.paragraphs) {
                        for (var spanInfo, para = this.paragraphs[pid], info = buildLineInfoFromPara(para), lines = info.lines, i = 0, len = lines.length; len > i && !(spanInfo = findSpanInfo(lines[i], endOffset)); ++i);
                        i >= len && (i = len - 1), spanInfo || (spanInfo = _.last(lines[i]));
                        var topOffsetFix = lines[i][0].height - 18;
                        this._renderDot(para, spanInfo, topOffsetFix)
                    }
                }
            },
            _renderDot: function(para, spanInfo, topOffsetFix) {
                var span = $(spanInfo.span),
                    cachedDot = span.data("note-dot");
                if (cachedDot) return this.dot = cachedDot, this.dot.assignNote(this), void 0;
                var topOffset = spanInfo.top + para[0].offsetTop;
                0 > topOffset || topOffset > app.pageInfo.pageHeight || (this.dot = new NoteDot({
                    para: para,
                    spanInfo: spanInfo,
                    topOffsetFix: topOffsetFix,
                    markingTips: this.markingTips
                }).render(), span.data("note-dot", this.dot), this.dot.assignNote(this))
            },
            appendDot: function(dotDom) {
                this.$el.append(dotDom)
            },
            displayInTip: function() {
                this.dot && this.dot.displayNote(this)
            },
            renderLine: function() {
                this.removeLine(), this.underline = new UnderlineView({
                    model: this.model,
                    paragraphs: this.paragraphs
                }), this.$el.append(this.underline.render().el), this.hideOtherLines()
            },
            removeLine: function() {
                this.underline && (this.underline.remove(), this.underline = null, this.showOtherLines())
            },
            hideOtherLines: function() {
                this.markingManager.hideAllLines(), this.underline.$el.addClass("highlight"), this.underline.lines.addClass("highlight")
            },
            showOtherLines: function() {
                this.markingManager.showAllLines()
            },
            willHide: function() {
                return this.config.isFilterOut(this.model) && !this.model.isRecommendation() ? !0 : !1
            },
            hide: function() {
                this.isShown && (this.dot && this.dot.unassignNote(this), this.$el.empty(), this.isShown = !1)
            },
            remove: function() {
                return this.hide(), Backbone.View.prototype.remove.apply(this, arguments)
            }
        });
        return Note
    }), define("../reader/views/reading/marking/selection", ["jquery", "backbone", "underscore", "reader/views/reading/mixins/plot_marking"], function($, Backbone, _, plotMarking) {
        var Selection = Backbone.View.extend({
            className: "selection",
            initialize: function(opt) {
                this.paragraphs = opt.paragraphs, this.listenTo(this.model, "change", this.render)
            },
            render: function() {
                return this.$el.empty(), this.$el.append(this.plotRange(this.model.getRanges(), this.paragraphs, "selection")), this
            }
        });
        return _.extend(Selection.prototype, plotMarking), Selection
    }), define("../reader/views/reading/marking", ["jquery", "backbone", "underscore", "reader/views/reading/marking/underline", "reader/views/reading/marking/selection", "reader/views/reading/marking/note", "reader/views/reading/marking/rec_underline"], function($, Backbone, _, UnderlineView, SelectionView, NoteView, RecUnderlineView) {
        var ViewMap = {
                underline: UnderlineView,
                selection: SelectionView,
                note: NoteView,
                rec_underline: RecUnderlineView
            },
            MarkingView = Backbone.View.extend({
                className: "page-marking-container",
                initialize: function(opt) {
                    this.paragraphs = opt.paragraphs, this.markingTips = opt.markingTips, this.markingManager = opt.markingManager, this.listenTo(this.model, "change:type", this.render), this.listenTo(this.model, "destroy", this.remove)
                },
                render: function() {
                    this.$el.empty();
                    var type = this.model.get("type");
                    return type in ViewMap && (this.innerView = new ViewMap[type]({
                        model: this.model,
                        paragraphs: this.paragraphs,
                        markingTips: this.markingTips,
                        markingManager: this.markingManager
                    }), this.$el.append(this.innerView.el), this.innerView.render()), this
                },
                remove: function() {
                    return this.innerView.remove(), Backbone.View.prototype.remove.apply(this, arguments)
                }
            });
        return MarkingView
    }), define("../reader/views/reading/page_marking_manager", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/marking", "widget/parent_view"], function($, Backbone, _, app, MarkingView, ParentView) {
        var PageMarking = Backbone.View.extend({
            className: "markings-layer",
            initialize: function(options) {
                this.collection = options.collection, this.page = options.page, this.container = options.container, this.markingTips = options.markingTips, this.articleMarkingManager = options.articleMarkingManager, this.markingsIds = {}, this.listenTo(this.articleMarkingManager, "render:selection", this.renderSelection, this), this.listenToMarkingsAdded()
            },
            render: function() {
                return this.$el.css({
                    top: -app.pageInfo.pageHeight
                }), this
            },
            listenToMarkingsAdded: function() {
                _.each(this.page.paraPids, function(pid) {
                    _.each(["marking:" + pid + ":added", "othersNote:" + pid + ":favorited"], function(eventName) {
                        this.listenTo(this.collection, eventName, this._renderMarking)
                    }, this)
                }, this)
            },
            renderSelection: function(model) {
                var el = this._getMarkingView(model).render().el;
                this.$el.append(el)
            },
            _renderMarking: function(model) {
                if (this._canRenderOnPage(model) && !this._checkMarkingExist(model)) {
                    var markingView = this._getMarkingView(model);
                    this.$el.append(markingView.el), markingView.render()
                }
            },
            _checkMarkingExist: function(model) {
                var markingId = model.cid;
                return this.markingsIds[markingId] ? !0 : (this.markingsIds[markingId] = !0, !1)
            },
            _canRenderOnPage: function(model) {
                return !model.isOthers() || model.isRecommendation() || model.isFromUrl()
            },
            _getMarkingView: function(model) {
                return this.addSubView(new MarkingView({
                    model: model,
                    paragraphs: this.page.parasMap,
                    markingTips: this.markingTips,
                    markingManager: this
                }))
            },
            hideAllLines: function() {
                this.$el.addClass("hide-all-lines"), this.$(".highlight").removeClass("highlight")
            },
            showAllLines: function() {
                this.$el.removeClass("hide-all-lines")
            }
        });
        return _.extend(PageMarking.prototype, ParentView), PageMarking
    }), define("../reader/views/reading/article_marking_manager", ["jquery", "backbone", "underscore", "reader/app", "reader/views/reading/page_marking_manager", "reader/views/reading/mixins/create_annotations_overlay", "reader/views/reading/para_annotations_overlay/view", "reader/views/reading/single_annotation_overlay/view", "reader/views/modules/alert", "ui/dialog_new"], function($, Backbone, _, app, PageMarkingManager, createAnnotationsOverlay, ParaAnnotationsOverlay, SingleAnnotationOverlay, Alert, dialog) {
        var ArticleMarking = Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection, this.markingTips = options.markingTips, this.pagesManager = options.pagesManager, app.vent.on("markings:created", this.bindCollection, this).on("open:paraAnnotationsOverlay", this.openParaAnnotaitonsOverlay, this).on("open:singleAnnotationOverlay", this.openSingleAnnotationOverlay, this), this.listenTo(this.pagesManager, "pages:rendered", this.createPageMarkingManagers, this), this.listenTo(this.pagesManager, "render:selection", function(model) {
                    this.trigger("render:selection", model), this.currentSelectionModel = model
                }), this.listenTo(this.pagesManager, "stopRender:selection", function() {
                    this.currentSelectionModel = null
                })
            },
            openParaAnnotaitonsOverlay: function(pid) {
                var annotationModels = this.collection.getModelsByPid(pid);
                if (annotationModels.length) {
                    var view = new ParaAnnotationsOverlay({
                        annotationModels: annotationModels,
                        pid: pid
                    });
                    this.createAnnotationsOverlay(view, "para-annotations/" + pid + "/")
                }
            },
            openSingleAnnotationOverlay: function(annotationModel, pid) {
                if (!this.isInArticle(annotationModel)) return this.outRangeAlert(annotationModel);
                var view = new SingleAnnotationOverlay({
                        model: annotationModel,
                        pid: pid
                    }),
                    annotationId = annotationModel.get("id");
                this.createAnnotationsOverlay(view, "annotation/" + annotationId + "/")
            },
            createPageMarkingManagers: function(pages) {
                if (this.collection) {
                    var newPids = [];
                    _.each(pages, function(page) {
                        var markingContainer = page.$el,
                            manager = new PageMarkingManager({
                                collection: this.collection,
                                page: page,
                                container: markingContainer,
                                markingTips: this.markingTips,
                                articleMarkingManager: this
                            });
                        page.addSubView(manager), newPids = newPids.concat(page.paraPids), markingContainer.append(manager.render().el), this.currentSelectionModel && manager.renderSelection(this.currentSelectionModel)
                    }, this), this.collection.fetchByPids(_.uniq(newPids))
                }
            },
            bindCollection: function(markings) {
                this.collection && this.stopListening(this.collection), this.collection = markings;
                var isSample = app.getModel("article").get("isSample");
                isSample && this.listenTo(markings, "recommendation:added", this.checkInRangeAndAlert)
            },
            isInArticle: function(model) {
                var contentModel = app.getModel("content"),
                    pidsMap = contentModel.pidAndPageMap;
                return model.get("startContainerId") in pidsMap
            },
            outRangeAlert: function(model) {
                var articleModel = app.getModel("article"),
                    isChapter = (articleModel.id, app.getModel("config").get("isChapter")),
                    isNote = model.isNote(),
                    title = "无法查看" + (isNote ? "批注" : "这段内容"),
                    content = "很抱歉，因为" + (isNote ? "批注" : "这句话") + "所在的这段内容不在可以免费试读的范围内，" + "购买后可以阅读。";
                if (isChapter) return dialog({
                    type: "tips",
                    title: title,
                    content: content
                }).addClass("general-tips").setButtons([{
                    text: "知道了"
                }]).on("confirm", function() {
                    this.close()
                }).open();
                var tmpl = $("#tmpl-alert-with-aside").html(),
                    tmplData = {
                        title: title,
                        text: content,
                        confirm: "知道了",
                        asideTitle: "",
                        asideText: "对这本书感兴趣？",
                        asideConfirm: "去购买"
                    },
                    profileUrl = "/" + articleModel.getBookUrl(),
                    alert = new Alert({
                        html: _.template(tmpl, tmplData)
                    });
                alert.el.find(".aside-confirm").attr("href", profileUrl).attr("target", "_blank")
            },
            checkInRangeAndAlert: function(model) {
                this.isInArticle(model) || this.outRangeAlert(model)
            }
        });
        return _.extend(ArticleMarking.prototype, createAnnotationsOverlay), ArticleMarking
    }), define("../reader/views/reading/modules/tiny_pagination", ["jquery", "backbone", "underscore", "reader/app"], function($, Backbone, _, app) {
        function constrain(value, min, max) {
            return value = value || 0, Math.max(Math.min(value, max), min)
        }

        function continuousUntilLeave(el, cb, interval) {
            var timer, caller, stoped = !1;
            caller = function() {
                stoped || (cb(), timer = setTimeout(caller, interval))
            }, el.one("mouseleave", function() {
                stoped = !0
            }), caller()
        }
        var TinyPagination = Backbone.View.extend({
            el: ".tiny-pagination-layer",
            events: {
                "mouseenter .tiny-page-switcher": "processTurning",
                "mousemove .tiny-page-switcher": "stopPropagation"
            },
            initialize: function() {
                _.bindAll(this, ["renderSwitchers"]), this.configModel = app.getModel("config"), this.scrollBody = $("html, body"), app.vent.on("pages:layout:finish", this.renderSwitchers)
            },
            render: function() {
                return this.switcherEl = this.$(".tiny-page-switcher"), this.prevEl = this.$(".page-prev-switcher"), this.nextEl = this.$(".page-next-switcher"), this
            },
            enable: function() {
                this.$el.attr("page-distance", 0)
            },
            disable: $.noop,
            minHeaderSwitcherHeight: 40,
            maxHeaderSwitcherHeight: 80,
            minFooterSwitcherHeight: 30,
            maxFooterSwitcherHeight: 40,
            bufferZoneHeight: 5,
            renderSwitchers: function() {
                var page = $(".page").eq(0),
                    pageHeaderHeight = parseInt(page.css("padding-top"), 10),
                    pageBodyHeight = page.find(".bd").height(),
                    pageFooterHeight = page.outerHeight() - pageHeaderHeight - pageBodyHeight;
                this.prevEl.height(constrain(pageHeaderHeight - this.bufferZoneHeight, this.minHeaderSwitcherHeight, this.maxHeaderSwitcherHeight)), this.nextEl.height(constrain(pageFooterHeight - this.bufferZoneHeight, this.minFooterSwitcherHeight, this.maxFooterSwitcherHeight))
            },
            processTurning: function(e) {
                var target = $(e.currentTarget),
                    direction = target.data("direction"),
                    isPrev = "prev" === direction,
                    layout = this.configModel.get("layout");
                if ("horizontal" === layout) {
                    var distance = 0 | target.attr("page-distence"),
                        nextDistance = distance + (isPrev ? -1 : 1);
                    nextDistance = constrain(nextDistance, -1, 1), this.$el.attr("page-distance", nextDistance), this.highlightPaginationBtn(isPrev), this.turnPage(isPrev)
                } else this.scrollPage(isPrev)
            },
            turnPage: function(isPrev) {
                var turningModel = app.getModel("turning"),
                    currPage = turningModel.get("currPage"),
                    nextDistance = isPrev ? -1 : 1;
                return turningModel.setCurrPage(currPage + nextDistance), this
            },
            highlightPaginationBtn: function(isPrev) {
                var btnSel = ".pagination .page-" + (isPrev ? "prev" : "next"),
                    btn = $(btnSel);
                btn.addClass("on"), setTimeout(_.bind(btn.removeClass, btn, "on"), 300)
            },
            scrollPage: function(isUp) {
                var triggerInterval = 200,
                    lineHeight = 16 * this.configModel.get("lineHeight"),
                    scrollBody = this.scrollBody;
                continuousUntilLeave(this.switcherEl, function() {
                    scrollBody.animate({
                        scrollTop: (isUp ? "-=" : "+=") + 2 * lineHeight + "px"
                    }, triggerInterval, "linear")
                }, triggerInterval)
            },
            stopPropagation: function(e) {
                e.stopPropagation()
            }
        });
        return TinyPagination
    }), define("../reader/views/reading/tips/selection_btns", ["jquery", "backbone", "underscore", "arkenv", "reader/views/reading/tips/btns", "reader/views/reading/tips/note_form", "reader/views/reading/modules/login_with_actions"], function($, Backbone, _, arkenv, Btns, NoteForm, LoginWithActions) {
        var SelectionBtns = Btns.extend({
                _super: Btns.prototype,
                initialize: function(options) {
                    this._super.initialize.call(this, options), this.selectionManager = options.selectionManager
                },
                underline: function(e) {
                    e.stopPropagation(), this.selectionManager.trigger("underline"), this.clear()
                },
                del: function() {
                    this.selectionManager.trigger("del"), this.clear()
                },
                note: function() {
                    var self = this;
                    this.createFormInTip(NoteForm, {
                        model: this.model,
                        type: "create"
                    }, {
                        done: function(formModel) {
                            var CHECK_VISIBLE = !0,
                                sharing = formModel.pickAttrs("sharing", CHECK_VISIBLE),
                                note = formModel.get("text");
                            self.selectionManager.convertToNote(note, {
                                sharing: sharing,
                                visible_private: formModel.get("visible_private")
                            })
                        }
                    })
                },
                clear: function() {
                    this.selectionManager.trigger("clear:selection")
                }
            }),
            promptRequireLogin = function() {
                LoginWithActions.openLoginAndSignup({
                    actions: {
                        stamp: this.model.getStamp()
                    }
                })
            },
            AnonymousMixin = {};
        return arkenv.me.isAnonymous && _.each(["note", "underline", "sharing", "debug"], function(methodName) {
            AnonymousMixin[methodName] = promptRequireLogin
        }), _.extend(SelectionBtns.prototype, AnonymousMixin), SelectionBtns
    }), define("../reader/views/reading/modules/find_point", ["jquery", "backbone", "underscore", "reader/views/reading/modules/build_line_info"], function($, Backbone, _, buildLineInfoFromPara) {
        var helper = {
                elementFromPoint: function(coord) {
                    return $(document.elementFromPoint(coord.x, coord.y))
                },
                clientOffset: function(point) {
                    var box = point[0].getBoundingClientRect();
                    return {
                        x: box.left,
                        y: box.top
                    }
                },
                isPointInsideRect: function(rect, point) {
                    var x = point.x,
                        y = point.y;
                    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom ? !0 : void 0
                },
                moveCoordToRect: function(rect, coord) {
                    var x = coord.x;
                    x > rect.right ? x = rect.right - 1 : x < rect.left && (x = rect.left + 1);
                    var y = coord.y;
                    return y < rect.top ? y = rect.top + 1 : y > rect.bottom && (y = rect.bottom - 1), {
                        x: x,
                        y: y
                    }
                }
            },
            Finder = function(e, wrapperRect, firstPoint) {
                this.wrapperRect = wrapperRect, this.currentPointIsStart = !1, this.firstPoint = firstPoint, this.setCoord({
                    x: e.clientX,
                    y: e.clientY
                }), this.find = this.findPoint, this.firstPoint || (this.getCurrentPointIsStart = $.noop)
            },
            beMinxed = {};
        return beMinxed.detectCoordFuncs = {
                isPointInsideParagraph: function() {
                    var point = helper.elementFromPoint(this.coord);
                    if (point.is(".marking") || point.hasClass("word") || point.hasClass("code-inline")) return !0;
                    var p = point;
                    return (point.is(".paragraph") || (p = point.closest(".paragraph")) && p.length > 0) && p[0].firstChild && $.trim(p.text()) ? !0 : void 0
                },
                isPointInsidePage: function() {
                    return helper.isPointInsideRect(this.wrapperRect, this.coord)
                }
            }, beMinxed.manipCoordFuncs = {
                moveCoordToPage: function() {
                    this.setCoord(helper.moveCoordToRect(this.wrapperRect, this.coord))
                },
                moveCoordToPara: function() {
                    var currentPointIsStart = this.getCurrentPointIsStart(),
                        point = this.point,
                        page = point.is(".page") ? point : point.closest(".page");
                    page.is(".page") && page.length || (page = $(".page").first());
                    for (var paraCoord, paragraphs = page.find(".paragraph"); !paragraphs.length && (page = page[currentPointIsStart ? "next" : "prev"](".page")) && page.length;) paragraphs = page.find(".paragraph");
                    do paraCoord = this.paraInSelection(page, paragraphs); while (!paraCoord && (page = page[currentPointIsStart ? "next" : "prev"](".page")) && page.length && (paragraphs = page.find(".paragraph")));
                    paraCoord && this.setCoord({
                        x: this.coord.x,
                        y: currentPointIsStart ? paraCoord.top : paraCoord.bottom
                    })
                },
                paraInSelection: function(page, paragraphs) {
                    var ret, currentPointIsStart = this.currentPointIsStart,
                        coord = this.coord,
                        pageBdRect = page.find(".bd")[0].getBoundingClientRect();
                    return currentPointIsStart || (paragraphs = $(paragraphs.get().reverse())), paragraphs.each(function() {
                        var offset = this.getBoundingClientRect(),
                            top = offset.top < pageBdRect.top ? pageBdRect.top : offset.top,
                            bottom = offset.bottom > pageBdRect.bottom ? pageBdRect.bottom : offset.bottom;
                        return top += 1, bottom -= 1, $.trim(this.innerHTML) && (currentPointIsStart && top > coord.y || !currentPointIsStart && bottom < coord.y) ? (ret = {
                            top: top,
                            bottom: bottom
                        }, !1) : void 0
                    }), ret
                },
                setCoord: function(coord) {
                    this.coord = coord, this.point = helper.elementFromPoint(this.coord)
                },
                getCurrentPointIsStart: function() {
                    var distance, pagination, firstPointOffsetToPage = this.firstPoint.offsetToPage,
                        page = this.point.closest(".page"),
                        pageOffset = page[0].getBoundingClientRect(),
                        coordToPage = {
                            y: this.coord.y - pageOffset.top,
                            x: this.coord.x - pageOffset.left
                        };
                    if (pagination = +page.data("pagination"), distance = pagination - this.firstPoint.pageId, 0 !== distance) return this.currentPointIsStart = 0 > distance, this.currentPointIsStart;
                    var currentPointIsStart = coordToPage.y < firstPointOffsetToPage.top || coordToPage.x < firstPointOffsetToPage.left && coordToPage.y < firstPointOffsetToPage.bottom;
                    return this.currentPointIsStart = currentPointIsStart, this.currentPointIsStart
                }
            }, beMinxed.findPointFromParaFuncs = {
                findPointFromPara: function() {
                    var word = this.fetchWord();
                    if (word) return word;
                    var point = this.point,
                        para = point.is(".paragraph") ? point : point.closest("p");
                    if ($.trim(para.text()) && para.is(".paragraph") && !$.nodeName(point[0], "sup")) {
                        var lineIndex, ret, info = this.buildLineInfoFromPara(para),
                            paraBCR = para[0].getBoundingClientRect(),
                            paraX = this.coord.x - paraBCR.left,
                            paraY = this.coord.y - paraBCR.top;
                        $.each(info.index.top, function(index, top) {
                            if (top > paraY) {
                                var bottom = info.index.bottom[index - 1];
                                return lineIndex = bottom && bottom >= paraY ? index - 1 : index, !1
                            }
                        }), _.isUndefined(lineIndex) && (lineIndex = info.lines.length - 1);
                        var line = info.lines[lineIndex];
                        $.each(line, function(index, span) {
                            return span.left > paraX ? (index = index > 0 ? index - 1 : index, ret = line[index], !1) : void 0
                        }), _.isUndefined(ret) && (ret = line[line.length - 1]);
                        var clientRect, span = ret.span;
                        return this.word = $(span), clientRect = ret.lineBreak ? span.getClientRects()[0] : span.getBoundingClientRect(), this.coord = helper.moveCoordToRect(clientRect, this.coord), this.word
                    }
                },
                buildLineInfoFromPara: buildLineInfoFromPara,
                getParaHeaderRect: function(paraRect, firstSpan) {
                    var spanRect = firstSpan[0].getBoundingClientRect();
                    return {
                        top: paraRect.top,
                        right: spanRect.right,
                        bottom: spanRect.bottom,
                        left: paraRect.left,
                        height: spanRect.bottom - paraRect.top,
                        width: spanRect.right - paraRect.left,
                        spanBCR: spanRect
                    }
                },
                getParaFooterRect: function(paraRect, lastSpan, lines) {
                    var spanRect = lastSpan[0].getBoundingClientRect(),
                        obj = {
                            top: spanRect.top,
                            right: paraRect.right,
                            bottom: paraRect.bottom,
                            left: spanRect.left,
                            height: spanRect.top - paraRect.bottom,
                            width: paraRect.right - spanRect.right,
                            spanBCR: spanRect
                        };
                    return lines.length > 1 ? (obj.top = lines[lines.length - 2].top, obj.height = obj.top - paraRect.bottom) : (obj.top = paraRect.top, obj.height = paraRect.bottom - paraRect.top), obj
                }
            }, _.extend(Finder.prototype, {
                findPoint: function() {
                    try {
                        this.isPointInsidePage() || this.moveCoordToPage(), this.isPointInsideParagraph() || this.moveCoordToPara(), this.findPointFromPara()
                    } catch (e) {
                        if (!this.point.is(".word, .paragraph")) return;
                        throw e
                    }
                    return this.getFindResult()
                },
                getFindResult: function() {
                    if (this.word) {
                        var ret = {
                            word: this.word
                        };
                        return this.firstPoint && (ret.currentPointIsStart = this.getCurrentPointIsStart()), ret.mouseCoord = this.coord, ret
                    }
                },
                fetchWord: function() {
                    var point = this.point;
                    return point.hasClass("word") ? (this.word = point, this.word) : point.hasClass("code-inline") ? (this.word = point.parent(), this.word) : point.is(".marking") ? (this.word = this.getPointUnderMarking(), this.word) : void 0
                },
                getPointUnderMarking: function() {
                    var ret, markings = $(),
                        point = this.point;
                    if (point.is(".marking")) {
                        do point.hide(), markings = markings.add(point), point = helper.elementFromPoint(this.coord); while (point.is(".marking"));
                        return point.hasClass("word") ? ret = point : point.hasClass("code-inline") && (ret = point.parent()), markings.show(), ret
                    }
                }
            }), _.each(beMinxed, function(funcs) {
                _.extend(Finder.prototype, funcs)
            }),
            function(e, wrapperRect, firstPoint) {
                var finder = new Finder(e, wrapperRect, firstPoint);
                return finder.find()
            }
    }), define("../reader/views/reading/selection_manager", ["jquery", "backbone", "underscore", "reader/app", "reader/models/marking", "reader/views/reading/modules/find_point", "reader/views/reading/tips/selection_btns", "reader/views/reading/modules/tiny_pagination"], function($, Backbone, _, app, MarkingModel, findPoint, SelectionBtns, TinyPagination) {
        var SelectionManager = Backbone.View.extend({
            initialize: function(options) {
                this.pagesManager = options.pagesManager, this.tip = options.pagesManager.markingTips, this.tinyPagination = (new TinyPagination).render(), this.body = $("body"), this.win = $(window), this.on("clear:selection", this.clearSelection, this), this.on("underline", this.convertToUnderline), this.on("del", this.splitUnderline), app.vent.on("markings:created", function(markings) {
                    this.collection = markings
                }, this)
            },
            events: {
                "mousedown .page": "beginSelection"
            },
            setBoxInfo: function() {
                var el = this.$el.parent(),
                    box = el.offset(),
                    layout = app.getModel("config").get("layout"),
                    ARTICLE_PADDING = parseInt(el.find(".page").css("padding-left"), 10),
                    PROGRESS_BAR_HEIGHT = 5;
                this.boxInfo = {
                    top: box.top,
                    left: box.left + ARTICLE_PADDING,
                    right: box.left + el.innerWidth() - ARTICLE_PADDING,
                    bottom: "horizontal" === layout ? box.top + el.height() - PROGRESS_BAR_HEIGHT : this.win.height()
                }
            },
            findStartPointFromEvent: function(e) {
                var point = $(e.target),
                    ret = null;
                return point.hasClass("word") && (ret = point), ret
            },
            useNativeSelection: function(e) {
                var paragraph = $(e.target).closest("p"),
                    classnames = paragraph.attr("class"),
                    rAllowableType = /code|custom/gi;
                return paragraph.length && rAllowableType.test(classnames)
            },
            selectionDisabled: function(e) {
                var isDisabledPage = !!$(e.currentTarget).hasClass("selection-disabled"),
                    paragraph = $(e.target).closest("p");
                return isDisabledPage || paragraph.length && (paragraph.hasClass("headline") || paragraph.hasClass("illus"))
            },
            beginSelection: function(e) {
                if (!this.useNativeSelection(e) && !this.selectionDisabled(e)) {
                    e.preventDefault(), this.trigger("clear:selection"), this.setBoxInfo();
                    var result = findPoint(e, this.boxInfo);
                    if (result) {
                        var pointInfo = this.getInfoFromPoint(result.word, result.mouseCoord);
                        if (pointInfo) {
                            this.firstPointInfo = pointInfo;
                            var body = this.body,
                                self = this,
                                createSelectionBtns = $.proxy(this.createSelectionBtns, this);
                            body.addClass("is-selecting"), this.tinyPagination.enable(), body.on("onmousewheel" in document ? "mousewheel.create-selection" : "DOMMouseScroll.create-selection", function(e) {
                                e.preventDefault()
                            }), body.on("mousemove.create-selection", $.proxy(this.moveSelection, this)).on("mouseup.create-selection", function(e) {
                                body.removeClass("is-selecting"), self.tinyPagination.disable(), body.off(".create-selection"), self.pagesManager.trigger("stopRender:selection", this.model), self.model && self.model.isValid() ? (createSelectionBtns(e), _.defer(function() {
                                    body.on("click.clear-selection", function() {
                                        self.trigger("clear:selection")
                                    })
                                })) : self.tip.hide()
                            })
                        }
                    }
                }
            },
            createSelectionBtns: function() {
                var tip = this.tip,
                    btns = ["underline", "note", "sharing", "copy", "debug"],
                    pointInfo = this.relocatePoint(this.secondPointInfo);
                this.model.plainTextIsUrl() && btns.push("open"), this.checkSubset() && (btns[0] = "del");
                var view = new SelectionBtns({
                    model: this.model,
                    selectionManager: this,
                    container: tip,
                    btnList: btns
                });
                tip.set({
                    target: pointInfo.point,
                    content: view.render().el,
                    className: "btns-tip",
                    arrowHeight: 5,
                    preferedDirection: this.isSelectingDown() && !this.isSingleLine() ? "down" : "up"
                }).show()
            },
            checkSubset: function() {
                var lineModels = this.collection.filter(function(oldModel) {
                    return oldModel.isUnderline()
                });
                return _.any(lineModels, function(lineModel) {
                    return this.checkSingleSubset(lineModel, this.model)
                }, this)
            },
            checkSingleSubset: function(lineModel, selectionModel) {
                var lineRanges = lineModel.getRanges(),
                    selectionRanges = selectionModel.getRanges(),
                    isSubSet = _.all(selectionRanges, function(range, pid) {
                        return pid in lineRanges ? lineRanges[pid].start <= range.start && lineRanges[pid].end >= range.end : !1
                    });
                return isSubSet && (this.containerModel = lineModel), isSubSet
            },
            splitUnderline: function() {
                if (this.containerModel) {
                    var containerPoints = this.containerModel.getPoints(),
                        selectionPoints = _.clone(this.info);
                    containerPoints.start.containerId === selectionPoints.start.containerId && containerPoints.start.offset >= selectionPoints.start.offset ? this.containerModel.destroy() : (selectionPoints.start.offset -= 1, this.containerModel.setViaPoints(containerPoints.start, this.info.start), this.containerModel.save()), containerPoints.end.containerId === selectionPoints.end.containerId && containerPoints.end.offset <= selectionPoints.end.offset ? this.clearSelection() : (selectionPoints.end.offset += 1, this.model.setViaPoints(this.info.end, containerPoints.end), this.convertToUnderline()), this.containerModel = null
                }
            },
            moveSelection: _.throttle(function(e) {
                try {
                    e.preventDefault()
                } catch (err) {}
                var pointInfo, result = findPoint(e, this.boxInfo, this.firstPointInfo);
                result && (pointInfo = this.getInfoFromPoint(result.word, result.mouseCoord), pointInfo && (this.prevResultWord && this.prevResultWord === pointInfo.point || (this.prevResultWord = pointInfo.point, this.secondPointInfo = pointInfo, this.currentPointIsStart = result.currentPointIsStart, this.info = this.getPointsInfoOrderByPosition(), this.renderSelection(this.info))))
            }, 10),
            getPointsInfoOrderByPosition: function() {
                var firstPointInfo = _.clone(this.relocatePoint(this.firstPointInfo)),
                    secondPointInfo = _.clone(this.relocatePoint(this.secondPointInfo)),
                    points = {
                        start: firstPointInfo,
                        end: firstPointInfo
                    };
                return points[this.currentPointIsStart ? "start" : "end"] = secondPointInfo, points.end.offset = points.end.offset + points.end.length - 1, points
            },
            getInfoFromPoint: function(point, mouseCoord) {
                if (point && point.length) {
                    var p = point.closest("p"),
                        offset = point.data("offset"),
                        length = point.data("length"),
                        pId = p.data("pid"),
                        page = p.closest(".page"),
                        pageId = page.data("pagination"),
                        wordOffset = point[0].getBoundingClientRect(),
                        pageOffset = page[0].getBoundingClientRect(),
                        offsetToPage = {
                            top: wordOffset.top - pageOffset.top,
                            bottom: wordOffset.bottom - pageOffset.top,
                            left: wordOffset.left - pageOffset.left,
                            right: wordOffset.right - pageOffset.left
                        };
                    return {
                        offset: offset,
                        paragraph: p,
                        containerId: pId,
                        pageId: pageId,
                        viewportOffset: wordOffset,
                        offsetToPage: offsetToPage,
                        point: point,
                        length: length,
                        mouseCoord: mouseCoord
                    }
                }
            },
            relocatePoint: function(pointInfo) {
                function processingFootPoint() {
                    return atFirstHalf ? this.getInfoFromPoint(wordBefore, mouseCoord) || pointInfo : pointInfo
                }

                function processingHeadPoint() {
                    return atFirstHalf ? pointInfo : this.getInfoFromPoint(wordAfter, mouseCoord) || pointInfo
                }
                if (pointInfo.length > 1) return pointInfo;
                var isSelectingDown = this.isSelectingDown(pointInfo),
                    isFirstPoint = this.isFirstPoint(pointInfo),
                    p = pointInfo.paragraph,
                    offset = pointInfo.offset,
                    rect = pointInfo.viewportOffset,
                    mouseCoord = pointInfo.mouseCoord,
                    wordBefore = p.find("[data-offset=" + (offset - 1) + "]"),
                    wordAfter = p.find("[data-offset=" + (offset + 1) + "]"),
                    pointMiddleX = (rect.left + rect.right) / 2,
                    atFirstHalf = mouseCoord.x < pointMiddleX;
                return processingFootPoint = _.bind(processingFootPoint, this), processingHeadPoint = _.bind(processingHeadPoint, this), isSelectingDown ? isFirstPoint ? processingHeadPoint() : processingFootPoint() : isFirstPoint ? processingFootPoint() : processingHeadPoint()
            },
            isSelectingDown: function() {
                return this.isFirstPoint(this.secondPointInfo) ? this.secondPointInfo.mouseCoord.x > this.firstPointInfo.mouseCoord.x : !this.currentPointIsStart
            },
            isFirstPoint: function(pointInfo) {
                return pointInfo.point === this.firstPointInfo.point
            },
            isSingleLine: function() {
                return this.firstPointInfo.viewportOffset.top === this.secondPointInfo.viewportOffset.top
            },
            renderSelection: function(info) {
                this.getModel(info)
            },
            clearSelection: function() {
                this.body.off(".clear-selection"), this.tip.hide(), this.tip.find("textarea").blur(), this.model && this.model.destroy()
            },
            getEmptyModelAttr: function() {
                return {
                    middleContainers: [],
                    type: "selection"
                }
            },
            getModel: function(info) {
                if (!this.model) {
                    var paragraphsIndex = (this.pagesManager, app.getModel("content").getParasIndexs()),
                        articleId = app.getModel("article").id;
                    this.model = new MarkingModel({
                        type: "selection"
                    }, {
                        articleId: articleId,
                        paragraphsIndex: paragraphsIndex
                    }), this.model.on("destroy", function() {
                        this.model = null
                    }, this), this.pagesManager.trigger("render:selection", this.model)
                }
                return this.model.setViaPoints(info.start, info.end)
            },
            convertToNote: function(note, options) {
                this.convertTo("note", {
                    note: note,
                    visible_private: options.visible_private
                }, options)
            },
            convertToUnderline: function() {
                this.convertTo("underline")
            },
            convertTo: function(type, extraAttrs, options) {
                this.model && (this.collection.addFromSelection(this.model, type, extraAttrs, options), this.model.destroy())
            },
            unbindAll: function() {
                this.stopListening(), this.undelegateEvents()
            }
        });
        return SelectionManager
    }), define("widget/require-cdn", ["jquery", "underscore"], function($, _) {
        function RequireCdn(opts) {
            this.opts = _.defaults(opts, defaultOpts), this.opts.useDist && (this.opts.cdnUrlPrefix += "ark/js/dist/lib/")
        }
        var mods = {},
            r = require,
            defaultOpts = {
                nameToUrlPath: function(name) {
                    return name + ".js"
                },
                cdnUrlPrefix: Ark.CDN_FOR_STATIC_LIB,
                useDist: !1
            };
        return _.extend(RequireCdn.prototype, {
            r: function(mod, callback, opts) {
                if (opts = opts || {}, _.defaults(opts, this.opts), !(mod in mods)) {
                    var modUrl = mods[mod] = this.nameToUrl(mod);
                    define(mod, modUrl)
                }
                r(mod, callback)
            },
            nameToUrl: function(name) {
                return this.opts.cdnUrlPrefix + this.opts.nameToUrlPath(name)
            }
        }), RequireCdn
    }), define("widget/syntax_highlight", ["jquery", "underscore", "widget/require-cdn"], function($, _, RequireCdn) {
        var modPrefix = "libs/highlight/7.2/",
            highlightMod = modPrefix + "highlight",
            requireCdn = new RequireCdn({
                nameToUrlPath: function(name) {
                    return name + ".min.js"
                }
            }),
            Highlighter = {
                languages: ["1c", "actionscript", "apache", "avrasm", "axapta", "bash", "clojure", "cmake", "coffeescript", "cpp", "cs", "css", "d", "delphi", "diff", "django", "dos", "erlang-repl", "erlang", "glsl", "go", "haskell", "http", "ini", "java", "javascript", "json", "lisp", "lua", "matlab", "mel", "nginx", "objectivec", "parser3", "perl", "php", "profile", "python", "r", "rib", "rsl", "ruby", "rust", "scala", "smalltalk", "sql", "tex", "vala", "vbscript", "vhdl", "xml"].sort(),
                defaultLanguage: "javascript",
                renderText: function(text, language) {
                    var codeText = _.unescape(text),
                        dfd = $.Deferred();
                    return language = language || this.defaultLanguage, -1 === _.indexOf(this.languages, language, !0) ? (dfd.resolve(_.escape(codeText)), dfd.promise()) : (requireCdn.r(highlightMod, function() {
                        var Hljs = window.hljs,
                            modName = modPrefix + "languages/" + language;
                        requireCdn.r(modName, function() {
                            dfd.resolve(Hljs.highlight(language, codeText).value)
                        })
                    }), dfd.promise())
                }
            };
        return Highlighter
    }), define("../reader/views/reading/para_annotation_counter", ["jquery", "backbone", "underscore", "reader/app"], function($, Backbone, _, app) {
        var AnnotationCounter = Backbone.View.extend({
            className: "annotation-counter",
            tagName: "a",
            initialize: function(options) {
                this.para = options.para, this.pid = this.para.data("pid"), this.markings = options.markings, this.listenToMarkingsMap(), this.currentCounter = 0
            },
            events: {
                click: "openAnnotationsPage"
            },
            openAnnotationsPage: function(e) {
                e.preventDefault(), app.vent.trigger("open:paraAnnotationsOverlay", this.pid)
            },
            listenToMarkingsMap: function() {
                var eventNames = "";
                _.each(["added", "removed"], function(eventName) {
                    eventNames += "markingsMap:" + this.pid + ":" + eventName + " "
                }, this), this.listenTo(this.markings, eventNames, function() {
                    this.updateNumber()
                }, this)
            },
            updateNumber: function() {
                var map = this.markings.markingsMap,
                    counter = map.getNoteCounterByPid(this.pid);
                return counter ? (this.currentCounter || this.$el.show(), this.currentCounter !== counter && (this.currentCounter = counter, this.$el.text(counter > 99 ? "99+" : counter)), void 0) : (this.currentCounter = 0, this.$el.hide(), void 0)
            },
            render: function() {
                var para = this.para[0],
                    offsetTop = para.offsetTop,
                    marginTop = this.para.data("offset"),
                    layout = app.getModel("config").get("layout"),
                    emHeight = 16;
                return "horizontal" === layout && marginTop && (offsetTop = para.offsetTop + marginTop * emHeight), this.$el.css({
                    top: offsetTop + 8,
                    right: -33
                }), this.updateNumber(), this
            }
        });
        return AnnotationCounter
    }), define("../reader/views/reading/annotation_counter_layer", ["jquery", "backbone", "underscore", "reader/app", "widget/parent_view", "reader/views/reading/para_annotation_counter"], function($, Backbone, _, app, ParentView, ParaAnnotationCounter) {
        var AnnotationCounter = Backbone.View.extend({
            className: "annotation-counter-layer",
            initialize: function(options) {
                this.config = app.getModel("config"), this.page = options.page;
                var annotationsConfig = this.config.get("annotationsConfig");
                this.listenTo(annotationsConfig, "change:showOthers", this.onAnnotationsConfigChange), this.$el.toggle(annotationsConfig.get("showOthers"))
            },
            render: function() {
                var paras = this.page.paras.filter(".paragraph"),
                    self = this,
                    markings = app.getModel("article").markings,
                    layout = this.config.get("layout");
                return paras.each(function() {
                    var para = $(this);
                    if (("horizontal" === layout || !para.data("offset")) && $.trim(para.text()).length) {
                        var counter = (para.data("pid"), new ParaAnnotationCounter({
                            para: para,
                            markings: markings
                        }));
                        self.addSubView(counter), self.$el.append(counter.render().el)
                    }
                }), this.$el.css({
                    top: -app.pageInfo.pageHeight
                }), this
            },
            onAnnotationsConfigChange: function(model, showOthers) {
                this.$el.toggle(showOthers)
            }
        });
        return _.extend(AnnotationCounter.prototype, ParentView), AnnotationCounter
    }), define("../reader/views/reading/page", ["jquery", "backbone", "underscore", "reader/app", "reader/consts", "reader/modules/browser", "reader/modules/create_zclipboard", "reader/modules/toast", "widget/parent_view", "reader/views/mixins/purchase_button", "reader/views/reading/annotation_counter_layer", "widget/syntax_highlight", "mod/timeformat", "mod/truncate"], function($, Backbone, _, app, consts, browser, createZClipboard, Toast, ParentView, PurchaseButton, AnnotationCounterLayer, Highlighter, timeformat, truncate) {
        var Page = Backbone.View.extend({
            className: "page",
            tmplPage: $("#tmpl-page").html(),
            tmplSampleChapterPage: $("#tmpl-sample-chapter-page").html(),
            initialize: function(options) {
                _.bindAll(this, "showCodeToolbar"), this.vent = app.vent, this.data = options.data, this.markingTips = options.markingTips, this.turningModel = app.getModel("turning"), this.isSampleChapter = app.getModel("config").get("isChapter") && app.getModel("chapters").currChapterNeedBuy(), this.isSampleChapter ? this.initSampleChapterPage() : this.initNormalPage()
            },
            initNormalPage: function() {
                this.pagination = this.data.page.pagination, this.on("render:selection", this.renderSelection, this), this.on("render:done", function() {
                    this.paras = this.getParas(), this.parasMap = this.getParasMap(), this.paraPids = this.getPids()
                }, this), browser.fitForDesktop && this.on("page:appended", function() {
                    this.createAnnotationCounterLayer()
                }, this)
            },
            initSampleChapterPage: function() {
                this.$el.addClass("selection-disabled")
            },
            events: {
                "mouseenter .code": "showCodeToolbar",
                "mouseleave .code": "hideCodeToolbar"
            },
            render: function() {
                return this.isSampleChapter ? this.renderSampleChapterPage() : this.renderNormalPage(), this.trigger("render:done"), this
            },
            renderNormalPage: function() {
                var pagination = this.data.page.pagination,
                    worksId = this.data.id,
                    isChapter = app.getModel("config").get("isChapter"),
                    columnId = isChapter && app.getModel("column").toJSON().id,
                    worksUrl = (isChapter ? ["/column", columnId, "chapter", worksId, ""] : ["/ebook", worksId, ""]).join("/");
                this.setPageOffsetTop(), this.$el.html(_.template(this.tmplPage, _.extend(this.data, {
                    url: worksUrl,
                    readPageNum: this.turningModel.real2read(pagination)
                }))), this.highlightCode(), this.$el.attr("data-pagination", this.pagination)
            },
            setPageOffsetTop: function() {
                var configModel = app.getModel("config");
                if ("vertical" === configModel.get("layout")) {
                    var pageHeight = configModel.getPageHeightEm(),
                        pagination = this.data.page.pagination,
                        innerPadding = consts.reading.READER_INNER_PADDING_EM,
                        pageTop = pageHeight * (pagination - 1) + innerPadding;
                    this.$el.css({
                        top: pageTop + "em",
                        position: "absolute"
                    })
                }
            },
            renderSampleChapterPage: function() {
                var chapters = app.getModel("chapters"),
                    chapterData = chapters.getCurrChapter().toJSON(),
                    columnData = app.getModel("column").toJSON(),
                    tmplData = _.extend(this.data, {
                        chapter: chapterData,
                        column: columnData,
                        chapterNum: chapters.getCurrIndex() + 1,
                        readPageNum: this.turningModel.real2read(this.data.page.pagination),
                        sec2date: timeformat.sec2date,
                        truncate: truncate
                    });
                this.$el.html(_.template(this.tmplSampleChapterPage, tmplData)), this.$el.attr("data-pagination", this.pagination);
                var chapterId = chapterData.id,
                    columnId = columnData.id,
                    worksUrl = ["/column", columnId, "chapter", chapterId].join("/"),
                    readerUrl = "/reader" + worksUrl,
                    chapterDataForButton = _.extend(chapterData, {
                        url: worksUrl,
                        is_large_btn: !0,
                        is_hollow_btn: !0,
                        redirect_url: readerUrl,
                        is_mobile_direct_purchase: browser.fitForMobile,
                        columnId: columnId
                    }),
                    purchaseButton = new PurchaseButton;
                this.$el.find(".purchase-section").html(purchaseButton.render({
                    data: chapterDataForButton
                }).$el), _.delay(function() {
                    app.utils.applyPurchaseWithIn("[data-widget=faster-purchase]", ".sample-chapter-page")
                }, 0)
            },
            createAnnotationCounterLayer: function() {
                var annotationCounterLayer = new AnnotationCounterLayer({
                    page: this
                });
                this.addSubView(annotationCounterLayer), this.$el.append(annotationCounterLayer.render().$el)
            },
            getParasMap: function() {
                var paragraphs = {};
                return this.paras.each(function() {
                    var para = $(this);
                    paragraphs["" + para.data("pid")] = para
                }), paragraphs
            },
            getPids: function() {
                return _.keys(this.parasMap)
            },
            getParas: function() {
                return this.$el.find("p[data-pid]")
            },
            isCurrPage: function() {
                return this.data.page.pagination === this.turningModel.get("currPage")
            },
            highlightCode: function() {
                function highlightElem(elem, language) {
                    Highlighter.renderText(elem.html(), language).done(function(renderedText) {
                        elem.html(renderedText)
                    })
                }
                var codeBlocks = this.$el.find(".code code");
                codeBlocks.length && codeBlocks.each(function(i, elem) {
                    var codeBlock = $(elem),
                        language = codeBlock.data("language"),
                        isLineSplited = codeBlock.hasClass("line-split");
                    isLineSplited ? codeBlock.children(".line").each(function(j, line) {
                        highlightElem($(line), language)
                    }) : highlightElem(codeBlock, language)
                })
            },
            showCodeToolbar: function(e) {
                var codeSection = $(e.currentTarget),
                    codeBlock = codeSection.find("code"),
                    sectionOffset = codeSection.css("margin-top"),
                    iconTop = Math.abs(parseInt(sectionOffset, 10));
                $('<em class="arkicon-copy copy" title="复制代码"></em>').appendTo(codeSection).end().css("top", iconTop ? iconTop + 10 : 18);
                var copyBtn = this.$el.find(".copy"),
                    clipboard = createZClipboard(copyBtn);
                return window.clipboardData ? (copyBtn.one("click", function() {
                    var codeText = codeBlock.text(),
                        success = window.clipboardData.setData("TEXT", codeText);
                    Toast.toast(success ? "代码已成功复制到剪贴板" : "复制失败，浏览器禁止了复制")
                }), void 0) : (copyBtn.one("zeroclipboard-mousedown", function() {
                    var codeText = codeBlock.text();
                    clipboard.setText(codeText)
                }).one("zeroclipboard-complete", function() {
                    Toast.toast("代码已成功复制到剪贴板")
                }), void 0)
            },
            hideCodeToolbar: function(e) {
                if (!/\bcopy\b/g.test(e.target.className)) {
                    var codeSection = $(e.currentTarget);
                    codeSection.find(".copy").remove()
                }
            }
        });
        return _.extend(Page.prototype, ParentView), Page
    }), define("../mod/error", function() {
        function error() {
            if (console && console.error) try {
                console.error.apply(console, arguments)
            } catch (e) {
                if (!Function.prototype.bind) return;
                var error = Function.prototype.bind.call(console.error, console);
                error.apply(console, arguments)
            }
        }
        var console = window.console;
        return error
    }), define("../reader/collections/modules/markings_filter", ["underscore", "reader/modules/iso_time/parse"], function(_, parseIsoTime) {
        function MarkingsFilter(options) {
            this.origCollection = options.collection, this.contentModel = options.contentModel, this.limitFactor = options.limitFactor, this.LocalMarkings = options.collection.constructor.extend({
                fakeSync: !0
            })
        }
        return _.extend(MarkingsFilter.prototype, {
            filter: function(resp) {
                var tempCollection = new this.LocalMarkings([], {
                    articleId: this.id,
                    contentModel: this.contentModel
                });
                return tempCollection.add(resp), this.rejectLostParaMarkings(tempCollection), this.findHotAndAddTag(tempCollection), tempCollection.toJSON()
            },
            rejectLostParaMarkings: function(sourceCollection) {
                sourceCollection.remove(sourceCollection.reject(this.markingParasExist, this))
            },
            findHotAndAddTag: function(sourceCollection) {
                var newMarkingsMap = sourceCollection.markingsMap.getMapData(),
                    origMarkingsMap = this.origCollection.markingsMap.getMapData();
                _.each(newMarkingsMap, function(markings, pid) {
                    var origHotMarkings = _.filter(origMarkingsMap[pid], this.isHotNote),
                        newHotMarkings = _.filter(markings, this.isHotNote),
                        neededHotCount = this.paraHotNotesLimit(pid) - origHotMarkings.length - newHotMarkings.length;
                    _.chain(markings).filter(this.isCandidateHotNote, this).sortBy(this.getCreateTime, this).sortBy(this.getHotScore, this).reverse().first(neededHotCount).each(this.addHotTag)
                }, this)
            },
            isCandidateHotNote: function(marking) {
                return marking.isNote() && marking.isOthers() && !this.origCollection.get(marking.id)
            },
            addHotTag: function(marking) {
                var tags = marking.get("tags");
                tags.push("hot"), marking.set("tags", tags)
            },
            isHotNote: function(marking) {
                return _.contains(marking.get("tags"), "hot")
            },
            getHotScore: function(marking) {
                return marking.get("n_favorites")
            },
            getCreateTime: function(marking) {
                return parseIsoTime(marking.get("create_time"))
            },
            paraHotNotesLimit: function(pid) {
                var wordsLength = $("p[data-pid=" + pid + "] .word").length;
                return Math.ceil(wordsLength * this.limitFactor)
            },
            markingParasExist: function(model) {
                var pids = model.getContainerIds(),
                    contentModel = this.contentModel;
                return _.every(pids, function(pid) {
                    return contentModel.isPidExist(pid)
                })
            }
        }), MarkingsFilter
    }), define("../reader/collections/modules/markings_map", ["underscore", "backbone/events"], function(_, Events) {
        function MarkingsMap() {
            this.markingsMap = {}
        }
        return _.extend(MarkingsMap.prototype, Events, {
            get: function(pid) {
                return this.markingsMap[pid] = this.markingsMap[pid] || [], this.markingsMap[pid]
            },
            add: function(markingModel) {
                function mapMarkingIdToPid(pid) {
                    mapedMarkings = this.get(pid), _.contains(mapedMarkings, markingModel) || (mapedMarkings.push(markingModel), this.trigger("added", pid, markingModel))
                }
                var mapedMarkings, pids = (markingModel.toJSON(), this._getMapPids(markingModel));
                _.each(pids, mapMarkingIdToPid, this)
            },
            remove: function(markingModel) {
                _.each(this._getMapPids(markingModel), function(pid) {
                    this.markingsMap[pid] = _.without(this.markingsMap[pid], markingModel), this.trigger("removed", pid, markingModel)
                }, this)
            },
            _getMapPids: function(model) {
                return model.isNote() ? [model.get("endContainerId")] : model.getContainerIds()
            },
            getNoteCounterByPid: function(pid) {
                var noteArray = _.filter(this.get(pid), function(annotation) {
                    return annotation.isNote()
                });
                return noteArray.length
            },
            getByPids: function(pids) {
                var resultModelsList = _.map(pids, function(pid) {
                    return this.get(pid)
                }, this);
                return _.union.apply(this, resultModelsList)
            },
            getMapData: function() {
                return this.markingsMap
            }
        }), MarkingsMap
    }), define("../reader/collections/markings/lines_coll", ["underscore", "../reader/collections/modules/markings_map"], function(_, MarkingsMap) {
        function LinesColl() {
            this.pidToUnderlinesMap = new MarkingsMap
        }
        return _.extend(LinesColl.prototype, {
            add: function(model) {
                this.pidToUnderlinesMap.add(model)
            },
            remove: function(model) {
                this.pidToUnderlinesMap.remove(model)
            },
            getRelatedModels: function(model) {
                var models = [];
                return _.each(model.getRanges(), function(data, pid) {
                    var underlines = this.pidToUnderlinesMap.get(pid);
                    models = models.concat(underlines)
                }, this), _.uniq(models)
            },
            getModelsToMerge: function(model) {
                var modelsToMerge = [];
                return _.each(this.getRelatedModels(model), function(oldModel) {
                    oldModel.checkConflict(model) && modelsToMerge.push(oldModel)
                }), modelsToMerge
            }
        }), LinesColl
    }), define("../reader/modules/collection_add_dup", ["backbone", "underscore", "jquery"], function(Backbone, _, $) {
        var CProto = Backbone.Collection.prototype;
        return {
            add: function(models, options) {
                models = $.makeArray(models), models = _.forEach(models, function(m) {
                    var r = this.get(m.id || m.cid);
                    r ? r.set(m) : CProto.add.call(this, m, options)
                }, this)
            },
            push: function(model, options) {
                var r = this.get(model.id || model.cid);
                return r ? (r.set(model), r) : CProto.push.call(this, model, options)
            }
        }
    }), define("../reader/modules/resolved_promise", ["jquery"], function($) {
        return function() {
            var dfd = new $.Deferred,
                promise = dfd.promise();
            return arguments.length ? dfd.resolve.apply(promise, arguments) : dfd.resolve(), promise
        }
    }), define("../reader/collections/markings/index", ["backbone", "underscore", "reader/app", "reader/modules/ga", "reader/modules/resolved_promise", "reader/modules/collection_add_dup", "reader/models/marking", "../reader/collections/markings/lines_coll", "../reader/collections/modules/markings_map", "../reader/collections/modules/markings_filter", "mod/error"], function(Backbone, _, app, ga, resolvedPromise, CollectionAddDup, MarkingModel, LinesColl, MarkingsMap, MarkingsFilter, error) {
        var Markings = Backbone.Collection.extend({
            model: MarkingModel,
            url: function() {
                return "/j/article_v2/" + this.articleId + "/annotations_by_paragraphs"
            },
            addFromSelection: function(selectionModel, type, extraAttrs, options) {
                var modelAttrs = _.extend(selectionModel.toJSON(), {
                    type: type
                }, extraAttrs, {
                    tags: ["mine"]
                });
                return "underline" === type ? this.addUnderline(modelAttrs) : (this.add(modelAttrs, options), void 0)
            },
            addUnderline: function(modelOrAttrs) {
                var model = modelOrAttrs instanceof MarkingModel ? modelOrAttrs : new MarkingModel(modelOrAttrs, {
                        articleId: this.articleId,
                        paragraphsIndex: this.paragraphsIndex
                    }),
                    modelsToMerge = this.linesColl.getModelsToMerge(model);
                modelsToMerge.length && model.merge(modelsToMerge), this.add(model)
            },
            initialize: function(models, options) {
                this.articleId = options.articleId, this.contentModel = options.contentModel, this.paragraphsIndex = this.contentModel.getParasIndexs(), this.linesColl = new LinesColl, this.markingsMap = new MarkingsMap, this.cachedPids = {};
                var self = this;
                this.on("add", function(model, collection, options) {
                    this.addToMap(model, collection, options), this.broadcastWithPid("marking:{{pid}}:added", model)
                }, this), this.on("effectiveChange", function(model, options) {
                    return model.isUnderline() ? (self.linesColl.remove(model), self.linesColl.add(model), self.markingsMap.remove(model), self.markingsMap.add(model), void 0) : (model.save({}, options), void 0)
                }), this.on("remove", function(model) {
                    this.removeFromMap(model), this.broadcastWithPid("marking:{{pid}}:removed", model)
                }), _.each(["added", "removed"], function(eventName) {
                    this.markingsMap.on(eventName, function(pid, model) {
                        this.trigger("markingsMap:" + pid + ":" + eventName, model)
                    }, this)
                }, this)
            },
            addToMap: function(model, collection, options) {
                var self = this;
                model.isRecommendation() && this.trigger("recommendation:added", model), this.markingsMap.add(model), model.isUnderline() && this.linesColl.add(model), model.isNew() && model.save({}, options).done(function() {
                    self.trackAddByGa(model.get("type"))
                })
            },
            removeFromMap: function(model) {
                this.markingsMap.remove(model), model.isUnderline() && this.linesColl.remove(model)
            },
            trackAddByGa: function(modelType) {
                var gaEvent, type = modelType;
                switch (type) {
                    case "underline":
                        gaEvent = "underline";
                        break;
                    case "note":
                        gaEvent = "note";
                        break;
                    case "rec_underline":
                        break;
                    default:
                        error("modelType is invalid")
                }
                ga._trackEvent(gaEvent)
            },
            notCachedPids: function(neededPids) {
                return _.difference(neededPids, _.keys(this.cachedPids))
            },
            addCachedPids: function(pids) {
                _.each(pids, function(pid) {
                    this.cachedPids[pid] = !0
                }, this)
            },
            fetchByPids: function(pids) {
                var notCachedPids = this.notCachedPids(pids),
                    cachedModels = this.markingsMap.getByPids(pids),
                    self = this;
                return _.each(cachedModels, function(model) {
                    self.broadcastWithPid("marking:{{pid}}:added", model)
                }), notCachedPids.length ? this.fetch({
                    data: {
                        paragraph_ids: notCachedPids.join(",")
                    },
                    remove: !1,
                    success: function() {
                        self.addCachedPids(notCachedPids)
                    }
                }) : resolvedPromise()
            },
            getModelsByPid: function(pid) {
                return this.markingsMap.get(pid)
            },
            parse: function(resp) {
                return this.markingsFilter || (this.markingsFilter = new MarkingsFilter({
                    collection: this,
                    limitFactor: .2,
                    contentModel: this.contentModel
                })), this.markingsFilter.filter(resp)
            },
            broadcastWithPid: function(eventTmpl, model) {
                _.each(model.getContainerIds(), function(pid) {
                    this.trigger(eventTmpl.replace("{{pid}}", pid), model)
                }, this)
            }
        });
        return _.extend(Markings.prototype, CollectionAddDup), Markings
    }), define("../reader/views/reading/pages_container", ["jquery", "backbone", "underscore", "arkenv", "reader/app", "reader/collections/markings/index", "widget/parent_view", "reader/views/reading/page", "reader/views/reading/selection_manager", "reader/views/reading/article_marking_manager", "reader/views/reading/modules/build_line_info", "reader/views/reading/modules/simple_page", "reader/modules/browser", "reader/modules/tooltip", "reader/modules/get_para_html"], function($, Backbone, _, arkenv, app, MarkingsCollection, ParentView, Page, SelectionManager, ArticleMarkingManager, buildLineInfo, SimplePage, browser, Tooltip, getParaHtml) {
        var PagesContainer = Backbone.View.extend({
            el: ".article .inner",
            tmplParagraph: $("#tmpl-paragraph").html(),
            initialize: function(options) {
                this.app = options.app, this.vent = options.vent, this.config = app.getModel("config"), this.pages = [], this.markingTips = new Tooltip, browser.fitForDesktop && (app.vent.on("model:content:set", this.createMarkingsCollection, this), this.createSelectionManager(), this.createArticleMarkingManager()), app.vent.on("model:article:set", this.configFixedHeader, this).on("model:article:set", this.addSampleTip, this).on("model:article:set", this.addTmplDefalultData, this), this.listenTo(this.config, "goto:stamp", this.jumpStamp), this.listenTo(this.config, "change:hasFixedPageHeader", this.updateFixedHeader, this), this.on("pages:rendered", this.updateFixedHeader, this)
            },
            configFixedHeader: function(articleModel) {
                var hasLoginTip = arkenv.me.isAnonymous,
                    hasSampleTip = articleModel.get("isSample"),
                    hasAddingTip = !arkenv.me.isAnonymous && !articleModel.get("hasAdded") && !this.config.get("isChapter");
                this.config.set("hasFixedPageHeader", hasLoginTip || hasSampleTip || hasAddingTip)
            },
            updateFixedHeader: function() {
                if ("horizontal" !== this.config.get("layout")) {
                    var hasFixedPageHeader = this.config.get("hasFixedPageHeader");
                    if (hasFixedPageHeader) {
                        var currPage = this.getCurrPage();
                        if (!currPage) return;
                        currPage.$el.find(".hd").addClass("fixed-sample-tip")
                    } else this.$(".page").find(".hd").removeClass("fixed-sample-tip")
                }
            },
            addSampleTip: function(article) {
                article.get("hasAdded") || article.on("change:hasAdded", function(model, value) {
                    value && (this.configFixedHeader(article), this.$(".lnk-collect").remove())
                }, this)
            },
            addTmplDefalultData: function(article) {
                this.defaultData = _.defaults({
                    getParaHtml: getParaHtml
                }, article.attributes)
            },
            empty: function() {
                this.pages = [], this.removeAllSubView()
            },
            jumpStamp: function(stamp) {
                var page = SimplePage.getByStamp(stamp),
                    pageNumber = page && page.pagination;
                app.getModel("article"), app.getModel("turning").setCurrPage(pageNumber)
            },
            createPage: function(targetPage) {
                var articleModel = app.getModel("article"),
                    contentModel = app.getModel("content"),
                    hasAdded = articleModel.get("hasAdded"),
                    page = this.addSubView(new Page({
                        data: _.defaults({
                            page: targetPage,
                            hasAdded: hasAdded
                        }, this.defaultData),
                        markingTips: this.markingTips,
                        content: contentModel
                    }));
                return page
            },
            getCurrPage: function() {
                for (var page, i = 0, ilen = this.pages.length; ilen > i; i++)
                    if (page = this.pages[i], this.pages[i].isCurrPage()) return page
            },
            render: function(opts) {
                opts = opts || {}, opts.layout = opts.layout || "horizontal";
                var targetPages;
                return targetPages = "horizontal" === opts.layout ? this.getHorizontalPages() : this.getVerticalPages(), targetPages && targetPages.length || (targetPages = [{}]), this.renderPages(targetPages), this
            },
            getHorizontalPages: function() {
                var turningModel = app.getModel("turning"),
                    currPage = turningModel.get("currPage");
                return this.getPreloadPages(currPage, 1)
            },
            renderAllPagesThreshold: 20,
            getVerticalPages: function() {
                var turningModel = app.getModel("turning"),
                    currPage = turningModel.get("currPage"),
                    totalPage = turningModel.get("totalPage");
                return totalPage <= this.renderAllPagesThreshold || "c" === arkenv.works.type ? app.getModel("content").getPages() : this.getPreloadPages(currPage, 2)
            },
            getPreloadPages: function(currPage, preloadCount) {
                preloadCount = preloadCount || 1;
                var contentModel = app.getModel("content"),
                    startPage = Math.max(0, currPage - preloadCount - 1),
                    endPage = currPage + preloadCount;
                return contentModel.getPages(startPage, endPage)
            },
            renderPages: function(targetPages) {
                var newPages = [],
                    pagesToRemove = [],
                    pagesToKeep = [],
                    existingPaginations = _.pluck(this.pages, "pagination");
                if (_.pluck(targetPages, "pagination"), _.each(targetPages, function(targetPage) {
                        var existIndex = _.indexOf(existingPaginations, targetPage.pagination); - 1 !== existIndex ? pagesToKeep.push(this.pages[existIndex]) : newPages.push(this.createPage(targetPage).render())
                    }, this), pagesToRemove = _.difference(this.pages, pagesToKeep), _.each(pagesToRemove, function(page) {
                        page.$el.hide().removeClass(), _.defer(_.bind(page.remove, page))
                    }), this.pages = _.sortBy(pagesToKeep.concat(newPages), function(page) {
                        return page.pagination
                    }), newPages.length) {
                    var fragment = document.createDocumentFragment();
                    _.each(newPages, function(page) {
                        fragment.appendChild(page.el)
                    }, this);
                    var manipType;
                    manipType = pagesToKeep.length ? pagesToKeep[0].pagination < newPages[0].pagination ? "append" : "prepend" : "append", this.$el[manipType](fragment)
                }
                this.trigger("pages:rendered", newPages), _.each(newPages, function(page) {
                    page.trigger("page:appended")
                })
            },
            createMarkingsCollection: function(content) {
                var article = app.getModel("article"),
                    markingsCollection = new MarkingsCollection([], {
                        articleId: article.id,
                        contentModel: content
                    });
                app.vent.trigger("markings:created", markingsCollection), article.markings = markingsCollection
            },
            createArticleMarkingManager: function() {
                this.articleMarkingManager = new ArticleMarkingManager({
                    pages: this.pages,
                    pagesManager: this,
                    markingTips: this.markingTips
                })
            },
            createSelectionManager: function() {
                this.selectionManager = new SelectionManager({
                    el: this.el,
                    pagesManager: this
                })
            }
        });
        return _.extend(PagesContainer.prototype, ParentView), PagesContainer
    }), define("widget/purchase/button", ["jquery", "mod/template"], function($, tmpl) {
        function PurchaseButton(options) {
            this.purchaseWidget = options.purchaseWidget, this.purchaseEl = this.purchaseWidget._el, this.button = options.button, this.tmplBoughtButton = $("#tmpl-bought-button").html(), this.origButtonHtml = this.button.html(), this.proxyMethods(), this.bindButton(), this.bindPurchase()
        }
        return $.extend(PurchaseButton.prototype, {
            bindButton: function() {
                var self = this;
                this.button.on("click", function(e) {
                    "#" === self.button.attr("href") && e.preventDefault(), self.purchaseWidget.doPurchase()
                })
            },
            bindPurchase: function() {
                this.purchaseEl.on("checkBalance:start", this.onLoading), this.purchaseEl.on("purchase:success", this.onSuccess), this.purchaseEl.on("checkBalance:failed purchase:failed", this.onFailed)
            },
            proxyMethods: function() {
                var self = this,
                    events = ["onLoading", "onSuccess", "onFailed"];
                $.each(events, function(i, name) {
                    self[name] = $.proxy(self[name], self)
                })
            },
            onLoading: function() {
                this.button.html("购买中...")
            },
            onSuccess: function() {
                this.button.replaceWith(tmpl(this.tmplBoughtButton, {
                    url: this.purchaseWidget.getReaderUrl(),
                    isLargeBtn: this.purchaseWidget.isLargeBtn()
                }))
            },
            onFailed: function() {
                this.button.html(this.origButtonHtml)
            }
        }), PurchaseButton
    }), define("widget/purchase/apply", ["jquery", "widget/purchase/index", "widget/purchase/button"], function($, PurchaseWidget, PurchaseButton) {
        function applyPurchaseWithIn(selector, context) {
            $(context).find(selector).each(function(i, el) {
                el = $(el);
                var widget = new PurchaseWidget(el, context);
                new PurchaseButton({
                    purchaseWidget: widget,
                    button: el.find('[data-action="purchase"]')
                })
            })
        }
        return applyPurchaseWithIn
    }), define("../reader/views/reading/article", ["jquery", "backbone", "underscore", "arkenv", "reader/app", "reader/consts", "mod/cookie", "mod/ajax", "mod/detector", "mod/auto_link", "widget/purchase/apply", "widget/typeset/view", "reader/views/reading/pages_container", "reader/views/reading/bookmark_manager", "reader/models/article", "reader/models/marking", "reader/models/reviews", "reader/modules/storage", "reader/modules/browser", "reader/modules/tinytips", "reader/modules/storage_manager", "reader/modules/paging", "reader/modules/prettify", "reader/modules/ga", "reader/modules/stamp", "reader/modules/text_util", "reader/modules/figure_util", "reader/views/reading/modules/illus_actions", "reader/views/common/extra_controls", "reader/views/common/chapter_extra_controls", "reader/views/reading/page_jump_manager", "reader/views/reading/progress_manager", "reader/views/reading/modules/custom_section"], function($, Backbone, _, arkenv, app, consts, cookie, ajax, detector, autoLink, applyPurchaseWithIn, Typeset, PagesContainer, BookmarkManager, Article, Marking, Reviews, storage, browser, TinyTips, storageManager, pagingMaster, prettify, ga, Stamp, textUtil, figureUtil, IllusActions, ExtraControls, ChapterExtraControls, PageJumpManager, ProgressManager, CustomSection) {
        function returnTransparentPromise() {
            var dfd = $.Deferred();
            return dfd.resolve.apply(dfd, arguments).promise()
        }
        var ArticleView = Backbone.View.extend({
            el: ".article",
            events: {
                "click .inner": "captureTags",
                "click .expandable": "expandIllus",
                "mouseenter .inner": "hoverPage",
                "mouseleave .inner": "hoverPage"
            },
            initialize: function(config) {
                _.bindAll(this, "renderPages", "getArticleData", "parseArticleData", "renderOnArticleData", "paging", "renderOnPagingDone", "reRenderArticle", "hoverPage", "onResizePage", "adaptArticleData", "adaptDecryptedData", "renderHeaderControls"), this.config = config, this.vent = app.vent, this.vent.on({
                    "render:pages": this.renderPages,
                    "rerender:article": this.reRenderArticle
                }), this.tmplArticle = $("#tmpl-article").html(), this.tmplEmptyPage = $("#tmpl-empty-page").html(), app.utils = app.utils || {}, app.utils.applyPurchaseWithIn = applyPurchaseWithIn, this.pagesContainer = new PagesContainer({
                    app: app,
                    vent: this.vent
                }), this.pagesContainer.on("pages:rendered", this.renderHeaderControls, this), this.pageJumpManager = new PageJumpManager, this.progressManager = new ProgressManager, this.listenTo(app.getModel("turning"), "change:currPage", this.pageJump), arkenv.me.isAnonymous || (this.bookmarkManage = new BookmarkManager({
                    vent: this.vent,
                    config: this.config
                })), app.articleInner = this.articleInner = this.pagesContainer.$el, this.doc = document, this.win = $(window), this.lineHeight = 16 * this.config.get("lineHeight"), this.layout = this.config.get("layout"), $(document).on("purchase:finish payment:finish", function() {
                    location.reload()
                })
            },
            render: function(articleId) {
                this.trigger("view:render"), this.articleId = articleId, this.win.resize(_.debounce(this.onResizePage, 200));
                var reviewsModel = new Reviews({}, {
                    articleId: articleId
                });
                return reviewsModel.fetch(), app.setModel("reviews", reviewsModel), this.pageJumpManager.render(this.articleInner), this.needFitWindow() && this.fitForWindow(), this.initArticle(), this
            },
            initArticle: function() {
                this.trigger("article:init"), this.beforeGetArticleData().then(this.getArticleData).then(this.parseArticleData).done(this.renderOnArticleData).then(this.paging).then(this.renderOnPagingDone).then(this.afterPagingDone).then(this.progressManager.loadProgressThenJump).then(this.afterJumpingProgress), this.resetHooks()
            },
            beforeGetArticleData: returnTransparentPromise,
            afterPagingDone: returnTransparentPromise,
            afterJumpingProgress: returnTransparentPromise,
            allowedHooks: ["beforeGetArticleData", "afterPagingDone", "afterJumpingProgress"],
            resetHooks: function() {
                _.each(this.allowedHooks, function(hookName) {
                    delete this[hookName]
                }, this)
            },
            attachHooks: function(hooks) {
                _.each(this.allowedHooks, function(hookName) {
                    var oldHook = this[hookName],
                        hook = hooks[hookName];
                    hook && (this[hookName] = function() {
                        function passArgument() {
                            return oldRet
                        }
                        var oldRet = oldHook.apply(this, arguments),
                            ret = hook.apply(this, arguments);
                        return $.when(ret, oldRet).then(passArgument, passArgument)
                    })
                }, this)
            },
            onResizePage: function() {
                this.needReFitWindow() && (this.fitForWindow(), this.initArticle())
            },
            reRenderArticle: function() {
                this.prevLayout = this.layout, this.layout = this.config.get("layout"), "horizontal" === this.layout ? (this.articleInner.height("auto"), this.$el.find(".page").removeAttr("style"), this.fitForWindow()) : (this.$el.height("auto"), this.pageHeight = this.config.get("pageHeight"), this.articleInner.removeAttr("style"), this._clearPageStyle()), this.initArticle()
            },
            renderHeaderControls: function() {
                this.config.get("isChapter") ? this.renderChapterHeaderControls() : this.renderOriginHeaderControls()
            },
            renderOriginHeaderControls: function() {
                var headerControls = new ExtraControls({
                        className: "header-controls"
                    }),
                    currPageEl = this.pagesContainer.getCurrPage().$el;
                currPageEl.find(".header-extra").html(headerControls.render().el)
            },
            renderChapterHeaderControls: function() {
                var headerControls = new ChapterExtraControls({
                        className: "header-controls"
                    }),
                    currPageEl = this.pagesContainer.getCurrPage().$el;
                currPageEl.find(".header-extra").html(headerControls.render({
                    columnId: app.getModel("chapters").columnId,
                    hasAdded: app.getModel("article").get("hasAdded")
                }).el)
            },
            getArticleData: function() {
                function onLocalData(resp) {
                    var encryptedData = resp.data,
                        data = $.parseJSON(prettify.dec(encryptedData));
                    self.dataFromLocal = !0, self.adaptDecryptedData(data), dfd.resolve(data)
                }

                function onRemoteData(resp) {
                    self.dataFromLocal = !1, self.adaptArticleData(resp);
                    var encryptedData = resp.data,
                        data = $.parseJSON(prettify.dec(encryptedData)),
                        isSampleChapter = data.sample && self.config.get("isChapter");
                    if (self.adaptDecryptedData(data), app.vent.trigger("article:fetching:finish", data), !arkenv.me.isAnonymous && !arkenv.me.isAdmin && !isSampleChapter) try {
                        storageManager.freeUpStorageSpace(), storageManager.saveArticle(articleId, resp)
                    } catch (e) {}
                    dfd.resolve(data)
                }
                var dfd = new $.Deferred,
                    self = this,
                    articleId = this.articleId,
                    article = storageManager.getArticle(articleId);
                if (this.previousAid = storage.get("previousAid"), this.resetTypePage(), article) {
                    this.adaptArticleData(article);
                    var timestamp = [this.purchaseTime, 0 | this.isSample, 0 | this.isGift].join(":");
                    this.hasNewRevision(timestamp).done($.proxy(function(o) {
                        o.r ? onLocalData(article) : this.fetchArticle().done(onRemoteData)
                    }, this))
                } else this.fetchArticle().done(onRemoteData);
                return dfd.promise()
            },
            parseArticleData: function(data) {
                return this.config.get("isChapter") && this.isSample && (this.onsaleTime = data.onsale_time, this.favorCount = data.n_like || 0, this.emptyArticleContent(data)), data
            },
            emptyArticleContent: function(articleData) {
                var posts = articleData.posts,
                    empty_article_contents = [{
                        id: 1,
                        type: "paragraph",
                        data: {
                            text: "",
                            format: {}
                        }
                    }];
                posts.length = 1, posts[0].contents = empty_article_contents
            },
            renderOnArticleData: function(data) {
                var articleId = this.articleId;
                this.setTitle(this.title);
                var posts = data.posts,
                    postsLen = posts.length,
                    customSectionData = {
                        data: {},
                        type: "custom"
                    };
                postsLen && posts[postsLen - 1].contents.push(customSectionData);
                var articleModel = this.createArticleModel();
                return this.vent.trigger("render:panel", articleModel), articleModel.on("change:hasAdded", function(model, value) {
                    storageManager.setArticleAttr(articleId, "hasAdded", value), this.hasAdded = value
                }), this.detectIsArchived(), this.prevLayout = this.layout, data
            },
            createArticleModel: function() {
                var articleModel = new Article({
                    id: this.articleId,
                    title: this.title,
                    price: this.price,
                    isGift: this.isGift,
                    isSample: this.isSample,
                    hasAdded: this.hasAdded,
                    hasFormula: this.hasFormula,
                    purchaseTime: this.purchaseTime,
                    authorId: this.authorId,
                    "abstract": this.abstract,
                    dataFromLocal: this.datafromLocal,
                    cover_url: this.cover_url,
                    onsaleTime: this.onsaleTime
                });
                return app.setModel("article", articleModel), articleModel
            },
            adaptArticleData: function(articleData) {
                this.title = articleData.title, this.purchaseTime = articleData.purchase_time, this.isSample = articleData.is_sample, this.isGift = articleData.is_gift, this.hasFormula = articleData.has_formula, this.hasAdded = articleData.has_added, this.price = articleData.price, this.cover_url = decodeURIComponent(articleData.cover_url)
            },
            adaptDecryptedData: function(decryptedData) {
                this.authorId = decryptedData.authorId, this.abstract = decryptedData.abstract || ""
            },
            hoverPage: function(e) {
                this.vent.trigger("hover:page", e)
            },
            paging: function(data) {
                var hasFormula = this.hasFormula;
                this.vent.trigger("paging:start", data);
                var typeset = new Typeset({
                    autoSpacing: browser.fitForMobile
                });
                $.each(data.posts, function(idx, art) {
                    data.posts[idx].contents = typeset.transformParas(art.contents)
                });
                var articlePaging = pagingMaster({
                    pageHeight: this.pageHeight,
                    lineHeight: this.lineHeight,
                    data: data,
                    typePage: this.articleInner,
                    metadata: {
                        hasFormula: hasFormula
                    },
                    template: {
                        article: this.tmplArticle
                    },
                    layout: this.layout
                });
                return articlePaging
            },
            renderOnPagingDone: function(content) {
                this.totalPage = content.body.length || 1;
                var articleModel = app.getModel("article"),
                    turningModel = app.getModel("turning");
                return turningModel.enableSet(), turningModel.set("isGift", articleModel.get("isGift")), turningModel.set("totalPage", this.totalPage), app.setModel("content", content), this.bookmarkManage && this.bookmarkManage.render({
                    article: articleModel,
                    contentModel: content,
                    config: this.config
                }), this.resetTypePage(), this.preRenderTypePage(), this.pagesContainer.empty(), this.vent.trigger("paging:finish", content.contents), this._trackGAEvent(), content
            },
            pageJump: function() {
                this.$el.find(".page-empty").remove(), this.pageJumpManager.pageJump.apply(this, arguments), this.progressManager.saveReadingProgress()
            },
            detectIsArchived: function() {
                if (this.dataFromLocal) {
                    var articleModel = app.getModel("article");
                    return ajax.post("/j/article_v2/is_archived", {
                        works_id: this.articleId
                    }).done($.proxy(function(o) {
                        articleModel.set("hasAdded", 0 | !o.r)
                    }, this))
                }
            },
            hasNewRevision: function(timestamp) {
                return ajax.post("/j/article_v2/need_update", {
                    aid: this.articleId,
                    lasttime: timestamp
                })
            },
            fetchArticle: function() {
                function retry() {
                    if (!_.isFunction(history.pushState)) return location.href = "/ebook/" + articleId + "/", !1;
                    var errInfo = "加载失败，请刷新重试。",
                        errConfirm = confirm(errInfo);
                    errConfirm && location.reload()
                }

                function success(resp) {
                    return resp.r ? retry() : (dataDeferred.resolve(resp), void 0)
                }
                var articleId = this.articleId,
                    url = "/j/article_v2/get_reader_data",
                    data = {
                        aid: articleId,
                        reader_data_version: storageManager.getReaderDataVersion()
                    },
                    fetchState = ajax({
                        url: url,
                        type: "POST",
                        data: data
                    }),
                    dataDeferred = $.Deferred();
                return app.vent.trigger("article:fetching:start"), fetchState.success(success).error(retry), dataDeferred.promise()
            },
            renderPages: function(layout) {
                this.pagesContainer.render({
                    layout: layout
                }), this.completeArticle(), this.trigger("pages:rendered:fully")
            },
            completeArticle: function() {
                IllusActions.loadFigures(this.$el, this.pageWidth);
                var isChapter = this.config.get("isChapter"),
                    isAnonymous = arkenv.me.isAnonymous,
                    customSectionEl = this.$(".custom"),
                    articleModel = app.getModel("article");
                this.isSample ? CustomSection.appendPurchaseGuide(customSectionEl, articleModel) : isAnonymous || isChapter || CustomSection.appendRatingSection(customSectionEl, articleModel), CustomSection.appendReviewsLink(customSectionEl, articleModel, app.getModel("reviews")), CustomSection.appendSharingButtons(customSectionEl, articleModel), arkenv.me.isAnonymous || this.hasAdded || cookie("cths") || (cookie("cths", 1, {
                    "max-age": 31536e4,
                    path: "/reader"
                }), this.showCollectTips())
            },
            showCollectTips: function() {
                this.collectTips = this.collectTips || new TinyTips;
                var content = $("#tmpl-collect-tips").html();
                setTimeout(_.bind(function() {
                    this.collectTips.set({
                        target: ".lnk-collect",
                        width: "270px",
                        content: content
                    }).show()
                }, this), 2e3)
            },
            fillHeight: function(height) {
                return 2 * Math.ceil(parseInt(height, 10) / 2)
            },
            fitForWindow: function() {
                this.winHeight = this.win.height(), this.page = this.$el.find(".page"), this.pageWidth = this.page.width();
                var clientHeight = this.doc.body.clientHeight / 16,
                    verticalPadding = (parseInt(this.page.css("padding-top"), 10) + parseInt(this.page.css("padding-bottom"), 10)) / 16,
                    typePageHeight = clientHeight - verticalPadding,
                    minPageHeight = 15.25;
                clientHeight = minPageHeight > typePageHeight ? minPageHeight + verticalPadding : clientHeight, this.typePageSize = {
                    width: this.pageWidth / 16,
                    height: clientHeight - verticalPadding
                }, this.pageHeight = 16 * this.fillHeight(this.typePageSize.height), this.$el.height(clientHeight + "em"), this.articleInner.height(clientHeight + "em"), this._clearPageStyle(), this._setPageStyle()
            },
            needFitWindow: function() {
                return !browser.fitForMobile && "vertical" !== this.layout
            },
            needReFitWindow: function() {
                var currWinHeight = this.win.height(),
                    prevWinHeight = this.winHeight;
                return "horizontal" !== this.layout || browser.fitForMobile ? !1 : prevWinHeight !== currWinHeight || "vertical" === this.prevLayout
            },
            captureTags: function(e) {
                var tar = $(e.target);
                "SUP" === tar[0].tagName && (this.tinyTips = new TinyTips, this.tinyTips.set({
                    target: tar,
                    hasFormula: this.hasFormula,
                    content: autoLink(_.unescape(tar.find(".sup-content").html()))
                }).update().show())
            },
            expandIllus: function(e) {
                if (!browser.fitForMobile) {
                    var target = $(e.currentTarget);
                    IllusActions.expandIllus(target)
                }
            },
            setTitle: function(title) {
                detector.isWeixin() && title && (title = ["豆瓣阅读", title].join(" - ")), this.doc.title = title || "豆瓣阅读"
            },
            resetTypePage: function() {
                this.articleInner.html(_.template(this.tmplEmptyPage, {
                    hint: "作品载入中，请稍候 ..."
                })).css({
                    left: 0,
                    right: "auto"
                })
            },
            preRenderTypePage: function() {
                if ("vertical" === this.config.get("layout")) {
                    var pageHeight = this.config.getPageHeightEm(),
                        totalPage = app.getModel("turning").get("totalPage");
                    this.articleInner.height(pageHeight * totalPage + "em")
                }
            },
            _setPageStyle: function() {
                if (!$("#page-style").length) {
                    var typePageHeight = this.typePageSize.height,
                        contentHeight = this.fillHeight(typePageHeight) + "em",
                        pageHeight = typePageHeight + "em",
                        cssContent = "            .page { height: pageHeight }            .page .bd { height: contentHeight }          ".replace("pageHeight", pageHeight).replace("contentHeight", contentHeight),
                        pageStyle = $('<style id="page-style">' + cssContent + "</style>");
                    pageStyle.appendTo("head")
                }
            },
            _clearPageStyle: function() {
                $("#page-style").remove()
            },
            _trackGAEvent: function() {
                function getTradeInfo() {
                    return this.isSample ? "sample" : this.isGift ? "gift" : app.getModel("article").get("price") ? "paid" : "free"
                }
                ajax.post("/j/currtime").done(_.bind(function(currentTime) {
                    currentTime = 0 | currentTime, ga._trackEvent(getTradeInfo() + "-open", 0 | (0 | currentTime - this.purchaseTime) / 86400)
                }, this))
            }
        });
        return ArticleView
    }), define("../reader/views/common/panel/annotation_guide_bubble", ["jquery", "underscore", "backbone", "arkenv", "reader/app", "mod/preload"], function($, _, Backbone, arkenv, app, preload) {
        return Backbone.View.extend({
            tmpl: $("#tmpl-annotation-guide-bubble").html(),
            events: {
                "click .lnk-close": "closeBubble",
                "click .btn-more-info": "openAnnotationDialog"
            },
            closeBubble: function(e) {
                e.preventDefault(), this.trigger("close:wrapper")
            },
            openAnnotationDialog: function(e) {
                e.preventDefault(), this.trigger("open:annotationGuideDialog")
            },
            render: function() {
                return this.$el.html(this.tmpl), preload(arkenv.ANNOTATION_GUIDE_PIC), this
            }
        })
    }), define("../reader/views/common/panel/annotation_guide_dialog", ["jquery", "underscore", "backbone", "reader/app"], function($, _, Backbone) {
        return Backbone.View.extend({
            tmpl: $("#tmpl-annotation-guide-dialog").html(),
            className: "annotation-guide-content",
            events: {
                "click .btn-close": "closeDialog"
            },
            closeDialog: function(e) {
                e.preventDefault(), this.trigger("close:wrapper")
            },
            render: function() {
                return this.$el.html(this.tmpl), this
            }
        })
    }), define("mod/serialize", ["jquery"], function($) {
        $ = $ || window.$;
        var serialize = function(form) {
            var obj = {},
                name = "",
                pairs = form.serializeArray();
            return $.each(pairs, function() {
                name = this.name, obj[name] ? ($.isArray(obj[name]) || (obj[name] = [obj[name]]), obj[name].push(this.value || "")) : obj[name] = this.value || ""
            }), obj
        };
        return serialize
    }), define("../reader/views/common/panel/annotations_filter", ["jquery", "underscore", "backbone", "reader/app", "mod/serialize"], function($, _, Backbone, app, serialize) {
        var AnnotationsFilterView = Backbone.View.extend({
            tagName: "form",
            className: "annotations-filter",
            tmpl: $("#tmpl-annotations-filter-list").html(),
            events: {
                change: "changeFilter"
            },
            initialize: function() {
                this.listenTo(this.model, "change", this.update)
            },
            render: function(isAnonymous) {
                var data = this.model.toJSON();
                return data.isAnonymous = isAnonymous, this.$el.html(_.template(this.tmpl, data)), this.renderExtraClass(), this.filterList = this.$(".filter-list"), this
            },
            renderExtraClass: $.noop,
            update: function(model) {
                var changedAttrs = model.changedAttributes();
                "showOthers" in changedAttrs && this.filterList.toggleClass("show-others", changedAttrs.showOthers), this.renderExtraClass()
            },
            changeFilter: function(e) {
                var form = $(e.currentTarget),
                    data = serialize(form);
                data.showOthers = !!data.showOthers, this.model.set(data)
            }
        });
        return /msie 8/i.test(navigator.userAgent) && _.extend(AnnotationsFilterView.prototype, {
            renderExtraClass: function() {
                this.$(".checked").removeClass("checked"), this.$(":checked").parent().find("i").addClass("checked")
            }
        }), AnnotationsFilterView
    }), define("../reader/views/reading/modules/tiny_bubble", ["jquery", "underscore", "backbone", "reader/modules/bubble"], function($, _, Backbone, Bubble) {
        return Bubble.extend({
            onClickOutside: function() {
                this.hide()
            },
            setPosition: function(target) {
                var tar = $(target),
                    middleTop = (this._node.outerHeight(), this.getOffsetWithin(tar).top - $(document).scrollTop() + tar.height() / 2),
                    top = middleTop - this.opt.arrowOffset;
                return this._node.css({
                    top: top,
                    left: this.getOffsetWithin(tar).left + 35
                }), this
            }
        })
    }), define("../reader/views/common/panel/view", ["jquery", "underscore", "backbone", "arkenv", "reader/app", "mod/detector", "ui/overlay", "reader/modules/browser", "reader/modules/ga", "reader/modules/bubble", "reader/modules/toast", "reader/modules/storage", "reader/views/reading/modules/tiny_bubble", "reader/views/common/tips/sharing_form", "reader/models/favor", "../reader/views/common/panel/rating_form", "../reader/views/common/panel/annotations_filter", "../reader/views/common/panel/annotation_guide_dialog", "../reader/views/common/panel/annotation_guide_bubble"], function($, _, Backbone, arkenv, app, detector, createOverlay, browser, ga, Bubble, Toast, storage, TinyBubble, SharingForm, Favor, RatingFormView, AnnotationsFilterView, AnnotationGuideDialog, AnnotationGuideBubble) {
        var PanelView = Backbone.View.extend({
            tmpl: this.$("#tmpl-panel").html(),
            initialize: function(options) {
                _.bindAll(this, "hide", "toggle", "hideBubble", "updateBubble", "hideHelper", "showHelper", "toggleFilterTip"), this.app = app, this.vent = this.app.vent, this.config = options.config, this.vent.on({
                    "close:helperGuide": this.hideHelper,
                    "open:helperGuide": this.showHelper
                }), app.on("pageView:switched", this.hideAllBubbles, this), this.ratingForm = new RatingFormView, this.enableAnnotationsFilter(), this.isShown = !!this.$el.is(":visible")
            },
            render: function(articleModel) {
                var isAnonymous = arkenv.me.isAnonymous;
                return this.articleId = articleModel.get("id"), this.$el.html(_.template(this.tmpl, {
                    isSample: !!articleModel && articleModel.get("isSample"),
                    isAnonymous: isAnonymous,
                    isGallery: this.config.get("isGallery"),
                    canRate: !!articleModel && !!this.app.me && this.app.me.canRate(articleModel),
                    reviewsUrl: app.router.getReviewsUrl(),
                    questionsUrl: app.router.getQuestionsUrl(),
                    layout: this.config.get("layout")
                })), this.layoutBtn = this.$el.find(".arkicon-layout"), this.helperBtn = this.$el.find("#fn-helper"), this.reviewsBtn = this.$el.find("#fn-salon"), this.backBtn = this.$el.find(".arkicon-back"), this.filterBtn = this.$el.find(".icon-annotations-filter"), this.toggleFilterIcon(this.othersAnnotationShown), this.config.get("isChapter") && this.checkQuestionFeature(), isAnonymous || (this.config.get("isChapter") && this.enableFavorIcon({
                    articleId: this.articleId
                }), browser.fitForMobile || (this.bubble = new Bubble({
                    renderTo: this.$el.find(".panel")
                })), this.ratingForm.on("cancel", this.hideBubble).on("updated", this.updateBubble)), this
            },
            events: {
                "click .arkicon-back": "backList",
                "click .arkicon-layout": "_changeLayout",
                "click .arkicon-star": "toggleRatingForm",
                "click .arkicon-share": "toggleSharingForm",
                "click #fn-helper": "toggleHelper",
                "click .icon-annotations-filter": "toggleFilterTip",
                "click .arkicon-favor": "toggleFavor"
            },
            hideBubble: function() {
                this.bubble.hide()
            },
            hideAllBubbles: function() {
                app.vent.trigger("close:helperGuide"), _.each(["bubble", "guideBubble", "tinyBubble"], function(bubbleName) {
                    var bubble = this[bubbleName];
                    bubble && bubble.hide()
                }, this)
            },
            openAnnotationGuideBubble: function() {
                var bubble = new TinyBubble({
                        html: '<div class="annotation-guide-bubble"><div class="bubble-content"></div></div>',
                        onClickOutside: !1
                    }),
                    view = new AnnotationGuideBubble;
                this.guideBubble = bubble, bubble.set({
                    arrowOffset: 70,
                    target: this.filterBtn[0],
                    content: view.render().el
                }), view.on("close:wrapper open:annotationGuideDialog", function() {
                    bubble.hide()
                }).on("open:annotationGuideDialog", function() {
                    this.openAnnotationGuideDialog()
                }, this), bubble.show()
            },
            openAnnotationGuideDialog: function() {
                var dialogView = new AnnotationGuideDialog,
                    overlay = createOverlay({
                        body: dialogView.render().$el,
                        klass: "annotation-guide-overlay",
                        closable: !1
                    }).open();
                dialogView.on("close:wrapper", function() {
                    overlay.close()
                }).on("open:annotationGuideDialog", function() {
                    this.openAnnotationGuideDialog()
                }, this)
            },
            updateBubble: function() {
                this.bubble.update()
            },
            _changeLayout: function() {
                var newLayout = "vertical" === this.config.get("layout") ? "horizontal" : "vertical";
                this.config.set("layout", newLayout), this.changeLayout(newLayout)
            },
            changeLayout: function(layout) {
                return this.hideAllBubbles(), app.vent.trigger("close:popups"), this.changeLayoutBtn(layout), this.vent.trigger("change:layout", layout), this.vent.trigger("rerender:article"), Toast.alert("vertical" === layout ? "垂直阅读模式" : "分页阅读模式"), this
            },
            changeLayoutBtn: function(layout) {
                this.vent.trigger("close:shortcutTips"), this.layoutBtn.toggleClass("vertical", "vertical" === layout)
            },
            enableAnnotationsFilter: function() {
                this.annotationConfig = this.config.get("annotationsConfig"), this.annotationsFilterView = new AnnotationsFilterView({
                    model: this.annotationConfig
                }), this.listenTo(this.annotationConfig, "change:showOthers", this.onFilterChange), this.onFilterChange(this.annotationConfig, this.annotationConfig.get("showOthers"))
            },
            toggleHelper: function() {
                var helperIsShown = this.helperIsShown();
                this.hideAllBubbles(), helperIsShown || this.isColumnLayout() || app.vent.trigger("open:helperGuide")
            },
            isColumnLayout: function() {
                return "c" === arkenv.works.type
            },
            helperIsShown: function() {
                return $("i.tips").length
            },
            hideHelper: function() {
                var helper = $("i.tips");
                helper.length && (helper.remove(), !this.config || this.config.get("hasShownAnnotationGuide") || this.isColumnLayout() || this.config.get("isGallery") || (this.openAnnotationGuideBubble(), this.config.set("hasShownAnnotationGuide", !0)))
            },
            showHelper: function() {
                var body = $("body"),
                    win = $(window),
                    targets = $("[data-helper]").toArray(),
                    TMPL_TIPS = '<i class="tips"><b></b>{TITLE}</i>',
                    scrollTop = win.scrollTop(),
                    scrollLeft = win.scrollLeft();
                _.each(targets, function(tar) {
                    if (tar = $(tar), tar.is(":visible")) {
                        var offset = tar.offset();
                        body.append($(TMPL_TIPS.replace("{TITLE}", tar.data("helper"))).css({
                            top: offset.top - scrollTop + (tar.height() - 20) / 2,
                            left: offset.left - scrollLeft + tar.width() + 12
                        }))
                    }
                })
            },
            toggleRatingForm: function(e) {
                var bubbleIsShown = this.bubble.isVisible();
                this.hideAllBubbles(), bubbleIsShown || this.bubble.set({
                    width: "320px",
                    target: e.target,
                    content: this.ratingForm.render(this.articleId).$el
                }).show()
            },
            toggleSharingForm: function(e) {
                var bubbleIsShown = this.bubble.isVisible();
                this.hideAllBubbles(), bubbleIsShown || (this.sharingForm = new SharingForm({
                    isNote: !1,
                    url: "/j/share/rec_article",
                    extraParam: {
                        aid: this.articleId
                    }
                }), this.sharingForm.once("cancel submitted", this.hideBubble), this.bubble.set({
                    width: "350px",
                    target: e.target,
                    content: this.sharingForm.render().$el
                }).show())
            },
            enableFavorIcon: function(opts) {
                this.favorModel = new Favor({
                    articleId: opts.articleId
                }), this.favorBtn = this.$el.find(".arkicon-favor"), this.favorModel.on("change:liked", this.renderFavorBtn, this), this.favorModel.fetch()
            },
            renderFavorBtn: function(model, liked) {
                liked = !!liked, this.favorBtn.toggleClass("is-favored", liked)
            },
            toggleFavor: function() {
                return this.hideAllBubbles(), app.me.isAnonymous() ? (Toast.toast("请先登录"), void 0) : app.me.canRate(app.getModel("article")) ? (this.favorModel.toggleFavor(), Toast.toast(this.favorModel.get("liked") ? "已喜欢" : "已取消"), void 0) : (Toast.toast("购买后可以喜欢此文章"), void 0)
            },
            checkQuestionFeature: function() {
                this.$el.find("#fn-question").toggle(app.getModel("column").get("show_questions"))
            },
            toggleFilterTip: function(e) {
                if (this.annotationConfig) {
                    this.tinyBubble || (this.tinyBubble = new TinyBubble({
                        html: '<div class="tiny-bubble"><div class="bubble-content filter-group"></div></div>'
                    }), this.tinyBubble.set({
                        arrowOffset: 16,
                        content: this.annotationsFilterView.el
                    }));
                    var bubbleIsShown = this.tinyBubble.isVisible();
                    this.hideAllBubbles(), bubbleIsShown || (this.tinyBubble.set({
                        target: e.target
                    }), this.annotationsFilterView.render(app.me.isAnonymous()), this.tinyBubble.show())
                }
            },
            onFilterChange: function(model, isOpened) {
                this.othersAnnotationShown = isOpened, this.toggleFilterIcon(isOpened)
            },
            toggleFilterIcon: function(isOpened) {
                this.filterBtn && this.filterBtn.toggleClass("opened", isOpened)
            },
            backList: function(e) {
                e.preventDefault();
                var ref, isChapter, isReaderRef, pathname = location.pathname;
                detector.hasPushState() ? (ref = document.referrer, isReaderRef = /douban\.com:?\d*\/reader\/(ebooks|columns)/gi.test(ref), ref = isReaderRef ? ref : "/reader/" + /(column|ebook)/gi.exec(pathname)[1] + "s") : (isChapter = !!this.config.get("isChapter"), ref = "/reader/" + (isChapter ? "columns" : "ebooks")), location.href = ref
            },
            updateStyle: function(properties) {
                return this.$el.css(properties), this
            },
            disableBtn: function(name) {
                return this.$el.find(name).addClass("disabled"), this
            },
            enableBtn: function(name) {
                return this.$el.find(name).removeClass("disabled"), this
            },
            hide: function() {
                return this.isShown ? (this.bubble && this.bubble.hide(), this.isShown = !1, this.$el.hide(), void 0) : this
            },
            show: function() {
                return this.isShown ? this : (this.isShown = !0, this.$el.show(), void 0)
            },
            toggle: function() {
                return this.$el[this.isShown ? "hide" : "show"](), this.isShown = this.isShown ? !1 : !0, this
            }
        });
        return PanelView
    }),
    /*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
     * Licensed under the MIT License (LICENSE.txt).
     *
     * Version: 3.1.9
     *
     * Requires: jQuery 1.2.2+
     */
    function(factory) {
        "function" == typeof define && define.amd ? define("jquery/jquery.mousewheel", ["jquery"], factory) : "object" == typeof exports ? module.exports = factory : factory(jQuery)
    }(function($) {
        function handler(event) {
            var orgEvent = event || window.event,
                args = slice.call(arguments, 1),
                delta = 0,
                deltaX = 0,
                deltaY = 0,
                absDelta = 0;
            if (event = $.event.fix(orgEvent), event.type = "mousewheel", "detail" in orgEvent && (deltaY = -1 * orgEvent.detail), "wheelDelta" in orgEvent && (deltaY = orgEvent.wheelDelta), "wheelDeltaY" in orgEvent && (deltaY = orgEvent.wheelDeltaY), "wheelDeltaX" in orgEvent && (deltaX = -1 * orgEvent.wheelDeltaX), "axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaX = -1 * deltaY, deltaY = 0), delta = 0 === deltaY ? deltaX : deltaY, "deltaY" in orgEvent && (deltaY = -1 * orgEvent.deltaY, delta = deltaY), "deltaX" in orgEvent && (deltaX = orgEvent.deltaX, 0 === deltaY && (delta = -1 * deltaX)), 0 !== deltaY || 0 !== deltaX) {
                if (1 === orgEvent.deltaMode) {
                    var lineHeight = $.data(this, "mousewheel-line-height");
                    delta *= lineHeight, deltaY *= lineHeight, deltaX *= lineHeight
                } else if (2 === orgEvent.deltaMode) {
                    var pageHeight = $.data(this, "mousewheel-page-height");
                    delta *= pageHeight, deltaY *= pageHeight, deltaX *= pageHeight
                }
                return absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX)), (!lowestDelta || lowestDelta > absDelta) && (lowestDelta = absDelta, shouldAdjustOldDeltas(orgEvent, absDelta) && (lowestDelta /= 40)), shouldAdjustOldDeltas(orgEvent, absDelta) && (delta /= 40, deltaX /= 40, deltaY /= 40), delta = Math[delta >= 1 ? "floor" : "ceil"](delta / lowestDelta), deltaX = Math[deltaX >= 1 ? "floor" : "ceil"](deltaX / lowestDelta), deltaY = Math[deltaY >= 1 ? "floor" : "ceil"](deltaY / lowestDelta), event.deltaX = deltaX, event.deltaY = deltaY, event.deltaFactor = lowestDelta, event.deltaMode = 0, args.unshift(event, delta, deltaX, deltaY), nullLowestDeltaTimeout && clearTimeout(nullLowestDeltaTimeout), nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200), ($.event.dispatch || $.event.handle).apply(this, args)
            }
        }

        function nullLowestDelta() {
            lowestDelta = null
        }

        function shouldAdjustOldDeltas(orgEvent, absDelta) {
            return special.settings.adjustOldDeltas && "mousewheel" === orgEvent.type && 0 === absDelta % 120
        }
        var nullLowestDeltaTimeout, lowestDelta, toFix = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            toBind = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            slice = Array.prototype.slice;
        if ($.event.fixHooks)
            for (var i = toFix.length; i;) $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        var special = $.event.special.mousewheel = {
            version: "3.1.9",
            setup: function() {
                if (this.addEventListener)
                    for (var i = toBind.length; i;) this.addEventListener(toBind[--i], handler, !1);
                else this.onmousewheel = handler;
                $.data(this, "mousewheel-line-height", special.getLineHeight(this)), $.data(this, "mousewheel-page-height", special.getPageHeight(this))
            },
            teardown: function() {
                if (this.removeEventListener)
                    for (var i = toBind.length; i;) this.removeEventListener(toBind[--i], handler, !1);
                else this.onmousewheel = null
            },
            getLineHeight: function(elem) {
                return parseInt($(elem)["offsetParent" in $.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
            },
            getPageHeight: function(elem) {
                return $(elem).height()
            },
            settings: {
                adjustOldDeltas: !0
            }
        };
        $.fn.extend({
            mousewheel: function(fn) {
                return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel")
            },
            unmousewheel: function(fn) {
                return this.unbind("mousewheel", fn)
            }
        })
    }), define("../reader/modules/mousewheel", ["jquery", "underscore", "jquery/jquery.mousewheel"], function($, _) {
        function MouseWheel(opt) {
            opt = opt || {}, this.el = $(opt.el || document.body), this.disableElements = opt.disableElements, this.eventNS = ".mw", this.eventName = "mousewheel" + this.eventNS;
            var self = this;
            this.onMousewheel(_.debounce(function(e, delta, deltaX, deltaY) {
                var data = {
                    event: e,
                    delta: delta,
                    deltaX: deltaX,
                    deltaY: deltaY
                };
                0 > delta && self.isAtBottom() ? self.el.trigger("mousewheel:atBottom" + self.eventNS, data) : delta > 0 && self.isAtTop() && self.el.trigger("mousewheel:atTop" + self.eventNS, data)
            }, 40, !0))
        }
        return MouseWheel.prototype = {
            constructor: MouseWheel,
            onMousewheel: function(handler) {
                var self = this;
                if (this.el.on(this.eventName, function() {
                        self.disabled || handler.apply(this, arguments)
                    }), this.disableElements) {
                    var disableSelector = this.disableElements.join(",");
                    this.el.on(this.eventName, disableSelector, function(e) {
                        e.stopPropagation()
                    })
                }
            },
            onWheelBottom: function(handler) {
                this.el.on("mousewheel:atBottom" + this.eventNS, handler)
            },
            onWheelTop: function(handler) {
                this.el.on("mousewheel:atTop" + this.eventNS, handler)
            },
            isAtTop: function() {
                return 0 === this.el[0].scrollTop ? !0 : !1
            },
            isAtBottom: function() {
                var el = this.el[0];
                return el.offsetHeight + el.scrollTop >= el.scrollHeight ? !0 : !1
            },
            reset: function() {
                this.el.off(this.eventNS)
            },
            enable: function() {
                this.disabled = !1
            },
            disable: function() {
                this.disabled = !0
            }
        }, MouseWheel
    }), /*! iScroll v5.1.1 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
    function(window, document, Math) {
        function IScroll(el, options) {
            this.wrapper = "string" == typeof el ? document.querySelector(el) : el, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = {
                startX: 0,
                startY: 0,
                scrollY: !0,
                directionLockThreshold: 5,
                momentum: !0,
                bounce: !0,
                bounceTime: 600,
                bounceEasing: "",
                preventDefault: !0,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
                },
                HWCompositing: !0,
                useTransition: !0,
                useTransform: !0
            };
            for (var i in options) this.options[i] = options[i];
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = utils.hasTransition && this.options.useTransition, this.options.useTransform = utils.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable()
        }
        var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1e3 / 60)
            },
            utils = function() {
                function _prefixStyle(style) {
                    return _vendor === !1 ? !1 : "" === _vendor ? style : _vendor + style.charAt(0).toUpperCase() + style.substr(1)
                }
                var me = {},
                    _elementStyle = document.createElement("div").style,
                    _vendor = function() {
                        for (var transform, vendors = ["t", "webkitT", "MozT", "msT", "OT"], i = 0, l = vendors.length; l > i; i++)
                            if (transform = vendors[i] + "ransform", transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
                        return !1
                    }();
                me.getTime = Date.now || function() {
                    return (new Date).getTime()
                }, me.extend = function(target, obj) {
                    for (var i in obj) target[i] = obj[i]
                }, me.addEvent = function(el, type, fn, capture) {
                    el.addEventListener(type, fn, !!capture)
                }, me.removeEvent = function(el, type, fn, capture) {
                    el.removeEventListener(type, fn, !!capture)
                }, me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
                    var destination, duration, distance = current - start,
                        speed = Math.abs(distance) / time;
                    return deceleration = void 0 === deceleration ? 6e-4 : deceleration, destination = current + speed * speed / (2 * deceleration) * (0 > distance ? -1 : 1), duration = speed / deceleration, lowerMargin > destination ? (destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin, distance = Math.abs(destination - current), duration = distance / speed) : destination > 0 && (destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0, distance = Math.abs(current) + destination, duration = distance / speed), {
                        destination: Math.round(destination),
                        duration: duration
                    }
                };
                var _transform = _prefixStyle("transform");
                return me.extend(me, {
                    hasTransform: _transform !== !1,
                    hasPerspective: _prefixStyle("perspective") in _elementStyle,
                    hasTouch: "ontouchstart" in window,
                    hasPointer: navigator.msPointerEnabled,
                    hasTransition: _prefixStyle("transition") in _elementStyle
                }), me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !/Chrome\/\d/.test(window.navigator.appVersion), me.extend(me.style = {}, {
                    transform: _transform,
                    transitionTimingFunction: _prefixStyle("transitionTimingFunction"),
                    transitionDuration: _prefixStyle("transitionDuration"),
                    transitionDelay: _prefixStyle("transitionDelay"),
                    transformOrigin: _prefixStyle("transformOrigin")
                }), me.hasClass = function(e, c) {
                    var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                    return re.test(e.className)
                }, me.addClass = function(e, c) {
                    if (!me.hasClass(e, c)) {
                        var newclass = e.className.split(" ");
                        newclass.push(c), e.className = newclass.join(" ")
                    }
                }, me.removeClass = function(e, c) {
                    if (me.hasClass(e, c)) {
                        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
                        e.className = e.className.replace(re, " ")
                    }
                }, me.offset = function(el) {
                    for (var left = -el.offsetLeft, top = -el.offsetTop; el = el.offsetParent;) left -= el.offsetLeft, top -= el.offsetTop;
                    return {
                        left: left,
                        top: top
                    }
                }, me.preventDefaultException = function(el, exceptions) {
                    for (var i in exceptions)
                        if (exceptions[i].test(el[i])) return !0;
                    return !1
                }, me.extend(me.eventType = {}, {
                    touchstart: 1,
                    touchmove: 1,
                    touchend: 1,
                    mousedown: 2,
                    mousemove: 2,
                    mouseup: 2,
                    MSPointerDown: 3,
                    MSPointerMove: 3,
                    MSPointerUp: 3
                }), me.extend(me.ease = {}, {
                    quadratic: {
                        style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        fn: function(k) {
                            return k * (2 - k)
                        }
                    },
                    circular: {
                        style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                        fn: function(k) {
                            return Math.sqrt(1 - --k * k)
                        }
                    },
                    back: {
                        style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        fn: function(k) {
                            var b = 4;
                            return (k -= 1) * k * ((b + 1) * k + b) + 1
                        }
                    },
                    bounce: {
                        style: "",
                        fn: function(k) {
                            return (k /= 1) < 1 / 2.75 ? 7.5625 * k * k : 2 / 2.75 > k ? 7.5625 * (k -= 1.5 / 2.75) * k + .75 : 2.5 / 2.75 > k ? 7.5625 * (k -= 2.25 / 2.75) * k + .9375 : 7.5625 * (k -= 2.625 / 2.75) * k + .984375
                        }
                    },
                    elastic: {
                        style: "",
                        fn: function(k) {
                            var f = .22,
                                e = .4;
                            return 0 === k ? 0 : 1 == k ? 1 : e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * 2 * Math.PI / f) + 1
                        }
                    }
                }), me.tap = function(e, eventName) {
                    var ev = document.createEvent("Event");
                    ev.initEvent(eventName, !0, !0), ev.pageX = e.pageX, ev.pageY = e.pageY, e.target.dispatchEvent(ev)
                }, me.click = function(e) {
                    var ev, target = e.target;
                    /(SELECT|INPUT|TEXTAREA)/i.test(target.tagName) || (ev = document.createEvent("MouseEvents"), ev.initMouseEvent("click", !0, !0, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null), ev._constructed = !0, target.dispatchEvent(ev))
                }, me
            }();
        IScroll.prototype = {
            version: "5.1.1",
            _init: function() {
                this._initEvents()
            },
            destroy: function() {
                this._initEvents(!0), this._execEvent("destroy")
            },
            _transitionEnd: function(e) {
                e.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
            },
            _start: function(e) {
                if (!(1 != utils.eventType[e.type] && 0 !== e.button || !this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated)) {
                    !this.options.preventDefault || utils.isBadAndroid || utils.preventDefaultException(e.target, this.options.preventDefaultException) || e.preventDefault();
                    var pos, point = e.touches ? e.touches[0] : e;
                    this.initiated = utils.eventType[e.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = utils.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, pos = this.getComputedPosition(), this._translate(Math.round(pos.x), Math.round(pos.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = point.pageX, this.pointY = point.pageY, this._execEvent("beforeScrollStart")
                }
            },
            _move: function(e) {
                if (this.enabled && utils.eventType[e.type] === this.initiated) {
                    this.options.preventDefault && e.preventDefault();
                    var newX, newY, absDistX, absDistY, point = e.touches ? e.touches[0] : e,
                        deltaX = point.pageX - this.pointX,
                        deltaY = point.pageY - this.pointY,
                        timestamp = utils.getTime();
                    if (this.pointX = point.pageX, this.pointY = point.pageY, this.distX += deltaX, this.distY += deltaY, absDistX = Math.abs(this.distX), absDistY = Math.abs(this.distY), !(timestamp - this.endTime > 300 && 10 > absDistX && 10 > absDistY)) {
                        if (this.directionLocked || this.options.freeScroll || (this.directionLocked = absDistX > absDistY + this.options.directionLockThreshold ? "h" : absDistY >= absDistX + this.options.directionLockThreshold ? "v" : "n"), "h" == this.directionLocked) {
                            if ("vertical" == this.options.eventPassthrough) e.preventDefault();
                            else if ("horizontal" == this.options.eventPassthrough) return this.initiated = !1, void 0;
                            deltaY = 0
                        } else if ("v" == this.directionLocked) {
                            if ("horizontal" == this.options.eventPassthrough) e.preventDefault();
                            else if ("vertical" == this.options.eventPassthrough) return this.initiated = !1, void 0;
                            deltaX = 0
                        }
                        deltaX = this.hasHorizontalScroll ? deltaX : 0, deltaY = this.hasVerticalScroll ? deltaY : 0, newX = this.x + deltaX, newY = this.y + deltaY, (newX > 0 || newX < this.maxScrollX) && (newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX), (newY > 0 || newY < this.maxScrollY) && (newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY), this.directionX = deltaX > 0 ? -1 : 0 > deltaX ? 1 : 0, this.directionY = deltaY > 0 ? -1 : 0 > deltaY ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(newX, newY), timestamp - this.startTime > 300 && (this.startTime = timestamp, this.startX = this.x, this.startY = this.y)
                    }
                }
            },
            _end: function(e) {
                if (this.enabled && utils.eventType[e.type] === this.initiated) {
                    this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
                    var momentumX, momentumY, duration = (e.changedTouches ? e.changedTouches[0] : e, utils.getTime() - this.startTime),
                        newX = Math.round(this.x),
                        newY = Math.round(this.y),
                        distanceX = Math.abs(newX - this.startX),
                        distanceY = Math.abs(newY - this.startY),
                        time = 0,
                        easing = "";
                    if (this.isInTransition = 0, this.initiated = 0, this.endTime = utils.getTime(), !this.resetPosition(this.options.bounceTime)) return this.scrollTo(newX, newY), this.moved ? this._events.flick && 200 > duration && 100 > distanceX && 100 > distanceY ? (this._execEvent("flick"), void 0) : (this.options.momentum && 300 > duration && (momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                        destination: newX,
                        duration: 0
                    }, momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                        destination: newY,
                        duration: 0
                    }, newX = momentumX.destination, newY = momentumY.destination, time = Math.max(momentumX.duration, momentumY.duration), this.isInTransition = 1), newX != this.x || newY != this.y ? ((newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) && (easing = utils.ease.quadratic), this.scrollTo(newX, newY, time, easing), void 0) : (this._execEvent("scrollEnd"), void 0)) : (this.options.tap && utils.tap(e, this.options.tap), this.options.click && utils.click(e), this._execEvent("scrollCancel"), void 0)
                }
            },
            _resize: function() {
                var that = this;
                clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
                    that.refresh()
                }, this.options.resizePolling)
            },
            resetPosition: function(time) {
                var x = this.x,
                    y = this.y;
                return time = time || 0, !this.hasHorizontalScroll || this.x > 0 ? x = 0 : this.x < this.maxScrollX && (x = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? y = 0 : this.y < this.maxScrollY && (y = this.maxScrollY), x == this.x && y == this.y ? !1 : (this.scrollTo(x, y, time, this.options.bounceEasing), !0)
            },
            disable: function() {
                this.enabled = !1
            },
            enable: function() {
                this.enabled = !0
            },
            refresh: function() {
                this.wrapper.offsetHeight, this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = utils.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition()
            },
            on: function(type, fn) {
                this._events[type] || (this._events[type] = []), this._events[type].push(fn)
            },
            off: function(type, fn) {
                if (this._events[type]) {
                    var index = this._events[type].indexOf(fn);
                    index > -1 && this._events[type].splice(index, 1)
                }
            },
            _execEvent: function(type) {
                if (this._events[type]) {
                    var i = 0,
                        l = this._events[type].length;
                    if (l)
                        for (; l > i; i++) this._events[type][i].apply(this, [].slice.call(arguments, 1))
                }
            },
            scrollBy: function(x, y, time, easing) {
                x = this.x + x, y = this.y + y, time = time || 0, this.scrollTo(x, y, time, easing)
            },
            scrollTo: function(x, y, time, easing) {
                easing = easing || utils.ease.circular, this.isInTransition = this.options.useTransition && time > 0, !time || this.options.useTransition && easing.style ? (this._transitionTimingFunction(easing.style), this._transitionTime(time), this._translate(x, y)) : this._animate(x, y, time, easing.fn)
            },
            scrollToElement: function(el, time, offsetX, offsetY, easing) {
                if (el = el.nodeType ? el : this.scroller.querySelector(el)) {
                    var pos = utils.offset(el);
                    pos.left -= this.wrapperOffset.left, pos.top -= this.wrapperOffset.top, offsetX === !0 && (offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), offsetY === !0 && (offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), pos.left -= offsetX || 0, pos.top -= offsetY || 0, pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left, pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top, time = void 0 === time || null === time || "auto" === time ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time, this.scrollTo(pos.left, pos.top, time, easing)
                }
            },
            _transitionTime: function(time) {
                time = time || 0, this.scrollerStyle[utils.style.transitionDuration] = time + "ms", !time && utils.isBadAndroid && (this.scrollerStyle[utils.style.transitionDuration] = "0.001s")
            },
            _transitionTimingFunction: function(easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing
            },
            _translate: function(x, y) {
                this.options.useTransform ? this.scrollerStyle[utils.style.transform] = "translate(" + x + "px," + y + "px)" + this.translateZ : (x = Math.round(x), y = Math.round(y), this.scrollerStyle.left = x + "px", this.scrollerStyle.top = y + "px"), this.x = x, this.y = y
            },
            _initEvents: function(remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;
                eventType(window, "orientationchange", this), eventType(window, "resize", this), this.options.click && eventType(this.wrapper, "click", this, !0), this.options.disableMouse || (eventType(this.wrapper, "mousedown", this), eventType(target, "mousemove", this), eventType(target, "mousecancel", this), eventType(target, "mouseup", this)), utils.hasPointer && !this.options.disablePointer && (eventType(this.wrapper, "MSPointerDown", this), eventType(target, "MSPointerMove", this), eventType(target, "MSPointerCancel", this), eventType(target, "MSPointerUp", this)), utils.hasTouch && !this.options.disableTouch && (eventType(this.wrapper, "touchstart", this), eventType(target, "touchmove", this), eventType(target, "touchcancel", this), eventType(target, "touchend", this)), eventType(this.scroller, "transitionend", this), eventType(this.scroller, "webkitTransitionEnd", this), eventType(this.scroller, "oTransitionEnd", this), eventType(this.scroller, "MSTransitionEnd", this)
            },
            getComputedPosition: function() {
                var x, y, matrix = window.getComputedStyle(this.scroller, null);
                return this.options.useTransform ? (matrix = matrix[utils.style.transform].split(")")[0].split(", "), x = +(matrix[12] || matrix[4]), y = +(matrix[13] || matrix[5])) : (x = +matrix.left.replace(/[^-\d.]/g, ""), y = +matrix.top.replace(/[^-\d.]/g, "")), {
                    x: x,
                    y: y
                }
            },
            _animate: function(destX, destY, duration, easingFn) {
                function step() {
                    var newX, newY, easing, now = utils.getTime();
                    return now >= destTime ? (that.isAnimating = !1, that._translate(destX, destY), that.resetPosition(that.options.bounceTime) || that._execEvent("scrollEnd"), void 0) : (now = (now - startTime) / duration, easing = easingFn(now), newX = (destX - startX) * easing + startX, newY = (destY - startY) * easing + startY, that._translate(newX, newY), that.isAnimating && rAF(step), void 0)
                }
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;
                this.isAnimating = !0, step()
            },
            handleEvent: function(e) {
                switch (e.type) {
                    case "touchstart":
                    case "MSPointerDown":
                    case "mousedown":
                        this._start(e);
                        break;
                    case "touchmove":
                    case "MSPointerMove":
                    case "mousemove":
                        this._move(e);
                        break;
                    case "touchend":
                    case "MSPointerUp":
                    case "mouseup":
                    case "touchcancel":
                    case "MSPointerCancel":
                    case "mousecancel":
                        this._end(e);
                        break;
                    case "orientationchange":
                    case "resize":
                        this._resize();
                        break;
                    case "transitionend":
                    case "webkitTransitionEnd":
                    case "oTransitionEnd":
                    case "MSTransitionEnd":
                        this._transitionEnd(e);
                        break;
                    case "wheel":
                    case "DOMMouseScroll":
                    case "mousewheel":
                        this._wheel(e);
                        break;
                    case "keydown":
                        this._key(e);
                        break;
                    case "click":
                        e._constructed || (e.preventDefault(), e.stopPropagation())
                }
            }
        }, IScroll.utils = utils, "undefined" != typeof module && module.exports ? module.exports = IScroll : window.IScroll = IScroll
    }(window, document, Math), define("iscroll-lite", [], function() {}), define("../reader/modules/adapter/control-guide", ["jquery", "underscore", "reader/modules/storage", "widget/freq-limit"], function($, _, storage, FreqLimit) {
        function ControlGuide() {
            _.bindAll(this, "close", "onClick"), this.closePromise = $.Deferred(), this.freqLimit = new FreqLimit.OncePerBrowser("controlGuideShown")
        }
        var body = $("body"),
            tmpl = $("#tmpl-control-guide").html();
        return _.extend(ControlGuide.prototype, {
            render: function() {
                return this.freqLimit.isFree() ? (this.el = $(tmpl), this.el.on("tap", this.onClick), body.append(this.el), this.shown = !0, this) : (this.closePromise.resolve(), this)
            },
            onClick: function(e) {
                e.stopPropagation(), this.close()
            },
            close: function() {
                this.freqLimit.checkIn(), this.el.remove(), this.closePromise.resolve()
            }
        }), ControlGuide
    }), define("../reader/modules/adapter/top_panel/ebook_purchase", ["backbone", "jquery", "underscore", "reader/app", "arkenv"], function(Backbone, $, _, app, arkenv) {
        return Backbone.View.extend({
            className: "btn-wrapper",
            tmpl: _.template($("#tmpl-ebook-purchase").html()),
            render: function() {
                return this.model.isFree() ? this : (this.$el.html(this.tmpl(_.extend(this.model.toJSON(), {
                    isAnonymous: arkenv.me.isAnonymous,
                    isFree: this.model.isFree()
                }))), this)
            }
        })
    }), define("../reader/modules/adapter/top_panel/simple_subscribe", ["backbone", "jquery", "underscore", "reader/app", "arkenv", "ui/dialog_new"], function(Backbone, $, _, app, arkenv, createDialog) {
        return Backbone.View.extend({
            className: "subscribe btn-wrapper",
            tmpl: _.template($("#tmpl-simple-subscribe").html()),
            events: {
                "click .btn-subscribe": "subscribe"
            },
            initialize: function() {
                this.listenTo(this.model, "change:is_subscribed", function() {
                    this.render()
                }, this)
            },
            render: function() {
                return this.$el.html(this.tmpl(_.extend(this.model.toJSON(), {
                    isAnonymous: arkenv.me.isAnonymous
                }))), this
            },
            subscribe: function() {
                var kind = this.model.get("kind"),
                    model = this.model,
                    cfm = createDialog({
                        content: "订阅成功后, " + kind + "有更新时你将会收到提醒",
                        title: "订阅" + kind,
                        closable: !0,
                        type: "confirm"
                    }).open();
                cfm.on("confirm", _.bind(function() {
                    cfm.close();
                    var loadingDialog = createDialog({
                        content: kind + "订阅中",
                        title: "订阅" + kind,
                        closable: !1
                    }).open();
                    model.subscribe().always(function() {
                        loadingDialog.close()
                    }).done(_.bind(function(resp) {
                        return resp.r ? this.subscribeError(resp.msg || resp.error) : (this.subscribeSuccess(), void 0)
                    }, this)).fail(this.subscribeError)
                }, this))
            },
            subscribeSuccess: function() {
                var cfm = createDialog({
                    title: "订阅成功",
                    content: "订阅成功",
                    closable: !0,
                    type: "tips"
                }).open();
                cfm.on("confirm", function() {
                    cfm.close()
                }), this.model.set("is_subscribed", !0)
            },
            subscribeError: function(msg) {
                var cfm = createDialog({
                    title: "订阅失败",
                    content: msg || "发生了奇怪的错误",
                    closable: !0,
                    type: "tips"
                }).open();
                cfm.on("confirm", function() {
                    cfm.close()
                })
            }
        })
    }), define("../reader/modules/adapter/top_panel/view", ["jquery", "underscore", "backbone", "arkenv", "reader/app", "mod/truncate", "../reader/modules/adapter/top_panel/simple_subscribe", "../reader/modules/adapter/top_panel/ebook_purchase"], function($, _, Backbone, arkenv, app, truncate, SimpleSubscribe, EbookPurchase) {
        return Backbone.View.extend({
            className: "top-panel",
            tmpl: $("#tmpl-mobile-top-panel").html(),
            render: function() {
                var isChapter = app.getModel("config").get("isChapter"),
                    model = isChapter ? app.getModel("column") : app.getModel("article");
                if (this.$el.html(_.template(this.tmpl, {
                        url: model.urlInMobileStore(),
                        truncate: truncate,
                        label: [isChapter ? "豆瓣" + model.get("kind") : "豆瓣阅读", model.get("title")].join(" - ")
                    })), isChapter || model.get("isSample")) {
                    var BtnView = isChapter ? SimpleSubscribe : EbookPurchase;
                    this.btnView = new BtnView({
                        model: model
                    }), this.$el.find(".btn-placeholder").replaceWith(this.btnView.render().el)
                }
                return this
            },
            hide: function() {
                this.$el.is(":visible") && this.$el.hide()
            },
            toggle: function() {
                var willBeShown = !this.$el.is(":visible");
                this.$el[willBeShown ? "show" : "hide"](), willBeShown && this.btnView && this.$(".label").css({
                    marginRight: this.btnView.$el.width() + 10
                })
            }
        })
    }), define("../reader/modules/adapter/image_view", ["jquery", "underscore", "backbone", "reader/app", "reader/modules/detector"], function($, _, Backbone, app, detector) {
        var clientHeight = window.innerHeight,
            clientWidth = Math.max(window.innerWidth, document.body.clientWidth);
        return Backbone.View.extend({
            initialize: function(options) {
                this.imageSource = options.origImage;
                var maxWidth = clientWidth - 40,
                    ratio = options.origWidth / options.origHeight;
                this.imageWidth = options.origWidth > maxWidth ? maxWidth : options.imageWidth, this.imageHeight = this.imageWidth / ratio, this.doubleZoomOrg = 1
            },
            tagName: "img",
            events: {
                doubletap: "doubleTap",
                tap: "tap",
                touch: "touch",
                drag: "drag",
                release: "release"
            },
            getAspect: function() {
                return {
                    width: this.imageWidth,
                    height: this.imageHeight
                }
            },
            onLoaded: function(callback) {
                this.el.onload = callback
            },
            render: function() {
                return this.$el.css(this.getAspect()).attr("src", this.imageSource), detector.hasPinchZoom() && this.$el.on("transform", _.bind(this.pinch, this)), this.zoom = 1, this
            },
            transform: function(transition, scale, translateX, translateY) {
                var transform = "scale(" + scale + ")";
                _.isUndefined(translateX) || (transform += " translate3d(" + translateX + "px," + translateY + "px, 0)"), this.$el.css({
                    transform: transform,
                    transition: transition
                })
            },
            touch: function(e) {
                var data = e.originalEvent.gesture,
                    srcEvent = data.srcEvent,
                    touches = srcEvent && srcEvent.touches;
                srcEvent.preventDefault(), this.isDoubleZoom = !1, touches && touches.length >= 2 && (this.isDoubleZoom = !0, this.doubleZoomOrg = this.zoom), this.xy = this.xy || [0, 0]
            },
            getScale: function() {
                var naturalWidth = this.el.naturalWidth,
                    width = this.el.clientWidth;
                return naturalWidth / width
            },
            doubleTap: function() {
                return this.el, this.xy = [0, 0], this.isDoubleTaped = !0, this.zoom > 1.2 ? (this.zoom = 1, this.transform("200ms", 1, 0, 0), void 0) : (this.zoom = 2, this.transform("200ms", this.zoom, 0, 0), void 0)
            },
            tap: function() {
                _.delay(_.bind(function() {
                    this.isDoubleTaped || (this.isDoubleTaped = !1, this.trigger("close:imageView"))
                }, this), 300), this.isDoubleTaped = !1
            },
            drag: function(e) {
                var data = e.originalEvent.gesture,
                    srcEvent = data.srcEvent,
                    touches = srcEvent && srcEvent.touches;
                if (srcEvent.preventDefault(), !(1 === this.zoom || touches.length > 1 || this.isDoubleZoom)) {
                    var img = this.el,
                        newWidth = img.clientWidth * this.zoom,
                        newHeight = img.clientHeight * this.zoom,
                        borderX = (newWidth - clientWidth) / 2 / this.zoom,
                        borderY = (newHeight - clientHeight) / 2 / this.zoom,
                        dx = data.deltaX / this.zoom,
                        dy = data.deltaY / this.zoom,
                        distX = 0,
                        distY = 0;
                    borderX > 0 && (distX = this.xy[0] + dx > borderX ? borderX + (this.xy[0] + dx - borderX) / 3 : this.xy[0] + dx < -borderX ? -borderX + (this.xy[0] + dx + borderX) / 3 : this.xy[0] + dx), borderY > 0 && (distY = this.xy[1] + dy > borderY ? borderY + (this.xy[1] + dy - borderY) / 3 : this.xy[1] + dy < -borderY ? -borderY + (this.xy[1] + dy + borderY) / 3 : this.xy[1] + dy), this.transform("0ms", this.zoom, distX, distY)
                }
            },
            pinch: function(e) {
                var data = e.originalEvent.gesture,
                    srcEvent = data.srcEvent;
                srcEvent && srcEvent.touches, srcEvent.preventDefault(), this.isDoubleZoom = !0, this.zoom = Math.max(1, Math.min(this.doubleZoomOrg * data.scale, 2)), this.transform("0ms", this.zoom, this.xy[0], this.xy[1])
            },
            release: function(e) {
                var data = e.originalEvent.gesture;
                if (data.srcEvent && data.srcEvent.touches, data.deltaX) {
                    var img = this.el,
                        newWidth = img.clientWidth * this.zoom,
                        newHeight = img.clientHeight * this.zoom,
                        borderX = (newWidth - clientWidth) / 2 / this.zoom,
                        borderY = (newHeight - clientHeight) / 2 / this.zoom,
                        dx = this.isDoubleZoom ? 0 : data.deltaX / this.zoom,
                        dy = this.isDoubleZoom ? 0 : data.deltaY / this.zoom,
                        xy = this.xy,
                        distX = 0,
                        distY = 0;
                    borderX > 0 && (distX = dx + xy[0] > borderX ? borderX : dx + xy[0] < -borderX ? -borderX : xy[0] + dx), borderY > 0 && (distY = dy + xy[1] > borderY ? borderY : dy + xy[1] < -borderY ? -borderY : xy[1] + dy), 0 > borderX && this.isDoubleZoom && (distX = 0), 0 > borderY && this.isDoubleZoom && (distY = 0), this.transform("200ms", this.zoom, distX, distY), this.xy = [distX, distY]
                }
            }
        })
    }), define("../reader/modules/adapter/article_touch", ["jquery", "underscore", "backbone", "reader/app", "ui/dialog_new", "../reader/modules/adapter/image_view"], function($, _, Backbone, app, dialog, ImageView) {
        function pointInPolygon(point, vs) {
            for (var x = point[0], y = point[1], inside = !1, i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                var xi = vs[i][0],
                    yi = vs[i][1],
                    xj = vs[j][0],
                    yj = vs[j][1],
                    intersect = yi > y != yj > y && (xj - xi) * (y - yi) / (yj - yi) + xi > x;
                intersect && (inside = !inside)
            }
            return inside
        }
        var viewHeight = $(window).height(),
            viewWidth = $(window).width(),
            viewWidthGrid = viewWidth / 3,
            prevPagePolygon = [
                [0, 0],
                [0, viewHeight],
                [viewWidthGrid, viewHeight],
                [viewWidthGrid, 0]
            ],
            nextPagePolygon = [
                [2 * viewWidthGrid, 0],
                [2 * viewWidthGrid, viewHeight],
                [viewWidth, viewHeight],
                [viewWidth, 0]
            ],
            rTapIgnore = /^(sup|a|input|textarea|button)$/i,
            hasWebkitAnimation = _.memoize(function() {
                var el = document.createElement("div");
                return void 0 !== el.style.webkitAnimation
            }),
            body = $("body");
        return Backbone.View.extend({
            events: {
                "release .page": "fasttap"
            },
            initialize: function(options) {
                this.asideControls = options.asideControls, Ark.features["mwr/image_view"] && this.$el.on("tap", ".page img", _.bind(this.openImageView, this))
            },
            openImageView: function(e) {
                var el = $(e.currentTarget),
                    origHeight = el.data("orig-height"),
                    origWidth = el.data("orig-width"),
                    imageView = new ImageView({
                        origImage: el.data("orig-src"),
                        origHeight: origHeight,
                        origWidth: origWidth
                    }),
                    loading = $("<div>", {
                        "class": "loading"
                    }).css(imageView.getAspect());
                this.dialog = dialog({
                    content: loading,
                    closable: !0
                }).addClass("dialog-image-view").on("open", function() {
                    body.addClass("dialog-image-view-opened")
                }).on("close", function() {
                    body.removeClass("dialog-image-view-opened")
                }), this.dialog.el.css(imageView.getAspect()), this.dialog.open(), imageView.render().onLoaded(function() {
                    loading.replaceWith(imageView.$el)
                }), imageView.on("close:imageView", _.bind(function() {
                    var dialog = this.dialog,
                        el = dialog.overlay.el;
                    return hasWebkitAnimation() ? (el.css({
                        "-webkit-animation-name": "fadeout",
                        "-webkit-animation-duration": "0.5s"
                    }), $(el).one("webkitAnimationEnd", function() {
                        dialog.close()
                    }), void 0) : dialog.close()
                }, this))
            },
            fasttap: function(e) {
                var data = e.originalEvent.gesture.srcEvent;
                if (!(data.distance && data.distance > 15 || data.ignoreTap || rTapIgnore.test(e.target.tagName) || $(e.target).is("img") && Ark.features["mwr/image_view"] || $(".tips-outer").is(":visible"))) {
                    if (this.asideControls.is(":visible")) return app.mobileVent.trigger("hideToolbar");
                    var srcEvt = e.originalEvent.gesture.srcEvent,
                        changedTouches = _.isUndefined(srcEvt.changedTouches) ? [srcEvt] : srcEvt.changedTouches,
                        changeTouch = changedTouches.length && changedTouches[0],
                        clientX = changeTouch.clientX,
                        clientY = changeTouch.clientY,
                        point = [clientX, clientY],
                        isPrev = !0;
                    pointInPolygon(point, prevPagePolygon) ? app.mobileVent.trigger("turnPage", isPrev) : pointInPolygon(point, nextPagePolygon) ? app.mobileVent.trigger("turnPage", !isPrev) : app.mobileVent.trigger("toggleToolbar")
                }
            }
        })
    }), define("../reader/modules/open_native_app", ["underscore", "jquery", "mod/url", "mod/detector"], function(_, $, urlkit, detector) {
        return function(opts) {
            opts = opts || {};
            var url, rootUrl, columnInfo = {
                chapter: opts.worksId,
                column: opts.columnId
            };
            if (detector.isApplePhone) {
                var cfmTime = _.now();
                rootUrl = "douban-read-iphone://", rootUrl += opts.columnId && !opts.worksId ? "open-column" : "read", url = urlkit.addParam(rootUrl, opts.columnId ? columnInfo : {
                    "package": opts.worksId
                }), location.href = url, setTimeout(function() {
                    _.now() - cfmTime < 2e3 && (location.href = "/intro/iphone")
                }, 1500)
            } else if (detector.isAndroid) {
                var linkToAndroidApp = $("#link-to-android-app");
                rootUrl = "/intro/android", linkToAndroidApp.length || (linkToAndroidApp = $("<a>").hide(), $("body").append(linkToAndroidApp)), url = urlkit.addParam(rootUrl, opts.columnId ? columnInfo : {
                    ebook: opts.worksId
                }), linkToAndroidApp.attr("href", url).click()
            } else alert("抱歉，未能识别当前系统，请自行打开豆瓣阅读应用")
        }
    }), define("../reader/modules/open_dialog_mobile_ad", ["jquery", "underscore", "arkenv", "ui/dialog_new", "mod/ajax", "reader/modules/storage", "widget/freq-limit"], function($, _, arkenv, dialog, ajax, storage, FreqLimit) {
        var MobileDialogAd = function() {
            this.freqLimit = new FreqLimit.OncePerDayAndBrowser("lastTimeOpenMobileDialogAd"), this.render()
        };
        return _.extend(MobileDialogAd.prototype, {
                tmpl: $("#tmpl-dialog-app-ad").html(),
                render: function() {
                    if (this.freqLimit.isFree()) {
                        var device = arkenv.ua.device,
                            data = {
                                iphone: {
                                    url: "/intro/iphone/?icn=from_mobile_dialog_ad"
                                },
                                android: {
                                    url: "/intro/android/?icn=from_mobile_dialog_ad"
                                }
                            };
                        this.dialog = dialog({
                            content: _.template(this.tmpl, data[device] || data.android),
                            closable: !0,
                            width: "100"
                        }).addClass("dialog-mobile-app-ad").open();
                        var el = this.dialog.el;
                        return el.one("removing", function() {
                            ajax.request("GET", "/j/scribe", {
                                url: "/remove_mobile_ad?icn=from_dialog_ad"
                            })
                        }), this.freqLimit.checkIn(), this
                    }
                }
            }),
            function() {
                return new MobileDialogAd
            }
    }), define("../reader/views/modules/mobile_app_ad", ["jquery", "backbone", "underscore", "arkenv", "widget/freq-limit", "mod/cookie"], function($, Backbone, _, arkenv, FreqLimit, cookie) {
        var MobileAppAd = Backbone.View.extend({
            tmpl: $("#tmpl-mobile-app-ad").html(),
            className: "mobile-app-ad",
            events: {
                "click .close-wrapper": "removeFromClick"
            },
            initialize: function() {
                this.freqLimit = new FreqLimit.OncePerDayAndBrowser("shownMobileAppAd")
            },
            render: function() {
                if (!this.freqLimit.isFree()) return this;
                if (cookie("_ark_naaim")) return this;
                var device = arkenv.ua.device,
                    data = {
                        iphone: {
                            className: "for-iphone",
                            url: "/intro/iphone/?icn=from_mobile_page_ad"
                        },
                        android: {
                            className: "for-android",
                            url: "/intro/android/?icn=from_mobile_page_ad"
                        }
                    };
                return this.$el.html(_.template(this.tmpl, data[device] || data.android)), ga("send", "pageview", "/reader_ad_view?icn=from_mobile_page_ad"), this
            },
            removeFromClick: function(e) {
                e && e.preventDefault(), ga("send", "pageview", "/remove_mobile_ad?icn=from_mobile_page_ad"), this.freqLimit.checkIn(), this.remove()
            }
        });
        return MobileAppAd
    }), define("../widget/inject_weixin", ["jquery", "underscore", "mod/detector"], function($, _, detector) {
        var appendWeixinCoverToBody = function(coverUrl) {
            var wrapper = $("<div>").css({
                width: "1px",
                height: "1px",
                overflow: "hidden",
                position: "absolute",
                zIndex: "-1"
            });
            wrapper.append($("<img>").attr("src", coverUrl)), $("body").prepend(wrapper)
        };
        return function(vent) {
            if (detector.isWeixin()) {
                var weixinCover = $('meta[property="weixin:image"]'),
                    weixinCoverSource = weixinCover.attr("content");
                if (weixinCover.length && appendWeixinCoverToBody(weixinCoverSource), !detector.isApplePhone && vent) {
                    var onBridgeReady = function() {
                        if (window.WeixinJSBridge) {
                            var WeixinJSBridge = window.WeixinJSBridge,
                                invokeWeixinBridge = function(sharing) {
                                    WeixinJSBridge.invoke("shareTimeline", _.extend({
                                        link: window.location.href,
                                        desc: document.title || "豆瓣阅读",
                                        title: document.title || "豆瓣阅读",
                                        img_url: weixinCoverSource
                                    }, sharing), $.noop)
                                };
                            WeixinJSBridge.on("menu:share:timeline", function() {
                                var hasShareWeixinEvent = vent._events && vent._events["share:weixin"];
                                return hasShareWeixinEvent ? (vent.trigger("share:weixin", function(sharing) {
                                    invokeWeixinBridge(sharing)
                                }), void 0) : invokeWeixinBridge()
                            })
                        }
                    };
                    $(document).on("WeixinJSBridgeReady", onBridgeReady)
                }
            }
        }
    }), define("../reader/modules/adapter/view", ["jquery", "underscore", "backbone", "arkenv", "reader/app", "widget/inject_weixin", "reader/modules/detector", "reader/views/modules/mobile_app_ad", "reader/modules/open_dialog_mobile_ad", "reader/modules/open_native_app", "reader/modules/figure_util", "../reader/modules/adapter/article_touch", "../reader/modules/adapter/top_panel/view", "../reader/modules/adapter/control-guide", "iscroll-lite"], function($, _, Backbone, arkenv, app, injectWeixin, detector, MobileAppAd, openDialogMobileAd, openNativeApp, figureUtil, ArticleTouch, TopPanel, ControlGuide) {
        function fillHeight(height) {
            return Math.ceil(parseInt(height, 10) / lineHeight) * lineHeight
        }

        function adapter(views) {
            function handleTouch() {
                canvas.$el.on("swipe", ".inner", function(e) {
                    var direction = e.originalEvent.gesture.interimDirection;
                    swipePage(direction)
                }).on("swipe", ".inner", hideTips), $(body).on("touchstart", "#freeze-canvas-mask", function(e) {
                    e.preventDefault()
                }), canvas.$el.on("touchmove", function(e) {
                    "range" !== e.target.type && "vertical" !== config.get("layout") && e.preventDefault()
                })
            }

            function showAd() {
                if ("dialog" === adType) openDialogMobileAd();
                else {
                    var appAd = new MobileAppAd;
                    canvas.$el.append(appAd.render().el)
                }
            }

            function adapteMobile() {
                injectWeixin();
                var controlGuide = (new ControlGuide).render();
                canvas.$el.on("swipe", ".inner", hideToolbar), panel.remove(), resetPageSize(), article.on("view:render", articleViewRender), article.progressManager.on("progress:confirmed", function() {
                    var currPage = turningModel.get("currPage");
                    updateRangeInput(currPage)
                }), app.vent.on("render:panel", function() {
                    topPanel = new TopPanel, canvas.$el.prepend(topPanel.render().el)
                }).on("paging:start", fitFiguresWidth).on("paging:finish", function() {
                    body.scrollTop = 0
                }).on("canvas:shown", function() {
                    hideToolbar(), !detector.isiPhone && !detector.isAndroid || controlGuide.shown || showAd()
                }), canvas.on("view:rendered", fitPageView), turningModel.on("change:currPage", function(model, currPage) {
                    updateRangeInput(currPage)
                }), controlsPanel.on("list:render", fitToc), controlsPanel.$(".goto-app").on("click", function() {
                    var isChapter = app.getModel("config").get("isChapter"),
                        columnId = isChapter ? app.getModel("column").get("id") : "";
                    openNativeApp({
                        worksId: article.articleId,
                        columnId: columnId
                    })
                })
            }

            function hideTips() {
                article.tinyTips && article.tinyTips.destroy()
            }

            function hideToolbar() {
                topPanel && topPanel.hide(), asideControls.hide()
            }

            function toggleToolbar() {
                topPanel && topPanel.toggle(), asideControls.toggle()
            }

            function articleViewRender() {
                articleViewRendered || (fitArticleView(), config.set({
                    pageWidth: clientWidth,
                    pageHeight: config.get("pageHeight"),
                    lineHeight: lineHeight
                }), detector.hasOrientationEvent() && $(window).on("orientationchange", function() {
                    location.replace(location.href)
                }), articleViewRendered = 1, fitReviewBtn())
            }

            function fitFiguresWidth(data) {
                var typePageWidth = 16 * (clientWidth - 3);
                data.posts.forEach(function(stories) {
                    stories.contents.forEach(function(p) {
                        "illus" === p.type && figureUtil.resizeIllus(p, {
                            maxWidth: typePageWidth
                        })
                    })
                })
            }

            function fitArticleView() {
                article.$el.css({
                    height: clientHeight + "em"
                }).find(".inner").css({
                    width: 3 * clientWidth + "em"
                }), article.lineHeight = 16 * lineHeight, article.pageHeight = 16 * pageContentHeight, new ArticleTouch({
                    el: article.$el,
                    asideControls: asideControls
                })
            }

            function fitPageView() {
                if (!pageViewRendered) {
                    var rangeTimer, toc, tocView;
                    $(".progress-num"), tocView = config.get("isChapter") ? controlsPanel.chaptersTocView : controlsPanel.tocView, toc = tocView.$el, toc.css({
                        height: clientHeight + "em"
                    }).appendTo(".article"), toc.on("action:expand", function() {
                        tocScroller && tocScroller.refresh()
                    }).on("tap", ".close", function() {
                        hideToolbar(), controlsPanel.switcher.hideAll()
                    }).on("tap", "ul", function(e) {
                        tocView.tocJump(e), hideToolbar()
                    }), pagePortal.$el.on(detector.isApplePhone ? "change" : "release", ".page-input", function(e) {
                        clearTimeout(rangeTimer), rangeTimer = setTimeout(function() {
                            var currPage = 0 | $(e.currentTarget).val();
                            turningModel.setCurrPage(currPage)
                        }, 200)
                    }), pagePortal.formInput.replaceWith($("<input>", {
                        "class": "page-input",
                        type: "range",
                        step: 1,
                        min: 1
                    })), pageViewRendered = 1
                }
            }

            function swipePage(direction) {
                if ("vertical" !== config.get("layout")) {
                    var pageMap = {
                        left: "pageNext",
                        right: "pagePrev"
                    };
                    switch (direction) {
                        case "left":
                        case "right":
                            pagination[pageMap[direction]].trigger("tap")
                    }
                }
            }

            function turnPage(isPrev) {
                "vertical" !== config.get("layout") && pagination.pageTurning(isPrev, {
                    fromMobileTap: !0
                })
            }

            function fitReviewBtn() {
                var reviewBtn = (app.getModel("config"), controlsPanel.$(".controls-ark-salon")),
                    reviewsUrl = app.router.getReviewsUrl();
                reviewsUrl || reviewBtn.hide(), reviewBtn.find("a").attr("href", reviewsUrl)
            }

            function fitToc() {
                var isChapter = config.get("isChapter"),
                    toc = isChapter ? controlsPanel.chaptersToc : controlsPanel.toc,
                    tocHead = toc.find(".hd"),
                    tocBody = toc.find(".bd"),
                    tocFoot = toc.find(".ft"),
                    extraHeight = tocHead.innerHeight() + parseInt(tocHead.css("padding-top"), 10) + tocFoot.innerHeight();
                tocBody.height(this.body.height() - extraHeight + "px"), tocBody.length && (tocScroller = new IScroll(tocBody[0], {
                    click: !0,
                    tap: !1
                }), toc.on("collapse:expanded", function() {
                    tocScroller.scrollToElement(".is-current")
                }))
            }

            function updateRangeInput(currPage) {
                var totalPage = turningModel.get("totalPage");
                pagination.pageForm.show(), pagination.$el.find(".page-input").prop({
                    max: totalPage,
                    value: currPage
                }), sliderThumbStyle.html('.page-jump .page-input::-webkit-slider-thumb:after{content:"' + pagination.$el.find(".progress-num").text() + '"}')
            }

            function resetPageSize() {
                if (!$("#page-style").length) {
                    var cssContent = "            .page { width: pageWidth; height: pageHeight }            .page .bd { height: contentHeight }            .page .hd, .page .ft { width: contentWidth }          ".replace("pageWidth", typePageSize.width).replace("pageHeight", typePageSize.height).replace("contentHeight", typePageSize.contentHeight).replace("contentWidth", typePageSize.width);
                    $("<style>", {
                        id: "page-style",
                        text: cssContent
                    }).appendTo("head")
                }
            }
            if (detector.hasTouch()) {
                $('<style id="slider-thumb">').appendTo("head");
                var topPanel, ebookView = views.ebook,
                    canvas = ebookView.canvas,
                    panel = ebookView.panel,
                    article = ebookView.article,
                    pagination = ebookView.pagination,
                    controlsPanel = ebookView.controlsPanel,
                    asideControls = canvas.$(".aside-controls"),
                    pagePortal = pagination.pagePortal,
                    config = ebookView.config,
                    turningModel = app.getModel("turning"),
                    sliderThumbStyle = $("#slider-thumb");
                app.mobileVent = _.extend({}, Backbone.Events), app.mobileVent.on("turnPage", turnPage).on("hideToolbar", hideToolbar).on("toggleToolbar", toggleToolbar), handleTouch(), fitForMobile && adapteMobile()
            }
        }
        var doc = document,
            adType = "bottom",
            body = doc.body,
            clientWidth = body.clientWidth / 16,
            clientHeight = (window.innerHeight || body.clientWidth) / 16,
            fitForMobile = detector.fitForMobile(),
            articleViewRendered = 0,
            pageViewRendered = 0,
            tocScroller = "",
            lineHeight = 1.5,
            pageHeight = clientHeight - 5,
            pageContentHeight = fillHeight(clientHeight - ("bottom" === adType ? 7 : 5)),
            typePageSize = {
                width: clientWidth - 3 + "rem",
                contentHeight: pageContentHeight + "em",
                height: pageHeight + "em"
            };
        return adapter
    }), define("../reader/models/turning", ["underscore", "backbone", "mod/error"], function(_, Backbone, error) {
        var TurningModel = Backbone.Model.extend({
                initialize: function() {
                    this.on("change:currPage", this.setProgressAsCurrPage).on("change:currPage", this.setCurrPagePosition)
                },
                setProgressAsCurrPage: function(model, currPage) {
                    var totalPage = model.get("totalPage");
                    model.set("progress", 100 * (currPage / totalPage))
                },
                setCurrPagePosition: function(model, currPage) {
                    model.set("isFirstPage", 1 >= currPage), model.set("isLastPage", currPage === model.get("totalPage"))
                },
                setCurrPage: function(pageNum, options) {
                    this.set({
                        currPage: this.pageScope(pageNum)
                    }, options)
                },
                setReadCurrPage: function(readPageNum, options) {
                    this.setCurrPage(this.read2real(readPageNum), options)
                },
                getReadCurrPage: function() {
                    var pageNum = this.get("currPage");
                    return this.real2read(pageNum)
                },
                setTotalPage: function(pages) {
                    this.set({
                        totalPage: pages
                    })
                },
                getReadTotalPage: function() {
                    var totalPage = this.get("totalPage");
                    return this.real2read(totalPage)
                },
                pageScope: function(targetPage) {
                    var totalPage = this.get("totalPage"),
                        page = parseInt(targetPage, 10) || 1;
                    return page = 0 >= page ? 1 : page, page = page > totalPage ? totalPage : page
                },
                turnLastPage: function() {
                    this.setCurrPage(this.get("totalPage"))
                },
                turnFirstPage: function() {
                    this.setCurrPage(1)
                },
                currIsGiftPage: function() {
                    return this.get("isGift") && 1 === this.get("currPage")
                },
                isPageTurned: function() {
                    return !!this.get("currPage")
                },
                set: function() {
                    return this.isDisabled() ? (error("turningModel.set() has been disabled, set failed"), this) : Backbone.Model.prototype.set.apply(this, arguments)
                },
                disableSet: function() {
                    this.setDisable = !0
                },
                enableSet: function() {
                    this.setDisable = !1
                },
                isDisabled: function() {
                    return !!this.setDisable
                }
            }),
            utils = {
                read2real: function(readPageNum) {
                    return readPageNum + (this.get("isGift") ? 1 : 0)
                },
                real2read: function(readPageNum) {
                    var readNum = readPageNum - (this.get("isGift") ? 1 : 0);
                    return !readNum || 1 > readNum ? 1 : readNum
                }
            };
        return _.extend(TurningModel.prototype, utils), TurningModel
    }), define("../reader/views/reading/canvas", ["jquery", "backbone", "underscore", "arkenv", "reader/app", "mod/key", "mod/detector", "reader/models/turning", "reader/modules/storage", "reader/modules/browser", "reader/modules/adapter/view", "reader/modules/mousewheel", "reader/views/common/panel/view", "reader/views/reading/article", "reader/views/reading/pagination", "reader/views/reading/controls_panel", "reader/views/modules/time_tracker/time_tracker", "reader/views/modules/desktop-app-ad", "reader/views/reading/modules/jumpback"], function($, Backbone, _, arkenv, app, Key, detector, TurningModel, storage, browser, adapter, MouseWheel, PanelView, ArticleView, Pagination, ControlsPanel, TimeTracker, DesktopAppAd, Jumpback) {
        var ReadView = Backbone.View.extend({
            el: "#ark-reader",
            initialize: function() {
                _.bindAll(this, "freezeCanvas", "unfreezeCanvas", "freezeControl", "unfreezeControl", "scrollPage", "changeLayout", "renderGuide", "renderPanel"), this.app = app, this.vent = this.app.vent, this.config = app.getModel("config");
                var turningModel = new TurningModel;
                app.setModel("turning", turningModel), turningModel.disableSet(), turningModel.on("change:isFirstPage", function(model, isFirstPage) {
                    this.$el.toggleClass("first-page", isFirstPage)
                }, this).on("change:isLastPage", function(model, isLastPage) {
                    this.$el.toggleClass("last-page", isLastPage)
                }, this), this.panel = new PanelView({
                    el: ".aside",
                    config: this.config
                }), this.article = new ArticleView(this.config), this.pagination = new Pagination(this.config), this.controlsPanel = new ControlsPanel(this.config), this.article.on("article:init", function() {
                    turningModel.enableSet(), turningModel.clear({
                        silent: !0
                    }), turningModel.disableSet()
                }).on("article:init", _.bind(function() {
                    this.article.once("pages:rendered:fully", function() {
                        app.vent.trigger("pages:layout:finish"), app.vent.trigger("reader:layout:finish")
                    })
                }, this)), app.vent.once("reader:layout:finish", function() {
                    _.defer(function() {
                        app.vent.trigger("reader:ready")
                    })
                }), adapter({
                    ebook: {
                        canvas: this,
                        panel: this.panel,
                        article: this.article,
                        pagination: this.pagination,
                        controlsPanel: this.controlsPanel,
                        config: this.config
                    }
                }), this.win = $(window), this.body = $("body"), this.bindKeyEvents(), this.bindWheelEvents(), this.docElement = $(document.documentElement), this.savingTimer = 0, this.scrollContainer = this.body, this.vent.on({
                    "freeze:canvas": this.freezeCanvas,
                    "unfreeze:canvas": this.unfreezeCanvas,
                    "freeze:control": this.freezeControl,
                    "unfreeze:control": this.unfreezeControl,
                    "scroll:page": this.scrollPage,
                    "change:layout": this.changeLayout,
                    "render:panel": this.renderPanel,
                    "reader:ready": this.renderGuide
                }), this.listenTo(turningModel, "change:currPage", function() {
                    app.vent.trigger("close:popups"), this.pagination.updateProgressBar()
                }), TimeTracker.bindAll(this)
            },
            renderThenOpenChapterList: function(articleId) {
                app.vent.once("reader:ready", function() {
                    this.controlsPanel.openChapterList()
                }, this), this._render(articleId)
            },
            renderThenOpenRecommendation: function(articleId, rId) {
                app.getModel("config").set("ignoreGuide", !0);
                var hooks = new Jumpback.Recommendation(articleId, rId);
                this.article.attachHooks(hooks), this._render(articleId)
            },
            renderThenShowUnderline: function(articleId, underlineData) {
                app.getModel("config").set("ignoreGuide", !0);
                var hooks = new Jumpback.Underline(underlineData);
                this.article.attachHooks(hooks), this._render(articleId)
            },
            renderThenOpenAnnotation: function(articleId, annotationId) {
                app.getModel("config").set("ignoreGuide", !0);
                var hooks = new Jumpback.Annotation(articleId, annotationId);
                this.article.attachHooks(hooks), this._render(articleId)
            },
            renderThenOpenParaAnnotations: function(articleId, paraId) {
                app.getModel("config").set("ignoreGuide", !0);
                var hooks = new Jumpback.ParaAnnotations(paraId);
                this.article.attachHooks(hooks), this._render(articleId)
            },
            renderThenGotoChapter: function(articleId, index) {
                app.router.cleanUrl();
                var hooks = new Jumpback.TocChapter(index);
                this.article.attachHooks(hooks), this._render(articleId)
            },
            render: function(articleId) {
                this._render(articleId)
            },
            _render: function(articleId) {
                return this.articleId = articleId, this.article.render(articleId), this.pagination.render(), this.controlsPanel.render(), browser.fitForMobile || ((new DesktopAppAd).appendTo(this.$el), this.changeLayout()), this.trigger("view:rendered"), this
            },
            renderGuide: function() {
                this.config.get("ignoreGuide") || (this.config.get("isNewUser") ? this.openHelperGuide() : this.config.get("hasShownAnnotationGuide") || "c" === arkenv.works.type || this.openAnnotationGuide())
            },
            openHelperGuide: function() {
                this.panel.toggleHelper(), this.config.set("isNewUser", !1)
            },
            openAnnotationGuide: function() {
                browser.fitForMobile || (this.panel.openAnnotationGuideBubble(), this.config.set("hasShownAnnotationGuide", !0))
            },
            renderPanel: function(articleId) {
                this.panel.render(articleId)
            },
            changeLayout: function() {
                var layout = this.config.get("layout");
                this.body.scrollTop(0), this.$el.toggleClass("layout-vertical", "vertical" === layout), this.pagination.togglePagingBtns(layout), this.pagination.updateProgressBar()
            },
            show: function() {
                return this.panel.show(), this.key.enable(), this.wheel.enable(), this.isShown ? this : (this.docElement.addClass("reading-view"), /msie (8|9)/i.test(navigator.userAgent) && (this.docElement.on("selectstart.unselectable", function(e) {
                    e.preventDefault()
                }), this.docElement.on("selectstart.unselectable", ".content", function(e) {
                    e.stopPropagation()
                })), this.isShown = !0, this.$el.show(), this.vent.trigger("canvas:shown"), this)
            },
            hide: function() {
                if (this.panel.hide(), !this.isShown) return this;
                this.key.disable(), this.win.off("scroll"), this.win.off("resize"), this.docElement.removeClass("reading-view"), /msie (8|9)/i.test(navigator.userAgent) && this.docElement.off(".unselectable"), this.controlsPanel.closeTips(), this.pagination.removeProgressBar(), this.$el.hide(), this.isShown = !1, $(".tips-outer").remove();
                try {
                    storage.set("previousAid", this.articleId)
                } catch (e) {}
                return this.vent.trigger("canvas:hidden"), this
            },
            scrollPage: _.throttle(function(top, duration) {
                duration = duration || 300, this.scrollContainer.animate({
                    scrollTop: top
                }, duration)
            }, 100),
            freezeControl: function() {
                this.key.disable(), this.wheel.disable()
            },
            unfreezeControl: function() {
                this.key.enable(), this.wheel.enable()
            },
            freezeCanvas: function() {
                this.freezeControl(), this.$el.after('<div id="freeze-canvas-mask">')
            },
            unfreezeCanvas: function() {
                this.unfreezeControl(), $("#freeze-canvas-mask").remove()
            },
            changeFullscreenStyle: function() {
                this.panel.toggle(), this.panel.hideBubble(), this.controlsPanel.closeTips()
            },
            bindWheelEvents: function() {
                var self = this;
                this.wheel = new MouseWheel({
                    disableElements: [".bubble", ".tooltip", ".tips-outer", "#ark-overlay"]
                }), this.wheel.onWheelBottom(function() {
                    var layout = app.getModel("config").get("layout");
                    "horizontal" === layout && self.pagination.pageNext.trigger("humanClick")
                }), this.wheel.onWheelTop(function() {
                    var layout = app.getModel("config").get("layout");
                    "horizontal" === layout && self.pagination.pagePrev.trigger("humanClick")
                })
            },
            bindKeyEvents: function() {
                var self = this,
                    config = this.config,
                    lineHeight = 16 * config.get("lineHeight");
                this.key = Key(), this.key.down(["j", "right", "space"], function() {
                    var layout = config.get("layout");
                    if ("horizontal" === layout) self.pagination.pageNext.trigger("humanClick");
                    else {
                        var pageHeight = config.get("pageHeight"),
                            scrollHeight = pageHeight - 2 * lineHeight;
                        self.scrollPage("+=" + scrollHeight + "px", 100)
                    }
                }).down(["k", "left", "shift+space"], function() {
                    var layout = config.get("layout");
                    if ("horizontal" === layout) self.pagination.pagePrev.trigger("humanClick");
                    else {
                        var pageHeight = config.get("pageHeight"),
                            scrollHeight = pageHeight - 3 * lineHeight;
                        self.scrollPage("-=" + scrollHeight + "px", 100)
                    }
                }).down(["down"], function() {}).down(["up"], function() {}).down("shift+g", function() {
                    app.getModel("turning").turnLastPage()
                }).down("g->g", function() {
                    app.getModel("turning").turnFirstPage()
                }).down("esc", function() {
                    self.controlsPanel.closeTips(), self.controlsPanel.closePopups()
                }).down("shift+/", function() {
                    self.panel.toggleHelper()
                }).down("/", function(e) {
                    e.preventDefault(), self.pagination.pagePortal.trigger("view:openPageForm")
                }).down(["meta+shift+f", "f11"], function() {
                    self.changeFullscreenStyle()
                }).down(["ctrl+a", "meta+a"], function(e) {
                    return e.preventDefault(), !1
                })
            }
        });
        return ReadView
    });
