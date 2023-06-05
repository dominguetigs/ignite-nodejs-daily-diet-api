import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.string('date').notNullable()
    table.string('time').notNullable()
    table.boolean('included_in_diet').defaultTo(false)
    table
      .integer('user_id')
      .references('users.id')
      .notNullable()
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('meals')
}
