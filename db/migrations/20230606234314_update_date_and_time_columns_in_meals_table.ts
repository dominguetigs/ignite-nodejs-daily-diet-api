import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('meals', (table) => {
    table
      .date('date')
      .defaultTo(knex.fn.now().toString().substring(0, 10))
      .alter()
    table
      .time('time')
      .defaultTo(knex.fn.now().toString().substring(11, 19))
      .alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('meals', (table) => {
    table.string('date').notNullable().alter()
    table.string('time').notNullable().alter()
  })
}
