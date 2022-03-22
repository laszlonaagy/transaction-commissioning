import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: false })
  client_id: number;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  commission: number;

  @Column({ nullable: false })
  base_currency: string;

  @Column({ nullable: false })
  base_amount: number;
}
