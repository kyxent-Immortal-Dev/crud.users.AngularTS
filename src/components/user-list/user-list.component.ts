import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../app/services/user.service';
import { HttpService } from '../../app/services/http.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [HttpService],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Gestión de Usuarios</h2>
        <div class="badge badge-primary p-3">Total: {{ users.length }}</div>
      </div>
      
      <!-- Mensajes de alerta -->
      <div *ngIf="errorMessage" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ errorMessage }}</span>
        <button class="btn btn-sm" (click)="errorMessage = ''">Cerrar</button>
      </div>
      
      <div *ngIf="successMessage" class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ successMessage }}</span>
        <button class="btn btn-sm" (click)="successMessage = ''">Cerrar</button>
      </div>

      <!-- Formulario de usuario -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          
          <form (ngSubmit)="submitForm()" #userForm="ngForm" class="form-control w-full">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Nombre</span>
              </label>
              <input 
                type="text" 
                id="name" 
                [(ngModel)]="currentUser.name" 
                name="name" 
                required
                #name="ngModel"
                class="input input-bordered w-full" 
                [class.input-error]="name.invalid && formSubmitted"
              />
              <label *ngIf="name.invalid && formSubmitted" class="label">
                <span class="label-text-alt text-error">El nombre es requerido</span>
              </label>
            </div>
            
            <div class="form-control w-full mt-2">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="currentUser.email" 
                name="email" 
                required
                email
                #email="ngModel"
                class="input input-bordered w-full"
                [class.input-error]="email.invalid && formSubmitted"
              />
              <label *ngIf="email.invalid && formSubmitted" class="label">
                <span class="label-text-alt text-error">Ingrese un email válido</span>
              </label>
            </div>
            
            <div class="card-actions justify-end mt-6">
              <button *ngIf="editingUser" type="button" (click)="cancelEdit()" class="btn" [disabled]="isLoading">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="isLoading"
              >
                <span *ngIf="isLoading" class="loading loading-spinner loading-xs mr-2"></span>
                {{ editingUser ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de usuarios -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Lista de Usuarios</h3>
          
          <!-- Estado de carga -->
          <div *ngIf="isLoading" class="flex justify-center items-center p-8">
            <span class="loading loading-spinner loading-lg text-primary"></span>
          </div>
          
          <!-- Mensaje si no hay usuarios -->
          <div *ngIf="!isLoading && users.length === 0" class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No hay usuarios registrados.</span>
          </div>
          
          <!-- Tabla de usuarios -->
          <div class="overflow-x-auto" *ngIf="!isLoading && users.length > 0">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td class="flex gap-2">
                    <button class="btn btn-sm btn-primary" (click)="editUser(user)" [disabled]="isLoading">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button class="btn btn-sm btn-error" (click)="deleteUser(user.id)" [disabled]="isLoading">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  
  users: User[] = [];
  currentUser: Partial<User> = { name: '', email: '' };
  editingUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  formSubmitted = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.users = await this.userService.getUsers();
    } catch (error) {
      this.errorMessage = 'Error al cargar los usuarios. Por favor, intente nuevamente.';
      console.error('Error loading users:', error);
    } finally {
      this.isLoading = false;
    }
  }

  submitForm(): void {
    this.formSubmitted = true;
    
    // Verificar si el formulario es válido
    if (this.userForm.invalid) {
      return;
    }
    
    // Si el formulario es válido, proceder con la operación
    this.onSubmit();
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.editingUser) {
        const updatedUser = await this.userService.updateUser(
          this.editingUser.id,
          this.currentUser
        );
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.successMessage = 'Usuario actualizado exitosamente';
      } else {
        const newUser = await this.userService.createUser(this.currentUser as Omit<User, 'id'>);
        this.users.push(newUser);
        this.successMessage = 'Usuario creado exitosamente';
      }
      this.resetForm();
    } catch (error) {
      this.errorMessage = this.editingUser
        ? 'Error al actualizar el usuario'
        : 'Error al crear el usuario';
      console.error('Error saving user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.currentUser = { ...user };
    this.formSubmitted = false;
    // Desplazarse al formulario
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  async deleteUser(id: number): Promise<void> {
    if (this.isLoading) return;
    
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        await this.userService.deleteUser(id);
        this.users = this.users.filter(user => user.id !== id);
        this.successMessage = 'Usuario eliminado exitosamente';
      } catch (error) {
        this.errorMessage = 'Error al eliminar el usuario';
        console.error('Error deleting user:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.currentUser = { name: '', email: '' };
    this.editingUser = null;
    this.formSubmitted = false;
    if (this.userForm) {
      this.userForm.resetForm();
    }
  }
}
