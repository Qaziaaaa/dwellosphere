import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [PrismaModule, AuthModule, PropertyModule, BookingModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    },
  ],
})
export class AppModule {}
