const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        
        // Convert roles to array of numbers if they're objects
        const userRoles = Array.isArray(req.roles) 
            ? req.roles 
            : Object.values(req.roles);
        
        const hasPermission = userRoles.some(role => 
            allowedRoles.includes(role)
        );

        if (!hasPermission) {
            console.log(`Failed role check. User roles: ${userRoles}, Required: ${allowedRoles}`);
            return res.sendStatus(401);
        }
        next();
    };
};

module.exports = verifyRoles;