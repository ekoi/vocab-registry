import {Vocab} from '../misc/interfaces';
import useAuth from "../hooks/useAuth";
import ReportAbuse from "./ReportAbuse";
import React from "react";

import {ReviewForm, StarRating} from "review-component-react"



export default function Reviews({data}: { data: Vocab }) {
    const [userInfo] = useAuth();
    const url_target = `/review/${data.id}`

    const handleRating = async (stars: number, text: string) => {

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
                 }
                );
    }

    const login = () => {
       window.location.href = '/login'
    };
    return (
        <div>
            {data.reviews.map(review => (
                <div className="review" key={review.id}>
                    <div className="hcAlignLeft hcMarginBottom1">
                            <StarRating rate={review.rating} readonly={true} handleRating={() => null}/>
                        {review.nickname && <span>{review.nickname}</span>}
                    </div>

                    <p>{review.review}</p>
                </div>
            ))}

            {!userInfo ?
            <button onClick={login} >Do you want write a review? Please log in.</button> :
            <div><ReviewForm handleRating={handleRating}/></div>
        }

            <div><ReportAbuse url_target="/mail"/></div>
        </div>
    );
}