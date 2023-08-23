import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMechanic } from '../mechanic.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mechanic.test-samples';

import { MechanicService } from './mechanic.service';

const requireRestSample: IMechanic = {
  ...sampleWithRequiredData,
};

describe('Mechanic Service', () => {
  let service: MechanicService;
  let httpMock: HttpTestingController;
  let expectedResult: IMechanic | IMechanic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MechanicService);
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

    it('should create a Mechanic', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mechanic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mechanic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mechanic', () => {
      const mechanic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mechanic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mechanic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mechanic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mechanic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMechanicToCollectionIfMissing', () => {
      it('should add a Mechanic to an empty array', () => {
        const mechanic: IMechanic = sampleWithRequiredData;
        expectedResult = service.addMechanicToCollectionIfMissing([], mechanic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mechanic);
      });

      it('should not add a Mechanic to an array that contains it', () => {
        const mechanic: IMechanic = sampleWithRequiredData;
        const mechanicCollection: IMechanic[] = [
          {
            ...mechanic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMechanicToCollectionIfMissing(mechanicCollection, mechanic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mechanic to an array that doesn't contain it", () => {
        const mechanic: IMechanic = sampleWithRequiredData;
        const mechanicCollection: IMechanic[] = [sampleWithPartialData];
        expectedResult = service.addMechanicToCollectionIfMissing(mechanicCollection, mechanic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mechanic);
      });

      it('should add only unique Mechanic to an array', () => {
        const mechanicArray: IMechanic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mechanicCollection: IMechanic[] = [sampleWithRequiredData];
        expectedResult = service.addMechanicToCollectionIfMissing(mechanicCollection, ...mechanicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mechanic: IMechanic = sampleWithRequiredData;
        const mechanic2: IMechanic = sampleWithPartialData;
        expectedResult = service.addMechanicToCollectionIfMissing([], mechanic, mechanic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mechanic);
        expect(expectedResult).toContain(mechanic2);
      });

      it('should accept null and undefined values', () => {
        const mechanic: IMechanic = sampleWithRequiredData;
        expectedResult = service.addMechanicToCollectionIfMissing([], null, mechanic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mechanic);
      });

      it('should return initial array if no Mechanic is added', () => {
        const mechanicCollection: IMechanic[] = [sampleWithRequiredData];
        expectedResult = service.addMechanicToCollectionIfMissing(mechanicCollection, undefined, null);
        expect(expectedResult).toEqual(mechanicCollection);
      });
    });

    describe('compareMechanic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMechanic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMechanic(entity1, entity2);
        const compareResult2 = service.compareMechanic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMechanic(entity1, entity2);
        const compareResult2 = service.compareMechanic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMechanic(entity1, entity2);
        const compareResult2 = service.compareMechanic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
