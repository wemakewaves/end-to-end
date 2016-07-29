import React, { Component, PropTypes } from 'react';
import styles from './Episode.scss';

export default class Episode extends Component {

  static propTypes = {
      episode: PropTypes.object.isRequired,
      playEpisode: PropTypes.func.isRequired
  };

  render() {
    const { title, description, speakers, date, duration, url } = this.props.episode;

    return (
      <div>
        { title }
        <br />
        { description }
        <br />
        { speakers.map(speaker => `${speaker}, `) }
        <br />
        { date }
        <br />
        Currently Playing: { this.props.episode.id === this.props.nowPlaying.id ? 'yes' : 'no' }
        <br />
        <button onClick={ () => this.props.playEpisode(this.props.episode) }>Start Playing</button>
      </div>
    );

  }
}
