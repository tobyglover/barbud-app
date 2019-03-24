/* eslint no-console: 0 */

const logger = store => next => action => {
  let result = next(action);
  if (console && console.group) {
    console.group(action.type);
    console.info('dispatching', action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
  }
  return result;
}

export default logger;
