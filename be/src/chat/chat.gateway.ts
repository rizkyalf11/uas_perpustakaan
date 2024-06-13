import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './msg.entity';
import { Repository } from 'typeorm';
import { Staff } from 'src/staff/staff.entity';
import { Anggota } from 'src/anggota/anggota.entity';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway {
  constructor(
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Anggota)
    private readonly anggotaRepo: Repository<Anggota>,
  ) {}

  @WebSocketServer()
  server: Server;

  private usersAdmin = [];
  private usersAnggota = [];
  private clients = [];

  handleConnection(client: any) {
    if (client.handshake.query.id != undefined) {
      const user = {
        id: client.handshake.query.id,
        username: client.handshake.query.username,
        role: client.handshake.query.role,
      };

      client.user = user;

      if (user.role == 'admin') {
        this.usersAdmin.push(user);
        this.clients.push(client);
      } else if (user.role == 'anggota') {
        this.usersAnggota.push(user);
        this.clients.push(client);
      }

      console.log('admin', this.usersAdmin);
      console.log('anggota', this.usersAnggota);
    }
  }

  handleDisconnect(client: any) {
    const user = {
      id: client.handshake.query.id,
      username: client.handshake.query.username,
      role: client.handshake.query.role,
    };

    if (user.role == 'admin') {
      const usersAdminUpdate = this.usersAdmin.filter(
        (item) => item.id != user.id,
      );

      this.usersAdmin = usersAdminUpdate;
    }
    if (user.role == 'anggota') {
      const usersAnggotaUpdate = this.usersAnggota.filter(
        (item) => item.id != user.id,
      );

      this.usersAnggota = usersAnggotaUpdate;
    }
  }

  @SubscribeMessage('msg')
  async handleMsg(client: any, payload: any) {
    const { penerima, pengirim, text, id_anggota } = payload;
    console.log(payload);

    if (penerima) {
      if (client.user.role == 'admin') {
        const msgDb = await this.msgRepo.save({
          pengirim,
          penerima,
          id_anggota,
          pesan: text,
        });

        for (let i = 0; i < this.clients.length; i++) {
          if (this.clients[i].user.role == penerima) {
            this.clients[i].emit('msg', {
              pengirim,
              text,
              id: msgDb.id,
              penerima,
              id_anggota,
            });
          }
        }
      } else {
        const msgDb = await this.msgRepo.save({
          pengirim,
          penerima,
          id_anggota,
          pesan: text,
        });

        for (let i = 0; i < this.clients.length; i++) {
          if (this.clients[i].user.role == penerima) {
            this.clients[i].emit('msg', {
              pengirim,
              text,
              id: msgDb.id,
              penerima,
              id_anggota,
            });
          }
        }
      }
    }
  }

  @SubscribeMessage('trigPengembalian')
  async handleTrigPengembalian(client: any, payload: any) {
    console.log(payload);

    if (payload) {
      if (client.user.role == 'admin') {
        for (let i = 0; i < this.clients.length; i++) {
          if (
            this.clients[i].user.role == 'anggota' &&
            this.clients[i].user.id == payload.id_anggota
          ) {
            this.clients[i].emit('trigPengembalian');
          }
        }
      }
    }
  }

  @SubscribeMessage('trigPeminjaman')
  async handleTrigPeminjaman(client: any, payload: any) {
    console.log(payload);

    if (payload) {
      if (client.user.role == 'admin') {
        for (let i = 0; i < this.clients.length; i++) {
          if (
            this.clients[i].user.role == 'anggota' &&
            this.clients[i].user.id == payload.id_anggota
          ) {
            this.clients[i].emit('trigPeminjaman');
          }
        }
      }
    }
  }
}
