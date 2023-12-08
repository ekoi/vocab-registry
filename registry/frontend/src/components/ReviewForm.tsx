import React, {useState} from 'react';
import * as Form from '@radix-ui/react-form';
import StarRating from "./StarRating";
import {useNavigate} from "react-router-dom";

interface FormParam{
    id: string
    user: string
}
const ReviewForm = ({id, user}:FormParam) => {
    const navigate = useNavigate();
    const [stars, setStars] = useState(0);
    const [invalidStars, setInvalidStars] = useState(false);
    const [success, setSuccess] = useState(false)

    return (
        success ?
            <div>Succesfully submitted</div>
            :
        <Form.Root
            // `onSubmit` only triggered if it passes client-side validation
            onSubmit={async (event) => {
                event.preventDefault();
                if (!stars) {
                    setInvalidStars(true)
                    return;
                }
                setInvalidStars(false)
                let item_name = user + "-" + id
                console.log('item_name from ReviewForm: ' + item_name)
                // let textFromStorage = localStorage.getItem(item_name);
                // console.log("text - textFromStorage: " + textFromStorage)

                const data = Object.fromEntries(new FormData(event.currentTarget));
                let textArea_msg = data['reviewText']
                console.log("textArea message: " + textArea_msg)
                const url_target = "/review/" + id
                console.log(url_target)

                let result = await fetch(url_target, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        "user": user,
                        "rating": Number(stars),
                        "review": textArea_msg

                    })

                }).then(response => {
                        console.log("********" + response.status)
                        console.log(response)
                        let x = "/detail/"+id;
                        console.log("id:" + id)
                        // submit was succesful
                        setSuccess(true);
                 }
                );
            }}
        >
            <StarRating
                page_id={id}
                rate={stars}
                user_id={user}
                readonly={false}
                handleRating={setStars}
            />
            {invalidStars && stars === 0 && <div>Please enter a rating</div>}
            <Form.Field name="review">
                <Form.Label className="FormLabel">Your Review</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                    Please enter your review
                </Form.Message>
                <Form.Control asChild>
                    <textarea name="reviewText" className="Textarea" rows="10" cols="115" required />
                </Form.Control>
            </Form.Field>
            <Form.Submit asChild>
                <button className="Button" style={{ marginTop: 10 }}>
                    Post review
                </button>
            </Form.Submit>
        </Form.Root>
    );
}

export default ReviewForm;


 function handleSubmit(formData: FormData) {
    console.log(formData);
  }