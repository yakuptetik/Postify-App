var postifyScrollMagicController = new ScrollMagic.Controller();
window.URL = window.URL || window.webkitURL;
(function ($) {
  "use strict";
  if (window.safari !== undefined) {
    $(".postify-tabs video").each(function () {
      var self = $(this).parent();
      $(this)
        .parent()
        .append(
          '<img class="poster fallback lazyloaded" data-src="' +
            $(this).find("source").eq(1).attr("src") +
            '">'
        );
      $(this).remove();
    });
  }
  $(".postify-tabs video").on("play", function () {
    this.currentTime = 0;
  });
  const tabs = document.querySelector(".postify-tabs");
  new ScrollMagic.Scene({
    triggerElement: ".postify-tabs",
    triggerHook: 0.9,
    offset: 0,
    duration: "200%",
  })
    .addTo(postifyScrollMagicController)
    .on("enter", function (e) {
      $(e.currentTarget.triggerElement())
        .find(".nav-item")
        .eq(0)
        .find("button")
        .trigger("click");
    })
    .on("leave", function (e) {
      $(".postify-tabs video").each(function () {
        if ($(this).get(0)) {
          $(this).get(0).pause();
          $(this).get(0).currentTime = 0;
        }
      });
    });
  $(".postify-tabs button").on("click", function (e) {
    e.preventDefault();
    $(".postify-tabs .nav-link")
      .attr("area-selected", "false")
      .removeClass("active");
    $(".postify-tabs .tab-videos .tab-pane").attr("data-active", "false");
    $(".postify-tabs .tab-descriptions .tab-pane").attr("data-active", "false");
    $(e.target).attr("area-selected", "true").addClass("active");
    $($(e.target).data("bs-target")).attr("data-active", "true");
    $($(e.target).data("bs-target") + "-desc").attr("data-active", "true");
    $(".postify-tabs .fallback").each(function () {
      $(this).hide();
      $(this).removeAttr("src");
    });
    $(".postify-tabs video").each(function () {
      if ($(this).get(0)) {
        $(this).get(0).pause();
        $(this).get(0).currentTime = 0;
      }
    });
    var video = $($(this).data("bs-target")).find("video").get(0);
    if (video) video.play(0);
    var fallback = $($(this).data("bs-target")).find(".fallback");
    if (fallback.length) {
      $(fallback).attr("src", $(fallback).attr("data-src"));
      $(fallback).show();
    }
  });
  $.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
  $(".postify-video-story").each(function (i, story) {
    if (window.safari !== undefined) {
      $(story)
        .find(".postify-video-story__media-wrapper video")
        .each(function () {
          var wrapper = $(this).parent();
          var url = $(this).find("source").eq(1).attr("src");
          var poster = $(this).attr("data-poster");
          var video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            wrapper.append(
              '<img class="postify-video-story__media fallback lazyloaded" data-active="false" data-duration="' +
                video.duration +
                '" data-src="' +
                url +
                '" data-poster="' +
                poster +
                '">'
            );
            video.remove();
          };
          video.src = url;
          $(this).remove();
        });
    }
    new ScrollMagic.Scene({
      triggerElement: story,
      triggerHook: 0.9,
      offset: 0,
      duration: "200%",
    })
      .addTo(postifyScrollMagicController)
      .on("enter", function (e) {
        $(e.currentTarget.triggerElement())
          .find(".postify-video-story__chapter")
          .eq(0)
          .find(".postify-video-story__trigger")
          .trigger("click");
        $(e.currentTarget.triggerElement())
          .find(".postify-video-story__chapters-wrapper .container")
          .get(0)
          .scroll(0, 0);
      })
      .on("leave", function (e) {
        clearTimeout(timeoutDefault);
        clearTimeout(timeout);
        $(story)
          .find(".postify-video-story__chapter")
          .each(function (index) {
            $(this).attr("data-active", "false");
            $(this).attr("data-reset", "false");
            $(this).attr("data-past", "false");
          });
        $(story)
          .find(".postify-video-story__media")
          .each(function () {
            $(this).attr("data-active", "false");
            if ($(this).is("video")) $(this).get(0).pause();
            if ($(this).hasClass("fallback")) {
              $(this).hide();
              $(this).attr("src", $(this).attr("data-poster"));
            }
          });
      });
    var timeout,
      timeoutDefault,
      currentVideo,
      media = $(story).find(".postify-video-story__media"),
      trigger = $(story).find(".postify-video-story__trigger");
    media.each(function (index, video) {
      var chapters = $(video)
        .closest(".postify-video-story")
        .find(".postify-video-story__chapter");
      video.addEventListener(
        "ended",
        function () {
          if (currentVideo != video) return;
          if (
            index <
            $(video).closest(".postify-video-story__media-container").children()
              .length -
              1
          ) {
            chapters
              .eq(index + 1)
              .find(".postify-video-story__trigger")
              .trigger("click");
          } else {
            chapters.eq(index).attr("data-past", "true");
            chapters.eq(index).attr("data-active", "false");
          }
        },
        false
      );
      video.addEventListener("loadedmetadata", function () {
        chapters
          .eq(index)
          .find(".postify-video-story__progress")
          .css(
            "transition-duration",
            Math.round((video.duration - 0.3 + Number.EPSILON) * 100) / 100 +
              "s"
          );
      });
    });
    trigger.on("click", function () {
      var container = $(this).closest(".postify-video-story"),
        chapter = $(this).closest(".postify-video-story__chapter"),
        currentIndex = chapter.index();
      container.find(".postify-video-story__chapter").each(function (index) {
        $(this).attr("data-active", "false");
        $(this).attr("data-reset", "false");
        index > currentIndex
          ? $(this).attr("data-past", "false")
          : $(this).attr("data-past", "true");
      });
      chapter.attr("data-reset", "true");
      chapter.attr("data-past", "false");
      chapter.attr("data-active", "true");
      container.find(".postify-video-story__media").each(function () {
        $(this).attr("data-active", "false");
        if ($(this).is("video")) $(this).get(0).pause();
        if ($(this).hasClass("fallback")) {
          $(this).attr("src", $(this).attr("data-poster"));
        }
      });
      container
        .find(".postify-video-story__media")
        .eq(currentIndex)
        .attr("data-active", "true");
      if (
        container
          .find(".postify-video-story__media-wrapper")
          .eq(currentIndex)
          .find("video").length
      ) {
        container
          .find(".postify-video-story__media")
          .eq(currentIndex)
          .get(0).currentTime = 0;
        container
          .find(".postify-video-story__media")
          .eq(currentIndex)
          .get(0)
          .play();
        chapter
          .find(".postify-video-story__progress")
          .css(
            "transition-duration",
            Math.round(
              (container
                .find(".postify-video-story__media")
                .eq(currentIndex)
                .attr("data-active", "true")
                .get(0).duration -
                0.3 +
                Number.EPSILON) *
                100
            ) /
              100 +
              "s"
          );
        currentVideo = container
          .find(".postify-video-story__media")
          .eq(currentIndex)
          .get(0);
      } else {
        currentVideo = container
          .find(".postify-video-story__media")
          .eq(currentIndex);
        if (
          $(currentVideo).hasClass("fallback") &&
          $(currentVideo).attr("data-src")
        ) {
          $(currentVideo).attr("src", $(currentVideo).attr("data-src"));
          container
            .find(".postify-video-story__media")
            .eq(currentIndex)
            .attr("data-active", "true");
          chapter
            .find(".postify-video-story__progress")
            .css(
              "transition-duration",
              Math.round(
                ($(currentVideo).attr("data-duration") - 0.3 + Number.EPSILON) *
                  100
              ) /
                100 +
                "s"
            );
          $(currentVideo).show();
        }
      }
      clearTimeout(timeoutDefault);
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        chapter.attr("data-reset", "false");
      }, 600);
      if (chapter.attr("data-type") == "image") {
        timeoutDefault = setTimeout(function () {
          var chapters = $(currentVideo)
            .closest(".postify-video-story")
            .find(".postify-video-story__chapter");
          if (
            currentIndex <
            $(currentVideo)
              .closest(".postify-video-story__media-container")
              .children().length -
              1
          ) {
            chapters
              .eq(currentIndex + 1)
              .find(".postify-video-story__trigger")
              .trigger("click");
          } else {
            chapters.eq(currentIndex).attr("data-past", "true");
            chapters.eq(currentIndex).attr("data-active", "false");
          }
        }, 4500);
      }
      if (
        container
          .find(".postify-video-story__media")
          .eq(currentIndex)
          .hasClass("fallback")
      ) {
        timeoutDefault = setTimeout(function () {
          var chapters = $(currentVideo)
            .closest(".postify-video-story")
            .find(".postify-video-story__chapter");
          if (
            currentIndex <
            $(currentVideo)
              .closest(".postify-video-story__media-container")
              .children().length -
              1
          ) {
            chapters
              .eq(currentIndex + 1)
              .find(".postify-video-story__trigger")
              .trigger("click");
          } else {
            chapters.eq(currentIndex).attr("data-past", "true");
            chapters.eq(currentIndex).attr("data-active", "false");
          }
        }, parseFloat(
          container
            .find(".postify-video-story__media")
            .eq(currentIndex)
            .attr("data-duration")
        ) * 1000);
      }
      if (
        $(story)
          .find(".postify-video-story__chapters-wrapper .container")
          .find(chapter)
          .isInViewport() &&
        window.matchMedia("(max-width: 1023.98px)").matches
      ) {
        $(story)
          .find(".postify-video-story__chapters-wrapper .container")
          .find(chapter)
          .get(0)
          .scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "end",
          });
      }
    });
  });
})(jQuery);
