function saveCode(){
    alert('Salvamento ainda não disponível.');
}

window.onbeforeunload = function() {
    return "É possível que as alterações feitas não sejam salvas.";
}