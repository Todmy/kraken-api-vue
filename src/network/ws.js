const wsURL = process.env.VUE_APP_WEBSOCKET_URL;

class CustomWebSocket extends WebSocket {
  defferedSend = [];

  send(...args) {
    if (this.readyState === 1) {
      super.send(...args);
    } else {
      this.defferedSend.push(() => super.send(...args));
    }
  }
}

const socket = new CustomWebSocket(wsURL);

socket.onopen = () => socket.defferedSend.forEach((defferedFn) => defferedFn());

export default socket;
