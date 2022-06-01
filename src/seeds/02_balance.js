const moment = require('moment')

exports.seed = (knex) => {
  return knex('users').insert([
    {id: 10100, name: 'User #3', mail: "user3@mail.com", passwd: '$2a$10$F8Sbbz2ZprffMb3BhTP9rOpckaFkkR6meGHGRAASM6bItvz58TRiy'},
    {id: 10101, name: 'User #4', mail: "user4@mail.com", passwd: '$2a$10$F8Sbbz2ZprffMb3BhTP9rOpckaFkkR6meGHGRAASM6bItvz58TRiy'},
    {id: 10102, name: 'User #5', mail: "user5@mail.com", passwd: '$2a$10$F8Sbbz2ZprffMb3BhTP9rOpckaFkkR6meGHGRAASM6bItvz58TRiy'}

  ])
    .then(() => knex('accounts').insert([
      { id: 10100, name: 'Acc Saldo Principal', user_id: 10100},
      { id: 10101, name: 'Acc Saldo Secundário', user_id: 10100},
      { id: 10102, name: 'Acc Alternativa 1', user_id: 10101},
      { id: 10103, name: 'Acc Alternativa 2', user_id: 10101},
      { id: 10104, name: 'Acc Geral Principal', user_id: 10102},
      { id: 10105, name: 'Acc Gerak Secundário', user_id: 10102},
    ]))
    .then(() => knex('transfers').insert([
      { id:10100, description: 'Transfer #1', user_id: 10102, acc_ori_id: 10105, acc_dest_id: 10104, amount: 256, date: new Date()},
      { id:10101, description: 'Transfer #2', user_id: 10101, acc_ori_id: 10102, acc_dest_id: 10103, amount: 512, date: new Date()},
    ]))
    .then(() => knex('transactions').insert([
      //Transação Positiva / Saldo = 2
      {description: '2', date: new Date(), amount: 2, type:"I", acc_id: 10104, status: true},
      //Transação para usuário errado / Saldo = 2
      {description: '4', date: new Date(), amount: 4, type:"I", acc_id: 10102, status: true},
      //Transaçao para outra conta / Saldo = 2 / SaldoB = 8
      {description: '8', date: new Date(), amount: 8, type:"I", acc_id: 10105, status: true},
      //Transação pendente / Saldo = 2 / SaldoB = 8
      {description: '16', date: new Date(), amount: 16, type:"I", acc_id: 10104, status: false},
      //Transação passada  / Saldo = 34 / SaldoB = 8
      {description: '32', date: moment().subtract({ days: 5 }), amount: 32, type:"I", acc_id: 10104, status: true},
      //Transaçào futura / Saldo = 34 / SaldoB = 8
      {description: '64', date: moment().add({ days: 5 }), amount: 64, type:"I", acc_id: 10104, status: true},
      //Transação Negativa / Saldo = -94 / SaldoB = 8
      {description: '128', date: moment(), amount: -128, type:"O", acc_id: 10104, status: true},
      //Transf / Saldo = 162 / SaldoB = -248
      {description: '256', date: moment(), amount: 256, type:"I", acc_id: 10104, status: true},
      {description: '256', date: moment(), amount: -256, type:"O", acc_id: 10105, status: true},
      //Transf outras contas
      {description: '256', date: moment(), amount: 512, type:"I", acc_id: 10103, status: true},
      {description: '256', date: moment(), amount: -512, type:"O", acc_id: 10102, status: true},

    ]))
};
