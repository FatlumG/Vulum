"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.RoleRepository = void 0;
const Role_1 = require("@api/models/Users/Role");
const typeorm_1 = require("typeorm");
const RepositoryBase_1 = require("@base/infrastructure/abstracts/RepositoryBase");
let RoleRepository = class RoleRepository extends RepositoryBase_1.RepositoryBase {
    createRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let entity = new Role_1.Role();
            Object.assign(entity, data);
            return yield this.save(entity);
        });
    }
    updateRole(role, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(role, data);
            return yield role.save(data);
        });
    }
    createRoles(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = [];
            data.forEach((element) => {
                const role = new Role_1.Role();
                role.role_name = element.RoleName;
                roles.push(role);
            });
            yield this.save(roles);
        });
    }
};
RoleRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Role_1.Role)
], RoleRepository);
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=RoleRepository.js.map