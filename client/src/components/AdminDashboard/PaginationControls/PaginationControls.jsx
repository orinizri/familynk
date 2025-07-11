import React from "react";
import "./pagination_controls.css";

export default function PaginationControls({
  page,
  pageCount,
  onPageChange,
  className = "",
}) {
  if (pageCount <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < pageCount) onPageChange(page + 1);
  };

  const renderPageButtons = () => {
    return Array.from({ length: pageCount }, (_, i) => {
      const pageNum = i + 1;
      return (
        <button
          key={pageNum}
          className={`pagination-btn ${pageNum === page ? "active" : ""}`}
          onClick={() => onPageChange(pageNum)}
          disabled={pageNum === page}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className={`pagination-controls ${className}`}>
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="pagination-btn"
      >
        Previous
      </button>
      {renderPageButtons()}
      <button
        onClick={handleNext}
        disabled={page === pageCount}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
}
