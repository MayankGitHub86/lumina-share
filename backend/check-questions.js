const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQuestions() {
  try {
    const questions = await prisma.question.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    console.log(`\n📊 Found ${questions.length} questions in database:\n`);
    questions.forEach((q, i) => {
      console.log(`${i + 1}. ID: ${q.id}`);
      console.log(`   Title: ${q.title}`);
      console.log(`   Author: ${q.author.name}\n`);
    });

    if (questions.length === 0) {
      console.log('⚠️  No questions found! Run: npm run prisma:seed:indian');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestions();
