import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { NotificationService, Notification } from '../services/notification.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isCustomersDropdownOpen = false;
  isNotificationsOpen = false;
  isDarkTheme = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.isDarkTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkTheme = isDark;
      });

    // Subscribe to notifications
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.unreadCount = this.notificationService.getUnreadCount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.isCustomersDropdownOpen = false;
  }

  toggleCustomersDropdown(event: Event) {
    event.preventDefault();
    this.isCustomersDropdownOpen = !this.isCustomersDropdownOpen;
  }

  handleLogout() {
    this.authService.logout();
    this.closeMobileMenu();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  closeNotifications() {
    this.isNotificationsOpen = false;
  }

  markNotificationAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle';
      case 'error': return 'bi-exclamation-triangle';
      case 'warning': return 'bi-exclamation-circle';
      case 'info': return 'bi-info-circle';
      default: return 'bi-bell';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }
}
