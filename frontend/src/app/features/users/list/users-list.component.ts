import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersModalComponent } from './users-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UsersModalComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  modalOpen = signal(false);

  openModal() {
    this.modalOpen.set(true);
  }

  onOpenChange(open: boolean) {
    this.modalOpen.set(open);
  }
}
