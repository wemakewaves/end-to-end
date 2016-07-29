import React, { Component } from 'react';
import { Link } from 'react-router';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { load } from 'redux/modules/episodes';
import Helmet from 'react-helmet';
import styles from './Index.scss';
import Episodes from '../Episodes/Episodes';
import Episode from '../../components/Episode/Episode';
import * as actionCreators from 'redux/modules/playing';

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

@asyncConnect([
  {
    promise: ({ store }) => {
      if (!store.getState().episodes.loaded) {
        return store.dispatch(load());
      }
      return null;
    }
  }
])
@connect(state => ({
  episodes: state.episodes,
  playing: state.playing
}), mapDispatchToProps)

export default class Index extends Component {

  render() {

    const { episodes, playing, actions } = this.props;

    return (<div className={styles.wrapper}>

      <Helmet title="End2End.fm - Discussing the journey of digital products"/>

      <div className={styles.jumbotron}>

        <div className="container">

          <h1>End to End.fm</h1>

          <p className={styles.description}>
             Discussing the journey of digital products
          </p>

        </div>

      </div>


      <div class="container">
        <h2>Now playing: {playing.title}</h2>
        {
          episodes.loading ? <span>Please wait fetching data...</span> : null
        }
        {
          episodes.loaded ? episodes.data.map(episode => <Episode key={episode.id} playEpisode={actions.startPlaying} nowPlaying={playing} episode={episode} /> ) : null
        }
      </div>

    </div>);
  }
}
