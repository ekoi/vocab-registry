"""Module to define data models for product reviews."""
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
    """Model representing a product with reviews.

        Attributes:
            context (str): The context of the product. Default is 'https://schema.org/'.
            type_ (str): The type of the product. Default is 'Product'.
            reviews (List[ReviewModel]): List of reviews for the product.
            aggregateRating (AggregateRatingModel): Aggregate rating for the product.
        """
    type_: str = Field(alias="@type", default="rating")
    worstRating: str = Field(default="1")
    bestRating: str = Field(default="5")
    ratingValue: str


class ReviewModel(BaseModel):
    """Model representing the rating of a product review.

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


class ProductModel(BaseModel):
    """Model representing a product with reviews.

        Attributes:
            context (str): The context of the product. Default is 'https://schema.org/'.
            type_ (str): The type of the product. Default is 'Product'.
            reviews (List[ReviewModel]): List of reviews for the product.
            aggregateRating (AggregateRatingModel): Aggregate rating for the product.
        """
    context: str = Field(alias="@context", default="https://schema.org/")
    type_: str = Field(alias="@type", default="Product")
    reviews: List[ReviewModel]
    aggregateRating: AggregateRatingModel


class TestYourModels(unittest.TestCase):

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
            "reviewBody": "Great product!",
            "reviewRating": review_rating_data
        }
        review = ReviewModel(**review_data)
        self.assertEqual(review.reviewBody, "Great product!")

    def test_aggregate_rating_model(self):
        aggregate_rating_data = {"ratingValue": "4", "bestRating": "5", "ratingCount": "100"}
        aggregate_rating = AggregateRatingModel(**aggregate_rating_data)
        self.assertEqual(aggregate_rating.ratingValue, "4")

    def test_product_model(self):
        author_data = {"name": "John Doe"}
        review_rating_data = {"ratingValue": "4"}
        review_data = {
            "author": author_data,
            "reviewBody": "Great product!",
            "reviewRating": review_rating_data
        }
        aggregate_rating_data = {"ratingValue": "4", "bestRating": "5", "ratingCount": "100"}
        product_data = {
            "reviews": [ReviewModel(**review_data)],
            "aggregateRating": AggregateRatingModel(**aggregate_rating_data)
        }
        product = ProductModel(**product_data)
        self.assertEqual(product.reviews[0].reviewBody, "Great product!")


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

product_instance = ProductModel.model_validate(json.loads(json_data))
print(product_instance.model_dump_json(by_alias=True, indent=4))

print("--------------------------")
new_author = AuthorModel(name="Barak Obama")
new_rev_rat = ReviewRatingModel(ratingValue="3")
new_review = ReviewModel(reviewBody="Awesome!", author=new_author, reviewRating=new_rev_rat)

print(new_review.model_dump_json(by_alias=True, indent=4))
print("--------------------------")
product_instance.reviews.append(new_review)
rating_count_avg = 0
for _ in product_instance.reviews:
    rating_count_avg += int(_.reviewRating.ratingValue)

rating_count_avg = round(rating_count_avg / len(product_instance.reviews))
product_instance.aggregateRating.ratingValue = str(rating_count_avg)
print(f'average rating: {rating_count_avg}')
print("--------------------------")
print(product_instance.model_dump_json(by_alias=True, indent=4))

g = Graph().parse(data=json.loads(product_instance.model_dump_json(by_alias=True)), format='json-ld')
result = g.serialize(format="turtle")
print(result)

