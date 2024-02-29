import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { handleCapture } from "../utils/handleCapture";

export default function CaptureScreen() {
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const setup = () => {
    (async () => {
      if (cameraRef.current && permission && permission.granted && isFocused) {
        await cameraRef.current.resumePreview();
      }
    })();
  };
  const dependencies = [permission, isFocused];
  useEffect(setup, dependencies);

  if (!permission) {
    // permission na paile ki hobe
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera
        </Text>
        <View style={styles.permissionButtonContainer}>
          <TouchableOpacity
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraType() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera style={styles.camera} type={type} ref={cameraRef} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <MaterialIcons name="sync" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => handleCapture(cameraRef)}
        >
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9999FF",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6666FF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInnerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "transparent",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: "white",
  },
  permissionButtonContainer: {
    alignItems: "center",
  },
  permissionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6666FF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
