const req = require('express/lib/request');
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transfers'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyICMxIiwibWFpbCI6InVzZXIxQG1haWwuY29tIn0.QMgvo_lPe0Rdxpx7cay_hIkDAbjCK_--VD2fP0NTTqk';

beforeAll(async () => {
  await app.db.seed.run();
})

test('Deve listar apenas as transferências do usuário', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe("Transfer #1");
    });
});

test('Deve inserir uma transferência com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .send({description: "Regular Transfer", user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date()})
    .then(async (res) => {
      expect(res.status).toBe(201);
      expect(res.body[0].description).toBe("Regular Transfer"); 
      const transactions = await app.db('transactions').where({transfer_id: res.body[0].id})
      expect(transactions).toHaveLength(2);
      expect(transactions[0].description).toBe('Transfer to acc #10001')
      expect(transactions[1].description).toBe('Transfer from acc #10000')
      expect(transactions[0].amount).toBe('-100.00')
      expect(transactions[1].amount).toBe('100.00')
      expect(transactions[0].acc_id).toBe(10000)
      expect(transactions[1].acc_id).toBe(10001)

    });
});

describe( 'Ao salvar uma transerência válida ...', () => {
  let transferId;
  let income;
  let outcome;

  test('Deve retornar o status 201 e os dados da transferência', () => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({description: "Regular Transfer", user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date()})
      .then(async (res) => {
        expect(res.status).toBe(201);
        expect(res.body[0].description).toBe('Regular Transfer');
        transferId = res.body[0].id;
      })
  });

  test('As transações equivalentes devem ter sido geradas', async () => {
    const transactions = await app.db('transactions').where({transfer_id: transferId}).orderBy('amount');
    expect(transactions).toHaveLength(2);
    [outcome, income] = transactions;
  });

  test('A transação de saída deve ser negativa', () => {
    expect(outcome.description).toBe('Transfer to acc #10001')
    expect(outcome.amount).toBe('-100.00')
    expect(outcome.acc_id).toBe(10000)
    expect(outcome.type).toBe('O') 
  });

  test('A transação de entrada deve ser positova', () => {
    expect(income.description).toBe('Transfer from acc #10000')
    expect(income.amount).toBe('100.00')
    expect(income.acc_id).toBe(10001)
    expect(income.type).toBe('I') 
  });

  test('Ambas devem referenciar a transferência que as originou', () => {
    expect(income.transfer_id).toBe(transferId)
    expect(outcome.transfer_id).toBe(transferId)
  });
});

describe('Ao trentar alterar uma transferência inválida ... ', () => {
  const validTransfer = { description: "Regular Transfer", user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date() }

  const template = (newData, errorMessage) => { 
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ ...validTransfer, ...newData })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      
      })
  }
  test('Não deve inserir sem descrição', () => template({ description: null }, 'Descrição é um atributo obrigatório'));
  test('Não deve inserir sem valor', () => template({ amount: null }, 'Valor é um atributo obrigatório'));
  test('Não deve inserir sem data', () => template({ date: null }, 'Data é um atributo obrigatório'));
  test('Não deve inserir sem conta de origem', () => template({ acc_ori_id: null }, 'Conta de origem é um atributo obrigatório'));
  test('Não deve inserir sem conta de destino', () => template({ acc_dest_id: null }, 'Conta de destino é um atributo obrigatório'));
  test('Não deve inserir se as contas de origem e destino forem as mesmas', () => template({ acc_dest_id: 10000 }, 'Não é possível transferir de uma conta para ela mesma'));
  test('Não deve inserir se as contas pertencerem a outro usuário', () => template({ acc_ori_id: 10002 }, 'Conta #10002 não pertence ao usuário'));
})

test('Deve retornar uma transferência por ID', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .set('authorization', `bearer ${TOKEN}`)
    .send()
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Transfer #1');
    });
});

describe( 'Ao alterar uma transerência válida ...', () => {
  let transferId;
  let income;
  let outcome;

  test('Deve retornar o status 200 e os dados da transferência', () => {
    return request(app).put(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: "Transfer Updated", user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 500, date: new Date() })
      .then(async (res) => {
        expect(res.status).toBe(200);
        expect(res.body[0].description).toBe('Transfer Updated');
        expect(res.body[0].amount).toBe('500.00');
        transferId = res.body[0].id;
      })
  });

  test('As transações equivalentes devem ter sido geradas', async () => {
    const transactions = await app.db('transactions').where({transfer_id: transferId}).orderBy('amount');
    expect(transactions).toHaveLength(2);
    [outcome, income] = transactions;
  });

  test('A transação de saída deve ser negativa', () => {
    expect(outcome.description).toBe('Transfer to acc #10001')
    expect(outcome.amount).toBe('-500.00')
    expect(outcome.acc_id).toBe(10000)
    expect(outcome.type).toBe('O') 
  });

  test('A transação de entrada deve ser positova', () => {
    expect(income.description).toBe('Transfer from acc #10000')
    expect(income.amount).toBe('500.00')
    expect(income.acc_id).toBe(10001)
    expect(income.type).toBe('I') 
  });

  test('Ambas devem referenciar a transferência que as originou', () => {
    expect(income.transfer_id).toBe(transferId)
    expect(outcome.transfer_id).toBe(transferId)
  });
});

describe('Ao remover uma transferência ...', () => {
  test('Deve retornar o status 204', () => {
    return request(app).delete(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(204);
      })
    
  });
  test('O registro deve ter sido removido do banco', () => {
    return app.db('transfers').where({ id: 10000 })
    .then((result => {
      expect(result).toHaveLength(0);
    }))
    
  });
  test('As transações associadas devem ter sido removidas', () => {
    return app.db('transactions').where({ transfer_id: 10000 })
    .then((result => {
      expect(result).toHaveLength(0);
    }))
  });
})