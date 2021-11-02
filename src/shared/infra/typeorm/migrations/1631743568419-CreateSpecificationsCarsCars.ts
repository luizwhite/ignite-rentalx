import md5 from 'blueimp-md5';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSpecificationsCarsCars1631743568419
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'specifications_cars_cars',
        columns: [
          { name: 'specificationsId', type: 'uuid', isPrimary: true },
          { name: 'carsId', type: 'uuid', isPrimary: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: `FK_Specification_Car_${md5('specification_car')}`,
            columnNames: ['specificationsId'],
            referencedTableName: 'specifications',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
          {
            name: `FK_Car_Specification_${md5('car_specification')}`,
            columnNames: ['carsId'],
            referencedTableName: 'cars',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('specifications_cars_cars');
  }
}
