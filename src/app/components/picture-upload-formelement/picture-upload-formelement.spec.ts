import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUploadFormelement } from './picture-upload-formelement';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JobImageService } from '../../service/job-image.service';
import { of } from 'rxjs';
import ImageWithId from '../../model/image-with-id';

describe('PictureUploadFormelement', () => {
  let component: PictureUploadFormelement;
  let fixture: ComponentFixture<PictureUploadFormelement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureUploadFormelement],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PictureUploadFormelement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle multiple image uploads', async () => {
    const uploadImageSpy = spyOn(TestBed.inject(JobImageService), 'uploadImage').and.returnValues(
      of(123),
      of(124),
    );
    spyOn(component, 'toBase64').and.returnValues(
      Promise.resolve('data:image/png;base64,ZmFrZQ=='),
      Promise.resolve('data:image/png;base64,ZmFrZZ=='),
    );

    const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const firstFile = new File(['first-image-content'], 'first-image.png', { type: 'image/png' });
    const secondFile = new File(['second-image-content'], 'second-image.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [firstFile],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(uploadImageSpy).toHaveBeenCalledWith(firstFile);
    let images = fixture.nativeElement.querySelectorAll('img.photo');
    expect(images.length).toBe(1);
    expect(images[0].getAttribute('src')).toBe('data:image/png;base64,ZmFrZQ==');

    Object.defineProperty(fileInput, 'files', {
      value: [secondFile],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(uploadImageSpy).toHaveBeenCalledTimes(2);
    expect(uploadImageSpy.calls.argsFor(1)[0]).toBe(secondFile);
    images = fixture.nativeElement.querySelectorAll('img.photo');
    expect(images.length).toBe(2);
    expect(images[0].getAttribute('src')).toBe('data:image/png;base64,ZmFrZQ==');
    expect(images[1].getAttribute('src')).toBe('data:image/png;base64,ZmFrZZ==');
  });
  it('should delete images when clicked', async () => {
    spyOn(TestBed.inject(JobImageService), 'deleteImage').and.returnValue(of(void 0));
    const imageArray = [] as ImageWithId[];
    imageArray.push(new ImageWithId(123, 'data:image/png;base64,ZmFrZQ=='));
    imageArray.push(new ImageWithId(321, 'data:image/png;base64,ZmFrZZ=='));
    component.writeValue(imageArray);
    fixture.detectChanges();

    const images = fixture.nativeElement.querySelectorAll('img.photo');
    expect(images.length).toBe(2);
    images[1].dispatchEvent(new Event('click'));
    const idToDelete = imageArray.find((img) => img.base64 === images[1].getAttribute('src'))?.id;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(TestBed.inject(JobImageService).deleteImage).toHaveBeenCalledWith(idToDelete!);
    const imagesAfterDelete = fixture.nativeElement.querySelectorAll('img.photo');
    expect(imagesAfterDelete.length).toBe(1);
  });
});
