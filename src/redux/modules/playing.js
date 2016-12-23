export const PLAYER_PLAY = 'app/podcasts/PLAY';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAYER_PLAY:
      return {
          ...action.episode
      };
    default:
      return state;
  }
}


export function startPlaying(episode) {
  return {
    type: PLAYER_PLAY,
    episode: episode
  };
}
