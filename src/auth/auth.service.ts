import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/role.enum';
import { LoginDto } from './dto/login.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private companiesService: CompaniesService,
  ) {}
  
  async register(dto: RegisterDto) {
    this.logger.log(`Registering user ${dto.email}`);

    const user = await this.usersService.createUser({
      name: dto.email,
      email: dto.email,
      role: Role.ADMIN,
      password: dto.password,
    });

    await this.companiesService.createCompany({
      name: dto.companyName,
      address: dto.companyAddress,
      owner: user.user,
    });

    return { message: user.message };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Logging in user ${dto.email}`);
    
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User ${dto.email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      this.logger.warn(`Invalid credentials for user ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, companyId: user.role === Role.ADMIN ? user.ownedCompany.id : user.company.id };

    this.logger.log(`User ${dto.email} logged in successfully`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
