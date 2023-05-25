(function ($) {
  "use strict";
  firstInteraction();

  if(window.location.pathname === "/")  {
    $("header").css('opacity', 0);

    setTimeout(() => {
      $("header").css('opacity', 1);
    }, 4000);
  }

  var userInteracted = false;
  function firstInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      if (window.pageYOffset >= 1) {
        $("#header").addClass("shifted");
        setTimeout(function () {
          $("#header").addClass("sticky");
          document.querySelector("body").classList.add("loaded");
        }, 50);
      } else {
        document.querySelector("body").classList.add("loaded");
      }
      setTimeout(function () {
        $("#header").removeClass("shifted");
      }, 100);
    }
  }
  $(document).ready(function () {
    document.querySelector("body").classList.add("ready");
  });
  window.addEventListener("scroll", function (e) {
    if (window.pageYOffset >= 1) {
      if (
        !(
          $("#header").hasClass("top") &&
          window.matchMedia("(min-width: 1024px)").matches &&
          $("body").hasClass("loaded")
        )
      ) {
        $("#header").addClass("sticky");
      }
    } else {
      $("#header").removeClass("sticky");
    }
  });
  var $videoSrc;
  var $player;
  $(".watch-link,.pulse").click(function (e) {
    e.preventDefault();
    $videoSrc = $(this).data("src");
  });
  $("#videoModal").on("shown.bs.modal", function (e) {
    $("#video").attr(
      "src",
      $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
    );
    $player = null;
    $player = new Vimeo.Player(document.querySelector("#video"));
    $player.play();
  });
  $("#videoModal").on("hide.bs.modal", function (e) {
    $("#video").attr("src", $videoSrc);
  });
  const mobile = document.getElementById("mobileMenu");
  mobile.addEventListener("show.bs.modal", function () {
    $(".modal").not("#mobileMenu").modal("hide");
    $("body").addClass("menu-open");
  });
  mobile.addEventListener("hidden.bs.modal", function () {
    $("body").removeClass("menu-open");
  });
  $(document).ready(function () {
    document.addEventListener(
      "wpcf7mailsent",
      function (event) {
        $("#" + event.detail.unitTag)
          .find(".result-wrapper")
          .show();
      },
      false
    );
  });
  if (1 === $(".reading-progress").length) {
    var $progress = $(".reading-progress");
    var $container = $progress.parent();
    var progress_animate = function () {
      var win_height = $(window).height();
      var container_height = $container.height();
      var container_top = $container.offset().top;
      var max = container_height - win_height;
      var pos = $(window).scrollTop() - container_top;
      if (max < 1) {
        max = 1;
      }
      if (pos < 0) {
        pos = 0;
      } else if (pos > max) {
        pos = max;
      }
      $progress.children("div").css("width", "" + (100.0 * pos) / max + "%");
    };
    progress_animate();
    $(document).on("scroll resize", function () {
      if ("function" === typeof window.requestAnimationFrame) {
        requestAnimationFrame(progress_animate);
      } else {
        progress_animate();
      }
    });
  }
  function responaCreateCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  function responaReadCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function responaParseQuery(queryString) {
    var query = {};
    var pairs = (
      queryString[0] === "?" ? queryString.substr(1) : queryString
    ).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }
  $(document).ready(function () {
    var ref = responaReadCookie("respona_ref") || "";
    var utm_source = responaReadCookie("respona_utm_source") || "";
    var utm_source_id = responaReadCookie("respona_utm_source_id") || "";
    const queries = responaParseQuery(window.location.search);
    if (ref || (queries.hasOwnProperty("ref") && queries.ref)) {
      if (queries.hasOwnProperty("ref") && queries.ref) {
        responaCreateCookie("respona_ref", queries.ref, 30);
        ref = queries.ref;
        document.cookie = "respona_utm_source" + "=; Max-Age=-99999999;";
        document.cookie = "respona_utm_source_id" + "=; Max-Age=-99999999;";
        utm_source = utm_source_id = "";
        if (queries.hasOwnProperty("utm_source") && queries.utm_source) {
          responaCreateCookie("respona_utm_source", queries.utm_source, 30);
          utm_source = queries.utm_source;
        }
        if (queries.hasOwnProperty("utm_source_id") && queries.utm_source_id) {
          responaCreateCookie(
            "respona_utm_source_id",
            queries.utm_source_id,
            30
          );
          utm_source_id = queries.utm_source_id;
        }
      }
      var params = "ref=" + ref;
      if (utm_source) params += "&utm_source=" + utm_source;
      if (utm_source_id) params += "&utm_source_id=" + utm_source_id;
      $('a[href="https://social.postify.app/auth/register"').each(function () {
        $(this).attr("href", $(this).attr("href") + "?" + params);
      });
    }
  });
})(jQuery);

var dropdown = document.querySelectorAll('.dropdown');

dropdown.forEach((a) => a.addEventListener('mouseenter', (e) => {
  e.target.querySelector('.dropdown-menu').classList.add('show');
}))


dropdown.forEach((a) => a.addEventListener('mouseleave', (e) => {
  e.target.querySelector('.dropdown-menu').classList.remove('show');
}))


var customDropdown = document.querySelectorAll('.custom-dropdown');

customDropdown.forEach((a) => a.addEventListener('mouseenter', (e) => {
  e.target.querySelector('.custom-dropdown-menu').classList.add('show');
}));


customDropdown.forEach((a) => a.addEventListener('mouseleave', (e) => {
  e.target.querySelector('.custom-dropdown-menu').classList.remove('show');
}));
const videoContainers =
document.getElementsByClassName("video-container");

for (let i = 0; i < videoContainers.length; i++) {
const container = videoContainers[i];
const video = container.querySelector("video"); // Video elemanını bul

container.addEventListener("mouseover", () => {
  video.currentTime = 0;
  video.play();
  video.loop = true;
});

container.addEventListener("mouseleave", () => {
  video.pause();
});
}