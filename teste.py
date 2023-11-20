cod_otto_interesse = '86289161'

#   método que seleciona os trechos a jusante do ponto de interesse
rios = ['','','','','','']
n_rio = 0

# seleção dos rios a jusante
for valor in range(len(cod_otto_interesse)):
    index_analise = (valor + 1) * -1
    algarismo = int(cod_otto_interesse[index_analise])
    impar = algarismo % 2
    codf = cod_otto_interesse[:(len(cod_otto_interesse)-valor)]

    # fiz o teste para final par, pois do contrário dá erro, não entendi
    if impar == 0:
        codfim = cod_otto_interesse[:(len(cod_otto_interesse)-valor)]
        rios[n_rio] = codfim
        n_rio = n_rio + 1
        compri = len(codfim)
        if compri <= 4:    # teste para ver se no rio princila da bacia (rio 8628)
            break

print('n_rio:', n_rio)
print('rios:', rios)

selecao = ''
for elementos in rios:
    if elementos != '':
        selecao = selecao + 'camada_ottotrechos.cocursodag = \''+ elementos +'\' OR '
    else:
        break
comp = len(selecao)
comp2 = comp - 3
print('selecao:', selecao)
sele2 = selecao [:comp2]
print('sele2:', sele2)
query_ottotrechos_jusante = '?query=SELECT camada_ottotrechos.cocursodag, camada_ottotrechos.geometry '\
                            'FROM camada_ottotrechos '\
                            'WHERE ('+ sele2 +')AND camada_ottotrechos.cobacia < \''+cod_otto_interesse+'\''
print('query_ottotrechos_jusante:', query_ottotrechos_jusante)


print('\n''-> Seleção de ottorechos a jusante realizado.')