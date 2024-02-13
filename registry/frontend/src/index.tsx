import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom';
import {
    App,
    PageHeader,
    Search,
    Detail as BrowserDetail,
    createSearchLoader,
    createDetailLoader,
    searchUtils,
    SearchParams
} from 'browser-base-react';
import Detail from './components/Detail.js';
import Facets from './components/Facets.js';
import ListItem from './components/ListItem.js';
import './index.css';

const title = 'CLARIAH+ FAIR Vocabulary Registry';
const searchLoader = createSearchLoader(searchUtils.getSearchObjectFromParams, '/browse', 10);
const detailLoader = createDetailLoader(id => `/vocab/${id}`);

const routeObject: RouteObject = {
    path: '/',
    element: <App header={<PageHeader title={title}/>}/>,
    children: [{
        index: true,
        loader: async ({request}) => searchLoader(new URL(request.url).searchParams),
        element: <Search title={title} pageLength={10} withPaging={true}
                         hasIndexPage={false} showSearchHeader={false} updateDocumentTitle={false}
                         searchParams={SearchParams.PARAMS} FacetsComponent={Facets} ResultItemComponent={ListItem}/>
    }, {
        path: 'detail/:id',
        loader: async ({params}) => detailLoader(params.id as string),
        element: <BrowserDetail title={title} updateDocumentTitle={false} DetailComponent={Detail}/>
    }]
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={createBrowserRouter([routeObject])}/>
    </React.StrictMode>
);
