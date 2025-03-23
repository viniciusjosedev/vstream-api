import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RedirectController {
  @Get('/')
  @Redirect('https://vstream-docs.vinion.dev', 302)
  public getDoc() {}
}
