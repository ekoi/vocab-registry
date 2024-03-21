import dayjs from 'dayjs';
import React, {ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import LocationIconBar from './LocationIconBar';
import LocationInteract from './LocationInteract';
import useLocationFocus from '../hooks/useLocationFocus';
import {Vocab, VocabRecommendation} from '../misc/interfaces';

export default function Description({data}: { data: Vocab }) {
    const [locationFocus, onLocationClick] = useLocationFocus();

    const latestVersion = data.versions
        ?.sort((a, b) => -1 * a.version.localeCompare(b.version))
        ?.find(Boolean);
    const locations = data.locations.concat(...(latestVersion?.locations || []));

    return (
        <>
            {locations.length > 0 && <div className="extraBottomMargin">
                <LocationIconBar locations={locations} onLocationClick={onLocationClick} inline={false}/>
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

            <LocationInteract location={locationFocus}/>
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
