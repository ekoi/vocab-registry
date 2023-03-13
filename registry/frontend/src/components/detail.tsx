import React, {useState} from 'react';
import {Vocab} from '../misc/interfaces';
import Description from './description';
import Relations from './relations';
import Reviews from './reviews';

type ViewOpened = 'description' | 'relations' | 'reviews';

export default function Detail({data}: { data: Vocab }) {
    const [viewOpened, setViewOpened] = useState<ViewOpened>('description');

    return (
        <div className="hcContentContainer">
            <div className="hcAlignLeftRight hcMarginBottom1_5">
                <h3>{data.title}</h3>

                <div className="hcToggle">
                    <button className={viewOpened === 'description' ? 'active' : ''}
                            onClick={_ => setViewOpened('description')}>
                        Description
                    </button>
                    <button className={viewOpened === 'relations' ? 'active' : ''}
                            onClick={_ => setViewOpened('relations')}>
                        Relations
                    </button>
                    <button className={viewOpened === 'reviews' ? 'active' : ''}
                            onClick={_ => setViewOpened('reviews')}>
                        Reviews
                    </button>
                </div>
            </div>

            {viewOpened === 'description' && <Description data={data}/>}
            {viewOpened === 'relations' && <Relations data={data}/>}
            {viewOpened === 'reviews' && <Reviews data={data}/>}
        </div>
    );
}
