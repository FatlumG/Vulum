"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typedi_1 = require("typedi");
const UserRepository_1 = require("@api/repositories/Users/UserRepository");
const UserNotFoundException_1 = require("@api/exceptions/Users/UserNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const cloudinary_1 = __importDefault(require("@base/utils/cloudinary"));
let UserService = class UserService {
    constructor(userRepository, eventDispatcher) {
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedUserOrFail(id, resourceOptions);
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.role', 'role')
                .select(['user.id', 'user.first_name', 'user.last_name', 'user.profile_photo_url', 'role.role_name'])
                .where('user.id = :id', { id })
                .getOne();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findOne(data);
            if (existingUser) {
                throw new Error('This User already exists');
            }
            let user = yield this.userRepository.createUser(data);
            this.eventDispatcher.dispatch('onUserCreate', user);
            return user;
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getRequestedUserOrFail(id);
            return yield this.userRepository.updateUser(user, data);
        });
    }
    updateProfilePicture(loggedUserId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getRequestedUserOrFail(loggedUserId);
            if (!client)
                throw new Error('Client not Found!');
            if (!image)
                throw new Error('Image is required!');
            try {
                const result = (yield cloudinary_1.default.uploader.upload_large(image, {
                    folder: 'Profile Pictures',
                }));
                client.profile_photo_url = result.secure_url;
                yield client.save();
            }
            catch (error) {
                throw new Error(`Cloudinary upload failed: ${error.message}`);
            }
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.delete(id);
        });
    }
    getRequestedUserOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.pricing_plan', 'plan')
                .select(['user', 'plan.id', 'plan.plan_name', 'plan.plan_description', 'plan.price', 'plan.billing_cycle'])
                .where('user.id = :id', { id })
                .getOne();
            if (!user) {
                throw new UserNotFoundException_1.UserNotFoundException();
            }
            return user;
        });
    }
    getUsersBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSearchEmpty = !search || search.trim() === ',';
            const queryBuilder = this.userRepository.createQueryBuilder('User').leftJoinAndSelect('User.role', 'role');
            if (!isSearchEmpty) {
                const searchFields = ['first_name', 'last_name', 'email', 'role_name'];
                const orConditions = searchFields.map((field) => {
                    return `${field} LIKE :search`;
                });
                const whereClause = `(${orConditions.join(' OR ')})`;
                const searchValue = `%${search}%`;
                queryBuilder.andWhere(whereClause, { search: searchValue });
            }
            queryBuilder.select(['User.id', 'User.username', 'User.first_name', 'User.last_name', 'User.email', 'User.phone', 'role.role_name']);
            const users = yield queryBuilder.getMany();
            if (!users) {
                throw new UserNotFoundException_1.UserNotFoundException();
            }
            return users;
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository, EventDispatcher_1.EventDispatcherInterface])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map