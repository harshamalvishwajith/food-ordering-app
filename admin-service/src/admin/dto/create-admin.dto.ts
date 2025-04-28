export class CreateAdminDto {
  username: string;
  password: string;
  email: string;
  role?: 'admin' | 'superadmin';
}
