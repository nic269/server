import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript';

@Table
export default class _anwNews extends Model<_anwNews> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  account: string;

  @Column
  author: string;

  @Column
  title: string;

  @Column
  content: string;

  @Column
  timestamp: number;

  @Column
  ip: string;
}
