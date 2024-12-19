import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp} from 'firebase/app';
import { environment } from '../../environments/environment';
import {getFirestore} from 'firebase/firestore';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FireModuleModule {
  constructor(){
  const app = initializeApp(environment.firebaseConfig);
  const db = getFirestore(app);

  }
}
