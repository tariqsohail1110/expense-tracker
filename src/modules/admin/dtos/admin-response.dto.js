export const AdminResponseDto = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at
});