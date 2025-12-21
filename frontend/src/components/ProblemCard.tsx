import { ArrowUp, ArrowDown, MessageCircle, Eye, Clock, CheckCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface ProblemCardProps {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  timeAgo: string;
  isSolved?: boolean;
  isLarge?: boolean;
  isSaved?: boolean;
}

export function ProblemCard({
  id,
  title,
  preview,
  author,
  tags,
  votes,
  answers,
  views,
  timeAgo,
  isSolved = false,
  isLarge = false,
  isSaved = false,
}: ProblemCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [saved, setSaved] = useState(isSaved);

  const voteMutation = useMutation({
    mutationFn: (value: 1 | -1) => api.vote({ value, questionId: id }),
    onMutate: (value) => {
      // Optimistic update
      setCurrentVotes(prev => prev + value);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
    onError: (error: any, value) => {
      // Revert optimistic update on error
      setCurrentVotes(prev => prev - value);
      toast.error(error.message || "Failed to vote");
    },
  });

  const saveMutation = useMutation({
    mutationFn: (value: boolean) => {
      console.log('Save mutation called:', { id, currentlySaved: value });
      return value ? api.unsaveQuestion(id) : api.saveQuestion(id);
    },
    onMutate: () => {
      const previousSaved = saved;
      setSaved(!saved);
      console.log('Optimistic update:', { from: previousSaved, to: !previousSaved });
      return { previousSaved };
    },
    onSuccess: (data, variables, context) => {
      console.log('Save success:', data);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      // Use the previous state to show the correct message
      toast.success(context?.previousSaved ? "Removed from saved" : "Saved successfully");
    },
    onError: (error: any, variables, context) => {
      console.error('Save error:', error);
      // Revert to previous state
      setSaved(context?.previousSaved ?? saved);
      toast.error(error.message || "Failed to save");
    },
  });

  const handleVote = (e: React.MouseEvent, value: 1 | -1) => {
    e.stopPropagation();
    voteMutation.mutate(value);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Handle save clicked:', { id, saved });
    saveMutation.mutate(saved);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/explore?category=${encodeURIComponent(tag)}`);
  };

  return (
    <article
      onClick={() => navigate(`/questions/${id}`)}
      className={cn(
        "glass card-hover rounded-2xl p-6 group cursor-pointer",
        isLarge && "md:col-span-2"
      )}
    >
      <div className="flex gap-4">
        {/* Voting */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button 
            onClick={(e) => handleVote(e, 1)}
            className="p-1.5 rounded-lg hover:bg-success/20 transition-colors group/vote"
            disabled={voteMutation.isPending}
          >
            <ArrowUp className="w-5 h-5 text-muted-foreground group-hover/vote:text-success transition-colors" />
          </button>
          <span className="text-lg font-semibold text-foreground">{currentVotes}</span>
          <button 
            onClick={(e) => handleVote(e, -1)}
            className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors group/vote"
            disabled={voteMutation.isPending}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground group-hover/vote:text-destructive transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-start gap-2 mb-2">
            <h3 className={cn(
              "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2",
              isLarge ? "text-xl" : "text-lg"
            )}>
              {title}
            </h3>
            {isSolved && (
              <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Solved
              </div>
            )}
          </div>

          {/* Preview */}
          <p className={cn(
            "text-muted-foreground mb-4 line-clamp-2",
            isLarge && "line-clamp-3"
          )}>
            {preview}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="neon" 
                className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 text-sm">
            {/* Author */}
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-full ring-2 ring-white/10"
              />
              <span className="text-muted-foreground truncate">
                {author.name}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-muted-foreground shrink-0">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {answers}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeAgo}
              </span>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={cn(
                  "flex items-center gap-1 hover:text-primary transition-colors",
                  saved && "text-primary"
                )}
              >
                {saved ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
