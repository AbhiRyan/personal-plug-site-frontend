import { NumberType } from '../enums/numberType';

export interface AoProperties {
  value: number;
  sliderValue: number;
  min: number;
  max: number;
  type: NumberType;
  mult: number;
  label: string;
}
