import { AppRoutes, AppRoutesProps, getRouteMain, getRouteSpectrum } from '../../../shared/lib/routes';
import { RDMPage } from '../../../pages/rdm';
import { SpectrumPage } from '../../../pages/spectrum';

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <RDMPage />
    },
    [AppRoutes.SPECTRUM]: {
        path: getRouteSpectrum(),
        element: <SpectrumPage />
    }
};
