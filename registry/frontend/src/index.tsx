import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserBase} from 'browser-base-react';
import VocabDetail from './components/vocabDetail';
import VocabListItem from './components/vocabListItem';
import VocabFacets from './components/vocabFacets';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserBase title="CLARIAH+ FAIR Vocabulary Registry"
                     description="Find a FAIR Vocabulary that suits your needs!"
                     getFetchUrl={id => '/detail?rec=' + id}
                     detailComponent={VocabDetail}
                     searchUrl="/browse"
                     resultItemComponent={VocabListItem}
                     facetsComponent={VocabFacets}/>
    </React.StrictMode>
);
