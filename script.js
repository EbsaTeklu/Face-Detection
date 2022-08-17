const video=document.getElementById('video')
function startVideo() {
    navigator.getUserMedia(
        {video:{}},
        stream=>video.srcObject=stream,
        err=>console.error(err)
    )
}
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
])//load libraries
.then(startVideo)//startvideo

video.addEventListener('play',()=>{
    const canvas =faceapi.createCanvasFromMedia(video) //adding canvas on top of the live video to draw detections
    document.body.append(canvas)
    const displaySize={width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,displaySize) 
    setInterval(async ()=>{
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            console.log(detections)
            const resizedDetections=faceapi.resizeResults(detections,displaySize)//resizing detection to display on the canvas overlaying the video
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)//clears the canvas immediately after detection have be drawn
            faceapi.draw.drawDetections(canvas,resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
    },100)
})  