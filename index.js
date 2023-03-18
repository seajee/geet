const localPeerIdInput = document.getElementById("local-peer-id");
const remotePeerIdInput = document.getElementById("remote-peer-id");

const callButton = document.getElementById("call-button");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const constraints = {
    video: "true",
    audio: "true"
}

let localStream;

var peer = new Peer();

const onCallButton = () => {
    const remotePeerId = remotePeerIdInput.value;
    const call = peer.call(remotePeerId, localStream);
    call.on("stream", stream => {
        remoteVideo.srcObject = stream;
        remoteVideo.onloadedmetadata = () => {
            remoteVideo.play();
        }
    });
}

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

    callButton.addEventListener("click", onCallButton);
}

main();