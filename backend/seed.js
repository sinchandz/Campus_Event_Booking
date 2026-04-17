const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    const Booking = require('./models/Booking');
    await Booking.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin'
    });

    // Create student user
    const student = await User.create({
      name: 'Aryan Student',
      email: 'student@campus.edu',
      password: 'student123',
      role: 'student'
    });

    console.log('Users created:');
    console.log('  Admin  -> admin@campus.edu / admin123');
    console.log('  Student -> student@campus.edu / student123');

    // Create sample events
    const events = await Event.insertMany([
      {
        title: 'AI & Machine Learning Workshop',
        description: 'An intensive hands-on workshop covering the fundamentals of Artificial Intelligence and Machine Learning. Learn about neural networks, deep learning algorithms, and practical implementation using Python and TensorFlow. Suitable for beginners and intermediate programmers.',
        category: 'workshop',
        date: new Date('2026-05-10'),
        time: '10:00 AM - 4:00 PM',
        venue: 'Computer Science Lab - Block A',
        totalSeats: 60,
        bookedSeats: 12,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        createdBy: admin._id
      },
      {
        title: 'Annual Cultural Fest - Rhythm 2026',
        description: 'Join us for the biggest cultural extravaganza of the year! Featuring dance performances, music competitions, drama, stand-up comedy, and much more. Open to all departments. Food stalls and exciting prizes await!',
        category: 'cultural',
        date: new Date('2026-05-20'),
        time: '9:00 AM - 9:00 PM',
        venue: 'Main Auditorium & Campus Grounds',
        totalSeats: 500,
        bookedSeats: 142,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        createdBy: admin._id
      },
      {
        title: 'Cybersecurity Seminar',
        description: 'A comprehensive seminar on modern cybersecurity threats and defense strategies. Topics include ethical hacking, network security, data privacy, and career opportunities in cybersecurity. Guest speaker from leading tech company.',
        category: 'seminar',
        date: new Date('2026-05-15'),
        time: '2:00 PM - 5:00 PM',
        venue: 'Seminar Hall - Block B',
        totalSeats: 120,
        bookedSeats: 45,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        createdBy: admin._id
      },
      {
        title: 'Hackathon 2026 - Code Sprint',
        description: 'A 24-hour coding competition where teams of 3-4 compete to build innovative solutions for real-world problems. Mentors from top tech companies will be available. Amazing prizes including internship opportunities!',
        category: 'competition',
        date: new Date('2026-06-01'),
        time: '8:00 AM (24 hours)',
        venue: 'Innovation Center',
        totalSeats: 200,
        bookedSeats: 88,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        createdBy: admin._id
      },
      {
        title: 'Web Development Bootcamp',
        description: 'A 3-day intensive bootcamp covering modern web development with React, Node.js, and MongoDB. Build a full-stack project from scratch. Certificate provided upon completion.',
        category: 'workshop',
        date: new Date('2026-06-10'),
        time: '10:00 AM - 5:00 PM',
        venue: 'IT Lab - Block C',
        totalSeats: 40,
        bookedSeats: 35,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        createdBy: admin._id
      },
      {
        title: 'Entrepreneurship Summit',
        description: 'Connect with successful entrepreneurs and startup founders. Learn about fundraising, business models, and innovation. Pitch your own startup idea for a chance to win seed funding!',
        category: 'seminar',
        date: new Date('2026-06-15'),
        time: '9:00 AM - 6:00 PM',
        venue: 'Conference Hall',
        totalSeats: 150,
        bookedSeats: 67,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        createdBy: admin._id
      },
      {
        title: 'Inter-College Sports Meet',
        description: 'Annual inter-college sports competition featuring athletics, basketball, cricket, badminton, and more. Represent your college and compete for the championship trophy!',
        category: 'sports',
        date: new Date('2026-06-20'),
        time: '7:00 AM - 6:00 PM',
        venue: 'Sports Complex',
        totalSeats: 300,
        bookedSeats: 120,
        image: '/images/sports-events.jpg',
        createdBy: admin._id
      },
      {
        title: 'IoT & Robotics Exhibition',
        description: 'Showcase your IoT and robotics projects! Live demonstrations, competitions, and workshops on Arduino, Raspberry Pi, and robot programming. Best project wins exciting prizes.',
        category: 'tech',
        date: new Date('2026-07-01'),
        time: '10:00 AM - 4:00 PM',
        venue: 'Electronics Lab & Exhibition Hall',
        totalSeats: 80,
        bookedSeats: 25,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        createdBy: admin._id
      }
    ]);

    console.log(`${events.length} events created successfully!`);
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
