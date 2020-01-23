import { Canvas } from "./canvas";
import { CoordinatesSystem } from "./coordinates-system";
import { CanvasMouseEvent, CanvasMouseClickListener } from "./mouse";
import { CanvasKeyboardEvent, CanvasKeydownEventListener } from "./keyboard";
import { Loadable, LoadablesLoading, isLoadable } from "./loadable";
import { Resolution } from "./resolution";

export abstract class Scene implements Loadable {
  private _canvas: Canvas | undefined;
  private _loadingLoadables: LoadablesLoading = LoadablesLoading.finished();

  constructor(private _resolution: Resolution) {
  }

  update(elapsedTime: number): void {
    // nothing here
  }

  clearScreen(): void {
    this.canvas.clearScreen();
  }

  draw(): void {
    // nothing here
  }

  onClick(event: CanvasMouseEvent): void {
    // nothing here
  }

  onKeydown(event: CanvasKeyboardEvent): void {
    // nothing here
  }

  load(): void {
    const propertyDescriptors = Object.getOwnPropertyDescriptors(this);
    const loadables = Object.values(propertyDescriptors)
      .map(property => property.value)
      .filter(isLoadable);

    this._loadingLoadables = new LoadablesLoading(loadables);
    this._loadingLoadables.load();
  }

  isLoading(): boolean {
    return this._loadingLoadables.isLoading();
  }

  hasFailedLoading(): boolean {
    return this._loadingLoadables.hasFailedLoading();
  }

  get failedLoadingLoadables(): Array<Loadable> {
    return this._loadingLoadables.failedLoadingLoadables;
  }

  set canvas(canvas: Canvas) {
    this._canvas = canvas;
    this._canvas.coordinatesSystem = new CoordinatesSystem(this._canvas, this._resolution);
    new CanvasMouseClickListener(this.canvas).on(this.onClick.bind(this));
    new CanvasKeydownEventListener(this.canvas).on(this.onKeydown.bind(this));
  }

  get canvas(): Canvas {
    if (!this._canvas) {
      throw new Error("Canvas is no available");
    }
    return this._canvas;
  }

  get resolution(): Resolution {
    return this._resolution;
  }
}
