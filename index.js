/*
* TODO:
* - Fix chat working one way only by initiating a data connection
*   and exchange peer ids with another peer object before the video/audio streams
*/

const localPeerIdInput = document.getElementById("local-peer-id");
const remotePeerIdInput = document.getElementById("remote-peer-id");

const callButton = document.getElementById("call-button");

const microphoneToggleButton = document.getElementById("microphone-toggle");
const videoToggleButton = document.getElementById("video-toggle");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const chatText = document.getElementById("chat");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

const constraints = {
    video: "true",
    audio: "true"
}

let localStream;

let peer = new Peer({
    config: {
        "iceServers": [
            { url: "stun:stun.l.google.com:19302" }
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
        microphoneToggleButton.innerText = track.enabled ? "Mute" : "Unmute";
    });
});

videoToggleButton.addEventListener("click", () => {
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(track => {
        track.enabled = !track.enabled;
        videoToggleButton.innerText = track.enabled ? "Disable Camera" : "Enable Camera";
    });
});

chatForm.addEventListener("submit", event => {
    event.preventDefault();

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