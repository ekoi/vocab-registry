import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'

const tooltipArray = [
  "Terrible",
  "Bad",
  "Average",
  "Great",
  "Awesome",
];
interface RatingProps {
  user_id: string
  page_id: string
  rate: number
  readonly : boolean
  handleRating: any
}
export default function StarRating({ user_id, page_id, rate , readonly, handleRating}: RatingProps) {
  return (
    <div>
      <Rating
        onClick={(number) => handleRating(number)}
        // onPointerEnter={onPointerEnter}
        // onPointerLeave={onPointerLeave}
        // onPointerMove={onPointerMove}
        /* Available Props */
        initialValue={rate}
        readonly={readonly}
        showTooltip
        tooltipArray={tooltipArray}
      />
    </div>
  )
}