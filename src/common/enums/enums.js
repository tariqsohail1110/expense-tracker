// OTP PURPOSE
export const OtpPurpose = Object.freeze({
    LOGIN: 'login',
    REGISTER: 'register',
    PASSWORD_RESET: 'password_reset',
    VERIFICATION: 'verification'
});

export const Roles = Object.freeze({
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user'
});

export const Permissions = Object.freeze({
    //User
    GET_OWN_PROFILE: 'get_own_profile',
    UPDATE_OWN_PROFILE: 'update_own_profile',
    DELETE_OWN_PROFILE: 'delete_own_profile',
    MANAGE_OWN_EXPENSES: 'manage_own_expenses',
    MANAGE_OWN_BUDGET: 'manage_own_budget',

    //Admin
    READ_ALL_USERS: 'get_all_users',
    GET_ANY_USER: 'get_any_user',
    CREATE_USER: 'create_user',
    UPDATE_ANY_USER: 'update_any_user',
    DELETE_ANY_USER: 'delete_any_user',
    READ_ALL_EXPENSES: 'read_all_expenses',
    READ_ALL_BUDGETS: 'read_all_budgets',

    //SuperAdmin
    MANAGE_ALL_ADMINS: 'manage_all_admins'
});

//Mapping permissions to roles
export const RolePermissions = Object.freeze({
    [Roles.USER]: [
        Permissions.GET_OWN_PROFILE,
        Permissions.UPDATE_OWN_PROFILE,
        Permissions.DELETE_OWN_PROFILE,
        Permissions.MANAGE_OWN_EXPENSES,
        Permissions.MANAGE_OWN_BUDGET
    ],

    [Roles.ADMIN]: [
        Permissions.UPDATE_OWN_PROFILE,
        Permissions.DELETE_OWN_PROFILE,
        Permissions.GET_OWN_PROFILE,
        Permissions.READ_ALL_USERS,
        Permissions.GET_ANY_USER,
        Permissions.CREATE_USER,
        Permissions.UPDATE_ANY_USER,
        Permissions.DELETE_ANY_USER,
        Permissions.READ_ALL_EXPENSES,
        Permissions.READ_ALL_BUDGETS
    ],

    [Roles.SUPER_ADMIN]: [
        ...Object.values(Permissions)
    ]
})