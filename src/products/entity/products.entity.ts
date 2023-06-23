import { Auth } from 'src/auth/entity/auth.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  createdAt: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  updatedAt: Date;

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => Auth, (auth) => auth.products)
  @JoinColumn({ name: 'userId' })
  user: Auth;
}
