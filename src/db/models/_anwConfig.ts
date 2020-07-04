import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table
export default class _anwConfig extends Model<_anwConfig> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  value: string;
}
