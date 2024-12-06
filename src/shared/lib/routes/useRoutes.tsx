import { useCallback, useEffect, useState } from 'react';
import { getRouteMain } from './paths';

const getPath = () => (window.location.hash ? window.location.hash : getRouteMain());
// в карте используется роутинг, который конфликтует с react-router-dom. Поэтому так
export const useRoutes = () => {
    const [path, setPath] = useState<string>(getPath());

    const to = useCallback(
        (path: string) => {
            window.location.hash = path;
            window.history.replaceState(null, '', path);
        },
        [setPath]
    );

    useEffect(() => {
        const changeHash = () => {
            setPath(getPath());
        };

        window.addEventListener('hashchange', changeHash);
        window.addEventListener('popstate', changeHash);
        return () => {
            window.removeEventListener('hashchange', changeHash);
            window.removeEventListener('popstate', changeHash);
        };
    }, []);

    return { path, to };
};
