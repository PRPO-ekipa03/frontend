import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  // Active tab (account/password)
  activeTab: string = 'account';

  // For displaying possible errors and success messages
  errorMessage: string = '';
  successMessage: string = '';
  formDataError: string = '';

  // Basic user fields
  currentUser = {
    fullName: '',
    username: '',
    email: '',
    telephone: ''
  };

  // Keep a copy to reset changes
  originalUser = {
    fullName: '',
    username: '',
    email: '',
    telephone: ''
  };

  // Simple password settings
  passwordSettings = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  // Modal reference
  modalRef?: BsModalRef;

  // Optional template references (if you still want modals):
  @ViewChild('success', { static: false }) successTemplate!: TemplateRef<any>;
  @ViewChild('deleteConfirm') deleteConfirm!: TemplateRef<any>;

  constructor(
    private readonly modalService: BsModalService
  ) {
    // Mock: fill originalUser with defaults or existing data
    this.originalUser = { 
      fullName: 'John Doe', 
      username: 'johnny', 
      email: 'john@example.com', 
      telephone: '+1 555-1234'
    };
    // Copy to currentUser
    this.currentUser = { ...this.originalUser };
  }

  // Switch tabs
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Mock: Updating account info
  updateAccount() {
    console.log('Mock: Updating user account');
    this.errorMessage = '';
    this.successMessage = 'Profile updated successfully (mock).';
    this.openModal(this.successTemplate); // Explicitly pass the success template
    setTimeout(() => this.closeModal(), 2000);
  }

  // Mock: Reset to original user data
  reset() {
    console.log('Mock: Reset changes');
    this.currentUser = { ...this.originalUser };
  }

  // Mock: Delete user
  deleteUser() {
    console.log('Mock: Deleting user account');
    this.successMessage = 'User account deleted (mock).';
    this.openModal();
    setTimeout(() => this.closeModal(), 2000);
  }

  // Mock: Change password
  changePassword() {
    console.log('Mock: Changing password');
    if (!this.passwordSettings.newPassword || !this.passwordSettings.confirmNewPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }
    if (this.passwordSettings.newPassword !== this.passwordSettings.confirmNewPassword) {
      this.errorMessage = 'New password and confirmation do not match.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = 'Password changed successfully (mock).';
    this.openModal();
    setTimeout(() => {
      this.closeModal();
      this.passwordSettings.oldPassword = '';
      this.passwordSettings.newPassword = '';
      this.passwordSettings.confirmNewPassword = '';
    }, 2000);
  }

  // Mock: Logout
  logout() {
    console.log('Mock: Logout');
    this.successMessage = 'Logged out successfully (mock).';
    this.openModal();
    setTimeout(() => this.closeModal(), 2000);
  }

  // Mock: Open a modal
  openModal(template?: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template || this.successTemplate, {
      class: 'modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  // Close the modal
  closeModal() {
    this.formDataError = '';
    this.modalRef?.hide();
    this.modalRef = undefined;
  }
}
