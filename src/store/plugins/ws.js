import socket from "../../network/ws";
import types from "../mutationTypes";

const subscriptionEvent = "subscribe";
const subscriptionType = "trade";

export default (store) => {
  socket.onmessage = commitSubscriptionData.bind(null, store);

  store.subscribe(subscribeFn);
  store.subscribe(unsubscribeFn);
};

function commitSubscriptionData(store, message) {
  let data = JSON.parse(message.data);
  data = getValidSubscriptionData(data);
  if (!data) return;
  store.commit(types.RECEIVE_DATA, data);
}

function subscribeFn(mutation) {
  if (mutation.type !== types.SUBSCRIBE_TO_DATA) return;

  let message = {
    event: subscriptionEvent,
    subscription: { name: subscriptionType },
    pair: [mutation.payload.curencies.join("/")],
  };

  socket.send(JSON.stringify(message));
}

function unsubscribeFn(mutation) {
  if (mutation.type !== types.UNSUBSCRIBE_FROM_DATA) return;

  let message = {
    event: subscriptionEvent,
    subscription: { name: subscriptionType },
    pair: [mutation.payload],
  };

  socket.send(JSON.stringify(message));
}

function getValidSubscriptionData(data) {
  if (!Array.isArray(data) && data.length !== 4) return;
  if (data[2] !== subscriptionType) return;

  return data;
}