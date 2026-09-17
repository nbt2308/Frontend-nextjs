import React from "react";
import { Search, Star, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseReviewFilterProps {
  filters: CourseUserReviewQueryParams;
  onFiltersChange: (filters: CourseUserReviewQueryParams) => void;
}

export function CourseReviewFilter({ filters, onFiltersChange }: CourseReviewFilterProps) {
  const ratingFilter = filters.rating?.toString() ?? "all";
  const sortOrder = filters.sortOrder === "asc" ? "oldest" : filters.sortOrder === "desc" ? "newest" : "newest";
  const searchQuery = filters.search ?? "";

  const isFiltered =
    searchQuery !== "" ||
    filters.rating !== undefined ||
    filters.sortOrder !== "desc";

  const handleSearch = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 1 });
  };

  const handleRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      rating: value === "all" ? undefined : Number(value),
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: value === "oldest" ? "asc" : "desc",
      page: 1,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortOrder: "desc",
      search: "",
      rating: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Thanh công cụ Bộ lọc (Filter Toolbar) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">

        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đánh giá hoặc tên người dùng..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Filter Sắp Xếp */}
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>

          {/* Nút Xóa Bộ Lọc */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetFilters}
              title="Xóa bộ lọc"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Nút Chọn Nhanh Số Sao (Rating Quick Badges) */}
      <div className="flex flex-wrap gap-2 pt-1">
        {["all", "5", "4", "3", "2", "1"].map((star) => (
          <Button
            key={star}
            variant={ratingFilter === star ? "default" : "outline"}
            size="sm"
            onClick={() => handleRatingChange(star)}
            className="h-8 text-xs font-normal"
          >
            {star === "all" ? (
              "Tất cả"
            ) : (
              <span className="flex items-center gap-1">
                {star} <Star className="size-3 fill-current text-amber-500 border-none" />
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}