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
import Player from '../../components/Player/Player';
import * as actionCreators from 'redux/modules/playing';
import logo from './logo.svg';

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

  renderEpisode(episode) {
      return (
          <Episode key={episode.id} playEpisode={this.props.actions.startPlaying} nowPlaying={this.props.playing} episode={episode} />
      )
  }

  render() {

    const { episodes, playing, actions } = this.props;

    return (<div>

      <Helmet title="Discussing the journey of digital products"/>

      <div className={styles.masthead}>
        <div className="l-constrain">
            <img src={logo} width="246" height="246" />
            <h2 className={styles.strapline}>
                The podcast discussing the journey of digital products from end to end
            </h2>
        </div>
      </div>

      <Player currentlyPlaying={playing}/>

      <div className="l-constrain">
          <div className={styles.episodes}>
             { episodes.data.map(episode => this.renderEpisode(episode)) }
          </div>
      </div>

    </div>);
  }
}
