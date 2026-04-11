import { Test, TestingModule } from '@nestjs/testing';
import { WorkSessionsService } from './work-sessions.service';

describe('WorkSessionsService', () => {
  let service: WorkSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSessionsService],
    }).compile();

    service = module.get<WorkSessionsService>(WorkSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
