export const UserResponseDto = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
    createdAt: user.created_at
});
