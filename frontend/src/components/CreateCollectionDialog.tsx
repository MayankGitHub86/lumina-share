import { useState } from "react";
import { Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateCollectionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      // Reset form
      setName("");
      setDescription("");
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Create New Collection
          </DialogTitle>
          <DialogDescription>
            Organize your saved questions into collections for easy access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                placeholder="e.g., React Interview Prep"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this collection is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={200}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/200 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
