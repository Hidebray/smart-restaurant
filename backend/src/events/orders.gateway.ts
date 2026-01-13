import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class OrdersGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // Allow clients to join role rooms by sending a 'join' event with role name
    this.server.on('connection', (socket: Socket) => {
      socket.on('join', (role: string) => {
        try {
          socket.join(role);
        } catch (e) {
          // ignore
        }
      });
    });
  }

  emitNewOrderToWaiters(order: any) {
    // Emit new order only to waiter clients
    this.server.to('waiter').emit('new_order', order);
  }

  emitOrderUpdatedToWaiters(order: any) {
    this.server.to('waiter').emit('order_updated', order);
  }

  emitOrderToKitchen(order: any) {
    // When waiter accepts, send to kitchen
    this.server.to('kitchen').emit('order_to_kitchen', order);
  }

  emitOrderUpdatedToKitchen(order: any) {
    this.server.to('kitchen').emit('order_updated', order);
  }
}
