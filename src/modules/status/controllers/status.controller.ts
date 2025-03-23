import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class StatusController {
  @Get('/status')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          online: true,
        },
      },
    },
  })
  public getStatus() {
    return { online: true };
  }
}
