import { Progress as ProgressBox, type ProgressProps } from "@chakra-ui/react";

export default function Progress({ ...props }: ProgressProps) {
  return (
    <ProgressBox
      flex="1"
      bg="#E7E3FC"
      sx={{
        // 进度条颜色
        "& > div:last-of-type": {
          bg: "brand.primary !important",
          transition: "width 0.5s ease-in-out",
        },
      }}
      _groupHover={{
        "& > div:last-of-type": {
          bg: "brand.600 !important",
        },
      }}
      {...props}
    />
  );
}
