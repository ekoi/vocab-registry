import React from 'react';
import {Fragment} from "react";
import {useState, useEffect} from "react";
import {IFacetValue, ISearchObject, ISearchValues} from "../misc/interfaces";
import {Base64} from "js-base64";
import {useNavigate} from "react-router-dom";

function Collections() {
    let navigate = useNavigate();
    document.title ="CLARIAH+ FAIR Vocabulary Registry";

    function goSearch(facetValue: string) {
        let searchStruc: ISearchObject = {
            searchvalues: [{name: "Collection", field: "collection", values: [facetValue]}],
            page: 1,
            page_length: 30,
            sortorder: "title"
        };
        if (facetValue == "all") {
            searchStruc.searchvalues = [];
        }
        const code: string = Base64.encode(JSON.stringify(searchStruc));
        navigate("search/" + code);
    }

    return (
        <div className="hcContentContainer">
            <h2>CLARIAH+ FAIR Vocabulary Registry</h2>
            <div>
                Find a FAIR Vocabulary that suits you needs!
            </div>
            <div className="hcClickable" onClick={() => goSearch("all")}>Browse</div>


        </div>
    )

}

export default Collections;