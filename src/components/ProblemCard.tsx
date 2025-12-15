import { ArrowUp, ArrowDown, MessageCircle, Eye, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProblemCardProps {
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
}

export function ProblemCard({
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
}: ProblemCardProps) {
  return (
    <article
      className={cn(
        "glass card-hover rounded-2xl p-6 group cursor-pointer",
        isLarge && "md:col-span-2"
      )}
    >
      <div className="flex gap-4">
        {/* Voting */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button className="p-1.5 rounded-lg hover:bg-success/20 transition-colors group/vote">
            <ArrowUp className="w-5 h-5 text-muted-foreground group-hover/vote:text-success transition-colors" />
          </button>
          <span className="text-lg font-semibold text-foreground">{votes}</span>
          <button className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors group/vote">
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
              <Badge key={tag} variant="neon" className="text-xs">
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
