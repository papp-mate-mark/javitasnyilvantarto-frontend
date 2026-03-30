import Sort from './sort';

export default class Pageable {
  constructor(public page = 0, public size = 20, public sort?: Sort[]) {}
}

export interface SpringPageableParams {
  page: string;
  size: string;
  sort?: string | string[];
}

export function toPageableParams(pageable: Pageable): SpringPageableParams {
  const params: SpringPageableParams = {
    page: pageable.page.toString(),
    size: pageable.size.toString(),
  };

  if (pageable.sort && pageable.sort.length > 0) {
    params.sort = pageable.sort.map((s) => `${s.property},${s.direction}`);
  }

  return params;
}
