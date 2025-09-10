import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorProfileWizardComponent } from '../../administrator/administrator-profile-wizard.component';
import { TeacherProfileWizardComponent } from '../../teacher/teacher-profile-wizard.component';
import { StudentProfileWizardComponent } from '../../student/student-profile-wizard.component';
import { WorkerProfileWizardComponent } from '../../worker/worker-profile-wizard.component';
import { MasterProfileWizardComponent } from '../../master/master-profile-wizard.component';
import { Role } from '../../../../core/types/role.type';

@Component({
  selector: 'app-users-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AdministratorProfileWizardComponent,
    TeacherProfileWizardComponent,
    StudentProfileWizardComponent,
    WorkerProfileWizardComponent,
    MasterProfileWizardComponent,
  ],
  templateUrl: './users.dialog.html',
  styleUrls: ['./users.dialog.css'],
})
export class UsersDialogComponent {
  @Input({ required: true }) open = false;
  @Output() openChange = new EventEmitter<boolean>();

  // se Role incluir outros valores além dos 5, pode trocar por um tipo local:
  // type UserType = 'administrator'|'teacher'|'student'|'worker'|'master';
  // tipo = signal<UserType>('administrator');
  tipo = signal<Role>('administrator');

  close() {
    this.openChange.emit(false);
  }

  onTypeChange(ev: Event) {
    const select = ev.target as HTMLSelectElement;
    this.tipo.set(select.value as Role);
  }
}
