import React from 'react';
import {FreeTextFacet, ListFacet, ISendCandidate} from 'browser-base-react';

export default function Facets({sendCandidateHandler}: { sendCandidateHandler: ISendCandidate }) {
    return <>
        <FreeTextFacet add={sendCandidateHandler}/>
        <ListFacet parentCallback={sendCandidateHandler}
                   name="Type of vocabulary"
                   field="type"
                   url="/facet"/>
        <ListFacet parentCallback={sendCandidateHandler}
                   name="Publisher"
                   field="publisher.publisher"
                   url="/facet"/>
    </>;
}
