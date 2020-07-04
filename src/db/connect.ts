import { Sequelize } from 'sequelize-typescript';

// Models
import model from './models';

const dbConnect = () => {
  let connection: any;
  try {
    connection = new Sequelize({
      username: 'sa',
      password: 'TuanAnh123',
      host: 'anhn.sytes.net',
      port: 1433,
      database: 'MuOnline',
      dialect: 'mssql',
      dialectOptions: {
        options: {
          trustServerCertificate: true,
        }
      },
      define: {
        freezeTableName: true,
        timestamps: false
      },
      logging: false,
      models: Object.values(model),
    });

    console.log('Database connected...');
  } catch (error) {
    console.log('Database failed to connect...');
  }

  return connection;
};

const databases = dbConnect();

export default databases;
