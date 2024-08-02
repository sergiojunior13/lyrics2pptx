export class UnitsConverter {
  static pxToPt(px: number) {
    return px * 0.75;
  }

  static pxToInches(px: number) {
    return px / 96;
  }
}
