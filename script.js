const video = document.getElementById('video');

// Fungsi untuk menunjukkan progres loading model
async function loadModels() {
  const models = [
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models') // Load model untuk deteksi usia dan gender
  ];

  let loaded = 0;

  for (const model of models) {
    await model;
    loaded++;
    const progress = Math.floor((loaded / models.length) * 100);
    console.log(`Loading models: ${progress}%`);
  }

  console.log("All models loaded successfully!");
}

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  console.log("Ready to play...");
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender(); // Tambahkan deteksi usia dan gender

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Bersihkan canvas sebelum menggambar ulang
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // Gambar deteksi wajah, landmark, ekspresi, dan informasi usia/gender
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    resizedDetections.forEach((detection) => {
      const { age, gender, genderProbability } = detection;
      const box = detection.detection.box;
      const drawOptions = {
        label: `${gender} (${(genderProbability * 100).toFixed(1)}%), Age: ${age ? age.toFixed(1) : 'N/A'}`,
        lineWidth: 2
      };
      const drawBox = new faceapi.draw.DrawBox(box, drawOptions);
      drawBox.draw(canvas);
    });

    // Tampilkan jumlah wajah yang terdeteksi di sudut layar
    const context = canvas.getContext('2d');
    context.font = '20px Arial';
    context.fillStyle = 'red';
    if (resizedDetections.length > 0 ) {
        context.fillText(`Faces Detected: ${resizedDetections.length}`, 10, 30);
    } else {
        context.fillText(`Faces Not Found`, 10, 30);
    }
  }, 100);
});

// Mulai proses
loadModels().then(startVideo);
