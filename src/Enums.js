import * as d3 from "d3";

export const Colors = {
  RED: "red",
  ROYAL_BLUE: "royal blue",
  ORANGE: "orange",
  VIOLET: "violet",
  TURQOISE: "turquoise",
  LIME_GREEN: "lime green"
};

export const ColorScales = {
  SPECTRAL: "spectral",
  MAGMA: "magma",
  CIVIDIS: "cividis",
  PLASMA: "plasma",
  WARM: "warm",
  COOL: "cool"
};

export function mapColorScaleToD3Interpolation(colorScale) {
  switch (colorScale) {
    case ColorScales.CIVIDIS:
      return d3.interpolateCividis;
    case ColorScales.COOL:
      return d3.interpolateCool;
    case ColorScales.MAGMA:
      return d3.interpolateMagma;
    case ColorScales.PLASMA:
      return d3.interpolatePlasma;
    case ColorScales.SPECTRAL:
      return d3.interpolateSpectral;
    case ColorScales.WARM:
      return d3.interpolateWarm;
  }
  return d3.interpolateSpectral;
}
