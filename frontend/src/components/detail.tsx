import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {Fragment} from "react";
import img from "../assets/img/M0004.jpg";
import {HOME, SERVICE} from "../misc/config";
import {IResultItem, IPublisher, IResultList, ICollection_item, ISearchObject} from "../misc/interfaces";
import Document from "../elements/document";
import Bibliography from "../elements/bibliography";
import Annotations from "../elements/annotations";
import {Base64} from "js-base64";


function Detail() {
    let navigate = useNavigate();
    const dummy: IResultItem = {
        record:"",
        title: "",
        description: "",
        home: "",
    }
    const params = useParams();
    const id = params.id as String;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IResultItem>(dummy);
    document.title = "Item | CLARIAH+ FAIR Vocabulary Registry";

    async function fetch_data() {
        const url = SERVICE + "/detail?rec=" + id;
        const response = await fetch(url);
        const json: IResultItem = await response.json();
        if (json.title !== undefined) {
            setData(json as IResultItem);
            console.log(json);
            setLoading(false);
        }
    }

    function goSearch(label: string, field: string, facetValue: string) {
        let searchStruc: ISearchObject = {
            searchvalues: [{name: label, field: field, values: [facetValue]}],
            page: 1,
            page_length: 30,
            sortorder: "title"
        };
        const code: string = Base64.encode(JSON.stringify(searchStruc));
        navigate("/search/" + code);
    }
    useEffect(() => {
        fetch_data();
    }, [loading]);

    return (

        <div className="hcContentContainer">
            <div className="hcLayoutFacet-Result hcBasicSideMargin hcMarginBottom15">
                {loading ? (
                    <div>Loading</div>
                ) : (<div>
                    <h3 className="detailH3">{data.title}</h3>
                    <div className="ecoDetailTable">
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Title
                            </div>
                            <div className="ecoCell">
                                {data.title}
                            </div>
                        </div>
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Description
                            </div>
                            <div className="ecoCell">
                                {data.description}
                            </div>
                        </div>
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Homepage
                            </div>
                            <div className="ecoCell">
                                {data.home}
                            </div>
                        </div>                   
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Detail;