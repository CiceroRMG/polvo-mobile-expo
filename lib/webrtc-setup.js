import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import 'webrtc-adapter';

global.RTCPeerConnection = RTCPeerConnection;
global.RTCIceCandidate = RTCIceCandidate;
global.RTCSessionDescription = RTCSessionDescription;
global.RTCView = RTCView;
global.mediaDevices = mediaDevices;
global.MediaStream = MediaStream;