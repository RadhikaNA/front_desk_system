import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  patientName: string;
  @Column()
  phone: string;
  @Column()
  date: string;
  @Column()
  timeslot: string;
  @Column({ default: 'booked' })
  status: string; // booked, completed, canceled
  @ManyToOne(() => Doctor, { nullable: true })
  doctor: Doctor;
}
