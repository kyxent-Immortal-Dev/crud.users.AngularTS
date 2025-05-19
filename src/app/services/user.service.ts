import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = '/users';

  constructor(private httpService: HttpService) {}

  async getUsers(): Promise<User[]> {
    return this.httpService.get<User[]>(this.endpoint);
  }

  async getUserById(id: number): Promise<User> {
    return this.httpService.get<User>(`${this.endpoint}/${id}`);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.httpService.post<User>(this.endpoint, user);
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.httpService.put<User>(`${this.endpoint}/${id}`, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.httpService.delete<void>(`${this.endpoint}/${id}`);
  }
} 