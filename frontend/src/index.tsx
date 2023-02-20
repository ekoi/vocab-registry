import React from 'react';
import App from './App';
import Search from "./components/search";
import ReactDOM from 'react-dom/client';
import Collections from "./components/collections";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Detail from "./components/detail";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}>
                <Route index element={<Collections/>}/>
                <Route path="search" element={<Search/>}>
                    <Route path=":code" element={<Search/>}/>
                </Route>
                <Route path="detail" element={<Detail/>}>
                    <Route path=":id" element={<Detail/>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
);
