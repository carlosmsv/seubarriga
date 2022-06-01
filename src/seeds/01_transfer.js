/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      {id: 10000, name: 'User #1', mail: "user1@mail.com", passwd: '$2a$10$F8Sbbz2ZprffMb3BhTP9rOpckaFkkR6meGHGRAASM6bItvz58TRiy'},
      {id: 10001, name: 'User #2', mail: "user2@mail.com", passwd: '$2a$10$F8Sbbz2ZprffMb3BhTP9rOpckaFkkR6meGHGRAASM6bItvz58TRiy'}
    ]))
    .then(() => knex('accounts').insert([
      {id:10000, name: 'AccOrigem #1', user_id: 10000},
      {id:10001, name: 'AccDestino #1', user_id: 10000},
      {id:10002, name: 'AccOrigem #2', user_id: 10001},
      {id:10003, name: 'AccDestino #2', user_id: 10001},
    ]))
    .then(() => knex('transfers').insert([
      { id:10000, description: 'Transfer #1', user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date()},
      { id:10001, description: 'Transfer #2', user_id: 10001, acc_ori_id: 10002, acc_dest_id: 10003, amount: 100, date: new Date()},
    ]))
    .then(() => knex('transactions').insert([
      {description: 'Transfer from AccOrigem #1', date: new Date(), amount: 100, type:"I", acc_id: 10001, transfer_id: 10000},
      {description: 'Transfer to AccDestino #1', date: new Date(), amount: -100, type:"O", acc_id: 10000, transfer_id: 10000},
      {description: 'Transfer from AccOrigem #2', date: new Date(), amount: 100, type:"I", acc_id: 10003, transfer_id: 10001},
      {description: 'Transfer to AccDestino #2', date: new Date(), amount: -100, type:"O", acc_id: 10002, transfer_id: 10001},

    ]))

};
