if (
  ("/" === window.location.pathname ||
    "/index.html" === window.location.pathname) &&
  window.innerWidth > 1024
) {
  let e = document.getElementById("header");
  console.log("girdi", e),
    (e.style.opacity = 1),
    document.addEventListener("scroll", () => {
      e.style.opacity = 1;
    }),
    setTimeout(() => {
      e.style.opacity = 1;
    }, 4e3);
} else header.style.opacity = 1;
document.querySelector("body").classList.add("loaded"),
  (function (e) {
    "use strict";
    r || (r = !0);
    var t,
      o,
      r = !1;
    e(document).ready(function () {
      document.querySelector("body").classList.add("ready");
    }),
      window.addEventListener("scroll", function (t) {
        window.pageYOffset >= 81
          ? (e("#header").hasClass("top") &&
              window.matchMedia("(min-width: 1024px)").matches &&
              e("body").hasClass("loaded")) ||
            e("#header").addClass("sticky")
          : e("#header").removeClass("sticky");
      }),
      e(".watch-link,.pulse").click(function (o) {
        o.preventDefault(), (t = e(this).data("src"));
      }),
      e("#videoModal").on("shown.bs.modal", function (r) {
        e("#video").attr(
          "src",
          t + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
        ),
          (o = null),
          (o = new Vimeo.Player(document.querySelector("#video"))).play();
      }),
      e("#videoModal").on("hide.bs.modal", function (o) {
        e("#video").attr("src", t);
      });
    let i = document.getElementById("mobileMenu");
    if (
      (i.addEventListener("show.bs.modal", function () {
        e(".modal").not("#mobileMenu").modal("hide"),
          e("body").addClass("menu-open");
      }),
      i.addEventListener("hidden.bs.modal", function () {
        e("body").removeClass("menu-open");
      }),
      e(document).ready(function () {
        document.addEventListener(
          "wpcf7mailsent",
          function (t) {
            e("#" + t.detail.unitTag)
              .find(".result-wrapper")
              .show();
          },
          !1
        );
      }),
      1 === e(".reading-progress").length)
    ) {
      var s = e(".reading-progress"),
        n = s.parent(),
        a = function () {
          var t = e(window).height(),
            o = n.height(),
            r = n.offset().top,
            i = o - t,
            a = e(window).scrollTop() - r;
          i < 1 && (i = 1),
            a < 0 ? (a = 0) : a > i && (a = i),
            s.children("div").css("width", "" + (100 * a) / i + "%");
        };
      a(),
        e(document).on("scroll resize", function () {
          "function" == typeof window.requestAnimationFrame
            ? requestAnimationFrame(a)
            : a();
        });
    }
    function d(e, t, o) {
      if (o) {
        var r = new Date();
        r.setTime(r.getTime() + 864e5 * o);
        var i = "; expires=" + r.toGMTString();
      } else var i = "";
      document.cookie = e + "=" + t + i + "; path=/";
    }
    function u(e) {
      for (
        var t = e + "=", o = document.cookie.split(";"), r = 0;
        r < o.length;
        r++
      ) {
        for (var i = o[r]; " " == i.charAt(0); ) i = i.substring(1, i.length);
        if (0 == i.indexOf(t)) return i.substring(t.length, i.length);
      }
      return null;
    }
    e(document).ready(function () {
      var t = u("postify_ref") || "",
        o = u("postify_utm_source") || "",
        r = u("postify_utm_source_id") || "";
      let i = (function e(t) {
        for (
          var o = {}, r = ("?" === t[0] ? t.substr(1) : t).split("&"), i = 0;
          i < r.length;
          i++
        ) {
          var s = r[i].split("=");
          o[decodeURIComponent(s[0])] = decodeURIComponent(s[1] || "");
        }
        return o;
      })(window.location.search);
      if (t || (i.hasOwnProperty("ref") && i.ref)) {
        i.hasOwnProperty("ref") &&
          i.ref &&
          (d("postify_ref", i.ref, 30),
          (t = i.ref),
          (document.cookie = "postify_utm_source=; Max-Age=-99999999;"),
          (document.cookie = "postify_utm_source_id=; Max-Age=-99999999;"),
          (o = r = ""),
          i.hasOwnProperty("utm_source") &&
            i.utm_source &&
            (d("postify_utm_source", i.utm_source, 30), (o = i.utm_source)),
          i.hasOwnProperty("utm_source_id") &&
            i.utm_source_id &&
            (d("postify_utm_source_id", i.utm_source_id, 30),
            (r = i.utm_source_id)));
        var s = "ref=" + t;
        o && (s += "&utm_source=" + o),
          r && (s += "&utm_source_id=" + r),
          e('a[href="https://social.postify.app/auth/register"').each(
            function () {
              e(this).attr("href", e(this).attr("href") + "?" + s);
            }
          );
      }
    });
  })(jQuery);