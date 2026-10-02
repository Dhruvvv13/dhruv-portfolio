import * as React from 'react';
import {
  SiCplusplus,
  SiJavascript,
  SiMongodb,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiRaspberrypi,
  SiOpencv,
  SiNumpy,
  SiPandas,
  SiJupyter,
  SiGit,
} from 'react-icons/si';
import { ChartSpline } from 'lucide-react';
import { PythonLogo } from '@/components/icons/python-logo';

// react-icons ships its own (structurally close but not identical) prop
// type per icon; LogoCloudSwap just wants an SVG-props component, so
// normalize once here instead of casting at every entry below.
type SvgIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
const asIcon = (Icon: React.ComponentType<{ className?: string }>): SvgIcon =>
  Icon as unknown as SvgIcon;

export interface LogoDef {
  Icon: SvgIcon;
  name: string;
  /** Omit for icons (like Python's) that already draw their own colors. */
  color?: string;
}

// Not part of the original component paste (which imports LOGOS but never
// defines it) — this project's skill set, as local icon components (not
// simpleicons.org's CDN) so the section has no runtime network dependency.
// Colors are each tool's real brand color.
export const LOGOS: LogoDef[] = [
  { Icon: asIcon(PythonLogo), name: 'Python' }, // real two-tone logo, draws its own colors
  { Icon: asIcon(SiCplusplus), name: 'C++', color: '#00599C' },
  { Icon: asIcon(SiJavascript), name: 'JavaScript', color: '#F7DF1E' },
  { Icon: asIcon(SiMongodb), name: 'MongoDB', color: '#47A248' },
  { Icon: asIcon(SiPytorch), name: 'PyTorch', color: '#EE4C2C' },
  { Icon: asIcon(SiTensorflow), name: 'TensorFlow', color: '#FF6F00' },
  { Icon: asIcon(SiScikitlearn), name: 'scikit-learn', color: '#F7931E' },
  { Icon: asIcon(SiRaspberrypi), name: 'Raspberry Pi', color: '#C51A4A' },
  { Icon: asIcon(SiOpencv), name: 'OpenCV', color: '#5C3EE8' },
  { Icon: asIcon(SiNumpy), name: 'NumPy', color: '#4DABCF' }, // real brand navy (#013243) is unreadable on a dark card
  { Icon: asIcon(SiPandas), name: 'Pandas', color: '#8C6FE0' }, // same issue with the real deep purple (#150458)
  { Icon: asIcon(ChartSpline), name: 'Matplotlib', color: '#4C72B0' }, // no Matplotlib logo anywhere
  { Icon: asIcon(SiJupyter), name: 'Jupyter', color: '#F37626' },
  { Icon: asIcon(SiGit), name: 'Git', color: '#F05032' },
];
