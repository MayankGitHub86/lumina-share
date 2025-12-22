# Quick Start Guide

## Database is Ready! 🎉

The database has been seeded with:
- ✅ 5 users with Indian names
- ✅ 50 questions across various topics
- ✅ 20 answers
- ✅ 100 votes
- ✅ 30 comments
- ✅ 10 tags
- ✅ 3 badges

## Login Credentials

You can login with any of these accounts:

| Name | Email | Password |
|------|-------|----------|
| Priya Sharma | priya.sharma@example.com | password123 |
| Rahul Kumar | rahul.kumar@example.com | password123 |
| Ananya Patel | ananya.patel@example.com | password123 |
| Arjun Singh | arjun.singh@example.com | password123 |
| Kavya Reddy | kavya.reddy@example.com | password123 |

## Start the Application

### 1. Start Backend (if not running)
```bash
cd lumina-share/backend
npm run dev
```
Backend will run on: http://localhost:3001

### 2. Start Frontend (if not running)
```bash
cd lumina-share/frontend
npm run dev
```
Frontend will run on: http://localhost:8080

## Test the Features

### 1. Login
- Go to http://localhost:8080
- Click "Login"
- Use any credentials from the table above
- You should see a success notification

### 2. Explore Questions
- Navigate to "Explore" page
- You'll see 50 questions with real data
- Questions have votes, views, and tags
- Try filtering by tags

### 3. Advanced Search
- Click the sliders icon (🎚️) in the search bar
- Try different filters:
  - Search by text
  - Filter by tags
  - Filter by status (solved/unsolved)
  - Sort by votes, views, or recent
  - Set vote ranges
  - Set date ranges
- Click "Search" to apply filters
- Click "Clear Filters" to reset

### 4. Voting
- Click ⬆️ to upvote a question
- Click ⬇️ to downvote a question
- Click again to remove your vote
- Vote count updates immediately
- No errors in console

### 5. View Question Details
- Click on any question card
- You'll see the full question
- Answers are displayed below
- You can vote on answers too

### 6. Post a Comment
- Scroll to the comment section
- Type your comment
- Click "Post Comment"
- Comment appears immediately
- No errors!

### 7. Post an Answer
- Scroll to "Your Answer" section
- Write your answer
- Click "Post Answer"
- Answer appears in the list
- No errors!

## Features Working

✅ **Authentication**
- Login/Signup with toast notifications
- Protected routes
- JWT token management
- Persistent sessions

✅ **Advanced Search**
- Text search in titles and content
- Tag filtering (multiple tags)
- Author filtering
- Status filtering (solved/unsolved)
- Sort options (recent, votes, views, answers)
- Vote range filtering
- Answer range filtering
- Date range filtering
- Search suggestions
- Popular searches

✅ **Voting System**
- Upvote/downvote questions
- Upvote/downvote answers
- Toggle voting (click again to remove)
- Vote switching (click opposite to change)
- Self-vote prevention
- Point system (±5 points per vote)
- Real-time updates
- Optimistic UI updates

✅ **Questions & Answers**
- Create questions
- Post answers
- Add comments
- View statistics
- Tag management
- Solved/unsolved status

✅ **User Interface**
- Framer Motion animations
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Fixed sidebar
- Hidden scrollbars
- Glass morphism effects

## Troubleshooting

### Issue: "User not found" error when commenting/answering
**Solution**: Make sure you're logged in with one of the seeded accounts

### Issue: Vote stats 404 error
**Solution**: This has been fixed. Refresh the page if you still see it.

### Issue: Questions not showing
**Solution**: Database is seeded. If not showing, check:
- Backend is running on port 3001
- Frontend is running on port 8080
- Check browser console for errors

### Issue: Can't login
**Solution**: 
- Use exact credentials from the table above
- Password is: `password123`
- Email must match exactly

## Next Steps

Now that everything is working, you can:

1. **Create Your Own Account**
   - Register with your own email
   - Start asking questions
   - Answer other questions
   - Build your reputation

2. **Explore All Features**
   - Try the advanced search
   - Vote on questions and answers
   - Comment on discussions
   - Save questions for later
   - Check the leaderboard

3. **Customize**
   - Modify the seed data
   - Add more questions
   - Create custom tags
   - Adjust point values

## API Endpoints

All endpoints are available at: http://localhost:3001/api

### Search
- `GET /search` - Advanced search with filters
- `GET /search/suggestions` - Autocomplete suggestions
- `GET /search/popular` - Popular searches

### Votes
- `POST /votes` - Vote on question/answer (auth required)
- `GET /votes/user` - Get user's vote (auth required)
- `GET /votes/stats` - Get vote statistics

### Questions
- `GET /questions` - Get all questions
- `GET /questions/:id` - Get question by ID
- `POST /questions` - Create question (auth required)

### Answers
- `GET /answers/question/:id` - Get answers for question
- `POST /answers` - Create answer (auth required)

### Comments
- `POST /comments` - Create comment (auth required)

## Support

If you encounter any issues:
1. Check `FIXES_APPLIED.md` for common solutions
2. Check `FEATURES.md` for feature documentation
3. Check `TROUBLESHOOTING.md` for detailed troubleshooting
4. Check browser console for errors
5. Check backend console for errors

## Enjoy! 🚀

Everything is set up and ready to use. Have fun exploring the features!
