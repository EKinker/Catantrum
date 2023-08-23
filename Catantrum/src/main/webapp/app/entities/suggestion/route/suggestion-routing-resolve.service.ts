import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISuggestion } from '../suggestion.model';
import { SuggestionService } from '../service/suggestion.service';

@Injectable({ providedIn: 'root' })
export class SuggestionRoutingResolveService implements Resolve<ISuggestion | null> {
  constructor(protected service: SuggestionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISuggestion | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((suggestion: HttpResponse<ISuggestion>) => {
          if (suggestion.body) {
            return of(suggestion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
