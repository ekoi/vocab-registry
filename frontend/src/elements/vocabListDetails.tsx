import React from "react";
import {useNavigate} from "react-router-dom";
import {IResultItem} from "../misc/interfaces";

function VocabListDetails(props: {result: IResultItem}) {
    let navigate = useNavigate();

    return (<div className="hcResultListDetail">
        <h2>{props.result.title}</h2>
        <div className="detailLine"><strong>Ingevoerd op: 01/11/2021</strong></div>
        <div>
            <ul className="ManuscriptListBtns">
                <li onClick={() => {
                    window.scroll(0, 0);
                    navigate('/detail/' + props.result.record)}
                }>Details</li>
            </ul>
        </div>
    </div>);
}

export default VocabListDetails;