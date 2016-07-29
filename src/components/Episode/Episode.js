import React, { Component, PropTypes } from 'react';
import styles from './Episode.scss';
import playIcon from './PlayIcon.svg';
export default class Episode extends Component {

  static propTypes = {
      episode: PropTypes.object.isRequired,
      playEpisode: PropTypes.func.isRequired
  };

  render() {
    const { id, title, description, speakers, date, duration, url } = this.props.episode;

    return (
      <div className={styles.episode}>

        <button
          className={styles.episodePlay}
          onClick={ () => this.props.playEpisode(this.props.episode) }
          >
          <img src={playIcon} />
        </button>

        <h3 className={styles.episodeName}>
            { title }
        </h3>

        <span className={styles.episodeNumber}>{id}</span>

        <p className={styles.episodeDescription}>
            { description }
        </p>

        Currently Playing: { this.props.episode.id === this.props.nowPlaying.id ? 'yes' : 'no' }

      </div>
    );

  }
}
