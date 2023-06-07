import dayjs from 'dayjs';
import React from 'react';
import LocationIconBar from './LocationIconBar';
import LocationInteract from './LocationInteract';
import useLocationFocus from '../hooks/useLocationFocus';
import {Vocab, VocabVersion} from '../misc/interfaces';

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
    const [locationFocus, onLocationClick] = useLocationFocus();

    return (
        <div className="vocabVersion">
            <div className="vocabVersionHeader">
                {version.version}

                {version.validFrom && <span className="vocabVersionDate pill">
                    Valid from: {dayjs(version.validFrom).format('MMM D, YYYY')}
                </span>}

                {version.locations.length > 0 &&
                    <LocationIconBar locations={version.locations} inline={true} onLocationClick={onLocationClick}/>}
            </div>

            <LocationInteract location={locationFocus}/>
        </div>
    );
}
