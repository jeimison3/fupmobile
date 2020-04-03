function runCode(code) {
    animacaoGoTo('#saidaSect');

    var oldCampo = document.getElementById('coderunner');
    if(oldCampo != undefined) oldCampo.remove();

    var scriptElm = document.createElement('script');
    scriptElm.setAttribute('id', 'coderunner');
    var inlineCode = document.createTextNode(code);
    scriptElm.appendChild(inlineCode);

    editorSaida.doc.setValue(""); // Limpa saída
    document.getElementsByTagName("head")[0].appendChild(scriptElm);
}

function btnRun(){
    var sucesso = precompile();
    if(sucesso) runCode( editorCodigo.doc.getValue() );
    else setTimeout( ()=>{ $('#messagesDropdown').dropdown('show') }, 300);
}

function precompile(){
    var source = editorCodigo.doc.getValue().split('\n');
    var options = {
        
    };
    var predef = {
        console: { log: (a)=>{} }
    };

    JSHINT(source, options, predef);
    var retorno = JSHINT.data();
    precompileErrorHandling(retorno.errors);

    if(retorno.errors == undefined) return true;
    
    return false;

    //console.log(JSHINT.data());
}

String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex; 
    for (var i = 0; i < find.length; i++) {
      regex = new RegExp(find[i], "g");
      replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
  };

function precompileErrorHandling(arrErrors){
    warnsAndErrosWindow_Clear();
    if (arrErrors == undefined) return;
    var errorCounter = 0;
    arrErrors.forEach(erro => {
        switch(erro.code){
            case 'E006':
                erro.reason = 'Final inesperado do programa. Outro erro deve ser responsável.';
                break;
            case 'E041':
                erro.reason = 'Não foi possível sugerir correções.';
                break;
            case 'W032':
                erro.reason = 'Ponto e vírgula desnecessário.';
                break;
            case 'W033':
                erro.reason = 'Faltando ponto e vírgula ou não encontrado.';
                break;
            default:
                var find = [/to/g, /or/g, /Unexpected/g, /Expected/g, /and instead saw/g, /Unmatched/, /identifier/g ,/expression/g, /an/g, /match/g, /from line/g, /assignment/g, /function call/g]; 
                var replace = ['para', 'ou', "Inesperado", 'Esperado', 'ao invés de', 'Sem par', 'identificador', 'expressão', 'um(a)', 'combinar', 'da linha', 'atribuição', 'chamada de função'];
                erro.reason = erro.reason.replaceArray(find, replace);
                break;
        }
        if (erro != undefined){
            errorCounter++;
            precompileNewErrorHandle(erro);
        }
    });
    document.getElementById("errorsCounter").innerText = errorCounter;
    console.info(arrErrors)
}

function precompileNewErrorHandle(erro){
    console.log("Linha "+ erro.line + ". " + erro.reason + " (No trecho: " + erro.evidence + ")" );
    warnsAndErrosWindow_Add( 'error', erro.line, erro.reason );
}

function warnsAndErrosWindow_Add(tipo, linha, conteudo){
    /* <a class="dropdown-item d-flex align-items-center" href="#">
        <div class="mr-3">
            <div class="icon-circle bg-warning">
                <i class="fas fa-exclamation-triangle text-white"></i>
            </div>
        </div>

        <div>
            <div class="small text-gray-500">Line 49</div>
            Warn: Este é apenas um exemplo de warning
        </div>

    </a> */
    var simboloIcon = document.createElement('i');
    simboloIcon.setAttribute('class','fas fa-exclamation-triangle text-white');
    var divSimbolo = document.createElement('div');
    divSimbolo.setAttribute('class','icon-circle bg-'+ (tipo == 'error' ? 'danger' : 'warning') );
    divSimbolo.appendChild(simboloIcon);
    var divSuperiorSimbolo = document.createElement('div');
    divSuperiorSimbolo.setAttribute('class','mr-3');
    divSuperiorSimbolo.appendChild(divSimbolo);

    var trechoLinha = document.createElement('div');
    trechoLinha.setAttribute('class', 'small text-gray-500');
    trechoLinha.innerText = 'Linha '+linha;
    var divTxtInformativo = document.createElement('div');
    divTxtInformativo.innerText = conteudo;
    var divSuperiorTextos = document.createElement('div');
    divSuperiorTextos.appendChild(trechoLinha);
    divSuperiorTextos.appendChild(divTxtInformativo);

    var newNotific = document.createElement('a');
    newNotific.setAttribute('class', 'dropdown-item d-flex align-items-center');
    newNotific.setAttribute('href','#');
    newNotific.setAttribute('onclick','return false;');
    newNotific.appendChild(divSuperiorSimbolo);
    newNotific.appendChild(divSuperiorTextos);

    document.getElementById("areaNotificacoes").appendChild( newNotific );
}

function warnsAndErrosWindow_Clear(){
    var lista = document.getElementById("areaNotificacoes").childNodes;
    for(var i = lista.length-1; i > 0; i--){
        lista[i].remove();
    }
    document.getElementById("errorsCounter").innerText = "0";
}

function animacaoGoTo(divId){
    var hash = this.hash;
    $('html, body').animate({
        scrollTop: $(divId).offset().top
    }, 800, function(){
    });
}


var intervalCodechanged = undefined;
function EditorCodigo_onChange(instancia, obj){
    if(intervalCodechanged != undefined) intervalCodechanged = clearTimeout(intervalCodechanged);
    intervalCodechanged = setTimeout(()=>{precompile(); intervalCodechanged=undefined;}, 2000);
}

/* Debugar todos os console.log, warn, error e debug */
(function(){
    if (console.everything === undefined)
{
    console.everything = [];

    console.defaultLog = console.log.bind(console);
    console.log = function(){
        console.everything.push({"type":"log", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultLog.apply(console, arguments);

        var tmpOut=editorSaida.doc.getValue();
        if(arguments != undefined){
            Array.from(arguments).forEach(saida => {
                tmpOut+=JSON.stringify( saida ) +'\n';
            });
        }
        editorSaida.doc.setValue(tmpOut);

    }
    console.defaultError = console.error.bind(console);
    console.error = function(){
        console.everything.push({"type":"error", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultError.apply(console, arguments);
    }
    console.defaultWarn = console.warn.bind(console);
    console.warn = function(){
        console.everything.push({"type":"warn", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultWarn.apply(console, arguments);
    }
    console.defaultDebug = console.debug.bind(console);
    console.debug = function(){
        console.everything.push({"type":"debug", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultDebug.apply(console, arguments);
    }

    
}


})();
