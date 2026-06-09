import React from 'react';

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    label?: string;      // Ký tự hiển thị (mặc định là 'N')
    size?: 'sm' | 'md' | 'lg'; // Các kích thước định sẵn
}

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
    ({ label = 'N', size = 'md', className = '', ...props }, ref) => {

        // Mapping kích thước cho container bên ngoài và box bên trong
        const sizeClasses = {
            sm: { container: 'min-h-8', box: 'h-7 w-7 text-lg' },
            md: { container: 'min-h-12', box: 'h-9 w-9 text-xl' },
            lg: { container: 'min-h-16', box: 'h-12 w-12 text-2xl' },
        };

        const currentSize = sizeClasses[size];

        return (
            <a
                ref={ref}
                href="/"
                aria-label="Go to homepage"
                className={`inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-opacity hover:opacity-90 ${currentSize.container} ${className}`}
                {...props}
            >
                {/* Thêm lớp shadow vào div bọc ngoài logo */}
                <div className={`flex items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xl/20 dark:shadow-white/30 ${currentSize.box}`}>
                    <span className="font-mono font-bold leading-none">
                        {label}
                    </span>
                </div>
            </a>
        );
    }
);

Logo.displayName = 'Logo';

export default Logo;