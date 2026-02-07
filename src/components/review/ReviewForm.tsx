// src/components/review/ReviewForm.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiCreateReview } from "@/lib/api";

type Props = {
  bookingId: string;
  vendorName?: string;
  serviceName?: string;
  /** disable submit unless status is completed */
  canReview?: boolean;
  /** callback after success */
  onSubmitted?: () => void;
  /** optional: to prevent re-review */
  alreadyReviewed?: boolean;
  className?: string;
};

function StarPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          disabled={disabled}
          className={[
            "rounded p-1 transition",
            disabled ? "cursor-not-allowed opacity-60" : "hover:bg-muted",
          ].join(" ")}
          aria-label={`${n} star`}
        >
          <Star
            className={[
              "h-6 w-6",
              n <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
            ].join(" ")}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({
  bookingId,
  vendorName = "Vendor",
  serviceName = "Service",
  canReview = true,
  alreadyReviewed = false,
  onSubmitted,
  className = "",
}: Props) {
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitEnabled = useMemo(() => {
    return !!bookingId && canReview && !alreadyReviewed && rating >= 1 && rating <= 5;
  }, [bookingId, canReview, alreadyReviewed, rating]);

  const submit = async () => {
    if (!submitEnabled) return;
    try {
      setSubmitting(true);
      await apiCreateReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast({ title: "Thanks!", description: "Your review has been submitted." });
      onSubmitted?.();
      setComment("");
    } catch (e: any) {
      toast({
        title: "Review failed",
        description: e?.message || "Could not submit review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={["rounded-xl border bg-background", className].join(" ")}>
      <div className="p-4">
        <div className="text-sm">
          <div className="font-medium">{serviceName}</div>
          <div className="text-muted-foreground">Vendor: {vendorName}</div>
        </div>

        <Separator className="my-4" />

        {!canReview ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            You can leave a review only after the service is marked <strong>Completed</strong>.
          </div>
        ) : alreadyReviewed ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            You already reviewed this booking.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Rating</div>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Comment (optional)</div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience…"
              />
            </div>
          </>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={submit} disabled={!submitEnabled || submitting}>
            {submitting ? "Submitting…" : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
