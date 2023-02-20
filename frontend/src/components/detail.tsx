import React from "react";
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import {IResultItem} from "../misc/interfaces";

function Detail() {
    const dummy: IResultItem = {
        record:"",
        title: "",
        description: "",
        home: "",
        endpoint: "",
        license: "",
    }
    const params = useParams();
    const id = params.id as String;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IResultItem>(dummy);
    document.title = "Item | CLARIAH+ FAIR Vocabulary Registry";

    async function fetch_data() {
        const url = "/detail?rec=" + id;
        const response = await fetch(url);
        const json: IResultItem = await response.json();
        if (json.title !== undefined) {
            setData(json as IResultItem);
            console.log(json);
            setLoading(false);
        }
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
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                Endpoint
                            </div>
                            <div className="ecoCell">
                                {data.endpoint}
                            </div>
                        </div> 
                        <div className="ecoDetailRow">
                            <div className="ecoLabelCell">
                                License
                            </div>
                            <div className="ecoCell">
                                {data.license}
                            </div>
                        </div>                                                                  
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Detail;