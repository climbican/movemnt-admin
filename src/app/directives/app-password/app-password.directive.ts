import { Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[appPassword]',
})
export class AppPasswordDirective {
  private _shown = false;
  constructor(private el: ElementRef) {
    this.setup();
  }
  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<ion-icon name="eye-off"></ion-icon>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<ion-icon name="eye"></ion-icon>';
    }
  }
  setup() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.innerHTML = `Show password`;
    span.addEventListener('click', (event) => {
      alert('you just clicked me, you need to toggle view');
    });
    parent.appendChild(span);
  }
}
