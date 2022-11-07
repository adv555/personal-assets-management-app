import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: {
      cors: { origin: '*' },
      path: process.env.REACT_APP_WEBSOCKET_URL_PATH,
    },
  },
})
export class MessagingGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('client connected');
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('create message');
  }

  @OnEvent('message.created')
  handleMessageCreated(payload: any) {
    this.server.emit('onMessage', payload);
  }
}
