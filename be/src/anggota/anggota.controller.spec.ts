import { Test, TestingModule } from '@nestjs/testing';
import { AnggotaController } from './anggota.controller';

describe('AnggotaController', () => {
  let controller: AnggotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnggotaController],
    }).compile();

    controller = module.get<AnggotaController>(AnggotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
