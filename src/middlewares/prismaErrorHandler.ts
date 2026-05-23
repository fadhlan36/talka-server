import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  // } from "../generated/prisma/internal/prismaNamespace";
} from "@prisma/client/runtime/client.js";

interface PrismaErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}

export const handlePrismaError = (
  error: PrismaClientKnownRequestError,
): PrismaErrorResponse | null => {
  switch (error.code) {
    case "P2002": {
      // Unique constraint violation
      const target = error.meta?.target as string[];
      const field = target?.[0] || "Field";
      return {
        statusCode: 409,
        message: `${field} sudah terdaftar`,
        details: "Data yang Anda masukkan sudah ada di database",
      };
    }

    case "P2025": {
      // Record not found (update/delete)
      return {
        statusCode: 404,
        message: "Data tidak ditemukan",
        details: "Data yang Anda cari tidak ada atau sudah dihapus",
      };
    }

    case "P2003": {
      // Foreign key constraint failed
      const field = error.meta?.field_name as string;
      return {
        statusCode: 400,
        message: "Relasi data tidak valid",
        details: field
          ? `${field} yang Anda masukkan tidak ditemukan`
          : "Data terkait tidak ditemukan",
      };
    }

    case "P2014": {
      // Invalid ID
      return {
        statusCode: 400,
        message: "ID tidak valid",
        details: "Format ID yang Anda masukkan salah",
      };
    }

    case "P2001": {
      // Record searched for not found (in relation)
      return {
        statusCode: 404,
        message: "Data relasi tidak ditemukan",
        details: "Data yang berhubungan tidak ada di database",
      };
    }

    case "P2015": {
      // Related record not found
      return {
        statusCode: 404,
        message: "Data terkait tidak ditemukan",
        details: "Data yang berhubungan tidak ada",
      };
    }

    case "P2021": {
      // Table does not exist
      return {
        statusCode: 500,
        message: "Kesalahan konfigurasi database",
        details: "Tabel database tidak ditemukan",
      };
    }

    case "P2022": {
      // Column does not exist
      return {
        statusCode: 500,
        message: "Kesalahan konfigurasi database",
        details: "Kolom database tidak ditemukan",
      };
    }

    default:
      return null; // Tidak dikenali, biarkan error handler utama yang handle
  }
};

export const isPrismaError = (
  error: unknown,
): error is PrismaClientKnownRequestError => {
  return error instanceof PrismaClientKnownRequestError;
};

export const isPrismaValidationError = (
  error: unknown,
): error is PrismaClientValidationError => {
  return error instanceof PrismaClientValidationError;
};
