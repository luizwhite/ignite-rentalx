import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AlterUserAlterEmailToUnique1627686551658
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        columnNames: ['email'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('users'))!;
    const { columns } = table!;

    await Promise.all(
      table.uniques.map(async (uniqueConstraint) => {
        await Promise.all(
          columns.map(async ({ name: colName }) => {
            if (
              colName === 'email' &&
              uniqueConstraint.columnNames.includes('email')
            ) {
              await queryRunner.dropUniqueConstraint(
                'users',
                uniqueConstraint.name!
              );
            }
          })
        );
      })
    );
  }
}
