import {Events, Playback, Mediator, Styler, template, $} from 'Clappr'

import playbackStyle from './public/style.css'
import playbackHtml from './public/youtube.html'

export default class YoutubePlayback extends Playback {
  get name() { return 'youtube_playback' }

  get template() { return template(playbackHtml) }

  get attributes() {
    return {
      'data-youtube-playback': '',
      class: 'clappr-youtube-playback',
      id: this.cid
    }
  }

  get ended() { return false }
  get buffering() { return this.player && this.player.getPlayerState() === YT.PlayerState.BUFFERING }
  get isReady() { return this._ready }

  constructor(options) {
    super(options)
    this.settings = {
      changeCount: 0,
      seekEnabled: true,
      left: ['playpause', 'position', 'duration'],
      default: ['seekbar'],
      right:['fullscreen','volume', 'hd-indicator']
    }
    Mediator.on(Events.PLAYER_RESIZE, this.updateSize, this)
    this.embedYoutubeApiScript()
  }

  setupYoutubePlayer() {
    if (window.YT && window.YT.Player) {
      this.embedYoutubePlayer()
    } else {
      this.once(Events.PLAYBACK_READY, () => this.embedYoutubePlayer())
    }
  }

  embedYoutubeApiScript() {
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('async', 'async')
    script.setAttribute('src', 'https://www.youtube.com/iframe_api')
    document.body.appendChild(script)
    window.onYouTubeIframeAPIReady = () => this.ready()
  }

  embedYoutubePlayer() {
    let playerVars = {
      controls: 0,
      autoplay: 1,
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
    const width = (this.$el.width() === 0 ? this.options.width : this.$el.width())
    const height = (this.$el.width() === 0 ? this.options.height : this.$el.height())
    this.player && this.player.setSize(width, height)
  }

  ready() {
    this._ready = true
    $(window).resize(() => {
      setTimeout(this.updateSize(), 500)
    })
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
      setTimeout(this.updateSize(), 500)
    )
    this.trigger(Events.PLAYBACK_READY)
  }

  qualityChange(event) { // eslint-disable-line no-unused-vars
    this.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.isHighDefinitionInUse())
  }

  stateChange(event) {
    switch (event.data) {
    case YT.PlayerState.PLAYING: {
      this.enableMediaControl()
      let playbackType = this.getPlaybackType()
      if (this._playbackType !== playbackType) {
        this.settings.changeCount++
        this._playbackType = playbackType
        this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
      }
      this.trigger(Events.PLAYBACK_BUFFERFULL)
      this.trigger(Events.PLAYBACK_PLAY)
      break
    }
    case YT.PlayerState.PAUSED:
      this.trigger(Events.PLAYBACK_PAUSE)
      break
    case YT.PlayerState.BUFFERING:
      this.trigger(Events.PLAYBACK_BUFFERING)
      break
    case YT.PlayerState.ENDED:
      if (this.options.youtubeShowRelated) {
        this.disableMediaControl()
      } else {
        this.trigger(Events.PLAYBACK_ENDED)
      }
      break
    default: break
    }
  }

  play() {
    if (this.player) {
      this._progressTimer = this._progressTimer || setInterval(() => this.progress(), 100)
      this._timeupdateTimer = this._timeupdateTimer || setInterval(() => this.timeupdate(), 100)
      this.player.playVideo()
    } else if (this._ready) {
      this.trigger(Events.PLAYBACK_BUFFERING)
      this._progressTimer = this._progressTimer || setInterval(() => this.progress(), 100)
      this._timeupdateTimer = this._timeupdateTimer || setInterval(() => this.timeupdate(), 100)
      this.setupYoutubePlayer()
    } else {
      this.trigger(Events.PLAYBACK_BUFFERING)
      this.listenToOnce(this, Events.PLAYBACK_READY, this.play)
    }
  }

  pause() {
    clearInterval(this._timeupdateTimer)
    this._timeupdateTimer = null
    this.player && this.player.pauseVideo()
  }

  seek(time) {
    if (!this.player) return
    this.player.seekTo(time)
  }

  seekPercentage(percentage) {
    if (!this.player) return
    let duration = this.player.getDuration()
    let time = percentage * duration / 100
    this.seekTo(time)
  }

  volume(value) {
    this.player && this.player.setVolume && this.player.setVolume(value)
  }

  progress() {
    if (!this.player || !this.player.getDuration) return
    let buffered = this.player.getDuration() * this.player.getVideoLoadedFraction()
    this.trigger(Events.PLAYBACK_PROGRESS, {start: 0, current: buffered, total: this.player.getDuration()})
  }

  timeupdate() {
    if (!this.player || !this.player.getDuration) return
    this.trigger(Events.PLAYBACK_TIMEUPDATE, {current: this.player.getCurrentTime(), total: this.player.getDuration()})
  }

  isPlaying() {
    return this.player && this.player.getPlayerState() == YT.PlayerState.PLAYING
  }

  isHighDefinitionInUse() {
    return this.player && !!this.player.getPlaybackQuality().match(/^hd\d+/)
  }

  getDuration() {
    let duration = 0
    if (this.player) {
      duration = this.player.getDuration()
    }
    return duration
  }

  getPlaybackType() {
    return Playback.VOD
  }

  disableMediaControl() {
    this.$el.css({'pointer-events': 'auto'})
    this.trigger(Events.PLAYBACK_MEDIACONTROL_DISABLE)
  }

  enableMediaControl() {
    this.$el.css({'pointer-events': 'none'})
    this.trigger(Events.PLAYBACK_MEDIACONTROL_ENABLE)
  }

  render() {
    this.$el.html(this.template({id: `yt${this.cid}`}))
    let style = Styler.getStyleFor(playbackStyle, {baseUrl: this.options.baseUrl})
    this.$el.append(style)
    return this
  }
}

YoutubePlayback.canPlay = function(source) { // eslint-disable-line no-unused-vars
  return true
}
