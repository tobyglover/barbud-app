import { persistCombineReducers } from 'redux-persist'
import { createFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/lib/storage'

import SignUp from './SignUp';
import SignUpValidation from './SignUpValidation';
import Bar from './Bar';
import App from './App';
import Order from './Order';

const Reducers = {
  SignUp,
  SignUpValidation,
  Bar,
  App,
  Order
};

const whitelists = [
  createFilter(
    'App',
    ['user', 'authToken', 'persistentSettings'],
    ['user', 'authToken', 'persistentSettings'])
];

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['App'],
  transforms: [...whitelists]
};

const PersistReducers = persistCombineReducers(persistConfig, Reducers);

export default PersistReducers;
