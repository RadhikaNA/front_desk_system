import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  specialization: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  location: string;
  @Column('simple-array', { nullable: true })
  availability: string[]; // e.g. "09:00-12:00,14:00-17:00"
}
