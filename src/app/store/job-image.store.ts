import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface JobImageState {
  images: Map<number, string>;
  thumbnails: Map<number, string>;
  imagesLoading: Map<number, boolean>;
  thumbnailsLoading: Map<number, boolean>;
}

const initialState: JobImageState = {
  images: new Map<number, string>(),
  thumbnails: new Map<number, string>(),
  imagesLoading: new Map<number, boolean>(),
  thumbnailsLoading: new Map<number, boolean>(),
};

export const JobImageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    addImage(key: number, base64: string) {
      patchState(store, (state) => ({
        images: new Map(state.images).set(key, base64),
      }));
    },

    setImageLoading(id: number, loading: boolean) {
      patchState(store, (state) => ({
        imagesLoading: new Map(state.imagesLoading).set(id, loading),
      }));
    },

    addThumbnail(key: number, base64: string) {
      patchState(store, (state) => ({
        thumbnails: new Map(state.thumbnails).set(key, base64),
      }));
    },

    setThumbnailLoading(id: number, loading: boolean) {
      patchState(store, (state) => ({
        thumbnailsLoading: new Map(state.thumbnailsLoading).set(id, loading),
      }));
    },
  }))
);
