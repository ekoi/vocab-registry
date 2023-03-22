import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserBase} from 'browser-base-react';
import Detail from './components/detail';
import ListItem from './components/listItem';
import Facets from './components/facets';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserBase title="CLARIAH+ FAIR Vocabulary Registry"
                     description="Find a FAIR Vocabulary that suits your needs!"
                     getFetchUrl={id => '/detail?rec=' + id}
                     detailComponent={Detail}
                     searchUrl="/browse"
                     pageLength={10}
                     withPaging={true}
                     resultItemComponent={ListItem}
                     facetsComponent={Facets}/>
    </React.StrictMode>
);
