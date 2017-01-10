import React, { Component, PropTypes } from 'react';
import styles from './Episode.scss';
import playIcon from './PlayIcon.svg';
import pauseIcon from './PauseIcon.svg';
import classNames from 'classnames';

export default class Episode extends Component {

  static propTypes = {
    episode: PropTypes.object.isRequired,
    playEpisode: PropTypes.func.isRequired,
    pauseEpisode: PropTypes.func.isRequired
  };

  render() {
    const { id, title, description, speakers, date, duration, url } = this.props.episode;

    const nowPlaying = (this.props.episode.id === this.props.nowPlaying.id);
    const isPlaying = nowPlaying && this.props.nowPlaying.isPlaying;

    const episodeClasses = classNames({
      [styles.episode]: true,
      [styles.episodeNowPlaying]: nowPlaying
    });

    return (
      <div className={episodeClasses}>

        <div className={styles.episodeDetails}>
          <p className={styles.episodeMeta}>
            44 minutes | published 09/05/2016
          </p>

          <h3 className={styles.episodeName}>
            {title}
          </h3>


          <p className={styles.episodeDescription}>
            {description}
          </p>

          <p className={styles.episodeHosts}>
            Hosted by: <span>@Eddy, @James, @Ryan</span>
          </p>
        </div>

        <div className={styles.episodeActions}>
          <button className={styles.episodePlay} onClick={() => (isPlaying) ? this.props.pauseEpisode(this.props.episode) : this.props.playEpisode(this.props.episode)} >
            <img src={(isPlaying) ? pauseIcon : playIcon} alt="Play/Pause Episode"/>
          </button>
        </div>

      </div>
    );
  }
}
