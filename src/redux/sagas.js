import { takeLatest } from 'redux-saga';
import { LOAD as GITHUB_HOTTEST_LOAD, loadSaga as loadHottestSaga } from './modules/episodes';

export default function *rootSaga(client) {
  yield [
    takeLatest(GITHUB_HOTTEST_LOAD, loadHottestSaga, client)
  ];
}
