import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';

@Injectable({
  providedIn: 'root',
})
export class JobImageService {
  private readonly apiService = inject(ApiService);

  loadImage(id: number) {
    return this.apiService.getBlob(
      `/jobimage/${id}`,
      new ErrorMessage(
        $localize`:@@jobImageService.imageLoadFailedTitle:Image load failed`,
        $localize`:@@jobImageService.imageLoadFailed:Could not load image.`,
      ),
    );
  }

  loadThumbnail(id: number) {
    return this.apiService.getBlob(
      `/jobimage/${id}/thumbnail`,
      new ErrorMessage(
        $localize`:@@jobImageService.thumbnailLoadFailedTitle:Thumbnail load failed`,
        $localize`:@@jobImageService.thumbnailLoadFailed:Could not load thumbnail.`,
      ),
    );
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiService.postReq<number>(
      `/jobimage`,
      new ErrorMessage(
        $localize`:@@jobImageService.uploadFailedTitle:Image upload failed`,
        $localize`:@@jobImageService.uploadFailed:Could not upload the selected image.`,
      ),
      formData,
    );
  }

  deleteImage(id: number) {
    return this.apiService.deleteReq(
      `/jobimage/${id}`,
      new ErrorMessage(
        $localize`:@@jobImageService.deleteFailedTitle:Image delete failed`,
        $localize`:@@jobImageService.deleteFailed:Could not delete the selected image.`,
      ),
    );
  }
}
