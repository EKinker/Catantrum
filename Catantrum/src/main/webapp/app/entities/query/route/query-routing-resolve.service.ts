import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuery } from '../query.model';
import { QueryService } from '../service/query.service';

@Injectable({ providedIn: 'root' })
export class QueryRoutingResolveService implements Resolve<IQuery | null> {
  constructor(protected service: QueryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuery | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((query: HttpResponse<IQuery>) => {
          if (query.body) {
            return of(query.body);
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
