const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQuestionDetail() {
  try {
    // Get first question
    const firstQuestion = await prisma.question.findFirst({
      select: { id: true, title: true }
    });

    if (!firstQuestion) {
      console.log('❌ No questions in database');
      return;
    }

    console.log(`\n🔍 Testing question detail for: ${firstQuestion.title}`);
    console.log(`   ID: ${firstQuestion.id}\n`);

    // Try to fetch with full includes (same as controller)
    const question = await prisma.question.findUnique({
      where: { id: firstQuestion.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            points: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                points: true
              }
            },
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            },
            _count: {
              select: {
                votes: true
              }
            }
          }
        },
        votes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Query successful!');
    console.log(`   Title: ${question.title}`);
    console.log(`   Author: ${question.author.name}`);
    console.log(`   Tags: ${question.tags.length}`);
    console.log(`   Answers: ${question.answers.length}`);
    console.log(`   Comments: ${question.comments.length}`);
    console.log(`   Votes: ${question.votes.length}`);
    console.log(`\n✅ No errors - backend query works fine!`);
    console.log(`\n📝 Test this URL: http://localhost:3001/api/questions/${firstQuestion.id}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testQuestionDetail();
