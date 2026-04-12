import { RolePermissions } from "../../common/enums/enums.js";

export const hasPermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const userPermissions = RolePermissions[userRole] || [];

        const hasAccess = requiredPermissions.some(permissions => userPermissions.includes(permissions));

        if(!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        } 
        next();
    }
}