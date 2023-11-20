cod_otto_interesse = '86289161'

#   método que seleciona os trechos a jusante do ponto de interesse
rio = ['','','','','','']
rios = 0

# seleção dos rios a jusante
for valor in range(len(cod_otto_interesse)):
    index_analise = (valor + 1) * -1
    algarismo = int(cod_otto_interesse[index_analise])
    impar = algarismo % 2
    codf = cod_otto_interesse[:(len(cod_otto_interesse)-valor)]

    # fiz o teste para final par, pois do contrário dá erro, não entendi
    if impar == 0:
        codfim = cod_otto_interesse[:(len(cod_otto_interesse)-valor)]
        rio[rios] = codfim
        rios = rios + 1
        compri = len(codfim)
        if compri <= 4:    # teste para ver se no rio princila da bacia (rio 8628)
            break

print('self.rios:', rios)
print('self.rio:', rio)

selecao = ''
for elementos in rio:
    if elementos != '':
        selecao = selecao + 'camada_ottotrechos.cocursodag LIKE \''+ elementos +'\' OR '
    else:
        break
    comp = len(selecao)
    comp2 = comp - 3
    print('self.selecao:', selecao)
    sele2 = selecao [:comp2]
    print('self.sele2:', sele2)
query_ottotrechos_jusante = '?query=SELECT camada_ottotrechos.cocursodag, camada_ottotrechos.geometry '\
                            'FROM camada_ottotrechos '\
                            'WHERE ('+ sele2 +')AND camada_ottotrechos.cobacia < \''+cod_otto_interesse+'\''


print('\n''-> Seleção de ottorechos a jusante realizado.')