import React, {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {VocabIndex} from '../misc/interfaces';
import {parseTextFromMarkDown} from '../misc/markdown';

export default function ListItem({item}: { item: VocabIndex }) {
    const description = useMemo(() => parseTextFromMarkDown(item.description), [item.description]);

    return (
        <div className="hcResultListDetail">
            <h2><Link to={'/detail/' + item.record.substring(0, item.record.length - 5)}>{item.title}</Link></h2>
            <div className="detailLine">
                {description}
            </div>
        </div>
    );
}
