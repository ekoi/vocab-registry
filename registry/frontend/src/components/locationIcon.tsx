import React, {MouseEventHandler} from 'react';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpRightFromSquare, faDownload, faGear, faHouse} from '@fortawesome/free-solid-svg-icons';
import {VocabLocation} from '../misc/interfaces.js';

export default function LocationIcon({location, onClick}: {
    location: VocabLocation,
    onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
    let iconDefinition: IconDefinition, text: string;
    if (location.type === 'homepage') {
        switch (location.recipe) {
            case 'skosmos':
                iconDefinition = faArrowUpRightFromSquare;
                text = 'Open in Skosmos';
                break;
            case 'webvowl':
                iconDefinition = faArrowUpRightFromSquare;
                text = 'Open in WebVOWL';
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
            case 'cache':
                iconDefinition = faDownload;
                text = 'Get cached vocabulary';
                break;
            default:
                iconDefinition = faDownload;
                text = 'Get vocabulary';
                break;
        }
    }

    return (
        <div className="icon">
            <a href={location.location} target="_blank" onClick={onClick}>
                <FontAwesomeIcon icon={iconDefinition}/>
                {text}
            </a>
        </div>
    );
}
