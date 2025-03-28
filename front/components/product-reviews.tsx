"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  // In a real app, we would fetch reviews for this product
  const reviews = mockReviews.filter((review) => review.productId === productId)

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would submit the review to an API
    alert(`Review submitted: ${rating} stars, "${reviewText}"`)
    setReviewText("")
    setRating(0)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Customer Reviews</h3>
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Based on {reviews.length} reviews</span>
        </div>
      </div>

      <form onSubmit={handleSubmitReview} className="mb-8">
        <h4 className="font-medium mb-2">Write a Review</h4>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" disabled={!rating || !reviewText.trim()}>
          Submit Review
        </Button>
      </form>

      <Separator className="my-6" />

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{review.userName}</h4>
                    <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                  </div>
                  <div className="flex my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                  <div className="flex items-center mt-2">
                    <button className="flex items-center text-xs text-muted-foreground hover:text-foreground mr-4">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpfulCount})
                    </button>
                    <button className="flex items-center text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Not helpful
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const mockReviews = [
  {
    id: 1,
    productId: 1,
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 months ago",
    text: "These headphones are amazing! The sound quality is excellent and they're very comfortable to wear for long periods. Battery life is impressive too.",
    helpfulCount: 12,
  },
  {
    id: 2,
    productId: 1,
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "1 month ago",
    text: "Great headphones overall. The noise cancellation works well, but I wish the ear cups were a bit larger. Still, I'm very happy with my purchase.",
    helpfulCount: 8,
  },
  {
    id: 3,
    productId: 2,
    userName: "Mike Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "3 weeks ago",
    text: "This t-shirt is so comfortable! The fabric is soft and breathable, and it fits perfectly. I've already ordered two more in different colors.",
    helpfulCount: 5,
  },
  {
    id: 4,
    productId: 3,
    userName: "Sarah Williams",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2 weeks ago",
    text: "The smart watch has a lot of great features and the battery lasts longer than I expected. The only downside is that the screen is a bit small for my liking.",
    helpfulCount: 3,
  },
]

