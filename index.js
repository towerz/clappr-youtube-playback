var Playback = require('playback');
var JST = require('./jst');

class YoutubePlayback extends Playback {
  get name() { return 'youtube_playback' }

  get attributes() {
    return { 'class': 'clappr-youtube-playback' }
  }

  render() {
    console.log("rendering", this.name)
    var style = $('<style>').html(JST.CSS[this.name])
    this.$el.append(style)
    return this;
  }

}

YoutubePlayback.canPlay = function(source) {
  return true;
};


module.exports = window.YoutubePlayback = YoutubePlayback;
