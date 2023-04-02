const localPeerIdInput = document.getElementById("local-peer-id");
const remotePeerIdInput = document.getElementById("remote-peer-id");

const callButton = document.getElementById("call-button");

const microphoneToggleButton = document.getElementById("microphone-toggle");
const microphoneToggleImage = document.getElementById("microphone-toggle-image");
const videoToggleButton = document.getElementById("video-toggle");
const videoToggleImage = document.getElementById("video-toggle-image");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const chatText = document.getElementById("chat");
const chatInput = document.getElementById("chat-input");
const chatInputSend = document.getElementById("chat-input-send");

const constraints = {
    video: "true",
    audio: "true"
}

let localStream;

let peer = new Peer({
    config: {
        "iceServers": [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    }
});
let connection;


peer.on("open", id => {
    localPeerIdInput.value = id;
});

peer.on("call", call => {
    call.answer(localStream);
    call.on("stream", stream => {
        remoteVideo.srcObject = stream;
        remoteVideo.onloadedmetadata = () => {
            remoteVideo.play();
        }
    });
});

peer.on("connection", conn => {
    connection = conn;
    connection.on("data", data => {
        chatText.value += `Peer: ${data}\n`;
    });
});


callButton.addEventListener("click", () => {
    const remotePeerId = remotePeerIdInput.value;

    connection = peer.connect(remotePeerId);
    connection.on("data", data => {
        chatText.value += `Peer: ${data}\n`;
    });

    const call = peer.call(remotePeerId, localStream);
    call.on("stream", stream => {
        remoteVideo.srcObject = stream;
        remoteVideo.onloadedmetadata = () => {
            remoteVideo.play();
        }
    });
});

microphoneToggleButton.addEventListener("click", () => {
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => {
        track.enabled = !track.enabled;
        microphoneToggleImage.src = track.enabled ? "assets/mic_on.svg" : "assets/mic_off.svg";
    });
});

videoToggleButton.addEventListener("click", () => {
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(track => {
        track.enabled = !track.enabled;
        videoToggleImage.src = track.enabled ? "assets/video_on.svg" : "assets/video_off.svg";
    });
});

chatInputSend.addEventListener("click", () => {
    if (!connection) {
        return;
    }

    const message = chatInput.value;
    connection.send(message);

    chatText.value += `You: ${message}\n`;
    chatInput.value = "";
});


const main = () => {
    localVideo.volume = 0;

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localStream = stream;

            localVideo.srcObject = localStream;
            localVideo.onloadedmetadata = () => {
                localVideo.play();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

main();