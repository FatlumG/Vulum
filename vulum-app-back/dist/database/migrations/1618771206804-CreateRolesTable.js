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
exports.CreateRolesTable1618771206804 = void 0;
const typeorm_1 = require("typeorm");
class CreateRolesTable1618771206804 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = new typeorm_1.Table({
                name: 'roles',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'name', type: 'varchar', length: '50', isUnique: true },
                ],
            });
            yield queryRunner.createTable(table);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('roles');
        });
    }
}
exports.CreateRolesTable1618771206804 = CreateRolesTable1618771206804;
//# sourceMappingURL=1618771206804-CreateRolesTable.js.map