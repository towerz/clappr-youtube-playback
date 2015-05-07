(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Playback = require("playback");
var JST = require("./jst");

var YoutubePlayback = (function (_Playback) {
  function YoutubePlayback(options) {
    _classCallCheck(this, YoutubePlayback);

    _get(Object.getPrototypeOf(YoutubePlayback.prototype), "constructor", this).call(this, options);
    this.options = options;
    this.settings = {
      seekEnabled: true,
      left: ["playpause", "position", "duration"],
      "default": ["seekbar"],
      right: ["fullscreen", "volume", "hd-indicator"]
    };
    Clappr.Mediator.on(Clappr.Events.PLAYER_RESIZE, this.updateSize, this);
  }

  _inherits(YoutubePlayback, _Playback);

  _createClass(YoutubePlayback, {
    name: {
      get: function () {
        return "youtube_playback";
      }
    },
    attributes: {
      get: function () {
        return {
          "data-youtube-playback": "",
          "class": "clappr-youtube-playback",
          id: this.cid
        };
      }
    },
    setupYoutubePlayer: {
      value: function setupYoutubePlayer() {
        if (window.YT && window.YT.Player) {
          this.embedYoutubePlayer();
        } else {
          this.embedYoutubeApiScript();
        }
      }
    },
    embedYoutubeApiScript: {
      value: function embedYoutubeApiScript() {
        var _this = this;

        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("async", "async");
        script.setAttribute("src", "https://www.youtube.com/iframe_api");
        document.body.appendChild(script);
        window.onYouTubeIframeAPIReady = function () {
          return _this.embedYoutubePlayer();
        };
      }
    },
    embedYoutubePlayer: {
      value: function embedYoutubePlayer() {
        var _this = this;

        this.player = new YT.Player("yt" + this.cid, {
          videoId: this.options.src,
          playerVars: {
            controls: 0,
            autoplay: 0,
            disablekb: 1,
            enablejsapi: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            showinfo: 0,
            html5: 1
          },
          events: {
            onReady: function () {
              return _this.ready();
            },
            onStateChange: function (event) {
              return _this.stateChange(event);
            },
            onPlaybackQualityChange: function (event) {
              return _this.qualityChange(event);
            }
          }
        });
      }
    },
    updateSize: {
      value: function updateSize() {
        this.player && this.player.setSize(this.$el.width(), this.$el.height());
      }
    },
    ready: {
      value: function ready() {
        this._ready = true;
        this.trigger(Clappr.Events.PLAYBACK_READY);
      }
    },
    qualityChange: {
      value: function qualityChange(event) {
        this.trigger(Clappr.Events.PLAYBACK_HIGHDEFINITIONUPDATE);
      }
    },
    stateChange: {
      value: function stateChange(event) {
        switch (event.data) {
          case YT.PlayerState.PLAYING:
            this.enableMediaControl();
            this.trigger(Clappr.Events.PLAYBACK_PLAY);
            break;
          case YT.PlayerState.ENDED:
            if (this.options.youtubeShowRelated) {
              this.disableMediaControl();
            } else {
              this.trigger(Clappr.Events.PLAYBACK_ENDED);
            }
            break;
          default:
            break;
        }
      }
    },
    play: {
      value: function play() {
        var _this = this;

        if (this._ready) {
          this._progressTimer = this._progressTimer || setInterval(function () {
            return _this.progress();
          }, 100);
          this._timeupdateTimer = setInterval(function () {
            return _this.timeupdate();
          }, 100);
          this.player.playVideo();
          this.trigger(Clappr.Events.PLAYBACK_PLAY);
          this.trigger(Clappr.Events.PLAYBACK_BUFFERFULL);
        } else {
          this.listenToOnce(this, Clappr.Events.PLAYBACK_READY, this.play);
        }
      }
    },
    pause: {
      value: function pause() {
        clearInterval(this._timeupdateTimer);
        this._timeupdateTimer = null;
        this.player && this.player.pauseVideo();
      }
    },
    seek: {
      value: function seek(position) {
        if (!this.player) {
          return;
        }var duration = this.player.getDuration();
        var time = position * duration / 100;
        this.player.seekTo(time);
      }
    },
    volume: {
      value: function volume(value) {
        this.player && this.player.setVolume(value);
      }
    },
    progress: {
      value: function progress() {
        var buffered = this.player.getDuration() * this.player.getVideoLoadedFraction();
        this.trigger(Clappr.Events.PLAYBACK_PROGRESS, 0, buffered, this.player.getDuration());
      }
    },
    timeupdate: {
      value: function timeupdate() {
        this.trigger(Clappr.Events.PLAYBACK_TIMEUPDATE, this.player.getCurrentTime(), this.player.getDuration());
      }
    },
    isPlaying: {
      value: function isPlaying() {
        return this.player && this._timeupdateTimer && this.player.getPlayerState() == YT.PlayerState.PLAYING;
      }
    },
    isHighDefinitionInUse: {
      value: function isHighDefinitionInUse() {
        return this.player && !!this.player.getPlaybackQuality().match(/^hd\d+/);
      }
    },
    getDuration: {
      value: function getDuration() {
        var duration = 0;
        if (this.player) {
          duration = this.player.getDuration();
        }
        return duration;
      }
    },
    disableMediaControl: {
      value: function disableMediaControl() {
        this.$el.css({ "pointer-events": "auto" });
        this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_DISABLE);
      }
    },
    enableMediaControl: {
      value: function enableMediaControl() {
        this.$el.css({ "pointer-events": "none" });
        this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_ENABLE);
      }
    },
    render: {
      value: function render() {
        this.$el.html(JST[this.name]({ id: "yt" + this.cid }));
        var style = $("<style>").html(JST.CSS[this.name]);
        this.$el.append(style);
        this.setupYoutubePlayer();
        return this;
      }
    }
  });

  return YoutubePlayback;
})(Playback);

YoutubePlayback.canPlay = function (source) {
  return true;
};

module.exports = window.YoutubePlayback = YoutubePlayback;

},{"./jst":2,"playback":"playback"}],2:[function(require,module,exports){
//This file is generated by bin/hook.js
"use strict";

var template = require("template");
module.exports = {

  youtube_playback: template("<div id=\"<%=id%>\"></div>"),

  CSS: {

    youtube_playback: ".clappr-youtube-playback[data-youtube-playback]{position:absolute;height:100%;width:100%;display:block;pointer-events:none}" }
};

},{"template":"template"}]},{},[1]);
