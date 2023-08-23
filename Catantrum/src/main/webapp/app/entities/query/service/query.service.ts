import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuery, NewQuery } from '../query.model';

export type PartialUpdateQuery = Partial<IQuery> & Pick<IQuery, 'id'>;

export type EntityResponseType = HttpResponse<IQuery>;
export type EntityArrayResponseType = HttpResponse<IQuery[]>;

@Injectable({ providedIn: 'root' })
export class QueryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/queries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(query: NewQuery): Observable<EntityResponseType> {
    return this.http.post<IQuery>(this.resourceUrl, query, { observe: 'response' });
  }

  update(query: IQuery): Observable<EntityResponseType> {
    return this.http.put<IQuery>(`${this.resourceUrl}/${this.getQueryIdentifier(query)}`, query, { observe: 'response' });
  }

  partialUpdate(query: PartialUpdateQuery): Observable<EntityResponseType> {
    return this.http.patch<IQuery>(`${this.resourceUrl}/${this.getQueryIdentifier(query)}`, query, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getQueryIdentifier(query: Pick<IQuery, 'id'>): number {
    return query.id;
  }

  compareQuery(o1: Pick<IQuery, 'id'> | null, o2: Pick<IQuery, 'id'> | null): boolean {
    return o1 && o2 ? this.getQueryIdentifier(o1) === this.getQueryIdentifier(o2) : o1 === o2;
  }

  addQueryToCollectionIfMissing<Type extends Pick<IQuery, 'id'>>(
    queryCollection: Type[],
    ...queriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const queries: Type[] = queriesToCheck.filter(isPresent);
    if (queries.length > 0) {
      const queryCollectionIdentifiers = queryCollection.map(queryItem => this.getQueryIdentifier(queryItem)!);
      const queriesToAdd = queries.filter(queryItem => {
        const queryIdentifier = this.getQueryIdentifier(queryItem);
        if (queryCollectionIdentifiers.includes(queryIdentifier)) {
          return false;
        }
        queryCollectionIdentifiers.push(queryIdentifier);
        return true;
      });
      return [...queriesToAdd, ...queryCollection];
    }
    return queryCollection;
  }
}
