// Update with your config settings.
const path = require('path')

if (process.env.NODE_ENV !== 'test')
  require('dotenv').load()

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://localhost/${process.env.DATABASE_NAME}`,
    migrations: {
      directory: path.join(__dirname, 'migrations')
    }
  },
  test: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`,
    migrations: {
      directory: path.join(__dirname, 'migrations')
    }
  }
};
