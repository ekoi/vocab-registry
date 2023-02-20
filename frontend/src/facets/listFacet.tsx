import React from "react";
import {Fragment} from "react";
import {IFacetValue, ISendCandidate} from "../misc/interfaces";
import {useState, useEffect} from "react";

function ListFacet(props: {parentCallback: ISendCandidate, name: string, field: string}) {
    const [data, setData] = useState<IFacetValue[]>([]);
    const [url, setUrl] = useState("/facet?name=" + props.field + "&amount=10");
    const [loading, setLoading] = useState(true);
    const [more, setMore] = useState(true);
    const [hidden, setHidden] = useState(true);

    async function fetchData() {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
    }

    function sendCandidate(value: string) {
        props.parentCallback({facet: props.name, field: props.field, candidate: value});
    }

    function changeListLength() {
        if (more) {
            setUrl("/facet?name=" + props.field + "&amount=500");
        } else {
            setUrl("/facet?name=" + props.field + "&amount=10");
        }
        setMore(!more);
    }

    useEffect(() => {
        fetchData();
    }, [url]);

    return (
        <div className="hcFacet">
            <div className="hcFacetTitle" onClick={() => setHidden(!hidden)}>
                <span>{props.name}</span>
                <span className="hcIconHelp">
                    {hidden ? (<Fragment>+</Fragment>) : (<Fragment>-</Fragment>)}
                </span>
            </div>
            {!hidden &&
            <div className="hcFacetItems">
                {!loading ? (<div>
                    {data.map((item, index) => {
                        return (<div key={index} className="hcFacetItem"  onClick={() => {sendCandidate(item.key)}}><div className="checkBoxLabel"> {item.key} ({item.doc_count})</div></div>);
                    })}
                    <div className="hcClickable" onClick={changeListLength}>
                        {more ? (<div>More...</div>) : (<div>Less...</div>)}
                    </div>
                </div>) : (<div>Loading...</div>)}
                <div>
                </div>
            </div>
            }
        </div>
    );
}

export default ListFacet;