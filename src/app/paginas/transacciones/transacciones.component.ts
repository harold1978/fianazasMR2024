import { Component, inject, signal } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Transacciones } from '../../interfases/transacciones';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transacciones',
  imports: [FormsModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesComponent {
  transacciones: Transacciones[]=[];
  newTransaccion: Transacciones = { id: '', descripcion: '', monto: 0, fecha: new Date(), tipo: '', categoria: '', saldo: 0 };
  total = signal(0);
  private dbfire = inject(FirestoreService);
  
  ngOnInit(): void {
    this.loadTransacciones();
  }
  //formato moneda
 formatomoneda(valor:number) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(valor);
}
  async loadTransacciones() {
    this.transacciones = await this.dbfire.getPorTipo("gasto");
    this.transacciones.forEach(d=>this.total.set(this.total()+d.monto));
    this.transacciones.sort((a,b) => {
      if(a.fecha < b.fecha)
        return -1;
      else if(a.fecha>b.fecha)
        return 1;
      else
      return 0;
    });
  }
  async addTransaccion() {
    const id = await this.dbfire.create(this.newTransaccion);
    this.newTransaccion.id = id; // Set the id for the new transaction
    this.transacciones.push({ ...this.newTransaccion });
    this.newTransaccion = { id: '', descripcion: '', monto: 0, fecha: new Date(), tipo: '', categoria: '', saldo: 0 };
  }
  async deleteTransaccion(id: string) {
    await this.dbfire.delete(id);
    this.transacciones = this.transacciones.filter(t => t.id !== id);
  }
  async updateTransaccion(transaccion: Transacciones) {
    await this.dbfire.update(transaccion);
    this.loadTransacciones(); // Reload transactions after update
  }
}
