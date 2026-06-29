import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-compras-previas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div class="max-w-md w-full text-center animate-fadeIn">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm9.75 0a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M7.5 14.25h9.75M7.5 14.25l-1.444-4.886m0 0L4.227 4.5H2.25M6.056 9.75h11.888a.75.75 0 0 1 .721.521l1.286 4.5a.75.75 0 0 1-.72.979H7.5"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Compras Previas</h2>
        <p class="text-gray-500 mb-6">Esta sección está en construcción. Pronto podrás revisar tu historial de compras aquí.</p>
        <a routerLink="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
          Volver al inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  `]
})
export class ComprasPrevias {}
