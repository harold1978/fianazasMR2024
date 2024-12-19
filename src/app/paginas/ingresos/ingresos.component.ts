import { Component, inject, signal } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Transacciones } from '../../interfases/transacciones';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-ingresos',
  imports: [FormsModule],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css',
})
export class IngresosComponent {
  ingresos: Transacciones[] = [];
  newingreso:Transacciones = { id: '', descripcion: '', monto: 0, fecha: new Date(), tipo: '', categoria: '', saldo: 0 };

  total = signal(0);
  private db = inject(FirestoreService);

  ngOnInit(): void {
    this.cargar();
  }
  async addIngreso(){
    const id = await this.db.create(this.newingreso);
    this.newingreso.id = id;
    this.ingresos.push({...this.newingreso});
    this.newingreso  = { id: '', descripcion: '', monto: 0, fecha: new Date(), tipo: 'ingreso', categoria: '', saldo: 0 };

  }

  formatomoneda(valor: number) {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(valor);
  }
  async deleteIngreso(id:string){
    await this.db.delete(id);
    this.ingresos = this.ingresos.filter(i=>i.id!== id);
  }

  async updateIngreso(ingreso:Transacciones){
    await this.db.update(ingreso);
    this.cargar();
  }


  async cargar() {
    this.ingresos = await this.db.getPorTipo('ingreso');
    this.ingresos.sort((a, b) => {
      if (a.fecha < b.fecha) return -1;
      else if (a.fecha > b.fecha) return 1;
      else return 0;
    });

  }
}
