import {
  Flex,
  Text,
  HStack,
  Select,
  ButtonGroup,
  IconButton,
  Icon,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";
import { useRef, useEffect } from "react";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 36, 48, 96],
}: PaginationControlProps) => {
  const { t } = useTranslation();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeColor = "brand.primary";

  // 跟踪页面更改的ref
  const pageChangeRef = useRef<number | null>(null);

  // 当页面更改时使用useEffect来滚动
  useEffect(() => {
    if (pageChangeRef.current !== null) {
      // 立即滚动到顶部
      window.scrollTo(0, 0);
      // 重置ref
      pageChangeRef.current = null;
    }
  }, [currentPage, pageSize]);

  // 处理分页点击并确保滚动到顶部
  const handlePageClick = (newPage: number) => {
    // 设置标记，表示页面已更改
    pageChangeRef.current = newPage;

    // 首先尝试立即滚动到顶部
    window.scrollTo(0, 0);

    // 调用父组件的回调
    onPageChange(newPage);

    // 使用多个setTimeout确保在不同时间点尝试滚动，覆盖各种可能的数据加载和渲染时机
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 300);

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 500);
  };

  // 处理每页数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 设置标记，表示页面大小已更改
    pageChangeRef.current = 0;

    // 调用父组件的回调
    onPageSizeChange(newSize);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <Flex
      justifyContent="center"
      my={4}
      mt={8}
      gap={{ base: 0, md: 4 }}
      flexWrap="wrap"
      alignItems="center"
    >
      <Button
        variant="unstyled"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        isDisabled={currentPage === 1}
        fontSize="sm"
        size={{ base: "sm", md: "md" }}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <FaChevronLeft />
        Prev
      </Button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <IconButton
            key={`ellipsis-${idx}`}
            icon={<FaEllipsisH />}
            variant="unstyled"
            aria-label="More pages"
            isDisabled
            fontSize="sm"
            size={{ base: "sm", md: "md" }}
          />
        ) : (
          <Button
            key={`page-${page}`}
            variant="unstyled"
            bg={page === currentPage ? "#F4F4F6" : ""}
            onClick={() => onPageChange(Number(page))}
            fontSize="sm"
            size={{ base: "sm", md: "md" }}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="unstyled"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        isDisabled={currentPage === totalPages}
        fontSize="sm"
        size={{ base: "sm", md: "md" }}
        display="flex"
        alignItems="center"
        gap={1}
      >
        Next
        <FaChevronRight />
      </Button>
    </Flex>
  );
};

export default PaginationControl;
