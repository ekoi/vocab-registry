import React, {ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import {Vocab, VocabRecommendation} from '../misc/interfaces';

export default function Description({data}: { data: Vocab }) {
    return (
        <>
            {data.description && <ReactMarkdown className="detailLine hcMarginBottom1_5">
                {data.description}
            </ReactMarkdown>}

            <div className="detailTable">
                <DetailRow label="Created" values={new Date(data.created).toString()}/>
                <DetailRow label="Modified" values={new Date(data.modified).toString()}/>
                <DetailRow label="License" values={<a href={data.license}>{data.license}</a>}/>
                {data.versioningPolicy && <DetailRow label="Versioning policy" values={data.versioningPolicy}/>}
                {data.sustainabilityPolicy &&
                    <DetailRow label="Sustainability policy" values={data.sustainabilityPolicy}/>}
                {data.locations.filter(l => l.type === 'homepage').length > 0 &&
                    <DetailRow label="Homepage" values={data.locations.filter(l => l.type === 'homepage').map(l =>
                        <a href={l.location}>{l.location}</a>)}/>}
                {data.locations.filter(l => l.type === 'endpoint').length > 0 &&
                    <DetailRow label="Endpoint" values={data.locations.filter(l => l.type === 'endpoint').map(l =>
                        <a href={l.location}>{l.location}</a>)}/>}
                {data.recommendations &&
                    <DetailRow label="Publisher" values={data.recommendations.map(r =>
                        <Recommendation recommendation={r}/>)}/>}
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

function Recommendation({recommendation}: { recommendation: VocabRecommendation }) {
    switch (recommendation.publisher) {
        // case 'YALC':
        //     return <a href={`https://triplydb.com/${id}`}>YALC</a>;
        case 'Awesome Humanities':
            return <a href="https://github.com/CLARIAH/awesome-humanities-ontologies">Awesome Humanities</a>;
        default:
            return <>{recommendation.publisher}</>;
    }
}
