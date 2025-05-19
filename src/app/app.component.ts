import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../components/user-list/user-list.component';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserListComponent],
  providers: [HttpService],
  template: `
    <div class="drawer">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
      <div class="drawer-content flex flex-col">
        <!-- Navbar -->
        <div class="navbar bg-primary text-primary-content shadow-lg">
          <div class="navbar-start">
            <div class="lg:hidden">
              <label for="my-drawer-3" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div>
            <a class="btn btn-ghost text-xl">Gestión de Usuarios</a>
          </div>
          <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
              <li><a class="font-bold">Usuarios</a></li>
              <li><a>Dashboard</a></li>
              <li><a>Configuración</a></li>
            </ul>
          </div>
          <div class="navbar-end">
            <button class="btn btn-ghost btn-circle">
              <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span class="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Page content -->
        <div class="container mx-auto p-4 md:p-8">
          <app-user-list></app-user-list>
        </div>
        
        <!-- Footer -->
        <footer class="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
          <div>
            <p>Copyright © 2023 - Todos los derechos reservados</p>
          </div>
        </footer>
      </div>
      
      <!-- Sidebar -->
      <div class="drawer-side">
        <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label> 
        <ul class="menu p-4 w-80 min-h-full bg-base-200">
          <li><a class="font-bold">Usuarios</a></li>
          <li><a>Dashboard</a></li>
          <li><a>Configuración</a></li>
        </ul>
      </div>
    </div>
  `
})
export class AppComponent {}
