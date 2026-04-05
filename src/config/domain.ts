import type { Option } from "@/types";

export const productStatusOptions = [
  { value: "MOI", label: "Mới" },
  { value: "DANG_TEST", label: "Đang test" },
  { value: "DANG_CHAY", label: "Đang chạy" },
  { value: "THANG", label: "Thắng" },
  { value: "LOAI_BO", label: "Loại bỏ" },
] as const satisfies readonly Option<string>[];

export const trendTypeOptions = [
  { value: "HOOK", label: "Hook" },
  { value: "FORMAT", label: "Format" },
  { value: "SOUND", label: "Âm thanh" },
  { value: "GOC_NHIN", label: "Góc nhìn" },
  { value: "KICH_BAN", label: "Kịch bản" },
  { value: "CHUYEN_DOI", label: "Chuyển đổi" },
] as const satisfies readonly Option<string>[];

export const toneOptions = [
  { value: "THUC_TE", label: "Thực tế" },
  { value: "TINH_TE", label: "Tinh tế" },
  { value: "BAN_HANG_MEM", label: "Bán hàng mềm" },
  { value: "CHIA_SE", label: "Chia sẻ" },
  { value: "SO_SANH", label: "So sánh" },
  { value: "CANH_BAO", label: "Cảnh báo" },
] as const satisfies readonly Option<string>[];

export const goalOptions = [
  { value: "TANG_CLICK", label: "Tăng click" },
  { value: "TANG_DON", label: "Tăng đơn" },
  { value: "TANG_WATCH_TIME", label: "Tăng watch time" },
  { value: "TANG_TIN_CAY", label: "Tăng độ tin cậy" },
  { value: "RE_TEST", label: "Chuẩn bị re-test" },
] as const satisfies readonly Option<string>[];

export const videoStatusOptions = [
  { value: "NHAP", label: "Nháp" },
  { value: "DA_DANG", label: "Đã đăng" },
  { value: "THANG", label: "Thắng" },
  { value: "KHONG_HIEU_QUA", label: "Không hiệu quả" },
  { value: "TAM_DUNG", label: "Tạm dừng" },
] as const satisfies readonly Option<string>[];
