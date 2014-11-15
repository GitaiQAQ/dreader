define("app/page/app.js", [], function(t) {
    "use strict";
    t("../platform-web/view/view"), t("../platform-web/action/action");
    var e = t("../data/data"),
        i = t("module/base/app"),
        s = {
            maxPages: 7,
            traits: [{
                name: "small",
                width: 433,
                height: 577
            }, {
                name: "medium",
                width: 667,
                height: 889
            }]
        },
        n = e.local.prefer();
    "vertical" == n && (s.traitDouble = {
        trait: 1,
        "double": 1
    }), i(s)
}), define("app/platform-web/view/view.js", [], function(t) {
    "use strict";
    var e = t("../../view/view"),
        i = t("../../data/data"),
        s = "vertical" !== i.local.prefer(),
        n = [
            ["book", t("./horizontal-book"), {
                delay: !s
            }],
            ["horizontalBody", t("./horizontal-body"), {
                delay: !s,
                selector: document.body
            }],
            ["verticalBook", t("./vertical-book"), {
                delay: s,
                selector: ".j-md-book"
            }],
            ["verticalBody", t("./vertical-body"), {
                delay: s,
                selector: document.body
            }],
            ["toc", t("./toc")],
            ["ctrl", t("../../view/ctrl")],
            ["slider", t("../../view/slider")],
            ["comment", t("../../view/comment")]
        ];
    e.mixTo(n)
}), define("app/platform-web/action/action.js", [], function(t) {
    "use strict";
    var e = t("../../action/action"),
        i = {
            app: t("../../action/app"),
            book: t("../../action/book"),
            ctrl: t("../../action/ctrl")
        },
        s = ["app:renderPage", "app:showWelcome", "app:askProgress", "app:noobDetect", "app:keyPress", "app:savePreference", "app:freeLimit"];
    e.mixTo(i, s)
}), define("app/platform-web/view/horizontal-book.js", [], function(t) {
    "use strict";
    var e = t("./book/page"),
        i = t("./book"),
        s = i.create(),
        n = s.prototype;
    return n.__createPage = function(t) {
        var i = {
            isPageShow: this.isPageShow.bind(this, t),
            getBook: this.__reader.getBook,
            getPage: this.__reader.pages.get,
            goPage: this.__reader.go.bind(this.__reader),
            num: t
        };
        return new e(i)
    }, n.__setPosition = function() {
        var t = this.__reader.getView().page,
            e = this.__reader.getView().range,
            i = this.__reader.getBook(),
            s = i.info.trait.width;
        _.each(e, function(e) {
            var i = this.getPage(e);
            i.$el.css("left", (e - t) * s)
        }, this)
    }, n._traitchange = function() {
        this.__clearCache();
        var t = this.__reader.getBook(),
            e = t.info.trait.width,
            i = t.info.double;
        this.__ref.container.css("height", t.info.trait.height), this.__ref.container.css("width", e * i)
    }, n._doublechange = function() {
        var t = this.__reader.getBook(),
            e = t.info.trait.width,
            i = t.info.double;
        this.__ref.container.css("width", e * i), this.__ref.container.css("height", t.info.trait.height), this.__updateHeaderFooter()
    }, n.__destroy = function() {
        this.__ref.container.css("height", ""), this.__ref.container.css("width", ""), this.__supDestroy()
    }, s
}), define("app/platform-web/view/horizontal-body.js", [], function(t, e) {
    "use strict";
    t("widget/jquery_plugin/jquery_mousewheel");
    var i = e;
    i.initialize = function() {
        this.supInitialize.apply(this, arguments), $(document.body).attr("id", "horizontal_reader"), this.__reader.checkViewport(), $(window).resize(this.__reader.checkViewport), this.__mouseFunc = _.throttle(this.__onMouseWheel.bind(this), 250), $(document).mousewheel(this.__mouseFunc), this.styleNode = vp.pushCSSText("html{overflow:hidden}")
    }, i.__onMouseWheel = function(t, e, i, s) {
        0 > s ? this.__reader.pageDown() : this.__reader.pageUp()
    }, i.__destroy = function() {
        $(window).unbind("resize", this.__reader.checkViewport), $(document).unbind("mousewheel", this.__mouseFunc), this.styleNode.remove()
    }
}), define("app/platform-web/view/vertical-book.js", [], function(t) {
    "use strict";
    var e = t("./book"),
        i = t("./book/page");
    t("tpl");
    var s = e.create(),
        n = s.prototype;
    return n._traitchange = function() {
        this.styleNode && this.styleNode.remove();
        var t = this.__reader.getBook(),
            e = t.typo.page_size[0],
            i = t.typo.page_size[1];
        this.styleNode = vp.pushCSSText("#vertical_reader .m-reader .rd_cnt .book_page_wrapper{height:" + i + "px;width:" + e + "px;}"), this.__clearCache(), this._scrollend()
    }, n.__setPosition = function(t) {
        t = _.defaults(t || {}, {
            offset: -60
        });
        var e = this.__reader.getBook();
        e.typo.pages;
        var i = this.__reader.getView(),
            s = e.typo.page_size[1];
        console.log("before set scrollTop ->", $(".j-page-wrapper").scrollTop(), t);
        var n = _.indexOf(i.range, i.page) * s + t.offset;
        console.log("scrollTop ->", n), $(".j-page-wrapper").scrollTop(n), console.log("after set scrollTop ->", $(".j-page-wrapper").scrollTop()), 0 == $(".j-page-wrapper").scrollTop() && $(".j-page-wrapper").scrollTop() !== n && setTimeout(function() {
            $(".j-page-wrapper").scrollTop(n)
        }, 0), this.__reader.block(1), setTimeout(function() {
            this.__reader.block(0)
        }.bind(this), 0)
    }, n.__createPage = function(t) {
        var e = {
            isPageShow: this.isPageShow.bind(this, t),
            getBook: this.__reader.getBook,
            getPage: this.__reader.pages.get,
            goPage: this.__reader.go.bind(this.__reader),
            num: t
        };
        return new i(e)
    }, n.__destroy = function() {
        console.log("vertical-book destory"), this.__supDestroy(), this.styleNode.remove()
    }, s
}), define("app/platform-web/view/vertical-body.js", [], function(t, e) {
    "use strict";
    var i = e;
    i.initialize = function() {
        this.supInitialize.apply(this, arguments), this.__reader.setTraitdouble({
            trait: 1,
            "double": 1
        }), $(".j-page-wrapper").scroll(this.__onScroll.bind(this)), this.__centerFunc = this.__center.bind(this), $(window).resize(this.__centerFunc), this.__center(), $(document.body).attr("id", "vertical_reader"), this._traitchange = this.__centerFunc
    }, i.__onScroll = function() {
        this.__height = this.__reader.getBook().typo.page_size[1];
        var t = this.__reader.getView(),
            e = _.indexOf(t.range, t.page) * this.__height,
            i = $(".j-page-wrapper").scrollTop(),
            s = i - e;
        if (console.log("before scroll", s, this.__height), !(Math.abs(s) < this.__height)) {
            var n = parseInt(s / this.__height);
            s %= this.__height, this.__reader.scrollTo(n, {
                offset: s
            }), console.log("after scroll", s, n)
        }
    }, i.__updatePage = function(t) {
        console.log("offset", t.offset);
        var e = _viewport.page;
        t.offset > 0 ? t.offset > .7 * _height && e++ : t.offset > .3 * _height && e--
    }, i.__center = function() {
        var t = this.__reader.getBook().typo.page_size[0],
            e = $(window).width() / 2 - t / 2;
        $(".j-md-header").css("left", e), $(".j-md-footer").css("left", e), $(".j-page-container").css("left", e), $(".rd_others").css("left", e).width(t)
    }, i.__destroy = function() {
        console.log("vertical-wrapper destory"), $(window).unbind("resize", this.__centerFunc), $(".j-page-container").css("left", ""), $(".j-md-header").css("left", ""), $(".j-md-footer").css("left", ""), $(".rd_others").css("left", ""), $(".j-page-wrapper").unbind("scroll"), $(document.body).attr("id", "horizontal_reader")
    }
}), define("app/platform-web/view/toc.js", [], function(t) {
    "use strict";
    var e = t("../../view/base");
    t("widget/mask/mask");
    var i = t("common/scroll2"),
        s = t("widget/tab/tab"),
        n = t("common");
    t("platform").browser;
    var o = [t("./toc/toc"), t("./toc/bookmark"), t("./toc/notes")],
        r = e.create(),
        a = r.prototype,
        h = r._$supro;
    return a.events = {
        "click .j-itm": function(t) {
            return $(t.currentTarget).hasClass("disable") || (this.__reader.go(parseInt($(t.currentTarget).attr("page_from"), 10), !0, !0), this.hide()), !1
        },
        "click .j-close": function() {
            return this.hide(), !1
        },
        "click .j-need-login": n.login
    }, a.initialize = function() {
        this.supInitialize.apply(this, arguments);
        var t = this.__reader.getBook().typo;
        this.__ref = {
            tabs: this.$(".j-tab .j-tab-list").children(),
            container: this.$(".j-tab-content"),
            panels: this.$(".j-tab-content").children()
        }, this.$(".title h1").text(t.title), this.__modules = [], this.__tab = new s({
            list: this.__ref.tabs,
            selected: "active",
            disabled: "j-need-login",
            onchange: this.__onTabChange.bind(this)
        }), this.__scroll = new i({
            className: "track",
            slideName: "scroll",
            body: this.$(".j-tab-content")
        }), n.isLogin() || (this.__ref.tabs.eq(1).addClass("j-need-login"), this.__ref.tabs.eq(2).addClass("j-need-login"))
    }, a.__onTabChange = function(t) {
        var i = t.index,
            s = this.__modules[i];
        s || (s = e.create(o[i]), this.__modules[i] = new s({
            reader: this.__reader,
            el: this.__ref.panels.eq(i),
            container: this.__ref.container
        }), s = this.__modules[i]), void 0 !== t.last && this.__modules[t.last].hide(), this.__modules[i].show(), this.__ref.container.scrollTop(0)
    }, a._traitchange = function() {
        _.each(this.__modules, function(t, e) {
            t && (t.recycle(), this.__modules[e] = void 0)
        }, this), this.__onTabChange({
            index: this.__tab.getIndex()
        })
    }, a.show = function() {
        h.show.apply(this, arguments), this.__scroll.enable(), this.__onTabChange({
            index: this.__tab.getIndex()
        }), this.trigger("act:toggleControl", !0), $("#toc_icon").addClass("u-icn-dirct-act")
    }, a.hide = function() {
        h.hide.apply(this, arguments), this.__scroll && this.__scroll.disable(), this.trigger("act:toggleControl", !1), $("#toc_icon").removeClass("u-icn-dirct-act"), this.__modules[1] && (this.__modules[1].recycle(), this.__modules[1] = void 0), this.__modules[2] && (this.__modules[2].recycle(), this.__modules[2] = void 0)
    }, a.toggle = function() {
        this.$el.is(":visible") ? this.hide() : this.show()
    }, r
}), define("app/view/ctrl.js", [], function(t) {
    "use strict";
    var e = t("./base"),
        i = t("common/fullscreen"),
        s = e.create(),
        n = s.prototype;
    return s._$supro, n.events = {
        "click .j-fullscreen": function(t) {
            var e = $(t.currentTarget);
            i.isFullScreen() ? (i.cancelFullScreen(), e.children().eq(1).hide().prev().show()) : (i.requestFullScreen(document.documentElement), e.children().eq(0).hide().next().show())
        },
        "click .j-pattern": function() {
            this.trigger("act:switchDirection")
        },
        "click .j-comment": function() {
            this.trigger("act:toggleComment")
        },
        "click .j-toc": function() {
            this.trigger("act:toggleToc")
        },
        "click .j-pagedown": function() {
            this.__reader.pageDown()
        },
        "click .j-pageup": function() {
            this.__reader.pageUp()
        }
    }, n.initialize = function(t) {
        this.supInitialize.apply(this, arguments), this.__book = this.__reader.getBook(), this.__modules = t.modules, i.support() && this.$(".j-fullscreen").show(), this.$(".j-comment .j-num").text(this.__book.detail.comment_count)
    }, s
}), define("app/view/slider.js", [], function(t) {
    "use strict";
    var e = t("./base"),
        i = t("widget/slider/slider_y"),
        s = t("tpl");
    t("widget/animate/decelerate");
    var n = e.create(),
        o = n.prototype;
    return n._$supro, o.initialize = function() {
        this.supInitialize.apply(this, arguments), this.__ref = {
            slider: this.$(".btn"),
            tips: this.$(".tips")
        }, this.__ref.slider.on("mousedown", function() {
            this.__ref.tips.stop(!0, !0).fadeIn()
        }.bind(this)), this.__doBuild(), $(window).resize(this.__doBuild.bind(this)), this._scroll()
    }, o.__doBuild = function() {
        this.__formatSlider(), this.__initSlider()
    }, o.__formatSlider = function() {
        var t = this.$el.height(),
            e = 1 / this.__reader.getBook().info.size * t;
        this.__ref.slider.height(e)
    }, o.__initSlider = function() {
        this.__slider && this.__slider.recycle();
        var t = {
            slide: this.__ref.slider,
            track: this.$el,
            onchange: this.__onSliderChange.bind(this)
        };
        this.__slider = new i(t), this.__ref.slider.css("visibility", "")
    }, o.__onSliderChange = function(t) {
        var e = t.stopped,
            i = this.__reader.getBook().info.size,
            s = Math.floor(t.y.rate * (i - 1)) + 1;
        this.__showTips(t.y.value, s, i), e && (this.__ref.tips.fadeOut(), this.__reader.go(s))
    }, o.__showTips = function(t, e, i) {
        var n = this.__ref.tips.innerHeight(),
            o = this.__ref.slider.height(),
            r = t - (n - o) / 2,
            a = this.$el.height() - n;
        r = Math.min(a, Math.max(0, r)), this.__ref.tips.css("top", r), this.__ref.tips.html(s.getJst("jst-slider-tips", {
            crt: e,
            size: i,
            getTocName: this.__reader.getTocName
        }))
    }, o._scroll = function() {
        var t = this.__reader.getView(),
            e = (t.page - 1) / (t.size - 1);
        this.__slider.setPosition({
            y: e
        })
    }, n
}), define("app/view/comment.js", [], function(t) {
    "use strict";
    var e = t("./base");
    t("platform").browser;
    var i = t("common/jst_defaults"),
        s = t("tpl"),
        n = t("common/scroll2");
    t("widget/mask/mask");
    var o = t("module/md_end"),
        r = t("module/comment/md_comment_list"),
        a = e.create(),
        _ = a.prototype,
        h = a._$supro;
    return _.events = {
        "click .j-gotop": function() {
            this.$(".j-comment-wrapper").scrollTop(0)
        },
        "click .j-close": function() {
            this.toggle()
        }
    }, _.initialize = function() {
        s.setJst(i), this.supInitialize.apply(this, arguments), this.__book = this.__reader.getBook(), new o({
            el: this.$(".j-comment-write"),
            book: this.__book.typo
        }), new r({
            el: this.$(".j-comment"),
            book: this.__book.detail
        }), this.__render()
    }, _.__render = function() {
        this.$(".j-title").text(this.__book.detail.title), this.$(".j-comment-total").text(this.__book.detail.comment_count);
        var t = !this.__book.typo.own_book;
        t || this.$(".j-comment-write").show(), this.$(".j-comment-wrapper").scroll(function() {
            var e = this.$(".j-comment-wrapper").scrollTop() > 300;
            !t && this.$(".j-gotop").toggle(e)
        }.bind(this))
    }, _.show = function() {
        h.show.apply(this, arguments), this.__scroll || (this.__scroll = new n({
            className: "track",
            slideName: "scroll",
            body: this.$(".j-comment-wrapper")
        })), this.__scroll.enable(), this.trigger("act:toggleControl", !0), $("#comment_icon").addClass("u-icn-talk-act")
    }, _.hide = function() {
        h.hide.apply(this, arguments), this.__scroll && this.__scroll.disable(), this.trigger("act:toggleControl", !1), $("#comment_icon").removeClass("u-icn-talk-act")
    }, _.toggle = function() {
        this.$el.is(":visible") ? this.hide() : this.show()
    }, a
}), define("app/platform-web/view/book/page.js", [], function(t) {
    "use strict";

    function e(t) {
        var e = $(".u-showbox .cnt"),
            i = $(".u-showbox").height(),
            s = $(".u-showbox .cnt .image-clip").height(),
            n = parseInt(e.css("top"), 10);
        i > s ? n = (i - s) / 2 : (n > t && (n = t), i - s - t > n && (n = i - s - t)), e.css("top", Math.ceil(n));
        var o = $(".u-showbox").width(),
            r = $(".u-showbox .cnt .image-clip").width(),
            a = parseInt(e.css("left"), 10);
        o > r ? a = (o - r) / 2 : (a > t && (a = t), o - r - t > a && (a = o - r - t)), e.css("left", Math.ceil(a))
    }
    var i = t("base"),
        s = t("./paper"),
        n = t("tpl"),
        o = t("module/md_end"),
        r = t("widget/mask/mask"),
        a = t("common/keypress"),
        _ = i.create(),
        h = _.prototype;
    h.__initXGui = function() {
        this.__tpl = n.getJst("jst-page", {
            num: this.options.num
        })
    }, h.initialize = function(t) {
        this.supInitialize.apply(this, arguments), this.__num = this.options.num, this.parsed = !1, this.show = !1, this.__getPage = t.getPage, this.__isPageShow = t.isPageShow, this.__getBook = t.getBook, this.__goPage = t.goPage
    }, h.__destroy = function() {
        this.__supDestroy.apply(this, arguments), this.__destroyed = !0
    }, h.parse = function() {
        if (!this.parsed) {
            this.parsed = !0;
            var t = this.$el.find(".book_page"),
                e = this.__getBook();
            if (this.__num == e.info.size) {
                var i = n.getJst("jst-final-page", e);
                return i = $(i), t.append(i), e.typo.own_book && new o({
                    el: i,
                    book: e.typo
                }), $(".book_page_wrapper").css("width", e.info.trait.width), $(".book_page_wrapper").css("height", e.info.trait.height), this.$el.find(".loading").remove(), void 0
            }
            this.draw()
        }
    }, h.draw = function() {
        this.__getPage(this.__num).done(function(t) {
            this.__destroyed || this.__isPageShow(this.__num) && (t ? this.__drawPage(t) : this.__drawRetryPage(this.__num))
        }.bind(this))
    }, h.__drawRetryPage = function() {
        var t, e;
        t = this.$el.find(".loading"), t.hide(), e = $('<a class="u-btn u-btn-retry">刷新重试</a>'), e.one("click", function() {
            e.remove(), t.show(), this.draw()
        }.bind(this)), e.appendTo(this.$el)
    }, h.__drawPage = function(t) {
        new Date;
        var i = this.$el.find(".book_page");
        this.__getBook(), this.$el.find(".loading").remove();
        var n = new s(i.attr("id"), t, {
            getBook: this.__getBook
        });
        n.draw(), $(".book_page_wrapper").css("width", t.page_size[0]), $(".book_page_wrapper").css("height", t.page_size[1]), this.listenTo(n, "link_clicked", function(t) {
            var e = this.__getBook().typo;
            if (t.url) {
                var i, s = t.url;
                (i = s.match("duokan-reader://store/(.*)")) && (s = "http://www.duokan.com/" + i[1]), window.open(s)
            } else this.__goPage(e.chapters[t.chapter].page_range[0] + t.page)
        }.bind(this)), this.listenTo(n, "interactive_image_shown", function(t) {
            var i = $(".u-showbox").width(),
                s = $(".u-showbox").height(),
                n = !0;
            t.width > i && t.height > s ? u.__direction = 0 : t.width > i ? u.__direction = 1 : t.height > s ? u.__direction = 2 : n = !1, n && $(".u-showbox .cnt").css("cursor", "move");
            var o = $(".u-showbox").data("mask");
            o || (o = new r({
                parent: ".u-showbox",
                className: "mask",
                events: {
                    click: function() {
                        $(".u-showbox").hide(), o.hide()
                    }.bind(this)
                }
            }), $(".u-showbox").data("mask", o), a("esc", function() {
                o.$el.click()
            })), o.show(), e(0)
        }.bind(this))
    };
    var c, d = $(".u-showbox .cnt"),
        l = t("widget/dragger/dragger"),
        u = new l({
            view: $(".image-clip", ".u-showbox .cnt"),
            body: d,
            overflow: !0,
            direction: 0,
            onchange: function() {
                e(20)
            },
            ondragend: function() {
                e(0)
            }
        });
    return d.mousedown(function() {
        c = (new Date).getTime()
    }).mouseup(function() {
        var t = (new Date).getTime();
        100 > t - c && ($(".u-showbox").hide(), $(".u-showbox").data("mask").hide())
    }), _
}), define("app/platform-web/view/book.js", [], function(t) {
    "use strict";
    var e = t("../../view/base"),
        i = t("tpl"),
        s = t("common"),
        n = e.create(),
        o = n.prototype;
    return o.events = {
        "click .j-add-mark": function(t) {
            console.log("add mark");
            var e = $(t.currentTarget),
                i = this.__reader.getView();
            return s.isLogin() ? (e.hasClass("mark-enable") && (e.hasClass("icn-mark-chk") ? this.__reader.notes.deleteBookmarkAtPage(i.page).done(function(t) {
                var e = this.$(".j-md-header").find(".j-mark-" + t);
                e.removeClass("icn-mark-chk").addClass("icn-mark")
            }.bind(this, i.page)) : this.__reader.notes.addBookmark(i.page).done(function(t) {
                var e = this.$(".j-md-header").find(".j-mark-" + t);
                e.addClass("icn-mark-chk").removeClass("icn-mark")
            }.bind(this, i.page))), void 0) : (s.login(), void 0)
        }
    }, o.initialize = function() {
        this.supInitialize.apply(this, arguments), this.__ref = {
            container: this.$el
        }, this.__pageCache = {}, this.__range = [], this._traitchange(), this._doublechange(), this._scroll(), this._scrollend(), this.$(".j-page-loading").remove()
    }, o._scroll = function(t) {
        var e = this.__reader.getBook();
        e.typo.pages;
        var i = this.__reader.getView();
        console.log("view", i.range, "page", i.page), this.__appendPages(i.page, i.range), this.__setPosition(t), this.__updateHeaderFooter()
    }, o.__updateHeaderFooter = function() {
        var t = this.__reader.getBook();
        t.typo.pages;
        var e = this.__reader.getView(),
            s = t.info.double;
        return this.$(".j-md-header").html(i.getJst("jst-header", {
            book: t.detail,
            num: e.page,
            tocName: this.__reader.getTocName(e.page + s - 1)
        })), this.$(".j-md-footer").html(i.getJst("jst-footer", {
            num: e.page,
            size: e.size
        })), e.page == t.info.size ? (this.$(".j-md-header").find(".j-add-mark").hide(), void 0) : (this.$(".j-md-header").find(".j-add-mark").show(), this.__reader.notes.checkBookmark(e.page).done(function(t, e) {
            var i = this.$(".j-md-header").find(".j-mark-" + t);
            e ? i.addClass("icn-mark-chk").addClass("mark-enable").removeClass("icn-mark") : i.removeClass("icn-mark-chk").addClass("mark-enable").addClass("icn-mark")
        }.bind(this, e.page)), void 0)
    }, o._scrollend = function() {
        var t = function(t) {
            var e = [];
            return _.each(_.range(t), function(i) {
                var s = Math.floor(t / 2),
                    n = (s + i) % t;
                e.push(n)
            }), e
        };
        return function() {
            var e = this.__range.length,
                i = t(e);
            _.each(i, function(t) {
                var e = this.__range[t];
                this.getPage(e).parse()
            }, this)
        }
    }(), o._traitchange = function() {
        return !1
    }, o._doublechange = function() {
        return !1
    }, o.__setPosition = function() {
        return !1
    }, o.__appendPages = function(t, e) {
        var i = this.__range,
            s = e;
        n = _.difference(s, i), n.length && (n[0] == s[0] ? _.each(n.reverse(), function(t) {
            var e = this.getPage(t);
            e.$el.prependTo(this.__ref.container), e.show = !0
        }, this) : _.each(n, function(t) {
            var e = this.getPage(t);
            e.$el.appendTo(this.__ref.container), e.show = !0
        }, this));
        var n = _.difference(i, s);
        _.each(n, function(t) {
            var e = this.getPage(t);
            e.$el.remove(), delete this.__pageCache[t]
        }, this), this.__range = e
    }, o.getPage = function(t) {
        this.__reader.getBook();
        var e = this.__pageCache[t];
        return e || (e = this.__createPage(t), this.__pageCache[t] = e), e
    }, o.__clearCache = function() {
        _.each(this.__pageCache, function(t, e) {
            t.recycle(), delete this.__pageCache[e]
        }, this), this.__pageCache = {}, this.__range = []
    }, o.__createPage = function() {}, o.isPageShow = function(t) {
        return -1 !== _.indexOf(this.__range, t)
    }, o.__destroy = function() {
        this.undelegateEvents(), this.__clearCache()
    }, n
}), define("app/platform-web/view/book/paper.js", [], function(t) {
    function e(t, e) {
        if (!t && e) return -1;
        if (!e && t) return 1;
        if (!t && !e) return 0;
        for (var i = 0; 3 > i; i++)
            if (t[i] != e[i]) return t[i] - e[i];
        return 0
    }

    function i(t) {
        return [t[2], t[3], t[4], t[1]]
    }
    t("ext/raphael.js"), t("gallery/nicescroll/jquery.nicescroll.js");
    var s = t("common"),
        n = t("common/weibo");
    String.prototype.chomp = function() {
        return this.replace(/(\n|\r)+$/, "")
    }, String.prototype.format = function() {
        for (var t = this, e = 0; arguments.length > e; e++) {
            var i = RegExp("\\{" + e + "\\}", "gi");
            t = t.replace(i, arguments[e])
        }
        return t
    };
    var o = {
            SimSun: "SimSun, 宋体, 'Heiti SC'",
            "Microsoft Yahei": "'Microsoft Yahei', 微软雅黑, STHeiti, Hei, 'Heiti SC', 黑体",
            SimKai: "'Kaiti SC', STKaiti, 楷体",
            SimFang: "STFangsong, FangSong, 仿宋",
            Symbol: "DK-SYMBOL, 'Segoe UI', Georgia, Sans-Serif",
            "DK-SYMBOL": "DK-SYMBOL, 'Segoe UI', Georgia, Sans-Serif",
            "DK-SERIF": "DK-SERIF, 'Palatino Linotype', Serif",
            "DK-SERIF-BOLD": "DK-SERIF-BOLD, 'Palatino Linotype', Serif",
            "DK-SERIF-BOLD-ITALIC": "DK-SERIF-BOLD-ITALIC, 'Palatino Linotype', Serif",
            "DK-SERIF-ITALIC": "DK-SERIF-ITALIC, 'Palatino Linotype', Serif",
            "DK-CODE": "DK-CODE, 'Lucida Console', Monospace"
        },
        r = {},
        a = {},
        h = [48, 96, 128, 192, 256, 384, 1024],
        c = 100,
        d = 110,
        l = 120,
        u = t("event"),
        f = u.create(),
        p = f.prototype,
        g = t("ext/util"),
        m = g.uuid,
        v = new(u.create());
    t("gallery/zclip/1.1.1/jquery.zclip.js");
    var b = t("platform");
    $(window).click(function(t) {
        v.trigger("window-click", t)
    }), p.getNoteManager = function() {
        return reader.modules.notes
    }, p.init = function(t, e, i) {
        this.__getBook = i.getBook, this.id = "#" + t, this.page = e, this.width = e.page_size[0], this.height = e.page_size[1], $(this.id).css("width", this.width), $(this.id).css("height", this.height), "fullscreen" == this.page.type ? $(this.id).parent().addClass("fullscreen") : this.page.nopadding && $(this.id).addClass("nopadding"), this.bglayer = this.create_layer("background"), this.pathlayer = this.create_layer("path"), this.imagelayer = this.create_layer("image"), this.marklayer = this.create_layer("mark"), this.selectionlayer = this.create_layer("selection"), this.selectionlayer.css("background", "rgba(0,0,0,0)"), this.textlayer = this.create_layer("text"), "4.0" != b.kernel.release && "3.0" != b.kernel.release && ($(this.id).bind("mousedown", this.mousedown.bind(this)), $(this.id).bind("mouseup", this.mouseup.bind(this)), $(this.id).bind("mousemove", this.mousemove.bind(this)), $(this.id).bind("click", this.click.bind(this))), this.textbuffer = [], this.galleries = [], this.is_selection_started = !1, this.selectedtext = [], this.selectedlines = [], this.marks = [], this.listenTo(v, "after-copy", function() {
            this.clear_selection(), this.flash_copy_notification()
        }), this.listenTo(v, "selection-start", function(t) {
            this.id != t.id && this.clear_selection()
        }), this.listenTo(window.reader, "scroll", function() {
            this.clear_selection()
        }), this.listenTo(window.reader, "scroll", function() {
            $(".u-note").hide(), $("#popup-note").hide()
        }), this.listenTo(v, "window-click", function(t) {
            this.click(t), $("#popup-note").hide()
        }.bind(this))
    }, p.loadNotes = function() {
        var t = this.getNoteManager().getNotes(this.page.page_number);
        t.done(function(t) {
            $.each(t, function(t, s) {
                var n, o, r, a, _ = i(s.BeginRefPos),
                    h = i(s.EndRefPos),
                    c = !1;
                if ($.each(this.page.items, function(t, i) {
                    "word" == i.type && (void 0 === r && (r = t), a = t, 0 === e(i.pos, _) && (n = t), 0 === e(i.pos, h) && (o = t, c = !0), !c && 0 >= e(i.pos, h) && (o = t + 1))
                }), void 0 === n && (n = r), void 0 === o && (o = a), void 0 !== n && void 0 !== o) {
                    var d = {
                        start: n,
                        end: o
                    };
                    d.content = s.Content, d.id = s.DataID, d.begin_pos = i(s.BeginRefPos), d.end_pos = i(s.EndRefPos), d.end > d.start && (d.end--, d.end_pos[2]--, d.end_pos[3]--), d.cid = s.BeginRefPos[0], d.ref_content = s.RefContent, d.type = "comment", this.add_mark(d)
                }
            }.bind(this))
        }.bind(this))
    }, p.click = function(t) {
        if (this.mousedown_time) {
            var e = $(t)[0].timeStamp - this.mousedown_time;
            return 300 > e && this.clear_selection(), !1
        }
    }, p.mousedown = function(t) {
        return this.mousedown_time = $(t)[0].timeStamp, this.select_start_x = t.clientX - $(t.currentTarget).offset().left, this.select_start_y = t.clientY - $(t.currentTarget).offset().top, this.is_selection_started = !0, v.trigger("selection-start", {
            id: this.id
        }), !1
    }, p.popupComment = function(t) {
        var e = $("#popup-comment");
        $("p", e).text(t.ref_content), $("#comment-content").val(t.content), this.showPopupAtPoint(e, {
            x: t.x_end,
            y: t.y_end
        }, 15);
        var i = $("#button-finish-comment");
        i.off("click"), i.click(function() {
            t.content = $("#comment-content").val(), this.getNoteManager().uploadNotes({
                add: [t]
            }).done(function() {
                this.draw_marks(), $("#weibo-checkbox")[0].checked && n.post(t.content, t.ref_content)
            }.bind(this)), e.hide()
        }.bind(this));
        var s = $("#button-close-comment");
        s.off("click"), s.click(function() {
            e.hide()
        })
    }, p.setupSelectionMenu = function() {
        var t = $("#button-mark");
        t.off("click"), t.click(function() {
            if (!s.forbidForFree) {
                if (!s.isLogin()) return this.clear_selection(), s.login();
                this.clear_selection(), this.add_mark(this.selectedrange, !0)
            }
        }.bind(this));
        var e = $("#button-comment");
        e.off("click"), e.click(function(t) {
            if (!s.forbidForFree) {
                if (!s.isLogin()) return this.clear_selection(), s.login();
                this.clear_selection();
                var e;
                if (this.selectedrange) e = this.add_mark(this.selectedrange, !0), this.selectedrange = null;
                else {
                    var i = parseInt($(t.target).attr("index"), 10);
                    e = this.marks[i]
                }
                this.popupComment(e)
            }
        }.bind(this));
        var i = $("#button-clear");
        i.off("click"), i.click(function(t) {
            if (!s.isLogin()) return this.clear_selection(), s.login();
            var e = parseInt($(t.target).attr("index"), 10),
                i = this.marks[e];
            this.getNoteManager().uploadNotes({
                "delete": [i]
            }).done(function() {
                this.marks.splice(e, 1), this.draw_marks(), $("#selection-menu").hide()
            }.bind(this))
        }.bind(this));
        var n = $("#button-share");
        n.off("click"), n.click(function(t) {
            var e = escape(window.location.href),
                i = 113 - this.__getBook().typo.title.length,
                s = "";
            if (this.selectedtext && this.selectedtext.length > 0) s = this.selectedtext.join("");
            else {
                var n = parseInt($(t.target).attr("index"), 10),
                    o = this.marks[n];
                s = o.ref_content
            }
            s.length > i && (s = s.substr(0, i - 3) + "...");
            var r = "%23多看笔记%23 《{0}》{1} @多看阅读".format(this.__getBook().typo.title, s),
                a = escape(this.__getBook().detail.book_cover),
                _ = "http://service.weibo.com/share/share.php?url={0}&appkey=3708223667&language=zh_cn&title={1}&source=&sourceUrl=&ralateUid=&message=&uids=&searchPic=true&pic={2}&content=".format(e, r, a);
            window.open(_), this.clear_selection()
        }.bind(this))
    }, p.showPopupAtPoint = function(t, e, i) {
        var s = t.outerWidth(),
            n = t.outerHeight(),
            o = this.selectionlayer.offset();
        i || (i = 0);
        var r = e.x + o.left - s / 2,
            a = e.y + o.top - n - i,
            _ = !1;
        return 0 > a && (a = e.y + o.top + i, a + n > $(window).height() && (a = $(window).height() - n), _ = !0), t.css("position", "absolute").css("left", r).css("top", a), t.show(), _ ? $(".arr", t).attr("class", "arr1") : $(".arr1", t).attr("class", "arr"), _
    }, p.mouseup = function() {
        this.is_selection_started = !1;
        var t = this.selectedlines,
            e = t[t.length - 1];
        if (!e) return !1;
        this.setupSelectionMenu(), $("#button-clear").hide(), $("#button-mark").show();
        var i = $("#selection-menu");
        this.showPopupAtPoint(i, {
            x: e.x_end,
            y: e.y_end
        }, 15);
        var s = this.selectedtext.join("");
        return $("#button-copy").attr("text", s), $("#selection-menu .zclip").remove(), $("#button-copy").zclip({
            path: "/reader/www/viperjs/gallery/zclip/1.1.1/ZeroClipboard.swf",
            copy: function() {
                return $("#button-copy").attr("text")
            },
            afterCopy: function() {
                v.trigger("after-copy")
            }.bind(this)
        }), !1
    }, p.flash_copy_notification = function() {
        var t = $("#copy-notification");
        t.fadeIn(), t.css("left", "50%"), t.css("top", "50%"), t.css("margin-top", -t.height() / 2), t.css("margin-left", -t.width() / 2), setTimeout(function() {
            t.fadeOut(), setTimeout(function() {
                t.hide()
            }, 1e3)
        }, 800)
    }, p.current_chapter_id = function() {
        for (var t = this.page.page_number, e = reader.getBook().typo.chapters, i = "", s = 0; e.length > s; s++) t >= e[s].page_range[0] && (i = e[s].cid);
        return i
    }, p.add_mark = function(t, i) {
        function s(t, i) {
            return t && i ? t.end + 1 < i.start || i.end + 1 < t.start ? null : {
                begin_pos: 0 > e(t.begin_pos, i.begin_pos) ? t.begin_pos : i.begin_pos,
                end_pos: e(t.end_pos, i.end_pos) > 0 ? t.end_pos : i.end_pos,
                start: Math.min(t.start, i.start),
                end: Math.max(t.end, i.end)
            } : null
        }
        for (var n, o = [], r = [], a = [], h = !1, c = "", d = 0; this.marks.length > d; d++) {
            var l = s(t, this.marks[d]);
            l ? (t = l, h = !0, r.push(this.marks[d]), this.marks[d].content && (c += this.marks[d].content)) : h ? (h = !1, t.content = c, t.id = m(), o.push(t), a.push(t), n = t, t = null, o.push(this.marks[d])) : o.push(this.marks[d])
        }
        t && (o.push(t), a.push(t), n = t), $.each(o, function(t, e) {
            if (e.begin_pos || (e.begin_pos = _.clone(this.page.items[e.start].pos)), e.end_pos || (e.end_pos = _.clone(this.page.items[e.end].pos)), e.cid = this.current_chapter_id(), !e.ref_content) {
                for (var i = "", s = e.start; e.end >= s; s++) "word" == this.page.items[s].type && (i += this.page.items[s].char);
                e.ref_content = i
            }
            e.id || (e.id = m()), e.type || (e.type = "comment")
        }.bind(this));
        var u = _.clone(a);
        return $.each(u, function(t, e) {
            e.end_pos[2]++, e.end_pos[3]++
        }), i && this.getNoteManager().uploadNotes({
            add: u,
            "delete": r
        }), this.marks = o, this.draw_marks(), n
    }, p.draw_marks = function() {
        this.marklayer.empty();
        for (var t = this.page.items, e = this.marks, i = function(t) {
            this.setupSelectionMenu();
            var e = parseInt($(t.target).attr("index"), 10),
                i = $("#selection-menu");
            $("#button-mark").hide(), $("#button-clear").show(), $("#button-clear").attr("index", e), $("#button-share").attr("index", e), $("#button-comment").attr("index", e), $("#button-copy").attr("text", this.marks[e].ref_content), this.selectedrange = null;
            var s = this.marks[e];
            return this.showPopupAtPoint(i, {
                x: s.x_end,
                y: s.y_end
            }, 15), !1
        }, s = function(t) {
            var e = parseInt($(t.target).attr("index"), 10),
                i = this.marks[e],
                s = $("#popup-note");
            return $("p", s).text(i.content), this.showPopupAtPoint(s, {
                x: i.x_end + 8,
                y: i.y_end
            }, 15), !1
        }, n = 0; e.length > n; n++) {
            for (var o = e[n], r = [], a = o.start; o.end >= a; a++) {
                var _ = t[a].bound;
                if (_) {
                    var h = r[r.length - 1];
                    h && Math.abs(_.y - h.y_start) < h.y_end - h.y_start ? (h.x_end = Math.max(_.x + _.width, h.x_end), h.y_end = Math.max(_.y + _.height, h.y_end), h.x_start = Math.min(_.x, h.x_start), h.y_start = Math.min(_.y, h.y_start)) : r[r.length] = {
                        x_start: _.x,
                        y_start: _.y,
                        x_end: _.x + _.width,
                        y_end: _.y + _.height
                    }
                }
            }
            for (var c = 0; r.length > c; c++) {
                var d = r[c],
                    u = $("<div class='mark_underline'></div>");
                u.css("position", "absolute").css("cursor", "pointer").css("border-bottom", "2px solid #ff6000").css("left", d.x_start).css("top", d.y_start).css("width", d.x_end - d.x_start).css("z-index", l).css("height", d.y_end - d.y_start), u.attr("index", n), u.click(i.bind(this)), this.marklayer.append(u)
            }
            var f = r[0],
                p = r[r.length - 1];
            if (o.x_start = f.x_start, o.y_start = f.y_start, o.x_end = p.x_end, o.y_end = p.y_end, o.content) {
                var g = $(".icn-note").clone();
                g.css("position", "absolute").css("cursor", "pointer").css("z-index", l).css("left", p.x_end).css("top", p.y_end - 8), g.show(), g.attr("index", n), g.click(s.bind(this)), this.marklayer.append(g)
            }
        }
    }, p.mousemove = function(t) {
        if (this.is_selection_started) {
            var e = t.clientX - $(t.currentTarget).offset().left,
                i = t.clientY - $(t.currentTarget).offset().top;
            this.select_range(this.select_start_x, this.select_start_y, e, i)
        }
    }, p.select_range = function(t, e, i, s) {
        this.clear_selection();
        var n = this.page.items,
            o = [];
        if ($.each(this.galleries, function(t, e) {
            var i = e.cells[e.current_cell];
            o = o.concat(i.items)
        }), n = o.concat(n), e > s + 10 || 10 > Math.abs(e - s) && t > i) {
            var r = t;
            t = i, i = r, r = e, e = s, s = r
        }
        e > s && (s = e);
        var a, _, h, c = [];
        for (a = 0; n.length > a; a++) {
            var d = n[a];
            if ("word" == d.type) {
                var l = d.bound,
                    u = l.x + l.width > t && s > l.y && l.y + l.height > e && i > l.x,
                    f = !u && l.x + l.width > t && l.y < s - l.height && l.y + l.height > e,
                    p = u || f,
                    g = l.y > e + 8 && l.y < s - l.height,
                    m = l.x > t && i > l.x && l.y + l.height > e && s > l.y,
                    v = !m && l.y > e && i > l.x && s > l.y,
                    b = m || v;
                if (p || g || b) {
                    void 0 === _ && (_ = a), h = a;
                    var y = c[c.length - 1];
                    y && Math.abs(l.y - y.y_start) < y.y_end - y.y_start ? (y.x_end = Math.max(l.x + l.width, y.x_end), y.y_end = Math.max(l.y + l.height, y.y_end), y.x_start = Math.min(l.x, y.x_start), y.y_start = Math.min(l.y, y.y_start)) : c[c.length] = {
                        x_start: l.x,
                        y_start: l.y,
                        x_end: l.x + l.width,
                        y_end: l.y + l.height
                    }, this.selectedtext.push(d.char)
                }
            }
        }
        for (a = 0; c.length > a; a++) {
            var w = c[a],
                k = $("<div></div>");
            k.css("position", "absolute").css("background-color", "#cc3300").css("opacity", "0.16").css("width", w.x_end - w.x_start).css("height", w.y_end - w.y_start).css("left", w.x_start).css("top", w.y_start), this.selectionlayer.append(k)
        }
        this.selectedlines = c, this.selectedrange = {
            start: _,
            end: h
        }
    }, p.clear_selection = function() {
        this.selectionlayer.empty(), this.selectedtext = [], this.selectedlines = [], $("#selection-menu").hide(), $("#popup-note").hide(), $(".u-note").hide(), $("#popup-comment").hide()
    }, p.create_layer = function(t) {
        var e = $("<div></div>");
        return e.addClass(t), e.css("width", this.width).css("height", this.height).css("position", "absolute"), $(this.id).append(e), e
    }, p.draw = function() {
        var t = $.Deferred();
        t.done(function() {
            this.flush_textbuffer(this.textbuffer, this.textlayer), delete this.textbuffer, this.textbuffer = []
        }.bind(this)), t.done(this.draw_galleries.bind(this)), t.done(this.loadNotes.bind(this));
        for (var e = this.page.items, i = 0; e.length > i; i++) this.draw_item(e[i]);
        t.resolve()
    }, p.draw_item = function(t) {
        if ("word" == t.type) this.textbuffer.push(t);
        else if ("image" == t.type) this.load_image(t).done(function(e) {
            if (t.interactive) {
                var i = $("<div class='image_outer_border'></div>");
                i.css("top", parseInt(e.css("top"), 10) - 3).css("left", parseInt(e.css("left"), 10) - 3).css("width", t.x1 - t.x0).css("height", t.y1 - t.y0).css("position", "absolute"), e.css("top", 0).css("left", 0).css("width", t.width - 6).css("height", t.height - 6).css("z-index", d);
                var s = $("<div class='image_border'></div>");
                s.css("position", "absolute").css("width", i.width() - 6).css("height", i.height() - 6), s.append(e), i.append(s), this.imagelayer.append(i), e.click(function() {
                    this.load_image(t, t.orig_src, !0).done(function(e) {
                        var i = t.resized_width,
                            s = t.resized_height;
                        e.attr("style", "");
                        var n = t.width / t.tmat.m11,
                            o = t.height / t.tmat.m11;
                        $("img", e).attr("style", "").width(n).height(o);
                        var r = $(".u-showbox"),
                            a = $(".u-showbox .cnt");
                        if (a.css("left", Math.ceil((r.width() - i) / 2)), a.css("top", Math.ceil((r.height() - s) / 2)), a.empty(), a.append(e), t.maintitle) {
                            var _ = $("<div class='txt'></div>");
                            _.text(t.maintitle), e.append(_), _.css("width", t.resized_width - 100)
                        }
                        a.css("position", "absolute"), r.show(), this.trigger("interactive_image_shown", {
                            width: i,
                            height: s
                        })
                    }.bind(this))
                }.bind(this))
            } else this.imagelayer.append(e), "true" == e.attr("is_link") && (e.css("cursor", "pointer"), e.css("z-index", c), e.click(y.bind(this)))
        }.bind(this));
        else if ("bg_image" == t.type) this.load_image(t).done(function(e) {
            var i = $("img", e).attr("src");
            this.bglayer.css("width", t.bound.width).css("height", t.bound.height).css("top", t.bound.y).css("left", t.bound.x).css("background", "url('" + i + "')").css("background-repeat", t.repeat).css("background-size", "contain").css("background-position", "{0}px {1}px".format(t.x - t.bound.x, t.y - t.bound.y)), t.size && this.bglayer.css("background-size", t.size)
        }.bind(this));
        else if ("path" == t.type) this.draw_path(t, this.pathlayer);
        else if ("footnote" == t.type) this.draw_footnote(t, this.imagelayer);
        else if ("gallery" == t.type) {
            t.current_cell = 0;
            var e = this.create_layer("gallery");
            t.layer = e, t.tag = "gallery" + (this.galleries.length + ""), this.galleries.push(t)
        } else "audio" == t.type || "video" == t.type
    }, p.draw_path = function(t, e) {
        if (t.desc && (e || (e = this.pathlayer), e.canvas || (e.canvas = Raphael(e[0], this.width, this.height)), t["fill-color"] || t["stroke-color"])) {
            if (t["fill-color"]) {
                var i = /rgba\(([0-9]+,){3}([0-9]+)\)/,
                    s = t["fill-color"].match(i)[2];
                if (0 === Number(s)) {
                    if (!t["stroke-color"]) return;
                    if (s = t["stroke-color"].match(i)[2], 0 === Number(s)) return
                }
            }
            var n = e.canvas.path(t.desc);
            t["fill-color"] && n.attr("fill", t["fill-color"]), t["stroke-color"] ? n.attr("stroke", t["stroke-color"]) : n.attr("stroke-width", 0)
        }
    }, p.gallery_next = function(t) {
        this.gallery_goto(t, t.current_cell + 1)
    }, p.gallery_prev = function(t) {
        this.gallery_goto(t, t.current_cell - 1)
    }, p.gallery_goto = function(t, e) {
        e >= 0 && t.cells.length > e && (t.current_cell = e, this.draw_gallery(t))
    }, p.draw_gallery = function(t) {
        var e = t.layer;
        e.css("width", "0px"), e.css("height", "0px"), e.html("");
        for (var i = [], s = t.cells[t.current_cell], n = s.items, o = this, r = function(i, s) {
            if (e.append(i), s.is_target) {
                var n = $(".gallery_prev", i);
                0 === n.length && (n = $("<button class='gallery_prev'>Prev</div>"), n.click(function() {
                    this.gallery_prev(t)
                }.bind(o)), i.append(n));
                var r = $(".gallery_next", i);
                0 === r.length && (r = $("<button class='gallery_next'>Next</div>"), r.click(function() {
                    this.gallery_next(t)
                }.bind(o)), i.append(r));
                var a = t.current_cell;
                a > 0 ? n.show() : n.hide(), t.cells.length - 1 > a ? r.show() : r.hide();
                var _ = t.bound;
                if (_) {
                    var h = $(".gallery_dots", i);
                    if (0 === h.length) {
                        h = $("<ul class='gallery_dots'></ul>"), on_dot_click = function() {
                            var e = $(this).attr("to");
                            o.gallery_goto(t, parseInt(e, 10))
                        };
                        for (var c = 0; t.cells.length > c; c++) {
                            var d = $("<li class='gallery_dot'>dot</li>");
                            d.attr("to", c), c == t.current_cell && d.addClass("active"), d.click(on_dot_click), h.append(d)
                        }
                    }
                    h.css("top", _.y + _.height).css("left", _.x).css("width", _.width).css("height", 10), e.append(h)
                }
            }
        }, a = [], _ = 0; n.length > _; _++) {
            var h = n[_];
            "word" == h.type ? i.push(h) : "image" == h.type ? a.push(h) : "path" == h.type ? this.draw_path(h, e) : "footnote" == h.type && this.draw_footnote(h, e)
        }
        if (a) {
            var c = a[0];
            for (_ = 1; a.length > _; _++) {
                var d = a[_].width * a[_].height;
                d > c.width * c.height && (c = a[_])
            }
            c.is_target = !0
        }
        $.each(a, function(t, e) {
            this.load_image(e).done(r)
        }.bind(this));
        var l = $("text", this.textlayer).filter(function() {
            return $(this).attr("tag") === t.tag
        });
        l.remove(), this.flush_textbuffer(i, this.textlayer, t.tag)
    }, p.draw_galleries = function() {
        for (var t = this.galleries, e = 0; t.length > e; e++) this.draw_gallery(t[e])
    }, p.draw_footnote = function(t, e) {
        var i = this;
        e || (e = this.imagelayer), this.load_image(t).done(function(s) {
            e.append(s), s.css("z-index", 100), s.attr("note-data", t.text), "richtext" != t.ftype && s.bind("mouseenter", function() {
                var e = $("#footer-note");
                e.find("p").text($(this).attr("note-data")), i.showPopupAtPoint(e, {
                    x: t.x1 - 5,
                    y: t.y1
                }, 20),
                function(t, e) {
                    var i = t.data("__nicescroll");
                    i && i.remove();
                    var s = {
                        cursorminheight: 10,
                        cursorcolor: "#9f662d",
                        cursorwidth: "5px",
                        cursorborder: "none",
                        cursorborderradius: "5px",
                        autohidemode: !1,
                        bouncescroll: !1,
                        horizrailenabled: !1,
                        smoothscroll: !1
                    };
                    t.niceScroll(e, s)
                }(e.find(".note-wrap"), e.find(".note-wrap p")), e.on("click", function(t) {
                    t.stopPropagation()
                }), $("body").one("click", function() {
                    e.hide()
                })
            })
        })
    };
    var y = function(t) {
        var e = $(t.currentTarget),
            i = e.attr("to_url"),
            s = parseInt(e.attr("to_page"), 10),
            n = parseInt(e.attr("to_chapter"), 10),
            o = {
                url: i,
                page: s,
                chapter: n
            };
        this.trigger("link_clicked", o)
    };
    return p.load_image = function(t, e, i) {
        function s(e, i) {
            var s = $('<div class="image-clip" style="position:absolute; overflow:hidden"></div>');
            (void 0 === t.width || void 0 === t.height) && (t.width = t.x1 - t.x0, t.height = t.y1 - t.y0), void 0 !== t.cx0 ? (s.css("left", Math.round(t.x0)), s.css("top", Math.round(t.y0)), s.css("width", Math.round((t.cx1 - t.cx0) * t.tmat.m11)), s.css("height", Math.round((t.cy1 - t.cy0) * t.tmat.m22))) : (s.css("left", Math.round(t.x0)), s.css("top", Math.round(t.y0)), s.css("width", Math.round(t.width)), s.css("height", Math.round(t.height)));
            var n = $("<img></img>");
            n.attr("src", i);
            var o = 0,
                r = 0;
            if (void 0 !== t.cx0 && t.tmat && (o = -t.cx0 * t.tmat.m11, r = -t.cy0 * t.tmat.m22), n.css("position", "absolute").css("left", Math.round(o)).css("top", Math.round(r)).css("width", Math.round(t.width)).css("height", Math.round(t.height)), s.append(n), void 0 !== t.link_to && e.page.links) {
                var a = e.page.links[t.link_to];
                s.attr("is_link", "true"), "internal" == a.type ? (s.attr("to_page", a.page), s.attr("to_chapter", a.chapter)) : "external" == a.type && (a.url, s.attr("to_url", a.url))
            }
            return s
        }
        var n = $.Deferred();
        e || (e = t.src);
        var o = this.is_url(e);
        if (o || a[e]) {
            var r;
            if (o) {
                r = e;
                for (var _ = t.width, c = 0; h.length > c && _ > h[c]; c++);
                c == h.length && (c = h.length - 1), _ = h[c], i || (r += "?thumb=" + _ + "x" + "&scale=auto")
            } else r = a[e];
            var d = s(this, r);
            setTimeout(function() {
                n.resolve(d, t)
            }, 0)
        } else $.getBSON("/image/" + e, function(i) {
            a[e] = i.url;
            var o = s(this, a[e]);
            n.resolve(o, t)
        }.bind(this));
        return n.promise()
    }, p.is_url = function(t) {
        return 0 === t.indexOf("http://")
    }, p.flush_textbuffer = function(t, e, i) {
        var s, n = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
            a = "http://www.w3.org/2000/svg",
            _ = document.createDocumentFragment();
        n ? (s = $("svg", e), 0 === s.length ? (s = document.createElementNS(a, "svg"), s.setAttribute("xmlns", a), s.setAttribute("version", 1.1), s.setAttribute("width", e.width()), s.setAttribute("height", e.height())) : s = s[0]) : s = document.createElement("div");
        for (var h = 0; t.length > h; h++) {
            var c = t[h],
                d = c.bound;
            if (d || (d = {
                x: c.x,
                y: c.y - c["font-size"],
                width: c["font-size"],
                height: 1.2 * c["font-size"]
            }, c.bound = d), "DK-SERIF" == c["font-family"] && (c["font-family"] = "italic" == c["font-style"] ? "bold" == c["font-weight"] || "bolder" == c["font-weight"] ? "DK-SERIF-BOLD-ITALIC" : "DK-SERIF-ITALIC" : "bold" == c["font-weight"] || "bolder" == c["font-weight"] ? "DK-SERIF-BOLD" : "DK-SERIF", delete c["font-weight"], delete c["font-style"]), o[c["font-family"]] && (c["font-family"] = o[c["font-family"]]), void 0 !== c.link_to && this.page.links) {
                var l = this.page.links[c.link_to],
                    u = $("<div></div>");
                u.css("position", "absolute").css("background-color", "#FFF").css("opacity", "0").css("cursor", "pointer").css("z-index", "100").css("width", d.width).css("height", d.height).css("left", d.x).css("top", d.y), e.append(u), "internal" == l.type ? (u.attr("to_page", l.page), u.attr("to_chapter", l.chapter)) : "external" == l.type && (l.url, u.attr("to_url", l.url)), u.click(y.bind(this))
            }
            if (n) {
                var f = document.createElementNS(a, "text");
                f.appendChild(document.createTextNode(c.char));
                for (var p in c) f.setAttribute(p, c[p]);
                f.removeAttribute("bound"), f.removeAttribute("char"), f.removeAttribute("type"), f.removeAttribute("pos"), i && f.setAttribute("tag", i), _.appendChild(f)
            } else {
                var g = /([0-9]+),([0-9]+),([0-9]+),([0-9]+)/,
                    m = g.exec(c.fill).slice(1),
                    v = "rgb({0}, {1}, {2})".format(m[0], m[1], m[2]),
                    b = document.createElement("span");
                b.style["font-family"] = c["font-family"], b.style["font-size"] = "" + c["font-size"] + "px", b.style.color = v, b.style.left = "" + c.x + "px", b.style.position = "absolute", c["font-style"] && (b.style["font-style"] = c["font-style"]), c["font-weight"] && (b.style["font-weight"] = c["font-weight"]), b.appendChild(document.createTextNode(c.char));
                var w;
                r[c["font-family"]] && r[c["font-family"]][c["font-size"]] ? w = r[c["font-family"]][c["font-size"]] : (e[0].appendChild(b), w = b.offsetHeight, r[c["font-family"]] || (r[c["font-family"]] = {}), " " != c.char && (r[c["font-family"]][c["font-size"]] = w), e[0].removeChild(b)), b.style.top = "" + (c.y - w + .6 * c["font-size"]) + "px", _.appendChild(b)
            }
        }
        s.appendChild(_), e[0].appendChild(s)
    }, f
}), define("app/module/md_end.js", [], function(t) {
    "use strict";
    var e = t("base"),
        i = t("widget/form/form"),
        s = t("request"),
        n = t("widget/placeholder/placeholder"),
        o = t("common"),
        r = t("common/login_frame"),
        a = e.create(),
        h = a.prototype;
    a._$supro, h.events = {
        "click .j-write": "__writeComment"
    }, h.initialize = function(t) {
        this.supInitialize(t), this.__book = t.book, this.__ropt = {
            book_id: this.__book.book_id
        }, this.__registModules()
    }, h.__registModules = function() {
        new n({
            target: this.$(".j-comment-title")
        }), new n({
            target: this.$(".j-comment-content")
        });
        var t = this.__message = {
            "score-1": "不要忘了评分哦",
            "title-1": "请填写标题！",
            "content-5": "评论不少于20字！"
        };
        this.__msg = [], this.__form = new i({
            form: this.$("form"),
            onvalid: function(t) {
                t.stopped = !0
            },
            oninvalid: function(e) {
                this.__msg.push(t[e.target.name + e.code]), e.stopped = !0
            }.bind(this)
        }), this.__bookScore = new c({
            el: this.$(".j-starloading")
        })
    }, h.__writeComment = function(t) {
        if (!o.isLogin()) return (new r).show(), !1;
        var e = ($(t.target), this.__bookScore.getIndex());
        return this.__msg = [], e && this.__form.check() ? (_.extend(this.__ropt, this.__form.data()), this.__ropt.score = this.__bookScore.getIndex(), s.write_comment(this.__ropt, function() {
            this.__showOkMsg(), this.__bookScore.reset(), this.__form.reset(), $(this.__form.get("title")).trigger("input"), $(this.__form.get("content")).trigger("input")
        }.bind(this)), !1) : (e || this.__msg.unshift(this.__message["score-1"]), this.__showErrMsg(this.__msg[0]), !1)
    }, h.__showErrMsg = function(t) {
        this.__form.showMsgError(this.$(".j-comment-title"), t)
    }, h.__showOkMsg = function(t) {
        this.__form.showMsgPass(this.$(".j-comment-title"), t), this.$(".j-msg-ok").fadeOut(3e3)
    };
    var c = e.create(),
        h = c.prototype;
    return h.events = {
        "mouseenter li": "__onMouseEnter",
        "mouseleave li": "__onMouseLeave",
        "click li": "__onClick"
    }, h.initialize = function(t) {
        this.supInitialize(t), this.__list = this.$("li"), this.__msg = ["(浪费时间)", "(不置可否)", "(马马虎虎)", "(值得一看)", "(强烈推荐)"], this.__index = null, this.__list.click(this.__onClick.bind(this)), this.__list.on("mouseenter", this.__onMouseEnter.bind(this)), this.__list.on("mouseleave", this.__onMouseLeave.bind(this))
    }, h.__onMouseEnter = function(t) {
        var e = $(t.target).index(),
            i = this.__list.eq(e);
        i.prevAll().andSelf().addClass("hover"), i.nextAll().removeClass("hover"), this.__showMsg(this.__msg[e])
    }, h.__onMouseLeave = function(t) {
        var e = ($(t.target).index(), this.__index ? this.__msg[this.__index] : "");
        this.__list.removeClass("hover"), this.__showMsg(e)
    }, h.__onClick = function(t) {
        var e = $(t.target).index(),
            i = this.__list.eq(e);
        this.__list.removeClass("hover"), this.__list.removeClass("red"), i.prevAll().andSelf().addClass("red"), i.nextAll().removeClass("red"), this.__index = e, this.trigger("onchange", e)
    }, h.__showMsg = function(t) {
        this.$(".j-msg").html(t || "").show()
    }, h.reset = function() {
        this.__list.removeClass("hover"), this.__list.removeClass("red"), this.__showMsg(), this.__index = null
    }, h.getIndex = function() {
        return null !== this.__index ? this.__index + 1 : 0
    }, a
}), define("app/common/weibo.js", [], function() {
    "use strict";
    var t = 0,
        e = {};
    return e.post = function(e, i) {
        var s = "/dk_id/weibo",
            n = window.reader.getBook(),
            o = n.typo.book_id,
            r = n.typo.title,
            a = {
                user_id: $.cookie("user_id"),
                device_id: $.cookie("device_id"),
                app_id: $.cookie("app_id"),
                token: $.cookie("token"),
                third_party_id: t,
                comment: e,
                ref_content: i,
                book_title: r,
                book_url: "http://www.duokan.com/book/{0}".format(o),
                followup_url: window.location.href
            };
        $.post(s, a, function(t) {
            t = JSON.parse(t);
            var e = t.url;
            e && (window.location.href = e)
        })
    }, e
}), define("viperjs/widget/form/form.js", [], function(t) {
    var e, i = t("event"),
        s = t("widget/placeholder/placeholder"),
        n = t("core"),
        o = t("util"),
        r = n.create();
    return e = r.extend(i), e.init = function(t) {
        this.supInit(t), this.__wopt = {
            tp: {
                nid: "js-nej-tp"
            },
            ok: {
                nid: "js-nej-ok"
            },
            er: {
                nid: "js-nej-er"
            }
        }, this.__event = {
            focus: !t.disableFocus,
            blur: !t.disableBlur
        }, this.__form = $(t.form).get(0), this.__message = t.message || {};
        var e = this.__dataset(this.__form, "focusMode", 1);
        isNaN(e) || (this.__fopt = {
            mode: e,
            clazz: t.focus
        }), this.__holder = t.holder, this.__wopt.tp.clazz = "js-mhd " + (t.tip || "js-tip"), this.__wopt.ok.clazz = "js-mhd " + (t.pass || "js-pass"), this.__wopt.er.clazz = "js-mhd " + (t.error || "js-error"), this.__invalid = t.invalid || "js-invalid", this.__doInitValidRule(t), this._$refresh(), this.__fnode && this.__fnode.focus()
    }, e.__destroy = function() {
        delete this.__message, delete this.__fnode, delete this.__vinfo, delete this.__form, delete this.__treg, delete this.__vfun
    }, e.__dataset = function(t, e, i) {
        var t = _.isString(t) ? "#" + t : t,
            s = $(t).data(e);
        switch (i) {
            case 1:
                return parseInt(s);
            case 2:
                return !!s;
            case 3:
                return this.__doParseDate(s)
        }
        return s
    }, e.__number = function(t, e) {
        return "date" == e ? this.__doParseDate(t) : parseInt(t)
    }, e.__isValidElement = function() {
        var t = /^button|submit|reset|image$/i;
        return function(e) {
            return e = this._$get(e) || e, !!e.name && !t.test(e.type || "")
        }
    }(), e.__doParseDate = function() {
        var t = /[-\/]/,
            e = function(e) {
                return e ? (e = e.split(t), e.push(e.shift()), e.join("/")) : ""
            };
        return function(t) {
            return "now" == (t || "").toLowerCase() ? +new Date : Date.parse(e(t))
        }
    }(), e.__doCheckString = function(t, e) {
        var i = this.__vfun[e],
            s = this.__dataset(t, e);
        s && i && (this.__doPushValidRule(t, i), this.__doSaveValidInfo(t, e, s))
    }, e.__doCheckPattern = function(t, e) {
        try {
            var i = this.__dataset(t, e);
            if (!i) return;
            var s = RegExp(i);
            this.__doSaveValidInfo(t, e, s), this.__doPushValidRule(t, this.__vfun[e])
        } catch (n) {}
    }, e.__doCheckBoolean = function(t, e) {
        var i = this.__vfun[e];
        i && this.__dataset(t, e, 2) && this.__doPushValidRule(t, i)
    }, e.__doCheckNumber = function(t, e, i) {
        i = parseInt(i), isNaN(i) || (this.__doSaveValidInfo(t, e, i), this.__doPushValidRule(t, this.__vfun[e]))
    }, e.__doCheckDSNumber = function(t, e) {
        this.__doCheckNumber(t, e, this.__dataset(t, e))
    }, e.__doCheckATNumber = function(t, e) {
        this.__doCheckNumber(t, e, $("#" + t).attr(e))
    }, e.__doCheckTPNumber = function(t, e) {
        var i = this.__number(this.__dataset(t, e), this.__dataset(t, "type"));
        this.__doCheckNumber(t, e, i)
    }, e.__doPrepareElement = function() {
        var t = /^input|textarea$/i,
            e = function(t) {
                this._$showTip(t.currentTarget)
            },
            i = function(t) {
                this.__doCheckValidity(t.currentTarget)
            };
        return function(n) {
            this.__dataset(n, "autoFocus", 2) && (this.__fnode = n), $(n).data("placeholder") && s.set(n), this.__fopt && t.test(n.tagName) && o.focus(n, this.__fopt);
            var r = o.id(n);
            this.__doCheckBoolean(r, "required"), this.__doCheckString(r, "type"), this.__doCheckPattern(r, "pattern"), this.__doCheckATNumber(r, "maxlength"), this.__doCheckATNumber(r, "minlength"), this.__doCheckDSNumber(r, "maxLength"), this.__doCheckDSNumber(r, "minLength"), this.__doCheckTPNumber(r, "min"), this.__doCheckTPNumber(r, "max");
            var a = n.name;
            this.__message[a + "-tip"] = this.__dataset(n, "tip"), this.__message[a + "-error"] = this.__dataset(n, "message"), this._$showTip(n), this.__vinfo[r] && t.test(n.tagName) && (this.__event.focus && $(n).focus(e.bind(this)), this.__event.blur && $(n).blur(i.bind(this)))
        }
    }(), e.__doInitValidRule = function() {
        var t = {
                number: /^[\d]+$/i,
                number2: function(t) {
                    return !t || !isNaN(Number(t))
                },
                url: /^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i,
                email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
                date: function(t) {
                    return !t || !isNaN(this.__doParseDate(t))
                }
            },
            e = {
                required: function(t) {
                    var e = t.type,
                        i = !t.value,
                        s = ("checkbox" == e || "radio" == e) && !t.checked;
                    return s || i ? -1 : void 0
                },
                type: function(t, e) {
                    var i = this.__treg[e.type],
                        s = t.value.trim(),
                        n = !!i.test && !i.test(s),
                        o = _.isFunction(i) && !i.call(this, s);
                    return n || o ? -2 : void 0
                },
                pattern: function(t, e) {
                    return e.pattern.test(t.value) ? void 0 : -3
                },
                maxlength: function(t, e) {
                    return t.value.length > e.maxlength ? -4 : void 0
                },
                minlength: function(t, e) {
                    return t.value.length < e.minlength ? -5 : void 0
                },
                maxLength: function(t, e) {
                    return o.length(t.value) > e.maxLength ? -4 : void 0
                },
                minLength: function(t, e) {
                    return o.length(t.value) < e.minLength ? -5 : void 0
                },
                min: function(t, e) {
                    var i = this.__number(t.value, e.type);
                    return isNaN(i) || e.min > i ? -6 : void 0
                },
                max: function(t, e) {
                    var i = this.__number(t.value, e.type);
                    return isNaN(i) || i > e.max ? -7 : void 0
                }
            };
        return function(i) {
            this.__treg = _.extend({}, t, i.type), this.__vfun = _.extend({}, e, i.attr)
        }
    }(), e.__doPushValidRule = function(t, e) {
        if (_.isFunction(e)) {
            var i = this.__vinfo[t];
            i && i.func || (i = i || {}, i.func = [], this.__vinfo[t] = i), i.func.push(e)
        }
    }, e.__doSaveValidInfo = function(t, e, i) {
        if (e) {
            var s = this.__vinfo[t];
            s && s.data || (s = s || {}, s.data = {}, this.__vinfo[t] = s), s.data[e] = i
        }
    }, e.__doCheckValidity = function(t) {
        t = this._$get(t) || t;
        var e = this.__vinfo[o.id(t)];
        if (!t || !e || !this.__isValidElement(t)) return !0;
        var i;
        if (_.some(e.func, function(s) {
            return i = s.call(this, t, e.data), null != i
        }, this), null == i) {
            var s = {
                target: t
            };
            this.trigger("oncheck", s), i = s.value
        }
        var s = {
            target: t
        };
        return null != i ? (s.code = i, this.trigger("oninvalid", s), s.stopped || this._$showMsgError(t, s.value || this.__message[t.name + i])) : (this.trigger("onvalid", s), s.stopped || this._$showMsgPass(t, s.value)), null == i
    }, e.__doShowMessage = function() {
        var t = function(t, e) {
                return t == e ? "" : "none"
            },
            e = function(t, e) {
                var i = $(t).parent().find('[class*="-' + e + '"]');
                return i[0] || (i = $(t).closest("form").find('[class*="-' + e + '"]')), i[0]
            };
        return function(i, s, n) {
            i = this._$get(i) || i, i && ("er" == n ? $(i).addClass(this.__invalid) : $(i).removeClass(this.__invalid), s && (e.call(this, i, n).innerHTML = s), _.each(this.__wopt, function(s, o) {
                $(e.call(this, i, o)).css("display", t(n, o))
            }, this))
        }
    }(), e._$showTip = function(t, e) {
        return this.__doShowMessage(t, e || this.__message[t.name + "-tip"], "tp"), this
    }, e._$showMsgPass = function(t, e) {
        return this.__doShowMessage(t, e || this.__message[t.name + "-pass"] || this.__message.pass, "ok"), this
    }, e._$showMsgError = function(t, e) {
        return this.__doShowMessage(t, e || this.__message[t.name + "-error"], "er"), this
    }, e._$get = function(t) {
        return this.__form.elements[t]
    }, e._$form = function() {
        return this.__form
    }, e._$data = function() {
        var t = /^radio|checkbox$/i,
            e = /^number|date$/,
            i = function(i, s) {
                var n = s.name,
                    o = s.value,
                    r = i[n],
                    a = this.__dataset(s, "type");
                e.test(a) && (o = this.__number(o, a)), (!t.test(s.type) || s.checked || (o = this.__dataset(s, "value"))) && (r && (_.isArray(r) || (r = [r], i[n] = r), r.push(o)), i[n] = o)
            };
        return function() {
            var t = {};
            return _.each(this.__form.elements, function(e) {
                this.__isValidElement(e) && i.call(this, t, e)
            }, this), t
        }
    }(), e._$reset = function() {
        return this.__form.reset(), this
    }, e._$submit = function() {
        return this.__form.submit(), this
    }, e._$refresh = function() {
        var t = function(t) {
            this.__isValidElement(t) && this.__doPrepareElement(t)
        };
        return function() {
            return this.__vinfo = {}, _.each(this.__form.elements, t, this), this
        }
    }(), e._$checkValidity = function(t) {
        if (t = this._$get(t) || t) return this.__doCheckValidity(t);
        var e = !0;
        return _.each(this.__form.elements, function(t) {
            var i = this._$checkValidity(t);
            e = e && i
        }, this), e
    }, e.check = e._$checkValidity, e.data = e._$data, e.get = e._$get, e.reset = e._$reset, e.showMsgError = function(t, e) {
        t instanceof $ && (t = t.attr("name")), t = this._$get(t);
        var i = this.__message[t.name + e] || e;
        this._$showMsgError(t, i)
    }, e.showMsgPass = function(t, e) {
        t instanceof $ && (t = t.attr("name")), t = this._$get(t);
        var i = this.__message[t.name + e] || e;
        this._$showMsgPass(t, i)
    }, r
}), define("app/common/request.js", [], function(t, e) {
    "use strict";
    var i = e,
        s = t("common");
    i.util = {};
    var n = i.util;
    n.formatBook = function(t) {
        var e = t.score + 0;
        return t.url = "/book/" + t.sid, t.last_url = t.url, t.pay_url = "/pay/" + t.sid, t.avail_price = void 0 !== t.new_price ? t.new_price : t.price, t.book_cover = t.cover.replace("!.$", "!e"), t.author_name = (t.authors || t.editors || t.translators || "佚名").split("\n"), t.star_level = e >= 2 ? Math.floor(e + .5) : 0, t.score = +e.toFixed(1), t
    }, i.write_comment = function(t, e) {
        var i = {
            type: "POST",
            dataType: "json"
        };
        return i.data = t, _.extend(i.data, s.getInfo()), i.success = e, $.ajax("/comment/v0/add_book_comment", i)
    }, i.get_book = function(t) {
        var e = $.Deferred();
        return $.ajax("/store/v0/web/book/" + t).done(function(t) {
            0 === t.result && t.book ? e.resolve(n.formatBook(t.book)) : (seajs.log("get book info faild"), e.resolve({}))
        }).fail(function() {
            e.resolve({})
        }), e.promise()
    }, i.get_comments = function(t, e) {
        var i = {
            type: "POST",
            dataType: "json"
        };
        return i.data = t, _.extend(i.data, s.getInfo(!0)), i.success = e, $.ajax("/comment/v0/get_book_comments", i)
    }, i.get_xiaomi_info = t("./nick/nick_request"), i.get_comment_reply = function(t, e) {
        var i = {
            type: "POST",
            dataType: "json"
        };
        return i.data = {
            start_index: 1,
            count: 10
        }, _.extend(i.data, s.getInfo(), t), i.success = e, $.ajax("/comment/v0/get_reply", i)
    }, i.vote_comment = function(t, e, i) {
        var n = {
            type: "POST",
            dataType: "json"
        };
        return n.data = {
            book_id: t,
            comment_id: e,
            useful: i
        }, _.extend(n.data, s.getInfo()), $.ajax("/comment/v0/vote_comment", n)
    }, i.reply_comment = function(t, e) {
        var i = {
            type: "POST",
            dataType: "json"
        };
        return i.data = t, _.extend(i.data, s.getInfo()), i.success = e, $.ajax("/comment/v0/add_comment_reply", i)
    }
}), define("viperjs/widget/placeholder/placeholder.js", [], function(t) {
    var e = t("event"),
        i = t("config"),
        s = e.create({
            init: function(t) {
                this.supInit(t), $(t.target).placeHolder(t)
            }
        });
    return $.fn.placeHolder = function(t) {
        var e = {
            focus: "#ccc",
            focusOut: "#aaa",
            tip: ""
        };
        return $.extend(e, t), this.each(function() {
            var t = $(this),
                s = e.tip ? $(e.tip) : t.prev();
            if ("5.0" == i.kernel) {
                var n = "";
                t.on("keydown keyup", function(e) {
                    "keydown" == e.type ? n = t.val() : (n != t.val() || "" == t.val()) && ("" == t.val() ? s.show() : s.hide())
                })
            }
            t.val("").bind("input propertychange", function() {
                "" == $(this).val() ? s.show() : s.hide()
            }).focus(function() {
                s.css("color", e.focus)
            }).focusout(function() {
                s.css("color", e.focusOut)
            }), s.click(function() {
                t.focus()
            })
        })
    }, s.set = function(t, e) {
        var i = {
            target: $(t)
        };
        return _.extend(t, e), new s(i)
    }, s
}), define("app/common/nick/nick_request.js", [], function(t) {
    "use strict";

    function e(t) {
        if (t.length > 20) throw "ids of nick can't more than 20!!!";
        var e = $.Deferred(),
            o = s + t.join(",");
        return i.request(o, {
            iframe: n,
            mode: 2,
            timeout: 1e3,
            onload: function(t) {
                try {
                    var t = JSON.parse(t);
                    e.resolve(t.data.list)
                } catch (i) {
                    console.error("request nick error!!!\n", "response data:", t)
                }
            },
            onerror: function() {
                e.reject({})
            }
        }), e.promise()
    }
    var i = t("widget/ajax/xdr"),
        s = "http://api.account.xiaomi.com/pass/usersCard?ids=",
        n = "http://api.account.xiaomi.com/pass/static/viper_proxy_frame.html?1",
        o = {},
        r = function(t) {
            var i = $.Deferred();
            if (_.isArray(t) || (t = [t]), t = _.uniq(t), window.closeNick) {
                var s = _.map(t, function(t) {
                    return {
                        userId: t,
                        miliaoNick: t
                    }
                }.bind(this));
                return i.resolve(s), i.promise()
            }
            var n = [],
                r = [];
            if (_.each(t, function(t) {
                o[t] ? n.push(o[t]) : r.push(t)
            }, this), t = r, !t.length) return i.resolve(n), i.promise();
            var a = _.groupBy(t, function(t, e) {
                    return Math.floor((e + 1) / 20)
                }),
                h = _.map(a, function(t) {
                    return e(t)
                });
            return $.when.apply(this, h).done(function() {
                var t = _.toArray(arguments);
                t = _.flatten(t), _.each(t, function(t) {
                    o[t.userId] = t
                }), t = _.union(t, n), i.resolve(t)
            }), i.promise()
        };
    return r
}), define("viperjs/widget/ajax/xdr.js", [], function(t, e) {
    "use strict";
    t("patched/ajax");
    var i = t("util"),
        s = t("widget/ajax/proxy/flash"),
        n = t("widget/ajax/proxy/frame"),
        o = t("base/constant"),
        r = e,
        a = t("patched/ajax"),
        h = {},
        c = _f;
    r.abort = function(t) {
        var e = h[t];
        return e ? (e.req.abort(), this) : this
    }, r.filter = function(t) {
        return c = t || _f, this
    }, r.request = function() {
        (location.protocol + "//" + location.host).toLowerCase();
        var t = function(t) {
                return (t || _o)[o.HEAD_CT] == o.HEAD_CT_FILE
            },
            e = function(e) {
                var i = t(e.headers);
                return a.__getProxyByMode(e.mode, i, e)
            },
            s = function(t) {
                var e = h[t];
                e && (e.req && e.req.recycle(), delete h[t])
            },
            n = function(t, e) {
                var i = h[t];
                if (i) {
                    s(t);
                    try {
                        var n = {
                            type: e,
                            result: arguments[2]
                        };
                        c(n), n.stopped || (i[e] || _f)(n.result)
                    } catch (o) {
                        console.error(o.message), console.error(o)
                    }
                }
            },
            r = function(t, e) {
                n(t, "onload", e)
            },
            d = function(t, e) {
                n(t, "onerror", e)
            };
        return function(t, s) {
            s = s || {};
            var n = _.uniqueId(),
                o = {
                    onload: s.onload || _f,
                    onerror: s.onerror || _f
                };
            if (h[n] = o, s.onload = r.bind(null, n), s.onerror = d.bind(null, n), s.query) {
                var a = 0 > t.indexOf("?") ? "?" : "&",
                    c = s.query;
                _.isObject(c) && (c = i.object2query(c)), c && (t += a + c)
            }
            return s.url = t, o.req = e(s), o.req.send(s.data), n
        }
    }(), r.setFlash = s.setFlash, r.setFrame = n.setFrame
}), define("viperjs/patched/ajax.js", [], function(t, e) {
    "use strict";
    var i = e;
    t("base/constant");
    var s = t("widget/ajax/proxy/flash"),
        n = t("widget/ajax/proxy/frame");
    return i.__getProxyByMode = function(t, e, i) {
        var o = e ? {
            2: $$UploadProxy
        } : {
            2: n,
            3: s
        };
        return new(o[t] || $$XHRProxy)(i)
    }, i
}), define("viperjs/widget/ajax/proxy/flash.js", [], function(t, e) {
    "use strict";
    var i, s = t("widget/flash/flash"),
        n = t("widget/ajax/proxy/proxy"),
        o = e,
        r = vp.p("vp.ut.j.cb"),
        a = {},
        h = +new Date,
        c = "",
        d = "";
    return r["ld" + h] = function(t, e) {
        var i = a[t];
        i && (delete a[t], i.__onLoadRequest({
            status: 200,
            result: e
        }))
    }, r["er" + h] = function(t, e) {
        var i = a[t];
        i && (delete a[t], i.__onLoadRequest({
            status: e || 0
        }))
    }, o.$$FlashProxy = n.create(), i = o.$$FlashProxy.prototype, i.__doSendRequest = function(t) {
        var e = a.flash;
        if (_.isArray(e)) return e.push(this.__doSendRequest.bind(this, t)), void 0;
        if (!e) return a.flash = [this.__doSendRequest.bind(this, t)], s({
            hidden: !0,
            src: c,
            onready: function(t) {
                if (t) {
                    var e = a.flash;
                    a.flash = t, _.each(e, function(t) {
                        try {
                            t()
                        } catch (e) {}
                    })
                }
            }
        }), void 0;
        this.__rkey = "swf-" + _.uniqueId(), a[this.__rkey] = this;
        var i = _.ex({
            url: "",
            data: null,
            method: "GET"
        }, t.request);
        i.key = this.__rkey, i.onerror = "vp.ut.j.cb.er" + h, i.onloaded = "vp.ut.j.cb.ld" + h, d && (i.policyURL = d), e.request(i)
    }, i.abort = function() {
        return delete a[this.__rkey], this.__onLoadRequest({
            status: 0
        }), this
    }, o.$$FlashProxy.setFlash = function(t) {
        c = t
    }, o.$$FlashProxy.setFlashProxy = function(t) {
        d = t
    }, o.$$FlashProxy
}), define("viperjs/widget/ajax/proxy/frame.js", [], function(t, e) {
    "use strict";
    var i, s = t("widget/ajax/proxy/proxy"),
        n = t("widget/ajax/message"),
        o = t("el"),
        r = e,
        a = "",
        h = {};
    return r.$$FrameProxy = s.create(), i = r.$$FrameProxy.prototype, i.init = function() {
        var t = "VIPER-AJAX-DATA:",
            e = !1,
            i = function(e) {
                var i = e.originalEvent.data;
                if (0 == i.indexOf(t)) {
                    i = JSON.parse(i.replace(t, ""));
                    var s = h[i.key];
                    s && (delete h[i.key], i.result = decodeURIComponent(i.result || ""), s.__onLoadRequest(i))
                }
            },
            s = function() {
                e || (e = !0, $(window).on("message", i))
            };
        return function(t) {
            this.__frameAddress = t.iframe, this.supInit(t), s()
        }
    }(), i.__doSendRequest = function(t) {
        var e = t.request,
            i = this.__frameAddress || a,
            s = h[i];
        if (_.isArray(s)) return s.push(this.__doSendRequest.bind(this, t)), void 0;
        if (!s) return h[i] = [this.__doSendRequest.bind(this, t)], o.createXFrame({
            src: i,
            visible: !1,
            onload: function(t) {
                var e = h[i];
                h[i] = t.target.contentWindow, _.each(e, function(t) {
                    try {
                        t()
                    } catch (e) {}
                })
            }
        }), void 0;
        this.__rkey = "frm-" + _.uniqueId(), h[this.__rkey] = this;
        var r = _.ex({
            url: "",
            data: null,
            timeout: 0,
            method: "GET"
        }, e);
        r.key = this.__rkey, r.headers = t.headers, n(h[i], {
            data: r
        })
    }, i.abort = function() {
        return delete h[this.__rkey], this.__onLoadRequest({
            status: 0
        }), this
    }, r.$$FrameProxy.setFrame = function(t) {
        a = t
    }, r.$$FrameProxy
}), define("viperjs/base/constant.js", [], function(t, e) {
    "use strict";
    var i = e,
        s = +new Date;
    i.CODE_NOTFUND = 1e4 - s, i.CODE_NOTASGN = 10001 - s, i.CODE_NOTSPOT = 10002 - s, i.CODE_TIMEOUT = 10003 - s, i.CODE_ERREVAL = 10004 - s, i.CODE_ERRCABK = 10005 - s, i.CODE_ERRSERV = 10006 - s, i.CODE_ERRABRT = 10007 - s, i.HEAD_CT = "Content-Type", i.HEAD_CT_PLAN = "text/plain", i.HEAD_CT_FILE = "multipart/form-data", i.HEAD_CT_FORM = "application/x-www-form-urlencoded"
}), define("viperjs/widget/flash/flash.js", [], function(t) {
    "use strict";
    t("widget/timer/animation.js");
    var e = t("tpl"),
        i = t("el"),
        s = vp.p("vp.ut.j.cb"),
        n = e.addJst('        <% var hide  = !!obj.hidden %>        <% var param = obj.params||{} %>        <% var width = !hide?width:"1px",height = !hide?height:"1px" %>        <% if(hide){ %><div style="position:absolute;top:0;left:0;width:1px;height:1px;z-index:10000;overflow:hidden;"><% } %>        <object classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"                codebase = "http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"                width = "<%= width || "100px" %>"                height = "<%= height || "100px" %>" id="<%= id %>">            <param value="<%= src %>" name="movie">            <% _.each(param, function(x){ %>            <param value="<%= x %>" name="<%= x_key %>"/>            <% }); %>            <embed src="<%= src %>" name="<%= id %>"                   width="<%= width|| "100px" %>"                   height="<%= height|| "100px" %>"                   pluginspage="http://www.adobe.com/go/getflashplayer"                   type="application/x-shockwave-flash"                   <% _.each(param, function(x){ %><%= x_key %>="<%= x %>" <% }); %>></embed>        </object>        <% if(hide){ %></div><% } %>');
    return i.flash = function() {
        var t = {},
            o = +new Date,
            r = function(t) {
                var s = i.get(t.parent) || document.body,
                    o = e.getJst(n, t);
                s.insertAdjacentHTML(t.hidden ? "afterBegin" : "beforeEnd", o)
            },
            a = function(t, e) {
                var i = t.params;
                i || (i = {}, t.params = i);
                var s = i.flashvars || "";
                t.target && (s += (s ? "&" : "") + ("onevent=vp.ut.j.cb." + e)), i.flashvars = s
            },
            h = function(t) {
                return !!t && !!t.inited && !!t.inited()
            },
            c = function(t, e) {
                var i = e.type.toLowerCase();
                requestAnimationFrame(function() {
                    $("#" + t).trigger(i)
                })
            },
            d = function(e) {
                var s = [document.embeds[e], i.get(e), document[e], window[e]],
                    n = _.find(s, h),
                    o = e + "-count";
                return t[o]++, n || t[o] > 100 ? (t[e](n), delete t[e], delete t[o], void 0) : (window.setTimeout(d.bind(null, e), 300), void 0)
            };
        return function(e) {
            if (e = e || {}, e.src) {
                var n = e.id || "flash-" + o++;
                if (e.id = n, !e.hidden) {
                    var _ = i.id(e.target) || i.id(e.parent);
                    s["cb" + o] = c.bind(null, _), a(e, "cb" + o)
                }
                r(e), e.onready && (t[n] = e.onready, t[n + "-count"] = 0, d(n))
            }
        }
    }(), i.flash
}), define("viperjs/widget/ajax/proxy/proxy.js", [], function(t) {
    "use strict";
    t("widget/cookie/cookie");
    var e, i = t("event"),
        s = t("base/constant"),
        n = t("el"),
        o = i.create();
    return e = o.prototype, e.init = function(t) {
        this.supInit(t), this.__request = {
            url: "",
            sync: !1,
            cookie: !1,
            type: "text",
            method: "GET",
            timeout: 6e4
        }, _.ex(this.__request, t);
        var e = {
            cookie: "",
            param: ""
        };
        if (e.cookie && e.param) {
            var i = encodeURIComponent(e.param) + "=" + encodeURIComponent($.cookie(e.cookie) || ""),
                n = 0 > this.__request.url.indexOf("?") ? "?" : "&";
            this.__request.url += n + i
        }
        this.__headers = t.headers || {};
        var o = this.__headers[s.HEAD_CT];
        null == o && (this.__headers[s.HEAD_CT] = s.HEAD_CT_FORM)
    }, e.__destroy = function() {
        this.__supDestroy(), delete this.__rkey, delete this.__request, delete this.__headers
    }, e.__onLoadRequest = function(t) {
        var e = t.status;
        return -1 == e ? (this.trigger("onerror", {
            code: s.CODE_TIMEOUT,
            message: "请求[" + this.__request.url + "]超时！"
        }), void 0) : 0 != ("" + e).indexOf("2") ? (this.trigger("onerror", {
            data: e,
            code: s.CODE_ERRSERV,
            message: "服务器返回异常状态[" + e + "]!"
        }), void 0) : (this.trigger("onload", n.text2type(t.result, this.__request.type)), void 0)
    }, e.__doSendRequest = _f, e.send = function(t) {
        var e = this.__request.url;
        if (!e) return this.trigger("onerror", {
            code: s.CODE_NOTASGN,
            message: "没有输入请求地址！"
        }), this;
        try {
            this.__request.data = null == t ? null : t;
            var i = {
                request: this.__request,
                headers: this.__headers
            };
            try {
                this.trigger("onbeforerequest", i)
            } catch (n) {
                console.error(n.message), console.error(n.stack)
            }
            this.__doSendRequest(i)
        } catch (o) {
            this.trigger("onerror", {
                code: s.CODE_ERRSERV,
                message: "请求[" + e + "]失败:" + o.message + "！"
            })
        }
        return this
    }, e.abort = _f, o
}), define("viperjs/widget/timer/animation.js", [], function(t) {
    "use strict";
    var e = t("platform"),
        i = e.platform,
        s = e.kernel,
        n = i.ipad || i.iphone,
        o = window;
    if (n || !o.requestAnimationFrame || !o.cancelRequestAnimationFrame) {
        var r = s.prefix.pro;
        if (!n && o[r + "RequestAnimationFrame"] && o[r + "CancelRequestAnimationFrame"]) return o.requestAnimationFrame = o[r + "RequestAnimationFrame"], o.cancelRequestAnimationFrame = o[r + "CancelRequestAnimationFrame"], void 0;
        var a = i.desktop ? 80 : i.ios ? 50 : 30;
        o.requestAnimationFrame = function(t) {
            return window.setTimeout(function() {
                try {
                    t(+new Date)
                } catch (e) {}
            }, 1e3 / a)
        }, o.cancelRequestAnimationFrame = function(t) {
            return window.clearTimeout(t), this
        }
    }
}), define("viperjs/widget/ajax/message.js", [], function(t, e) {
    "use strict";
    var i = t("patched/message"),
        s = (t("el"), e);
    return s.postMessage = function() {
        var t = window.name || "_parent",
            e = {
                _top: window.top,
                _self: window,
                _parent: window.parent
            };
        return function(s, n) {
            if ("string" == typeof s && (s = e[s] || window.frames[s], !s)) return this;
            var o = _.extend({
                origin: "*",
                source: t
            }, n);
            return i.__postMessage(s, o), this
        }
    }(), s.postMessage
}), define("viperjs/patched/message.js", [], function(t, e) {
    "use strict";
    var i = e;
    i.__formatOrigin = function() {
        var t = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(e) {
            return e = e || "", t.test(e) ? RegExp.$1 : "*"
        }
    }(), i.__formatPassData = function(t) {
        return t
    }, i.__postMessage = function(t, e) {
        t.postMessage && (e = e || _o, t.postMessage(i.__formatPassData(e.data), i.__formatOrigin(e.origin)))
    }
}), define("app/common/scroll2.js", [], function(t) {
    "use strict";
    var e = t("base"),
        i = t("tpl"),
        s = t("el"),
        n = t("widget/slider/slider_y"),
        o = i.addJst('<div><div class="<%= obj.slide||"slide" %>"></div></div>'),
        r = s.pushCSS("        .#<uispace>{position:absolute;top:0;right:0;width:20px;bottom:10px;z-index: 10; background: #fbfaf8;}        .#<uispace> .slide{position:absolute;top:0px;width:5px;height:48px;background:#e4ded4;border-radius:5px;right: 3px;}"),
        a = e.create(),
        h = a.prototype;
    return h.__initXGui = function() {
        this.className = this.options.className || r, this.__tpl = i.getJst(o, {
            slide: this.options.slideName
        })
    }, h.initialize = function(t) {
        this.supInitialize.apply(this, arguments), this.__pos = {
            top: 0,
            rate: 0,
            viewHeight: 0,
            scrollHeight: 0
        }, this.__ref = {
            body: t.body ? $(t.body) : $(document.body),
            track: this.$el,
            slide: this.$el.children()
        }, this.__sopt = _.pick(this.__ref, "track", "slide"), this.__sopt.onchange = this.__scrollBody.bind(this), this.__ref.body.after(this.$el), this.__scrollFunc = this.__onScroll.bind(this), this.__ref.body.scroll(this.__scrollFunc), this.__resizeFunc = this.resize.bind(this), $(window).resize(this.__resizeFunc), this.resize(), t.enable && this.enable()
    }, h.__destroy = function() {
        this.__supDestroy.apply(this, arguments), $(window).unbind("resize", this.__resizeFunc), this.__ref.body.unbind("scroll", this.__scrollFunc)
    }, h.resize = function() {
        var t = this.__pos,
            e = this.__ref;
        t.viewHeight = e.body.height(), t.scrollHeight = e.body.get(0).scrollHeight, this.__getPos(), this.__setSlideHeight(), this.__slide && this.__slide.recycle(), this.__slide = new n(this.__sopt), this.__slide.setPosition({
            y: t.rate
        }), this.__block = !1
    }, h.__getPos = function() {
        var t = this.__pos,
            e = this.__ref;
        t.top = e.body.scrollTop(), t.rate = t.top / (t.scrollHeight - t.viewHeight)
    }, h.__setSlideHeight = function() {
        var t = this.__ref.track.height(),
            e = this.__ref.slide,
            i = Math.floor(this.__pos.viewHeight / this.__pos.scrollHeight * t);
        i = Math.max(20, i), 1 >= Math.abs(t - i) ? e.hide() : (e.show(), e.height(i))
    }, h.__onScroll = function(t) {
        this.__getPos(), this.__block || (this.__scrolling = !0, this.__slide.setPosition({
            y: this.__pos.rate
        }), this.__scrolling = !1, t.stopPropagation(), t.preventDefault())
    }, h.__scrollBody = function(t) {
        if (!this.__scrolling) {
            this.__block = !t.stopped;
            var e = t.y.rate * (this.__pos.scrollHeight - this.__pos.viewHeight);
            1 >= Math.abs(e - this.__ref.body.scrollTop()) || (this.__pos.rate = t.y.rate, this.__pos.top = e, this.__ref.body.scrollTop(e))
        }
    }, h.__check = function() {
        var t = this.__pos,
            e = this.__ref,
            i = e.body.height(),
            s = e.body.get(0).scrollHeight;
        return i != t.viewHeight || s != t.scrollHeight
    }, h.isEnable = function() {
        return !!this.__seed
    }, h.enable = function() {
        this.__seed = window.setInterval(function() {
            this.__check() && this.resize()
        }.bind(this), 200)
    }, h.disable = function() {
        this.isEnable() && window.clearInterval(this.__seed)
    }, a
}), define("viperjs/widget/tab/tab.js", [], function(t) {
    var e = t("core"),
        i = t("event"),
        s = e.create(),
        n = s.extend(i);
    return n.init = function(t) {
        this.supInit(t), this.__name = t.event || "click", this.__selected = t.selected || "js-selected", this.__disabled = t.disabled || "js-disabled", this.__inversed = !!t.inverse, this.__doTabListCheck($(t.list).toArray()), this.go(t.index || 0)
    }, n.__doTabListCheck = function() {
        var t = function(t) {
            if (t) {
                this.__list.push(t);
                var e = this.__list.length - 1,
                    i = this.__cblist[e];
                i || (i = this.go.bind(this, e), this.__cblist[e] = i), $(t).on(this.__name, i)
            }
        };
        return function(e) {
            this.__list = [], this.__cblist || (this.__cblist = []), _.each(e, t, this)
        }
    }(), n.__doTabItemSelect = function(t, e) {
        e && !this.__inversed ? $(t).addClass(this.__selected) : $(t).removeClass(this.__selected)
    }, n.go = function(t, e) {
        var i = this.__list[t];
        if (t == this.__index || !i || $(i).hasClass(this.__disabled)) return !!e && e.preventDefault(), this;
        var s = {
            index: t,
            last: this.__index
        };
        return this.__index = t, this.__doTabItemSelect(i, !0), i = this.__list[s.last], i && this.__doTabItemSelect(i, !1), this.trigger("onchange", s), s.nostop || !!e && e.preventDefault(), this
    }, n.getIndex = function() {
        return this.__index
    }, s
}), define("app/platform-web/view/toc/toc.js", [], function(t, e) {
    "use strict";
    var i = e;
    i.setup = function() {
        console.log("toc toc setup"), this.__drawToc(), this.__highlight(), console.log("toc toc setup end")
    }, i.show = function() {
        this.$el.show(), this.__highlight(), console.log("toc show & highlight_toc")
    }, i.__destroy = function() {
        console.log("toc __destroy"), this.$el.html("")
    }, i.__drawToc = function() {
        var t = function(e, i, s, n) {
            var o;
            if (e.name) {
                var r = $("<a></a>").attr("href", "javascript:void(0)").text(e.name).addClass("j-itm");
                r.attr("page_from", e.page_range[0]), r.attr("page_to", e.page_range[1]), e.page_range[0] > n.limit && r.addClass("disable"), o = $("<li></li>"), s && o.addClass("final");
                var a = $("<span></span>");
                a.text(e.page_range[0]), r.append(a), o.append(r), i.append(o)
            }
            if (e.children && e.children.length) {
                var _ = $("<ul/>");
                _.addClass("nav nav-list"), $.each(e.children, function(i, s) {
                    i == e.children.length - 1 ? t(s, _, !0, n) : t(s, _, !1, n)
                }), e.name ? (o || (o = $("<li></li>"), s && o.addClass("final")), o.append(_), i.append(o)) : i.append(_)
            }
        };
        return function() {
            console.log("toc __drawToc"), this.$el.html("");
            var e = this.__reader.getBook(),
                i = e.typo.toc,
                s = e.typo.pages.length;
            t(i, this.$el, !1, {
                limit: s
            })
        }
    }(), i.__highlight = function() {
        function t(t, e) {
            var i = null,
                s = 1,
                n = t;
            e.each(function(t, e) {
                $(e).parent("li").removeClass("active");
                var o = parseInt($(e).attr("page_from"), 10);
                o >= s && n >= o && (s = o, i = $(e))
            }), i && i.parent("li").addClass("active")
        }
        var e = this.__reader.getView().page;
        t(e, this.$(".j-itm"))
    }
}), define("app/platform-web/view/toc/bookmark.js", [], function(t, e) {
    "use strict";
    var i = t("widget/list/module_waterfall"),
        s = t("./notes-cache"),
        n = t("common"),
        o = e;
    o.setup = function() {
        return n.isLogin() ? (this.__module = new i({
            parent: this.$el.children().eq(0),
            item: "notes_itm",
            cache: {
                klass: s,
                lkey: "bookmark",
                reader: this.__reader
            },
            limit: 12,
            sbody: this.options.container,
            onbeforelistload: function(t) {
                t.value = '<div class="u-load"><p>正在努力加载中…</p></div>'
            },
            onemptylist: function(t) {
                t.value = '<div class="u-nullarea"><div class="img icn-bookmark-b"></div><h1>暂时没有书签</h1><p>阅读时点击书签可添加</p></div>'
            }
        }), void 0) : (alert("unlogin"), void 0)
    }, o.__destroy = function() {
        this.__module && this.__module.recycle()
    }
}), define("app/platform-web/view/toc/notes.js", [], function(t, e) {
    "use strict";
    var i = t("widget/list/module_waterfall"),
        s = t("./notes-cache"),
        n = t("common"),
        o = e;
    o.setup = function() {
        return n.isLogin() ? (this.__module = new i({
            parent: this.$el.children().eq(0),
            item: {
                klass: "notes_itm",
                reader: this.__reader
            },
            cache: {
                klass: s,
                lkey: "comment",
                reader: this.__reader
            },
            limit: 12,
            sbody: this.options.container,
            onbeforelistload: function(t) {
                t.value = '<div class="u-load"><p>正在努力加载中…</p></div>'
            },
            onemptylist: function(t) {
                t.value = '<div class="u-nullarea"><div class="img icn-note-b"></div><h1>暂时没有笔记</h1></div>'
            }
        }), void 0) : (alert("unlogin"), void 0)
    }, o.__destroy = function() {
        this.__module && this.__module.recycle()
    }
}), define("viperjs/widget/list/module_waterfall.js", [], function(t) {
    var e = t("core"),
        i = t("util"),
        s = t("widget/list/module"),
        n = e.create(),
        o = n.extend(s),
        r = n._$supro;
    return o.init = function(t) {
        this.__doResetMoreBtn(t.more), this.__bindScroll(t);
        var e = parseInt(t.delta);
        isNaN(e) && (e = 30), this.__delta = Math.max(0, e);
        var i = parseInt(t.count);
        this.__count = Math.max(0, i || 0), this.supInit(t)
    }, o.__bindScroll = function(t) {
        this.__scrollOpt = {
            sbody: $(t.sbody),
            type: "scroll",
            func: this.__onCheckScroll.bind(this)
        }, this.__scrollOpt.sbody.on(this.__scrollOpt.type, this.__scrollOpt.func)
    }, o.__destroy = function() {
        this.__supDestroy(), delete this.__nmore, delete this.__sbody, delete this.__endskr, delete this.__nexting, delete this.__sbody, this.__scrollOpt.sbody.off(this.__scrollOpt.type, this.__scrollOpt.func), delete this.__scrollOpt
    }, o.__doResetMoreBtn = function(t) {
        this.__nmore = $(t).get(0), $(this.__nmore).on("click", this.next.bind(this))
    }, o.__onCheckScroll = function(t) {
        if (!this.__endskr) {
            var e = t.target;
            e.scrollHeight || (e = i.getPageBox()), e.scrollTop + e.clientHeight >= e.scrollHeight - this.__delta && this.next()
        }
    }, o.__doChangePage = function(t) {
        this.__doClearListBox(), this.__offset = (t.index - 1) * this.__ropt.limit * this.__count, this.next()
    }, o.__cbListLoad = function(t) {
        delete this.__nexting;
        var e = t.list;
        e && e.length || (this.__endskr = !0), r.__cbListLoad.apply(this, arguments)
    }, o.__doBeforeListLoad = function() {
        this.__doShowMessage("onbeforelistload", "列表加载中..."), $(this.__nmore).css("visibility", "hidden"), $(this.__popt.parent).css("visibility", "hidden")
    }, o.__doBeforeListRender = function(t, e, i) {
        var s = t.length,
            n = e + i > s;
        if (this.__offset = Math.min(this.__offset, s), $(this.__nmore).css("visibility", n ? "hidden" : "visible"), this.__count > 0) {
            var o = i * this.__count,
                r = Math.floor(e / o) + 1,
                a = Math.ceil(s / o);
            if (this.__doSyncPager(r, a)) return !0;
            this.__endskr = 0 == (Math.floor(e / i) + 1) % this.__count, $(this.__nmore).css("display", this.__endskr || n ? "none" : ""), $(this.__popt.parent).css({
                visibility: a > 1 ? "visible" : "hidden",
                display: this.__endskr || n ? "" : "none"
            })
        }
    }, o.__doShowEmpty = function() {
        this.__doShowMessage("onemptylist", "没有列表数据！")
    }, o.__doShowListByJST = function(t, e) {
        this.__lbox.insertAdjacentHTML(e || "beforeEnd", t)
    }, o.__doShowListByItem = function(t) {
        this.__items = this.__items || [], _.isArray(t) ? Array.prototype.push.apply(this.__items, t) : this.__items.push(t)
    }, o.next = function() {
        if (!this.__nexting) {
            this.__nexting = !0;
            var t = this.__offset;
            this.__offset += this.__ropt.limit, this.__doChangeOffset(t)
        }
    }, o.refresh = function() {
        this.__doClearListBox(), this.__offset = 0, this.next()
    }, n
}), define("app/platform-web/view/toc/notes-cache.js", [], function(t) {
    "use strict";

    function e(t) {
        return [t[2], t[3], t[4], t[1]]
    }
    var i = t("widget/cache/cache"),
        s = i.create({
            init: function(t) {
                this.supInit.apply(this, arguments), this.__reader = t.reader, this.__type = t.lkey
            },
            __getRemoteList: function(t) {
                this.__reader.notes.getAllNotes(this.__type, t.offset, t.limit).done(this.__success.bind(this, t))
            },
            __formatData: function(t) {
                console.log("__formatData ,", t);
                var i = t.data;
                _.each(i.items, function(t) {
                    t.position = e(t.BeginRefPos || t.RefPos)
                }, this), t.list = i.items, t.more = i.more
            }
        });
    return s
}), define("viperjs/widget/list/module.js", [], function(t) {
    var e = t("event"),
        i = t("widget/cache/cache"),
        s = t("widget/pager/util/page"),
        n = t("widget/template/tpl"),
        o = t("widget/template/template_item"),
        r = {},
        a = function() {
            return !1
        },
        h = e.create(),
        c = h.prototype;
    return c.init = function(t) {
            this.supInit(t), this.__ropt = {}, this.__lbox = $(t.parent).get(0), this.__iopt = {
                parent: this.__lbox
            }, this.__ropt.limit = parseInt(t.limit) || 10, this.__doResetTemplate(t.item), this.__doResetCache(t.cache || r), this.__doResetPager(t.pager || r), this.refresh()
        }, c.__destroy = function() {
            this.__doClearListBox(), this.__supDestroy(), this.__pager && (this.__pager.recycle(), delete this.__pager), delete this.__pkls, delete this.__popt, delete this.__pulling, this.__cache.recycle(), delete this.__cache, delete this.__lbox, delete this.__ikls, delete this.__iopt, delete this.__ropt
        }, c.refresh = a, c.__doResetJSTTemplate = function(t) {
            delete this.__ikls, this.__ikey = t, $(this.__lbox).on("click", "[data-action]", this.__onCheckAction.bind(this))
        }, c.__doResetTemplate = function(t) {
            if (_.isString(t)) return this.__doResetJSTTemplate(t), void 0;
            _.extend(this.__iopt, t);
            var e = this.__iopt.klass;
            return delete this.__iopt.klass, _.isString(e) ? (this.__doResetJSTTemplate(e), void 0) : (delete this.__ikey, this.__ikls = e, void 0)
        }, c.__doResetCache = function(t) {
            var e = t.klass,
                s = _.extend({}, t);
            this.__ropt.key = s.lkey, this.__ropt.data = s.data || {}, s.change = this.__cbListLoad.bind(this), this.__cache = new(e || i)(s), t.list && this.__cache.setCache(this.__ropt.key, t.list)
        }, c.__doResetPager = function(t) {
            this.__pkls = t.klass || s, this.__popt = _.extend({}, t), delete this.__popt.klass
        }, c.__doClearListBox = function() {
            this.trigger("onbeforelistclear", {
                parent: this.__lbox
            }), this.__items && this.__items.length > 0 && (this.__items = this.__ikls.recycle(this.__items), delete this.__items), $(this.__lbox).html("")
        }, c.__doRefreshByPager = function() {
            var t = this.__pager ? this.__pager.getIndex() : 1;
            this.__doChangePage({
                index: t
            })
        }, c.__doChangePage = function(t) {
            this.__doChangeOffset((t.index - 1) * this.__ropt.limit)
        }, c.__doChangeOffset = function(t) {
            this.__ropt.offset = t, this.__doLoadList()
        }, c.__doLoadList = function() {
            this.__doBeforeListLoad();
            var t = this.__ropt.data;
            t.limit = this.__ropt.limit, t.offset = this.__ropt.offset, this.__cache.get(this.__ropt)
        }, c.__cbListLoad = function(t) {
            if (t.offset == this.__ropt.offset) {
                this.__doBeforeListShow("onloadlist", t);
                var e = t.list;
                if (!e || !e.length) return this.__doShowEmpty(), void 0;
                var i = t.limit,
                    s = t.offset;
                if (!this.__doBeforeListRender(e, s, i))
                    if (this.trigger("onbeforelistrender", {
                        list: e,
                        offset: s,
                        total: t.total,
                        parent: this.__lbox
                    }), this.__ikey) {
                        this.__iopt.xlist = e, this.__iopt.clist = t.xlist, this.__iopt.beg = s, this.__iopt.end = Math.min(e.length, s + i) - 1;
                        var r = n.getJst(this.__ikey, this.__iopt);
                        this.__doShowListByJST(r)
                    } else {
                        this.__iopt.limit = i, this.__iopt.offset = s;
                        var a = o(e, this.__ikls, this.__iopt);
                        this.__doShowListByItem(a)
                    }
            }
        }, c.__doSyncPager = function(t, e) {
            if (this.__pager) {
                var i = this.__pager.getIndex(),
                    s = this.__pager.getTotal();
                if (i > e || e != s) return delete this.__pager, this.__doChangePage({
                    index: Math.min(t, e)
                }), !0
            } else this.__popt.index = t, this.__popt.total = e, this.__pager = new this.__pkls(this.__popt), this.__pager.on("onchange", this.__doChangePage.bind(this))
        }, c.__doBeforeListLoad = a, c.__doBeforeListShow = function(t, e) {
            var i = {
                parent: this.__lbox
            };
            _.extend(i, e), this.trigger(t || "onafterlistload", i), i.stopped || $(this.__ntip).detach()
        }, c.__doBeforeListRender = a, c.__doRenderMessage = function(t, e) {
            _.isString(t) ? (this.__ntip || (this.__ntip = $("<div></div>").get(0)), this.__ntip.innerHTML = t) : this.__ntip = t, this.__lbox.insertAdjacentElement(e || "beforeEnd", this.__ntip)
        }, c.__doShowMessage = function(t, e, i) {
            var s = {
                parent: this.__lbox
            };
            this.trigger(t, s), s.stopped || this.__doRenderMessage(s.value || e, i)
        }, c.__doShowEmpty = a, c.__doShowListByJST = a, c.__doShowListByItem = a, c.__onCheckAction = function() {
            var t = /^(?:delete|update)$/;
            return function(e) {
                var i = e.target;
                if (i) {
                    var s = $(i).data("action");
                    t.test(s) && this.trigger("on" + s, {})
                }
            }
        }(),
        function() {
            document.body.insertAdjacentElement || (HTMLElement.prototype.insertAdjacentElement = function(t, e) {
                if (t && e) switch (t) {
                    case "beforeEnd":
                        return this.appendChild(e), void 0;
                    case "beforeBegin":
                        return this.parentNode.insertBefore(e, this), void 0;
                    case "afterBegin":
                        return this.firstChild ? this.insertBefore(e, this.firstChild) : this.appendChild(e), void 0;
                    case "afterEnd":
                        return this.nextSibling ? this.parentNode.insertBefore(e, this.nextSibling) : this.parentNode.appendChild(e), void 0
                }
            }), "innerText" in document.body || (HTMLElement.prototype.__defineGetter__("innerText", function() {
                return this.textContent
            }), HTMLElement.prototype.__defineSetter__("innerText", function(t) {
                this.textContent = t
            }))
        }(), h
}), define("viperjs/widget/cache/cache.js", [], function(t) {
    var e = t("core"),
        i = t("event"),
        s = {},
        n = e.create(),
        o = n.extend(i);
    return _.extend(o, {
        init: function(t) {
            t = t || {}, this.supInit(t), t.share ? (s[t.share] = s[t.share] || {}, this.__data = s[t.share]) : this.__data = {}
        },
        __key: function(t) {
            if (void 0 !== t.key) return t.key;
            if (void 0 !== t.url) {
                var e = _.omit(t, "offset", "limit");
                return _.values(e).join("-")
            }
            throw "cache no key"
        },
        __getLocalList: function(t) {
            var e = this.__key(t),
                i = t.offset || 0,
                s = t.limit || 0,
                n = this.find(e);
            if (!n) return !1;
            var o = i + s > n.total ? n.total : i + s,
                r = _.filter(n.list, function(t, e) {
                    return e >= i && o > e && void 0 !== t
                });
            return r.length !== o - i ? !1 : r
        },
        __beforeGet: function(t) {
            this.trigger("beforeget", t)
        },
        get: function(t) {
            _.defaults(t, {
                offset: 0,
                limit: 0
            }), this.__beforeGet(t);
            var e = this.__getLocalList(t);
            return e ? (this.__trigger(this.__key(t), e, t), void 0) : (this.__getRemoteList(t), void 0)
        },
        __beforeSend: function(t) {
            this.trigger("beforesend", t)
        },
        __getRemoteList: function(t) {
            var e = _.extend({}, t);
            e.success = this.__success.bind(this, t), this.__beforeSend(e), $.ajax(e)
        },
        __formatData: function(t) {
            var e = t.data;
            0 !== e.result && (t.stopped = !0), this.trigger("beforesave", t)
        },
        __success: function(t, e) {
            var i = _.extend({}, t);
            if (i.key = this.__key(t), i.data = e, this.__formatData(i), !i.stopped) {
                var s = this.__save(i, t);
                !!s && this.__trigger(this.__key(t), s, t)
            }
        },
        __save: function(t, e) {
            var i = t.key,
                s = t.offset,
                n = t.total || 0,
                o = this.find(i);
            return o || (void 0 !== n ? o = {} : console.log("total can't omit in ListCache for init"), o = this.setCache(i, Array(n), e)), _.each(t.list, function(t, e) {
                o.list[s + e] = t
            }), void 0 !== t.more && this.__more(t), this.__getLocalList(e)
        },
        __trigger: function(t, e, i) {
            var s = this.find(t);
            s || console.log("if you tell me trigger, the cache can't be unexist"), s.xlist = e, s.offset = i.offset, s.limit = i.limit, _.extend(s, i.data), this.trigger("change", s)
        },
        __more: function(t) {
            var e = this.find(t.key),
                i = e.list.length;
            t.more && (i += 1), i = Math.max(i, 0), this.setTotal(t.key, i)
        },
        setCache: function(t, e, i) {
            var s = {};
            return _.extend(s, i), s.list = e, s.total = e.length, this.__data[t] = s, s
        },
        setTotal: function(t, e) {
            var i = this.find(t);
            i && (i.list.length = e, i.total = e)
        },
        find: function(t) {
            return this.__data[t]
        }
    }), n
}), define("viperjs/widget/pager/util/page.js", [], function(t, e, i) {
    var s = t("core"),
        n = t("widget/pager/util/page.base.js"),
        o = s.create(),
        r = o.extend(n);
    i.exports = o, r.init = function(t) {
        var e = t.omit || $("<li>...</li>");
        this.__ndot = [e, e.clone()], this.supInit(t)
    }, r.__doRecycleDotNode = function() {
        this.__ndot.forEach(function(t) {
            $(t).remove()
        })
    }, r.__doRefreshPage = function() {
        this.__doRecycleDotNode(), this.__doSetNodeIndex(this.__list[0], 1);
        var t = 1;
        if (this.__index > 1) {
            var e = this.__list.length,
                i = Math.floor((e - 2) / 2),
                s = this.__total - e + 2,
                n = Math.max(2, this.__index - i);
            this.__total >= e && (n = Math.min(n, s)), n > 2 && this.__list.eq(0).after(this.__ndot[0]);
            for (var o; o = n + t - 1, !(o > this.__index); t++) this.__doSetNodeIndex(this.__list[t], o)
        }
        if (this.__index < this.__total) {
            for (var o, n = this.__index + 1, r = 0, a = this.__list.length - 2; o = n + r, !(t > a || o > this.__total); r++, t++) this.__doSetNodeIndex(this.__list[t], o);
            this.__total > o && this.__list.eq(t).before(this.__ndot[1]), this.__total >= o && this.__doSetNodeIndex(this.__list[t++], this.__total)
        }
        for (var a = this.__list.length; a > t; t++) this.__doSetNodeIndex(this.__list[t])
    }, r.__doSetNodeIndex = function(t, e) {
        t = $(t), e ? (t.html("<a>" + e + "</a>"), t.show(), e == this.__index ? t.addClass(this.__selected) : t.removeClass(this.__selected)) : (t.html(""), t.hide(), t.removeClass(this.__selected))
    }
}), define("viperjs/widget/pager/util/page.base.js", [], function(t, e, i) {
    var s = t("core"),
        n = t("event"),
        o = s.create(),
        r = o.extend(n);
    i.exports = o, r.init = function(t) {
        this.supInit.apply(this, arguments), this.__pbtn = $(t.pbtn), this.__nbtn = $(t.nbtn), this.__sbtn = $(t.sbtn), this.__ebtn = $(t.ebtn), this.__name = t.event || "click", this.__selected = t.selected || "js-selected", this.__disabled = t.disabled || "js-disabled", this.__doPageListCheck(t.list), this.updatePage(t.index || 1, t.total || 1)
    }, r.__doPageListCheck = function(t) {
        this.__list = $(t), this.__list.toArray().forEach(function(t) {
            $(t).bind(this.__name, this.__onClick.bind(this, 0))
        }, this), this.__pbtn.bind(this.__name, this.__onClick.bind(this, -1)), this.__nbtn.bind(this.__name, this.__onClick.bind(this, 1)), this.__ebtn.bind(this.__name, this.__onClick.bind(this, -2)), this.__sbtn.bind(this.__name, this.__onClick.bind(this, 2))
    }, r.__onClick = function(t, e) {
        e.preventDefault();
        var i = e.currentTarget;
        if (i && !$(i).hasClass(this.__selected) && !$(i).hasClass(this.__disabled)) {
            var s = i.innerText;
            switch (t) {
                case 1:
                case -1:
                    s = this.__index + t;
                    break;
                case 2:
                    s = this.__total;
                    break;
                case -2:
                    s = 1
            }
            this.setIndex(s)
        }
    }, r.setIndex = function(t) {
        var e = this.__index;
        if (this.__doSaveIndex(t)) return e != this.__index && this.__doChangeIndex(), this
    }, r.updatePage = function(t, e) {
        return this.__doSaveTotal(e) && this.__doSaveIndex(t) ? (this.__doChangeIndex(), this) : this
    }, r.__doSaveTotal = function(t) {
        return t = parseInt(t), isNaN(t) || 1 > t ? !1 : (this.__total = t, !0)
    }, r.__doSaveIndex = function(t) {
        return t = parseInt(t), isNaN(t) || null == this.__total ? !1 : (t = Math.max(1, Math.min(t, this.__total)), this.__last = this.__index, this.__index = t, !0)
    }, r.__doChangeIndex = function() {
        this.__doRefreshPage(), this.__doSyncBtnState(), this.fireEvent("onchange", {
            last: this.__last,
            index: this.__index,
            total: this.__total
        })
    }, r.__doRefreshPage = function() {
        return !1
    }, r.__doSyncBtnState = function() {
        1 == this.__index ? ($(this.__pbtn).addClass(this.__disabled), $(this.__sbtn).addClass(this.__disabled)) : ($(this.__pbtn).removeClass(this.__disabled), $(this.__sbtn).removeClass(this.__disabled)), this.__index == this.__total ? ($(this.__nbtn).addClass(this.__disabled), $(this.__ebtn).addClass(this.__disabled)) : ($(this.__nbtn).removeClass(this.__disabled), $(this.__ebtn).removeClass(this.__disabled))
    }, r.getIndex = function() {
        return this.__index
    }, r.getTotal = function() {
        return this.__total
    }, r.setTotal = function(t) {
        return this.__doSaveTotal(t) && null != this.__index ? (this.__index = 1, this.__doChangeIndex(), this) : void 0
    }, r.__doSetNodeIndex = function(t, e) {
        t = $(t), e ? (t.text(e), t.show(), e == this.__index ? t.addClass(this.__selected) : t.removeClass(this.__selected)) : (t.text(""), t.hide(), t.removeClass(this.__selected))
    }
}), define("app/common/fullscreen.js", [], function(t, e) {
    "use strict";

    function i(t, e) {
        for (var i, n, o = 0; s.length > o && !t[i];) {
            if (i = e, "" == s[o] && (i = i.substr(0, 1).toLowerCase() + i.substr(1)), i = s[o] + i, n = typeof t[i], "undefined" != n) return s = [s[o]], t[i];
            o++
        }
    }
    var s = ["webkit", "moz", "ms", "o", ""];
    e.requestFullScreen = function() {
        var t = i(document.documentElement, "RequestFullScreen");
        return function(e) {
            return t.call(e)
        }
    }(), e.cancelFullScreen = function() {
        var t = i(document, "CancelFullScreen");
        return function() {
            var e = document;
            return t.call(e)
        }
    }(), e.isFullScreen = function() {
        return i(document, "FullScreen") || i(document, "IsFullScreen")
    }, e.support = function() {
        return !!i(document, "CancelFullScreen")
    }
}), define("viperjs/widget/animate/decelerate.js", [], function(t) {
    "use strict";
    var e = t("widget/animate/animation"),
        i = e.create(),
        s = i.prototype;
    return s.init = function(t) {
        this.supInit(t), this.__friction = t.friction || .5, this.__theta = Math.log(1 - this.__friction / 10), this.__acceleration = t.acceleration || 30
    }, s.__doAnimationFrame = function(t) {
        var e = Math.exp((t - this.__begin.time) / this.__acceleration * this.__theta),
            i = this.__begin.offset - this.__begin.velocity * (1 - e) / this.__theta,
            s = this.__begin.velocity * e,
            n = !1;
        return 1 >= Math.abs(s) && (n = !0), this.trigger("onupdate", {
            offset: i,
            velocity: s
        }), n
    }, i
}), define("viperjs/widget/animate/animation.js", [], function(t) {
    "use strict";
    t("widget/timer/animation");
    var e = t("event"),
        i = e.create(),
        s = i.prototype;
    return s.init = function(t) {
        this.supInit(t), this.__end = t.to || _o, this.__begin = t.from || {}
    }, s.__destroy = function() {
        this.__supDestroy(), this.stop(), delete this.__end, delete this.__begin
    }, s.__onAnimationFrame = function(t) {
        return this.__begin ? (("" + t).indexOf(".") >= 0 && (t = +new Date), this.__doAnimationFrame(t) ? (this.stop(), void 0) : (this.__timer = requestAnimationFrame(this.__onAnimationFrame.bind(this)), void 0)) : void 0
    }, s.__doAnimationFrame = _f, s.play = function() {
        return this.__begin.time = +new Date, this.__timer = requestAnimationFrame(this.__onAnimationFrame.bind(this)), this
    }, s.stop = function() {
        return this.__timer = cancelRequestAnimationFrame(this.__timer), this.trigger("onstop"), this
    }, i
}), define("app/common/jst_defaults.js", [], function(t, e) {
    "use strict";
    var i = t("util"),
        s = e;
    s.showStar = function(t) {
        var e = Math.floor(t >= 2 ? Math.floor(t + .5) : 0),
            i = '<div class="icon grade' + e + '"></div>';
        return i
    }, s.imgAdapt = function(t, e) {
        return t.replace(/\!.+/, "!" + e)
    }, s.formatPrice = function(t) {
        return Number(t).toFixed(2)
    }, s.formatAuthor = function(t) {
        return common.buildAuthor(t.authors || t.editors || "佚名")
    }, s.buildAuthor = function(t) {
        var t = t || "佚名",
            e = "\n";
        if (-1 != t.search("\r\n")) var e = "\r\n";
        for (var i = "", s = t.split(e), n = s.length > 2 ? 2 : s.length, o = 0; n > o; o++) i += "<span>" + s[o] + "</span>";
        return s.length > 2 && (i += "<span>" + s[2], i += s.length > 3 ? "&nbsp;等</span>" : "</span>"), i
    }, s.buildContent = function(t) {
        t = _.escape(t);
        var e = "\n"; - 1 != t.search("\r\n") && (e = "\r\n");
        var i = t.split(e),
            s = "",
            n = RegExp(e, "g");
        return i.forEach(function(t, e) {
            if (i[e].length > 0) {
                var o = i[e].trim();
                s += "<p>" + o.replace(n, "</p><p>") + "</p>"
            }
        }), s
    }, s.formatDate = function(t) {
        var e = "",
            s = new Date,
            n = new Date(t);
        return 6e4 > s.getTime() - n.getTime() ? e = "1分钟前" : 36e5 > s.getTime() - n.getTime() ? e = Math.floor((s.getTime() - n.getTime()) / 6e4) + "分钟前" : 864e5 > s.getTime() - n.getTime() ? e = Math.floor((s.getTime() - n.getTime()) / 36e5) + "小时前" : 2592e5 > s.getTime() - n.getTime() && (e = Math.floor((s.getTime() - n.getTime()) / 864e5) + "天前"), e || (e = s.getFullYear() == n.getFullYear() ? i.format(n, "MM-dd") : i.format(n, "yyyy-MM-dd")), e
    }, s.formatStrDate = function(t) {
        var e = new Date(t),
            i = new Date(Number(e) + 6e4 * e.getTimezoneOffset());
        return s.formatDate(i)
    }
}), define("app/module/comment/md_comment_list.js", [], function(t) {
    var e = t("widget/cache/cache"),
        i = (t("core"), t("widget/layer/card")),
        s = (t("widget/tab/tab"), t("request")),
        n = t("tpl"),
        o = t("widget/item/item"),
        r = t("widget/tab/tab.slide.js"),
        a = t("widget/list/module_waterfall"),
        h = t("common"),
        c = t("common/nick/nick"),
        d = t("module/comment/reply"),
        l = t("base"),
        u = l.create(),
        f = u.prototype;
    f.initialize = function(t) {
        this.supInitialize(t), this.__book = t.book, this.once("onfinish");
        var e = {
            list: this.$(".j-tab .j-itm"),
            target: this.$(".j-tab .j-target"),
            selected: "crt",
            duration: 150,
            onchange: this.__onTabChange.bind(this)
        };
        new r(e)
    }, f.__onTabChange = function(t) {
        !!this.__module && this.__module.recycle();
        var e = (t.index + 1) % 2,
            i = {
                klass: p,
                lkey: "comment",
                data: {
                    book_id: this.__book.book_id,
                    order_type: e
                }
            };
        this.__module = new a({
            parent: this.$(".j-commentlist"),
            limit: 5,
            item: {
                klass: g
            },
            cache: i,
            sbody: $(".j-comment-wrapper"),
            onloadlist: _.once(this.render.bind(this))
        }), this.__module.on("onloadlist", function(t) {
            new c({
                data: t.xlist
            })
        })
    }, f.render = function(t) {
        this.$(".j-comment-total").html(t.total), 0 !== t.total && this.$el.show(), this.trigger("onfinish", {
            total: t.total
        })
    };
    var p = e.create(),
        f = p.prototype;
    f.__getRemoteList = function(t) {
        var e = {};
        e.order_type = t.data.order_type, e.book_id = t.data.book_id, e.start_index = t.offset + 1, e.count = t.limit, s.get_comments(e, this.__success.bind(this, t))
    }, f.__formatData = function(t) {
        var e = t.data;
        0 !== e.result && (t.stopped = !0), t.list = t.data.comments, t.total = t.data.total
    };
    var g = o.create(),
        f = g.prototype;
    f.events = {
        "click .j-vote": "__onVote",
        "click .j-reply": "__doReply"
    }, f.init = function(t) {
        this.supInit(t)
    }, f.render = function(t) {
        return n.getJst("comment_list", t)
    }, f.__doReply = function() {
        if (this.__replyModule) {
            if (this.__replyModule.$el.is(":animated")) return;
            this.__replyModule.toggle()
        } else this.__replyModule = new v({
            parent: this.$el,
            book_id: this.__data.book_id,
            comment_id: this.__data.comment_id
        })
    }, f.__onVote = function(t) {
        if (!h.isLogin()) return this.__showTip(t, 0), void 0;
        var e = $(t.currentTarget);
        s.vote_comment(this.__data.book_id, e.data("code"), 1).done(function(i) {
            if (0 == i.result) {
                this.__showTip(t, 2);
                var s = e.find(".j-vote-num");
                s.html(+s.html() + 1)
            } else 40007 == i.result && this.__showTip(t, 1)
        }.bind(this))
    }, f.__showTip = function() {
        var t = ['<div class="w-tips1">您还没有 &nbsp;<span class="j-login likea">登录</span></div>', '<div class="w-tips1">您已投过票，谢谢支持！</div>', '<div class="w-tips1">感谢您的投票！</div>'];
        return function(e, s) {
            $(document.body).click(), e.stopPropagation();
            var n = e.currentTarget,
                o = new i({
                    el: $(t[s]),
                    target: n,
                    align: "top",
                    delta: {
                        top: 6,
                        left: 35
                    },
                    destroyable: !0
                });
            o.$el.on("click", ".j-login", h.login), o.show(), $(n).mouseleave(function() {
                o.$el.fadeOut(2e3)
            })
        }
    }();
    var m = t("widget/form/form");
    t("widget/placeholder/placeholder");
    var v = d.create(),
        f = v.prototype;
    f.events = {
        "click .j-doreply": "__reply",
        "keypress input": function(t) {
            return 13 === t.which ? (this.$(".j-doreply").click(), !1) : void 0
        }
    }, f.initialize = function(t) {
        this.supInitialize(t), this.__st = !0;
        var e = this.__ropt = {
            book_id: t.book_id,
            comment_id: t.comment_id
        };
        s.get_comment_reply(e, this.render.bind(this)), this.$el.on("click", ".j-login", h.login)
    }, f.render = function(t) {
        t.logged = h.isLogin(), this.$el.html(n.getJst("reply_itm", {
            book: t
        })), this.setElement(this.$el.children().eq(0)), this.$el.hide(), this.__addlist(t), this.show(), window.setTimeout(function() {
            new c({
                data: t.reply
            })
        }, 300), h.isLogin() && (this.__form = new m({
            form: this.$("form")
        }))
    }, f.__addlist = function(t) {
        var e = _.first(t.reply, 10),
            i = {
                parent: this.$(".j-replylist")
            };
        _.extend(i, this.__ropt), n.renderItems(e, b, i)
    };
    var b = g.create(),
        f = b.prototype;
    f.events = {
        "click .j-comment-reply": "__doReply"
    }, f.render = function(t) {
        return n.getJst("comment_reply_item", t)
    }, f.__doReply = function() {
        if (this.__replyModule) {
            if (this.__replyModule.$el.is(":animated")) return;
            this.__replyModule.toggle()
        } else this.__replyModule = new y({
            parent: this.$(".operate"),
            book_id: this.options.book_id,
            comment_id: this.options.comment_id,
            reply_id: this.__data.reply_id
        })
    };
    var y = d.create(),
        f = y.prototype;
    return f.events = {
        "click .j-write-comment-reply": "__reply",
        "keypress input": function(t) {
            return 13 === t.which ? (this.$(".j-write-comment-reply").click(), !1) : void 0
        }
    }, f.__initXGui = function() {
        this.__tpl = n.getText("comment_reply_reply_item")
    }, f.initialize = function(t) {
        this.__st = !0, this.__ropt = {
            book_id: t.book_id,
            comment_id: t.comment_id,
            reply_to: t.reply_id
        }, window.setTimeout(function() {
            this.__form = new m({
                form: this.$("form")
            }), this.show()
        }.bind(this), 0), this.on("beforesend", this.__formatContent.bind(this))
    }, f.__formatContent = function(t) {
        var e = t.content,
            i = this.$el.parents("li").find('[class*="j-xm"]').html();
        t.content = "回复 " + i + ": " + e
    }, f.show = function() {
        this.$el.fadeIn()
    }, f.hide = function() {
        this.$el.slideUp()
    }, u
}), define("viperjs/widget/layer/card.js", [], function(t, e, i) {
    var s = t("core"),
        n = t("util"),
        o = t("./layer"),
        r = s.create(),
        a = r.extend(o);
    i.exports = r, a.init = function(t) {
        !t && (t = {}), t.parent = t.parent || document.body, this.supInit(t), this.__opt = t, $(this.__body).css("position", "absolute"), t.stc || $(document).click(this.hide.bind(this))
    }, a.__setAlign = function() {
        var t = /\s+/i;
        return function(e) {
            e = (e || "").trim().toLowerCase().split(t), e[0] = e[0] || "top", e[1] = e[1] || "left", this.__align = e
        }
    }(), a.__doPositionAlign = function() {
        return this.__fixed ? (this.setPosition(this.__position), void 0) : this.__fbox ? (this.setPosition(this.__doCallPosition(this.__align)), void 0) : void 0
    }, a.__doCallPosition = function(t) {
        var e = {},
            i = this.__fbox,
            s = (n.getPageBox(), this.__body.offsetWidth),
            o = this.__body.offsetHeight;
        switch (t[0]) {
            case "top":
                e.top = i.top - o, e.left = "right" == t[1] ? i.left + i.width - s : i.left;
                break;
            case "left":
                e.left = i.left - s, e.top = "bottom" == t[1] ? i.top + i.height - o : i.top;
                break;
            case "right":
                e.left = i.left + i.width, e.top = "bottom" == t[1] ? i.top + i.height - o : i.top;
                break;
            default:
                e.top = i.top + i.height, e.left = "right" == t[1] ? i.left + i.width - s : i.left
        }
        return e
    }, a.__doCallTargetBox = function(t, e) {
        if (t = $(t), t.length) {
            e = e || {};
            var i = t.offset();
            return {
                top: i.top - (e.top || 0),
                left: i.left - (e.left || 0),
                width: t.outerWidth() + (e.right || 0),
                height: t.outerHeight() + (e.bottom || 0)
            }
        }
    }, a.show = function(t) {
        this.__opt = $.extend(this.__opt, t);
        var t = this.__opt;
        return t.fixed && (this.__fixed = !0, this.__position = t.fixed), t.target && (this.__setAlign(t.align), this.__fbox = this.__doCallTargetBox(t.target, t.delta)), r._$supro.show.apply(this, arguments)
    }
}), define("viperjs/widget/item/item.js", [], function(t) {
    var e = t("base"),
        i = +new Date,
        s = {
            init: function(t) {
                this.__id = ++i, this.__index = t.index, this.__total = t.total, this.__range = t.range, this.__data = t.data || {}, this.supInit(t)
            },
            __initXGui: function() {
                this.__tpl = this.render(this.__data)
            },
            getId: function() {
                return this.__id
            },
            getData: function() {
                this.__data
            }
        };
    return e.create(s)
}), define("viperjs/widget/tab/tab.slide.js", [], function(t) {
    var e = t("widget/tab/tab.js"),
        i = e.create(),
        s = i.prototype;
    return i._$supro, s.init = function(t) {
        this.__locations = [], this.__target = $(t.target), this.__offset = t.offset || 0, this.__duration = t.duration || 500, this.__getLocation($(t.list)), this.supInit(t), this.__target.show().stop(!0, !0), this.on("onchange", function(t) {
            t.nostop = !0
        })
    }, s.__getLocation = function(t) {
        var e = t.first().outerWidth(!0),
            i = 0,
            s = this.__target.outerWidth(!0),
            n = t.length,
            o = 0;
        t = t.first().nextUntil(t.last()).andSelf().add(t.last()), _.each(t, function(t) {
            i += $(t).outerWidth(!0)
        }, this), o = (i - e) / (n - 1), _.each(_.range(t.length), function(t) {
            this.__locations.push(this.__offset + e / 2 + o * t - s / 2)
        }, this)
    }, s.__slide = function(t) {
        _.toArray(arguments), this.__target.animate({
            left: this.__locations[t]
        }, this.__duration, function() {
            var e = this.__list[t],
                i = {
                    index: t,
                    last: this.__index
                };
            this.__index = t, this.__doTabItemSelect(e, !0), e = this.__list[i.last], e && this.__doTabItemSelect(e, !1), this.trigger("onchange", i)
        }.bind(this))
    }, s.go = function(t, e) {
        var i = this.__list[t];
        return t == this.__index || !i || $(i).hasClass(this.__disabled) ? (!!e && e.preventDefault(), this) : (this.__slide.apply(this, arguments), void 0)
    }, i
}), define("app/common/nick/nick.js", [], function(t) {
    var e = t("event"),
        i = t("request"),
        s = e.create(),
        n = s.prototype;
    return n.init = function(t) {
        this.supInit.apply(this, arguments), this.__uids = this.__getUids(t.data), this.__uids.length && i.get_xiaomi_info(this.__uids).done(this.__doReplace.bind(this))
    }, n.__getUids = function(t) {
        var e = [];
        return _.each(t, function(t) {
            t.user_id > 0 && e.push(t.user_id + "")
        }), e
    }, n.__doReplace = function(t) {
        window.setTimeout(function() {
            _.each(t, function(t) {
                var e = t.userId;
                $(".j-xm-" + e).html(t.miliaoNick || t.aliasNick)
            })
        }, 0)
    }, s
}), define("app/module/comment/reply.js", [], function(t) {
    "use strict";
    var e = t("base"),
        i = t("widget/form/form"),
        s = t("common"),
        n = t("request"),
        o = e.create(),
        r = o.prototype;
    return r.events = {
        "click .j-reply": "__reply",
        "keypress input": function(t) {
            return 13 === t.which ? (this.$(".j-reply").click(), !1) : void 0
        }
    }, r.__buildForm = function() {
        this.__form = new i({
            form: this.$("form")
        })
    }, r.__reply = function() {
        return s.isLogin() ? this.__form.check() ? (_.extend(this.__ropt, this.__form.data()), this.trigger("beforesend", this.__ropt), n.reply_comment(this.__ropt, function(t) {
            switch (t.result) {
                case 0:
                    this.__form.get("content").value = "", this.__showTip(2);
                    break;
                case 40001:
                    this.__showTip(0);
                    break;
                default:
            }
        }.bind(this)), void 0) : (this.__showTip(1), void 0) : (s.login(), void 0)
    }, r.__showTip = function(t) {
        var e = this.$(".form .u-msg");
        e.stop(!0, !0).hide(), e.eq(t).show().fadeOut(3e3)
    }, r.toggle = function() {
        this.__st ? this.hide() : this.show(), this.__st = !this.__st
    }, r.show = function() {
        this.$el.slideDown()
    }, r.hide = function() {
        this.$el.slideUp()
    }, o
}), define("app/action/book.js", [], function(t) {
    "use strict";
    var e = t("./base"),
        i = e.create(),
        s = i.prototype;
    return s.init = function() {
        this.supInit.apply(this, arguments)
    }, s.__showWelcome = function() {
        console.log("show welcome")
    }, s.__askProgress = function() {
        console.log("ask progress")
    }, i
}), define("app/action/ctrl.js", [], function(t) {
    "use strict";
    var e = t("./base"),
        i = e.create(),
        s = i.prototype;
    return s._toggleToc = function() {
        this.__views.comment.hide(), this.__views.toc.toggle()
    }, s._toggleComment = function() {
        this.__views.toc.hide(), this.__views.comment.toggle()
    }, i
});
