import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, MessageCircle, Eye, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [questionVotes, setQuestionVotes] = useState(0);
  const [answerVotes, setAnswerVotes] = useState<Record<string, number>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["question", id],
    queryFn: async () => {
      const res: any = await api.getQuestionById(id!);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch vote stats separately after question loads
  useQuery({
    queryKey: ["question-votes", id],
    queryFn: async () => {
      const voteScore: any = await api.getVoteStats(id);
      setQuestionVotes(voteScore.data.score);
      return voteScore.data;
    },
    enabled: !!id && !!data,
  });

  // Fetch answer votes separately
  useQuery({
    queryKey: ["answer-votes", id],
    queryFn: async () => {
      if (data?.answers) {
        const answerVotesMap: Record<string, number> = {};
        for (const answer of data.answers) {
          try {
            const answerVoteScore: any = await api.getVoteStats(undefined, answer.id);
            answerVotesMap[answer.id] = answerVoteScore.data.score;
          } catch (error) {
            answerVotesMap[answer.id] = 0;
          }
        }
        setAnswerVotes(answerVotesMap);
        return answerVotesMap;
      }
      return {};
    },
    enabled: !!id && !!data && !!data.answers,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: { content: string; questionId?: string; answerId?: string }) => {
      return api.createComment(data);
    },
    onSuccess: () => {
      toast.success("Comment posted!");
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to post comment");
    },
  });

  const createAnswerMutation = useMutation({
    mutationFn: async (data: { content: string; questionId: string }) => {
      return api.createAnswer(data);
    },
    onSuccess: () => {
      toast.success("Answer posted!");
      setAnswerContent("");
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to post answer");
    },
  });

  const voteQuestionMutation = useMutation({
    mutationFn: (value: 1 | -1) => api.vote({ value, questionId: id }),
    onMutate: (value) => {
      setQuestionVotes(prev => prev + value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
    onError: (error: any, value) => {
      setQuestionVotes(prev => prev - value);
      toast.error(error.message || "Failed to vote");
    },
  });

  const voteAnswerMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: 1 | -1 }) => 
      api.vote({ value, answerId }),
    onMutate: ({ answerId, value }) => {
      setAnswerVotes(prev => ({ ...prev, [answerId]: (prev[answerId] || 0) + value }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
    onError: (error: any, { answerId, value }) => {
      setAnswerVotes(prev => ({ ...prev, [answerId]: (prev[answerId] || 0) - value }));
      toast.error(error.message || "Failed to vote");
    },
  });

  const handleQuestionVote = (value: 1 | -1) => {
    voteQuestionMutation.mutate(value);
  };

  const handleAnswerVote = (answerId: string, value: 1 | -1) => {
    voteAnswerMutation.mutate({ answerId, value });
  };

  if (isLoading) {
    return (
      <AnimatedPage className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-[1400px]">
            <div className="flex gap-6">
              <Sidebar />
              <div className="flex-1 min-w-0">
                <div className="text-center text-muted-foreground">Loading question...</div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
    );
  }

  if (isError || !data) {
    return (
      <AnimatedPage className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-[1400px]">
            <div className="flex gap-6">
              <Sidebar />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="text-center text-destructive text-xl font-semibold">Question Not Found</div>
                  <p className="text-muted-foreground text-center max-w-md">
                    This question might not exist, has been deleted, or the database was recently reset.
                    Please navigate to the Explore page to view available questions.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => navigate("/explore")} variant="default">
                      Go to Explore
                    </Button>
                    <Button onClick={() => navigate(-1)} variant="outline">
                      Go Back
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground max-w-md">
                    <p className="font-semibold mb-2">💡 Tip:</p>
                    <p>If you just reseeded the database, try clearing your browser cache (Ctrl+Shift+Delete) and refreshing the page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
    );
  }

  const question = data;

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex gap-6">
            <Sidebar />
          
            <div className="flex-1 min-w-0 space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Question */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleQuestionVote(1)}
                    disabled={voteQuestionMutation.isPending}
                    className="p-2 rounded-lg hover:bg-success/20 transition-colors group"
                  >
                    <ArrowUp className="w-6 h-6 text-muted-foreground group-hover:text-success transition-colors" />
                  </button>
                  <span className="text-xl font-semibold">{questionVotes}</span>
                  <button 
                    onClick={() => handleQuestionVote(-1)}
                    disabled={voteQuestionMutation.isPending}
                    className="p-2 rounded-lg hover:bg-destructive/20 transition-colors group"
                  >
                    <ArrowDown className="w-6 h-6 text-muted-foreground group-hover:text-destructive transition-colors" />
                  </button>
                </div>

                <div className="flex-1">
                  {/* Title & Status */}
                  <div className="flex items-start gap-2 mb-4">
                    <h1 className="text-2xl font-bold text-foreground flex-1">{question.title}</h1>
                    {question.isSolved && (
                      <Badge variant="default" className="bg-success/20 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="prose prose-invert max-w-none mb-4">
                    <p className="text-foreground whitespace-pre-wrap">{question.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(question.tags || []).map((tagObj: any) => (
                      <Badge key={tagObj.tag.id} variant="secondary">
                        {tagObj.tag.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={question.author.avatar} />
                        <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{question.author.name}</div>
                        <div className="text-muted-foreground">
                          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {question.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {question.answers?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Comments */}
              {question.comments && question.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium mb-3">Comments</h3>
                  <div className="space-y-3">
                    {question.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 text-sm">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-muted-foreground mx-2">·</span>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                          <p className="mt-1 text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={2}
                  className="mb-2"
                />
                <Button
                  size="sm"
                  onClick={() =>
                    createCommentMutation.mutate({ content: commentContent, questionId: id })
                  }
                  disabled={!commentContent.trim() || createCommentMutation.isPending}
                >
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">
                {question.answers?.length || 0} {question.answers?.length === 1 ? "Answer" : "Answers"}
              </h2>

              {question.answers && question.answers.length > 0 && (
                <div className="space-y-4">
                  {question.answers.map((answer: any) => (
                    <div key={answer.id} className="glass rounded-2xl p-6">
                      <div className="flex gap-4">
                        {/* Voting */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <button 
                            onClick={() => handleAnswerVote(answer.id, 1)}
                            disabled={voteAnswerMutation.isPending}
                            className="p-2 rounded-lg hover:bg-success/20 transition-colors group"
                          >
                            <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
                          </button>
                          <span className="text-lg font-semibold">{answerVotes[answer.id] || 0}</span>
                          <button 
                            onClick={() => handleAnswerVote(answer.id, -1)}
                            disabled={voteAnswerMutation.isPending}
                            className="p-2 rounded-lg hover:bg-destructive/20 transition-colors group"
                          >
                            <ArrowDown className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                          </button>
                          {answer.isAccepted && (
                            <CheckCircle className="w-6 h-6 text-success mt-2" />
                          )}
                        </div>

                        <div className="flex-1">
                          {/* Content */}
                          <div className="prose prose-invert max-w-none mb-4">
                            <p className="text-foreground whitespace-pre-wrap">{answer.content}</p>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={answer.author.avatar} />
                              <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-medium">{answer.author.name}</div>
                              <div className="text-muted-foreground">
                                {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>

                          {/* Answer Comments */}
                          {answer.comments && answer.comments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="space-y-3">
                                {answer.comments.map((comment: any) => (
                                  <div key={comment.id} className="flex gap-3 text-sm">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={comment.user.avatar} />
                                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <span className="font-medium">{comment.user.name}</span>
                                      <span className="text-muted-foreground mx-2">·</span>
                                      <span className="text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                          addSuffix: true,
                                        })}
                                      </span>
                                      <p className="mt-1 text-foreground">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Answer */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <Textarea
                placeholder="Write your answer here..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                rows={6}
                className="mb-4"
              />
              <Button
                onClick={() => createAnswerMutation.mutate({ content: answerContent, questionId: id! })}
                disabled={!answerContent.trim() || createAnswerMutation.isPending}
              >
                {createAnswerMutation.isPending ? "Posting..." : "Post Answer"}
              </Button>
            </div>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
};

export default QuestionDetail;
