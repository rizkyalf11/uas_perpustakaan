import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './msg.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
  ) {}

  async getMsg(idUser: number) {
    const msg = await this.msgRepo.find({
      where: {
        id_anggota: { id: idUser },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return { message: msg };
  }
}
