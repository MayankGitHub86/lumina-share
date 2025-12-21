import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, MessageCircle, Eye, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");
  const [answerContent, setAnswerContent] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["question", id],
    queryFn: async () => {
      const res: any = await api.getQuestionById(id!);
      return res.data;
    },
    enabled: !!id,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-muted-foreground">Loading question...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="text-center text-destructive text-xl font-semibold">Failed to load question</div>
              <p className="text-muted-foreground text-center max-w-md">
                This question might not exist or has been deleted. Please navigate to the Explore page to view available questions.
              </p>
              <Button onClick={() => navigate("/explore")} variant="default">
                Go to Explore
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const question = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 flex gap-8">
          <Sidebar />
          
          <div className="flex-1 max-w-4xl">
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
                  <button className="p-2 rounded-lg hover:bg-success/20 transition-colors">
                    <ArrowUp className="w-6 h-6 text-muted-foreground hover:text-success" />
                  </button>
                  <span className="text-xl font-semibold">{question.votes?.length || 0}</span>
                  <button className="p-2 rounded-lg hover:bg-destructive/20 transition-colors">
                    <ArrowDown className="w-6 h-6 text-muted-foreground hover:text-destructive" />
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
                          <button className="p-2 rounded-lg hover:bg-success/20 transition-colors">
                            <ArrowUp className="w-5 h-5 text-muted-foreground hover:text-success" />
                          </button>
                          <span className="text-lg font-semibold">{answer._count?.votes || 0}</span>
                          <button className="p-2 rounded-lg hover:bg-destructive/20 transition-colors">
                            <ArrowDown className="w-5 h-5 text-muted-foreground hover:text-destructive" />
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
      </main>
      <Footer />
    </div>
  );
};

export default QuestionDetail;
