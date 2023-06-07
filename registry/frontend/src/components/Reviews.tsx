import {Vocab} from '../misc/interfaces';

export default function Reviews({data}: { data: Vocab }) {
    return (
        <>
            {data.reviews.map(review => (
                <div className="review" key={review.id}>
                    <div className="hcAlignLeft hcMarginBottom1">
                        <StarRating rating={review.rating}/>
                        {review.nickname && <span>{review.nickname}</span>}
                    </div>

                    <p>{review.review}</p>
                </div>
            ))}
        </>
    );
}

function StarRating({rating}: { rating: number }) {
    return (
        <span>
            {Array.from({length: 5}).map((_, idx) => (
                <span className={`star${rating >= idx + 1 ? ' filled' : ''}`} key={idx + 1}>&#9733;</span>
            ))}
        </span>
    );
}
