import React from "react";
import {IResultList, IResultItem} from "../misc/interfaces";
import ManuscriptListDetails from "./manuscriptListDetails";

function ManuscriptList(props: {result: IResultList}) {
    return (
        <div>
        {props.result.items.map((item: IResultItem, index: number) => {
            return (
                <ManuscriptListDetails result={item} key={index}/>
            )
            })}
        </div>)
}

export default ManuscriptList