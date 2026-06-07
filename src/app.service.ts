import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ("Hello World! c'est l'Assistant Logique de Poche, côté Backend, développé par Marcel ALLE");
  }
}
