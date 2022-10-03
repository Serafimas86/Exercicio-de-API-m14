/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {
    let token
    before(() => {
         cy.token('nunes@gmail.com.br', 'teste').then(tkn => { token = tkn })
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
     let usuarios = `Rafaela Nunes ${Math.floor(Math.random() * 100000000)}`
     cy.request({
         method: 'POST',
         url: 'usuarios',
         body: {
          "nome": "Fernando da Silva",
          "email": "fs@gmail.com",
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
     cy.cadastrarUsuario(token, 'Fernando da Silva', 'fer@gmail.com', 'teste', 'true')
     .then((response) => {
         expect(response.status).to.equal(400)
         expect(response.body.message).to.equal('Este email já está sendo usado')
       }) 

    });

    it('Deve editar um usuário previamente cadastrado', () => {
     let usuarios = `Fernando da Silva ${Math.floor(Math.random() * 100000000)}`
     cy.cadastrarUsuario(token, 'Alycia da Silva', 'al@gmail.com', 'teste', 'true')
     .then(response => {
         let id = response.body._id

         cy.request({
             method: 'PUT', 
             url: `usuarios/${id}`,
             headers: {authorization: token}, 
             body: 
             {
               "nome": "Alycia da Silva",
               "email": "al@gmail.com",
               "password": "teste",
               "administrador": "true"
               }
         }).then(response => {
             expect(response.body.message).to.equal('Registro alterado com sucesso')
         })
     })
     
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let usuario = `Alycia da Silva ${Math.floor(Math.random() * 100000000)}`
     cy.cadastrarProduto(token, 'Alycia da Silva', 'alycia@gmail.com', 'teste', 'true')
     .then(response => {
         let id = response.body._id
         cy.request({
             method: 'DELETE',
             url: `usuarios/${id}`,
             headers: {authorization: token}
         }).then(response =>{
             expect(response.body.message).to.equal('Nenhum registro excluído')
             expect(response.status).to.equal(200)
         })
     })
    });


});
