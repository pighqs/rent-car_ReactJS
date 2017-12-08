import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";

import { combineReducers, createStore } from "redux";


import { reducer as formReducer } from "redux-form";
import { reduxForm, Field } from 'redux-form';

import { Provider } from "react-redux";

const allReducers = combineReducers({ form: formReducer });
var store = createStore(allReducers);

// composant input texte généré ici :
function MyTextInput(props) {
  return (
    <View>
      <TextInput
      onChangeText={props.input.onChange}
      value={props.input.value}
      style={{textAlign: "center", padding:10, height: 50, backgroundColor: 'ghostwhite'}}
      />
    </View>
  );
}

// composant form généré ici :
function MyForm(props) {
  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      <Text style={{textAlign: "center",paddingTop: 40}} >Car Model</Text>
      <Field 
        name="model" 
        component={MyTextInput}
        
      />
      <Text style={{textAlign: "center",paddingTop: 20}} >Car Brand</Text>
      <Field 
        name="brand" 
        component={MyTextInput}
      />

      <Text style={{textAlign: "center",paddingTop: 20}} >City</Text>
      <Field 
        name="city" 
        component={MyTextInput}
      />
      <Text style={{textAlign: "center",paddingTop: 20}} >number of Seats</Text>
      <Field 
        name="seats" 
        component={MyTextInput}
      />

      <TouchableOpacity onPress={props.handleSubmit}>
        <Text style={{textAlign: "center", marginTop: 20, padding: 10, backgroundColor: "gold"}}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// connection formulaire au reduxForm :
var MyFormRedux = reduxForm({
  form: 'signIn'
})(MyForm);

export default class App extends React.Component {
  onSubmit(datas) {
    var formData = new FormData();
    formData.append("model", datas.model);
    formData.append("brand", datas.brand);
    formData.append("city", datas.city);
    formData.append("seats", datas.seats);
    console.log(datas);
    fetch("https://hidden-river-17566.herokuapp.com/savecar?",
  {
    method: "post",
    body: formData
  })
  }
  render() {
    return (
      <Provider store={store}>
        <MyFormRedux onSubmit={this.onSubmit} />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center"
  }
});
const inputStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center"
  }
});