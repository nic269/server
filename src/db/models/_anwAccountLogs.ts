import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default
} from 'sequelize-typescript';

@Table
export default class _anwAccountLogs extends Model<_anwAccountLogs> {
  @PrimaryKey
  @Column
  account: string;

  @Column
  module: string;

  @Column
  timestamp: number;

  @Column
  message: string;

  @Default(null)
  @Column
  hidden: string;

  @Column
  ip: string;
}
