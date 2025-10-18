"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasRole = void 0;
function HasRole(role) {
    return function (request, response, next) {
        const loggedUser = request.loggedUser;
        let haveAccess = true;
        if (!loggedUser) {
            return response.status(403).send({ status: 401, message: 'Unauthorized!' });
        }
        if (typeof role == 'string') {
            if (loggedUser.role != role) {
                haveAccess = false;
            }
        }
        else {
            if (!role.includes(loggedUser.role)) {
                haveAccess = false;
            }
        }
        if (!haveAccess) {
            return response.status(403).send({
                status: 403,
                message: 'User does not have the right permissions!',
            });
        }
        return next();
    };
}
exports.HasRole = HasRole;
//# sourceMappingURL=HasRole.js.map