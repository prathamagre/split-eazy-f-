import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter,Link,RouterProvider } from 'react-router-dom';
import ListPage from './views/ListPage/ListPage';
import PaymentsPage from './views/PaymentsPage/PaymentsPage';
import Home from './views/Home/Home';
import AddList from './views/AddList/AddList';
import AddPayment from './views/AddPayment/AddPayment';
import SettlementPage from './views/SettlementPage/SettlementPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/list-page",
        element: <ListPage/>
    },
    {
        path: "/payments-page",
        element: <PaymentsPage/>
    },
    {
        path: "/add-list",
        element: <AddList/>
    },
    {
        path: "/add-payment",
        element: <AddPayment/>
    },
    {
        path: "/settlement-page",
        element: <SettlementPage/>
    },
    {
        path: "*",
        element: <h1>404 Not Found</h1>,
      }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

