import {Vocab} from '../misc/interfaces';
import useAuth from "../hooks/useAuth";
import ReportAbuse from "./ReportAbuse";
import React from "react";
import {useNavigate} from "react-router-dom";

import {StarRating} from "review-component-react"
import ReviewForm from "./ReviewForm"



export default function Reviews({data}: { data: Vocab }) {
    const [userInfo] = useAuth();
    const navigate = useNavigate();
    const url_target = `/review/${data.id}`

    const handleRating = async (stars, text, setSuccess) => {

               await fetch(url_target, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        "user": "user",
                        "rating": Number(stars),
                        "review": text

                    })

                }).then(response => {
                        console.log("********" + response.status)
                        console.log(response)
                        // submit was succesful
                        setSuccess(true);
                 }
                );
    }

    const login = () => {
       window.location.href = '/login'
    };
    return (
        <>
            {data.reviews.map(review => (
                <div className="review" key={review.id}>
                    <div className="hcAlignLeft hcMarginBottom1">
                            <StarRating page_id={review.id} rate={review.rating} user_id={review.id} readonly={true} handleRating={0}/>
                        {review.nickname && <span>{review.nickname}</span>}
                    </div>

                    <p>{review.review}</p>
                </div>
            ))}
            {!userInfo ?
            <button onClick={login} >Do you want write a review? Please log in.</button> :
            <div><ReviewForm id={data.id} user={data.user} handleRating={handleRating}/></div>
        }

            <div><ReportAbuse/></div>

        </>
    );
}