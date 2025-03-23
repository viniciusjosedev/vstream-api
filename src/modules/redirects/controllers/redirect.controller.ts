import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class RedirectController {
  @Get('/')
  @Redirect('https://vstream-docs.vinion.dev', 302)
  @ApiResponse({
    status: 302,
    description: 'Successful redirect to https://vstream-docs.vinion.dev',
  })
  public getDoc() {}
}
