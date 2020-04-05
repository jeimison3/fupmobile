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
            txt: 'Por fim, chamamos de "app" pois você já pode acessar sem internet! Que tal tentar?<br/>Pra uma boa experiência, adicione em seu navegador por:<br/>'+
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

$(document).ready(()=>{
    $("#pageIsLoading").remove();
    if (!localStorage.getItem('jaVisitou')) {
        appTutorial_start();
        //localStorage.setItem('jaVisitou', 'true'); // localStorage.removeItem('jaVisitou');
    }
});

// localStorage.removeItem('jaVisitou');