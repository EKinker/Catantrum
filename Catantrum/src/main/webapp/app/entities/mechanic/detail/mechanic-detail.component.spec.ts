import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MechanicDetailComponent } from './mechanic-detail.component';

describe('Mechanic Management Detail Component', () => {
  let comp: MechanicDetailComponent;
  let fixture: ComponentFixture<MechanicDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MechanicDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mechanic: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MechanicDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MechanicDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mechanic on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mechanic).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
