const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all collections for a user
// @route   GET /api/collections
// @access  Private
exports.getUserCollections = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json(
    new ApiResponse(200, collections, 'Collections retrieved successfully')
  );
});

// @desc    Create a new collection
// @route   POST /api/collections
// @access  Private
exports.createCollection = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId;

  if (!name || name.trim().length === 0) {
    throw ApiError.badRequest('Collection name is required');
  }

  // Check if collection with same name already exists for this user
  const existingCollection = await prisma.collection.findFirst({
    where: {
      userId,
      name: name.trim()
    }
  });

  if (existingCollection) {
    throw ApiError.conflict('A collection with this name already exists');
  }

  const collection = await prisma.collection.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      userId
    },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  res.status(201).json(
    new ApiResponse(201, collection, 'Collection created successfully')
  );
});

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private
exports.updateCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.userId;

  // Check if collection exists and belongs to user
  const collection = await prisma.collection.findFirst({
    where: { id, userId }
  });

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  // Check if new name conflicts with existing collection
  if (name && name.trim() !== collection.name) {
    const existingCollection = await prisma.collection.findFirst({
      where: {
        userId,
        name: name.trim(),
        id: { not: id }
      }
    });

    if (existingCollection) {
      throw ApiError.conflict('A collection with this name already exists');
    }
  }

  const updatedCollection = await prisma.collection.update({
    where: { id },
    data: {
      name: name?.trim() || collection.name,
      description: description !== undefined ? (description?.trim() || null) : collection.description
    },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  res.status(200).json(
    new ApiResponse(200, updatedCollection, 'Collection updated successfully')
  );
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private
exports.deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Check if collection exists and belongs to user
  const collection = await prisma.collection.findFirst({
    where: { id, userId }
  });

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  await prisma.collection.delete({
    where: { id }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Collection deleted successfully')
  );
});

// @desc    Add question to collection
// @route   POST /api/collections/:id/questions
// @access  Private
exports.addQuestionToCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questionId } = req.body;
  const userId = req.userId;

  if (!questionId) {
    throw ApiError.badRequest('Question ID is required');
  }

  // Check if collection exists and belongs to user
  const collection = await prisma.collection.findFirst({
    where: { id, userId }
  });

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  // Check if question exists
  const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    throw ApiError.notFound('Question not found');
  }

  // Check if question is already in collection
  const existingEntry = await prisma.collectionQuestion.findUnique({
    where: {
      collectionId_questionId: {
        collectionId: id,
        questionId
      }
    }
  });

  if (existingEntry) {
    throw ApiError.conflict('Question is already in this collection');
  }

  await prisma.collectionQuestion.create({
    data: {
      collectionId: id,
      questionId
    }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Question added to collection successfully')
  );
});

// @desc    Remove question from collection
// @route   DELETE /api/collections/:id/questions/:questionId
// @access  Private
exports.removeQuestionFromCollection = asyncHandler(async (req, res) => {
  const { id, questionId } = req.params;
  const userId = req.userId;

  // Check if collection exists and belongs to user
  const collection = await prisma.collection.findFirst({
    where: { id, userId }
  });

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  // Check if question is in collection
  const entry = await prisma.collectionQuestion.findUnique({
    where: {
      collectionId_questionId: {
        collectionId: id,
        questionId
      }
    }
  });

  if (!entry) {
    throw ApiError.notFound('Question not found in this collection');
  }

  await prisma.collectionQuestion.delete({
    where: {
      collectionId_questionId: {
        collectionId: id,
        questionId
      }
    }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Question removed from collection successfully')
  );
});

// @desc    Get questions in a collection
// @route   GET /api/collections/:id/questions
// @access  Private
exports.getCollectionQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Check if collection exists and belongs to user
  const collection = await prisma.collection.findFirst({
    where: { id, userId }
  });

  if (!collection) {
    throw ApiError.notFound('Collection not found');
  }

  const questions = await prisma.collectionQuestion.findMany({
    where: { collectionId: id },
    include: {
      question: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
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
              comments: true
            }
          }
        }
      }
    },
    orderBy: { addedAt: 'desc' }
  });

  const formattedQuestions = questions.map(cq => ({
    ...cq.question,
    savedAt: cq.addedAt
  }));

  res.status(200).json(
    new ApiResponse(200, formattedQuestions, 'Collection questions retrieved successfully')
  );
});

