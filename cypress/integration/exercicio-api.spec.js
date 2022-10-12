/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })

    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })

    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let nome = `Alex Serafim ${Math.floor(Math.random() * 10000000)}`
        let email = `Alex${Math.floor(Math.random() * 10000000)}@gmail.com`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome":nome,
                "email": email,
                "password": "teste",
                "administrador": "true"

            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuario(token, 'Alycia da Silva', 'aly@gmail.com', 'teste', 'true')
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })

    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let nome = `Alex Serafim ${Math.floor(Math.random() * 100000000)}`
        let email = `Alex${Math.floor(Math.random() * 10000000)}@gmail.com`
        cy.cadastrarUsuario(token, nome, email, 'teste', 'true')
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                        "nome": nome,
                        "email": email,
                        "password": "teste",
                        "administrador": "true"
                    }
                }).then(res2 => {
                    expect(res2.body.message).to.equal('Registro alterado com sucesso')
                })
            })

    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let usuario = `Alycia da Silva ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(token, 'Alycia da Silva', 'alycia@gmail.com', 'teste')
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token }
                }).then(response => {
                    expect(response.body.message).to.equal('Nenhum registro excluído')
                    expect(response.status).to.equal(200)
                })
            })
    });


});
