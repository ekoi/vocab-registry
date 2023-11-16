import {Vocab} from '../misc/interfaces';
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
import useAuth from "../hooks/useAuth";
import ReportAbuse from "./ReportAbuse";


export default function Reviews({data}: { data: Vocab }) {
    const [userInfo] = useAuth();
    return (
        <>
            {data.reviews.map(review => (
                <div className="review" key={review.id}>
                    <div className="hcAlignLeft hcMarginBottom1">
                        <div>
                            <StarRating page_id={review.id} rate={review.rating} user_id={review.id} readonly={true} handleRating={0}/>
                        </div>
                        {review.nickname && <span>{review.nickname}</span>}
                    </div>

                    <p>{review.review}</p>
                </div>
            ))}

            <div><ReviewForm id={data.id} user={data.user} /></div>
            <div><ReportAbuse/></div>

        </>
    );
}