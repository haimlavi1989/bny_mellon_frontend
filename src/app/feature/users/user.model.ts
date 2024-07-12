export enum Role {
    User = 'user',
    Gust = 'gust',
    Admin = 'admin'
}

export class User {
    id = '';
    title = '';
    name = '';
    email = '';
    photo = '';
    role = Role.User;
    isDeleting = false;
}