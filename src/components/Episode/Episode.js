import React, { Component, PropTypes } from 'react';
import styles from './Episode.scss';
import playIcon from './PlayIcon.svg';
import pauseIcon from './PauseIcon.svg';
import classNames from 'classnames';

export default class Episode extends Component {

  static propTypes = {
      episode: PropTypes.object.isRequired,
      playEpisode: PropTypes.func.isRequired
  };

  render() {
    const { id, title, description, speakers, date, duration, url } = this.props.episode;
    const nowPlaying =  this.props.episode.id === this.props.nowPlaying.id;

    const episodeClasses = classNames({
        [styles.episode]: true,
        [styles.episodeNowPlaying]: nowPlaying
    });

    return (
      <div className={episodeClasses}>

        <button
          className={styles.episodePlay}
          onClick={ () => this.props.playEpisode(this.props.episode) }
          >
          <img src={ (nowPlaying) ? pauseIcon : playIcon} />
        </button>

        <h3 className={styles.episodeName}>
            { title }
        </h3>

        <span className={styles.episodeNumber}>{id}</span>

        <p className={styles.episodeDescription}>
            { description }
        </p>

      </div>
    );

  }
}
