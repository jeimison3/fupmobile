let newWorker;

let __DISABLE_SW = true;

if ('serviceWorker' in navigator && !__DISABLE_SW) {

    let refreshing;
    // Esse evento será chamado quando o Service Worker for atualizado
    // Aqui estamos recarregando a página
    navigator.serviceWorker.addEventListener("controllerchange", function() {
    if (refreshing) {
        return;
    }
    window.location.reload();
    refreshing = true;
    });

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
      console.log('Atualizado com sucesso. Scope: ' + reg.scope);
    }).catch(function(error) {
      console.error('Falha a registrar pois: ' + error);
    });
}