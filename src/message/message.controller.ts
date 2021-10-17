import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { handler } from 'src/screenshotService/handler';
import { MessageService } from './message.service';
import { displayWarning } from '../bodyguardService/displayWarning';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() message, @Req() req) {
    console.log('Received notification: ', message);
    displayWarning([message.body]);
    return this.messageService.save({
      ...message,
      userId: req.user.userId,
      sender: message.body.sender || message.body.title,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('screenshot'))
  @Post('screenshot')
  async screenshot(
    @UploadedFile() screenshot: Express.Multer.File,
    @Req() req,
  ) {
    handler(req.body.screenshot);
    return null;
  }
}
