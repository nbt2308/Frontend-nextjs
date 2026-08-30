"use client";

import { useState } from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas";
import { useAllTagsForUser } from "@/hooks/useTag";
import { TagType } from "@/types/generated-zod/schemas/models/Tag.schema";

// Shadcn UI primitives từ @/components/ui
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface CourseFilterProps {
    courses?: CourseForUser[];
    coursesPending?: boolean;
    filtersCount?: filtersCount;
    onFilterChange?: (filters: CourseFilterValues) => void;
}

export default function CourseFilterSidebar({
    courses = [],
    filtersCount = {},
    coursesPending = false,
    onFilterChange
}: CourseFilterProps) {
    const [search, setSearch] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
    const [selectedCourseType, setSelectedCourseType] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);

    const CourseType = CourseTypeSchema.enum;
    const Level = LevelSchema.enum;

    const levels = [
        { value: Level.BEGINNER, label: "Cơ bản" },
        { value: Level.INTERMEDIATE, label: "Trung cấp" },
        { value: Level.ADVANCED, label: "Nâng cao" },
    ];

    const types = [
        { value: CourseType.FREE, label: "Miễn phí" },
        { value: CourseType.PAID, label: "Trả phí" },
    ];

    const ratings = [
        { value: "4.5", label: "⭐ 4.5 trở lên" },
        { value: "4.0", label: "⭐ 4.0 trở lên" },
        { value: "3.0", label: "⭐ 3.0 trở lên" },
        { value: "2.0", label: "⭐ 2.0 trở lên" },
    ];

    const { data: tags, isPending: isTagPending } = useAllTagsForUser();

    const activeFiltersCount =
        (search ? 1 : 0) +
        selectedLevel.length +
        selectedCourseType.length +
        selectedTags.length +
        (selectedRating !== undefined ? 1 : 0);

    const buildFilters = (overrides: Partial<CourseFilterValues> = {}): CourseFilterValues => ({
        search: search || undefined,
        level: selectedLevel,
        courseType: selectedCourseType,
        tag: selectedTags,
        rating: selectedRating,
        ...overrides,
    });

    const handleLevelChange = (value: string) => {
        const newLevels = selectedLevel.includes(value)
            ? selectedLevel.filter((l) => l !== value)
            : [...selectedLevel, value];
        setSelectedLevel(newLevels);
        handleFilterChange(buildFilters({ level: newLevels }));
    };

    const handleCourseTypeChange = (value: string) => {
        const newTypes = selectedCourseType.includes(value)
            ? selectedCourseType.filter((t) => t !== value)
            : [...selectedCourseType, value];
        setSelectedCourseType(newTypes);
        handleFilterChange(buildFilters({ courseType: newTypes }));
    };

    const handleTagChange = (tagId: number) => {
        const newTags = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];
        setSelectedTags(newTags);
        handleFilterChange(buildFilters({ tag: newTags }));
    };

    const handleRatingChange = (value: string) => {
        const numValue = Number(value);
        const newRating = selectedRating === numValue ? undefined : numValue;
        setSelectedRating(newRating);
        handleFilterChange(buildFilters({ rating: newRating }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleFilterChange(buildFilters());
    };

    const handleFilterChange = (filters: CourseFilterValues) => {
        onFilterChange?.(filters);
    };

    const handleReset = () => {
        setSearch("");
        setSelectedLevel([]);
        setSelectedCourseType([]);
        setSelectedTags([]);
        setSelectedRating(undefined);
        handleFilterChange({ search: undefined, level: [], courseType: [], tag: [], rating: undefined });
    };

    return (
        <Sidebar
            side={"right"}
            className={`w-full border-r border-border/60 bg-sidebar lg:rounded-lg lg:overflow-hidden lg:static lg:inset-auto lg:h-auto lg:min-h-[calc(100vh-14rem)] lg:w-[var(--sidebar-width)]`}
        >
            {/* Header Sidebar */}
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />

                        <span>Bộ lọc</span>
                        {activeFiltersCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleReset}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Đặt lại
                    </Button>
                </div>
                <Separator className="mt-3 md:hidden" />
                <div className="md:hidden items-center text-md text-muted-foreground">
                    {coursesPending ? (
                        <Skeleton className="h-5 w-full rounded-md" />
                    ) : (
                        <span className="font-bold text-foreground text-center w-full p-3 flex items-center border rounded-lg">
                            📗 Hiển thị {courses.length} khóa học
                        </span>
                    )}
                </div>
            </SidebarHeader>

            {/* Content Sidebar */}
            <SidebarContent className="p-4 space-y-4">
                {/* Section Tìm kiếm */}
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="px-0 text-[11px] font-bold tracking-wider uppercase text-sidebar-foreground/70">
                        TÌM KIẾM
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-1.5">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Tìm khóa học..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-9 pr-8 h-9 text-sm bg-background border-input focus-visible:ring-1"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        handleFilterChange(buildFilters({ search: undefined }));
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Groups Accordion */}
                <Accordion
                    type="multiple"
                    defaultValue={["level", "course-type", "rating", "tag"]}
                    className="space-y-3"
                >
                    {/* Cấp độ */}
                    <AccordionItem value="level" className="border border-sidebar-border rounded-lg bg-sidebar-accent/30 px-3">
                        <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold text-sidebar-foreground">
                            <span>📊 CẤP ĐỘ</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            <div className="space-y-2">
                                {levels.map((level) => (
                                    <Label key={level.value} className="flex items-center gap-2.5 cursor-pointer group/item py-0.5">
                                        <Checkbox
                                            checked={selectedLevel.includes(level.value)}
                                            onCheckedChange={() => handleLevelChange(level.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-sidebar-foreground/80 group-hover/item:text-sidebar-foreground transition-colors">
                                            {level.label}
                                        </span>
                                        <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground border border-sidebar-border rounded-md group-hover/item:border-sidebar-ring transition-colors">
                                            {filtersCount.level?.[level.value] ?? 0}
                                        </span>
                                    </Label>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Loại khóa học */}
                    <AccordionItem value="course-type" className="border border-sidebar-border rounded-lg bg-sidebar-accent/30 px-3">
                        <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold text-sidebar-foreground">
                            <span>📚 LOẠI KHÓA HỌC</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            <div className="space-y-2">
                                {types.map((type) => (
                                    <Label key={type.value} className="flex items-center gap-2.5 cursor-pointer group/item py-0.5">
                                        <Checkbox
                                            checked={selectedCourseType.includes(type.value)}
                                            onCheckedChange={() => handleCourseTypeChange(type.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-sidebar-foreground/80 group-hover/item:text-sidebar-foreground transition-colors">
                                            {type.label}
                                        </span>
                                        <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground border border-sidebar-border rounded-md group-hover/item:border-sidebar-ring transition-colors">
                                            {filtersCount.courseType?.[type.value] ?? 0}
                                        </span>
                                    </Label>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Đánh giá */}
                    <AccordionItem value="rating" className="border border-sidebar-border rounded-lg bg-sidebar-accent/30 px-3">
                        <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold text-sidebar-foreground">
                            <span>⭐ ĐÁNH GIÁ</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            <RadioGroup
                                value={selectedRating !== undefined ? String(selectedRating) : ""}
                                onValueChange={handleRatingChange}
                                className="space-y-2"
                            >
                                {ratings.map((rating) => (
                                    <div key={rating.value} className="flex items-center gap-2.5 cursor-pointer group/item py-0.5">
                                        <RadioGroupItem value={rating.value} id={`rating-${rating.value}`} />
                                        <Label
                                            htmlFor={`rating-${rating.value}`}
                                            className="text-sm font-medium text-sidebar-foreground/80 group-hover/item:text-sidebar-foreground transition-colors cursor-pointer flex-1"
                                        >
                                            {rating.label}
                                        </Label>
                                        <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground border border-sidebar-border rounded-md group-hover/item:border-sidebar-ring transition-colors">
                                            {filtersCount.rating?.[rating.value] ?? 0}
                                        </span>
                                    </div>
                                ))}
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Tag */}
                    <AccordionItem value="tag" className="border border-sidebar-border rounded-lg bg-sidebar-accent/30 px-3">
                        <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold text-sidebar-foreground">
                            <span>🏷️ TAGS</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            {isTagPending ? (
                                <div className="space-y-2 py-1">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton key={index} className="h-5 w-full rounded" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {tags?.map((tag: TagType) => (
                                        <Label key={tag.id} className="flex items-center gap-2.5 cursor-pointer group/item py-0.5">
                                            <Checkbox
                                                checked={selectedTags.includes(tag.id)}
                                                onCheckedChange={() => handleTagChange(tag.id)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm font-medium text-sidebar-foreground/80 group-hover/item:text-sidebar-foreground transition-colors">
                                                {tag.name}
                                            </span>
                                        </Label>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarContent>
        </Sidebar>
    );
}