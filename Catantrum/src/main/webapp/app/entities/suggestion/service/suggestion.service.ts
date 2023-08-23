import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISuggestion, NewSuggestion } from '../suggestion.model';

export type PartialUpdateSuggestion = Partial<ISuggestion> & Pick<ISuggestion, 'id'>;

export type EntityResponseType = HttpResponse<ISuggestion>;
export type EntityArrayResponseType = HttpResponse<ISuggestion[]>;

@Injectable({ providedIn: 'root' })
export class SuggestionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/suggestions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(suggestion: NewSuggestion): Observable<EntityResponseType> {
    return this.http.post<ISuggestion>(this.resourceUrl, suggestion, { observe: 'response' });
  }

  update(suggestion: ISuggestion): Observable<EntityResponseType> {
    return this.http.put<ISuggestion>(`${this.resourceUrl}/${this.getSuggestionIdentifier(suggestion)}`, suggestion, {
      observe: 'response',
    });
  }

  partialUpdate(suggestion: PartialUpdateSuggestion): Observable<EntityResponseType> {
    return this.http.patch<ISuggestion>(`${this.resourceUrl}/${this.getSuggestionIdentifier(suggestion)}`, suggestion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISuggestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISuggestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSuggestionIdentifier(suggestion: Pick<ISuggestion, 'id'>): number {
    return suggestion.id;
  }

  compareSuggestion(o1: Pick<ISuggestion, 'id'> | null, o2: Pick<ISuggestion, 'id'> | null): boolean {
    return o1 && o2 ? this.getSuggestionIdentifier(o1) === this.getSuggestionIdentifier(o2) : o1 === o2;
  }

  addSuggestionToCollectionIfMissing<Type extends Pick<ISuggestion, 'id'>>(
    suggestionCollection: Type[],
    ...suggestionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const suggestions: Type[] = suggestionsToCheck.filter(isPresent);
    if (suggestions.length > 0) {
      const suggestionCollectionIdentifiers = suggestionCollection.map(suggestionItem => this.getSuggestionIdentifier(suggestionItem)!);
      const suggestionsToAdd = suggestions.filter(suggestionItem => {
        const suggestionIdentifier = this.getSuggestionIdentifier(suggestionItem);
        if (suggestionCollectionIdentifiers.includes(suggestionIdentifier)) {
          return false;
        }
        suggestionCollectionIdentifiers.push(suggestionIdentifier);
        return true;
      });
      return [...suggestionsToAdd, ...suggestionCollection];
    }
    return suggestionCollection;
  }
}
