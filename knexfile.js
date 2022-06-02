module.exports = {
  test: {
    client: 'pg',
    version: '8.7',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'safePassword',
      database: 'barriga'
    },
    migrations: { directory: 'src/migrations' },
    seeds: { directory: 'src/seeds' },
  },
  prod: {
    client: 'pg',
    version: '8.7',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'safePassword',
      database: 'seubarriga'
    },
    migrations: { directory: 'src/migrations' },
  },
}; 