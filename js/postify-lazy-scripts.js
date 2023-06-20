class PostifyFirstInteraction {
  constructor() {
    (this.triggerEvents = [
      "keydown",
      "mousedown",
      "mousemove",
      "touchmove",
      "touchstart",
      "touchend",
      "wheel",
    ]),
      (this.userEventHandler = this._triggerListener.bind(this)),
      (this.touchStartHandler = this._onTouchStart.bind(this)),
      (this.touchMoveHandler = this._onTouchMove.bind(this)),
      (this.touchEndHandler = this._onTouchEnd.bind(this)),
      (this.clickHandler = this._onClick.bind(this)),
      (this.interceptedClicks = []),
      window.addEventListener("pageshow", (e) => {
        this.persisted = e.persisted;
      }),
      window.addEventListener("DOMContentLoaded", () => {
        this._preconnect3rdParties();
      }),
      (this.delayedScripts = { normal: [], async: [], defer: [] }),
      (this.allJQueries = []);
  }
  _addUserInteractionListener(e) {
    document.hidden
      ? e._triggerListener()
      : (this.triggerEvents.forEach((t) =>
          window.addEventListener(t, e.userEventHandler, { passive: !0 })
        ),
        window.addEventListener("touchstart", e.touchStartHandler, {
          passive: !0,
        }),
        window.addEventListener("mousedown", e.touchStartHandler),
        document.addEventListener("visibilitychange", e.userEventHandler));
  }
  _removeUserInteractionListener() {
    this.triggerEvents.forEach((e) =>
      window.removeEventListener(e, this.userEventHandler, { passive: !0 })
    ),
      document.removeEventListener("visibilitychange", this.userEventHandler);
  }
  _onTouchStart(e) {
    "HTML" !== e.target.tagName &&
      (window.addEventListener("touchend", this.touchEndHandler),
      window.addEventListener("mouseup", this.touchEndHandler),
      window.addEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.addEventListener("mousemove", this.touchMoveHandler),
      e.target.addEventListener("click", this.clickHandler),
      this._renameDOMAttribute(e.target, "onclick", "postify-onclick"));
  }
  _onTouchMove(e) {
    window.removeEventListener("touchend", this.touchEndHandler),
      window.removeEventListener("mouseup", this.touchEndHandler),
      window.removeEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.removeEventListener("mousemove", this.touchMoveHandler),
      e.target.removeEventListener("click", this.clickHandler),
      this._renameDOMAttribute(e.target, "postify-onclick", "onclick");
  }
  _onTouchEnd(e) {
    window.removeEventListener("touchend", this.touchEndHandler),
      window.removeEventListener("mouseup", this.touchEndHandler),
      window.removeEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.removeEventListener("mousemove", this.touchMoveHandler);
  }
  _onClick(e) {
    e.target.removeEventListener("click", this.clickHandler),
      this._renameDOMAttribute(e.target, "postify-onclick", "onclick"),
      this.interceptedClicks.push(e),
      e.preventDefault(),
      e.stopPropagation(),
      e.stopImmediatePropagation();
  }
  _replayClicks() {
    window.removeEventListener("touchstart", this.touchStartHandler, {
      passive: !0,
    }),
      window.removeEventListener("mousedown", this.touchStartHandler),
      this.interceptedClicks.forEach((e) => {
        e.target.dispatchEvent(
          new MouseEvent("click", { view: e.view, bubbles: !0, cancelable: !0 })
        );
      });
  }
  _renameDOMAttribute(e, t, n) {
    e.hasAttribute &&
      e.hasAttribute(t) &&
      (event.target.setAttribute(n, event.target.getAttribute(t)),
      event.target.removeAttribute(t));
  }
  _triggerListener() {
    this._removeUserInteractionListener(this),
      "loading" === document.readyState
        ? document.addEventListener(
            "DOMContentLoaded",
            this._loadEverythingNow.bind(this)
          )
        : this._loadEverythingNow();
  }
  _preconnect3rdParties() {
    let e = [];
    document.querySelectorAll("script[type=postifyscript]").forEach((t) => {
      if (t.hasAttribute("src")) {
        const n = new URL(t.src).origin;
        n !== location.origin &&
          e.push({
            src: n,
            crossOrigin:
              t.crossOrigin || "module" === t.getAttribute("data-postify-type"),
          });
      }
    }),
      (e = [...new Map(e.map((e) => [JSON.stringify(e), e])).values()]),
      this._batchInjectResourceHints(e, "preconnect");
  }
  async _loadEverythingNow() {
    (this.lastBreath = Date.now()),
      this._delayEventListeners(),
      this._delayJQueryReady(this),
      this._handleDocumentWrite(),
      this._registerAllDelayedScripts(),
      this._preloadAllScripts(),
      await this._loadScriptsFromList(this.delayedScripts.normal),
      await this._loadScriptsFromList(this.delayedScripts.defer),
      await this._loadScriptsFromList(this.delayedScripts.async);
    try {
      await this._triggerDOMContentLoaded(), await this._triggerWindowLoad();
    } catch (e) {}
    window.dispatchEvent(new Event("postify-allScriptsLoaded")),
      this._replayClicks();
  }
  _registerAllDelayedScripts() {
    document.querySelectorAll("script[type=postifyscript]").forEach((e) => {
      e.hasAttribute("src")
        ? e.hasAttribute("async") && !1 !== e.async
          ? this.delayedScripts.async.push(e)
          : (e.hasAttribute("defer") && !1 !== e.defer) ||
            "module" === e.getAttribute("data-postify-type")
          ? this.delayedScripts.defer.push(e)
          : this.delayedScripts.normal.push(e)
        : this.delayedScripts.normal.push(e);
    });
  }
  async _transformScript(e) {
    return (
      await this._littleBreath(),
      new Promise((t) => {
        const n = document.createElement("script");
        [...e.attributes].forEach((e) => {
          let t = e.nodeName;
          "type" !== t &&
            ("data-postify-type" === t && (t = "type"),
            n.setAttribute(t, e.nodeValue));
        }),
          e.hasAttribute("src")
            ? (n.addEventListener("load", t), n.addEventListener("error", t))
            : ((n.text = e.text), t());
        try {
          e.parentNode.replaceChild(n, e);
        } catch (e) {
          t();
        }
      })
    );
  }
  async _loadScriptsFromList(e) {
    const t = e.shift();
    return t
      ? (await this._transformScript(t), this._loadScriptsFromList(e))
      : Promise.resolve();
  }
  _preloadAllScripts() {
    this._batchInjectResourceHints(
      [
        ...this.delayedScripts.normal,
        ...this.delayedScripts.defer,
        ...this.delayedScripts.async,
      ],
      "preload"
    );
  }
  _batchInjectResourceHints(e, t) {
    var n = document.createDocumentFragment();
    e.forEach((e) => {
      if (e.src) {
        const i = document.createElement("link");
        (i.href = e.src),
          (i.rel = t),
          "preconnect" !== t && (i.as = "script"),
          e.getAttribute &&
            "module" === e.getAttribute("data-postify-type") &&
            (i.crossOrigin = !0),
          e.crossOrigin && (i.crossOrigin = e.crossOrigin),
          n.appendChild(i);
      }
    }),
      document.head.appendChild(n);
  }
  _delayEventListeners() {
    let e = {};
    function t(t, n) {
      !(function (t) {
        function n(n) {
          return e[t].eventsToRewrite.indexOf(n) >= 0 ? "postify-" + n : n;
        }
        e[t] ||
          ((e[t] = {
            originalFunctions: {
              add: t.addEventListener,
              remove: t.removeEventListener,
            },
            eventsToRewrite: [],
          }),
          (t.addEventListener = function () {
            (arguments[0] = n(arguments[0])),
              e[t].originalFunctions.add.apply(t, arguments);
          }),
          (t.removeEventListener = function () {
            (arguments[0] = n(arguments[0])),
              e[t].originalFunctions.remove.apply(t, arguments);
          }));
      })(t),
        e[t].eventsToRewrite.push(n);
    }
    function n(e, t) {
      let n = e[t];
      Object.defineProperty(e, t, {
        get: () => n || function () {},
        set(i) {
          e["postify" + t] = n = i;
        },
      });
    }
    t(document, "DOMContentLoaded"),
      t(window, "DOMContentLoaded"),
      t(window, "load"),
      t(window, "pageshow"),
      t(document, "readystatechange"),
      n(document, "onreadystatechange"),
      n(window, "onload"),
      n(window, "onpageshow");
  }
  _delayJQueryReady(e) {
    let t = window.jQuery;
    Object.defineProperty(window, "jQuery", {
      get: () => t,
      set(n) {
        if (n && n.fn && !e.allJQueries.includes(n)) {
          n.fn.ready = n.fn.init.prototype.ready = function (t) {
            e.domReadyFired
              ? t.bind(document)(n)
              : document.addEventListener("postify-DOMContentLoaded", () =>
                  t.bind(document)(n)
                );
          };
          const t = n.fn.on;
          (n.fn.on = n.fn.init.prototype.on =
            function () {
              if (this[0] === window) {
                function e(e) {
                  return e
                    .split(" ")
                    .map((e) =>
                      "load" === e || 0 === e.indexOf("load.")
                        ? "postify-jquery-load"
                        : e
                    )
                    .join(" ");
                }
                "string" == typeof arguments[0] ||
                arguments[0] instanceof String
                  ? (arguments[0] = e(arguments[0]))
                  : "object" == typeof arguments[0] &&
                    Object.keys(arguments[0]).forEach((t) => {
                      delete Object.assign(arguments[0], {
                        [e(t)]: arguments[0][t],
                      })[t];
                    });
              }
              return t.apply(this, arguments), this;
            }),
            e.allJQueries.push(n);
        }
        t = n;
      },
    });
  }
  async _triggerDOMContentLoaded() {
    (this.domReadyFired = !0),
      await this._littleBreath(),
      document.dispatchEvent(new Event("postify-DOMContentLoaded")),
      await this._littleBreath(),
      window.dispatchEvent(new Event("postify-DOMContentLoaded")),
      await this._littleBreath(),
      document.dispatchEvent(new Event("postify-readystatechange")),
      await this._littleBreath(),
      document.postifyonreadystatechange &&
        document.postifyonreadystatechange();
  }
  async _triggerWindowLoad() {
    await this._littleBreath(),
      window.dispatchEvent(new Event("postify-load")),
      await this._littleBreath(),
      window.postifyonload && window.postifyonload(),
      await this._littleBreath(),
      this.allJQueries.forEach((e) => e(window).trigger("postify-jquery-load")),
      await this._littleBreath();
    const e = new Event("postify-pageshow");
    (e.persisted = this.persisted),
      window.dispatchEvent(e),
      await this._littleBreath(),
      window.postifyonpageshow &&
        window.postifyonpageshow({ persisted: this.persisted });
  }
  _handleDocumentWrite() {
    const e = new Map();
    document.write = document.writeln = function (t) {
      const n = document.currentScript,
        i = document.createRange(),
        r = n.parentElement;
      let o = e.get(n);
      void 0 === o && ((o = n.nextSibling), e.set(n, o));
      const s = document.createDocumentFragment();
      i.setStart(s, 0),
        s.appendChild(i.createContextualFragment(t)),
        r.insertBefore(s, o);
    };
  }
  async _littleBreath() {
    Date.now() - this.lastBreath > 45 &&
      (await this._requestAnimFrame(), (this.lastBreath = Date.now()));
  }
  async _requestAnimFrame() {
    return document.hidden
      ? new Promise((e) => setTimeout(e))
      : new Promise((e) => requestAnimationFrame(e));
  }
  static run() {
    const e = new PostifyFirstInteraction();
    e._addUserInteractionListener(e);
  }
}
PostifyFirstInteraction.run();
