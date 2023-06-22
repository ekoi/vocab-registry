import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserBase} from 'browser-base-react';
import Detail from './components/Detail';
import ListItem from './components/ListItem';
import Facets from './components/Facets';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserBase noIndexPage={true}
                     title="CLARIAH+ FAIR Vocabulary Registry"
                     description="Find a FAIR Vocabulary that suits your needs!"
                     getFetchUrl={id => `/vocab/${id}`}
                     detailComponent={Detail}
                     searchUrl="/browse"
                     pageLength={10}
                     withPaging={true}
                     resultItemComponent={ListItem}
                     facetsComponent={Facets}/>
    </React.StrictMode>
);
