import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, message?: string) {
  return NextResponse.json({
    ok: true,
    message,
    data,
  });
}

export function apiError(error: unknown, fallback = "Có lỗi xảy ra. Vui lòng thử lại.") {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        message: "Dữ liệu chưa hợp lệ.",
        issues: error.flatten(),
      },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || fallback,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      message: fallback,
    },
    { status: 500 },
  );
}
