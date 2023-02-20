import React from "react";
import {IResultList, IResultItem} from "../misc/interfaces";
import VocabListDetails from "./vocabListDetails";

function VocabList(props: {result: IResultList}) {
    return (
        <div>
        {props.result.items.map((item: IResultItem, index: number) => {
            return (
                <VocabListDetails result={item} key={index}/>
            )
            })}
        </div>)
}

export default VocabList