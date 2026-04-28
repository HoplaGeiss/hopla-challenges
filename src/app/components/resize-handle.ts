import { Directive, ElementRef, input, OnInit, OnDestroy, inject } from '@angular/core';

type ResizeDirection = 'horizontal' | 'vertical';

@Directive({ selector: '[appResizeHandle]' })
export class ResizeHandle implements OnInit, OnDestroy {
  /** The panel whose size this handle controls (the one BEFORE the handle). */
  readonly panel = input.required<HTMLElement>();
  readonly direction = input<ResizeDirection>('horizontal');
  /** Minimum size in px */
  readonly min = input(120);
  /** Maximum size in px */
  readonly max = input(800);

  private el = inject(ElementRef<HTMLElement>);
  private dragging = false;
  private startPos = 0;
  private startSize = 0;

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    this.dragging = true;
    this.startPos = this.direction() === 'horizontal' ? e.clientX : e.clientY;
    this.startSize =
      this.direction() === 'horizontal'
        ? this.panel().offsetWidth
        : this.panel().offsetHeight;
    document.body.style.cursor = this.direction() === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    const delta =
      this.direction() === 'horizontal'
        ? e.clientX - this.startPos
        : e.clientY - this.startPos;
    const newSize = Math.min(this.max(), Math.max(this.min(), this.startSize + delta));
    if (this.direction() === 'horizontal') {
      this.panel().style.width = `${newSize}px`;
      this.panel().style.flex = 'none';
    } else {
      this.panel().style.height = `${newSize}px`;
      this.panel().style.flex = 'none';
    }
  };

  private onMouseUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy(): void {
    const host = this.el.nativeElement;
    host.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
