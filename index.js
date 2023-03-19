const localPeerIdInput = document.getElementById("local-peer-id");
const remotePeerIdInput = document.getElementById("remote-peer-id");

const callButton = document.getElementById("call-button");

const microphoneToggleButton = document.getElementById("microphone-toggle");
const videoToggleButton = document.getElementById("video-toggle");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const constraints = {
    video: "true",
    audio: "true"
}

let localStream;

var peer = new Peer();


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


callButton.addEventListener("click", () => {
    const remotePeerId = remotePeerIdInput.value;
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