import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {
  invitations: Array<any> = [
    { id: '4b2d25ee-febd-4706-ad54-59b050269663', subject: 'Invitation 1', body: 'Description 2' }
  ];
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchInvitations();
  }

  fetchInvitations(): void {
    this.apiService.getInvitations().subscribe({
      next: (data) => {
        this.invitations = data || [];
      },
      error: (err) => {
        this.error = 'Invitation error: ' + err.message;
        console.error('Invitation error:', err);
      }
    });
  }

  declineInvitation(inviteId: string): void {
    this.apiService.refuseInvitation(inviteId).subscribe({
      next: (response) => {
        if (response) {
          this.fetchInvitations();
        } else {
          this.error = 'Invitation error';
        }
      },
      error: (err) => {
        this.error = 'Invitation error : ' + err.message;
        console.error('Invitation error', err);
      }
    });
  }
}
