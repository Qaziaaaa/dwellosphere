import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('api/v1/bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.bookingService.create(dto, req.user.id);
  }

  @Get('my')
  myBookings(@Req() req: any) {
    return this.bookingService.findByTenant(req.user.id);
  }

  @Get('agent')
  @UseGuards(RolesGuard)
  @Roles('agent', 'admin')
  agentBookings(@Req() req: any) {
    return this.bookingService.findByAgent(req.user.id);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: any) {
    return this.bookingService.updateStatus(id, dto, req.user.id, req.user.role);
  }
}
