import { FC, Fragment, memo, useCallback } from 'react';
import { AppRoutesProps, useRoutes } from '../../../shared/lib/routes';
import { routeConfig } from './config';

const AppRouter: FC = () => {
    const { path } = useRoutes();

    const routes = Object.values(routeConfig);
    const hasPage = routes.some((route) => route.path === path);

    const renderWithWrapper = useCallback(
        (route: AppRoutesProps) => {
            // TODO: Add pretty page
            const notFoundPage = <>PAGE NOT FOUND</>;
            const page = route.path === path ? route.element : null;

            return <Fragment key={route.path}>{hasPage ? page : notFoundPage}</Fragment>;
        },
        [path]
    );

    return routes.map(renderWithWrapper);
};

export default memo(AppRouter);
