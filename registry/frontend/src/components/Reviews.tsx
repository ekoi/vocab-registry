import React from 'react';
import {ReviewForm, StarRating} from 'review-component-react';
import ReportAbuse from './ReportAbuse';
import {Review, Vocab} from '../misc/interfaces';
import useAuth from '../hooks/useAuth';

export default function Reviews({data}: { data: Vocab }) {
    return (
        <div>
            <ListReviews reviews={data.reviews}/>
            <AddReview id={data.id}/>
            <ReportAbuse url_target="/mail"/>
        </div>
    );
}

function ListReviews({reviews}: { reviews: Review[] }) {
    return (
        <>
            {reviews.map(review => (
                <div className="review" key={review.id}>
                    <div className="hcAlignLeft hcMarginBottom1">
                        <StarRating rate={review.rating} readonly={true} handleRating={() => null}/>
                        {review.nickname && <span>{review.nickname}</span>}
                    </div>

                    <p>{review.review}</p>
                </div>
            ))}
        </>
    );
}

function AddReview({id}: { id: string }) {
    const [authEnabled, userInfo] = useAuth();

    const handleRating = async (stars: number, text: string) => {
        await fetch(`/review/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user': 'user',
                'rating': Number(stars),
                'review': text
            })
        });
    }

    if (authEnabled && !userInfo) {
        const redirectUri = `/login?redirect-uri=${encodeURIComponent(window.location.href)}`;

        return (
            <p>
                Do you want write a review? Please <a href={redirectUri}>log in</a>.
            </p>
        );
    }

    return <ReviewForm handleRating={handleRating}/>;
}
