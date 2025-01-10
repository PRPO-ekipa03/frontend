import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<string>(); // Emit the selected date

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentYear: number = new Date().getFullYear();
  currentMonthIndex: number = new Date().getMonth(); // 0-based month index
  currentMonth: string = '';
  
  days: (string | number)[] = []; // The array of days to display (empty strings for placeholders)

  ngOnInit() {
    this.updateCalendar();
  }

  updateCalendar(): void {
    this.currentMonth = this.monthNames[this.currentMonthIndex];

    // Calculate days in the month
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Determine the weekday of the first day of the month.
    // In JavaScript, Sunday = 0, Monday = 1, ... We want Monday as first column, so we adjust accordingly.
    // The provided weekdays order is: po(to)sr(če)pe(so)ne = Monday to Sunday
    // JS date: Sunday=0, Monday=1,... 
    // We'll shift so that Monday=0 for our grid.
    let startDay = firstDayOfMonth.getDay(); 
    // If Sunday=0 in JS, and we want Monday=0, we transform:
    // Monday=1 in JS, so newStartDay = (startDay+6)%7 would map Monday=1->0, Tuesday=2->1,...
    // Let's do that:
    startDay = (startDay + 6) % 7;

    // Create an array of empty slots for days before the first day of the month
    const emptySlots = Array.from({ length: startDay }, () => '');

    // Create an array for the days of the month
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Combine empty slots and month days
    this.days = [...emptySlots, ...monthDays];
  }

  prevMonth(): void {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  // Emits the selected date
  selectDate(day: number): void {
    // Format the date as YYYY-MM-DD (adjust as needed)
    const month = String(this.currentMonthIndex + 1).padStart(2, '0');
    const dateStr = `${this.currentYear}-${month}-${String(day).padStart(2, '0')}`;
    this.dateSelected.emit(dateStr);
  }

  isNumber(value: string | number): value is number {
    return typeof value === 'number';
  }
}
