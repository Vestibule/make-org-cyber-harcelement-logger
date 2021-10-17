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
import { handleScreenshot } from 'src/screenshotService/handleScreenshot';
import { MessageService } from './message.service';
import { displayWarning } from '../bodyguardService/displayWarning';
import { analyzeMessages } from '../bodyguardService/analyzeMessages';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() message, @Req() req) {
    console.log('Received notification: ', message);
    const analyzedLines = await analyzeMessages([message.body]);
    displayWarning(analyzedLines, 'notification');
    return this.messageService.save({
      ...message,
      userId: req.user.userId,
      sender: message.sender || message.title,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('screenshot'))
  @Post('screenshot')
  async screenshot(
    @UploadedFile() screenshot: Express.Multer.File,
    @Req() req,
  ) {
    handleScreenshot(req.body.screenshot);
    return null;
  }
}
