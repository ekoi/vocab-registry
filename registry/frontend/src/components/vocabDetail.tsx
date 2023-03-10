import React, {ReactElement} from 'react';
import {Vocab} from '../misc/interfaces';

export default function VocabDetail({data}: { data: Vocab }) {
    return (
        <div className="hcContentContainer">
            <div className="hcAlignLeftRight hcMarginBottom1_5">
                <h3>{data.title}</h3>
                <div className="hcToggle">
                    <button>Description</button>
                    <button>Relations</button>
                    <button>Reviews</button>
                </div>
            </div>

            {data.description && <div className="detailLine hcMarginBottom1_5">{data.description}</div>}

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
            </div>
        </div>
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
