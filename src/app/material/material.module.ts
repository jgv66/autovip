import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatChipsModule,
  ],
  exports: [
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatChipsModule,
  ],
})
export class MaterialModule { }
