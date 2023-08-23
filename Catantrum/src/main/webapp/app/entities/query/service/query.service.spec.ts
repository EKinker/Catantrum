import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuery } from '../query.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../query.test-samples';

import { QueryService } from './query.service';

const requireRestSample: IQuery = {
  ...sampleWithRequiredData,
};

describe('Query Service', () => {
  let service: QueryService;
  let httpMock: HttpTestingController;
  let expectedResult: IQuery | IQuery[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(QueryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Query', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const query = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(query).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Query', () => {
      const query = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(query).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Query', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Query', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Query', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addQueryToCollectionIfMissing', () => {
      it('should add a Query to an empty array', () => {
        const query: IQuery = sampleWithRequiredData;
        expectedResult = service.addQueryToCollectionIfMissing([], query);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(query);
      });

      it('should not add a Query to an array that contains it', () => {
        const query: IQuery = sampleWithRequiredData;
        const queryCollection: IQuery[] = [
          {
            ...query,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addQueryToCollectionIfMissing(queryCollection, query);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Query to an array that doesn't contain it", () => {
        const query: IQuery = sampleWithRequiredData;
        const queryCollection: IQuery[] = [sampleWithPartialData];
        expectedResult = service.addQueryToCollectionIfMissing(queryCollection, query);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(query);
      });

      it('should add only unique Query to an array', () => {
        const queryArray: IQuery[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const queryCollection: IQuery[] = [sampleWithRequiredData];
        expectedResult = service.addQueryToCollectionIfMissing(queryCollection, ...queryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const query: IQuery = sampleWithRequiredData;
        const query2: IQuery = sampleWithPartialData;
        expectedResult = service.addQueryToCollectionIfMissing([], query, query2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(query);
        expect(expectedResult).toContain(query2);
      });

      it('should accept null and undefined values', () => {
        const query: IQuery = sampleWithRequiredData;
        expectedResult = service.addQueryToCollectionIfMissing([], null, query, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(query);
      });

      it('should return initial array if no Query is added', () => {
        const queryCollection: IQuery[] = [sampleWithRequiredData];
        expectedResult = service.addQueryToCollectionIfMissing(queryCollection, undefined, null);
        expect(expectedResult).toEqual(queryCollection);
      });
    });

    describe('compareQuery', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareQuery(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareQuery(entity1, entity2);
        const compareResult2 = service.compareQuery(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareQuery(entity1, entity2);
        const compareResult2 = service.compareQuery(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareQuery(entity1, entity2);
        const compareResult2 = service.compareQuery(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
