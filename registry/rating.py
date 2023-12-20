"""Module to define data models for rating reviews."""
import datetime
import json
import unittest
from typing import List
from pydantic import BaseModel, Field
from rdflib import Graph


class AuthorModel(BaseModel):
    """Model representing the author of a review.

        Attributes:
            type_ (str): The type of the author. Default is 'Person'.
            name (str): The name of the author.
        """
    type_: str = Field(alias="@type", default='Person')
    name: str


class ReviewRatingModel(BaseModel):
    """Model representing a rating with reviews.

        Attributes:
            context (str): The context of the rating. Default is 'https://schema.org/'.
            type_ (str): The type of the rating. Default is 'Product'.
            reviews (List[ReviewModel]): List of reviews for the rating.
            aggregateRating (AggregateRatingModel): Aggregate rating for the rating.
        """
    type_: str = Field(alias="@type", default="rating")
    worstRating: str = Field(default="1")
    bestRating: str = Field(default="5")
    ratingValue: str


class ReviewModel(BaseModel):
    """Model representing the rating of a rating review.

        Attributes:
            type_ (str): The type of the rating. Default is 'rating'.
            worstRating (str): The worst possible rating. Default is '1'.
            bestRating (str): The best possible rating. Default is '5'.
            ratingValue (str): The actual rating value.
        """
    type_: str = Field(alias="@type", default="review")
    author: AuthorModel
    datePublished: str = Field(default=datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
    reviewBody: str
    reviewRating: ReviewRatingModel


class AggregateRatingModel(BaseModel):
    """Model representing aggregate rating information.

        Attributes:
            type_ (str): The type of the aggregate rating. Default is 'AggregateRating'.
            ratingValue (str): The value of the aggregate rating.
            bestRating (str): The highest possible rating value.
            ratingCount (str): The total number of ratings.
        """
    type_: str = Field(alias="@type", default='AggregateRating')
    ratingValue: str
    bestRating: str
    ratingCount: str


class RatingModel(BaseModel):
    """Model representing a rating with reviews.

        Attributes:
            context (str): The context of the rating. Default is 'https://schema.org/'.
            type_ (str): The type of the rating. Default is 'Product'.
            reviews (List[ReviewModel]): List of reviews for the rating.
            aggregateRating (AggregateRatingModel): Aggregate rating for the rating.
        """
    context: str = Field(alias="@context", default="https://schema.org/")
    type_: str = Field(alias="@type", default="Product")
    reviews: List[ReviewModel]
    aggregateRating: AggregateRatingModel


class TestRatingModel(unittest.TestCase):

    def test_author_model(self):
        author_data = {"name": "John Doe"}
        author = AuthorModel(**author_data)
        self.assertEqual(author.name, "John Doe")

    def test_review_rating_model(self):
        rating_data = {"ratingValue": "4"}
        rating = ReviewRatingModel(**rating_data)
        self.assertEqual(rating.ratingValue, "4")

    def test_review_model(self):
        author_data = {"name": "John Doe"}
        review_rating_data = {"ratingValue": "4"}
        review_data = {
            "author": author_data,
            "reviewBody": "Great rating!",
            "reviewRating": review_rating_data
        }
        review = ReviewModel(**review_data)
        self.assertEqual(review.reviewBody, "Great rating!")

    def test_aggregate_rating_model(self):
        aggregate_rating_data = {"ratingValue": "4", "bestRating": "5", "ratingCount": "100"}
        aggregate_rating = AggregateRatingModel(**aggregate_rating_data)
        self.assertEqual(aggregate_rating.ratingValue, "4")

    def test_rating_model(self):
        author_data = {"name": "John Doe"}
        review_rating_data = {"ratingValue": "4"}
        review_data = {
            "author": author_data,
            "reviewBody": "Great rating!",
            "reviewRating": review_rating_data
        }
        aggregate_rating_data = {"ratingValue": "4", "bestRating": "5", "ratingCount": "100"}
        rating_data = {
            "reviews": [ReviewModel(**review_data)],
            "aggregateRating": AggregateRatingModel(**aggregate_rating_data)
        }
        rating = RatingModel(**rating_data)
        self.assertEqual(rating.reviews[0].reviewBody, "Great rating!")


# Example usage:
json_data = """
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "reviews": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Eko Indarto"
      },
      "datePublished": "2023-11-30",
      "reviewBody": "Eko's review here",
      "reviewRating": {
        "@type": "Rating",
        "worstRating": "1",
        "bestRating": "5",
        "ratingValue": "5"
      }
    }
  ],
  "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "1",
        "bestRating": "5",
        "ratingCount": "5"
      }
}
"""

