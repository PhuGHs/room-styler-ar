import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

export const brokerURL = "ws://buddybound-app-790723374073.asia-southeast1.run.app/ws";
export const locationTopic = "/topic/group/location/"
export const messageTopic = "/topic/group/messages/"

export const myRxStompConfig: InjectableRxStompConfig = {
  brokerURL,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
}
