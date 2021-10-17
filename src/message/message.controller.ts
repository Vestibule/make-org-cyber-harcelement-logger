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

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() message, @Req() req) {
    return this.messageService.save({ ...message, userId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('screenshot'))
  @Post('screenshot')
  async screenshot(
    @UploadedFile() screenshot: Express.Multer.File,
    @Req() req,
  ) {
    console.log('REQ');
    console.log(req);
    handler(req.body.screenshot);
    return null;
  }
}
