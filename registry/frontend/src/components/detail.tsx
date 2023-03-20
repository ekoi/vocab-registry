import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Vocab} from '../misc/interfaces';
import Description from './description';
import Summary from './summary';
import Reviews from './reviews';

enum ViewOpened { DESCRIPTION, SUMMARY, REVIEWS}

export default function Detail({data}: { data: Vocab }) {
    const navigate = useNavigate();
    const [viewOpened, setViewOpened] = useState<ViewOpened>(ViewOpened.DESCRIPTION);

    return (
        <div className="hcContentContainer">
            <div className="hcAlignLeftRight hcMarginBottom1_5">
                <h1>{data.title}</h1>

                <div className="hcRowJustify">
                    <a className="back" href="#" onClick={_ => navigate(-1)}>&larr; Return to previous page</a>

                    <div className="hcToggle">
                        <button className={viewOpened === ViewOpened.DESCRIPTION ? 'active' : ''}
                                onClick={_ => setViewOpened(ViewOpened.DESCRIPTION)}>
                            Description
                        </button>
                        <button className={viewOpened === ViewOpened.SUMMARY ? 'active' : ''}
                                onClick={_ => setViewOpened(ViewOpened.SUMMARY)}>
                            Summary
                        </button>
                        <button className={viewOpened === ViewOpened.REVIEWS ? 'active' : ''}
                                onClick={_ => setViewOpened(ViewOpened.REVIEWS)}>
                            Reviews
                        </button>
                    </div>
                </div>
            </div>

            {viewOpened === ViewOpened.DESCRIPTION && <Description data={data}/>}
            {viewOpened === ViewOpened.SUMMARY && <Summary data={data}/>}
            {viewOpened === ViewOpened.REVIEWS && <Reviews data={data}/>}
        </div>
    );
}
