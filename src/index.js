import {Playback, Styler, template} from 'Clappr'

import playbackStyle from './public/style.css'
import playbackHtml from './public/youtube.html'

class YoutubePlayback extends Playback {
  get name() { return 'youtube_playback' }

  get template() { return template(playbackHtml) }

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
    this.settings = {
      seekEnabled: true,
      left: ['playpause', 'position', 'duration'],
      default: ['seekbar'],
      right:['fullscreen','volume', 'hd-indicator']
    }
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
    var playerVars = {
      controls: 0,
      autoplay: 0,
      disablekb: 1,
      enablejsapi: 1,
      iv_load_policy: 3,
      modestbranding: 1,
      showinfo: 0,
      html5: 1
    }
    if (this.options.youtubePlaylist) {
      playerVars.listType = 'playlist'
      playerVars.list = this.options.youtubePlaylist
    }
    this.player = new YT.Player(`yt${this.cid}`, {
      videoId: this.options.src,
      playerVars: playerVars,
      events: {
        onReady: () => this.ready(),
        onStateChange: (event) => this.stateChange(event),
        onPlaybackQualityChange: (event) => this.qualityChange(event)
      }
    })
  }

  updateSize() {
    this.player && this.player.setSize(this.$el.width(), this.$el.height())
  }

  ready() {
    this._ready = true
    this.trigger(Clappr.Events.PLAYBACK_READY)
  }

  qualityChange(event) {
    this.trigger(Clappr.Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.isHighDefinitionInUse())
  }

  stateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.enableMediaControl()
        this.trigger(Clappr.Events.PLAYBACK_PLAY)
        break
      case YT.PlayerState.ENDED:
        if (this.options.youtubeShowRelated) {
          this.disableMediaControl()
        } else {
          this.trigger(Clappr.Events.PLAYBACK_ENDED)
        }
        break
      default: break
    }
  }

  play() {
    if (this._ready) {
      this._progressTimer = this._progressTimer || setInterval(() => this.progress(), 100)
      this._timeupdateTimer = setInterval(() => this.timeupdate(), 100)
      this.player.playVideo()
      this.trigger(Clappr.Events.PLAYBACK_PLAY)
      this.trigger(Clappr.Events.PLAYBACK_BUFFERFULL)
    } else {
      this.listenToOnce(this, Clappr.Events.PLAYBACK_READY, this.play)
    }
  }

  pause() {
    clearInterval(this._timeupdateTimer)
    this._timeupdateTimer = null
    this.player && this.player.pauseVideo()
  }

  seek(position) {
    if (!this.player) return
    var duration = this.player.getDuration()
    var time = position * duration / 100
    this.player.seekTo(time)
  }

  volume(value) {
    this.player && this.player.setVolume(value)
  }

  progress() {
    var buffered = this.player.getDuration() * this.player.getVideoLoadedFraction()
    this.trigger(Clappr.Events.PLAYBACK_PROGRESS, {start: 0, current: buffered, total: this.player.getDuration()})
  }

  timeupdate() {
    this.trigger(Clappr.Events.PLAYBACK_TIMEUPDATE, {current: this.player.getCurrentTime(), total: this.player.getDuration()})
  }

  isPlaying() {
    return this.player && this._timeupdateTimer && this.player.getPlayerState() == YT.PlayerState.PLAYING
  }

  isHighDefinitionInUse() {
    return this.player && !!this.player.getPlaybackQuality().match(/^hd\d+/)
  }

  getDuration() {
    var duration = 0
    if (this.player) {
      duration = this.player.getDuration()
    }
    return duration
  }

  disableMediaControl() {
    this.$el.css({'pointer-events': 'auto'})
    this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_DISABLE)
  }

  enableMediaControl() {
    this.$el.css({'pointer-events': 'none'})
    this.trigger(Clappr.Events.PLAYBACK_MEDIACONTROL_ENABLE)
  }

  render() {
    this.$el.html(this.template({id: `yt${this.cid}`}))
    var style = Styler.getStyleFor(playbackStyle, {baseUrl: this.options.baseUrl})
    this.$el.append(style)
    this.setupYoutubePlayer()
    return this;
  }
}

YoutubePlayback.canPlay = function(source) {
  return true;
};


module.exports = window.YoutubePlayback = YoutubePlayback;
