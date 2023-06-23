import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Products } from 'src/products/entity/products.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Auth {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @IsOptional()
  @Column({ nullable: true })
  hashedRt: string;

  @OneToMany(()=>Products,product => product.user)
  products:Products[];
}
