import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/getmsg/:id')
  getMsg(@Param('id') id: string) {
    return this.chatService.getMsg(Number(id));
  }
}
