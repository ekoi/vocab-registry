import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {
    ISendCandidate,
    IFacetCandidate,
    ISearchObject,
    ISearchValues,
    ISendPage,
    IResetFacets,
    IResultList,
    IRemoveFacet
} from "../misc/interfaces";
import {Base64} from "js-base64";
import FreeTextFacet from "../facets/freeTextFacet";
import ListFacet from "../facets/listFacet";
import CenturyFacet from "../facets/centuryFacet";
import {SERVICE, HOME} from "../misc/config";
import ManuscriptList from "../elements/manuscriptList";
import {Fragment} from "react";


function Search() {
    const params = useParams();
    const parameters: ISearchObject = JSON.parse(Base64.decode(params.code as string));
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(parameters.page);
    const [refresh, setRefresh] = useState(true);
    const [result, setResult] = useState<IResultList>({amount: 0, pages: 0, items: []});
    const [numberOfItems, setNumberOfItems] = useState(0);
    let navigate = useNavigate();
    document.title = "Search | Diplomatieke Getuigenissen";

    let searchBuffer: ISearchObject = {
        searchvalues: parameters.searchvalues,
        page: page,
        page_length: 500,
        sortorder: "titel",
    };

    let facets = parameters.searchvalues;

    const [searchStruc, setSearchStruc] = useState(searchBuffer);
    const cross: string = "[x]";

    async function fetch_data() {
        const url = SERVICE + "/browse";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': HOME
            },
            body: JSON.stringify(searchStruc)
        });
        const json: IResultList = await response.json();
        setResult(json);
        setNumberOfItems(json.amount);
        setLoading(false);
    }

    const goToPage: ISendPage = (page: number) => {
        searchBuffer.page = page;
        setSearchStruc(searchBuffer);
        setRefresh(!refresh);
        navigate('/search/' + Base64.toBase64(JSON.stringify(parameters)));
        window.scroll(0, 0);
    }

    const removeFacet: IRemoveFacet = (field: string, value: string) => {
        searchBuffer = searchStruc;
        if (typeof searchBuffer.searchvalues === "object") {
            searchBuffer.searchvalues.forEach((item: ISearchValues) => {
                if (item.name === field) {
                    item.values = item.values.filter((element => element !== value));
                }
            })
            searchBuffer.searchvalues = searchBuffer.searchvalues.filter(function (el) {
                return el.values.length > 0
            });
            if (searchBuffer.searchvalues.length === 0) {
                searchBuffer.searchvalues = [];
            }
        }
        setSearchStruc(searchBuffer);
        setRefresh(!refresh);
        navigate('/search/' + Base64.toBase64(JSON.stringify(searchStruc)));
        window.scroll(0, 0);
    }

    const resetFacets: IResetFacets = () => {
        //searchBuffer = searchStruc;
        //searchBuffer.page = 1;
        searchBuffer.searchvalues = [];
        setSearchStruc(searchBuffer);
        navigate('/search/' + Base64.toBase64(JSON.stringify(searchBuffer)));
        //window.scroll(0, 0);
        setRefresh(!refresh);
    }

    const sendCandidate: ISendCandidate = (candidate: IFacetCandidate) => {
        setPage(1);
        if (parameters.searchvalues.length === 0) {
            parameters.searchvalues = [{
                name: candidate.facet,
                field: candidate.field,
                values: [candidate.candidate]
            } as ISearchValues];
            parameters.page = 1;
            searchBuffer.searchvalues = parameters.searchvalues;
            setSearchStruc(searchBuffer);
        } else {
            if (typeof parameters.searchvalues === "object") {
                let found: boolean = false;
                parameters.searchvalues.forEach((item) => {
                    if (item.name === candidate.facet) {
                        found = true;
                        if (!item.values.includes(candidate.candidate)) {
                            item.values.push(candidate.candidate);
                        }
                    }
                });
                if (!found) {
                    parameters.searchvalues.push({
                        name: candidate.facet,
                        field: candidate.field,
                        values: [candidate.candidate]
                    });
                }
            }
            searchBuffer.searchvalues = parameters.searchvalues;
            setSearchStruc(searchBuffer);
        }
        navigate('/search/' + Base64.toBase64(JSON.stringify(searchBuffer)));
        console.log(searchBuffer);
        window.scroll(0, 0);
        setRefresh(!refresh);
    }

    useEffect(() => {
        fetch_data();
    }, [refresh]);

    return (
        <div className="hcContentContainer">
            <div className="hcBasicSideMargin hcMarginTop1 hcMarginBottom1">
                <h1>Search</h1>
            </div>
            <div className="hcLayoutFacet-Result hcBasicSideMargin hcMarginBottom15">
                <div className="hcLayoutFacets">
                    <FreeTextFacet add={sendCandidate}/>
                    <ListFacet parentCallback={sendCandidate} name="Naam" field="naam"/>
                    <ListFacet parentCallback={sendCandidate} name="Locatie" field="locatie.locatie"/>
                    <ListFacet parentCallback={sendCandidate} name="Organisatie" field="organisatie.organisatie"/>
                    <ListFacet parentCallback={sendCandidate} name="Rol" field="rol.rol"/>
                    <ListFacet parentCallback={sendCandidate} name="Onderwerp" field="onderwerp.onderwerp"/>
                </div>
                <div className="hcLayoutResults">
                    <div className="hcResultsHeader hcMarginBottom1">
                        <div>{numberOfItems} items found</div>
                    </div>
                    <div className="hcMarginBottom2">
                        <div className="hcSmallTxt hcTxtColorGreyMid">Selected facets:
                            <span className="hcFacetReset hcClickable" onClick={resetFacets}>Reset facets</span>
                        </div>
                        {searchStruc.searchvalues.length === 0 ? (
                            <Fragment><span className="hcSelectedFacet"><span
                                className="hcSelectedFacetType">None</span></span></Fragment>
                        ) : (
                            facets.map((item: ISearchValues) => {
                                return (
                                    <span className="hcSelectedFacet"><span
                                        className="hcSelectedFacetType">{item.name}: </span>
                                        {item.values.map(function (skipper, i) {
                                            return (<div className="hcFacetValues" key={i}
                                                         onClick={() => removeFacet(item.name, skipper)}>{skipper} {cross} </div>)
                                        })}
                                    </span>
                                )
                            })
                        )}
                    </div>
                    {/*<div className="hcList">
                        <div className="hcListHeader">
                            <div className="hcLabel">Manuscripts</div>
                        </div>
                    </div>*/}
                    {loading ? (<div className="hcResultListLoading">Loading...</div>) : (
                        <ManuscriptList result={result}/>)}
                </div>
            </div>
        </div>
    )
}

export default Search;