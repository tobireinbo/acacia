export interface CreateUserDto {
  email: string;
  hashedPassword: string;
  firstname: string;
  lastname: string;
  salt: string;
}
