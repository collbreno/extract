/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createStore } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as PaperProvider, Portal } from 'react-native-paper'
import { BreadProvider } from 'material-bread';

import viewReducer from './src/redux/reducers/ViewReducer'
import Router from './Router'
import SweetAlert from './src/globalComponents/SweetAlert';

export const store = createStore(viewReducer)



const App: () => React$Node = () => {
  return (
    <ReduxProvider store={store}>
      <BreadProvider>
        <PaperProvider>
          <SweetAlert />
          <Router />
        </PaperProvider>
      </BreadProvider>
    </ReduxProvider>
  );
};


export default App;
