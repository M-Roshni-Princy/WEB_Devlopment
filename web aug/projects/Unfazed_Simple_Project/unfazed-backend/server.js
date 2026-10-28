import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const appointments = [];
const clients = [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', project: 'Unfazed' });
});

app.get('/api/appointments', (_req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const { name, email, date, time, reason } = req.body;
  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'Name, email, date and time are required.' });
  }
  const appointment = {
    id: Date.now().toString(),
    name,
    email,
    date,
    time,
    reason: reason || '',
    status: 'Pending'
  };
  appointments.push(appointment);
  if (!clients.some((client) => client.email === email)) {
    clients.push({ id: Date.now().toString(), name, email });
  }
  res.status(201).json(appointment);
});

app.get('/api/clients', (_req, res) => {
  res.json(clients);
});

app.listen(PORT, () => {
  console.log(`Unfazed API running at http://localhost:${PORT}`);
});
