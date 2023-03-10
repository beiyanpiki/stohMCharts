import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout'
import 'normalize.css'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import './global.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Layout />
    </React.StrictMode>
)
