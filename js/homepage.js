var postifyScrollMagicController = new ScrollMagic.Controller();
(window.URL = window.URL || window.webkitURL),
  (function (t) {
    "use strict";
    void 0 !== window.safari &&
      t(".postify-tabs video").each(function () {
        t(this).parent(),
          t(this)
            .parent()
            .append(
              '<img class="poster fallback lazyloaded" data-src="' +
                t(this).find("source").eq(1).attr("src") +
                '">'
            ),
          t(this).remove();
      }),
      t(".postify-tabs video").on("play", function () {
        this.currentTime = 0;
      }),
      document.querySelector(".postify-tabs"),
      new ScrollMagic.Scene({
        triggerElement: ".postify-tabs",
        triggerHook: 0.9,
        offset: 0,
        duration: "200%",
      })
        .addTo(postifyScrollMagicController)
        .on("enter", function (e) {
          t(e.currentTarget.triggerElement())
            .find(".nav-item")
            .eq(0)
            .find("button")
            .trigger("click");
        })
        .on("leave", function (e) {
          t(".postify-tabs video").each(function () {
            t(this).get(0) &&
              (t(this).get(0).pause(), (t(this).get(0).currentTime = 0));
          });
        }),
      t(".postify-tabs button").on("click", function (e) {
        e.preventDefault(),
          t(".postify-tabs .nav-link")
            .attr("area-selected", "false")
            .removeClass("active"),
          t(".postify-tabs .tab-videos .tab-pane").attr("data-active", "false"),
          t(".postify-tabs .tab-descriptions .tab-pane").attr(
            "data-active",
            "false"
          ),
          t(e.target).attr("area-selected", "true").addClass("active"),
          t(t(e.target).data("bs-target")).attr("data-active", "true"),
          t(t(e.target).data("bs-target") + "-desc").attr(
            "data-active",
            "true"
          ),
          t(".postify-tabs .fallback").each(function () {
            t(this).hide(), t(this).removeAttr("src");
          }),
          t(".postify-tabs video").each(function () {
            t(this).get(0) &&
              (t(this).get(0).pause(), (t(this).get(0).currentTime = 0));
          });
        var a = t(t(this).data("bs-target")).find("video").get(0);
        a && a.play(0);
        var i = t(t(this).data("bs-target")).find(".fallback");
        i.length && (t(i).attr("src", t(i).attr("data-src")), t(i).show());
      }),
      (t.fn.isInViewport = function () {
        var e = t(this).offset().top,
          a = e + t(this).outerHeight(),
          i = t(window).scrollTop(),
          s = i + t(window).height();
        return a > i && e < s;
      }),
      t(".postify-video-story").each(function (e, a) {
        void 0 !== window.safari &&
          t(a)
            .find(".postify-video-story__media-wrapper video")
            .each(function () {
              var e = t(this).parent(),
                a = t(this).find("source").eq(1).attr("src"),
                i = t(this).attr("data-poster"),
                s = document.createElement("video");
              (s.preload = "metadata"),
                (s.onloadedmetadata = function () {
                  window.URL.revokeObjectURL(s.src),
                    e.append(
                      '<img class="postify-video-story__media fallback lazyloaded" data-active="false" data-duration="' +
                        s.duration +
                        '" data-src="' +
                        a +
                        '" data-poster="' +
                        i +
                        '">'
                    ),
                    s.remove();
                }),
                (s.src = a),
                t(this).remove();
            }),
          new ScrollMagic.Scene({
            triggerElement: a,
            triggerHook: 0.9,
            offset: 0,
            duration: "200%",
          })
            .addTo(postifyScrollMagicController)
            .on("enter", function (e) {
              t(e.currentTarget.triggerElement())
                .find(".postify-video-story__chapter")
                .eq(0)
                .find(".postify-video-story__trigger")
                .trigger("click"),
                t(e.currentTarget.triggerElement())
                  .find(".postify-video-story__chapters-wrapper .container")
                  .get(0)
                  .scroll(0, 0);
            })
            .on("leave", function (e) {
              clearTimeout(s),
                clearTimeout(i),
                t(a)
                  .find(".postify-video-story__chapter")
                  .each(function (e) {
                    t(this).attr("data-active", "false"),
                      t(this).attr("data-reset", "false"),
                      t(this).attr("data-past", "false");
                  }),
                t(a)
                  .find(".postify-video-story__media")
                  .each(function () {
                    t(this).attr("data-active", "false"),
                      t(this).is("video") && t(this).get(0).pause(),
                      t(this).hasClass("fallback") &&
                        (t(this).hide(),
                        t(this).attr("src", t(this).attr("data-poster")));
                  });
            });
        var i,
          s,
          r,
          o = t(a).find(".postify-video-story__media"),
          d = t(a).find(".postify-video-story__trigger");
        o.each(function (e, a) {
          var i = t(a)
            .closest(".postify-video-story")
            .find(".postify-video-story__chapter");
          a.addEventListener(
            "ended",
            function () {
              r == a &&
                (e <
                t(a).closest(".postify-video-story__media-container").children()
                  .length -
                  1
                  ? i
                      .eq(e + 1)
                      .find(".postify-video-story__trigger")
                      .trigger("click")
                  : (i.eq(e).attr("data-past", "true"),
                    i.eq(e).attr("data-active", "false")));
            },
            !1
          ),
            a.addEventListener("loadedmetadata", function () {
              i.eq(e)
                .find(".postify-video-story__progress")
                .css(
                  "transition-duration",
                  Math.round((a.duration - 0.3 + Number.EPSILON) * 100) / 100 +
                    "s"
                );
            });
        }),
          d.on("click", function () {
            var e = t(this).closest(".postify-video-story"),
              o = t(this).closest(".postify-video-story__chapter"),
              d = o.index();
            e.find(".postify-video-story__chapter").each(function (e) {
              t(this).attr("data-active", "false"),
                t(this).attr("data-reset", "false"),
                e > d
                  ? t(this).attr("data-past", "false")
                  : t(this).attr("data-past", "true");
            }),
              o.attr("data-reset", "true"),
              o.attr("data-past", "false"),
              o.attr("data-active", "true"),
              e.find(".postify-video-story__media").each(function () {
                t(this).attr("data-active", "false"),
                  t(this).is("video") && t(this).get(0).pause(),
                  t(this).hasClass("fallback") &&
                    t(this).attr("src", t(this).attr("data-poster"));
              }),
              e
                .find(".postify-video-story__media")
                .eq(d)
                .attr("data-active", "true"),
              e.find(".postify-video-story__media-wrapper").eq(d).find("video")
                .length
                ? ((e
                    .find(".postify-video-story__media")
                    .eq(d)
                    .get(0).currentTime = 0),
                  e.find(".postify-video-story__media").eq(d).get(0).play(),
                  o
                    .find(".postify-video-story__progress")
                    .css(
                      "transition-duration",
                      Math.round(
                        (e
                          .find(".postify-video-story__media")
                          .eq(d)
                          .attr("data-active", "true")
                          .get(0).duration -
                          0.3 +
                          Number.EPSILON) *
                          100
                      ) /
                        100 +
                        "s"
                    ),
                  (r = e.find(".postify-video-story__media").eq(d).get(0)))
                : t((r = e.find(".postify-video-story__media").eq(d))).hasClass(
                    "fallback"
                  ) &&
                  t(r).attr("data-src") &&
                  (t(r).attr("src", t(r).attr("data-src")),
                  e
                    .find(".postify-video-story__media")
                    .eq(d)
                    .attr("data-active", "true"),
                  o
                    .find(".postify-video-story__progress")
                    .css(
                      "transition-duration",
                      Math.round(
                        (t(r).attr("data-duration") - 0.3 + Number.EPSILON) *
                          100
                      ) /
                        100 +
                        "s"
                    ),
                  t(r).show()),
              clearTimeout(s),
              clearTimeout(i),
              (i = setTimeout(function () {
                o.attr("data-reset", "false");
              }, 600)),
              "image" == o.attr("data-type") &&
                (s = setTimeout(function () {
                  var e = t(r)
                    .closest(".postify-video-story")
                    .find(".postify-video-story__chapter");
                  d <
                  t(r)
                    .closest(".postify-video-story__media-container")
                    .children().length -
                    1
                    ? e
                        .eq(d + 1)
                        .find(".postify-video-story__trigger")
                        .trigger("click")
                    : (e.eq(d).attr("data-past", "true"),
                      e.eq(d).attr("data-active", "false"));
                }, 4500)),
              e
                .find(".postify-video-story__media")
                .eq(d)
                .hasClass("fallback") &&
                (s = setTimeout(function () {
                  var e = t(r)
                    .closest(".postify-video-story")
                    .find(".postify-video-story__chapter");
                  d <
                  t(r)
                    .closest(".postify-video-story__media-container")
                    .children().length -
                    1
                    ? e
                        .eq(d + 1)
                        .find(".postify-video-story__trigger")
                        .trigger("click")
                    : (e.eq(d).attr("data-past", "true"),
                      e.eq(d).attr("data-active", "false"));
                }, 1e3 *
                  parseFloat(
                    e
                      .find(".postify-video-story__media")
                      .eq(d)
                      .attr("data-duration")
                  ))),
              t(a)
                .find(".postify-video-story__chapters-wrapper .container")
                .find(o)
                .isInViewport() &&
                window.matchMedia("(max-width: 1023.98px)").matches &&
                t(a)
                  .find(".postify-video-story__chapters-wrapper .container")
                  .find(o)
                  .get(0)
                  .scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "end",
                  });
          });
      });
  })(jQuery);
