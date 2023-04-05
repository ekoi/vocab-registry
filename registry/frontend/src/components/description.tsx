import React, {ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import {Vocab, VocabLocation, VocabRecommendation} from '../misc/interfaces';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faArrowUpRightFromSquare, faHouse, faGear, faDownload} from '@fortawesome/free-solid-svg-icons';

export default function Description({data}: { data: Vocab }) {
    return (
        <>
            {data.locations.length > 0 && <div className="iconBar extraBottomMargin">
                {data.locations.map(loc =>
                    <LocationIcon key={loc.location} location={loc}/>)}
            </div>}

            {data.description && <ReactMarkdown className="detailLine extraBottomMargin">
                {data.description}
            </ReactMarkdown>}

            <div className="detailTable">
                <DetailRow label="Created" values={new Date(data.created).toString()}/>
                <DetailRow label="Modified" values={new Date(data.modified).toString()}/>
                <DetailRow label="License" values={<a href={data.license}>{data.license}</a>}/>
                {data.versioningPolicy && <DetailRow label="Versioning policy" values={data.versioningPolicy}/>}
                {data.sustainabilityPolicy &&
                    <DetailRow label="Sustainability policy" values={data.sustainabilityPolicy}/>}
                {data.recommendations &&
                    <DetailRow label="Publisher" values={data.recommendations.map(r =>
                        <Recommendation key={r.publisher} vocab={data} recommendation={r}/>)}/>}
            </div>
        </>
    );
}

function LocationIcon({location}: { location: VocabLocation }) {
    let iconDefinition: IconDefinition, text: string;
    if (location.type === 'homepage') {
        switch (location.recipe) {
            case 'skosmos':
                iconDefinition = faArrowUpRightFromSquare;
                text = 'Open in Skosmos';
                break;
            default:
                iconDefinition = faHouse;
                text = 'Go to homepage';
                break;
        }
    }
    else {
        switch (location.recipe) {
            case 'sparql':
                iconDefinition = faGear;
                text = 'Query with SPARQL';
                break;
            default:
                iconDefinition = faDownload;
                text = 'Go to data';
                break;
        }
    }

    return (
        <div className="icon">
            <a href={location.location} target="_blank">
                <FontAwesomeIcon icon={iconDefinition}/>
                {text}
            </a>
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

function Recommendation({recommendation, vocab}: { vocab: Vocab, recommendation: VocabRecommendation }) {
    switch (recommendation.publisher) {
        case 'YALC':
            const id = vocab.id
                .replace('yalc-', '')
                .replace('.cmdi', '');
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
