import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  queueNumber: number;
  @Column()
  patientName: string;
  @Column({ default: 'waiting' })
  status: string; // waiting, with_doctor, completed
  @ManyToOne(() => Doctor, { nullable: true })
  doctor: Doctor;
}
