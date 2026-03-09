import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("fleet.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user',
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    date TEXT,
    client_name TEXT,
    car_model TEXT,
    rental_plan TEXT,
    start_date TEXT,
    end_date TEXT,
    payment REAL,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    model TEXT,
    type TEXT,
    status TEXT,
    last_service TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    content TEXT,
    timestamp TEXT,
    is_read INTEGER DEFAULT 0,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    priority TEXT
  );

  CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    action TEXT,
    target TEXT,
    timestamp TEXT
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)").run(
    "erik.serobyan20@gmail.com",
    "Erik Serobyan",
    "admin"
  );
}

const bookingCount = db.prepare("SELECT count(*) as count FROM bookings").get() as { count: number };
if (bookingCount.count === 0) {
  const sampleBookings = [
    ['BK-WZ1001', '2024-08-01', 'Alice Johnson', 'Toyota Corolla', '2 Days', '2024-08-01', '2024-08-02', 50.00, 'Returned'],
    ['BK-WZ1002', '2024-08-01', 'Bob Smith', 'Honda Civic', '7 Days', '2024-08-01', '2024-08-08', 350.00, 'Ongoing'],
    ['BK-WZ1003', '2024-08-02', 'Charlie Davis', 'Ford Focus', '31 Days', '2024-08-02', '2024-09-02', 1000.00, 'Ongoing'],
    ['BK-WZ1004', '2024-08-02', 'Diana White', 'Chevrolet Malibu', '1 Day', '2024-08-02', '2024-08-03', 50.00, 'Returned'],
    ['BK-WZ1005', '2024-08-03', 'Edward Green', 'Nissan Altima', '8 Days', '2024-08-03', '2024-08-10', 350.00, 'Ongoing'],
  ];
  const insertBooking = db.prepare("INSERT INTO bookings (id, date, client_name, car_model, rental_plan, start_date, end_date, payment, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  sampleBookings.forEach(b => insertBooking.run(...b));
}

const reminderCount = db.prepare("SELECT count(*) as count FROM reminders").get() as { count: number };
if (reminderCount.count === 0) {
  const sampleReminders = [
    ['Inspect and service the fleet vehicles.', '2024-08-10', 'high'],
    ['Update the car rental pricing plans for the upcoming season.', '2024-08-12', 'medium'],
    ['Review customer feedback and implement improvements.', '2024-08-15', 'low'],
  ];
  const insertReminder = db.prepare("INSERT INTO reminders (title, date, priority) VALUES (?, ?, ?)");
  sampleReminders.forEach(r => insertReminder.run(...r));
}

const carCount = db.prepare("SELECT count(*) as count FROM cars").get() as { count: number };
if (carCount.count === 0) {
  const sampleCars = [
    ['TX-101', 'Toyota Corolla', 'Sedan', 'Available', '2024-07-15', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=400'],
    ['HX-202', 'Honda Civic', 'Sedan', 'Rented', '2024-06-20', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400'],
    ['FX-303', 'Ford Focus', 'Hatchback', 'Rented', '2024-08-01', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400'],
    ['CX-404', 'Chevrolet Malibu', 'Sedan', 'Available', '2024-05-10', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400'],
    ['NX-505', 'Nissan Altima', 'Sedan', 'Rented', '2024-07-28', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400'],
  ];
  const insertCar = db.prepare("INSERT INTO cars (id, model, type, status, last_service, image) VALUES (?, ?, ?, ?, ?, ?)");
  sampleCars.forEach(c => insertCar.run(...c));
}

const driverCount = db.prepare("SELECT count(*) as count FROM drivers").get() as { count: number };
if (driverCount.count === 0) {
  const sampleDrivers = [
    ['John Doe', 'john.doe@example.com', '+1 234 567 890', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'],
    ['Jane Smith', 'jane.smith@example.com', '+1 987 654 321', 'On Duty', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'],
    ['Mike Ross', 'mike.ross@example.com', '+1 555 012 345', 'Inactive', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'],
  ];
  const insertDriver = db.prepare("INSERT INTO drivers (name, email, phone, status, avatar) VALUES (?, ?, ?, ?, ?)");
  sampleDrivers.forEach(d => insertDriver.run(...d));
}

const messageCount = db.prepare("SELECT count(*) as count FROM messages").get() as { count: number };
if (messageCount.count === 0) {
  const sampleMessages = [
    ['Alice Johnson', 'I would like to extend my booking for another 2 days.', '10:30 AM', 0, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'],
    ['Bob Smith', 'The car is making a strange noise. Can I swap it?', '11:45 AM', 0, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'],
    ['System', 'New booking received for BK-WZ1006.', '09:00 AM', 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=System'],
  ];
  const insertMessage = db.prepare("INSERT INTO messages (sender, content, timestamp, is_read, avatar) VALUES (?, ?, ?, ?, ?)");
  sampleMessages.forEach(m => insertMessage.run(...m));
}

const activityCount = db.prepare("SELECT count(*) as count FROM activity").get() as { count: number };
if (activityCount.count === 0) {
  const sampleActivity = [
    ['Alice Johnson', 'completed a booking for', 'Toyota Corolla (TX1234)', '10:15 AM'],
    ['Bob Smith', 'booking for', 'Honda Civic (HX5678) is pending payment', '11:30 AM'],
    ['Charlie Davis', 'started a monthly rental for', 'Ford Focus (FX9101)', '09:45 AM'],
    ['Diana White', 'returned the', 'Chevrolet Malibu (CX2345)', '02:20 PM'],
  ];
  const insertActivity = db.prepare("INSERT INTO activity (user_name, action, target, timestamp) VALUES (?, ?, ?, ?)");
  sampleActivity.forEach(a => insertActivity.run(...a));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, name } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) {
      db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)").run(email, name, 'user');
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }
    
    res.json(user);
  });

  app.get("/api/admin/stats", (req, res) => {
    res.json({
      revenue: 8450.00,
      bookings: 386,
      rented: 214,
      available: 89,
      revenueChange: 2.86,
      bookingsChange: 1.73,
      rentedChange: -2.86,
      availableChange: 3.45
    });
  });

  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings ORDER BY date DESC").all();
    res.json(bookings);
  });

  app.get("/api/admin/reminders", (req, res) => {
    const reminders = db.prepare("SELECT * FROM reminders ORDER BY date ASC").all();
    res.json(reminders);
  });

  app.get("/api/admin/activity", (req, res) => {
    const activity = db.prepare("SELECT * FROM activity ORDER BY id DESC").all();
    res.json(activity);
  });

  app.get("/api/admin/car-types", (req, res) => {
    res.json([
      { type: 'Sedan', percentage: 30, count: 120, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=200' },
      { type: 'SUV', percentage: 25, count: 100, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200' },
      { type: 'Hatchback', percentage: 20, count: 80, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=200' },
      { type: 'Convertible', percentage: 10, count: 40, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200' },
      { type: 'Truck', percentage: 10, count: 40, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200' },
      { type: 'Minivan', percentage: 5, count: 20, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=200' },
    ]);
  });

  app.get("/api/admin/clients", (req, res) => {
    res.json([
      { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', bookings: 12, status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', bookings: 5, status: 'Active' },
      { id: 3, name: 'Charlie Davis', email: 'charlie.davis@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', bookings: 8, status: 'Inactive' },
      { id: 4, name: 'Diana White', email: 'diana.white@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana', bookings: 15, status: 'Active' },
      { id: 5, name: 'Edward Green', email: 'edward.green@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edward', bookings: 3, status: 'Active' },
    ]);
  });

  app.get("/api/admin/units", (req, res) => {
    const units = db.prepare("SELECT * FROM cars").all();
    res.json(units);
  });

  app.get("/api/admin/drivers", (req, res) => {
    const drivers = db.prepare("SELECT * FROM drivers").all();
    res.json(drivers);
  });

  app.get("/api/admin/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY id DESC").all();
    res.json(messages);
  });

  app.get("/api/admin/tracking", (req, res) => {
    res.json([
      { id: 'TX-101', lat: 40.7128, lng: -74.0060, status: 'Moving', speed: '45 mph' },
      { id: 'HX-202', lat: 40.7306, lng: -73.9352, status: 'Parked', speed: '0 mph' },
      { id: 'FX-303', lat: 40.7589, lng: -73.9851, status: 'Moving', speed: '30 mph' },
    ]);
  });

  app.get("/api/admin/payments", (req, res) => {
    res.json([
      { id: 'INV-WZ1001', client: 'Alice Johnson', amount: 450.00, date: '2024-08-01', status: 'Completed' },
      { id: 'INV-WZ1002', client: 'Bob Smith', amount: 1200.00, date: '2024-08-02', status: 'Pending' },
      { id: 'INV-WZ1003', client: 'Charlie Davis', amount: 3500.00, date: '2024-08-03', status: 'Completed' },
      { id: 'INV-WZ1004', client: 'Diana White', amount: 900.00, date: '2024-08-04', status: 'Completed' },
      { id: 'INV-WZ1005', client: 'Edward Green', amount: 450.00, date: '2024-08-05', status: 'Pending' },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
