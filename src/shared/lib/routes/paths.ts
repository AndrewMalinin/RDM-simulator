export enum AppRoutes {
    MAIN = "main",
    SPECTRUM = "spectrum"
}

export const getRouteMain = () => "#/rdm";
export const getRouteSpectrum = () => "#/spectrum";

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteSpectrum()]: AppRoutes.SPECTRUM
};
