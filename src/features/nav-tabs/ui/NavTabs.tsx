import { SvgIcon, Tab, Tabs } from '@mui/material';
import type { FC } from 'react';
import { ReactComponent as rdmIcon } from '../../../shared/images/icons/rdm.svg';
import { ReactComponent as spectrumIcon } from '../../../shared/images/icons/spectrum.svg';
import { getRouteMain, getRouteSpectrum, useRoutes } from '../../../shared/lib/routes';
import './NavTabs.css';

const tabsData = [
    {
        iconComponent: rdmIcon,
        route: getRouteMain,
        value: '#/rdm',
        label: 'РДС'
    },
    {
        iconComponent: spectrumIcon,
        route: getRouteSpectrum,
        value: '#/spectrum',
        label: 'Спектр'
    }
];

const NavTabs: FC = () => {
    const { to, path } = useRoutes();

    return (
        <Tabs className="nav-tabs" value={path} TabIndicatorProps={{ hidden: true }} sx={{ pt: 0.875, ml: 1 }}>
            {tabsData.map(({ label, route, iconComponent, ...rest }) => (
                <Tab
                    key={label}
                    icon={<SvgIcon component={iconComponent}/>}
                    iconPosition="start"
                    onClick={() => to(route())}
                    label={label}
                    {...rest}
                />
            ))}
        </Tabs>
    );
};

export default NavTabs;
