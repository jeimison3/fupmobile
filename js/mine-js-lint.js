// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["../../lib/codemirror"], mod);
    else // Plain browser env
      mod(CodeMirror);
  })(function(CodeMirror) {
    "use strict";
    // declare global: JSHINT
  
    function validator(text, options) {
      if (!window.JSHINT) {
        if (window.console) {
          window.console.error("Error: window.JSHINT not defined, CodeMirror JavaScript linting cannot run.");
        }
        return [];
      }
      options['esversion'] = 6;
      //options['unused'] = true;
      options['undef'] = true;
      options['node'] = true;
      if (!options.indent) // JSHint error.character actually is a column index, this fixes underlining on lines using tabs for indentation
        options.indent = 1; // JSHint default value is 4
      JSHINT(text, options, options.globals);
      var errors = JSHINT.data().errors, result = [];
      if (errors) parseErrors(errors, result);
      return result;
    }
  
    CodeMirror.registerHelper("lint", "javascript", validator);
  
    function parseErrors(errors, output) {
        warnsAndErrosWindow_Clear();
      for ( var i = 0; i < errors.length; i++) {
        var error = errors[i];
        if (error) {
            if (error.line <= 0) {
                if (window.console) {
                window.console.warn("Cannot display JSHint error (invalid line " + error.line + ")", error);
                }
                continue;
            }
  
            var start = error.character - 1, end = start + 1;
            if (error.evidence) {
                var index = error.evidence.substring(start).search(/.\b/);
                if (index > -1) {
                end += index;
                }
            }
          
            switch(error.code){
                case 'E006':
                    error.reason = 'Final inesperado do programa. Outro erro deve ser responsável.';
                    break;
                case 'E041':
                    error.reason = 'Não foi possível sugerir correções.';
                    break;
                case 'W032':
                    error.reason = 'Ponto e vírgula desnecessário.';
                    break;
                case 'W033':
                    error.reason = 'Faltando ponto e vírgula ou não encontrado.';
                    break;
                default:
                    var find = ['an identifier', 'an operator', 'an expression', 'to', 'or function call', 'Unexpected', 'Expected', 'and instead saw', 'Unmatched', 'an assignment', 'match', 'from line', 'is not', 'defined']; 
                    var replace = ['um identificador', 'um operador', 'uma expressão', 'para', 'ou chamada de função', "Inesperado", 'Esperado', 'ao invés de', 'Sem par', 'uma atribuição', 'combinar', 'da linha', 'não é', 'definido', ];
                    error.reason = error.reason.replaceArray(find, replace);
                    break;
            }
            
            if( error.code.startsWith('W') )
                precompileNewWarningHandle(error);
            else
                precompileNewErrorHandle(error);


            var hint = {
                message: error.reason,
                severity: error.code ? (error.code.startsWith('W') ? "warning" : "error") : "error",
                from: CodeMirror.Pos(error.line - 1, start),
                to: CodeMirror.Pos(error.line - 1, end)
            };
    
            output.push(hint);
        }
      }
      isCodeOkay = errors.length == 0;
      document.getElementById("errorsCounter").innerText = errors.length;
    }
  });
  