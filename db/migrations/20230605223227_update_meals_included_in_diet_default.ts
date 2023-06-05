import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.boolean('included_in_diet').defaultTo(true).alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.boolean('included_in_diet').defaultTo(false).alter()
  })
}
