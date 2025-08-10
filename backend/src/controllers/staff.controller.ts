import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { StaffService } from '../services/staff.service';

@Controller()
export class StaffController {
  constructor(private svc: StaffService) {}

  // Doctors
  @Get('doctors')
  listDoctors(
    @Query('specialization') specialization?: string,
    @Query('location') location?: string,
    @Query('availability') availability?: string,
  ) {
    return this.svc.listDoctors({ specialization, location, availability });
  }

  @Post('doctors')
  createDoctor(@Body() d) {
    return this.svc.createDoctor(d);
  }

  @Put('doctors/:id')
  updateDoctor(@Param('id') id, @Body() d) {
    return this.svc.updateDoctor(Number(id), d);
  }

  @Delete('doctors/:id')
  removeDoctor(@Param('id') id) {
    return this.svc.removeDoctor(Number(id));
  }

  // Appointments
  @Get('appointments')
  listAppointments() {
    return this.svc.listAppointments();
  }

  @Post('appointments')
  createAppointment(@Body() a) {
    return this.svc.createAppointment(a);
  }

  @Put('appointments/:id')
  updateAppointment(@Param('id') id, @Body() a) {
    return this.svc.updateAppointment(Number(id), a);
  }

  @Delete('appointments/:id')
  deleteAppointment(@Param('id') id) {
    return this.svc.deleteAppointment(Number(id));
  }

  // Queue
  @Get('queue')
  listQueue() {
    return this.svc.listQueue();
  }

  @Post('queue')
  addQueue(@Body() q) {
    return this.svc.addQueue(q);
  }

  @Put('queue/:id')
  updateQueue(@Param('id') id, @Body() q) {
    return this.svc.updateQueue(Number(id), q);
  }
}
