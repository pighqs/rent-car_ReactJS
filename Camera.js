import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera, Permissions } from "expo";

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  // on attend le résultat du composant camera
  takePic = async () => {
    if (this.camera) {
      // on attend le résultat de takePictureAsync() pour recupèrer l'image au moment ou elle est invoquée
      let photo = await this.camera.takePictureAsync();
      //photo est une uri, qu'on peut envoyer dans formData
      //console.log(photo.uri);
      // on prepare un fetch en post avec FormData (formatage de données multipath)
      var formData = new FormData();
      formData.append("imgcar", {
        uri: photo.uri, // URI(TakePictureAsync)
        name: this.props.id,
        type: "image/jpeg" // !!! obligatoire
      });
      console.log(formData);
      fetch("https://hidden-river-17566.herokuapp.com/sendpicture", {
        method: "post",
        body: formData
      });
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            ref={ref => {
              this.camera = ref;
            }} //this.camera fait référence au composant caméra
            type={this.state.type}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              {/*  les zones TouchableOpacity sont interactives */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  height:100,
                  width: 100,
                  alignSelf: "flex-end",
                  alignItems: "center",
                  margin: 100
                }}
                // la fonction takePic est bindée
                onPress={this.takePic.bind(this)}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                  Photo
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
