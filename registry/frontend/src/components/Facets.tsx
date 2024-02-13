import React from 'react';
import {FreeTextFacet, ListFacet, FacetsParams} from 'browser-base-react';

export default function Facets({registerFacet, unregisterFacet, setFacet, searchValues}: FacetsParams) {
    return <>
        <FreeTextFacet registerFacet={registerFacet} unregisterFacet={unregisterFacet} setFacet={setFacet}/>
        <ListFacet registerFacet={registerFacet}
                   unregisterFacet={unregisterFacet}
                   setFacet={setFacet}
                   name="Type of vocabulary"
                   field="type"
                   url="/facet"
                   flex={false}
                   searchValues={searchValues}/>
        <ListFacet registerFacet={registerFacet}
                   unregisterFacet={unregisterFacet}
                   setFacet={setFacet}
                   name="Publisher"
                   field="publisher"
                   url="/facet"
                   flex={false}
                   searchValues={searchValues}/>
    </>;
}
