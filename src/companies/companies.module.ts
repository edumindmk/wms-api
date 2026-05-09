import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), forwardRef(() => UsersModule)],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
