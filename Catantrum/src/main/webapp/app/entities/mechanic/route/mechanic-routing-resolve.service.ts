import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMechanic } from '../mechanic.model';
import { MechanicService } from '../service/mechanic.service';

@Injectable({ providedIn: 'root' })
export class MechanicRoutingResolveService implements Resolve<IMechanic | null> {
  constructor(protected service: MechanicService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMechanic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mechanic: HttpResponse<IMechanic>) => {
          if (mechanic.body) {
            return of(mechanic.body);
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
