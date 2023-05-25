import dayjs from 'dayjs';
import React, {MouseEvent, useState} from 'react';
import LocationIcon from './locationIcon';
import Yasgui from '../misc/yasgui';
import {Vocab, VocabLocation, VocabVersion} from '../misc/interfaces';

interface OpenLocation {
    type: string;
    endpoint: string;
}

export default function Versions({data}: { data: Vocab }) {
    return (
        <>
            {data.versions
                .sort((a, b) => -1 * a.version.localeCompare(b.version))
                .map(version => <Version version={version} key={version.version}/>)}
        </>
    );
}

function Version({version}: { version: VocabVersion }) {
    const [showFor, setShowFor] = useState<OpenLocation | null>(null);

    const onLocationClick = (loc: VocabLocation, e: MouseEvent<HTMLAnchorElement>) => {
        if (showFor && showFor.type === loc.recipe && showFor.endpoint === loc.location) {
            setShowFor(null);
            e.preventDefault();
        }
        else if (loc.recipe === 'sparql') {
            setShowFor({type: loc.recipe, endpoint: loc.location});
            e.preventDefault();
        }
    };

    return (
        <div className="vocabVersion">
            <div className="vocabVersionHeader">
                {version.version}

                {version.validFrom && <span className="vocabVersionDate pill">
                    Valid from: {dayjs(version.validFrom).format('MMM D, YYYY')}
                </span>}

                {version.locations.length > 0 && <div className="iconBar inline">
                    {version.locations.map(loc =>
                        <LocationIcon key={loc.location} location={loc} onClick={e => onLocationClick(loc, e)}/>)}
                </div>}
            </div>

            <div className={`vocabVersionBody ${showFor !== null ? 'open' : ''}`}>
                {showFor && showFor.type === 'sparql' && <VersionYasgui endpoint={showFor.endpoint}/>}
            </div>
        </div>
    );
}

function VersionYasgui({endpoint}: { endpoint: string }) {
    const config = {requestConfig: {endpoint}, persistenceId: endpoint};
    return <Yasgui config={config} disableEndpointSelector={true}/>;
}
