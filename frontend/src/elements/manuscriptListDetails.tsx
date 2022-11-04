import React from "react";
import {useNavigate} from "react-router-dom";
import {IResultItem, IRol} from "../misc/interfaces";
import img from "../assets/img/manuscript.jpg";

function ManuscriptListDetails(props: {result: IResultItem}) {
    let navigate = useNavigate();

    function compare( a: IRol, b: IRol ) {
        if ( a.rol < b.rol ){
            return -1;
        }
        if ( a.rol > b.rol ){
            return 1;
        }
        return 0;
    }
    //let roles: IRol[] = props.result.rol;
    //roles.sort(compare);

    return (<div className="hcResultListDetail">
        <h2>{props.result.titel}</h2>
        <div className="detailLine"><strong>Ingevoerd op: 01/11/2021</strong></div>
        <div>
            <ul className="ManuscriptListBtns">
                <li onClick={() => {
                    window.scroll(0, 0);
                    navigate('/detail/' + props.result._id)}
                }>Details</li>
            </ul>
        </div>
    </div>);
}

export default ManuscriptListDetails;