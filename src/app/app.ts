import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../shared/components/navbar/navbar.component";
import { AiAssistantComponent } from "../shared/components/ai-assistant/ai-assistant.component";
import { BookingModalComponent } from "../shared/components/booking-modal/booking-modal.component";
import { AppLoaderComponent } from "../shared/components/app-loader/app-loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AiAssistantComponent, BookingModalComponent, AppLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tamkeenova-hub_anguler');
}
