import { CoBrowsing } from './cobrowsing/serialization';

const socket = new WebSocket('ws://localhost:8080');

const browsing = new CoBrowsing({
  root: document.getElementById("root") as HTMLElement,
  coBrowsingExec: false,
  socket: socket
})

// socket.addEventListener('message', (event) => {
  
// });

// const mutation = (events) => {
//   for(const event of events) {
//     switch(event.type) {
//       case "attributes": {
//         const attributeName = event.attributeName
//         const oldValueOfAttribute = event.oldValue
//         const target = event.target
//         const newValueOfAttribute = target.getAttribute(attributeName)
//         if (oldValueOfAttribute !== newValueOfAttribute) {
//           socket.send({
            
//           })
//         }
//         break
//       }
//       case "childList": {

//         break
//       }
//     }
//   }
// };

// const button = document.getElementById('remove-click');
// const remove = document.getElementById('remove-1');
// const root = document.getElementById('root-2');
// const a = new MutationObserver((e) => console.log(e)).observe(root, {
//   attributes: true,
//   attributeOldValue: true,
//   childList: true,
//   subtree: true,
// });
// button.onclick = () => {
//   remove.remove();
//   button.setAttribute('id', 'fuck-me');
//   button.classList.add('hachour');
// };
