
# Real-Time Face Detection

This project is a real-time face detection application using the `face-api.js` library. The app detects faces, identifies facial landmarks, recognizes expressions, and estimates age and gender from a video feed.
![image](https://github.com/user-attachments/assets/366bedbc-2f55-40ae-b7f1-77c82d3fab5f)

## Features

- **Face Detection**: Detect multiple faces in real-time using `TinyFaceDetector`.
- **Facial Landmarks**: Identify key points on detected faces.
- **Facial Expressions**: Recognize emotions like happy, sad, angry, etc.
- **Age and Gender Estimation**: Estimate the age and gender of detected faces.
- **Dynamic Visual Feedback**: Display detected faces and information directly on a video feed.

## Technologies Used

- **JavaScript**
- **HTML5**
- **CSS3**
- **face-api.js**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cloud-Dark/realtime_face_detection.git
   cd realtime_face_detection
   ```

2. Download the required models:
   The application requires pre-trained models for face detection and recognition. Place these models in a `models` folder in the root directory:
   - `tiny_face_detector_model`
   - `face_landmark_68_model`
   - `face_recognition_model`
   - `face_expression_model`
   - `age_gender_model`

3. Open the `index.html` file in a browser.

## Usage

1. Allow camera access when prompted by your browser.
2. The application will automatically detect faces in the video feed.
3. Overlays will display:
   - Bounding boxes for detected faces.
   - Key facial landmarks.
   - Recognized facial expressions.
   - Estimated age and gender.

## File Structure

- **index.html**: Entry point of the application. Contains the video element and scripts.
- **script.js**: Core logic for loading models, accessing video streams, and performing real-time detection and analysis.
- **face-api.min.js**: Minified version of the `face-api.js` library for face detection and recognition.

## Code Highlights

### Model Loading (`script.js`)
```javascript
async function loadModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models')
  ]);
  console.log("All models loaded successfully!");
}
```

### Video Playback and Detection
```javascript
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    // Display detection results on canvas
    faceapi.draw.drawDetections(canvas, detections);
  }, 100);
});
```

## Contribution Guidelines

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes and test them thoroughly.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - The core library used for face detection and analysis.
- [MDN Web Docs](https://developer.mozilla.org/) - References for HTML5, CSS3, and JavaScript.
- [Face Sample Video](https://github.com/intel-iot-devkit/sample-videos?tab=readme-ov-file) - Source of video example
