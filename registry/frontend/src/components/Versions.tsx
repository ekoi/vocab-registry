import dayjs from 'dayjs';
import React from 'react';
import {VocabVersion} from '../misc/interfaces';

interface VersionsParams {
    versions: VocabVersion[];
    active: string | null;
    changeVersion: (version: string) => void;
}

interface VersionParams {
    version: VocabVersion;
    isActive: boolean;
    setActive: () => void;
}

export default function Versions({versions, active, changeVersion}: VersionsParams) {
    return (
        <div className="vocabVersions">
            <div className="vocabVersionsHeader">Versions:</div>

            {versions.map(version =>
                <Version key={version.version} version={version}
                         isActive={active === version.version}
                         setActive={() => changeVersion(version.version)}/>)}
        </div>
    );
}

function Version({version, isActive, setActive}: VersionParams) {
    return (
        <button className={`vocabVersion ${isActive ? 'vocabVersionActive' : ''}`} onClick={setActive}>
            {version.version}

            {version.validFrom && <div className="vocabVersionDate pill">
                {dayjs(version.validFrom).format('MMM D, YYYY')}
            </div>}
        </button>
    );
}
