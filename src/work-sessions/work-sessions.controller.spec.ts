import { Test, TestingModule } from '@nestjs/testing';
import { WorkSessionsController } from './work-sessions.controller';
import { WorkSessionsService } from './work-sessions.service';

describe('WorkSessionsController', () => {
  let controller: WorkSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSessionsController],
      providers: [WorkSessionsService],
    }).compile();

    controller = module.get<WorkSessionsController>(WorkSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
