import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Appointment } from './entities/appointment.entity';
import { QueueEntry } from './entities/queue.entity';
import { AuthController } from './controllers/auth.controller';
import { StaffController } from './controllers/staff.controller';
import { AuthService } from './services/auth.service';
import { StaffService } from './services/staff.service';
@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || 3306),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'frontdesk',
      entities: [User, Doctor, Appointment, QueueEntry],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Doctor, Appointment, QueueEntry])
  ],
  controllers:[AuthController, StaffController],
  providers:[AuthService, StaffService]
})
export class AppModule {}
