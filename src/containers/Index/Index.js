import React, { Component } from 'react';
import { Link } from 'react-router';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { load } from 'redux/modules/episodes';
import Helmet from 'react-helmet';
import styles from './Index.scss';
import Episodes from '../Episodes/Episodes';
import Episode from '../../components/Episode/Episode';

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
  data: state.episodes.data,
  loading: state.episodes.loading,
  loaded: state.episodes.loaded
}))

export default class Index extends Component {
  render() {

    const { loading, loaded, data } = this.props;

    return (<div className={styles.wrapper}>

      <Helmet title="End2End.fm - Discussing the journey of digital products"/>

      <div className={styles.jumbotron}>

        <div className="container">

          <h1>End2End.fm</h1>

          <p className={styles.description}>
             Discussing the journey of digital products
          </p>

          <div className="container">
            {
              loading ? <span>Please wait fetching data...</span> : null
            }
            {
              loaded ? data.map(episode => <Episode key={episode.id} {...episode} /> ) : null
            }
          </div>

        </div>

      </div>

    </div>);
  }
}
