import {MouseEvent, useState} from 'react';
import {VocabLocation} from '../misc/interfaces';

type LocationFocusHook = [
    VocabLocation | null,
    (loc: VocabLocation, e: MouseEvent<HTMLAnchorElement>) => void
];

export default function useLocationFocus(): LocationFocusHook {
    const [locationFocus, setLocationFocus] = useState<VocabLocation | null>(null);

    const onLocationClick = (loc: VocabLocation, e: MouseEvent<HTMLAnchorElement>) => {
        if (locationFocus && locationFocus.type === loc.type &&
            locationFocus.recipe === loc.recipe && locationFocus.location === loc.location) {
            setLocationFocus(null);
            e.preventDefault();
        }
        else if (loc.recipe === 'sparql') {
            setLocationFocus(loc);
            e.preventDefault();
        }
    };

    return [locationFocus, onLocationClick];
}
