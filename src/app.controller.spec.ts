import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the app welcome message', () => {
      expect(appController.getHello()).toBe(
        "Hello World! c'est l'Assistant Logique de Poche, côté Backend, développé par Marcel ALLE",
      );
    });
  });
});
