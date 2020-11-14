import { rebuildDOM } from './cobrowsing/serialization';

const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('message', (event) => {
  const content = JSON.parse(event.data);
  switch (content.type) {
    case 'snapshot': {
      const virtualDOM = content.data;
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      document.body.append(wrapper);
      var iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      iframe.classList.add('iframe-cobrowsing');
      iframe.style.border = 'none';
      wrapper.style.backgroundColor = 'red';
      wrapper.append(iframe);
      let iframeDoc = (iframe.contentDocument || iframe.contentWindow) as Document;
      debugger;
      iframeDoc.getElementsByTagName('body')[0].remove();
      iframeDoc.getElementsByTagName('head')[0].remove();
      iframeDoc.getElementsByTagName('html')[0].remove();
      console.log('Changing iframe content');
      rebuildDOM(virtualDOM, iframeDoc);
      const observer = new MutationObserver(mutation);
      debugger;
      observer.observe(iframe, {
        attributes: true,
        childList: true,
      });
      // iframe.addEventListener('load', () => {
      //   iframe.setAttribute('src', content.href);
      //   if (navigator.appName == 'Microsoft Internet Explorer') {
      //     iframe.document.execCommand('Stop');
      //   } else {
      //     iframe.stop();
      //   }
      // });
      break;
    }
  }
});

const mutation = (events) => {
  for(const event of events) {
    switch(event.type) {
      case "attributes": {
        const attributeName = event.attributeName
        const oldValueOfAttribute = event.oldValue
        const target = event.target
        const newValueOfAttribute = target.getAttribute(attributeName)
        if (oldValueOfAttribute !== newValueOfAttribute) {
          socket.send({
            
          })
        }
        break
      }
      case "childList": {

        break
      }
    }
  }
};

const button = document.getElementById('remove-click');
const remove = document.getElementById('remove-1');
const root = document.getElementById('root-2');
const a = new MutationObserver((e) => console.log(e)).observe(root, {
  attributes: true,
  attributeOldValue: true,
  childList: true,
  subtree: true,
});
button.onclick = () => {
  remove.remove();
  button.setAttribute('id', 'fuck-me');
  button.classList.add('hachour');
};
