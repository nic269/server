import {
  Table,
  Column,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export default class T_VIPList extends Model<T_VIPList> {
  @PrimaryKey
  @Column
  AccountID: string;

  @Column
  Date: string;

  @Column
  Type: number;
}
