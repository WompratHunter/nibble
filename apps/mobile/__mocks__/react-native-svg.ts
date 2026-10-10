/**
 * Manual mock for react-native-svg.
 *
 * Prevents native module crashes in Jest. All SVG components are replaced with
 * plain React Native Views so tests can render components that import lucide-
 * react-native or react-native-svg without errors.
 */
import React from 'react';
import { View } from 'react-native';

const Svg = (props: Record<string, unknown>) => React.createElement(View, props);
const Path = () => null;
const Circle = () => null;
const Rect = () => null;
const G = (props: Record<string, unknown>) => React.createElement(View, props);
const Line = () => null;
const Polyline = () => null;
const Polygon = () => null;
const Text = () => null;
const TSpan = () => null;
const TextPath = () => null;
const Use = () => null;
const Image = () => null;
const Symbol = () => null;
const Defs = () => null;
const LinearGradient = () => null;
const RadialGradient = () => null;
const Stop = () => null;
const ClipPath = () => null;
const Pattern = () => null;
const Mask = () => null;

module.exports = {
  default: Svg,
  Svg,
  Path,
  Circle,
  Rect,
  G,
  Line,
  Polyline,
  Polygon,
  Text,
  TSpan,
  TextPath,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
};
