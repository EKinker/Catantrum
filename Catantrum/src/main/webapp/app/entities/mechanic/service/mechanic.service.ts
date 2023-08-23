import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMechanic, NewMechanic } from '../mechanic.model';

export type PartialUpdateMechanic = Partial<IMechanic> & Pick<IMechanic, 'id'>;

export type EntityResponseType = HttpResponse<IMechanic>;
export type EntityArrayResponseType = HttpResponse<IMechanic[]>;

@Injectable({ providedIn: 'root' })
export class MechanicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mechanics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mechanic: NewMechanic): Observable<EntityResponseType> {
    return this.http.post<IMechanic>(this.resourceUrl, mechanic, { observe: 'response' });
  }

  update(mechanic: IMechanic): Observable<EntityResponseType> {
    return this.http.put<IMechanic>(`${this.resourceUrl}/${this.getMechanicIdentifier(mechanic)}`, mechanic, { observe: 'response' });
  }

  partialUpdate(mechanic: PartialUpdateMechanic): Observable<EntityResponseType> {
    return this.http.patch<IMechanic>(`${this.resourceUrl}/${this.getMechanicIdentifier(mechanic)}`, mechanic, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMechanic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMechanic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMechanicIdentifier(mechanic: Pick<IMechanic, 'id'>): number {
    return mechanic.id;
  }

  compareMechanic(o1: Pick<IMechanic, 'id'> | null, o2: Pick<IMechanic, 'id'> | null): boolean {
    return o1 && o2 ? this.getMechanicIdentifier(o1) === this.getMechanicIdentifier(o2) : o1 === o2;
  }

  addMechanicToCollectionIfMissing<Type extends Pick<IMechanic, 'id'>>(
    mechanicCollection: Type[],
    ...mechanicsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mechanics: Type[] = mechanicsToCheck.filter(isPresent);
    if (mechanics.length > 0) {
      const mechanicCollectionIdentifiers = mechanicCollection.map(mechanicItem => this.getMechanicIdentifier(mechanicItem)!);
      const mechanicsToAdd = mechanics.filter(mechanicItem => {
        const mechanicIdentifier = this.getMechanicIdentifier(mechanicItem);
        if (mechanicCollectionIdentifiers.includes(mechanicIdentifier)) {
          return false;
        }
        mechanicCollectionIdentifiers.push(mechanicIdentifier);
        return true;
      });
      return [...mechanicsToAdd, ...mechanicCollection];
    }
    return mechanicCollection;
  }
}
