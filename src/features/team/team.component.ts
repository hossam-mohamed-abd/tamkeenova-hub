import { Component, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TrainerCardComponent } from '../../shared/components/trainer-card/trainer-card.component';
import { TrainersService } from '../../core/services/trainers.service';
import { Trainer } from '../../core/models/trainer.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [PageHeaderComponent, TrainerCardComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {
  trainers = signal<Trainer[]>([]);

  constructor(private trainersService: TrainersService) {}

  ngOnInit(): void {
    this.trainers.set(this.trainersService.getAll());
  }
}