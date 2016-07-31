import React, { Component, PropTypes } from 'react';
import styles from './Player.scss';

function convertToTime (number) {
  const mins = Math.floor(number / 60);
  const secs = (number % 60).toFixed();
  return `${ mins < 10 ? '0' : '' }${ mins }:${ secs < 10 ? '0' : '' }${ secs }`;
}

export default class Player extends Component {

    static propTypes = {
        currentlyPlaying: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            paused: true,
            displayedTime: 0
        };
        this.seekInProgress = false;
    }

    componentWillMount() {
        this.playing = true;
    }

    componentWillUnmount () {
      // remove event listeners bound outside the scope of our component
      window.removeEventListener('mouseup', this.seekReleaseListener);
      document.removeEventListener('touchend', this.seekReleaseListener);
      window.removeEventListener('resize', this.resizeListener);

      /* pause the audio element before dereferencing it
       * (we can't know when garbage collection will run)
       */
      this.audio.pause();
      this.audio = null;
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
            console.log('We started playing');
          this.setState({
            paused: false
          });
        });
    }

    fetchAudioProgressBoundingRect () {
        this.audioProgressBoundingRect = this.audioProgressContainer.getBoundingClientRect();
    }

    playPause() {

        if (this.playing) {
            this.audioEl.pause();
        } else {
            this.audioEl.play();
        }

        this.playing = !this.playing;
    }

    handleTimeUpdate () {
        if (!this.seekInProgress && this.audioEl) {
            this.setState({
                displayedTime: this.audioEl.currentTime
            });
        }
    }

    adjustDisplayedTime (event) {

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

    seek (event) {
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
        const timeRatio = `${ elapsedTime } / ${ fullTime }`;

        const progressBarWidth = `${ (displayedTime / duration) * 100 }%`;

        return (
            <div className={styles.audio_player_container}>
                <div className="l-constrain">

                    <div className={styles.audio_player}>

                        <button onClick={this.playPause.bind(this)}
                                className={this.playing ? styles.button_paused : styles.button}>
                        </button>

                        <div id="audio_progress_container"
                             className={styles.audio_progress_container}
                             ref={ (ref) => this.audioProgressContainer = ref }
                             onMouseDown={ this.adjustDisplayedTime.bind(this) }
                             onMouseMove={ this.adjustDisplayedTime.bind(this) }
                             onTouchStart={ this.adjustDisplayedTime.bind(this) }
                             onTouchMove={ this.adjustDisplayedTime.bind(this) }>
                            <div id="audio_progress"
                               className={styles.audio_progress}
                               style={ { width: progressBarWidth } }></div>
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
        );
    }
}
