import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Marker from 'react-native-maps';

import React from "react";
import { StyleSheet, View } from "react-native";

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
      markers: []
      
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
                latlng: {latitude: carsFromBack[index].lat,
                    longitude: carsFromBack[index].lng },
                title : carsFromBack[index].brand,
                description : carsFromBack[index].model,
                key: index
            };
            myCarMarkers.push(newCarMarker);              
        }
        
        //console.log("myCarMarkers" : );
        //console.log(myCarMarkers);
        
        ctx.setState({
            markers: myCarMarkers
        });

        })
        
        

        
      
      .catch(function(error) {
          console.log("erreur : ");
          console.log(error);
      })
        //let lon = Math.round(datasFromWeatherAPI.coord.lon);
        //let lat = Math.round(datasFromWeatherAPI.coord.lat);

        // on utilse la réponse pour faire nouveau fetch et recuperer infos co
        // fetch(
        //   "http://api.openweathermap.org/pollution/v1/co/" +
        //     lat +
        //     "," +
        //     lon +
        //     "/current.json?appid=" +
        //     weatherApiKey
        // )
        //   .then(function(response) {
        //     return response.json();
        //   })
        //   .then(function(result) {
        //     //console.log(result.data[0].value);
        //     ctx.setState({
        //       co: result.data[0].value
        //     });
        //     // on met à jour le store avec la valeur retournée pour pouvoir la lire ailleurs
        //     ctx.props.sendDataCo(result.data[0].value);
        //   });

      }
  



  onRegionChange = region => {
    this.setState({ region: region });
  };

  render() {
    return (
      <View style={styles.container}>
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
        </MapView>
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
  }
});
