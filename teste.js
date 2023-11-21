let cod_otto_interesse = '86289161';

// Método que seleciona os trechos a jusante do ponto de interesse
let rios = ['', '', '', '', '', ''];
let n_rio = 0;

// Seleção dos rios a jusante
for (let valor = 0; valor < cod_otto_interesse.length; valor++) {
    let index_analise = (valor + 1) * -1;
    let algarismo = parseInt(cod_otto_interesse[index_analise]);
    let impar = algarismo % 2;
    let codf = cod_otto_interesse.slice(0, cod_otto_interesse.length - valor);

    // Teste para final par
    if (impar === 0) {
        let codfim = cod_otto_interesse.slice(0, cod_otto_interesse.length - valor);
        rios[n_rio] = codfim;
        n_rio++;
        let compri = codfim.length;

        // Teste para ver se no rio principal da bacia (rio 8628)
        if (compri <= 4) {
            break;
        }
    }
}

console.log('n_rio:', n_rio);
console.log('rios:', rios);

let selecao = '';
for (let elementos of rios) {
    if (elementos !== '') {
        selecao += 'cocursodag = \'' + elementos + '\' OR ';
    } else {
        break;
    }
}

let comp = selecao.length;
let comp2 = comp - 3;
console.log('selecao:', selecao);
let sele2 = selecao.slice(0, comp2);
console.log('sele2:', sele2);
let consulta = '(' + sele2 + ') AND cobacia_n < \'' + cod_otto_interesse + '\'';
console.log('consulta:', consulta);

console.log('\n-> Seleção de ottorechos a jusante realizado.');
