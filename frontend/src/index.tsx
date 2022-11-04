import React from 'react';
import App from './App';
import Search from "./components/search";
import ReactDOM from 'react-dom/client';
import {useParams} from "react-router-dom";
import Collections from "./components/collections";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
