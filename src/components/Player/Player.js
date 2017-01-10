import React, { Component, PropTypes } from 'react';
import styles from './Player.scss';
import classNames from 'classnames';

function convertToTime(number) {
  const mins = Math.floor(number / 60);
  const secs = (number % 60).toFixed();
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default class Player extends Component {

  static propTypes = {
    currentlyPlaying: PropTypes.object.isRequired,
    startPlaying: PropTypes.func.isRequired,
    pausePlaying: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      displayedTime: 0
    };

    this.seekInProgress = false;

  }

  componentDidUpdate(prevProps) {
    
    if (!prevProps.currentlyPlaying) {
      return;
    }

    const wasPreviouslyPlaying = prevProps.currentlyPlaying.isPlaying;
    const shouldPlayNow = this.props.currentlyPlaying.isPlaying;
    
    console.log(wasPreviouslyPlaying, shouldPlayNow);

    if (wasPreviouslyPlaying && !shouldPlayNow) {
      this.audioEl.pause();
    } else if (!wasPreviouslyPlaying && shouldPlayNow) {
      this.audioEl.play();
    }
  }

  componentWillUnmount() {
    // remove event listeners bound outside the scope of our component
    window.removeEventListener('mouseup', this.seekReleaseListener);
    document.removeEventListener('touchend', this.seekReleaseListener);
    window.removeEventListener('resize', this.resizeListener);

    /* pause the audio element before dereferencing it
     * (we can't know when garbage collection will run)
     */
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }


  componentDidMount() {
    const seekReleaseListener = this.seekReleaseListener = this.seek.bind(this);
    window.addEventListener('mouseup', seekReleaseListener);
    document.addEventListener('touchend', seekReleaseListener);

    this.audioProgressBoundingRect = null;
    window.addEventListener('resize', this.fetchAudioProgressBoundingRect.bind(this));
    this.fetchAudioProgressBoundingRect();

    this.audioEl.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));

    this.audioEl.addEventListener('play', () => {
      this.setState({
        paused: false
      });
    });
  }

  fetchAudioProgressBoundingRect() {
    this.audioProgressBoundingRect = this.audioProgressContainer.getBoundingClientRect();
  }

  playPause() {
    if (this.props.currentlyPlaying.isPlaying) {
      this.props.pausePlaying(this.props.currentlyPlaying);
    } else {
      this.props.startPlaying(this.props.currentlyPlaying);
    }
  }

  handleTimeUpdate() {
    if (!this.seekInProgress && this.audioEl) {
      this.setState({
        displayedTime: this.audioEl.currentTime
      });
    }
  }

  adjustDisplayedTime(event) {

    // make sure we don't select stuff in the background while seeking
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.seekInProgress = true;
      document.body.classList.add('noselect');
    } else if (!this.seekInProgress) {
      return;
    }

    /* we don't want mouse handlers to receive the event
    * after touch handlers if we're seeking.
    */
    event.preventDefault();
    const boundingRect = this.audioProgressBoundingRect;
    const isTouch = event.type.slice(0, 5) === 'touch';
    const pageX = isTouch ? event.targetTouches.item(0).pageX : event.pageX;
    const position = pageX - boundingRect.left - document.body.scrollLeft;
    const containerWidth = boundingRect.width;
    const progressPercentage = position / containerWidth;

    this.setState({
      displayedTime: progressPercentage * this.audioEl.duration
    });
  }

  seek(event) {
    /* this function is activated when the user lets
     * go of the mouse, so if .noselect was applied
     * to the document body, get rid of it.
     */
    document.body.classList.remove('noselect');
    if (!this.seekInProgress) {
      return;
    }
    /* we don't want mouse handlers to receive the event
     * after touch handlers if we're seeking.
     */
    event.preventDefault();
    this.seekInProgress = false;
    const displayedTime = this.state.displayedTime;
    if (isNaN(displayedTime)) {
      return;
    }
    this.audioEl.currentTime = displayedTime;
  }

  render() {
    const { currentlyPlaying } = this.props;
    const incompatabilityMessage = (
      <p>Browser does not support audio please try: <a href={currentlyPlaying.url}>{currentlyPlaying.url}</a></p>
    );

    const displayedTime = this.state.displayedTime;
    const duration = this.audioEl && this.audioEl.duration || 0;

    const elapsedTime = convertToTime(displayedTime);
    const fullTime = convertToTime(duration);
    const timeRatio = `${elapsedTime} / ${fullTime}`;

    const progressBarWidth = `${(displayedTime / duration) * 100}%`;


    const buttonClasses = classNames({
      [styles.button]: true,
      [styles.button_paused]: this.props.currentlyPlaying.isPlaying
    });


    return (
      <div className={styles.audio_player_container}>
        <div className="l-constrain">

          <div className={styles.audio_player}>

            <button onClick={this.playPause.bind(this)}
              className={buttonClasses}>
            </button>

            <div className={styles.playing_wrapper}>
              <div className={styles.now_playing_title}>
                {currentlyPlaying.title}&nbsp;
                            </div>

              <div id="audio_progress_container"
                className={styles.audio_progress_container}
                ref={(ref) => this.audioProgressContainer = ref}
                onMouseDown={this.adjustDisplayedTime.bind(this)}
                onMouseMove={this.adjustDisplayedTime.bind(this)}
                onTouchStart={this.adjustDisplayedTime.bind(this)}
                onTouchMove={this.adjustDisplayedTime.bind(this)}>
                <div id="audio_progress"
                  className={styles.audio_progress}
                  style={{ width: progressBarWidth }}></div>
              </div>

              <div className={styles.audio_time}>
                {convertToTime(displayedTime)}
              </div>

              <audio src={currentlyPlaying.url} ref={(ref) => this.audioEl = ref} autoPlay="true">
                {incompatabilityMessage}
              </audio>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
