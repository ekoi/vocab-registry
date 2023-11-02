import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom';
import {
    App,
    PageHeader,
    Search,
    Detail as BrowserDetail,
    createSearchLoader,
    createDetailLoader
} from 'browser-base-react';
import Detail from './components/Detail.js';
import Facets from './components/Facets.js';
import ListItem from './components/ListItem.js';
import './index.css';

const title = 'CLARIAH+ FAIR Vocabulary Registry';
const searchLoader = createSearchLoader('/browse', 10);
const detailLoader = createDetailLoader(id => `/vocab/${id}`);

const routeObject: RouteObject = {
    path: '/',
    element: <App header={<PageHeader title={title}/>}/>,
    children: [{
        index: true,
        path: 'search?/:code?',
        loader: async ({params}) => searchLoader(params.code),
        element: <Search title={title} pageLength={10} withPaging={true}
                         FacetsComponent={Facets} ResultItemComponent={ListItem}/>
    }, {
        path: 'detail/:id',
        loader: async ({params}) => detailLoader(params.id as string),
        element: <BrowserDetail title={title} DetailComponent={Detail}/>
    }]
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        {/*<Router noIndexPage={true}*/}
        {/*        title="CLARIAH+ FAIR Vocabulary Registry"*/}
        {/*        description="Find a FAIR Vocabulary that suits your needs!"*/}
        {/*        getFetchUrl={id => `/vocab/${id}`}*/}
        {/*        DetailComponent={Detail}*/}
        {/*        searchUrl="/browse"*/}
        {/*        pageLength={10}*/}
        {/*        withPaging={true}*/}
        {/*        ResultItemComponent={ListItem}*/}
        {/*        FacetsComponent={Facets}/>*/}

        <RouterProvider router={createBrowserRouter([routeObject])}/>;
    </React.StrictMode>
);
