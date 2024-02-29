// CaptureScreen.js
import * as Location from "expo-location";
import { manipulateAsync } from "expo-image-manipulator";

export async function handleCapture(cameraRef) {
  if (cameraRef.current) {
    // Photo
    let photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
    // Do something with the captured photo
    // Compress the photo
    const compressedPhoto = await manipulateAsync(
      photo.uri,
      [{ resize: { width: 800 } }], // Adjust the width as needed for compression
      { compress: 0.5, format: "jpeg" } // Adjust the compression quality
    );

    console.log(compressedPhoto); // Check the compressed photo object

    // Location
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      // If permission not given
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      return loc;
    };

    let location = await getLocation();
    console.log(location);

    // Timestamp
    const time = new Date();
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0"); // Adjust month format to MM
    const day = String(time.getDate()).padStart(2, "0"); // Adjust day format to DD
    const hour = String(time.getHours()).padStart(2, "0"); // Adjust hour format to HH
    const minute = String(time.getMinutes()).padStart(2, "0"); // Adjust minute format to MM
    const second = String(time.getSeconds()).padStart(2, "0"); // Adjust second format to SS
    const timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // PostgreSQL format
    console.log(timestamp);

    // send photo, location and timestamp to backend
  }
}
