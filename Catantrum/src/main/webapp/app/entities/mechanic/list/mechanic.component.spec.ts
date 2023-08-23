import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MechanicService } from '../service/mechanic.service';

import { MechanicComponent } from './mechanic.component';

describe('Mechanic Management Component', () => {
  let comp: MechanicComponent;
  let fixture: ComponentFixture<MechanicComponent>;
  let service: MechanicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mechanic', component: MechanicComponent }]), HttpClientTestingModule],
      declarations: [MechanicComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MechanicComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MechanicComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MechanicService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.mechanics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mechanicService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMechanicIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMechanicIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
