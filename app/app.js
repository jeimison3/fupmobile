function saveCode(){
    alert('Salvamento ainda não disponível.');
}

function fupmobile_firstRunClick(){
    alert('hm');
}

$(".firstRun, .container-pulser").on("click", (evt)=>{
    evt.preventDefault();
    
});

var isMobile = undefined;

function appTutorial_start(){
    isMobile = $('#sidebarToggleTop').is(':visible');

    // Barra de rolagem pro topo
    $('html, body').animate({
        scrollTop: 0
    }, 300, function(){
    });

    $("#page-top").prepend(
        $("<div id=\"freezeScr\"></div>").css({
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.421)',
            'position': 'fixed',
            'z-index': '10',
            'animation-name': 'reduceTransparence',
            'animation-duration': '4s',
            'animation-iteration-count': 'initial'
        }).append(
            $('<p id="textFirstRun" class="h4"></p>').css({
                'position': 'absolute',
                'width': '300px',
                'left': '50%',
                'top': '50%',
                'transform': 'translate(-50%, -50%)',
                'color':'white'
            })
        ).append(
            $('<p id="btnFirstRun" class="h4">Ok</p>').css({
                'position': 'absolute',
                'left': '50%',
                'top': '75%',
                'transform': 'translate(-50%, -50%)',
                'color':'white'
            })
        )
    );
    appTutorial_sequence(0);
}

function appTutorial_pulsar(idElement, dataNext, applyClass){
    appTutorial_unpulse();

    // Animação
    $("#freezeScr").append(
        $("<div class=\"container-pulser\"></div>").css({ // pointer-view
            'width': 4,
            'height': 4,
            'top': $(idElement).offset().top + ($(idElement).outerHeight()/2) -2,
            'left': $(idElement).offset().left + ($(idElement).outerWidth()/2) -2,
            'z-index': '10'
        })
    );

    // Receptor de click
    $('#page-top').prepend(
        $("<div data-next=\""+dataNext+"\" class=\"click-to-pass\"></div>").css({
            'width': $(idElement).outerWidth(),
            'height': $(idElement).outerHeight(),
            'top': $(idElement).offset().top,
            'left': $(idElement).offset().left,
            'z-index': '12'
        }).click((self)=>{
            appTutorial_sequence( dataNext );
        })
    );
    
    // Torna botão visível
    if(applyClass === true) $(idElement).addClass('firstRun');
}

function appTutorial_unpulse(){
    $(".container-pulser").remove();
    $(".click-to-pass").remove();
    $('.firstRun').removeClass('firstRun');
}

function appTutorial_stop(){
    $(".container-pulser").remove();
    $(".click-to-pass").remove();
    $("#freezeScr").remove();
    $('.firstRun').removeClass('firstRun');
}

function appTutorial_sequence(seqNum){
    let seq = [
        {
            txt: 'Olá! Esse tutorial vai te mostrar as principais funções do app. Clique na região marcada para continuar!',
            seletor:'#btnFirstRun',
            okVisivel:true,
            addClasse: false
        },
        isMobile ? {
            txt: 'Esse é o botão Menu. Há opções para abrir seus códigos ou ver exemplos!',
            seletor:'#sidebarToggleTop',
            okVisivel:false,
            addClasse: true
        } : null
        ,{
            txt: 'Aqui fica a lista de entradas. Você pode programar entradas no seu código.',
            seletor: '#inputsDropdown',
            okVisivel:false,
            addClasse: true
        },{
            txt: 'Esse botão abre as notificações. Erros no seu código serão alertados aqui quase em tempo real.',
            seletor: '#messagesDropdown',
            okVisivel:false,
            addClasse: true
        },{
            txt: 'Por fim, chamamos de app pois agora ele está disponível offline. Que tal tentar?<br/>Pra uma boa experiência, adicione em seu navegador por:<br/>'+
            (isMobile ? 
                '<div style="-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);-o-transform: rotate(90deg);-ms-transform: rotate(90deg);transform: rotate(90deg); position: fixed;">&#8230;</div> &emsp; > Adicionar à tela inicial'
                : 'Configurações > Instalar aplicativo'),
            seletor: '#btnFirstRun',
            okVisivel:true,
            addClasse: false
        }
    ];

    if (seqNum == undefined) seqNum = 0;

    // Final:
    if (seqNum == seq.length) {
        appTutorial_stop();
        localStorage.setItem('jaVisitou', 'true');
        fileContoller_firstRun();
        return;
    }

    // Definição recursiva para saltar casos nulos
    if ( seq[Number(seqNum)] == null )
        return appTutorial_sequence(seqNum+1);
    

    if (seq[Number(seqNum)].okVisivel)
        $("#btnFirstRun").show()
    else
        $("#btnFirstRun").hide()

    $("#textFirstRun").html( seq[Number(seqNum)].txt );
    appTutorial_pulsar( seq[Number(seqNum)].seletor, seqNum+1, seq[Number(seqNum)].addClasse );

}

