import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── College + Course Seed Data ──────────────────────────────────────────────

interface CourseSeed {
  name: string;
  fees: number;
  duration: number;
}

interface CollegeSeed {
  name: string;
  location: string;
  ranking: number;
  description: string;
  courses: CourseSeed[];
}

const colleges: CollegeSeed[] = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai, Maharashtra",
    ranking: 1,
    description:
      "IIT Bombay is one of India's premier engineering institutions, established in 1958. Known for cutting-edge research, world-class faculty, and a vibrant campus culture that produces global tech leaders.",
    courses: [
      { name: "B.Tech Computer Science", fees: 250000, duration: 4 },
      { name: "B.Tech Electrical Engineering", fees: 250000, duration: 4 },
      { name: "B.Tech Mechanical Engineering", fees: 250000, duration: 4 },
      { name: "M.Tech Data Science & AI", fees: 200000, duration: 2 },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi, Delhi",
    ranking: 2,
    description:
      "IIT Delhi is a public research university and one of the oldest IITs, established in 1961. It excels in engineering, technology, and management education with strong industry partnerships.",
    courses: [
      { name: "B.Tech Computer Science", fees: 240000, duration: 4 },
      { name: "B.Tech Civil Engineering", fees: 240000, duration: 4 },
      { name: "B.Tech Textile Technology", fees: 240000, duration: 4 },
      { name: "MBA", fees: 1000000, duration: 2 },
    ],
  },
  {
    name: "Indian Institute of Science",
    location: "Bengaluru, Karnataka",
    ranking: 3,
    description:
      "IISc Bengaluru, founded in 1909, is India's top research university. It specializes in science, engineering, and design, and is renowned for its doctoral programs and research output.",
    courses: [
      { name: "B.S. Physics", fees: 50000, duration: 4 },
      { name: "B.S. Chemistry", fees: 50000, duration: 4 },
      { name: "M.Tech Computational Science", fees: 35000, duration: 2 },
      { name: "M.Tech Electrical Communication", fees: 35000, duration: 2 },
      { name: "Ph.D. Nano Science", fees: 30000, duration: 5 },
    ],
  },
  {
    name: "Indian Institute of Technology Madras",
    location: "Chennai, Tamil Nadu",
    ranking: 4,
    description:
      "IIT Madras, established in 1959, is consistently ranked among India's top engineering institutes. It is known for its strong research culture, sprawling green campus, and thriving startup ecosystem.",
    courses: [
      { name: "B.Tech Computer Science", fees: 250000, duration: 4 },
      { name: "B.Tech Aerospace Engineering", fees: 250000, duration: 4 },
      { name: "B.Tech Biotechnology", fees: 250000, duration: 4 },
      { name: "M.Tech Artificial Intelligence", fees: 200000, duration: 2 },
    ],
  },
  {
    name: "Indian Institute of Technology Kanpur",
    location: "Kanpur, Uttar Pradesh",
    ranking: 5,
    description:
      "IIT Kanpur, founded in 1959, is a leader in science and engineering education in India. It was the first institute in India to offer Computer Science education and has a strong alumni network globally.",
    courses: [
      { name: "B.Tech Computer Science", fees: 230000, duration: 4 },
      { name: "B.Tech Chemical Engineering", fees: 230000, duration: 4 },
      { name: "B.Tech Industrial Engineering", fees: 230000, duration: 4 },
    ],
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    location: "Kharagpur, West Bengal",
    ranking: 6,
    description:
      "IIT Kharagpur, established in 1951, is the oldest and largest IIT. It offers the widest range of disciplines among all IITs and is home to India's first on-campus technology business incubator.",
    courses: [
      { name: "B.Tech Computer Science", fees: 220000, duration: 4 },
      { name: "B.Tech Mining Engineering", fees: 220000, duration: 4 },
      { name: "B.Tech Ocean Engineering", fees: 220000, duration: 4 },
      { name: "B.Arch Architecture", fees: 220000, duration: 5 },
      { name: "M.Tech Robotics", fees: 180000, duration: 2 },
    ],
  },
  {
    name: "Delhi University",
    location: "New Delhi, Delhi",
    ranking: 7,
    description:
      "The University of Delhi, established in 1922, is a premier central university offering a wide spectrum of programs in arts, science, commerce, and professional fields across its many prestigious colleges.",
    courses: [
      { name: "B.A. Honours Economics", fees: 35000, duration: 3 },
      { name: "B.Sc. Honours Physics", fees: 25000, duration: 3 },
      { name: "B.Com Honours", fees: 30000, duration: 3 },
      { name: "M.A. English Literature", fees: 20000, duration: 2 },
    ],
  },
  {
    name: "Jawaharlal Nehru University",
    location: "New Delhi, Delhi",
    ranking: 8,
    description:
      "JNU, established in 1969, is one of India's most prestigious universities for humanities, social sciences, and international studies. It is known for its intellectual rigor and vibrant campus discourse.",
    courses: [
      { name: "M.A. International Relations", fees: 15000, duration: 2 },
      { name: "M.A. Political Science", fees: 15000, duration: 2 },
      { name: "M.Sc. Environmental Sciences", fees: 15000, duration: 2 },
      { name: "B.A. Foreign Languages", fees: 12000, duration: 3 },
    ],
  },
  {
    name: "Birla Institute of Technology and Science Pilani",
    location: "Pilani, Rajasthan",
    ranking: 9,
    description:
      "BITS Pilani, founded in 1964, is a top private university known for its flexible academic system, strong industry ties through the Practice School program, and a highly accomplished alumni network.",
    courses: [
      { name: "B.E. Computer Science", fees: 500000, duration: 4 },
      { name: "B.E. Electronics & Instrumentation", fees: 500000, duration: 4 },
      { name: "B.Pharm Pharmacy", fees: 450000, duration: 4 },
      { name: "M.E. Software Systems", fees: 350000, duration: 2 },
    ],
  },
  {
    name: "Vellore Institute of Technology",
    location: "Vellore, Tamil Nadu",
    ranking: 10,
    description:
      "VIT, established in 1984, is one of India's top private engineering universities. It is known for its modern infrastructure, international collaborations, and a dedicated placement cell with top recruiters.",
    courses: [
      { name: "B.Tech Computer Science", fees: 400000, duration: 4 },
      { name: "B.Tech Information Technology", fees: 400000, duration: 4 },
      { name: "B.Tech Electronics & Communication", fees: 380000, duration: 4 },
    ],
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    location: "Tiruchirappalli, Tamil Nadu",
    ranking: 11,
    description:
      "NIT Trichy is one of the top National Institutes of Technology in India, established in 1964. It offers excellent engineering programs with a strong emphasis on research and industry collaboration.",
    courses: [
      { name: "B.Tech Computer Science", fees: 150000, duration: 4 },
      { name: "B.Tech Civil Engineering", fees: 150000, duration: 4 },
      { name: "B.Tech Instrumentation", fees: 150000, duration: 4 },
      { name: "M.Tech VLSI Design", fees: 100000, duration: 2 },
    ],
  },
  {
    name: "Jadavpur University",
    location: "Kolkata, West Bengal",
    ranking: 12,
    description:
      "Jadavpur University, established in 1955, is a prestigious public university in Kolkata renowned for its engineering, science, and arts programs. It consistently ranks among the top state universities in India.",
    courses: [
      { name: "B.E. Computer Science", fees: 20000, duration: 4 },
      { name: "B.E. Mechanical Engineering", fees: 20000, duration: 4 },
      { name: "B.A. Comparative Literature", fees: 8000, duration: 3 },
      { name: "M.E. Power Engineering", fees: 15000, duration: 2 },
    ],
  },
  {
    name: "Indian Institute of Technology Roorkee",
    location: "Roorkee, Uttarakhand",
    ranking: 13,
    description:
      "IIT Roorkee, originally established in 1847 as the Roorkee College, is one of the oldest technical institutions in Asia. It is known for civil, chemical, and earthquake engineering programs.",
    courses: [
      { name: "B.Tech Computer Science", fees: 240000, duration: 4 },
      { name: "B.Tech Civil Engineering", fees: 240000, duration: 4 },
      { name: "B.Tech Earthquake Engineering", fees: 240000, duration: 4 },
      { name: "B.Arch Architecture", fees: 240000, duration: 5 },
    ],
  },
  {
    name: "Anna University",
    location: "Chennai, Tamil Nadu",
    ranking: 14,
    description:
      "Anna University, established in 1978, is a state technical university and one of the largest in Tamil Nadu. It affiliates hundreds of engineering colleges and is known for its strong research in IT and engineering.",
    courses: [
      { name: "B.E. Computer Science", fees: 55000, duration: 4 },
      { name: "B.E. Electronics & Communication", fees: 55000, duration: 4 },
      { name: "B.E. Mechanical Engineering", fees: 55000, duration: 4 },
      { name: "M.E. Structural Engineering", fees: 45000, duration: 2 },
      { name: "M.E. Communication Systems", fees: 45000, duration: 2 },
    ],
  },
  {
    name: "Manipal Academy of Higher Education",
    location: "Manipal, Karnataka",
    ranking: 15,
    description:
      "MAHE Manipal, established in 1953, is a premier private university known for its medical, engineering, and management programs. It attracts students from over 80 countries and has a world-class campus.",
    courses: [
      { name: "B.Tech Computer Science", fees: 480000, duration: 4 },
      { name: "MBBS Medicine", fees: 1200000, duration: 5 },
      { name: "BBA Business Administration", fees: 350000, duration: 3 },
      { name: "B.Pharm Pharmacy", fees: 300000, duration: 4 },
    ],
  },
];

