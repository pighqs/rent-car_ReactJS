import React from "react";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Marker from "react-native-maps";

import { Platform, Text, StyleSheet, View } from "react-native";
import { Constants, Location, Permissions } from "expo";
import { List, ListItem } from "react-native-elements";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 48.862162,
        longitude: 2.347911,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markers: [],
      location: {
        coords: {
          latitude: 48.8649325,
          longitude: 2.3499496
        }
      },
      errorMessage: null
    };
  }

  componentDidMount() {
    // il faut récupérer valeur du this dans une  variable (bind manuel) sinon elle sera perdue lors du fetch
    const ctx = this;

    fetch(
      // on se connecte au back hebergé sur heroku pour aller chercher  cars dans DB
      "https://hidden-river-17566.herokuapp.com/findcars"
    )
      .then(function(response) {
        // Convert to JSON end return esponse
        return response.json();
      })
      .then(function(carsFromBack) {
        // response is now called datasFromWeatherAPI
        //console.log(carsFromBack);
        let myCarMarkers = [];
        let newCarMarker = {};
        for (let index = 0; index < carsFromBack.length; index++) {
          newCarMarker = {
            latlng: {
              latitude: carsFromBack[index].lat,
              longitude: carsFromBack[index].lng
            },
            title: carsFromBack[index].brand,
            description: carsFromBack[index].model,
            key: index,
            unique_id: carsFromBack[index]._id
          };
          console.log(newCarMarker);
          myCarMarkers.push(newCarMarker);
        }

        //mise a jour markers via un setState
        ctx.setState({
          markers: myCarMarkers
        });
      })
      .catch(function(error) {
        console.log("erreur : ");
        console.log(error);
      });
  } // fin componentDidMount

  componentWillMount() {
    const myThis = this;
    if (Platform.OS === "android" && !Constants.isDevice) {
      myThis.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      myThis._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let mylocation = await Location.getCurrentPositionAsync({});
    //console.log(mylocation);
    this.setState({ location: mylocation });
  };

  onRegionChange = region => {
    this.setState({ region: region });
  };

  render() {

    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          style={styles.map}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
          {
            <MapView.Marker
              key="my loc"
              coordinate={this.state.location.coords}
              title="je suis là tralala"
              pinColor={"navy"} // couleur marker
            />
          }
        </MapView>

        <List containerStyle={{ marginBottom: 20, width:300 }}>
          {this.state.markers.map((marker, i) => (
            <ListItem
              roundAvatar
              avatar={{ uri: "https://hidden-river-17566.herokuapp.com/"+marker.unique_id+".jpg" }}
              key={i}
              title={marker.title + " " + marker.description}
            />
          ))}
        </List>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  paragraph: {
    margin: 24,
    fontSize: 14,
    textAlign: "center"
  }
});
