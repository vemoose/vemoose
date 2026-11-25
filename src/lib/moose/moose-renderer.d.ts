export interface MooseOptions {
  period?: number;
}

export function mountMoose(
  canvas: HTMLCanvasElement,
  options?: MooseOptions,
): () => void;