import React from 'react';
import {FreeTextFacet, ISearchValues, ISendCandidate, ListFacet} from 'browser-base-react';

export default function Facets({sendCandidateHandler, searchValues}: {
    sendCandidateHandler: ISendCandidate,
    searchValues: ISearchValues[]
}) {
    return <>
        <FreeTextFacet add={sendCandidateHandler}/>
        <ListFacet parentCallback={sendCandidateHandler}
                   name="Type of vocabulary"
                   field="type"
                   url="/facet"
                   searchValues={searchValues}/>
        <ListFacet parentCallback={sendCandidateHandler}
                   name="Publisher"
                   field="publisher.publisher"
                   url="/facet"
                   searchValues={searchValues}/>
    </>;
}
