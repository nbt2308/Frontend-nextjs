
import { Home, BookOpen, Newspaper, Tag, Info } from "lucide-react"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Logo from "../ui/logo";
export default function Footer() {
    const serviceLinks = ["Web Development", "Pricing", "Support", "Client Portal", "Resources"];
    const platformLinks = ["Hubspot", "Integration Services", "Marketing Glossar", "UIPath", "Marketo Integration"];
    const legals = [
        {
            title: "Terms",
            path: "/terms"
        },
        {
            title: "Privacy",
            path: "/privacy"
        }
    ]
    const socialLinks = [
        {
            label: "Facebook",
            path: "M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761z", viewBox: "0 0 155.139 155.139",
            bgColor: "bg-blue-600"
        },

        {
            label: "Github",
            path: "M409.132 114.573q-29.41-50.392-79.798-79.8C295.736 15.166 259.057 5.365 219.271 5.365c-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8Q0 164.966 0 224.63c0 47.78 13.94 90.745 41.827 128.906q41.827 57.245 108.063 79.227c5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562q0-.855-.144-15.417a2550 2550 0 0 1-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999q-10.28-1.848-19.13-8.559c-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559q-6.139-7.995-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429q-1.712-1.996-2.568-3.997-.86-2.002 1.427-3.289c1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851q8.42 5.71 13.846 14.842c4.38 7.806 9.657 13.754 15.846 17.847q9.277 6.138 18.699 6.136 9.42-.001 16.274-1.423 6.848-1.43 12.847-4.285 2.57-19.135 13.988-29.41c-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979q-5.852-18.56-5.852-42.826c0-23.035 7.52-42.637 22.557-58.817q-10.566-25.977 1.997-58.24c5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994s9.089 5.618 12.135 7.708q26.556-7.42 54.818-7.421c28.262-.001 37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979q-9.286 11.282-23.131 18.986c-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146q14.841 12.845 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995q66.244-21.98 108.068-79.226c27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049",
            viewBox: "0 0 438.549 438.549",
            bgColor: "bg-zinc-600"
        },
    ];
    const menuItems = [
        {
            title: "Trang chủ",
            href: "/",
            icon: Home,
        },
        {
            title: "Khóa Học",
            href: "/course",
            icon: BookOpen,
        },
        {
            title: "Bài viết",
            href: "/posts",
            icon: Newspaper,
        },
        {
            title: "Tags",
            href: "/tags",
            icon: Tag,
        },
        {
            title: "Về chúng tôi",
            href: "/about",
            icon: Info,
        },
    ]
    return (
        <footer className="w-full z-50 transition-colors duration-300">
            <div className="container mx-auto my-8 px-6 md:px-10">
                <hr className="border-slate-200 dark:border-slate-800" />
            </div>


            <div className="container mx-auto dark:text-white px-6 md:px-10 my-3 ">
                <div className="grid min-[1200px]:grid-cols-3 gap-12 xl:gap-16 justify-between">
                    {/* Brand & Contact Section */}
                    <div className="min-[1200px]:max-w-md max-w-lg w-full">
                        <Logo></Logo>

                        <div className="space-y-3 text-sm mt-6">
                            {/* gioi thieu */}
                            <span className="font-bold text-lg">Cùng nhau học tập và phát triển bản thân</span>
                            <br />
                            <span className="text-justify text-wrap dark:text-slate-300">NevaGiveup là nền tảng học tập và chia sẻ kiến thức công nghệ hàng đầu. Chúng tôi cung cấp các khóa học chất lượng, cập nhật nhanh chóng xu hướng công nghệ mới, đồng thời là không gian hỏi đáp, kết nối và giải quyết mọi bài toán kỹ thuật cùng cộng đồng.</span>
                        </div>

                        <ul className="flex flex-wrap gap-6 mt-6">
                            {socialLinks.map((social) => (
                                <li key={social.label}>
                                    <a href="#" aria-label={social.label} className={`flex items-center w-8 h-8 p-2 rounded-md ${social.bgColor} transition-transform duration-200 hover:-translate-y-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
                                        <svg className="size-full fill-slate-50" viewBox={social.viewBox} aria-hidden="true">
                                            <path d={social.path} />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">
                            Liên kết
                        </h2>
                        <ul className="my-2 space-y-4 text-sm font-normal">
                            {menuItems.map((link) => (
                                <li key={link.title}>
                                    <a href={link.href} className="hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-all">
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Links & Newsletter Section */}
                    <div className="space-y-6 max-lg:col-span-full max-w-md">
                        <div>
                            <h3 className="text-black dark:text-white text-sm font-semibold mb-6">Kết Nối Cùng NevaGiveup</h3>
                            <p className="text-zinc-700 dark:text-white text-sm leading-relaxed">Để lại email của bạn để luôn đi đầu trong thế giới công nghệ với các bài viết chia sẻ, giải đáp và khóa học chất lượng cao.</p>
                        </div>

                        <form className="flex gap-2">
                            <Input type="email" placeholder="Enter your email" required />
                            <Button type="submit" className="h-10">Gửi</Button>
                        </form>
                    </div>

                </div>

                <hr className="my-8 border-slate-200 dark:border-slate-800" />

                {/* Bottom Legal Section */}
                <div className="flex flex-wrap gap-4 flex-col md:flex-row items-center md:justify-between">
                    <ul className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 font-normal">
                        {legals.map((legal) => (
                            <li key={legal.title}>
                                <a href={legal.path} className="hover:text-black dark:hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">{legal.title}</a>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm">© 2026 NevaGiveup. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}