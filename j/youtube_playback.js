(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["Clappr"], factory);
	else if(typeof exports === 'object')
		exports["ClapprYoutubePlayback"] = factory(require("Clappr"));
	else
		root["ClapprYoutubePlayback"] = factory(root["Clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "<%=baseUrl%>/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Clappr = __webpack_require__(1);

	var _publicStyleCss = __webpack_require__(2);

	var _publicStyleCss2 = _interopRequireDefault(_publicStyleCss);

	var _publicYoutubeHtml = __webpack_require__(4);

	var _publicYoutubeHtml2 = _interopRequireDefault(_publicYoutubeHtml);

	var YoutubePlayback = (function (_Playback) {
	  _inherits(YoutubePlayback, _Playback);

	  _createClass(YoutubePlayback, [{
	    key: 'name',
	    get: function get() {
	      return 'youtube_playback';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return (0, _Clappr.template)(_publicYoutubeHtml2['default']);
	    }
	  }, {
	    key: 'attributes',
	    get: function get() {
	      return {
	        'data-youtube-playback': '',
	        'class': 'clappr-youtube-playback',
	        id: this.cid
	      };
	    }
	  }]);

	  function YoutubePlayback(options) {
	    _classCallCheck(this, YoutubePlayback);

	    _get(Object.getPrototypeOf(YoutubePlayback.prototype), 'constructor', this).call(this, options);
	    this.options = options;
	    this.settings = {
	      seekEnabled: true,
	      left: ['playpause', 'position', 'duration'],
	      'default': ['seekbar'],
	      right: ['fullscreen', 'volume', 'hd-indicator']
	    };
	    Clappr.Mediator.on(Clappr.Events.PLAYER_RESIZE, this.updateSize, this);
	  }

	  _createClass(YoutubePlayback, [{
	    key: 'setupYoutubePlayer',
	    value: function setupYoutubePlayer() {
	      if (window.YT && window.YT.Player) {
	        this.embedYoutubePlayer();
	      } else {
	        this.embedYoutubeApiScript();
	      }
	    }
	  }, {
	    key: 'embedYoutubeApiScript',
	    value: function embedYoutubeApiScript() {
	      var _this = this;

	      var script = document.createElement('script');
	      script.setAttribute('type', 'text/javascript');
	      script.setAttribute('async', 'async');
	      script.setAttribute('src', 'https://www.youtube.com/iframe_api');
	      document.body.appendChild(script);
	      window.onYouTubeIframeAPIReady = function () {
	        return _this.embedYoutubePlayer();
	      };
	    }
	  }, {
	    key: 'embedYoutubePlayer',
	    value: function embedYoutubePlayer() {
	      var _this2 = this;

	      var playerVars = {
	        controls: 0,
	        autoplay: 0,
	        disablekb: 1,
	        enablejsapi: 1,
	        iv_load_policy: 3,
	        modestbranding: 1,
	        showinfo: 0,
	        html5: 1
	      };
	      if (this.options.youtubePlaylist) {
	        playerVars.listType = 'playlist';
	        playerVars.list = this.options.youtubePlaylist;
	      }
	      this.player = new YT.Player('yt' + this.cid, {
	        videoId: this.options.src,
	        playerVars: playerVars,
	        events: {
	          onReady: function onReady() {
	            return _this2.ready();
	          },
	          onStateChange: function onStateChange(event) {
	            return _this2.stateChange(event);
	          },
	          onPlaybackQualityChange: function onPlaybackQualityChange(event) {
	            return _this2.qualityChange(event);
	          }
	        }
	      });
	    }
	  }, {
	    key: 'updateSize',
	    value: function updateSize() {
	      this.player && this.player.setSize(this.$el.width(), this.$el.height());
	    }
	  }, {
	    key: 'ready',
	    value: function ready() {
	      this._ready = true;
	      this.trigger(Clappr.Events.PLAYBACK_READY);
	    }
	  }, {
	    key: 'qualityChange',
	    value: function qualityChange(event) {
	      this.trigger(Clappr.Events.PLAYBACK_HIGHDEFINITIONUPDATE);
	    }
	  }, {
	    key: 'stateChange',
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
	  }, {
	    key: 'play',
	    value: function play() {
	      var _this3 = this;

	      if (this._ready) {
	        this._progressTimer = this._progressTimer || setInterval(function () {
	          return _this3.progress();
	        }, 100);
	        this._timeupdateTimer = setInterval(function () {
	          return _this3.timeupdate();
	        }, 100);
	        this.player.playVideo();
	        this.trigger(Clappr.Events.PLAYBACK_PLAY);
	        this.trigger(Clappr.Events.PLAYBACK_BUFFERFULL);
	      } else {
	        this.listenToOnce(this, Clappr.Events.PLAYBACK_READY, this.play);
	      }
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      clearInterval(this._timeupdateTimer);
	      this._timeupdateTimer = null;
	      this.player && this.player.pauseVideo();
	    }
	  }, {
	    key: 'seek',
	    value: function seek(position) {
	      if (!this.player) return;
	      var duration = this.player.getDuration();
	      var time = position * duration / 100;
	      this.player.seekTo(time);
	    }
	  }, {
	    key: 'volume',
	    value: function volume(value) {
	      this.player && this.player.setVolume(value);
	    }
	  }, {
	    key: 'progress',
	    value: function progress() {
	      var buffered = this.player.getDuration() * this.player.getVideoLoadedFraction();
	      this.trigger(Clappr.Events.PLAYBACK_PROGRESS, 0, buffered, this.player.getDuration());
	    }
	  }, {
	    key: 'timeupdate',
	    value: function timeupdate() {
	      this.trigger(Clappr.Events.PLAYBACK_TIMEUPDATE, this.player.getCurrentTime(), this.player.getDuration());
	    }
	  }, {
	    key: 'isPlaying',
	    value: function isPlaying() {
	      return this.player && this._timeupdateTimer && this.player.getPlayerState() == YT.PlayerState.PLAYING;
	    }
	  }, {
	    key: 'isHighDefinitionInUse',
	    value: function isHighDefinitionInUse() {
	      return this.player && !!this.player.getPlaybackQuality().match(/^hd\d+/);
	    }
	  }, {
	    key: 'getDuration',
	    value: function getDuration() {
	      var duration = 0;
	      if (this.player) {
	        duration = this.player.getDuration();
	      }
	      return duration;
	    }
	  }, {
	    key: 'disableMediaControl',
	    value: function disableMediaControl() {
	      this.$el.css({ 'pointer-events': 'auto' });
	      this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_DISABLE);
	    }
	  }, {
	    key: 'enableMediaControl',
	    value: function enableMediaControl() {
	      this.$el.css({ 'pointer-events': 'none' });
	      this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_ENABLE);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.$el.html(this.template({ id: 'yt' + this.cid }));
	      var style = _Clappr.Styler.getStyleFor(_publicStyleCss2['default'], { baseUrl: this.options.baseUrl });
	      this.$el.append(style);
	      this.setupYoutubePlayer();
	      return this;
	    }
	  }]);

	  return YoutubePlayback;
	})(_Clappr.Playback);

	YoutubePlayback.canPlay = function (source) {
	  return true;
	};

	module.exports = window.YoutubePlayback = YoutubePlayback;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".clappr-youtube-playback[data-youtube-playback] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  display: block;\n  pointer-events: none; }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<div id=\"<%=id%>\"></div>";

/***/ }
/******/ ])
});
;