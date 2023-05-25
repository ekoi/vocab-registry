import dayjs from 'dayjs';
import React, {MouseEvent, ReactElement, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import LocationIcon from './locationIcon';
import {Vocab, VocabLocation, VocabRecommendation} from '../misc/interfaces';
import Yasgui from '../misc/yasgui.js';

interface OpenLocation {
    type: string;
    endpoint: string;
}

export default function Description({data}: { data: Vocab }) {
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

    const latestVersion = data.versions
        ?.sort((a, b) => -1 * a.version.localeCompare(b.version))
        ?.find(Boolean);

    return (
        <>
            {(data.locations.length > 0 || data.versions?.find(v => v.locations.length > 0)) &&
                <div className="iconBar extraBottomMargin">
                    {data.locations.concat(...(latestVersion?.locations || [])).map(loc =>
                        <LocationIcon key={loc.location} location={loc}
                                      onClick={e => onLocationClick(loc, e)}/>)}
                </div>}

            {data.description && <ReactMarkdown className="detailLine extraBottomMargin">
                {data.description}
            </ReactMarkdown>}

            <div className="detailTable">
                <DetailRow label="Created" values={dayjs(data.created).format('MMM D, YYYY HH:mm')}/>
                <DetailRow label="Modified" values={dayjs(data.modified).format('MMM D, YYYY HH:mm')}/>
                <DetailRow label="License" values={<a href={data.license}>{data.license}</a>}/>
                {data.versioningPolicy && <DetailRow label="Versioning policy" values={data.versioningPolicy}/>}
                {data.sustainabilityPolicy &&
                    <DetailRow label="Sustainability policy" values={data.sustainabilityPolicy}/>}
                {data.recommendations &&
                    <DetailRow label="Publisher" values={data.recommendations.map(r =>
                        <Recommendation key={r.publisher} vocab={data} recommendation={r}/>)}/>}
            </div>

            <div className={`vocabVersionBody ${showFor !== null ? 'open' : ''}`}>
                {showFor && showFor.type === 'sparql' && <VersionYasgui endpoint={showFor.endpoint}/>}
            </div>
        </>
    );
}

function DetailRow({label, values}: { label: string, values: string | string[] | ReactElement | ReactElement[] }) {
    return (
        <div className="detailRow">
            <div className="labelCell">{label}</div>
            <div className="cell">
                {Array.isArray(values) ? (<ul className="hcNoList">
                    {values.map((v, i) =>
                        <li key={i}>{v}</li>
                    )}
                </ul>) : values}
            </div>
        </div>
    );
}

function Recommendation({recommendation, vocab}: { vocab: Vocab, recommendation: VocabRecommendation }) {
    switch (recommendation.publisher) {
        case 'YALC':
            const id = vocab.id.replace('yalc-', '');
            const encodedId = encodeURIComponent(id);
            return <a href={`https://github.com/TriplyDB/YALC/blob/master/datasets/${encodedId}.json`}
                      target="_blank">YALC</a>;
        case 'Awesome Humanities':
            return <a href="https://github.com/CLARIAH/awesome-humanities-ontologies"
                      target="_blank">Awesome Humanities</a>;
        default:
            return <>{recommendation.publisher}</>;
    }
}

function VersionYasgui({endpoint}: { endpoint: string }) {
    const config = {requestConfig: {endpoint}, persistenceId: endpoint};
    return <Yasgui config={config} disableEndpointSelector={true}/>;
}
