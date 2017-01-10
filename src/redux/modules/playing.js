export const PLAYER_PLAY = 'app/podcasts/PLAY';
export const PLAYER_PAUSE = 'app/podcasts/PAUSE';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAYER_PLAY:
      return {
        ...action.episode,
        isPlaying: true
      };
    case PLAYER_PAUSE:
      return {
        ...action.episode,
        isPlaying: false
      };
    default:
      return state;
  }
}


export function startPlaying(episode) {
  return {
    type: PLAYER_PLAY,
    episode
  };
}

export function pausePlaying(episode) {
  return {
    type: PLAYER_PAUSE,
    episode
  };
}
