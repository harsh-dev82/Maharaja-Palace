import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <div className="bg-cream border-b border-gold/20 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center text-sm text-gray-600">
                    <Link to="/" className="hover:text-gold transition-colors">
                        Home
                    </Link>
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

                        return (
                            <React.Fragment key={name}>
                                <span className="mx-2 text-gold">/</span>
                                {isLast ? (
                                    <span className="font-semibold text-gold">{displayName}</span>
                                ) : (
                                    <Link to={routeTo} className="hover:text-gold transition-colors">
                                        {displayName}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
