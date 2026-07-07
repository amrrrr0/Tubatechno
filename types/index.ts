import type { StaticImageData } from "next/image";

export interface FeatredCardProps {
    icon: StaticImageData;
    title: string;
    content: string;
    index: number;
}

export interface ButtonProps {
    styles?: string;
}

