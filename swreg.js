let newWorker;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(reg) {
        reg.addEventListener('updatefound', ()=>{
            newWorker = reg.installing;
            newWorker.addEventListener('statechange', ()=>{
                switch(newWorker.state){
                    case 'installed':
                        newWorker.postMessage({action: 'skipWaiting'})
                }
            })
        })
      console.log('Registrado com sucesso. Scope é ' + reg.scope);
    }).catch(function(error) {
      console.error('Falha a registrar pois: ' + error);
    });
}