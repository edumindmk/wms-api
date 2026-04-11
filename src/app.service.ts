import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Edumind Students!';
  }

  getStudents(): string[] {
    return ['John', 'Jane', 'Jim', 'Jill'];
  }
}
