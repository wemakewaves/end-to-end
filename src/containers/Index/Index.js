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
import micSmall from './mic-small.jpg';
import mic from './mic.jpg';
import team from './team.jpg';
import teamSmall from './team-small.jpg';
import classNames from 'classnames';

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

  renderEpisode(episode, modifier) {
      return (
          <Episode key={episode.id} playEpisode={this.props.actions.startPlaying} nowPlaying={this.props.playing} episode={episode} modifier={modifier} />
      )
  }

  render() {

    const { episodes, playing, actions } = this.props;

    return (<div>

      <Helmet title="Discussing the journey of digital products"/>

      <div className={styles.masthead}>
        <div className="l-constrain">
            <img className={styles.logo} src={logo} width="246" height="246" />
            <h2 className={styles.strapline}>
                The podcast discussing the journey of digital products from end to end. Hosted by the team at UVD;
                a digital studiobased in the heart of Tech City in London. Their skills range from startup consultancy,
                UX Strategy, Frontend and Backend Development and Design.
            </h2>
        </div>
      </div>

      <Player currentlyPlaying={playing}/>

      <div className="l-constrain">

          <div className={styles.grid}>

              <div className={styles.grid_item}>
                <div className={classNames({
                   [styles.panel]: true,
                   [styles.panelActive]: playing.id === episodes.data[0].id
                })}>
                    <h3 className={styles.panel_title}>Podcast</h3>
                    { this.renderEpisode(episodes.data[0]) }
                </div>
              </div>

              <div className={styles.grid_item}>
                <img src={micSmall} alt="" />
              </div>

              <div className={styles.grid_item}>
                <div className={classNames({
                   [styles.panel]: true,
                   [styles.panelActive]: playing.id === episodes.data[1].id
                })}>
                    <h3 className={styles.panel_title}>Podcast</h3>
                    { this.renderEpisode(episodes.data[1]) }
                </div>
              </div>

              <div className={styles.grid_item}>

                <div className={styles.panel}>
                    <h3 className={styles.panel_title}>Tweet</h3>
                    <p> content goes here like </p>
                </div>

              </div>

              <div className={styles.grid_item}>
                <img src={teamSmall} alt="Photo of the endtoend.fm team around the table" />
              </div>
          </div>

      </div>

    </div>);
  }
}
