const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Indian names for users
const indianUsers = [
  {
    email: 'priya.sharma@example.com',
    username: 'priyasharma',
    name: 'Priya Sharma',
    bio: 'Full-stack developer passionate about React and Node.js',
    points: 12543,
  },
  {
    email: 'rahul.kumar@example.com',
    username: 'rahulkumar',
    name: 'Rahul Kumar',
    bio: 'DevOps engineer | Cloud architect | Open source enthusiast',
    points: 10234,
  },
  {
    email: 'ananya.patel@example.com',
    username: 'ananyapatel',
    name: 'Ananya Patel',
    bio: 'AI/ML researcher exploring the frontiers of deep learning',
    points: 8976,
  },
  {
    email: 'arjun.singh@example.com',
    username: 'arjunsingh',
    name: 'Arjun Singh',
    bio: 'Backend developer specializing in microservices',
    points: 7654,
  },
  {
    email: 'kavya.reddy@example.com',
    username: 'kavyareddy',
    name: 'Kavya Reddy',
    bio: 'Frontend developer | UI/UX enthusiast',
    points: 6543,
  },
];

async function main() {
  console.log('🌱 Starting database seed with Indian names...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.savedQuestion.deleteMany();
  await prisma.questionTag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users with Indian names
  const users = await Promise.all(
    indianUsers.map((userData) =>
      prisma.user.create({
        data: {
          ...userData,
          password: bcrypt.hashSync('password123', 10),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
          isOnline: Math.random() > 0.5,
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} users with Indian names`);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React', description: 'A JavaScript library for building user interfaces' } }),
    prisma.tag.create({ data: { name: 'Node.js', description: 'JavaScript runtime built on Chrome\'s V8 engine' } }),
    prisma.tag.create({ data: { name: 'TypeScript', description: 'Typed superset of JavaScript' } }),
    prisma.tag.create({ data: { name: 'JavaScript', description: 'High-level programming language' } }),
    prisma.tag.create({ data: { name: 'Python', description: 'General-purpose programming language' } }),
    prisma.tag.create({ data: { name: 'Docker', description: 'Platform for containerized applications' } }),
    prisma.tag.create({ data: { name: 'AWS', description: 'Amazon Web Services cloud platform' } }),
    prisma.tag.create({ data: { name: 'Database', description: 'Data storage and management systems' } }),
    prisma.tag.create({ data: { name: 'MongoDB', description: 'Document-oriented NoSQL database' } }),
    prisma.tag.create({ data: { name: 'PostgreSQL', description: 'Open source relational database' } }),
  ]);

  console.log('✅ Created tags');

  // Create badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Gold Contributor',
        description: 'Contributed 100+ high-quality answers',
        icon: '🏆',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'React Expert',
        description: 'Master of React development',
        icon: '⚛️',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'DevOps Master',
        description: 'Expert in DevOps practices',
        icon: '🔧',
      },
    }),
  ]);

  console.log('✅ Created badges');

  // Assign badges to users
  await prisma.userBadge.createMany({
    data: [
      { userId: users[0].id, badgeId: badges[0].id },
      { userId: users[0].id, badgeId: badges[1].id },
      { userId: users[1].id, badgeId: badges[2].id },
    ],
  });

  console.log('✅ Assigned badges to users');

  // Sample questions with realistic content
  const questionTemplates = [
    {
      title: 'How to implement infinite scroll with React Query?',
      content: "I'm building a feed that needs to load more content as the user scrolls. What's the best approach combining React Query with intersection observer? I want to ensure good performance and user experience.",
      preview: "I'm building a feed that needs to load more content as the user scrolls.",
      tagIndex: 0,
      views: 234,
      isSolved: false,
    },
    {
      title: 'React Context vs Redux - When to use which?',
      content: 'I am confused about when to use React Context API and when to use Redux. Can someone explain the use cases and performance implications of both?',
      preview: 'I am confused about when to use React Context API and when to use Redux.',
      tagIndex: 0,
      views: 456,
      isSolved: true,
    },
    {
      title: 'Best practices for error handling in Express.js',
      content: 'Looking for a comprehensive error handling strategy for my Express application. How should I structure error middleware and handle async errors?',
      preview: 'Looking for a comprehensive error handling strategy for my Express application.',
      tagIndex: 1,
      views: 178,
      isSolved: true,
    },
    {
      title: 'TypeScript generics explained',
      content: 'Can someone explain TypeScript generics with practical examples? When and how should I use them effectively?',
      preview: 'Can someone explain TypeScript generics with practical examples?',
      tagIndex: 2,
      views: 523,
      isSolved: true,
    },
    {
      title: 'JavaScript closures explained simply',
      content: 'Can someone explain closures in JavaScript in simple terms? I keep seeing this concept but struggle to understand it.',
      preview: 'Can someone explain closures in JavaScript in simple terms?',
      tagIndex: 3,
      views: 678,
      isSolved: true,
    },
  ];

  // Create 50 questions
  const questions = [];
  for (let i = 0; i < 50; i++) {
    const template = questionTemplates[i % questionTemplates.length];
    const userIndex = i % users.length;
    const tagIndex = i % tags.length;

    const question = await prisma.question.create({
      data: {
        title: `${template.title} (${i + 1})`,
        content: template.content,
        preview: template.preview,
        authorId: users[userIndex].id,
        views: Math.floor(Math.random() * 1000) + 100,
        isSolved: Math.random() > 0.5,
        tags: {
          create: [{ tagId: tags[tagIndex].id }],
        },
      },
    });
    questions.push(question);
  }

  console.log(`✅ Created ${questions.length} questions`);

  // Create answers for some questions
  const answers = [];
  for (let i = 0; i < 20; i++) {
    const questionIndex = i % questions.length;
    const userIndex = (i + 1) % users.length; // Different user than question author

    const answer = await prisma.answer.create({
      data: {
        content: `This is a detailed answer to the question. Here's my solution based on my experience...\n\nKey points:\n1. First approach\n2. Second approach\n3. Best practices\n\nHope this helps!`,
        questionId: questions[questionIndex].id,
        authorId: users[userIndex].id,
        isAccepted: i % 5 === 0, // Every 5th answer is accepted
      },
    });
    answers.push(answer);
  }

  console.log(`✅ Created ${answers.length} answers`);

  // Create votes
  const votes = [];
  for (let i = 0; i < 100; i++) {
    const questionIndex = i % questions.length;
    const userIndex = i % users.length;
    const value = Math.random() > 0.3 ? 1 : -1; // 70% upvotes, 30% downvotes

    try {
      await prisma.vote.create({
        data: {
          userId: users[userIndex].id,
          questionId: questions[questionIndex].id,
          value,
        },
      });
      votes.push({ questionIndex, userIndex, value });
    } catch (error) {
      // Skip if duplicate vote
    }
  }

  console.log(`✅ Created ${votes.length} votes`);

  // Create comments
  const comments = [];
  for (let i = 0; i < 30; i++) {
    const questionIndex = i % questions.length;
    const userIndex = i % users.length;

    const comment = await prisma.comment.create({
      data: {
        content: `Great question! I had the same issue. ${['Thanks for asking!', 'Looking forward to answers.', 'This helped me too!'][i % 3]}`,
        userId: users[userIndex].id,
        questionId: questions[questionIndex].id,
      },
    });
    comments.push(comment);
  }

  console.log(`✅ Created ${comments.length} comments`);

  console.log('🎉 Database seeded successfully with Indian names!');
  console.log(`\n📊 Summary:`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Questions: ${questions.length}`);
  console.log(`   Answers: ${answers.length}`);
  console.log(`   Votes: ${votes.length}`);
  console.log(`   Comments: ${comments.length}`);
  console.log(`   Tags: ${tags.length}`);
  console.log(`   Badges: ${badges.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