// localStorage processes:
var fileController_active = '';


// Cria estrutura base
function fileContoller_firstRun(){
    fileContoller_setActivefile('default.js'); // Set
    fileContoller_retriveActivefileData(); // Then retrive
}


// Quando não é primeiro acesso, existe um arquivo a ser carregado
function fileContoller_retriveFull(){
    fileController_active = localStorage.getItem( 'activeFile' );
    fileContoller_retriveActivefileData();
}


// Define novo arquivo atual
function fileContoller_setActivefile(nameFile){
    fileController_active = nameFile;
    localStorage.setItem("activeFile", nameFile);
}


// Carrega do localStorage dados do arquivo atual
function fileContoller_retriveActivefileData(){
    $('#nameprojectTextField').val( fileController_active );
    var conteudo = localStorage.getItem( 'file_'+fileController_active );
    if(conteudo){
        editorCodigo.doc.setValue( JSON.parse(conteudo) );
    } else editorCodigo.doc.setValue('');
}

// Lista todos os arquivos salvos
function fileContoller_retriveListFiles(){
    var conteudo = localStorage.getItem( 'list_files' );
    if(conteudo){
        return JSON.parse(conteudo);
    }
    return [];
}

function fileContoller_addToListFiles(){
    var lastLista = fileContoller_retriveListFiles();
    var idLista = lastLista.indexOf(fileController_active) == -1 ? lastLista.length : lastLista.indexOf(fileController_active);
    lastLista[idLista] = fileController_active;
    localStorage.setItem( 'list_files', JSON.stringify( lastLista ) );
}

// Deve ser chamado cada vez que o usuário parar de digitar
function fileContoller_save(){
    if(!fileController_active) return;
    $('#nameprojectTextField').val( fileController_active );
    localStorage.setItem( 'file_'+fileController_active, JSON.stringify( editorCodigo.doc.getValue() ) );
    fileContoller_addToListFiles();
    return true;
}



$(document).ready(()=>{

    // Evento do botão de salvamento
    $('#btnSaveProject').click(()=>{
        fileContoller_setActivefile( $('#nameprojectTextField').val() );
    });

    $('#codigosListaModal').on('shown.bs.modal', function () {
        $('#arquivosOpenLista').html('');
        var arquivos = fileContoller_retriveListFiles();
        for (var arq in arquivos){
            $('#arquivosOpenLista').append(

                $('<tr></tr>').append(
                    $('<th></th>').html(arquivos[arq])
                ).append(
                    $('<td></td>').append(
                        $("<p>Abrir</p>").click((obj)=>{
                            fileContoller_setActivefile( $(obj.target).data('name') ); // Set
                            fileContoller_retriveActivefileData(); // Then retrive
                            $('#codigosListaModal').modal('hide');
                        }).data('name', arquivos[arq])
                    )
                ).append(
                    $('<td></td>').append(
                        $("<p>Apagar</p>").click(()=>{
                            var listaOrigin = fileContoller_retriveListFiles();
                            var listaD = [];
                            listaOrigin.forEach(element => {
                                if(element != arquivos[arq])
                                    listaD[listaD.length] = element
                            });
                            var oldFile = arquivos[arq];
                            
                            localStorage.removeItem('file_'+arquivos[arq]);
                            localStorage.setItem( 'list_files', JSON.stringify( listaD ) );
                            $( "#codigosListaModal" ).trigger( "shown.bs.modal" ); // Recarrega lista

                            if(fileController_active == oldFile){
                                if (listaD.length > 0) {
                                    fileContoller_setActivefile(listaD[0]); // Set
                                    fileContoller_retriveActivefileData(); // Then retrive
                                }
                                else fileContoller_firstRun();
                                
                            }
                        })
                    )
                )
            );
        }
    })

    // Página pronta = fim do carregamento
    $("#pageIsLoading").remove();

    // Decide próxima ação com base na variável
    if (!localStorage.getItem('jaVisitou')) {
        appTutorial_start();
    } else fileContoller_retriveFull();

});

// localStorage.removeItem('jaVisitou');