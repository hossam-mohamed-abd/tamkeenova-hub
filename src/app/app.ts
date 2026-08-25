import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroSectionComponent } from "../features/home/components/hero-section/hero-section.component";
import { HomeComponent } from "../features/home/home.component";
import { NavbarComponent } from "../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroSectionComponent, HomeComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tamkeenova-hub_anguler');
}
