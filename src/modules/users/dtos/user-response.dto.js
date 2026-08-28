export const UserResponseDto = (user) => ({
    id: user.id,
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email,
    is_active: user.is_active,
    createdAt: user.created_at
});
