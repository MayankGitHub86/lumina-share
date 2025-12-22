const prisma = require('../lib/prisma');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Advanced search with multiple filters
 */
const advancedSearch = asyncHandler(async (req, res) => {
  const {
    q, // search query
    tags, // comma-separated tags
    author, // author username
    status, // solved/unsolved/all
    sort, // recent/votes/views/answers
    minVotes,
    maxVotes,
    minAnswers,
    maxAnswers,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const where = {};

  // Text search in title and content
  if (q && q.trim()) {
    where.OR = [
      { title: { contains: q.trim(), mode: 'insensitive' } },
      { content: { contains: q.trim(), mode: 'insensitive' } },
      { preview: { contains: q.trim(), mode: 'insensitive' } },
    ];
  }

  // Filter by tags
  if (tags) {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagArray.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: { in: tagArray, mode: 'insensitive' }
          }
        }
      };
    }
  }

  // Filter by author
  if (author) {
    where.author = {
      username: { equals: author, mode: 'insensitive' }
    };
  }

  // Filter by solved status
  if (status === 'solved') {
    where.isSolved = true;
  } else if (status === 'unsolved') {
    where.isSolved = false;
  }

  // Filter by date range
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo);
    }
  }

  // Filter by views range
  if (minVotes !== undefined || maxVotes !== undefined) {
    where.views = {};
    if (minVotes) where.views.gte = Number(minVotes);
    if (maxVotes) where.views.lte = Number(maxVotes);
  }

  // Determine sort order
  let orderBy = { createdAt: 'desc' };
  if (sort === 'views') {
    orderBy = { views: 'desc' };
  } else if (sort === 'recent') {
    orderBy = { createdAt: 'desc' };
  }

  // Fetch questions
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            answers: true,
            votes: true,
            comments: true,
          }
        }
      },
      orderBy,
    }),
    prisma.question.count({ where }),
  ]);

  // Format questions with vote scores
  const formattedQuestions = await Promise.all(questions.map(async q => {
    const voteScore = await prisma.vote.aggregate({
      where: { questionId: q.id },
      _sum: { value: true }
    });

    return {
      id: q.id,
      title: q.title,
      preview: q.preview,
      author: q.author,
      tags: q.tags.map(t => t.tag.name),
      votes: voteScore._sum.value || 0,
      answers: q._count.answers,
      views: q.views,
      isSolved: q.isSolved,
      createdAt: q.createdAt,
    };
  }));

  // Sort by votes or answers if needed (after calculating)
  if (sort === 'votes') {
    formattedQuestions.sort((a, b) => b.votes - a.votes);
  } else if (sort === 'answers') {
    formattedQuestions.sort((a, b) => b.answers - a.answers);
  }

  // Filter by answer count if specified
  let filteredQuestions = formattedQuestions;
  if (minAnswers !== undefined || maxAnswers !== undefined) {
    filteredQuestions = formattedQuestions.filter(q => {
      if (minAnswers !== undefined && q.answers < Number(minAnswers)) return false;
      if (maxAnswers !== undefined && q.answers > Number(maxAnswers)) return false;
      return true;
    });
  }

  ApiResponse.success(res, {
    questions: filteredQuestions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    filters: {
      query: q || null,
      tags: tags ? tags.split(',') : [],
      author: author || null,
      status: status || 'all',
      sort: sort || 'recent',
    }
  });
});

/**
 * Get search suggestions (autocomplete)
 */
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return ApiResponse.success(res, { suggestions: [] });
  }

  // Search in questions
  const questions = await prisma.question.findMany({
    where: {
      OR: [
        { title: { contains: q.trim(), mode: 'insensitive' } },
        { preview: { contains: q.trim(), mode: 'insensitive' } },
      ]
    },
    select: {
      id: true,
      title: true,
    },
    take: 5,
  });

  // Search in tags
  const tags = await prisma.tag.findMany({
    where: {
      name: { contains: q.trim(), mode: 'insensitive' }
    },
    select: {
      id: true,
      name: true,
    },
    take: 5,
  });

  // Search in users
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q.trim(), mode: 'insensitive' } },
        { name: { contains: q.trim(), mode: 'insensitive' } },
      ]
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
    },
    take: 5,
  });

  ApiResponse.success(res, {
    suggestions: {
      questions: questions.map(q => ({ type: 'question', ...q })),
      tags: tags.map(t => ({ type: 'tag', ...t })),
      users: users.map(u => ({ type: 'user', ...u })),
    }
  });
});

/**
 * Get popular searches
 */
const getPopularSearches = asyncHandler(async (req, res) => {
  // Get most viewed questions as popular searches
  const popularQuestions = await prisma.question.findMany({
    orderBy: { views: 'desc' },
    take: 10,
    select: {
      title: true,
      views: true,
    }
  });

  // Get popular tags
  const popularTags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: {
      questions: {
        _count: 'desc'
      }
    },
    take: 10,
  });

  ApiResponse.success(res, {
    popularQuestions: popularQuestions.map(q => q.title),
    popularTags: popularTags.map(t => ({
      name: t.name,
      count: t._count.questions,
    })),
  });
});

module.exports = {
  advancedSearch,
  getSearchSuggestions,
  getPopularSearches,
};
