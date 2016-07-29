export const PLAYER_PLAY = 'app/podcasts/PLAY';

const initialState = {
    title: 'hello'
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAYER_PLAY:
      debugger;
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
