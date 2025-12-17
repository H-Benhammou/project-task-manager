import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFirst: boolean;
    isLast: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isFirst, isLast }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max visible
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);
            
            if (currentPage > 2) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 3) {
                pages.push('...');
            }
            
            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages - 1);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirst}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFirst
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>
            </div>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`min-w-10 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {pageNum + 1}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLast}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isLast
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}