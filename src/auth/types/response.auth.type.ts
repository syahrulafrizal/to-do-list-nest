import { ResponseEntity } from 'src/config/entities/response.entity';
import { UserEntity } from '../models/user.entity';

export type ResponseRegister = ResponseEntity<UserEntity>;
export type ResponseLogin = ResponseEntity<{ user: UserEntity; token: string }>;
export type ResponseProfile = ResponseEntity<UserEntity>;
export type ResponseLogout = ResponseEntity;
export type ResponseSessions = ResponseEntity;
