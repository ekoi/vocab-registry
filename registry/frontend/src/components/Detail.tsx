import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Vocab} from '../misc/interfaces';
import Description from './Description';
import Summary from './Summary';
import Reviews from './Reviews';
import Versions from './Versions';

enum ViewOpened { DESCRIPTION, SUMMARY, REVIEWS}

export default function Detail({data}: { data: Vocab }) {
    const navigate = useNavigate();
    const [viewOpened, setViewOpened] = useState<ViewOpened>(ViewOpened.DESCRIPTION);
    const [currentVersion, setCurrentVersion] = useState<string | null>(null);

    const versions = data.versions
        .sort((a, b) => -1 * a.version.localeCompare(b.version));
    const version = versions.find(v => v.version === currentVersion);

    if (currentVersion === null)
        setCurrentVersion(versions[0].version);

    return (
        <div className="hcContentContainer">
            <div className="hcBasicSideMargin">
                <div className="vocabHeader">
                    <h1>{data.title}</h1>

                    <div className="justify fitContent">
                        <a className="back" href="#" onClick={_ => navigate(-1)}>
                            &larr; Return to previous page
                        </a>

                        <div className="hcToggle">
                            <button className={`hcButton ${viewOpened === ViewOpened.DESCRIPTION ? 'tabActive' : ''}`}
                                    onClick={_ => setViewOpened(ViewOpened.DESCRIPTION)}>
                                Description
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

                <div className="vocabContentVersions">
                    <div className="vocabContent">
                        {viewOpened === ViewOpened.DESCRIPTION && <Description data={data} version={version}/>}
                        {viewOpened === ViewOpened.SUMMARY && <Summary version={version}/>}
                        {viewOpened === ViewOpened.REVIEWS && <Reviews data={data}/>}
                    </div>

                    {(viewOpened === ViewOpened.DESCRIPTION || viewOpened === ViewOpened.SUMMARY) &&
                        <Versions versions={versions} active={currentVersion} changeVersion={setCurrentVersion}/>}
                </div>
            </div>
        </div>
    );
}
