var Playback = require('playback')
var JST = require('./jst')

class YoutubePlayback extends Playback {
  get name() { return 'youtube_playback' }

  get attributes() {
    return {
      'data-youtube-playback': '',
      class: 'clappr-youtube-playback',
      id: this.cid
    }
  }

  constructor(options) {
    super(options)
    this.options = options
    this.settings = { left: ['playpause'], default: ['seekbar'], right:['fullscreen','volume'] }
    Clappr.Mediator.on(Clappr.Events.PLAYER_RESIZE, this.updateSize, this)
  }

  setupYoutubePlayer() {
    if (window.YT && window.YT.Player) {
      this.embedYoutubePlayer()
    } else {
      this.embedYoutubeApiScript()
    }
  }

  embedYoutubeApiScript() {
      var script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('async', 'async')
      script.setAttribute('src', 'https://www.youtube.com/iframe_api')
      document.body.appendChild(script)
      window.onYouTubeIframeAPIReady = () => this.embedYoutubePlayer()
  }

  embedYoutubePlayer() {
    this.player = new YT.Player(`yt${this.cid}`, {
      videoId: this.options.src,
      playerVars: {
        controls: 0,
        autoplay: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        showinfo: 0
      },
      events: {
        onReady: () => this.ready(),
        onStateChange: (event) => this.stateChange(event),
      }
    })
  }

  ready() {
    console.log('ready')
    this._ready = true
    this.trigger(Clappr.Events.PLAYBACK_READY)
  }

  stateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.trigger(Clappr.Events.PLAYBACK_PLAY)
        break
      case YT.PlayerState.PAUSED:
      this.trigger(Clappr.Events.PLAYBACK_SETTINGSUPDATE)
        break
      default: break
    }
  }

  play() {
    if (this._ready) {
      this.player.playVideo()
      this.trigger(Clappr.Events.PLAYBACK_PLAY)
      this.trigger(Clappr.Events.PLAYBACK_BUFFERFULL)
    } else {
      this.listenToOnce(this, Clappr.Events.PLAYBACK_READY, this.play)
    }
  }

  pause() {
    this.player && this.player.pauseVideo()
  }

  isPlaying() {
    return this.player && this.player.getPlayerState() == YT.PlayerState.PLAYING
  }

  render() {
    this.$el.html(JST[this.name]({id: `yt${this.cid}`}))
    var style = $('<style>').html(JST.CSS[this.name])
    this.$el.append(style)
    this.setupYoutubePlayer()
    return this;
  }
}

YoutubePlayback.canPlay = function(source) {
  return true;
};


module.exports = window.YoutubePlayback = YoutubePlayback;
