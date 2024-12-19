import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { Transacciones } from './interfases/transacciones';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private db: Firestore;
  
  constructor() {
    this.db = getFirestore(initializeApp(environment.firebaseConfig));
   }

  
    // Crear un nuevo registro de transacción
    async create(transaccion: Transacciones) {
      const transaccionesCollection = collection(this.db, 'transacciones');
      const newDocRef = await addDoc(transaccionesCollection, {
        descripcion: transaccion.descripcion,
        monto: transaccion.monto,
        fecha: transaccion.fecha,
        tipo: transaccion.tipo,
        categoria: transaccion.categoria,
        saldo: transaccion.saldo
      });
      return newDocRef.id;
    }
  
    // Obtener todos los registros de transacciones
    async getAll(): Promise<Transacciones[]> {
      const transaccionesCollection = collection(this.db, 'transacciones');
      const transaccionesSnapshot = await getDocs(transaccionesCollection);
      return transaccionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transacciones));
    }

    async getPorTipo(tipo:string):Promise<Transacciones[]>{
      const ingresosColeccion = query(collection(this.db,'transacciones'),where("tipo","==",tipo),orderBy("fecha"));
      const ingresosDocumentos = await getDocs(ingresosColeccion);
      return ingresosDocumentos.docs.map(doc=>({id:doc.id,...doc.data()} as Transacciones));
    }
    // async getAllRecords(): Promise<Transacciones[]> {
    //   const collectionRef = collection(this.db, 'transacciones');
    //   const snapshot = await getDocs(collectionRef);
    //   return snapshot.docs.map(doc => {
    //     const data = doc.data();
    //     return {
    //       id: doc.id,
    //       descripcion: data['descripcion'],
    //       monto: data['monto'],
    //       fecha: data['fecha'].toDate(), // Convierte el timestamp de Firestore a un objeto Date
    //       tipo: data['tipo'],
    //       categoria: data['categoria'],
    //       saldo: data['saldo'],
    //     };
    //   });
    // }
  
    // Obtener un solo registro de transacción
    
    async getRecord(id: string): Promise<Transacciones | null> {
      const docRef = doc(this.db, 'transacciones', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        return {
          id: snapshot.id,
          descripcion: data['descripcion'],
          monto: data['monto'],
          fecha: data['fecha'].toDate(),
          tipo: data['tipo'],
          categoria: data['categoria'],
          saldo: data['saldo'],
        };
      }
      return null;
    }
  
    // Actualizar un registro de transacción
    async update(transaccion: Transacciones) {
      const transaccionDocRef = doc(this.db, 'transacciones', transaccion.id);
      await updateDoc(transaccionDocRef, {
        descripcion: transaccion.descripcion,
        monto: transaccion.monto,
        fecha: transaccion.fecha,
        tipo: transaccion.tipo,
        categoria: transaccion.categoria,
        saldo: transaccion.saldo
      });
    }
    // async updateRecord(id: string, data: Transacciones): Promise<void> {
    //   const docRef = doc(this.db, 'transacciones', id);
    //   await updateDoc(docRef, {
    //     descripcion: data.descripcion,
    //     monto: data.monto,
    //     fecha: data.fecha,
    //     tipo: data.tipo,
    //     categoria: data.categoria,
    //     saldo: data.saldo,
    //   });
    // }
  
    // Eliminar un registro de transacción
   
     async delete(id: string) {
    const transaccionDocRef = doc(this.db, 'transacciones', id);
    await deleteDoc(transaccionDocRef);
  }
    // async deleteRecord(id: string): Promise<void> {
    //   const docRef = doc(this.db, 'transacciones', id);
    //   await deleteDoc(docRef);
    // }
  }
  


