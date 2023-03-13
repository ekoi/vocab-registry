import React from 'react';
import {Link} from 'react-router-dom';
import {VocabIndex} from '../misc/interfaces';

export default function ListItem({item}: { item: VocabIndex }) {
    return (
        <div className="hcResultListDetail">
            <h2><Link to={'/detail/' + item.record}>{item.title}</Link></h2>
            <div className="detailLine">{item.description}</div>
        </div>
    );
}
