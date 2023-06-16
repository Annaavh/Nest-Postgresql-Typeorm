import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config:TypeOrmModuleOptions={
    type:'postgres',
    host:"localhost",
    port:5432,
    username:'postgres',
    password:'postgres',
    database:'auth_db',
    entities:[__dirname + '/../**/*.entity.{js,ts}'],
    synchronize:true,
};

export default config;