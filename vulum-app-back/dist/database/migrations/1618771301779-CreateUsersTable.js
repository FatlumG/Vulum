"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1618771301779 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsersTable1618771301779 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = new typeorm_1.Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'first_name', type: 'varchar', length: '191' },
                    { name: 'last_name', type: 'varchar', length: '191' },
                    { name: 'email', type: 'varchar', length: '191' },
                    { name: 'password', type: 'varchar', length: '191' },
                    { name: 'role_id', type: 'bigint' },
                ],
            });
            yield queryRunner.createTable(table);
            yield queryRunner.createForeignKey('users', new typeorm_1.TableForeignKey({
                columnNames: ['role_id'],
                referencedTableName: 'roles',
                referencedColumnNames: ['id'],
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('users');
        });
    }
}
exports.CreateUsersTable1618771301779 = CreateUsersTable1618771301779;
//# sourceMappingURL=1618771301779-CreateUsersTable.js.map