import React from "react";
import Expo from "expo";
import { Ionicons } from "@expo/vector-icons";

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";

import { combineReducers, createStore } from "redux";


import { reducer as formReducer } from "redux-form";

import { Provider } from "react-redux";

import { TabNavigator } from "react-navigation";

import Home from "./Home";
import Map from "./Map";


const allReducers = combineReducers({ form: formReducer });
var store = createStore(allReducers);



////// ROUTES TABNAVIGATOR 
const RootTabs = TabNavigator({
  
    ////// routes ////
  
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-home" : "ios-home-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
  
    Map: {
      screen: Map,
      navigationOptions: {
        tabBarLabel: "Map",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-map" : "ios-map-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
  
  
  
  });
  
  
  class App extends React.Component {
  
    render() {
      return (
        <Provider store={store}>
          <RootTabs />
        </Provider>
      )
    }
  }
  
  
  export default App;
  