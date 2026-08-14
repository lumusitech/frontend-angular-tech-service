import { Component, model, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Skill } from '../../core/models/skill.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-skill-selector',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{ 'users.skills' | translate }}</mat-label>
      <mat-chip-grid #chipGrid>
        @for (skill of selectedSkills(); track skill.id) {
          <mat-chip-row (removed)="removeSkill(skill.id)">
            {{ skill.name }}
            <button matChipRemove>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
        <input
          matInput
          [placeholder]="'users.skillsPlaceholder' | translate"
          [matChipInputFor]="chipGrid"
          [matAutocomplete]="auto"
          [value]="inputValue()"
          (input)="onInputChange($any($event).target.value)"
        />
      </mat-chip-grid>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSkillSelected($event)">
        @for (skill of filteredSkills(); track skill.id) {
          <mat-option [value]="skill.name">
            <div class="flex items-center gap-2">
              <span>{{ skill.name }}</span>
              @if (skill.category) {
                <span class="text-xs text-gray-400">({{ skill.category }})</span>
              }
            </div>
          </mat-option>
        }
        @if (filteredSkills().length === 0 && inputValue()) {
          <mat-option disabled>
            {{ 'users.noSkillsFound' | translate }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class SkillSelectorComponent {
  readonly selectedSkills = model<Skill[]>([]);

  readonly inputValue = signal('');
  readonly searchInput = signal('');

  readonly skillsResource = httpResource<PaginatedResponse<Skill>>(() => ({
    url: '/api/skills',
    params: {
      limit: 50,
      ...(this.searchInput() ? { search: this.searchInput() } : {}),
    },
  }));

  filteredSkills(): Skill[] {
    const all = this.skillsResource.value()?.data || [];
    const selectedIds = new Set(this.selectedSkills().map((s) => s.id));
    return all.filter((s) => !selectedIds.has(s.id));
  }

  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.searchInput.set(value);
  }

  onSkillSelected(event: MatAutocompleteSelectedEvent): void {
    const name: string = event.option.value;
    const skill = this.skillsResource.value()?.data.find((s) => s.name === name);
    if (skill && !this.selectedSkills().find((s) => s.id === skill.id)) {
      this.selectedSkills.update((prev) => [...prev, skill]);
    }
    this.inputValue.set('');
    this.searchInput.set('');
  }

  removeSkill(id: string): void {
    this.selectedSkills.update((prev) => prev.filter((s) => s.id !== id));
  }
}
