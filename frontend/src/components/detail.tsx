import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {Fragment} from "react";
import img from "../assets/img/M0004.jpg";
import {HOME, SERVICE} from "../misc/config";
import {IResultItem, IResultList, ICollection_item, ISearchObject} from "../misc/interfaces";
import Document from "../elements/document";
import Bibliography from "../elements/bibliography";
import Annotations from "../elements/annotations";
import {Base64} from "js-base64";


function Detail() {
    let navigate = useNavigate();
    const dummy: IResultItem = {
        _id: "",
//        locatie: [],
        telefoon: "",
//        onderwerp: [],
//        organisatie: [],
//        rol: [],
        titel: "'"
    }
    const params = useParams();
    const id = params.id as String;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IResultItem>(dummy);
    document.title = "Item | Diplomatieke Getuigenissen";

    /*
    async function fetch_data() {
        const url = SERVICE + "/item?id=" + id;
        const response = await fetch(url);
        const json: IResultItem = await response.json();
        if (json.titel !== undefined) {
            setData(json as IResultItem);
            setLoading(false);
        }
    }
    */

    async function fetch_data() {
        const url = SERVICE + "/detail?rec=1";
        const response = await fetch(url);
        const json: IResultItem = await response.json();
        if (json.titel !== undefined) {
            setData(json as IResultItem);
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
            {/*<div className="collectionBrowser">
                {collectionFetched ? (
                    <div>Select manuscript from search results: </div>
                ) : (
                    <div>Loading</div>
                )}
            </div>*/}
            <div className="hcLayoutFacet-Result hcBasicSideMargin hcMarginBottom15">
                {loading ? (
                    <div>Loading</div>
                ) : (<div>
                    <h3 className="detailH3">{data.titel}</h3>
                    <div className="ecoDetailTable">
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Titel
                            </div>
                            <div className="ecoCell">
                                {data.titel}
                            </div>
                        </div>
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Telefoon
                            </div>
                            <div className="ecoCell">
                                {data.telefoon}
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Detail;