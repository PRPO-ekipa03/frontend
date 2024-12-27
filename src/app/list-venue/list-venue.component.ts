import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-venue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-venue.component.html',
  styleUrls: ['./list-venue.component.css'],
})
export class ListVenueComponent {
  /**
   * Which step is currently open (1 through 5).
   * If null, no step is expanded.
   */
  openStep: number | null = null;

  /**
   * Tracks whether each step (index 0 => step 1, etc.) is completed (turn circle green).
   */
  stepsCompleted: boolean[] = [false, false, false, false, false];

  /**
   * Toggles the expansion of a given step.
   * If the step is already open, close it; otherwise close any other step and open this one.
   */
  toggleStep(step: number, contentEl: HTMLElement): void {
    if (this.openStep === step) {
      // We are CLOSING it
      this.collapse(contentEl);
      this.openStep = null;
    } else {
      // We are OPENING it
      // If there's another step open, collapse it first:
      if (this.openStep !== null) {
        const oldContent = document.querySelector(
          `.step-item[data-step="${this.openStep}"] .expanded-content`
        ) as HTMLElement;
        if (oldContent) this.collapse(oldContent);
        this.openStep=null;
      }
  
      this.openStep = step;
      this.expand(contentEl);
    }
  }

  expand(element: HTMLElement) {
    // 1) Remove any inline max-height to measure natural height
    element.style.maxHeight = 'none';
    
    // Force reflow by reading a layout property
    const fullHeight = element.scrollHeight + 'px';

    // 2) Re-set max-height to 0, so we can animate from 0 -> fullHeight
    element.style.maxHeight = '0';
    
    // 3) In the next frame, set the real height, so it transitions
    requestAnimationFrame(() => {
      element.style.transition = 'max-height 0.9s ease'; // match your CSS
      element.style.maxHeight = fullHeight;
    });
  }

  collapse(element: HTMLElement) {
    // 1) measure the current height
    const currentHeight = element.offsetHeight; // or scrollHeight

    // 2) set max-height to that height
    element.style.maxHeight = currentHeight + 'px';

    // 3) force reflow
    element.offsetHeight; // reading offsetHeight forces reflow

    // 4) next frame => set max-height to 0
    requestAnimationFrame(() => {
      element.style.transition = 'max-height 0.9s ease';
      element.style.maxHeight = '0';
    });
  }

  onStepItemClick(event: MouseEvent, step: number, contentEl: HTMLElement): void {
    // If not open => open it. If already open => do nothing.
    if (this.openStep !== step) {
      // If some other step was open, collapse it first
      if (this.openStep !== null) {
        const oldContent = document.querySelector(
          `.step-item[data-step="${this.openStep}"] .expanded-content`
        ) as HTMLElement;
        if (oldContent) this.collapse(oldContent);
      }
      // Now expand this step
      this.openStep = step;
      this.expand(contentEl);
    }
  }
  /**
   * Marks a step as completed (turns circle green), then closes it.
   */
  markCompleted(step: number, contentEl: HTMLElement): void {
    this.stepsCompleted[step - 1] = true;
    this.collapse(contentEl);
    this.openStep = null;
  }
}
