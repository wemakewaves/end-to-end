import React, { Component, PropTypes } from 'react';
import styles from './Episode.scss';

export default class Episode extends Component {

  static propTypes = {
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      speakers: PropTypes.array.isRequired,
      date: PropTypes.number.isRequired,
      duration: PropTypes.object.isRequired
  };

  render() {
    const { title, url } = this.props;

    return (
      <div>
        { title }
        <br />
        <audio src={url} controls>
            Browser does not support audio please try: <a href={url}>{url}</a>
        </audio>
      </div>
    );

  }
}
