import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { Appointment } from '../entities/appointment.entity';
import { QueueEntry } from '../entities/queue.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Doctor) private doctors: Repository<Doctor>,
    @InjectRepository(Appointment) private appointments: Repository<Appointment>,
    @InjectRepository(QueueEntry) private queueRepo: Repository<QueueEntry>,
  ) {
    // Seed sample doctors on service init if none exist
    (async () => {
      const cnt = await this.doctors.count();
      if (cnt === 0) {
        await this.doctors.save(
          this.doctors.create({
            name: 'Dr. Asha',
            specialization: 'General',
            location: 'Floor 1',
            availability: ['09:00-12:00', '14:00-17:00'],
          }),
        );
        await this.doctors.save(
          this.doctors.create({
            name: 'Dr. Rahul',
            specialization: 'Dermatology',
            location: 'Floor 2',
            availability: ['10:00-13:00'],
          }),
        );
        console.log('Seeded sample doctors');
      }
    })();
  }

  // Doctors with filtering support
  async listDoctors(filters?: {
    specialization?: string;
    location?: string;
    availability?: string;
  }) {
    const query = this.doctors.createQueryBuilder('doctor');

    if (filters?.specialization) {
      query.andWhere('doctor.specialization = :specialization', { specialization: filters.specialization });
    }
    if (filters?.location) {
      query.andWhere('doctor.location = :location', { location: filters.location });
    }
    if (filters?.availability) {
      // For MySQL with simple-array storing availability as CSV strings, use LIKE
      query.andWhere('doctor.availability LIKE :availability', { availability: `%${filters.availability}%` });
    }

    return query.getMany();
  }

  createDoctor(d: Partial<Doctor>) {
    const doctor = this.doctors.create(d);
    return this.doctors.save(doctor);
  }

  async updateDoctor(id: number, d: Partial<Doctor>) {
    await this.doctors.update(id, d);
    return this.doctors.findOneBy({ id });
  }

  removeDoctor(id: number) {
    return this.doctors.delete(id);
  }

  // Appointments
  listAppointments() {
    return this.appointments.find({ relations: ['doctor'] });
  }

  createAppointment(a: Partial<Appointment>) {
    const appointment = this.appointments.create(a);
    return this.appointments.save(appointment);
  }

  async updateAppointment(id: number, a: Partial<Appointment>) {
    await this.appointments.update(id, a);
    return this.appointments.findOne({ where: { id }, relations: ['doctor'] });
  }

  deleteAppointment(id: number) {
    return this.appointments.delete(id);
  }

  // Queue
  async listQueue() {
    return this.queueRepo.find({ relations: ['doctor'], order: { queueNumber: 'ASC' } });
  }

  async addQueue(q: { patientName: string }) {
    // Compute next queue number
    const last = await this.queueRepo.find({ order: { queueNumber: 'DESC' }, take: 1 });
    const next = last.length ? last[0].queueNumber + 1 : 1;
    const entry = this.queueRepo.create({ queueNumber: next, patientName: q.patientName, status: 'waiting' });
    return this.queueRepo.save(entry);
  }

  async updateQueue(id: number, q: Partial<QueueEntry>) {
    await this.queueRepo.update(id, q);
    return this.queueRepo.findOne({ where: { id }, relations: ['doctor'] });
  }
}