// ─── Main Seed Function ──────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🌱 Starting database seed...\n");

  // Step 1: Clear existing data (order matters due to FK constraints)
  console.log("🗑️  Clearing existing data...");
  await prisma.savedItem.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  console.log("   ✅ Cleared SavedItem, Course, and College tables.\n");

  // Step 2: Upsert demo user
  console.log("👤 Upserting demo user...");
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: { name: "Demo User" },
    create: {
      email: "demo@example.com",
      name: "Demo User",
    },
  });
  console.log(`   ✅ User: ${demoUser.name} (${demoUser.email})\n`);

  // Step 3: Create colleges with courses
  console.log("🏫 Seeding colleges and courses...");
  let totalCourses = 0;

  for (const collegeData of colleges) {
    const college = await prisma.college.create({
      data: {
        name: collegeData.name,
        location: collegeData.location,
        ranking: collegeData.ranking,
        description: collegeData.description,
        courses: {
          create: collegeData.courses,
        },
      },
      include: {
        courses: true,
      },
    });

    totalCourses += college.courses.length;
    console.log(
      `   ✅ #${college.ranking} ${college.name} — ${college.courses.length} courses`
    );
  }

  // Summary
  console.log("\n" + "─".repeat(60));
  console.log("🎉 Seed completed successfully!\n");
  console.log(`   📊 Summary:`);
  console.log(`      • Users:    1`);
  console.log(`      • Colleges: ${colleges.length}`);
  console.log(`      • Courses:  ${totalCourses}`);
  console.log("─".repeat(60) + "\n");
}

// ─── Execute ─────────────────────────────────────────────────────────────────

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
