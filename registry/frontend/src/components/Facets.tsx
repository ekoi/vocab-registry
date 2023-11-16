import React from 'react';
import {FreeTextFacet, ListFacet, ISendCandidate} from 'browser-base-react';
import useAuth from "../hooks/useAuth";

export default function Facets({sendCandidateHandler}: { sendCandidateHandler: ISendCandidate }) {
    const [userInfo] = useAuth();
    return <>

        {!userInfo ?
            <button >Log in</button> :
            <button >welcome ${userInfo.family_name}</button>
        }

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
