import { CoBrowsing } from './cobrowsing/serialization';
import * as ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import 'antd/dist/antd.css'

const socket = new WebSocket('ws://localhost:8080');
const ref = React.createRef<HTMLDivElement>()

export const Browsing = React.createContext<CoBrowsing | null>(null)

const Index = () => {
  return (<React.StrictMode>
    <Browsing.Provider value={new CoBrowsing({
      remotePeer: true,
      socket: socket,
      root: ref.current as HTMLElement,
      sameScreenSize: false,
    })}>
      <App />
    </Browsing.Provider>
  </React.StrictMode>)
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);