import React from 'react';

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    label?: string;      // Ký tự hiển thị (mặc định là 'N')
    size?: 'sm' | 'md' | 'lg'; // Các kích thước định sẵn
    asDiv?: boolean;
}

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
    ({ label = 'N', size = 'md', className = '', asDiv = false, ...props }, ref) => {

        // Mapping kích thước cho container bên ngoài và box bên trong
        const sizeClasses = {
            sm: { container: 'min-h-8', box: 'h-7 w-7 text-lg' },
            md: { container: 'min-h-12', box: 'h-9 w-9 text-xl' },
            lg: { container: 'min-h-16', box: 'h-12 w-12 text-2xl' },
        };

        const currentSize = sizeClasses[size];
        const content = (
            <div
                className={`flex items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md ${currentSize.box} shrink-0`}
            >
                <span className="font-mono font-bold leading-none">
                    {label}
                </span>
            </div>
        );

        // Nếu truyền asDiv=true, chỉ render phần Box Logo để lồng vào các nút khác
        if (asDiv) {
            return <div className={`inline-flex items-center justify-center ${className}`}>{content}</div>;
        }
        return (
            <a
                ref={ref}
                href="/"
                aria-label="Go to homepage"
                className={`inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-opacity hover:opacity-90 ${currentSize.container} ${className}`}
                {...props}
            >
                {content}
            </a>
        );
    }
);

Logo.displayName = 'Logo';

export default Logo;