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
      (this.interceptedClicks = []),
      window.addEventListener("pageshow", (t) => {
        this.persisted = t.persisted;
      }),
      window.addEventListener("DOMContentLoaded", () => {
        this._preconnect3rdParties();
      }),
      (this.delayedScripts = { normal: [], async: [], defer: [] }),
      (this.allJQueries = []);
  }
  _addUserInteractionListener(t) {
    document.hidden
      ? t._triggerListener()
      : (this.triggerEvents.forEach((e) =>
          window.addEventListener(e, t.userEventHandler, { passive: !0 })
        ),
        window.addEventListener("touchstart", t.touchStartHandler, {
          passive: !0,
        }),
        window.addEventListener("mousedown", t.touchStartHandler),
        document.addEventListener("visibilitychange", t.userEventHandler));
  }
  _removeUserInteractionListener() {
    this.triggerEvents.forEach((t) =>
      window.removeEventListener(t, this.userEventHandler, { passive: !0 })
    ),
      document.removeEventListener("visibilitychange", this.userEventHandler);
  }
  _onTouchStart(t) {
    "HTML" !== t.target.tagName &&
      (window.addEventListener("touchend", this.touchEndHandler),
      window.addEventListener("mouseup", this.touchEndHandler),
      window.addEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.addEventListener("mousemove", this.touchMoveHandler),
      t.target.addEventListener("click", this.clickHandler),
      this._renameDOMAttribute(t.target, "onclick", "postify-onclick"));
  }
  _onTouchMove(t) {
    window.removeEventListener("touchend", this.touchEndHandler),
      window.removeEventListener("mouseup", this.touchEndHandler),
      window.removeEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.removeEventListener("mousemove", this.touchMoveHandler),
      t.target.removeEventListener("click", this.clickHandler),
      this._renameDOMAttribute(t.target, "postify-onclick", "onclick");
  }
  _onTouchEnd(t) {
    window.removeEventListener("touchend", this.touchEndHandler),
      window.removeEventListener("mouseup", this.touchEndHandler),
      window.removeEventListener("touchmove", this.touchMoveHandler, {
        passive: !0,
      }),
      window.removeEventListener("mousemove", this.touchMoveHandler);
  }
 
  _replayClicks() {
    window.removeEventListener("touchstart", this.touchStartHandler, {
      passive: !0,
    }),
      window.removeEventListener("mousedown", this.touchStartHandler),
      this.interceptedClicks.forEach((t) => {
        t.target.dispatchEvent(
          new MouseEvent("click", { view: t.view, bubbles: !0, cancelable: !0 })
        );
      });
  }
  _renameDOMAttribute(t, e, i) {
    t.hasAttribute &&
      t.hasAttribute(e) &&
      (event.target.setAttribute(i, event.target.getAttribute(e)),
      event.target.removeAttribute(e));
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
    let t = [];
    document.querySelectorAll("script[type=postifyscript]").forEach((e) => {
      if (e.hasAttribute("src")) {
        let i = new URL(e.src).origin;
        i !== location.origin &&
          t.push({
            src: i,
            crossOrigin:
              e.crossOrigin || "module" === e.getAttribute("data-postify-type"),
          });
      }
    }),
      (t = [...new Map(t.map((t) => [JSON.stringify(t), t])).values()]),
      this._batchInjectResourceHints(t, "preconnect");
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
    } catch (t) {}
    window.dispatchEvent(new Event("postify-allScriptsLoaded")),
      this._replayClicks();
  }
  _registerAllDelayedScripts() {
    document.querySelectorAll("script[type=postifyscript]").forEach((t) => {
      t.hasAttribute("src")
        ? t.hasAttribute("async") && !1 !== t.async
          ? this.delayedScripts.async.push(t)
          : (t.hasAttribute("defer") && !1 !== t.defer) ||
            "module" === t.getAttribute("data-postify-type")
          ? this.delayedScripts.defer.push(t)
          : this.delayedScripts.normal.push(t)
        : this.delayedScripts.normal.push(t);
    });
  }
  async _transformScript(t) {
    return (
      await this._littleBreath(),
      new Promise((e) => {
        let i = document.createElement("script");
        [...t.attributes].forEach((t) => {
          let e = t.nodeName;
          "type" !== e &&
            ("data-postify-type" === e && (e = "type"),
            i.setAttribute(e, t.nodeValue));
        }),
          t.hasAttribute("src")
            ? (i.addEventListener("load", e), i.addEventListener("error", e))
            : ((i.text = t.text), e());
        try {
          t.parentNode.replaceChild(i, t);
        } catch (r) {
          e();
        }
      })
    );
  }
  async _loadScriptsFromList(t) {
    let e = t.shift();
    return e
      ? (await this._transformScript(e), this._loadScriptsFromList(t))
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
  _batchInjectResourceHints(t, e) {
    var i = document.createDocumentFragment();
    t.forEach((t) => {
      if (t.src) {
        let r = document.createElement("link");
        (r.href = t.src),
          (r.rel = e),
          console.log({ e: t, i: r, t: e }),
          "preconnect" !== e && (r.as = "script"),
          t.getAttribute &&
            "module" === t.getAttribute("data-postify-type") &&
            (r.crossOrigin = !0),
          t.crossOrigin && (r.crossOrigin = t.crossOrigin),
          i.appendChild(r);
      }
    }),
      document.head.appendChild(i),
      console.log(i);
  }
  _delayEventListeners() {
    let t = {};
    function e(e, i) {
      !(function (e) {
        function i(i) {
          return t[e].eventsToRewrite.indexOf(i) >= 0 ? "postify-" + i : i;
        }
        t[e] ||
          ((t[e] = {
            originalFunctions: {
              add: e.addEventListener,
              remove: e.removeEventListener,
            },
            eventsToRewrite: [],
          }),
          (e.addEventListener = function () {
            (arguments[0] = i(arguments[0])),
              t[e].originalFunctions.add.apply(e, arguments);
          }),
          (e.removeEventListener = function () {
            (arguments[0] = i(arguments[0])),
              t[e].originalFunctions.remove.apply(e, arguments);
          }));
      })(e),
        t[e].eventsToRewrite.push(i);
    }
    function i(t, e) {
      let i = t[e];
      Object.defineProperty(t, e, {
        get: () => i || function () {},
        set(r) {
          t["postify" + e] = i = r;
        },
      });
    }
    e(document, "DOMContentLoaded"),
      e(window, "DOMContentLoaded"),
      e(window, "load"),
      e(window, "pageshow"),
      e(document, "readystatechange"),
      i(document, "onreadystatechange"),
      i(window, "onload"),
      i(window, "onpageshow");
  }
  _delayJQueryReady(t) {
    let e = window.jQuery;
    Object.defineProperty(window, "jQuery", {
      get: () => e,
      set(i) {
        if (i && i.fn && !t.allJQueries.includes(i)) {
          i.fn.ready = i.fn.init.prototype.ready = function (e) {
            t.domReadyFired
              ? e.bind(document)(i)
              : document.addEventListener("postify-DOMContentLoaded", () =>
                  e.bind(document)(i)
                );
          };
          let r = i.fn.on;
          (i.fn.on = i.fn.init.prototype.on =
            function () {
              if (this[0] === window) {
                function t(t) {
                  return t
                    .split(" ")
                    .map((t) =>
                      "load" === t || 0 === t.indexOf("load.")
                        ? "postify-jquery-load"
                        : t
                    )
                    .join(" ");
                }
                "string" == typeof arguments[0] ||
                arguments[0] instanceof String
                  ? (arguments[0] = t(arguments[0]))
                  : "object" == typeof arguments[0] &&
                    Object.keys(arguments[0]).forEach((e) => {
                      delete Object.assign(arguments[0], {
                        [t(e)]: arguments[0][e],
                      })[e];
                    });
              }
              return r.apply(this, arguments), this;
            }),
            t.allJQueries.push(i);
        }
        e = i;
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
      this.allJQueries.forEach((t) => t(window).trigger("postify-jquery-load")),
      await this._littleBreath();
    let t = new Event("postify-pageshow");
    (t.persisted = this.persisted),
      window.dispatchEvent(t),
      await this._littleBreath(),
      window.postifyonpageshow &&
        window.postifyonpageshow({ persisted: this.persisted });
  }
  _handleDocumentWrite() {
    let t = new Map();
    document.write = document.writeln = function (e) {
      let i = document.currentScript,
        r = document.createRange(),
        s = i.parentElement,
        n = t.get(i);
      void 0 === n && ((n = i.nextSibling), t.set(i, n));
      let a = document.createDocumentFragment();
      r.setStart(a, 0),
        a.appendChild(r.createContextualFragment(e)),
        s.insertBefore(a, n);
    };
  }
  async _littleBreath() {
    Date.now() - this.lastBreath > 45 &&
      (await this._requestAnimFrame(), (this.lastBreath = Date.now()));
  }
  async _requestAnimFrame() {
    return document.hidden
      ? new Promise((t) => setTimeout(t))
      : new Promise((t) => requestAnimationFrame(t));
  }
  static run() {
    let t = new PostifyFirstInteraction();
    t._addUserInteractionListener(t);
  }
}
PostifyFirstInteraction.run();
