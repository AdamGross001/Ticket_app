require('dotenv').config();
console.log('Database URL:', process.env.DATABASE_URL);

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;





//data base config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error', err));


//user registration
app.post('/register', async (req, res) => {
  try {
  const { username, surname, email, password } = req.body;

  // check if the user already exists
  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  //add user to the database
  await pool.query(
    'INSERT INTO users (name, surname, email, password_hash) VALUES ($1, $2, $3, $4)',
    [username, surname, email, hashedPassword]
  );

  res.status(201).json({ message: 'Użytkownik zarejestrowany' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//user login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Nieprawidłowe email lub hasło' });
    }

    const user = userResult.rows[0];

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nieprawidłowe email lub hasło' });
    }

    //create and sign JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, surname: user.surname, email: user.email, 
      role: user.role } });
  } catch (error) {
    console.error("bład w endpoint /login:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
} );
