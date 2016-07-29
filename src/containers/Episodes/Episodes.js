import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { load } from 'redux/modules/episodes';
import Helmet from 'react-helmet';
import styles from './Episodes.scss';

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
@connect(state => state.episodes)

export default class Episodes extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired
  };

  render() {
    const { loading, loaded, data } = this.props;

    return (<div className={styles.wrapper}>
      <div className="container">

      </div>
    </div>);
  }
}
