import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;
  users = 0;
  classOnline = 0;

  handleConnection(client: any, ...args: any[]) {
    //
  }
  handleDisconnect(client: any) {
    //
  }
  afterInit(server: any) {
    //
  }

  @SubscribeMessage('addRollCallingClass')
  addRollCallingClass(client: any, message: any) {
    this.classOnline++;
    this.server.emit('get', this.classOnline);
  }

  @SubscribeMessage('removeRollCallingClass')
  removeRollCallingClass(client: any, message: any) {
    this.classOnline > 0 && this.classOnline--;
    this.server.emit('get', this.classOnline);
  }

  @SubscribeMessage('sendGet')
  get(client: any, message: any) {
    this.server.emit('get', this.classOnline);
  }

  @SubscribeMessage('sendResult')
  sendResultRollCalling(client: any, message: any) {
    console.log(message);
  }
}
