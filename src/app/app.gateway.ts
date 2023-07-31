import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ModuleService } from 'src/api/module/module.service';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private moduleService: ModuleService) {}

  @WebSocketServer() server;
  users = 0;
  classOnline = 0;
  data;

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

  @SubscribeMessage('checkCurrentRollCall')
  checkCurrentRollCall(client: any, message: any) {
    return this.moduleService
      .getRollCallDay(message.module_id, message.weekday_id, message.date)
      .subscribe((val) => {
        console.log('get list', val.data);
        this.server.emit('getCurrentRollCall', val.data);
      });
  }

  @SubscribeMessage('addCurrentRollCall')
  addCurrentRollCall(client: any, message: any) {
    return this.moduleService
      .addRollCallDay(message.module_id, message.weekday_id, message.date)
      .subscribe((val) => {
        this.server.emit('addCurrentRollCallDone', val.data.id);
      });
  }

  @SubscribeMessage('sendResult')
  sendResultRollCalling(client: any, message: any) {
    return this.moduleService
      .upsertRollCallDetail(message.rollCallId, message.moduleId, message.data)
      .subscribe((val) => {
        this.server.emit('getResultRollCalling', val.data);
      });
  }

  @SubscribeMessage('getResult')
  getResultRollCalling(client: any, message: any) {
    return this.moduleService.getRollCallDetail(message.id).subscribe((val) => {
      console.log('get');
      this.data = val.data;
      this.server.emit('getResultRollCalling', val.data);
    });
  }
}
