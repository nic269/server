import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  HasOne
} from 'sequelize-typescript';

// Models
import _anwResources from './_anwResources';
import MEMB_STAT from './MEMB_STAT';
import warehouse from './warehouse';
import T_VIPList from './T_VIPList';

@Table
export default class MEMB_INFO extends Model<MEMB_INFO> {
  @PrimaryKey
  @Column
  memb___id: string;

  @Column
  memb__pwd: string;

  @Column
  memb_name: string;

  @Default('unknown')
  @Column
  sno__numb: string;

  @Column
  mail_addr: string;

  @Default(0)
  @Column
  bloc_code: string;

  @Default(0)
  @Column
  ctl1_code: number;

  @Column
  reg_ip: string;

  @Column
  jwt_token: string;

  @Column
  admin_lvl: number;

  @HasOne(() => _anwResources, {
    sourceKey: 'memb___id',
    foreignKey: 'account'
  })
  resources: _anwResources;

  @HasOne(() => MEMB_STAT, {
    sourceKey: 'memb___id',
    foreignKey: 'memb___id'
  })
  status: MEMB_STAT;

  @HasOne(() => warehouse, {
    sourceKey: 'memb___id',
    foreignKey: 'AccountID'
  })
  warehouse: warehouse;

  @HasOne(() => T_VIPList, {
    sourceKey: 'memb___id',
    foreignKey: 'AccountID',
  })
  vip_info: T_VIPList;
}
