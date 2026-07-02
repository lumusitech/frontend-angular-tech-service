// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, input, model, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Skill } from '../../core/models/skill.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-skill-selector',
  imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatChipsModule, MatIconModule, FormsModule, TranslatePipe],
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
          [(ngModel)]="inputValue"
          (input)="searchInput.set(inputValue())"
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
  `
})
export class SkillSelectorComponent {
  readonly selectedSkills = model<Skill[]>(stryMutAct_9fa48("5016") ? ["Stryker was here"] : (stryCov_9fa48("5016"), []));
  readonly inputValue = signal(stryMutAct_9fa48("5017") ? "Stryker was here!" : (stryCov_9fa48("5017"), ''));
  readonly searchInput = signal(stryMutAct_9fa48("5018") ? "Stryker was here!" : (stryCov_9fa48("5018"), ''));
  readonly skillsResource = httpResource<PaginatedResponse<Skill>>(stryMutAct_9fa48("5019") ? () => undefined : (stryCov_9fa48("5019"), () => stryMutAct_9fa48("5020") ? {} : (stryCov_9fa48("5020"), {
    url: stryMutAct_9fa48("5021") ? "" : (stryCov_9fa48("5021"), '/api/skills'),
    params: stryMutAct_9fa48("5022") ? {} : (stryCov_9fa48("5022"), {
      limit: 50,
      ...(this.searchInput() ? stryMutAct_9fa48("5023") ? {} : (stryCov_9fa48("5023"), {
        search: this.searchInput()
      }) : {})
    })
  })));
  readonly filteredSkills = () => {
    if (stryMutAct_9fa48("5024")) {
      {}
    } else {
      stryCov_9fa48("5024");
      const all = stryMutAct_9fa48("5027") ? this.skillsResource.value()?.data && [] : stryMutAct_9fa48("5026") ? false : stryMutAct_9fa48("5025") ? true : (stryCov_9fa48("5025", "5026", "5027"), (stryMutAct_9fa48("5028") ? this.skillsResource.value().data : (stryCov_9fa48("5028"), this.skillsResource.value()?.data)) || (stryMutAct_9fa48("5029") ? ["Stryker was here"] : (stryCov_9fa48("5029"), [])));
      const selectedIds = new Set(this.selectedSkills().map(stryMutAct_9fa48("5030") ? () => undefined : (stryCov_9fa48("5030"), s => s.id)));
      return stryMutAct_9fa48("5031") ? all : (stryCov_9fa48("5031"), all.filter(stryMutAct_9fa48("5032") ? () => undefined : (stryCov_9fa48("5032"), s => stryMutAct_9fa48("5033") ? selectedIds.has(s.id) : (stryCov_9fa48("5033"), !selectedIds.has(s.id)))));
    }
  };
  onSkillSelected(event: any): void {
    if (stryMutAct_9fa48("5034")) {
      {}
    } else {
      stryCov_9fa48("5034");
      const name: string = event.option.value;
      const skill = stryMutAct_9fa48("5035") ? this.skillsResource.value().data.find(s => s.name === name) : (stryCov_9fa48("5035"), this.skillsResource.value()?.data.find(stryMutAct_9fa48("5036") ? () => undefined : (stryCov_9fa48("5036"), s => stryMutAct_9fa48("5039") ? s.name !== name : stryMutAct_9fa48("5038") ? false : stryMutAct_9fa48("5037") ? true : (stryCov_9fa48("5037", "5038", "5039"), s.name === name))));
      if (stryMutAct_9fa48("5042") ? skill || !this.selectedSkills().find(s => s.id === skill.id) : stryMutAct_9fa48("5041") ? false : stryMutAct_9fa48("5040") ? true : (stryCov_9fa48("5040", "5041", "5042"), skill && (stryMutAct_9fa48("5043") ? this.selectedSkills().find(s => s.id === skill.id) : (stryCov_9fa48("5043"), !this.selectedSkills().find(stryMutAct_9fa48("5044") ? () => undefined : (stryCov_9fa48("5044"), s => stryMutAct_9fa48("5047") ? s.id !== skill.id : stryMutAct_9fa48("5046") ? false : stryMutAct_9fa48("5045") ? true : (stryCov_9fa48("5045", "5046", "5047"), s.id === skill.id))))))) {
        if (stryMutAct_9fa48("5048")) {
          {}
        } else {
          stryCov_9fa48("5048");
          this.selectedSkills.update(stryMutAct_9fa48("5049") ? () => undefined : (stryCov_9fa48("5049"), prev => stryMutAct_9fa48("5050") ? [] : (stryCov_9fa48("5050"), [...prev, skill])));
        }
      }
      this.inputValue.set(stryMutAct_9fa48("5051") ? "Stryker was here!" : (stryCov_9fa48("5051"), ''));
      this.searchInput.set(stryMutAct_9fa48("5052") ? "Stryker was here!" : (stryCov_9fa48("5052"), ''));
    }
  }
  removeSkill(id: string): void {
    if (stryMutAct_9fa48("5053")) {
      {}
    } else {
      stryCov_9fa48("5053");
      this.selectedSkills.update(stryMutAct_9fa48("5054") ? () => undefined : (stryCov_9fa48("5054"), prev => stryMutAct_9fa48("5055") ? prev : (stryCov_9fa48("5055"), prev.filter(stryMutAct_9fa48("5056") ? () => undefined : (stryCov_9fa48("5056"), s => stryMutAct_9fa48("5059") ? s.id === id : stryMutAct_9fa48("5058") ? false : stryMutAct_9fa48("5057") ? true : (stryCov_9fa48("5057", "5058", "5059"), s.id !== id))))));
    }
  }
}