import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransaccionesComponent } from "./paginas/transacciones/transacciones.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TransaccionesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Finanzas2024';
}
