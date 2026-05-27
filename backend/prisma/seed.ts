import { PrismaClient, IssuanceStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  console.log('🧹 Clearing old data...');
  await prisma.issuance.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Generate 10 Members
  console.log('👥 Creating 10 members...');
  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: 'Sarah Connor',
        email: 'sarah.connor@sky.net',
        phone: '+1-555-0199',
        membershipDate: new Date('2025-01-15T08:00:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        phone: '+1-555-0101',
        membershipDate: new Date('2025-02-10T09:30:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@yahoo.com',
        phone: '+1-555-0102',
        membershipDate: new Date('2025-02-15T11:00:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Alex Mercer',
        email: 'alex.mercer@gentek.org',
        phone: '+1-555-0244',
        membershipDate: new Date('2025-03-01T14:15:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        phone: '+1-555-0911',
        membershipDate: new Date('2025-03-10T10:00:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Clark Kent',
        email: 'clark.kent@dailyplanet.com',
        phone: '+1-555-0777',
        membershipDate: new Date('2025-03-15T09:00:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Peter Parker',
        email: 'peter.parker@bugle.com',
        phone: '+1-555-0616',
        membershipDate: new Date('2025-04-01T15:45:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Diana Prince',
        email: 'diana@themyscira.gov',
        phone: '+1-555-0001',
        membershipDate: new Date('2025-04-05T08:30:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Tony Stark',
        email: 'tony@starkindustries.com',
        phone: '+1-555-3000',
        membershipDate: new Date('2025-04-20T16:00:00Z'),
      },
    }),
    prisma.member.create({
      data: {
        name: 'Steve Rogers',
        email: 'srogers@shieldup.org',
        phone: '+1-555-1941',
        membershipDate: new Date('2025-05-01T07:15:00Z'),
      },
    }),
  ]);

  // 3. Generate 20 Books
  console.log('📚 Creating 20 books...');
  const books = await Promise.all([
    prisma.book.create({
      data: { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780261102217', quantity: 5, availableQuantity: 4 },
    }),
    prisma.book.create({
      data: { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', isbn: '9780261102354', quantity: 3, availableQuantity: 3 },
    }),
    prisma.book.create({
      data: { title: 'Clean Architecture', author: 'Robert C. Martin', isbn: '9780134494166', quantity: 4, availableQuantity: 3 },
    }),
    prisma.book.create({
      data: { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', quantity: 4, availableQuantity: 3 },
    }),
    prisma.book.create({
      data: { title: 'Design Patterns', author: 'Erich Gamma', isbn: '9780201633610', quantity: 2, availableQuantity: 1 },
    }),
    prisma.book.create({
      data: { title: '1984', author: 'George Orwell', isbn: '9780451524935', quantity: 6, availableQuantity: 5 },
    }),
    prisma.book.create({
      data: { title: 'Animal Farm', author: 'George Orwell', isbn: '9780451526342', quantity: 4, availableQuantity: 4 },
    }),
    prisma.book.create({
      data: { title: 'Brave New World', author: 'Aldous Huxley', isbn: '9780060850524', quantity: 3, availableQuantity: 2 },
    }),
    prisma.book.create({
      data: { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '9781451673319', quantity: 5, availableQuantity: 4 },
    }),
    prisma.book.create({
      data: { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780446310789', quantity: 5, availableQuantity: 5 },
    }),
    prisma.book.create({
      data: { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', quantity: 3, availableQuantity: 3 },
    }),
    prisma.book.create({
      data: { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', quantity: 3, availableQuantity: 2 },
    }),
    prisma.book.create({
      data: { title: 'Refactoring', author: 'Martin Fowler', isbn: '9780134757599', quantity: 2, availableQuantity: 2 },
    }),
    prisma.book.create({
      data: { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', quantity: 4, availableQuantity: 4 },
    }),
    prisma.book.create({
      data: { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', quantity: 2, availableQuantity: 2 },
    }),
    prisma.book.create({
      data: { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '9780062316097', quantity: 5, availableQuantity: 5 },
    }),
    prisma.book.create({
      data: { title: 'Homo Deus', author: 'Yuval Noah Harari', isbn: '9780062464316', quantity: 3, availableQuantity: 3 },
    }),
    prisma.book.create({
      data: { title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', quantity: 8, availableQuantity: 8 },
    }),
    prisma.book.create({
      data: { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', quantity: 4, availableQuantity: 4 },
    }),
    prisma.book.create({
      data: { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', quantity: 3, availableQuantity: 3 },
    }),
  ]);

  // 4. Generate Issuance Records
  console.log('📝 Creating issuance logs...');
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  await prisma.issuance.createMany({
    data: [
      // 1. Returned Issuance (Sarah Connor borrowed and returned 'The Hobbit')
      {
        memberId: members[0].id,
        bookId: books[0].id,
        issueDate: daysAgo(15),
        targetReturnDate: daysAgo(1),
        actualReturnDate: daysAgo(2),
        status: IssuanceStatus.RETURNED,
      },
      // 2. Active Overdue Issuance (John Doe borrowed 'Design Patterns', overdue by 3 days)
      {
        memberId: members[1].id,
        bookId: books[4].id,
        issueDate: daysAgo(10),
        targetReturnDate: daysAgo(3),
        actualReturnDate: null,
        status: IssuanceStatus.ISSUED,
      },
      // 3. Active Issuance (Jane Smith borrowed 'Clean Architecture', due in 5 days)
      {
        memberId: members[2].id,
        bookId: books[2].id,
        issueDate: daysAgo(9),
        targetReturnDate: daysFromNow(5),
        actualReturnDate: null,
        status: IssuanceStatus.ISSUED,
      },
      // 4. Active Issuance (Alex Mercer borrowed 'Designing Data-Intensive Applications', due in 10 days)
      {
        memberId: members[3].id,
        bookId: books[11].id,
        issueDate: daysAgo(4),
        targetReturnDate: daysFromNow(10),
        actualReturnDate: null,
        status: IssuanceStatus.ISSUED,
      },
      // 5. Returned Issuance (Bruce Wayne borrowed and returned 'Clean Code' in 2 days)
      {
        memberId: members[4].id,
        bookId: books[3].id,
        issueDate: daysAgo(5),
        targetReturnDate: daysFromNow(9),
        actualReturnDate: daysAgo(3),
        status: IssuanceStatus.RETURNED,
      },
      // 6. Active Issuance (Clark Kent borrowed 'Fahrenheit 451', due in 2 days)
      {
        memberId: members[5].id,
        bookId: books[8].id,
        issueDate: daysAgo(12),
        targetReturnDate: daysFromNow(2),
        actualReturnDate: null,
        status: IssuanceStatus.ISSUED,
      },
      // 7. Active Overdue Issuance (Peter Parker borrowed 'Brave New World', overdue by 5 days)
      {
        memberId: members[6].id,
        bookId: books[7].id,
        issueDate: daysAgo(15),
        targetReturnDate: daysAgo(5),
        actualReturnDate: null,
        status: IssuanceStatus.ISSUED,
      },
    ],
  });

  console.log('👤 Creating default Administrator...');
  const hashedPassword = bcrypt.hashSync('password123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@library.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
