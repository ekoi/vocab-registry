import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Vocab} from '../misc/interfaces';
import Description from './Description';
import Summary from './Summary';
import Reviews from './Reviews';
import Versions from './Versions';

enum ViewOpened { DESCRIPTION, VERSIONS, SUMMARY, REVIEWS}

export default function Detail({data}: { data: Vocab }) {
    const navigate = useNavigate();
    const [viewOpened, setViewOpened] = useState<ViewOpened>(ViewOpened.DESCRIPTION);

    return (
        <div className="hcContentContainer">
            <div className="hcBasicSideMargin">
                <div className="justify hcMarginBottom1">
                    <h1>{data.title}</h1>

                    <div className="justify fitContent">
                        <a className="back" href="#" onClick={_ => navigate(-1)}>&larr; Return to previous page</a>

                        <div className="hcToggle">
                            <button className={`hcButton ${viewOpened === ViewOpened.DESCRIPTION ? 'tabActive' : ''}`}
                                    onClick={_ => setViewOpened(ViewOpened.DESCRIPTION)}>
                                Description
                            </button>
                            <button className={`hcButton ${viewOpened === ViewOpened.VERSIONS ? 'tabActive' : ''}`}
                                    onClick={_ => setViewOpened(ViewOpened.VERSIONS)}>
                                Versions
                            </button>
                            <button className={`hcButton ${viewOpened === ViewOpened.SUMMARY ? 'tabActive' : ''}`}
                                    onClick={_ => setViewOpened(ViewOpened.SUMMARY)}>
                                Summary
                            </button>
                            <button className={`hcButton ${viewOpened === ViewOpened.REVIEWS ? 'tabActive' : ''}`}
                                    onClick={_ => setViewOpened(ViewOpened.REVIEWS)}>
                                Reviews
                            </button>
                        </div>
                    </div>
                </div>

                {viewOpened === ViewOpened.DESCRIPTION && <Description data={data}/>}
                {viewOpened === ViewOpened.VERSIONS && <Versions data={data}/>}
                {viewOpened === ViewOpened.SUMMARY && <Summary data={data}/>}
                {viewOpened === ViewOpened.REVIEWS && <Reviews data={data}/>}
            </div>
        </div>
    );
}
