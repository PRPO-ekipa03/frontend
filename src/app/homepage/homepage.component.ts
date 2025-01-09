import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';  // Import RouterModule

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private navbar: HTMLElement | null = null;
  private scrollListener!: () => void; // Fixed with non-null assertion

  ngOnInit(): void {
    // Select the navbar element
    this.navbar = document.querySelector('.navbar');

    // Define the scroll listener
    this.scrollListener = () => {
      if (window.scrollY > 50) {
        this.navbar?.classList.add('scrolled'); // Add 'scrolled' class
      } else {
        this.navbar?.classList.remove('scrolled'); // Remove 'scrolled' class
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    // Cleanup: Remove the event listener
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
