const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'emma@example.com',
        username: 'emmawatson',
        name: 'Emma Watson',
        password: await bcrypt.hash('password123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        bio: 'Full-stack developer passionate about React and Node.js',
        points: 12543,
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'johndoe',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        bio: 'DevOps engineer | Cloud architect | Open source enthusiast',
        points: 10234,
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa@example.com',
        username: 'lisapark',
        name: 'Lisa Park',
        password: await bcrypt.hash('password123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        bio: 'AI/ML researcher exploring the frontiers of deep learning',
        points: 8976,
        isOnline: false,
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React' } }),
    prisma.tag.create({ data: { name: 'Node.js' } }),
    prisma.tag.create({ data: { name: 'TypeScript' } }),
    prisma.tag.create({ data: { name: 'JavaScript' } }),
    prisma.tag.create({ data: { name: 'Python' } }),
    prisma.tag.create({ data: { name: 'Docker' } }),
    prisma.tag.create({ data: { name: 'AWS' } }),
    prisma.tag.create({ data: { name: 'Database' } }),
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

  // Create sample questions - React (10 questions)
  const reactQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'How to implement infinite scroll with React Query?',
        content: "I'm building a feed that needs to load more content as the user scrolls. What's the best approach combining React Query with intersection observer? I want to ensure good performance and user experience.",
        preview: "I'm building a feed that needs to load more content as the user scrolls. What's the best approach combining React Query with intersection observer?",
        authorId: users[0].id,
        views: 234,
        isSolved: false,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'React Context vs Redux - When to use which?',
        content: 'I am confused about when to use React Context API and when to use Redux. Can someone explain the use cases and performance implications of both?',
        preview: 'I am confused about when to use React Context API and when to use Redux.',
        authorId: users[1].id,
        views: 456,
        isSolved: true,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'How to optimize React app performance?',
        content: 'My React application is getting slow with large datasets. What are the best practices for optimization? Should I use useMemo, useCallback, or React.memo?',
        preview: 'My React application is getting slow with large datasets. What are the best practices for optimization?',
        authorId: users[2].id,
        views: 389,
        isSolved: false,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'React Server Components explained',
        content: 'What are React Server Components and how do they differ from client components? When should I use them in Next.js 13+?',
        preview: 'What are React Server Components and how do they differ from client components?',
        authorId: users[0].id,
        views: 567,
        isSolved: true,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Managing form state in React',
        content: 'What is the best way to handle complex forms in React? Should I use react-hook-form, Formik, or build my own solution?',
        preview: 'What is the best way to handle complex forms in React?',
        authorId: users[1].id,
        views: 298,
        isSolved: false,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'React useEffect cleanup function',
        content: 'When and why do I need to return a cleanup function from useEffect? Can you provide real-world examples?',
        preview: 'When and why do I need to return a cleanup function from useEffect?',
        authorId: users[2].id,
        views: 412,
        isSolved: true,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Testing React components with Jest',
        content: 'What are the best practices for testing React components? Should I use testing-library or Enzyme? How do I test hooks?',
        preview: 'What are the best practices for testing React components?',
        authorId: users[0].id,
        views: 334,
        isSolved: false,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'React Router v6 protected routes',
        content: 'How do I implement protected routes in React Router v6? The old Redirect component is deprecated.',
        preview: 'How do I implement protected routes in React Router v6?',
        authorId: users[1].id,
        views: 521,
        isSolved: true,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Custom hooks best practices',
        content: 'What are the rules and best practices for creating custom hooks in React? How do I avoid common pitfalls?',
        preview: 'What are the rules and best practices for creating custom hooks in React?',
        authorId: users[2].id,
        views: 267,
        isSolved: false,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'React Suspense and lazy loading',
        content: 'How does React.lazy and Suspense work? What are the best practices for code splitting in large applications?',
        preview: 'How does React.lazy and Suspense work?',
        authorId: users[0].id,
        views: 445,
        isSolved: true,
        tags: { create: [{ tagId: tags[0].id }] },
      },
    }),
  ]);

  // Node.js questions (10 questions)
  const nodejsQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Best practices for error handling in Express.js middleware',
        content: 'Looking for a comprehensive error handling strategy for my Express application. How should I structure error middleware and handle async errors? What about validation errors and custom error types?',
        preview: 'Looking for a comprehensive error handling strategy for my Express application.',
        authorId: users[1].id,
        views: 178,
        isSolved: true,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Node.js vs Deno - Should I switch?',
        content: 'What are the main differences between Node.js and Deno? Is it worth migrating existing projects to Deno?',
        preview: 'What are the main differences between Node.js and Deno?',
        authorId: users[0].id,
        views: 345,
        isSolved: false,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Implementing JWT authentication in Node.js',
        content: 'How do I properly implement JWT authentication with refresh tokens in a Node.js/Express application? What are the security best practices?',
        preview: 'How do I properly implement JWT authentication with refresh tokens in a Node.js/Express application?',
        authorId: users[2].id,
        views: 612,
        isSolved: true,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Node.js streams and buffers explained',
        content: 'Can someone explain Node.js streams and buffers with practical examples? When should I use them?',
        preview: 'Can someone explain Node.js streams and buffers with practical examples?',
        authorId: users[1].id,
        views: 289,
        isSolved: false,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Handling file uploads in Express',
        content: 'What is the best way to handle large file uploads in Express.js? Should I use multer, busboy, or something else?',
        preview: 'What is the best way to handle large file uploads in Express.js?',
        authorId: users[0].id,
        views: 423,
        isSolved: true,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Node.js clustering and load balancing',
        content: 'How do I implement clustering in Node.js to utilize multiple CPU cores? What about PM2 vs native cluster module?',
        preview: 'How do I implement clustering in Node.js to utilize multiple CPU cores?',
        authorId: users[2].id,
        views: 356,
        isSolved: false,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'WebSocket implementation with Socket.io',
        content: 'Best practices for implementing real-time features using Socket.io in Node.js? How to handle reconnections and scaling?',
        preview: 'Best practices for implementing real-time features using Socket.io in Node.js?',
        authorId: users[1].id,
        views: 498,
        isSolved: true,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Node.js memory leaks detection',
        content: 'My Node.js application has memory leaks. What tools and techniques should I use to identify and fix them?',
        preview: 'My Node.js application has memory leaks. What tools should I use?',
        authorId: users[0].id,
        views: 567,
        isSolved: false,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Rate limiting in Express APIs',
        content: 'How do I implement rate limiting in my Express API? What are the different strategies and their trade-offs?',
        preview: 'How do I implement rate limiting in my Express API?',
        authorId: users[2].id,
        views: 312,
        isSolved: true,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Node.js microservices architecture',
        content: 'What are the best practices for building microservices with Node.js? How to handle inter-service communication?',
        preview: 'What are the best practices for building microservices with Node.js?',
        authorId: users[1].id,
        views: 445,
        isSolved: false,
        tags: { create: [{ tagId: tags[1].id }] },
      },
    }),
  ]);

  // TypeScript questions (10 questions)
  const typescriptQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'TypeScript generics explained',
        content: 'Can someone explain TypeScript generics with practical examples? When and how should I use them effectively?',
        preview: 'Can someone explain TypeScript generics with practical examples?',
        authorId: users[0].id,
        views: 523,
        isSolved: true,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Type guards vs Type assertions',
        content: 'What is the difference between type guards and type assertions in TypeScript? When should I use each?',
        preview: 'What is the difference between type guards and type assertions in TypeScript?',
        authorId: users[1].id,
        views: 378,
        isSolved: false,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'TypeScript utility types',
        content: 'What are the most useful built-in utility types in TypeScript? Can you provide examples of Partial, Pick, Omit, etc.?',
        preview: 'What are the most useful built-in utility types in TypeScript?',
        authorId: users[2].id,
        views: 456,
        isSolved: true,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Strict mode in TypeScript',
        content: 'Should I always use strict mode in TypeScript? What are the benefits and challenges of enabling it?',
        preview: 'Should I always use strict mode in TypeScript?',
        authorId: users[0].id,
        views: 289,
        isSolved: false,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'TypeScript with React best practices',
        content: 'What are the best practices for using TypeScript with React? How to properly type props, state, and hooks?',
        preview: 'What are the best practices for using TypeScript with React?',
        authorId: users[1].id,
        views: 612,
        isSolved: true,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Interface vs Type in TypeScript',
        content: 'When should I use interface vs type in TypeScript? What are the practical differences?',
        preview: 'When should I use interface vs type in TypeScript?',
        authorId: users[2].id,
        views: 534,
        isSolved: false,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'TypeScript decorators',
        content: 'How do decorators work in TypeScript? Are they stable now and what are practical use cases?',
        preview: 'How do decorators work in TypeScript?',
        authorId: users[0].id,
        views: 401,
        isSolved: true,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Handling async operations in TypeScript',
        content: 'Best practices for typing async functions and promises in TypeScript? How to handle errors properly?',
        preview: 'Best practices for typing async functions and promises in TypeScript?',
        authorId: users[1].id,
        views: 367,
        isSolved: false,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'TypeScript namespace vs modules',
        content: 'Should I use namespaces or ES6 modules in TypeScript? What are the modern best practices?',
        preview: 'Should I use namespaces or ES6 modules in TypeScript?',
        authorId: users[2].id,
        views: 298,
        isSolved: true,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'TypeScript configuration for production',
        content: 'What should my tsconfig.json look like for a production application? What compiler options are essential?',
        preview: 'What should my tsconfig.json look like for a production application?',
        authorId: users[0].id,
        views: 445,
        isSolved: false,
        tags: { create: [{ tagId: tags[2].id }] },
      },
    }),
  ]);

  // JavaScript questions (10 questions)
  const javascriptQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'JavaScript closures explained simply',
        content: 'Can someone explain closures in JavaScript in simple terms? I keep seeing this concept but struggle to understand it.',
        preview: 'Can someone explain closures in JavaScript in simple terms?',
        authorId: users[1].id,
        views: 678,
        isSolved: true,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Promises vs async/await',
        content: 'What are the differences between Promises and async/await in JavaScript? Which approach is better?',
        preview: 'What are the differences between Promises and async/await?',
        authorId: users[0].id,
        views: 534,
        isSolved: false,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'JavaScript event loop explained',
        content: 'How does the JavaScript event loop work? Can you explain with examples of setTimeout, promises, and microtasks?',
        preview: 'How does the JavaScript event loop work?',
        authorId: users[2].id,
        views: 789,
        isSolved: true,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Array methods - map, filter, reduce',
        content: 'What are the differences between map, filter, and reduce? When should I use each method?',
        preview: 'What are the differences between map, filter, and reduce?',
        authorId: users[1].id,
        views: 445,
        isSolved: false,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'JavaScript prototypes and inheritance',
        content: 'How does prototypal inheritance work in JavaScript? How is it different from classical inheritance?',
        preview: 'How does prototypal inheritance work in JavaScript?',
        authorId: users[0].id,
        views: 567,
        isSolved: true,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Debouncing vs Throttling',
        content: 'What is the difference between debouncing and throttling in JavaScript? When should I use each technique?',
        preview: 'What is the difference between debouncing and throttling?',
        authorId: users[2].id,
        views: 412,
        isSolved: false,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'ES6 modules import/export',
        content: 'How do ES6 modules work? What are the different ways to import and export modules in JavaScript?',
        preview: 'How do ES6 modules work?',
        authorId: users[1].id,
        views: 389,
        isSolved: true,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'JavaScript memory management',
        content: 'How does garbage collection work in JavaScript? How can I prevent memory leaks in my applications?',
        preview: 'How does garbage collection work in JavaScript?',
        authorId: users[0].id,
        views: 501,
        isSolved: false,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Deep copy vs shallow copy',
        content: 'What is the difference between deep copy and shallow copy in JavaScript? How to implement each?',
        preview: 'What is the difference between deep copy and shallow copy?',
        authorId: users[2].id,
        views: 356,
        isSolved: true,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'JavaScript hoisting explained',
        content: 'What is hoisting in JavaScript? How does it affect var, let, const, and function declarations?',
        preview: 'What is hoisting in JavaScript?',
        authorId: users[1].id,
        views: 623,
        isSolved: false,
        tags: { create: [{ tagId: tags[3].id }] },
      },
    }),
  ]);

  // Python questions (10 questions)
  const pythonQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Python list comprehensions best practices',
        content: 'What are the best practices for using list comprehensions in Python? When should I use them vs regular loops?',
        preview: 'What are the best practices for using list comprehensions in Python?',
        authorId: users[0].id,
        views: 445,
        isSolved: true,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Python decorators explained',
        content: 'How do decorators work in Python? Can you provide practical examples and use cases?',
        preview: 'How do decorators work in Python?',
        authorId: users[1].id,
        views: 567,
        isSolved: false,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'FastAPI vs Flask - Which to choose?',
        content: 'What are the main differences between FastAPI and Flask? Which one should I use for a new project?',
        preview: 'What are the main differences between FastAPI and Flask?',
        authorId: users[2].id,
        views: 678,
        isSolved: true,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Python async/await explained',
        content: 'How does async/await work in Python? When should I use asyncio for my applications?',
        preview: 'How does async/await work in Python?',
        authorId: users[0].id,
        views: 534,
        isSolved: false,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Virtual environments in Python',
        content: 'What are virtual environments in Python? How to create and manage them with venv vs virtualenv vs conda?',
        preview: 'What are virtual environments in Python?',
        authorId: users[1].id,
        views: 412,
        isSolved: true,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Python type hints and mypy',
        content: 'How to use type hints in Python? What is mypy and should I use it in my projects?',
        preview: 'How to use type hints in Python?',
        authorId: users[2].id,
        views: 389,
        isSolved: false,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Python generators and yield',
        content: 'What are generators in Python? How does the yield keyword work and when should I use it?',
        preview: 'What are generators in Python?',
        authorId: users[0].id,
        views: 501,
        isSolved: true,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Django REST framework tutorial',
        content: 'How to build a REST API with Django REST framework? What are the best practices for authentication?',
        preview: 'How to build a REST API with Django REST framework?',
        authorId: users[1].id,
        views: 623,
        isSolved: false,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Python data classes',
        content: 'What are data classes in Python? How are they different from regular classes and when should I use them?',
        preview: 'What are data classes in Python?',
        authorId: users[2].id,
        views: 356,
        isSolved: true,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Testing in Python with pytest',
        content: 'Best practices for writing tests in Python using pytest? How to structure test files and use fixtures?',
        preview: 'Best practices for writing tests in Python using pytest?',
        authorId: users[0].id,
        views: 478,
        isSolved: false,
        tags: { create: [{ tagId: tags[4].id }] },
      },
    }),
  ]);

  // Docker questions (10 questions)
  const dockerQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Docker vs Docker Compose',
        content: 'What is the difference between Docker and Docker Compose? When should I use each?',
        preview: 'What is the difference between Docker and Docker Compose?',
        authorId: users[1].id,
        views: 512,
        isSolved: true,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Optimizing Docker images',
        content: 'How can I reduce Docker image size? What are the best practices for creating efficient Dockerfiles?',
        preview: 'How can I reduce Docker image size?',
        authorId: users[0].id,
        views: 445,
        isSolved: false,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Multi-stage Docker builds',
        content: 'How do multi-stage builds work in Docker? Can you provide an example for a Node.js application?',
        preview: 'How do multi-stage builds work in Docker?',
        authorId: users[2].id,
        views: 389,
        isSolved: true,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Docker networking explained',
        content: 'How does Docker networking work? What are bridge, host, and overlay networks?',
        preview: 'How does Docker networking work?',
        authorId: users[1].id,
        views: 567,
        isSolved: false,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Docker volumes and persistence',
        content: 'How to manage data persistence in Docker? What are volumes and bind mounts?',
        preview: 'How to manage data persistence in Docker?',
        authorId: users[0].id,
        views: 423,
        isSolved: true,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Docker security best practices',
        content: 'What are the security best practices for running Docker containers in production?',
        preview: 'What are the security best practices for running Docker containers?',
        authorId: users[2].id,
        views: 501,
        isSolved: false,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Docker Swarm vs Kubernetes',
        content: 'What are the differences between Docker Swarm and Kubernetes? Which orchestration tool should I choose?',
        preview: 'What are the differences between Docker Swarm and Kubernetes?',
        authorId: users[1].id,
        views: 634,
        isSolved: true,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Debugging inside Docker containers',
        content: 'How do I debug applications running inside Docker containers? What tools should I use?',
        preview: 'How do I debug applications running inside Docker containers?',
        authorId: users[0].id,
        views: 356,
        isSolved: false,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Docker health checks',
        content: 'How to implement health checks in Docker? What are the best practices for monitoring container health?',
        preview: 'How to implement health checks in Docker?',
        authorId: users[2].id,
        views: 412,
        isSolved: true,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'CI/CD with Docker',
        content: 'How to integrate Docker into a CI/CD pipeline? Best practices for building and deploying containerized applications?',
        preview: 'How to integrate Docker into a CI/CD pipeline?',
        authorId: users[1].id,
        views: 478,
        isSolved: false,
        tags: { create: [{ tagId: tags[5].id }] },
      },
    }),
  ]);

  // AWS questions (10 questions)
  const awsQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'AWS Lambda cold start optimization',
        content: 'How can I reduce cold start times in AWS Lambda functions? What are the best practices?',
        preview: 'How can I reduce cold start times in AWS Lambda functions?',
        authorId: users[0].id,
        views: 523,
        isSolved: true,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'S3 vs EBS vs EFS - Which to use?',
        content: 'What are the differences between S3, EBS, and EFS in AWS? When should I use each storage service?',
        preview: 'What are the differences between S3, EBS, and EFS?',
        authorId: users[1].id,
        views: 612,
        isSolved: false,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AWS IAM roles and policies',
        content: 'How do IAM roles and policies work in AWS? What are the best practices for managing permissions?',
        preview: 'How do IAM roles and policies work in AWS?',
        authorId: users[2].id,
        views: 478,
        isSolved: true,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'VPC networking in AWS',
        content: 'How to set up a VPC in AWS? What are subnets, route tables, and internet gateways?',
        preview: 'How to set up a VPC in AWS?',
        authorId: users[0].id,
        views: 389,
        isSolved: false,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AWS CloudFormation vs Terraform',
        content: 'Should I use AWS CloudFormation or Terraform for infrastructure as code? What are the pros and cons?',
        preview: 'Should I use AWS CloudFormation or Terraform?',
        authorId: users[1].id,
        views: 567,
        isSolved: true,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'RDS vs DynamoDB',
        content: 'When should I use RDS vs DynamoDB in AWS? What are the use cases for each database service?',
        preview: 'When should I use RDS vs DynamoDB?',
        authorId: users[2].id,
        views: 534,
        isSolved: false,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AWS cost optimization strategies',
        content: 'How can I reduce my AWS bill? What are the best practices for cost optimization?',
        preview: 'How can I reduce my AWS bill?',
        authorId: users[0].id,
        views: 701,
        isSolved: true,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Setting up CI/CD with AWS CodePipeline',
        content: 'How to set up a CI/CD pipeline using AWS CodePipeline, CodeBuild, and CodeDeploy?',
        preview: 'How to set up a CI/CD pipeline using AWS services?',
        authorId: users[1].id,
        views: 445,
        isSolved: false,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AWS API Gateway and Lambda integration',
        content: 'Best practices for integrating API Gateway with Lambda functions? How to handle authentication and rate limiting?',
        preview: 'Best practices for integrating API Gateway with Lambda?',
        authorId: users[2].id,
        views: 412,
        isSolved: true,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AWS security best practices',
        content: 'What are the essential security best practices for AWS infrastructure? How to secure my cloud resources?',
        preview: 'What are the essential security best practices for AWS?',
        authorId: users[0].id,
        views: 589,
        isSolved: false,
        tags: { create: [{ tagId: tags[6].id }] },
      },
    }),
  ]);

  // Database questions (10 questions)
  const databaseQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'SQL vs NoSQL - When to use which?',
        content: 'What are the differences between SQL and NoSQL databases? How do I choose the right one for my project?',
        preview: 'What are the differences between SQL and NoSQL databases?',
        authorId: users[1].id,
        views: 678,
        isSolved: true,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Database indexing explained',
        content: 'How do database indexes work? When should I create them and what are the trade-offs?',
        preview: 'How do database indexes work?',
        authorId: users[0].id,
        views: 534,
        isSolved: false,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'MongoDB aggregation pipeline',
        content: 'How to use the MongoDB aggregation pipeline effectively? Can you provide practical examples?',
        preview: 'How to use the MongoDB aggregation pipeline?',
        authorId: users[2].id,
        views: 445,
        isSolved: true,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Database normalization vs denormalization',
        content: 'What is database normalization? When should I denormalize for performance?',
        preview: 'What is database normalization?',
        authorId: users[1].id,
        views: 567,
        isSolved: false,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'PostgreSQL vs MySQL',
        content: 'What are the main differences between PostgreSQL and MySQL? Which one should I choose?',
        preview: 'What are the main differences between PostgreSQL and MySQL?',
        authorId: users[0].id,
        views: 612,
        isSolved: true,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Database transactions and ACID',
        content: 'What are database transactions? Can you explain ACID properties with examples?',
        preview: 'What are database transactions and ACID properties?',
        authorId: users[2].id,
        views: 489,
        isSolved: false,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Database connection pooling',
        content: 'What is connection pooling and why is it important? How to implement it in Node.js?',
        preview: 'What is connection pooling and why is it important?',
        authorId: users[1].id,
        views: 401,
        isSolved: true,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Optimizing slow database queries',
        content: 'My database queries are slow. What are the best practices for query optimization?',
        preview: 'What are the best practices for query optimization?',
        authorId: users[0].id,
        views: 556,
        isSolved: false,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Database sharding explained',
        content: 'What is database sharding? When and how should I implement it for horizontal scaling?',
        preview: 'What is database sharding?',
        authorId: users[2].id,
        views: 478,
        isSolved: true,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Redis caching strategies',
        content: 'How to use Redis for caching? What are the different caching patterns and when to use each?',
        preview: 'How to use Redis for caching?',
        authorId: users[1].id,
        views: 523,
        isSolved: false,
        tags: { create: [{ tagId: tags[7].id }] },
      },
    }),
  ]);

  console.log('✅ Created 80 questions across all tags');

  // Create sample answers for some questions
  await Promise.all([
    prisma.answer.create({
      data: {
        content: 'You can use React Query\'s `useInfiniteQuery` hook combined with an Intersection Observer. Here\'s a great pattern:\n\n```tsx\nconst { data, fetchNextPage, hasNextPage } = useInfiniteQuery({\n  queryKey: ["posts"],\n  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),\n  getNextPageParam: (lastPage) => lastPage.nextCursor,\n});\n```\n\nThen use a ref with Intersection Observer to trigger `fetchNextPage()` when the user scrolls to the bottom.',
        questionId: reactQuestions[0].id,
        authorId: users[2].id,
        isAccepted: true,
      },
    }),
    prisma.answer.create({
      data: {
        content: 'For Express error handling, I recommend creating a centralized error handler middleware:\n\n```typescript\napp.use((err, req, res, next) => {\n  const statusCode = err.statusCode || 500;\n  res.status(statusCode).json({\n    success: false,\n    error: { message: err.message }\n  });\n});\n```\n\nFor async routes, use express-async-errors or wrap them in try-catch blocks.',
        questionId: nodejsQuestions[0].id,
        authorId: users[0].id,
        isAccepted: true,
      },
    }),
  ]);

  console.log('✅ Created answers');

  // Create sample votes
  await prisma.vote.createMany({
    data: [
      { userId: users[1].id, questionId: reactQuestions[0].id, value: 1 },
      { userId: users[2].id, questionId: reactQuestions[0].id, value: 1 },
      { userId: users[0].id, questionId: nodejsQuestions[0].id, value: 1 },
      { userId: users[1].id, questionId: typescriptQuestions[0].id, value: 1 },
    ],
  });

  console.log('✅ Created votes');

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'This is exactly what I was looking for! Thanks!',
        userId: users[0].id,
        questionId: reactQuestions[0].id,
      },
      {
        content: 'Great explanation. This pattern works perfectly.',
        userId: users[2].id,
        questionId: nodejsQuestions[0].id,
      },
    ],
  });

  console.log('✅ Created comments');

  console.log('🎉 Database seeded successfully with 80 questions!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
