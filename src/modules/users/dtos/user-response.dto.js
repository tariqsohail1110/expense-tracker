export const UserResponseDto = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at
});