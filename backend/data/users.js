import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'Razvan Daniel',
    email: 'razvan@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Example Client',
    email: 'example@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Example Client Two',
    email: 'example2@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Example Client Three',
    email: 'example3@example.com',
    password: bcrypt.hashSync('123456', 10),
  },

]

export default users;