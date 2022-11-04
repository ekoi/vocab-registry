import React from 'react';
import {Fragment} from "react";
import {useState, useEffect} from "react";
import {IFacetValue, ISearchObject, ISearchValues} from "../misc/interfaces";
import {HOME, SERVICE} from "../misc/config";
import {Base64} from "js-base64";
import {useNavigate} from "react-router-dom";

function Collections() {
    let navigate = useNavigate();
    document.title ="Diplomatieke Getuigenissen";

    function goSearch(facetValue: string) {
        let searchStruc: ISearchObject = {
            searchvalues: [{name: "Collection", field: "collection", values: [facetValue]}],
            page: 1,
            page_length: 30,
            sortorder: "titel"
        };
        if (facetValue == "all") {
            searchStruc.searchvalues = [];
        }
        const code: string = Base64.encode(JSON.stringify(searchStruc));
        navigate("search/" + code);
    }

    return (
        <div className="hcContentContainer">
            <h2>Demo Diplomatieke Getuigenissen</h2>
            <div>
                Dit is een demo voor het zoeken in de metadata van de collectie Diplomatieke Getuigenissen.
            </div>
            <div className="hcClickable" onClick={() => goSearch("all")}>Browse</div>


        </div>
    )

}

export default Collections;